import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import CVTemplate from "@/models/CVTemplate"
import { UserRole } from "@/types/enums"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

        template.isActive = !template.isActive
        await template.save()

        return NextResponse.json({
            success: true,
            data: { isActive: template.isActive },
            message: `Template ${template.isActive ? "activated" : "deactivated"} successfully`,
        })
    } catch (error) {
        console.error("Error toggling template status:", error)
        return NextResponse.json({ error: "Failed to toggle template status" }, { status: 500 })
    }
}
