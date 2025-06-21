import { NextResponse } from "next/server"
import Company from "@/models/Company"
import dbConnect from "@/lib/db"

export async function GET(req: Request) {
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) return NextResponse.json({ message: "Missing userId" }, { status: 400 })

  const company = await Company.findOne({ owner: userId }).lean()
  if (!company) return NextResponse.json(null)

  return NextResponse.json(company)
}