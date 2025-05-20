import { NextResponse } from "next/server"
import { z } from "zod"
import { jobs } from "@/lib/data"

// GET /api/jobs/[id] - Get a specific job by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const job = jobs.find((job) => job.id === id)

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  return NextResponse.json(job)
}

// PUT /api/jobs/[id] - Update a job (requires authentication)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Check if job exists
    const jobIndex = jobs.findIndex((job) => job.id === id)

    if (jobIndex === -1) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Validate job data
    const jobSchema = z.object({
      title: z.string().min(3).max(100).optional(),
      company: z.string().min(2).max(100).optional(),
      location: z.string().min(2).max(100).optional(),
      type: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship"]).optional(),
      category: z.string().optional(),
      salary: z.string().optional(),
      description: z.string().min(10).optional(),
      requirements: z.array(z.string()).min(1).optional(),
      benefits: z.array(z.string()).optional(),
      contactEmail: z.string().email().optional(),
      applicationUrl: z.string().url().optional(),
      companyLogo: z.string().optional(),
      featured: z.boolean().optional(),
    })

    const validatedData = jobSchema.parse(body)

    // In a real app, we would update in database
    // For demo, we'll just return the updated data
    const updatedJob = {
      ...jobs[jobIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedJob)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

// DELETE /api/jobs/[id] - Delete a job (requires authentication)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Check if job exists
  const jobIndex = jobs.findIndex((job) => job.id === id)

  if (jobIndex === -1) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  // In a real app, we would delete from database
  // For demo, we'll just return success

  return NextResponse.json({ success: true, message: "Job deleted successfully" })
}
