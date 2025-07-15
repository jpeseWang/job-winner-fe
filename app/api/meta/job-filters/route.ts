import { NextResponse } from "next/server"
import dbConnect from '@/lib/db'
import { JobCategory, JobLocation, JobType, ExperienceLevel } from "@/types/enums/index"
import Job from "@/models/Job"

async function countByField(field: string) {
  const counts = await Job.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } }
  ])
  const result: Record<string, number> = {}
  counts.forEach((item) => {
    result[item._id] = item.count
  })
  return result
}

export async function GET() {
  await dbConnect()
  const [categoryCounts, typeCounts, experienceCounts] = await Promise.all([
    countByField("category"),
    countByField("type"),
    countByField("experienceLevel"),
  ])

  return NextResponse.json({
    categories: Object.values(JobCategory).map((label) => ({
      label,
      count: categoryCounts[label] || 0,
    })),
    locations: Object.values(JobLocation),
    types: Object.values(JobType).map((label) => ({
      label,
      count: typeCounts[label] || 0,
    })),
    experienceLevels: Object.values(ExperienceLevel).map((label) => ({
      label,
      count: experienceCounts[label] || 0,
    })),
  })
}