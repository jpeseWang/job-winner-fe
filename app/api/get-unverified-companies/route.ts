import Company from "@/models/Company"
import dbConnect from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  await dbConnect()
  const companies = await Company.find({ isVerified: false })
    .populate("owner", "name") // lấy tên chủ sở hữu
    .lean()
  return NextResponse.json(companies)
}
