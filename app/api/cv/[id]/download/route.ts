import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import CV from "@/models/CV"

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect()

        const { id } = params

        const cv = await CV.findById(id).populate("template", "name htmlTemplate").populate("user", "name email")

        if (!cv) {
            return NextResponse.json({ success: false, error: "CV not found" }, { status: 404 })
        }

        // Increment download count
        await CV.findByIdAndUpdate(id, { $inc: { downloads: 1 } })

        // Generate HTML content for download
        const htmlContent = cv.htmlContent || generateHTMLFromTemplate(cv.template.htmlTemplate, cv.content)

        return NextResponse.json({
            success: true,
            data: {
                htmlContent,
                fileName: `${cv.title.replace(/\s+/g, "_")}_CV.html`,
            },
        })
    } catch (error) {
        console.error("Error downloading CV:", error)
        return NextResponse.json({ success: false, error: "Failed to download CV" }, { status: 500 })
    }
}

function generateHTMLFromTemplate(template: string, content: any): string {
    // Simple template replacement logic
    let html = template

    // Replace placeholders with actual content
    html = html.replace(/{{name}}/g, content.personal?.name || "")
    html = html.replace(/{{email}}/g, content.personal?.email || "")
    html = html.replace(/{{phone}}/g, content.personal?.phone || "")
    html = html.replace(/{{summary}}/g, content.personal?.summary || "")

    // Add experience section
    if (content.experience && content.experience.length > 0) {
        const experienceHTML = content.experience
            .map(
                (exp: any) => `
      <div class="experience-item">
        <h3>${exp.title}</h3>
        <p><strong>${exp.company}</strong> - ${exp.location || ""}</p>
        <p>${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : "Present"}</p>
        <p>${exp.description}</p>
      </div>
    `,
            )
            .join("")

        html = html.replace(/{{experience}}/g, experienceHTML)
    }

    // Add education section
    if (content.education && content.education.length > 0) {
        const educationHTML = content.education
            .map(
                (edu: any) => `
      <div class="education-item">
        <h3>${edu.degree}</h3>
        <p><strong>${edu.institution}</strong> - ${edu.location || ""}</p>
        <p>${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : "Present"}</p>
        ${edu.description ? `<p>${edu.description}</p>` : ""}
      </div>
    `,
            )
            .join("")

        html = html.replace(/{{education}}/g, educationHTML)
    }

    // Add skills
    if (content.skills && content.skills.length > 0) {
        const skillsHTML = content.skills.join(", ")
        html = html.replace(/{{skills}}/g, skillsHTML)
    }

    return html
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}
