import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"

export async function GET(request: Request,

    context: { params: Promise<{ userId: string }> })
// { params }: { params: { userId: string } })
{
    try {
        await dbConnect()

        const userId = (await context.params).userId
        const { searchParams } = new URL(request.url)
        const page = Number.parseInt(searchParams.get("page") || "1")
        const limit = Number.parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""

        // Build query
        const query: any = { user: userId }
        if (search) {
            query.title = { $regex: search, $options: "i" }
        }

        // Get total count
        const total = await CV.countDocuments(query)

        // Get CVs with pagination
        const cvs = await CV.find(query)
            .populate("template", "name category thumbnail")
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        return NextResponse.json({
            success: true,
            data: cvs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching user CVs:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch CVs" }, { status: 500 })
    }
}