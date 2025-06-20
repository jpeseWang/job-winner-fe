import { type NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File
        const folder = (formData.get("folder") as string) || "general"

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary
        const result = await uploadToCloudinary(buffer, {
            folder: `job-marketplace/${folder}`,
            resource_type: "auto",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
            tags: [session.user?.id || "anonymous", folder],
        })


        return NextResponse.json(result)
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }
}
