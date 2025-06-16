import { NextResponse } from "next/server"
import { z } from "zod"
import { jobs } from "@/lib/data"
import Job from "@/models/Job"
import dbConnect from "@/lib/db"
import { validateJob } from "@/utils/validators"

// GET /api/jobs - Get all jobs with optional filtering
export async function GET(request: Request) {
  await dbConnect()
  const { searchParams } = new URL(request.url)

  const keyword = searchParams.get("keyword")
  const location = searchParams.get("location")
  const category = searchParams.get("category")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let query: any = {}

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { company: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ]
  }

  if (location) {
    query.location = { $regex: location, $options: "i" }
  }

  if (category) {
    query.category = { $regex: category, $options: "i" }
  }

  const totalJobs = await Job.countDocuments(query)
  const jobs = await Job.find(query)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })

  // Transform jobs to include 'id' and remove '_id'
  const transformedJobs = jobs.map(job => {
    const jobObject = job.toJSON();
    const { _id, ...rest } = jobObject;
    return { ...rest, id: _id.toString() };
  });

  return NextResponse.json({
    jobs: transformedJobs,
    total: totalJobs,
    page,
    limit,
    totalPages: Math.ceil(totalJobs / limit),
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
