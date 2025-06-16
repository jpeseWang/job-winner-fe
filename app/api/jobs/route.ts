import { NextResponse, NextRequest } from "next/server"
import { z } from "zod"
import Job from "@/models/Job"
import dbConnect from "@/lib/db"
import { validateJob } from "@/utils/validators"

// GET /api/jobs - Get all jobs with optional filtering
export async function GET(req: NextRequest) {
  await dbConnect()

  const {
    keyword,
    location,
    category,
    type,
    experienceLevel,
    page = "1",
    limit = "20",
  } = Object.fromEntries(req.nextUrl.searchParams)

  const query: any = {}

  if (keyword) {
    query.$text = { $search: keyword }
  }

  if (location) {
    query.location = location
  }

  if (category) {
    query.category = { $in: category.split(",") }
  }

  if (type) {
    query.type = { $in: type.split(",") }
  }

  if (experienceLevel) {
    query.experienceLevel = { $in: experienceLevel.split(",") }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const [data, total] = await Promise.all([
    Job.find(query).skip(skip).limit(+limit).sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ])

  return NextResponse.json({
    data,
    total,
    currentPage: +page,
    totalPages: Math.ceil(total / +limit),
  })
}

// POST /api/jobs - Create a new job (requires authentication)
export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()

    const { data: validatedData, errors } = validateJob(body)
    if (errors) {
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const newJob = await Job.create(validatedData)

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
