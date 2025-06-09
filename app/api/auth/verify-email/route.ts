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

    const user = await User.findOne({ verificationToken: token, verificationExpires: { $gt: Date.now() }, })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Update user verification status
    await User.findOneAndUpdate(
      { verificationToken: token.trim(), verificationExpires: { $gt: new Date() } },
      { $set: { isVerified: true }, $unset: { verificationToken: 1, verificationExpires: 1 } },
      { new: true }
    )

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
