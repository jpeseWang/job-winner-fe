import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"
import { UserRole } from "@/types/enums"
import Profile from "@/models/Profile"
export async function POST(request: Request) {
  try {
    const { name, email, password, role = UserRole.JOB_SEEKER, company } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate role
    const validRoles = [UserRole.JOB_SEEKER, UserRole.RECRUITER, UserRole.ADMIN]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 })
    }

    // Validate company for recruiters
    if (role === UserRole.RECRUITER && !company) {
      return NextResponse.json({ error: "Company name is required for recruiters" }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Create user
    const userData: any = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      verificationToken,
      verificationExpires,
      isVerified: false,
      isActive: true,
    }

    // Add company for recruiters
    if (role === UserRole.RECRUITER && company) {
      userData.company = company.trim()
    }

    const user = await User.create({
      ...userData,
    })

    if (role === UserRole.JOB_SEEKER) {
      await Profile.create({
        user: user._id,

      })
    }


    // Gửi email xác thực
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
    }

    // Return success response (exclude sensitive data)
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


