import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Application from "@/models/Application"
import type { ApplicationStatus } from "@/types/enums"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""
        const status = searchParams.get("status") as ApplicationStatus | "all" | null
        const page = Number.parseInt(searchParams.get("page") || "1")
        const limit = Number.parseInt(searchParams.get("limit") || "10")

        // Build query
        const query: any = { userId: params.userId }

        // Add status filter
        if (status && status !== "all") {
            query.status = status
        }

        // Build aggregation pipeline
        const pipeline: any[] = [
            { $match: query },
            {
                $lookup: {
                    from: "jobs",
                    localField: "jobId",
                    foreignField: "_id",
                    as: "job",
                    pipeline: [
                        {
                            $lookup: {
                                from: "companies",
                                localField: "companyId",
                                foreignField: "_id",
                                as: "company",
                            },
                        },
                        {
                            $unwind: {
                                path: "$company",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "name",
                    as: "companyInfo",
                },
            },
            {
                $unwind: {
                    path: "$job",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]

        // Add search filter
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "job.title": { $regex: search, $options: "i" } },
                        { "job.company.name": { $regex: search, $options: "i" } },
                        { "job.location": { $regex: search, $options: "i" } },
                    ],
                },
            })
        }

        // Add sorting
        pipeline.push({ $sort: { createdAt: -1 } })

        // Get total count
        const totalPipeline = [...pipeline, { $count: "total" }]
        const totalResult = await Application.aggregate(totalPipeline)
        const total = totalResult[0]?.total || 0

        // Add pagination
        pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit })

        // Execute query
        const applications = await Application.aggregate(pipeline)

        return NextResponse.json({
            success: true,
            data: {
                applications,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            },
        })
    } catch (error) {
        console.error("Error fetching user applications:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch applications",
            },
            { status: 500 },
        )
    }
}
