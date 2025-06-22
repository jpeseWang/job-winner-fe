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
