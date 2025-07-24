import { NextResponse } from "next/server"
import dbConnect from '@/lib/db'
import Job from '@/models/Job'
import { z } from "zod"

function getIdFromRequest(request: Request): string | null {
  const url = new URL(request.url)
  const segments = url.pathname.split("/")
  return segments.pop() || null
}

export async function GET(request: Request) {
  try {
    await dbConnect()
    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    // Lấy session để kiểm tra quyền
    let session = null
    try {
      const { getServerSession } = await import("next-auth/next")
      const { authOptions } = await import("@/lib/auth")
      session = await getServerSession(authOptions)
    } catch {}

    const job = await Job.findById(id).lean({ virtuals: true, getters: true });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Nếu không phải recruiter hoặc admin thì chỉ trả về job active
    const jobAny = job as any;
    if (!session || (session.user.role !== "recruiter" && session.user.role !== "admin")) {
      if (jobAny.status !== "active") {
        return NextResponse.json({ error: "Job not available" }, { status: 403 })
      }
    }
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect()
    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    const body = await request.json()
    const updatedJob = await Job.findByIdAndUpdate(id, body, { new: true })

    if (!updatedJob || !updatedJob._id) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const updatedJobObj = updatedJob.toJSON ? updatedJob.toJSON() : updatedJob
    return NextResponse.json({ ...updatedJobObj, id: updatedJobObj._id?.toString?.() || "" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect()
    const id = getIdFromRequest(request)
    if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

    const job = await Job.findByIdAndDelete(id)
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}
