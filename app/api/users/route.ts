import { NextResponse } from "next/server"

// GET /api/users - Get users (requires admin authentication)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const role = searchParams.get("role")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  // In a real app, we would fetch from database
  // For demo, we'll return mock data
  const users = [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      role: "job_seeker",
      createdAt: "2023-01-15T10:30:00Z",
      lastActive: "2023-05-10T14:20:00Z",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "job_seeker",
      createdAt: "2023-02-20T08:15:00Z",
      lastActive: "2023-05-11T09:45:00Z",
    },
    {
      id: "user-3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "recruiter",
      company: "Tech Solutions Inc.",
      createdAt: "2023-01-10T11:30:00Z",
      lastActive: "2023-05-12T16:30:00Z",
    },
    {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "recruiter",
      company: "Creative Digital",
      createdAt: "2023-03-05T09:20:00Z",
      lastActive: "2023-05-09T13:15:00Z",
    },
    {
      id: "user-5",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      createdAt: "2023-01-01T00:00:00Z",
      lastActive: "2023-05-12T10:00:00Z",
    },
  ]

  let filteredUsers = [...users]

  // Apply filters
  if (role) {
    filteredUsers = filteredUsers.filter((user) => user.role === role)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  return NextResponse.json({
    users: paginatedUsers,
    total: filteredUsers.length,
    page,
    limit,
    totalPages: Math.ceil(filteredUsers.length / limit),
  })
}
