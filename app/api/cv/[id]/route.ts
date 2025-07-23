import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const cv = await CV.findById(params.id).populate("template")

    if (!cv) {
      return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
    }

    // Increment view count
    cv.views = (cv.views || 0) + 1
    await cv.save()

    return NextResponse.json({
      success: true,
      data: cv,
    })
  } catch (error) {
    console.error("Error fetching CV:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, templateId, content, htmlContent, isPublic } = body

    // Find CV and verify ownership
    const cv = await CV.findById(params.id)
    if (!cv) {
      return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
    }

    // if (cv.user !== session.user.id) {
    //   return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    // }
    //Parse content
    if (typeof content.skills === "object" && content.skills["skills-list"]) {
      const skillsArray = content.skills["skills-list"]
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
      content.skills = skillsArray
    }
    // Update CV
    const updatedCV = await CV.findByIdAndUpdate(
      params.id,
      {
        title,
        template: templateId,
        content,
        htmlContent: htmlContent || cv.htmlContent,
        isPublic: isPublic !== undefined ? isPublic : cv.isPublic,
        updatedAt: new Date(),
      },
      { new: true },
    ).populate("template")

    return NextResponse.json({
      success: true,
      data: updatedCV,
      message: "CV updated successfully",
    })
  } catch (error) {
    console.error("Error updating CV:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Find CV and verify ownership
    const cv = await CV.findById(params.id)
    if (!cv) {
      return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
    }

    if (cv.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    await CV.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: "CV deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting CV:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
