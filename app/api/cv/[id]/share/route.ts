import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import CV from "@/models/CV"

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB()

        const { id } = params

        const cv = await CV.findById(id)
        if (!cv) {
            return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
        }

        // Generate share URL
        const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cv/shared/${id}`

        // Update CV to be public for sharing
        await CV.findByIdAndUpdate(id, { isPublic: true })

        return NextResponse.json({
            success: true,
            data: { shareUrl },
            message: "CV shared successfully",
        })
    } catch (error) {
        console.error("Error sharing CV:", error)
        return NextResponse.json({ success: false, error: "Failed to share CV" }, { status: 500 })
    }
}
