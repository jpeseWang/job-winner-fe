import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import CVTemplate from "@/models/CVTemplate"
import { UserRole } from "@/types/enums"
import { ETemplateCategory } from "@/types/enums"

export async function GET(request: NextRequest) {
    try {
        // const session = await getServerSession(authOptions)

        // if (!session || session.user.role !== UserRole.ADMIN) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        // }

        await dbConnect()

        const { searchParams } = new URL(request.url)
        const page = Number.parseInt(searchParams.get("page") || "1")
        const limit = Number.parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""
        const category = searchParams.get("category") || ""
        const isPremium = searchParams.get("isPremium")
        const isActive = searchParams.get("isActive")

        // Build filter object
        const filter: any = {}

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ]
        }

        if (category) {
            filter.category = category
        }

        if (isPremium !== null && isPremium !== "") {
            filter.isPremium = isPremium === "true"
        }

        if (isActive !== null && isActive !== "") {
            filter.isActive = isActive === "true"
        }

        const skip = (page - 1) * limit

        const [templates, total] = await Promise.all([
            (CVTemplate as any).find(filter).populate("creator", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            CVTemplate.countDocuments(filter),
        ])

        return NextResponse.json({
            success: true,
            data: templates,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching templates:", error)
        return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const body = await request.json()
        const { name, description, previewImage, htmlTemplate, cssStyles, category, tags, isPremium, price } =
            body

        // Validate required fields
        if (!name || !description || !htmlTemplate || !cssStyles || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Create new template
        const template = new CVTemplate({
            name,
            description,
            previewImage,
            htmlTemplate,
            cssStyles,
            category,
            tags: tags || [],
            creator: session.user.id,
            isPremium: isPremium || false,
            price: isPremium ? price : 0,
            isActive: true,
        })

        await template.save()
        await template.populate("creator", "name email")

        return NextResponse.json(
            {
                success: true,
                data: template,
                message: "Template created successfully",
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error creating template:", error)
        return NextResponse.json({ error: `Failed to create template: ${error}` }, { status: 500 })
    }
}
