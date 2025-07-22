import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Company from "@/models/Company"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()
  const company = await Company.findByIdAndUpdate(params.id, {
    isVerified: false,
  })

  if (!company) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Company disabled" })
}