import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import Application from "@/models/Application"
import { UserRole } from "@/types/enums"

interface LeanJob {
  _id: string
  title: string
  company: string
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.RECRUITER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // 🛠 Fix type cho kết quả từ Job.find().lean()
    const jobs = await Job.find({ recruiter: session.user.id })
        .select("_id title company")
        .lean<LeanJob[]>()

    const jobIdMap = new Map<string, { jobTitle: string; company: string }>()
    const jobIds: string[] = []

    jobs.forEach((job) => {
      const jobId = job._id.toString()
      jobIdMap.set(jobId, {
        jobTitle: job.title,
        company: job.company,
      })
      jobIds.push(jobId)
    })

    if (jobIds.length === 0) {
      return NextResponse.json([], { status: 200 })
    }

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ appliedDate: -1 })
      .lean()

    const formatted = applications.map((app: any) => {
      const jobInfo = jobIdMap.get(app.jobId) || { jobTitle: "Unknown", company: "Unknown" }

      return {
        id: app._id.toString(),
        jobId: app.jobId,
        jobTitle: jobInfo.jobTitle,
        company: jobInfo.company,
        userId: app.userId,
        name: `${app.firstName} ${app.lastName}`,
        email: app.email,
        candidatePhoto: app.candidatePhoto || null,
        resumeUrl: app.resumeUrl,
        coverLetter: app.coverLetter,
        status: app.status,
        appliedDate: app.appliedDate,
      }
    })

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("Error fetching recruiter applications:", error)
    return NextResponse.json({ error: "Failed to load applications" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== UserRole.RECRUITER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { applicationId, status } = await req.json()

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the application belongs to a job posted by this recruiter
    const application = await Application.findById(applicationId)
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const job = await Job.findById(application.jobId)
    if (!job || job.recruiter.toString() !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Update application status
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      {
        status,
        updatedAt: new Date()
      },
      { new: true }
    )

    return NextResponse.json({
      message: "Application status updated successfully",
      application: updatedApplication
    })

  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
