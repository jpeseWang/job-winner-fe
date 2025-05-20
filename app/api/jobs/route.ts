import { NextResponse } from "next/server"
import { z } from "zod"
import { jobs } from "@/lib/data"

// GET /api/jobs - Get all jobs with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const keyword = searchParams.get("keyword")
  const location = searchParams.get("location")
  const category = searchParams.get("category")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let filteredJobs = [...jobs]

  // Apply filters
  if (keyword) {
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(keyword.toLowerCase()),
    )
  }

  if (location) {
    filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
  }

  if (category) {
    filteredJobs = filteredJobs.filter((job) => job.category.toLowerCase() === category.toLowerCase())
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

  return NextResponse.json({
    jobs: paginatedJobs,
    total: filteredJobs.length,
    page,
    limit,
    totalPages: Math.ceil(filteredJobs.length / limit),
  })
}

// POST /api/jobs - Create a new job (requires authentication)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate job data
    const jobSchema = z.object({
      title: z.string().min(3).max(100),
      company: z.string().min(2).max(100),
      location: z.string().min(2).max(100),
      type: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship"]),
      category: z.string(),
      salary: z.string().optional(),
      description: z.string().min(10),
      requirements: z.array(z.string()).min(1),
      benefits: z.array(z.string()).optional(),
      contactEmail: z.string().email(),
      applicationUrl: z.string().url().optional(),
      companyLogo: z.string().optional(),
      featured: z.boolean().optional(),
    })

    const validatedData = jobSchema.parse(body)

    // In a real app, we would save to database
    // For demo, we'll just return the data with an ID
    const newJob = {
      id: `job-${Date.now()}`,
      ...validatedData,
      postedDate: new Date().toISOString(),
      postedDays: 0,
    }

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
