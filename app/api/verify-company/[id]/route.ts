import Company from "@/models/Company"
import User from "@/models/User"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  const company = await Company.findById(params.id)
  if (!company) return NextResponse.json({ message: "Company not found" }, { status: 404 })

  const user = await User.findById(company.owner)
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

  company.isVerified = true
  await company.save()

  user.role = "recruiter"
  user.company = company._id
  await user.save()

  return NextResponse.json({ message: "Company approved successfully" })
}
