import { NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Token and new password (≥ 6 kí tự) are required" },
        { status: 400 },
      )
    }

    await dbConnect()

    // băm token nhận từ URL để so với DB
    const hashedToken = crypto.createHash("sha256").update(token.trim()).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset-password token" },
        { status: 400 },
      )
    }

    // đặt mật khẩu mới (hash ngay tại đây để chắc chắn)
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // xoá token để link cũ vô hiệu
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json(
      { message: "Password updated successfully – you can now log in." },
      { status: 200 },
    )
  } catch (err) {
    console.error("Reset-password error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
