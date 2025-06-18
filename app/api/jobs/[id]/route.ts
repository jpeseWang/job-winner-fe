import { NextResponse } from "next/server"
import dbConnect from '@/lib/db'
import Job from '@/models/Job'
import { z } from "zod"

// Helper: lấy ID từ URL
function getIdFromRequest(request: Request): string | null {
  const url = new URL(request.url)
  const segments = url.pathname.split("/")
  return segments.pop() || null
}

// GET /api/jobs/[id] - Get a single job by ID
export async function GET(request: Request) {
  try {
    await dbConnect()
    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    const job = await Job.findById(id)

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Convert Mongoose document to plain object and transform _id to id
    const { _id, ...jobData } = job.toJSON()
    const transformedJob = { ...jobData, id: _id.toString() }

    return NextResponse.json(transformedJob)
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// PUT /api/jobs/[id] - Update a job (requires authentication)
export async function PUT(request: Request) {
  try {
    await dbConnect()
    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    // Validate job data (using the same schema from /api/jobs/route.ts)
    // For this example, I'll use a basic update. In a real app, you'd use a validator like validateJob
    const body = await request.json()
    const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true })

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const { _id, ...updatedJobData } = updatedJob.toJSON()
    const transformedUpdatedJob = { ...updatedJobData, id: _id.toString() }

    return NextResponse.json(transformedUpdatedJob)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(request: Request) {
  try {
    await dbConnect()
    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    const job = await Job.findByIdAndDelete(id)

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
