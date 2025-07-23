import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const cv = await CV.findById(params.id).populate("template")

    if (!cv) {
      return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
    }

    // Increment download count
    await CV.findByIdAndUpdate(params.id, {
      $inc: { downloads: 1 },
      updatedAt: new Date(),
    })

    // Return HTML content for download
    const htmlContent = cv.htmlContent || generateHTMLFromContent(cv.content, cv.template)

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${cv.title}.html"`,
      },
    })
  } catch (error) {
    console.error("Error downloading CV:", error)
    return NextResponse.json({ success: false, error: "Failed to download CV" }, { status: 500 })
  }
}

function generateHTMLFromContent(content: any, template: any): string {
  // Basic HTML template - in production, you'd use a proper template engine
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.personal?.name || "CV"}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h2 { border-bottom: 2px solid #333; padding-bottom: 5px; }
        .experience-item, .education-item { margin-bottom: 15px; }
        .date { font-style: italic; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${content.personal?.name || "Professional CV"}</h1>
        <p>${content.personal?.email || ""} | ${content.personal?.phone || ""}</p>
        <p>${content.personal?.address || ""}</p>
      </div>
      
      ${
        content.personal?.summary
          ? `
        <div class="section">
          <h2>Professional Summary</h2>
          <p>${content.personal.summary}</p>
        </div>
      `
          : ""
      }
      
      ${
        content.experience?.length
          ? `
        <div class="section">
          <h2>Work Experience</h2>
          ${content.experience
            .map(
              (exp: any) => `
            <div class="experience-item">
              <h3>${exp.title} - ${exp.company}</h3>
              <p class="date">${exp.startDate} - ${exp.isCurrentPosition ? "Present" : exp.endDate}</p>
              <p>${exp.description}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
      
      ${
        content.education?.length
          ? `
        <div class="section">
          <h2>Education</h2>
          ${content.education
            .map(
              (edu: any) => `
            <div class="education-item">
              <h3>${edu.degree}</h3>
              <p>${edu.institution} - ${edu.location}</p>
              <p class="date">${edu.startDate} - ${edu.endDate}</p>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
      
      ${
        content.skills?.length
          ? `
        <div class="section">
          <h2>Skills</h2>
          <p>${content.skills.join(", ")}</p>
        </div>
      `
          : ""
      }
    </body>
    </html>
  `
}
