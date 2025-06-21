import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/db"
import Application from "@/models/Application"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Application from "@/models/Application"
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
  portfolioUrls: z.array(z.string()).optional(),
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
  portfolioUrls: z.array(z.string()).optional(),
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    await connectDB()

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      userId: session.user.id,
      jobId: validatedData.jobId,
    })

    if (existingApplication) {
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
    console.error("Error submitting application:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid application data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}


/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get user's job applications
 *     tags: [Applications]
 *     security:
 *       - SessionAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewing, shortlisted, rejected, accepted]
 *         description: Filter by application status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of applications per page
 *     responses:
 *       200:
 *         description: List of user applications
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     applications:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Application'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Submit a job application
 *     tags: [Applications]
 *     security:
 *       - SessionAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - personalInfo
 *               - professionalBackground
 *               - applicationMaterials
 *             properties:
 *               jobId:
 *                 type: string
 *               personalInfo:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - email
 *                   - phone
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phone:
 *                     type: string
 *                   location:
 *                     type: string
 *               professionalBackground:
 *                 type: object
 *                 properties:
 *                   experienceLevel:
 *                     type: string
 *                   currentPosition:
 *                     type: string
 *                   education:
 *                     type: string
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *               applicationMaterials:
 *                 type: object
 *                 required:
 *                   - resumeUrl
 *                 properties:
 *                   resumeUrl:
 *                     type: string
 *                     format: uri
 *                   coverLetter:
 *                     type: string
 *                   portfolioUrls:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Validation error or duplicate application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */