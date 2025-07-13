import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import CVTemplate from "@/models/CVTemplate"
import { UserRole } from "@/types/enums"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const template = await CVTemplate.findById(params.id).populate("creator", "name email").lean()

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: template,
        })
    } catch (error) {
        console.error("Error fetching template:", error)
        return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const body = await request.json()
        const {
            name,
            description,
            thumbnail,
            previewImages,
            htmlTemplate,
            cssStyles,
            category,
            tags,
            isPremium,
            price,
            isActive,
        } = body

        const template = await CVTemplate.findById(params.id)

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 })
        }

        // Update template fields
        template.name = name || template.name
        template.description = description || template.description
        template.thumbnail = thumbnail || template.thumbnail
        template.previewImages = previewImages || template.previewImages
        template.htmlTemplate = htmlTemplate || template.htmlTemplate
        template.cssStyles = cssStyles || template.cssStyles
        template.category = category || template.category
        template.tags = tags || template.tags
        template.isPremium = isPremium !== undefined ? isPremium : template.isPremium
        template.price = isPremium ? price || 0 : 0
        template.isActive = isActive !== undefined ? isActive : template.isActive

        await template.save()
        await template.populate("creator", "name email")

        return NextResponse.json({
            success: true,
            data: template,
            message: "Template updated successfully",
        })
    } catch (error) {
        console.error("Error updating template:", error)
        return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const template = await CVTemplate.findById(params.id)

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 })
        }

        await CVTemplate.findByIdAndDelete(params.id)

        return NextResponse.json({
            success: true,
            message: "Template deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting template:", error)
        return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
    }
}
