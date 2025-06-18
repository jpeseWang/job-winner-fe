import { type NextRequest, NextResponse } from "next/server"
import { deleteFromCloudinary } from "@/lib/cloudinary"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { publicId } = await request.json()

        if (!publicId) {
            return NextResponse.json({ error: "No public ID provided" }, { status: 400 })
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(publicId)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Delete error:", error)
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }
}
