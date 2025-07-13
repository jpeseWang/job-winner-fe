import { NextResponse, NextRequest } from "next/server"
import dbConnect from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import Profile from "@/models/Profile"

export async function GET() {
  try {
    await dbConnect()

    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await Profile.findOne({ user: user.id }).populate("user")
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error in GET /users/profile:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
