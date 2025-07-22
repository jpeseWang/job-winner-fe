
import { NextResponse } from "next/server"
import User from "@/models/User"
import dbConnect from "@/lib/db"

export async function GET(req: Request) {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const role = searchParams.get("role")
  const limit = parseInt(searchParams.get("limit") || "10")
  const page = parseInt(searchParams.get("page") || "1")

  const query = role ? { role } : {}

  const total = await User.countDocuments(query)
  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })

  return NextResponse.json({
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
