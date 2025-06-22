import Company from "@/models/Company"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  await dbConnect()
  const companies = await Company.find({ isVerified: true })
    .populate("owner", "name") 
    .lean()
  return NextResponse.json(companies)
}
