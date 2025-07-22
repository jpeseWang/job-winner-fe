import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"
import CVTemplate from "@/models/CVTemplate"

export async function POST(request: Request) {
    try {
        await dbConnect()

        const body = await request.json()
        const { userId, title, templateId, content, htmlContent, isPublic = false } = body

        // Validate required fields
        if (!userId || !title || !templateId || !content) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
        }

        // Verify template exists
        const template = await CVTemplate.findById(templateId)
        if (!template) {
            return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 })
        }

        // Create new CV
        const cv = new CV({
            user: userId,
            title,
            template: templateId,
            content,
            htmlContent: htmlContent || "",
            isPublic,
            views: 0,
            downloads: 0,
            lastGeneratedAt: new Date(),
        })

        await cv.save()

        // Populate template information
        await cv.populate("template", "name category")

        return NextResponse.json({
            success: true,
            data: cv,
            message: "CV saved successfully",
        })
    } catch (error) {
        console.error("Error saving CV:", error)
        return NextResponse.json({ success: false, error: "Failed to save CV" }, { status: 500 })
    }
}
