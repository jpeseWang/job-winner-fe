import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect()

        const { id } = params

        const cv = await CV.findById(id)
            .populate("template", "name category thumbnail htmlTemplate")
            .populate("user", "name email")

        if (!cv) {
            return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
        }

        // Increment view count
        await CV.findByIdAndUpdate(id, { $inc: { views: 1 } })

        return NextResponse.json({
            success: true,
            data: cv,
        })
    } catch (error) {
        console.error("Error fetching CV:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch CV" }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect()

        const { id } = params
        const body = await request.json()
        const { title, content, htmlContent, isPublic } = body

        const cv = await CV.findById(id)
        if (!cv) {
            return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
        }

        // Update CV
        const updatedCV = await CV.findByIdAndUpdate(
            id,
            {
                title,
                content,
                htmlContent,
                isPublic,
                lastGeneratedAt: new Date(),
            },
            { new: true },
        ).populate("template", "name category")

        return NextResponse.json({
            success: true,
            data: updatedCV,
            message: "CV updated successfully",
        })
    } catch (error) {
        console.error("Error updating CV:", error)
        return NextResponse.json({ success: false, error: "Failed to update CV" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect()

        const { id } = params

        const cv = await CV.findById(id)
        if (!cv) {
            return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
        }

        await CV.findByIdAndDelete(id)

        return NextResponse.json({
            success: true,
            message: "CV deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting CV:", error)
        return NextResponse.json({ success: false, error: "Failed to delete CV" }, { status: 500 })
    }
}
