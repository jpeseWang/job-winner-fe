import { NextResponse, NextRequest } from "next/server"
import { z } from "zod"
import Job from "@/models/Job"
import dbConnect from "@/lib/db"
import { validateJob } from "@/utils/validators"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const {
      keyword,
      location,
      category,
      type,
      experienceLevel,
      page = "1",
      limit = "20",
      sort = "latest"
    } = Object.fromEntries(req.nextUrl.searchParams)

    const query: any = {}

    if (keyword) query.$text = { $search: keyword }
    if (location) query.location = location
    if (category) query.category = { $in: category.split(",") }
    if (type) query.type = { $in: type.split(",") }
    if (experienceLevel) query.experienceLevel = { $in: experienceLevel.split(",") }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    let sortOption: any = {}
    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 }
        break
      case "highestSalary":
        sortOption = { "salary.max": -1 }
        break
      case "lowestSalary":
        sortOption = { "salary.max": 1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }

    const [data, total] = await Promise.all([
      Job.find(query).skip(skip).limit(+limit).sort(sortOption),
      Job.countDocuments(query),
    ])

    return NextResponse.json({
      data,
      total,
      currentPage: +page,
      totalPages: Math.ceil(total / +limit),
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

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