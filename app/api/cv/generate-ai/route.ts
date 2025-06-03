import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, templateId } = body

    // In a real application, this would call an AI service to generate CV content
    // based on the user's prompt

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock data based on the prompt
    const mockData = {
      personal: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        summary:
          "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable and user-friendly applications.",
      },
      experience: {
        "job-title-1": "Senior Software Engineer",
        "company-1": "Tech Innovations Inc.",
        "location-1": "San Francisco, CA",
        "start-date-1": "2020-03",
        "end-date-1": "",
        "description-1":
          "Lead developer for the company's flagship product, managing a team of 5 engineers. Implemented microservices architecture that improved system reliability by 40%.",

        "job-title-2": "Software Developer",
        "company-2": "Digital Solutions LLC",
        "location-2": "Oakland, CA",
        "start-date-2": "2018-01",
        "end-date-2": "2020-02",
        "description-2":
          "Developed and maintained web applications using React and Node.js. Collaborated with UX designers to implement responsive designs and improve user experience.",
      },
      education: {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California",
        "location-edu": "Berkeley, CA",
        "start-date-edu": "2014-09",
        "end-date-edu": "2018-05",
      },
      skills: {
        "skills-list":
          "JavaScript, TypeScript, React, Node.js, Express, MongoDB, AWS, Docker, Git, Agile Methodologies, CI/CD, REST APIs, GraphQL",
      },
    }

    return NextResponse.json({
      success: true,
      data: mockData,
      templateId,
      htmlContent: "<div>AI-Generated CV HTML would be here</div>",
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating CV with AI:", error)
    return NextResponse.json({ success: false, error: "Failed to generate CV with AI" }, { status: 500 })
  }
}
