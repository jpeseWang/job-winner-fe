import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, templateId, recommendations } = body

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Enhanced prompt for comprehensive CV generation
    const enhancedPrompt = `
You are a professional CV writer and career consultant. Based on the following information, generate a comprehensive CV with all sections filled out professionally. Include recommendations if provided.

User Input: ${prompt}

${recommendations ? `Recommendations/References: ${recommendations}` : ""}

Please generate a complete CV with the following structure and return it as a JSON object:

{
  "personal": {
    "name": "Full name extracted or generated",
    "email": "Professional email",
    "phone": "Phone number",
    "location": "City, Country",
    "summary": "Professional summary (3-4 sentences highlighting key strengths and career goals)",
    "linkedin": "LinkedIn profile URL if mentioned",
    "portfolio": "Portfolio/website URL if relevant"
  },
  "experience": {
    "job-title-1": "Most recent job title",
    "company-1": "Company name",
    "location-1": "City, Country",
    "start-date-1": "YYYY-MM format",
    "end-date-1": "YYYY-MM format or empty if current",
    "description-1": "Detailed description with 3-4 bullet points of achievements and responsibilities",
    "job-title-2": "Previous job title (if applicable)",
    "company-2": "Previous company name",
    "location-2": "City, Country",
    "start-date-2": "YYYY-MM format",
    "end-date-2": "YYYY-MM format",
    "description-2": "Detailed description with achievements"
  },
  "education": {
    "degree": "Highest degree obtained",
    "institution": "University/College name",
    "location-edu": "City, Country",
    "start-date-edu": "YYYY-MM format",
    "end-date-edu": "YYYY-MM format",
    "gpa": "GPA if mentioned",
    "honors": "Any honors or distinctions"
  },
  "skills": {
    "skills-list": "A single comma-separated string of technical skills. Do NOT use bullet points or JSON arrays. Example: Python, TensorFlow, PyTorch, SQL, Docker"
  },
  "projects": {
    "project-1": "Project name",
    "project-description-1": "Brief description of the project and your role",
    "project-technologies-1": "Technologies used",
    "project-2": "Second project name if applicable",
    "project-description-2": "Description of second project",
    "project-technologies-2": "Technologies used"
  },
  "achievements": {
    "awards": "Professional awards or recognitions",
    "publications": "Publications or articles if any",
    "volunteer": "Volunteer work or community involvement"
  },
  "recommendations": {
    "recommendation-1": "First recommendation with recommender name and title",
    "recommendation-2": "Second recommendation if provided"
  }
}

Guidelines:
1. Make the content professional and ATS-friendly
2. Use action verbs and quantify achievements where possible
3. Ensure consistency in formatting and dates
4. If information is missing, generate realistic and relevant content based on the context
5. Keep descriptions concise but impactful
6. Include industry-specific keywords relevant to the role
7. Make sure all dates are in YYYY-MM format
8. If no specific experience is mentioned, create relevant examples based on the field/role mentioned

Return only the JSON object, no additional text or formatting.
`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const text = response.text()

    // Parse the AI response
    let cvData
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cvData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No valid JSON found in response")
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      return NextResponse.json({ success: false, error: "Failed to parse AI response" }, { status: 500 })
    }

    // Generate HTML content based on template
    const htmlContent = generateHTMLContent(cvData, templateId)

    return NextResponse.json({
      success: true,
      data: cvData,
      templateId,
      htmlContent,
      createdAt: new Date().toISOString(),
      aiGenerated: true,
    })
  } catch (error) {
    console.error("Error generating CV with AI:", error)
    return NextResponse.json({ success: false, error: "Failed to generate CV with AI" }, { status: 500 })
  }
}

function generateHTMLContent(data: any, templateId: string): string {
  // Basic HTML template - in production, you'd have different templates
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.personal?.name || "Professional CV"}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
        .experience-item, .education-item, .project-item { margin-bottom: 20px; }
        .job-title { font-weight: bold; color: #2980b9; }
        .company { font-style: italic; }
        .date { color: #7f8c8d; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-tag { background: #ecf0f1; padding: 5px 10px; border-radius: 5px; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.personal?.name || "Professional CV"}</h1>
        <p>${data.personal?.email || ""} | ${data.personal?.phone || ""} | ${data.personal?.location || ""}</p>
        ${data.personal?.linkedin ? `<p>LinkedIn: ${data.personal.linkedin}</p>` : ""}
        ${data.personal?.portfolio ? `<p>Portfolio: ${data.personal.portfolio}</p>` : ""}
      </div>

      ${data.personal?.summary
      ? `
      <div class="section">
        <h2>Professional Summary</h2>
        <p>${data.personal.summary}</p>
      </div>
      `
      : ""
    }

      <div class="section">
        <h2>Work Experience</h2>
        ${Object.keys(data.experience || {})
      .filter((key) => key.includes("job-title"))
      .map((key) => {
        const index = key.split("-")[2]
        return `
            <div class="experience-item">
              <div class="job-title">${data.experience[key] || ""}</div>
              <div class="company">${data.experience[`company-${index}`] || ""} - ${data.experience[`location-${index}`] || ""}</div>
              <div class="date">${data.experience[`start-date-${index}`] || ""} - ${data.experience[`end-date-${index}`] || "Present"}</div>
              <p>${data.experience[`description-${index}`] || ""}</p>
            </div>
            `
      })
      .join("")}
      </div>

      ${data.education
      ? `
      <div class="section">
        <h2>Education</h2>
        <div class="education-item">
          <div class="job-title">${data.education.degree || ""}</div>
          <div class="company">${data.education.institution || ""} - ${data.education["location-edu"] || ""}</div>
          <div class="date">${data.education["start-date-edu"] || ""} - ${data.education["end-date-edu"] || ""}</div>
          ${data.education.gpa ? `<p>GPA: ${data.education.gpa}</p>` : ""}
          ${data.education.honors ? `<p>Honors: ${data.education.honors}</p>` : ""}
        </div>
      </div>
      `
      : ""
    }

      ${data.skills
      ? `
      <div class="section">
        <h2>Skills</h2>
        ${data.skills["technical-skills"] ? `<p><strong>Technical Skills:</strong> ${data.skills["technical-skills"]}</p>` : ""}
        ${data.skills["soft-skills"] ? `<p><strong>Soft Skills:</strong> ${data.skills["soft-skills"]}</p>` : ""}
        ${data.skills.languages ? `<p><strong>Languages:</strong> ${data.skills.languages}</p>` : ""}
        ${data.skills.certifications ? `<p><strong>Certifications:</strong> ${data.skills.certifications}</p>` : ""}
      </div>
      `
      : ""
    }

      ${data.projects
      ? `
      <div class="section">
        <h2>Projects</h2>
        ${Object.keys(data.projects)
        .filter((key) => key.startsWith("project-") && !key.includes("description") && !key.includes("technologies"))
        .map((key) => {
          const index = key.split("-")[1]
          return `
            <div class="project-item">
              <div class="job-title">${data.projects[key] || ""}</div>
              <p>${data.projects[`project-description-${index}`] || ""}</p>
              ${data.projects[`project-technologies-${index}`] ? `<p><strong>Technologies:</strong> ${data.projects[`project-technologies-${index}`]}</p>` : ""}
            </div>
            `
        })
        .join("")}
      </div>
      `
      : ""
    }

      ${data.achievements
      ? `
      <div class="section">
        <h2>Achievements</h2>
        ${data.achievements.awards ? `<p><strong>Awards:</strong> ${data.achievements.awards}</p>` : ""}
        ${data.achievements.publications ? `<p><strong>Publications:</strong> ${data.achievements.publications}</p>` : ""}
        ${data.achievements.volunteer ? `<p><strong>Volunteer Work:</strong> ${data.achievements.volunteer}</p>` : ""}
      </div>
      `
      : ""
    }

      ${data.recommendations
      ? `
      <div class="section">
        <h2>Recommendations</h2>
        ${Object.keys(data.recommendations)
        .map(
          (key) => `
          <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #2980b9;">
            <p>"${data.recommendations[key]}"</p>
          </div>
        `,
        )
        .join("")}
      </div>
      `
      : ""
    }
    </body>
    </html>
  `
}
