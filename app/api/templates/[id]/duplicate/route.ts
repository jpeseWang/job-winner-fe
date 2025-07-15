import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import CVTemplate from "@/models/CVTemplate"
import { UserRole } from "@/types/enums"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const originalTemplate = await CVTemplate.findById(params.id)

        if (!originalTemplate) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 })
        }

        // Create duplicate with modified name
        const duplicateTemplate = new CVTemplate({
            name: `${originalTemplate.name} (Copy)`,
            description: originalTemplate.description,
            thumbnail: originalTemplate.thumbnail,
            previewImages: originalTemplate.previewImages,
            htmlTemplate: originalTemplate.htmlTemplate,
            cssStyles: originalTemplate.cssStyles,
            category: originalTemplate.category,
            tags: originalTemplate.tags,
            creator: session.user.id,
            isPremium: originalTemplate.isPremium,
            price: originalTemplate.price,
            isActive: false, // Start as inactive
        })

        await duplicateTemplate.save()
        await duplicateTemplate.populate("creator", "name email")

        return NextResponse.json({
            success: true,
            data: duplicateTemplate,
            message: "Template duplicated successfully",
        })
    } catch (error) {
        console.error("Error duplicating template:", error)
        return NextResponse.json({ error: "Failed to duplicate template" }, { status: 500 })
    }
}
