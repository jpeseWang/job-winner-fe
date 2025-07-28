import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/db"
import Application from "@/models/Application"
import { UserRole, SubscriptionRole } from "@/types/enums"
import { getActiveSubscription, checkApplyPermission, incrementJobApplication } from "@/lib/subscription"
import { z } from "zod"

const applicationSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  location: z.string().min(2),
  currentPosition: z.string().optional(),
  experience: z.string(),
  expectedSalary: z.string().optional(),
  availableFrom: z.string().optional(),
  education: z.string(),
  skills: z.array(z.string()),
  resumeUrl: z.string(),
  coverLetter: z.string().min(50),
  portfolioUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  remoteWork: z.boolean().optional(),
  relocation: z.boolean().optional(),
  workAuthorization: z.boolean(),
  agreeToTerms: z.boolean(),
  appliedDate: z.string(),
})

// GET /api/applications - Get user's applications
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const jobId = searchParams.get("jobId")

    const query: any = { userId: session.user.id }

    if (status) query.status = status
    if (jobId) query.jobId = jobId

    const applications = await Application.find(query)
      .sort({ appliedDate: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Application.countDocuments(query)

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

// POST /api/applications - Submit new application
export async function POST(request: Request) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== UserRole.JOB_SEEKER) {
      console.warn("Unauthorized: user not job seeker or session missing")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await getActiveSubscription(session.user.id, SubscriptionRole.JOB_SEEKER)
    console.log("[POST /api/applications] Subscription:", subscription)
    const permission = checkApplyPermission(subscription)
    console.log("POST /api/applications] Permission Result:", permission)

    if (!permission.canApply) {
      return NextResponse.json({
        error: permission.reason
      }, { status: 403 })
    }

    const body = await request.json()
    console.log("[POST /api/applications] Request body:", body)

    const validatedData = applicationSchema.parse(body)
    console.log("[POST /api/applications] Validated data:", validatedData)

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      userId: session.user.id,
      jobId: validatedData.jobId,
    })

    if (existingApplication) {
      console.warn("User already applied for job:", validatedData.jobId)
      return NextResponse.json({ error: "You have already applied for this job" }, { status: 400 })
    }

    // Create new application
    const application = new Application({
      ...validatedData,
      userId: session.user.id,
      status: "pending",
      submittedAt: new Date(),
    })

    await application.save()
    console.log("Application submitted:", application._id)

    // Increment usageStats.jobApplications
    await incrementJobApplication(session.user.id, SubscriptionRole.JOB_SEEKER)

    // TODO: Send notification to employer
    // TODO: Send confirmation email to applicant

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: application._id,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Validation error:", error.format())
      return NextResponse.json({ error: "Invalid application data", details: error.errors }, { status: 400 })
    }

    console.error("❌ Error submitting application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}