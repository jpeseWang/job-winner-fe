import { NextResponse } from "next/server"

// GET /api/stats - Get platform statistics (requires admin authentication)
export async function GET(request: Request) {
  // In a real app, we would calculate these from the database
  // For demo, we'll return mock data

  const stats = {
    users: {
      total: 15420,
      jobSeekers: 12850,
      recruiters: 2540,
      admins: 30,
      newThisMonth: 845,
    },
    jobs: {
      total: 8750,
      active: 5230,
      expired: 3520,
      featured: 320,
      newThisMonth: 620,
    },
    applications: {
      total: 42680,
      pending: 12450,
      reviewed: 18920,
      interviewed: 8640,
      hired: 2670,
      newThisMonth: 3240,
    },
    categories: [
      { name: "Technology", count: 2340 },
      { name: "Healthcare", count: 1250 },
      { name: "Education", count: 980 },
      { name: "Finance", count: 1120 },
      { name: "Marketing", count: 860 },
      { name: "Sales", count: 720 },
      { name: "Customer Service", count: 680 },
      { name: "Administrative", count: 800 },
    ],
    locations: [
      { name: "New York", count: 1450 },
      { name: "San Francisco", count: 1280 },
      { name: "Los Angeles", count: 980 },
      { name: "Chicago", count: 720 },
      { name: "Boston", count: 650 },
    ],
    revenue: {
      total: 285600,
      thisMonth: 32400,
      lastMonth: 28900,
      growth: 12.1,
    },
  }

  return NextResponse.json(stats)
}
