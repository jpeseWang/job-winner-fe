import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fieldId, fieldLabel, context } = body

    if (!fieldId || !fieldLabel) {
      return NextResponse.json({ success: false, error: "Field ID and label are required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Create context-aware prompt for field generation
    const contextInfo = Object.entries(context)
      .map(([section, data]) => {
        if (typeof data === "object" && data !== null) {
          return `${section}: ${Object.entries(data)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")}`
        }
        return `${section}: ${data}`
      })
      .filter((info) => info.includes(":") && !info.endsWith(": "))
      .join("\n")

    let prompt = ""

    switch (fieldId) {
      case "summary":
        prompt = `Based on the following information, write a professional summary (3-4 sentences) for a CV:
${contextInfo}

Write a compelling professional summary that highlights key strengths, experience, and career goals. Make it ATS-friendly and impactful.`
        break

      case "description-1":
      case "description-2":
      case "description-3":
        const jobIndex = fieldId.split("-")[1]
        const jobTitle = context.experience?.[`job-title-${jobIndex}`] || "the position"
        const company = context.experience?.[`company-${jobIndex}`] || "the company"

        prompt = `Based on the following information, write a detailed job description for ${jobTitle} at ${company}:
${contextInfo}

Write 3-4 bullet points describing responsibilities and achievements. Use action verbs and quantify results where possible. Make it professional and ATS-friendly.`
        break

      case "skills-list":
        prompt = `Based on the following information, generate a comprehensive skills list:
${contextInfo}

Create a comma-separated list of relevant technical and soft skills. Include programming languages, tools, frameworks, and professional skills relevant to the person's field.`
        break

      case "degree":
        prompt = `Based on the following information, suggest an appropriate degree:
${contextInfo}

Suggest a realistic degree that would be relevant to this person's career and experience level.`
        break

      case "institution":
        prompt = `Based on the following information, suggest an appropriate educational institution:
${contextInfo}

Suggest a realistic university or college name that would be appropriate for this person's background and location.`
        break

      default:
        prompt = `Based on the following information, generate appropriate content for the field "${fieldLabel}":
${contextInfo}

Generate professional, relevant content that fits the context of a CV/resume.`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text().trim()

    return NextResponse.json({
      success: true,
      content,
      fieldId,
      fieldLabel,
    })
  } catch (error) {
    console.error("Error generating field content:", error)
    return NextResponse.json({ success: false, error: "Failed to generate field content" }, { status: 500 })
  }
}
