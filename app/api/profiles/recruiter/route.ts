import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import RecruiterProfile from "@/models/RecruiterProfile"
import dbConnect from "@/lib/db"

// Helper function to sanitize profile data
function sanitizeProfileData(profile: any) {
  return {
    _id: profile._id,
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    position: profile.position ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    phone: profile.phone ?? "",
    personalWebsite: profile.personalWebsite ?? "",
    yearsOfExperience: profile.yearsOfExperience ?? "",
    specializations: profile.specializations ?? [],
    socialLinks: {
      linkedin: profile.socialLinks?.linkedin ?? "",
      twitter: profile.socialLinks?.twitter ?? "",
      facebook: profile.socialLinks?.facebook ?? "",
      instagram: profile.socialLinks?.instagram ?? "",
      personalWebsite: profile.socialLinks?.personalWebsite ?? "",
    },
    profilePicture: profile.profilePicture ?? "",
    isPublic: profile.isPublic ?? true,
    completionPercentage: profile.completionPercentage ?? 0,
    companyName: profile.companyName ?? "",
    companyId: profile.companyId ?? "",
    companyRole: profile.companyRole ?? "",
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  }
}

// GET /api/profiles/recruiter - Get recruiter profile
export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await RecruiterProfile.findOne({ user: session.user.id })
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Sanitize the response data
    const sanitizedProfile = sanitizeProfileData(profile)
    return NextResponse.json(sanitizedProfile)
  } catch (error) {
    console.error("Error fetching recruiter profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// POST /api/profiles/recruiter - Create or update recruiter profile
export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    // Destructure to remove _id and other immutable fields from the body
    const { _id, createdAt, updatedAt, ...updateData } = body

    // Find the profile by user ID and update it with the new data
    const profile = await RecruiterProfile.findOneAndUpdate(
      { user: session.user.id },
      { ...updateData, user: session.user.id },
      { new: true, upsert: true, runValidators: true }
    )

    if (!profile) {
      // This should theoretically not be hit due to `upsert: true`, but it's good practice
      return NextResponse.json({ error: "Could not find or create profile" }, { status: 500 })
    }

    // Sanitize the response data before sending it back
    const sanitizedProfile = sanitizeProfileData(profile)
    return NextResponse.json(sanitizedProfile)
  } catch (error) {
    console.error("Error updating recruiter profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
} 