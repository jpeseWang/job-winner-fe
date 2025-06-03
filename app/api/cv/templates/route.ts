import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, this would fetch templates from a database
    const templates = [
      {
        id: "modern-1",
        name: "Modern Professional",
        category: "professional",
        thumbnail: "/placeholder.svg?height=200&width=150",
        isPremium: false,
      },
      {
        id: "classic-1",
        name: "Classic Elegant",
        category: "traditional",
        thumbnail: "/placeholder.svg?height=200&width=150",
        isPremium: false,
      },
      {
        id: "creative-1",
        name: "Creative Design",
        category: "creative",
        thumbnail: "/placeholder.svg?height=200&width=150",
        isPremium: true,
      },
      {
        id: "minimal-1",
        name: "Minimal Clean",
        category: "minimal",
        thumbnail: "/placeholder.svg?height=200&width=150",
        isPremium: false,
      },
      {
        id: "tech-1",
        name: "Tech Professional",
        category: "professional",
        thumbnail: "/placeholder.svg?height=200&width=150",
        isPremium: true,
      },
      {
        id: "executive-1",
        name: "Executive Resume",
        category: "professional",
        thumbnail: "/placeholder.svg?height=200&width=150",
        isPremium: true,
      },
    ]

    return NextResponse.json({
      success: true,
      data: templates,
    })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch templates" }, { status: 500 })
  }
}
