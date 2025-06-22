"use client"

import { useState, useEffect } from "react"
import { formatDate } from "@/utils"
import type { CVTemplate } from "@/types/interfaces"

interface CVPreviewProps {
  data: any[]
  generatedCV: any
  template: CVTemplate | null
}

export default function CVPreview({ data, generatedCV, template }: CVPreviewProps) {
  const [renderedHTML, setRenderedHTML] = useState<string>("")

  // Extract data from form sections
  const personalSection = data.find((section) => section.id === "personal")
  const experienceSection = data.find((section) => section.id === "experience")
  const educationSection = data.find((section) => section.id === "education")
  const skillsSection = data.find((section) => section.id === "skills")

  const getFieldValue = (section: any, fieldId: string) => {
    const field = section?.fields.find((f: any) => f.id === fieldId)
    return field?.value || ""
  }

  const name = getFieldValue(personalSection, "name")
  const email = getFieldValue(personalSection, "email")
  const phone = getFieldValue(personalSection, "phone")
  const location = getFieldValue(personalSection, "location")
  const summary = getFieldValue(personalSection, "summary")
  const skillsList = getFieldValue(skillsSection, "skills-list")
  const skills = skillsList
    .split(",")
    .map((skill: string) => skill.trim())
    .filter((skill: string) => skill)

  // Group experience fields into job entries
  interface Experience {
    jobTitle: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string
  }

  const experiences: Experience[] = []
  if (experienceSection) {
    const fieldCount = experienceSection.fields.length
    const jobCount = fieldCount / 6

    for (let i = 0; i < jobCount; i++) {
      const jobTitle = getFieldValue(experienceSection, `job-title-${i + 1}`)
      if (jobTitle) {
        experiences.push({
          jobTitle,
          company: getFieldValue(experienceSection, `company-${i + 1}`),
          location: getFieldValue(experienceSection, `location-${i + 1}`),
          startDate: getFieldValue(experienceSection, `start-date-${i + 1}`),
          endDate: getFieldValue(experienceSection, `end-date-${i + 1}`),
          description: getFieldValue(experienceSection, `description-${i + 1}`),
        })
      }
    }
  }

  const education = {
    degree: getFieldValue(educationSection, "degree"),
    institution: getFieldValue(educationSection, "institution"),
    location: getFieldValue(educationSection, "location-edu"),
    startDate: getFieldValue(educationSection, "start-date-edu"),
    endDate: getFieldValue(educationSection, "end-date-edu"),
  }

  useEffect(() => {
    if (template && template.htmlTemplate) {
      // Simple template rendering - in a real app, use a proper template engine
      let html = template.htmlTemplate

      // Replace personal details
      html = html.replace(/{{name}}/g, name || "[Your Name]")
      html = html.replace(/{{email}}/g, email || "[Your Email]")
      html = html.replace(/{{phone}}/g, phone || "[Your Phone]")
      html = html.replace(/{{location}}/g, location || "[Your Location]")
      html = html.replace(/{{summary}}/g, summary || "[Your Professional Summary]")

      // Replace education
      html = html.replace(/{{degree}}/g, education.degree || "[Your Degree]")
      html = html.replace(/{{institution}}/g, education.institution || "[Your Institution]")
      html = html.replace(/{{educationLocation}}/g, education.location || "[Education Location]")
      html = html.replace(
        /{{educationStartDate}}/g,
        education.startDate ? formatDate(education.startDate) : "[Start Date]",
      )
      html = html.replace(/{{educationEndDate}}/g, education.endDate ? formatDate(education.endDate) : "Present")

      // Replace skills
      html = html.replace(/{{skills}}/g, skills.join(", ") || "[Your Skills]")

      // Handle initials for templates that use them
      const initials = name
        ? name
          .split(" ")
          .map((n: any) => n[0])
          .join("")
        : "JD"
      html = html.replace(/{{initials}}/g, initials)

      // Handle experience sections - this is a simplified version
      // In a real app, you'd use a proper template engine like Handlebars
      if (experiences.length > 0) {
        let experienceHTML = ""
        experiences.forEach((exp) => {
          let expTemplate = html.match(/{{#each experience}}([\s\S]*?){{\/each}}/)?.[1] || ""

          if (expTemplate) {
            expTemplate = expTemplate.replace(/{{jobTitle}}/g, exp.jobTitle || "[Job Title]")
            expTemplate = expTemplate.replace(/{{company}}/g, exp.company || "[Company]")
            expTemplate = expTemplate.replace(/{{location}}/g, exp.location || "[Location]")
            expTemplate = expTemplate.replace(
              /{{startDate}}/g,
              exp.startDate ? formatDate(exp.startDate) : "[Start Date]",
            )
            expTemplate = expTemplate.replace(/{{endDate}}/g, exp.endDate ? formatDate(exp.endDate) : "Present")
            expTemplate = expTemplate.replace(/{{description}}/g, exp.description || "[Job Description]")

            experienceHTML += expTemplate
          }
        })

        html = html.replace(/{{#each experience}}[\s\S]*?{{\/each}}/g, experienceHTML)
      } else {
        html = html.replace(/{{#each experience}}[\s\S]*?{{\/each}}/g, "<p>[Add your work experience]</p>")
      }

      // Handle skills list with each
      if (skills.length > 0) {
        let skillsHTML = ""
        const skillTemplate = html.match(/{{#each skills}}([\s\S]*?){{\/each}}/)?.[1] || ""

        if (skillTemplate) {
          skills.forEach((skill: any) => {
            skillsHTML += skillTemplate.replace(/{{this}}/g, skill)
          })

          html = html.replace(/{{#each skills}}[\s\S]*?{{\/each}}/g, skillsHTML)
        }
      } else {
        html = html.replace(/{{#each skills}}[\s\S]*?{{\/each}}/g, '<span class="skill">[Your Skills]</span>')
      }

      // Add CSS for the template
      html = `
        <style>
          .cv-template {
            font-family: 'Inter', sans-serif;
            color: #333;
            line-height: 1.5;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .cv-template h1 {
            font-size: 24px;
            margin-bottom: 5px;
          }
          
          .cv-template h2 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          
          .cv-template h3 {
            font-size: 16px;
            margin-bottom: 5px;
          }
          
          .cv-template p {
            margin-bottom: 10px;
          }
          
          .cv-template .job, .cv-template .education-item {
            margin-bottom: 20px;
          }
          
          .cv-template .job-header, .cv-template .education-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          
          .cv-template .date {
            color: #666;
            font-size: 14px;
          }
          
          .cv-template .company, .cv-template .institution {
            font-weight: 500;
          }
          
          .cv-template .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .cv-template .skill {
            background-color: #f0f0f0;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
          }
          
          /* Modern Professional Template */
          .modern-professional header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
          }
          
          /* Classic Elegant Template */
          .classic-elegant {
            text-align: left;
          }
          
          .classic-elegant header {
            text-align: center;
            margin-bottom: 20px;
          }
          
          /* Creative Design Template */
          .creative-design {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 20px;
          }
          
          .creative-design .sidebar {
            background-color: #f5f5f5;
            padding: 20px;
          }
          
          .creative-design .profile-image {
            width: 100px;
            height: 100px;
            background-color: teal;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
          }
          
          .creative-design .initials {
            color: white;
            font-size: 36px;
            font-weight: bold;
          }
          
          .creative-design .date-badge {
            background-color: teal;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          /* Minimal Clean Template */
          .minimal-clean hr {
            border: none;
            border-top: 1px solid #eee;
            margin: 15px 0;
          }
          
          /* Tech Professional Template */
          .tech-professional header {
            display: flex;
            justify-content: space-between;
            background-color: #f0f0f0;
            padding: 20px;
            margin-bottom: 20px;
          }
          
          /* Executive Resume Template */
          .executive-resume .job-title {
            margin-top: 5px;
          }
        </style>
        ${html}
      `

      setRenderedHTML(html)
    }
  }, [template, name, email, phone, location, summary, skills, experiences])

  if (!name && !generatedCV && !template) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p className="text-center">Select a template and fill in the form to see your CV preview</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p className="text-center">Please select a CV template first</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="cv-preview-container" dangerouslySetInnerHTML={{ __html: renderedHTML }} />
    </div>
  )
}
