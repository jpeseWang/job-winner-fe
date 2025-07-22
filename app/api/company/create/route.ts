import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Company from "@/models/Company"

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()

  try {
    const company = await Company.create({
      ...body,
      isVerified: true, 
    })

    return NextResponse.json(company, { status: 201 })  
  } catch (err: any) {
    return NextResponse.json(
      { message: "Create company failed", error: err.message },
      { status: 400 }
    )
  }
}