import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Job from "@/models/Job"
import Company from "@/models/Company" 
import User from "@/models/User"
import { UserRole } from "@/types/enums"

export async function GET() {
  await dbConnect()

  const jobCount = await Job.countDocuments()
  const companyCount = await Company.countDocuments()
  const candidateCount = await User.countDocuments({ role: UserRole.JOB_SEEKER })

  return NextResponse.json({ jobCount, companyCount, candidateCount })
}
