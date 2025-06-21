import { NextResponse, NextRequest } from "next/server"
import { z } from "zod"
import Job from "@/models/Job"
import dbConnect from "@/lib/db"
import { validateJob } from "@/utils/validators"
import { Types } from "mongoose";

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
      Job.find(query)
        .skip(skip)
        .limit(+limit)
        .sort(sortOption)
        .lean(),
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
    const body = await request.json();

    console.log("Creating job with body:", body)
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
// temp update to re-push


/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs with optional filtering
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for job title, company, or description
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by job location
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by job category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of jobs per page
 *     responses:
 *       200:
 *         description: List of jobs with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     security:
 *       - SessionAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - location
 *               - type
 *               - category
 *               - description
 *               - requirements
 *               - contactEmail
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               company:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               location:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               type:
 *                 type: string
 *                 enum: [Full-time, Part-time, Contract, Freelance, Internship]
 *               category:
 *                 type: string
 *               salary:
 *                 type: string
 *               description:
 *                 type: string
 *                 minLength: 10
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               contactEmail:
 *                 type: string
 *                 format: email
 *               applicationUrl:
 *                 type: string
 *                 format: uri
 *               companyLogo:
 *                 type: string
 *                 format: uri
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */