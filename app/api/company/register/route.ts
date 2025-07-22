import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Company from "@/models/Company"
import User from "@/models/User"
import { z } from "zod"

const registerCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(100, "Company name too long"),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(1, "Industry is required"),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"]),
  founded: z.number().min(1800).max(new Date().getFullYear()).optional(),
  headquarters: z.string().min(1, "Headquarters is required"),
  specialties: z.array(z.string()).default([]),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    // Check if user already has a company
    const existingCompany = await Company.findOne({ owner: session.user.id })
    if (existingCompany) {
      return NextResponse.json({ message: "You already have a registered company" }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = registerCompanySchema.parse(body)

    // Check if company name already exists
    const nameExists = await Company.findOne({
      name: { $regex: new RegExp(`^${validatedData.name}$`, "i") },
    })

    if (nameExists) {
      return NextResponse.json({ message: "Company name already exists" }, { status: 400 })
    }

    // Create the company
    const company = new Company({
      ...validatedData,
      owner: session.user.id,
      employees: [session.user.id],
      isVerified: false, // Will be verified by admin
    })

    await company.save()

    // Update user role to recruiter if not already
    await User.findByIdAndUpdate(session.user.id, {
      role: "recruiter",
      company: company._id,
    })

    return NextResponse.json(
      {
        message: "Company registration submitted successfully",
        company: {
          id: company._id,
          name: company.name,
          isVerified: company.isVerified,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Company registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
