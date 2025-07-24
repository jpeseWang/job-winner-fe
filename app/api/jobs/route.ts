import { NextResponse, NextRequest } from "next/server"
import { z } from "zod"
import Job from "@/models/Job"
import Company from "@/models/Company"
import dbConnect from "@/lib/db"
import { validateJob } from "@/utils/validators"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserRole, SubscriptionRole  } from "@/types/enums"
import { addDays } from "date-fns"
import {
  getActiveSubscription,
  checkPostingPermission,
  incrementJobPosting,
  getJobDurationForPlan,
} from "@/lib/subscription"
import { JobStatus, SubscriptionPlan } from "@/types/enums"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const {
      keyword,
      location,
      category,
      type,
      experienceLevel,
      page = "1",
      limit = "20",
      sort = "latest",
      recruiterId,
      status
    } = Object.fromEntries(req.nextUrl.searchParams)

    const query: any = {}

    if (keyword) query.$text = { $search: keyword }
    if (location) query.location = location
    if (category) query.category = { $in: category.split(",") }
    if (type) query.type = { $in: type.split(",") }
    if (experienceLevel) query.experienceLevel = { $in: experienceLevel.split(",") }
    if (status) query.status = status
    if (recruiterId) query.recruiter = recruiterId
    if (session && session.user.role === UserRole.RECRUITER) {
      query.recruiter = session.user.id
    }
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.RECRUITER)) {
      query.status = "active"
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    let sortOption: any = {}
    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 }
        break
      case "highestSalary":
        sortOption = { "salary.max": -1 }
        break
      case "lowestSalary":
        sortOption = { "salary.max": 1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }

    const [data, total] = await Promise.all([
      Job.find(query)
        .skip(skip)
        .limit(+limit)
        .sort(sortOption)
        .lean(),
      Job.countDocuments(query),
    ])

    return NextResponse.json({
      data,
      total,
      currentPage: +page,
      totalPages: Math.ceil(total / +limit),
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== UserRole.RECRUITER) {
      console.warn("❌ Unauthorized: user not recruiter or session missing")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await getActiveSubscription(session.user.id, SubscriptionRole.RECRUITER)
    console.log("📦 [POST /api/jobs] Subscription:", subscription)
    const permission = checkPostingPermission(subscription)
    console.log("📦 [POST /api/jobs] Permission Result:", permission)

    if (!permission.canPostJob) {
      return NextResponse.json({
        error: permission.reason
      }, { status: 403 })
    }

    const company = await Company.findOne({ owner: session.user.id })
    if (!company) {
      console.warn("❌ Company profile not found: must register company before posting jobs")
      return NextResponse.json({
        error: "You must register your company profile before posting jobs."
      }, { status: 400 })
    }

    console.log("✅ Company profile found:", {
      companyName: company.name,
      companyId: company._id,
      logoUrl: company.logo
    })

    const body = await request.json()
    const enrichedBody = {
      ...body,
      company: company.name,
      companyId: company._id.toString(), 
      companyLogo: company.logo || "https://example.com/default-logo.png", 
    }

    console.log("📥 [POST /api/jobs] Enriched body:", enrichedBody)

    const { data: validatedData, errors } = validateJob(enrichedBody)
    if (errors) {
      console.error("❌ Validation failed:", errors)
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const durationDays = getJobDurationForPlan(subscription.plan)
    const now = new Date()
    const expiresAt = addDays(now, durationDays)
    const isFeatured = subscription.plan !== SubscriptionPlan.FREE

    const jobData = {
      ...validatedData,
      recruiter: session.user.id,
      publishedAt: now,
      expiresAt,
      isFeatured,
      status: JobStatus.PENDING,
    }

    console.log("📝 [POST /api/jobs] Final job data:", jobData)

    const newJob = await Job.create(jobData)

    await incrementJobPosting(session.user.id, SubscriptionRole.RECRUITER)
    console.log("✅ Job created successfully:", newJob._id)

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
