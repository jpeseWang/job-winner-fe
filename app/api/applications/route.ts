import { NextResponse } from "next/server"
import { z } from "zod"

// GET /api/applications - Get all applications (requires authentication)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const jobId = searchParams.get("jobId")
  const status = searchParams.get("status")

  // In a real app, we would fetch from database
  // For demo, we'll return mock data
  const applications = [
    {
      id: "app-1",
      jobId: "1",
      userId: "user-1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      resumeUrl: "/resumes/john-doe.pdf",
      coverLetter: "I am excited to apply for this position...",
      status: "pending",
      appliedDate: "2023-05-01T10:30:00Z",
    },
    {
      id: "app-2",
      jobId: "1",
      userId: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "123-456-7891",
      resumeUrl: "/resumes/jane-smith.pdf",
      coverLetter: "With my 5 years of experience...",
      status: "reviewed",
      appliedDate: "2023-05-02T14:20:00Z",
    },
    {
      id: "app-3",
      jobId: "2",
      userId: "user-3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "123-456-7892",
      resumeUrl: "/resumes/mike-johnson.pdf",
      coverLetter: "I believe my skills in...",
      status: "interviewed",
      appliedDate: "2023-05-03T09:15:00Z",
    },
  ]

  let filteredApplications = [...applications]

  // Apply filters
  if (jobId) {
    filteredApplications = filteredApplications.filter((app) => app.jobId === jobId)
  }

  if (status) {
    filteredApplications = filteredApplications.filter((app) => app.status === status)
  }

  return NextResponse.json(filteredApplications)
}

// POST /api/applications - Submit a job application
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate application data
    const applicationSchema = z.object({
      jobId: z.string(),
      name: z.string().min(2).max(100),
      email: z.string().email(),
      phone: z.string().optional(),
      resumeUrl: z.string(),
      coverLetter: z.string().optional(),
    })

    const validatedData = applicationSchema.parse(body)

    // In a real app, we would save to database
    // For demo, we'll just return the data with an ID
    const newApplication = {
      id: `app-${Date.now()}`,
      ...validatedData,
      status: "pending",
      appliedDate: new Date().toISOString(),
    }

    return NextResponse.json(newApplication, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
