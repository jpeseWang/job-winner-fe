import { NextResponse } from "next/server"
import crypto from "crypto"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // luôn trả 200 để tránh dò email
    const genericSuccess = NextResponse.json(
      { message: "If that account exists, a password-reset link has been sent." },
      { status: 200 },
    )

    if (!email || typeof email !== "string") return genericSuccess

    await dbConnect()

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return genericSuccess

    // sinh token thô và hash để lưu
    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 giờ

    // ghi đè token cũ (nếu có)
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = expires
    await user.save()

    // gửi email
    await sendPasswordResetEmail(user.email, user.name, rawToken)

    return genericSuccess
  } catch (err) {
    console.error("Forgot-password error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
