"use client"

import { useState, useEffect } from "react"
import { formatDate } from "@/utils"
import type { ICVTemplate } from "@/types/interfaces"

interface CVPreviewProps {
  data: any[]
  generatedCV: any
  template: ICVTemplate | null
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
        ${template.cssStyles}
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
