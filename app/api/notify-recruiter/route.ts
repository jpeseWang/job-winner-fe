import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import User from "@/models/User"
import { sendRecruiterNotificationEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { jobId, applicantName, applicantEmail } = await req.json()

    const job = await Job.findById(jobId)
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

    const recruiter = await User.findById(job.recruiter)
    if (!recruiter || !recruiter.email) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 })
    }

    await sendRecruiterNotificationEmail({
      recruiterEmail: recruiter.email,
      recruiterName: recruiter.name,
      applicantName,
      applicantEmail,
      jobTitle: job.title,
      company: job.company,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to notify recruiter:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
