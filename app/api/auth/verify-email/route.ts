import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Update user verification status
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      verificationToken: undefined,
    })

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
