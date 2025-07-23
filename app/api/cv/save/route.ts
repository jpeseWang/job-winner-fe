import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"
import CVTemplate from "@/models/CVTemplate"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, templateId, content, htmlContent, isPublic = false } = body

    // Validate required fields
    if (!title || !templateId || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Verify template exists
    const template = await CVTemplate.findById(templateId)
    if (!template) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 })
    }
    //Parse content
    if (typeof content.skills === "object" && content.skills["skills-list"]) {
      const skillsArray = content.skills["skills-list"]
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
      content.skills = skillsArray
    }
    // Create new CV
    const newCV = new CV({
      user: session.user.id,
      title,
      template: templateId,
      content,
      htmlContent: htmlContent || "",
      isPublic,
      views: 0,
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const savedCV = await newCV.save()

    // Populate template data for response
    await savedCV.populate("template")

    return NextResponse.json({
      success: true,
      data: savedCV,
      message: "CV saved successfully",
    })
  } catch (error) {
    console.error("Error saving CV:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
