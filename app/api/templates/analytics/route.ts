import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import CVTemplate from "@/models/CVTemplate"
import CV from "@/models/CV"
import { UserRole } from "@/types/enums"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        // Get template statistics
        const [
            totalTemplates,
            activeTemplates,
            premiumTemplates,
            freeTemplates,
            categoryStats,
            topTemplates,
            recentTemplates,
        ] = await Promise.all([
            CVTemplate.countDocuments(),
            CVTemplate.countDocuments({ isActive: true }),
            CVTemplate.countDocuments({ isPremium: true }),
            CVTemplate.countDocuments({ isPremium: false }),
            CVTemplate.aggregate([
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 },
                        avgRating: { $avg: "$rating.average" },
                    },
                },
                { $sort: { count: -1 } },
            ]),
            CVTemplate.find().sort({ usageCount: -1 }).limit(5).select("name usageCount rating").lean(),
            CVTemplate.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name createdAt creator")
                .populate("creator", "name")
                .lean(),
        ])

        // Get usage statistics from CV collection
        const usageStats = await CV.aggregate([
            {
                $group: {
                    _id: "$templateId",
                    usageCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "cvtemplates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "template",
                },
            },
            {
                $unwind: "$template",
            },
            {
                $project: {
                    templateName: "$template.name",
                    usageCount: 1,
                },
            },
            { $sort: { usageCount: -1 } },
            { $limit: 10 },
        ])

        return NextResponse.json({
            success: true,
            data: {
                overview: {
                    totalTemplates,
                    activeTemplates,
                    premiumTemplates,
                    freeTemplates,
                },
                categoryStats,
                topTemplates,
                recentTemplates,
                usageStats,
            },
        })
    } catch (error) {
        console.error("Error fetching template analytics:", error)
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }
}
