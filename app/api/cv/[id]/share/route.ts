import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const cv = await CV.findById(params.id)

    if (!cv) {
      return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
    }

    // Generate unique share URL if not exists
    let shareUrl = cv.shareUrl
    if (!shareUrl) {
      shareUrl = nanoid(12)
      await CV.findByIdAndUpdate(params.id, {
        shareUrl,
        isPublic: true,
        updatedAt: new Date(),
      })
    }

    const fullShareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cv/shared/${shareUrl}`

    return NextResponse.json({
      success: true,
      data: {
        shareUrl: fullShareUrl,
        shortId: shareUrl,
      },
    })
  } catch (error) {
    console.error("Error sharing CV:", error)
    return NextResponse.json({ success: false, error: "Failed to share CV" }, { status: 500 })
  }
}
