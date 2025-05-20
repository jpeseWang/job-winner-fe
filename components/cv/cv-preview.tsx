"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/utils"

interface CVPreviewProps {
  data: any[]
  generatedCV: any
}

export default function CVPreview({ data, generatedCV }: CVPreviewProps) {
  const [template, setTemplate] = useState("modern")

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
  const skills = getFieldValue(skillsSection, "skills-list")
    .split(",")
    .map((skill: string) => skill.trim())
    .filter((skill: string) => skill)

  // Group experience fields into job entries
  const experiences = []
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

  if (!name && !generatedCV) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p className="text-center">Fill in the form to see your CV preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={template} onValueChange={setTemplate} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modern">Modern</TabsTrigger>
          <TabsTrigger value="classic">Classic</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="p-6 bg-white shadow-sm">
        {template === "modern" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-gray-600 mt-1">{location}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-gray-700">{email}</p>
                <p className="text-gray-700">{phone}</p>
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-1">Professional Summary</h2>
                <p className="text-gray-700">{summary}</p>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-1">Experience</h2>
                {experiences.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-gray-600 text-sm">
                        {exp.startDate && formatDate(exp.startDate)} -{" "}
                        {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </p>
                    </div>
                    <p className="text-gray-700">
                      {exp.company}, {exp.location}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {education.degree && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-1">Education</h2>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">{education.degree}</h3>
                    <p className="text-gray-600 text-sm">
                      {education.startDate && formatDate(education.startDate)} -{" "}
                      {education.endDate ? formatDate(education.endDate) : "Present"}
                    </p>
                  </div>
                  <p className="text-gray-700">
                    {education.institution}, {education.location}
                  </p>
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-1">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {template === "classic" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b pb-6">
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
              <div className="mt-2 flex flex-wrap justify-center gap-x-4 text-gray-600">
                {email && <p>{email}</p>}
                {phone && <p>{phone}</p>}
                {location && <p>{location}</p>}
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900 uppercase">Professional Summary</h2>
                <p className="text-gray-700">{summary}</p>
              </div>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 uppercase">Experience</h2>
                {experiences.map((exp, index) => (
                  <div key={index} className="space-y-1">
                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                    <p className="font-medium text-gray-700">
                      {exp.company}, {exp.location}
                    </p>
                    <p className="text-gray-600 italic">
                      {exp.startDate && formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                    </p>
                    <p className="text-gray-600 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {education.degree && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 uppercase">Education</h2>
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900">{education.degree}</h3>
                  <p className="font-medium text-gray-700">
                    {education.institution}, {education.location}
                  </p>
                  <p className="text-gray-600 italic">
                    {education.startDate && formatDate(education.startDate)} -{" "}
                    {education.endDate ? formatDate(education.endDate) : "Present"}
                  </p>
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900 uppercase">Skills</h2>
                <p className="text-gray-700">{skills.join(", ")}</p>
              </div>
            )}
          </div>
        )}

        {template === "creative" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="col-span-1 bg-teal-50 p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-teal-200 rounded-full flex items-center justify-center text-teal-800 text-2xl font-bold mb-4">
                  {name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <h1 className="text-xl font-bold text-gray-900">{name}</h1>
                <p className="text-gray-600 mt-1">{location}</p>
              </div>

              <div className="space-y-1 pt-4">
                <h2 className="text-sm font-semibold text-teal-800 uppercase tracking-wider">Contact</h2>
                {email && <p className="text-gray-700 text-sm">{email}</p>}
                {phone && <p className="text-gray-700 text-sm">{phone}</p>}
              </div>

              {skills.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h2 className="text-sm font-semibold text-teal-800 uppercase tracking-wider">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="col-span-2 p-6 space-y-6">
              {summary && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-teal-800 border-b border-teal-200 pb-1">About Me</h2>
                  <p className="text-gray-700">{summary}</p>
                </div>
              )}

              {experiences.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-teal-800 border-b border-teal-200 pb-1">Experience</h2>
                  {experiences.map((exp, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                        <div className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs">
                          {exp.startDate && formatDate(exp.startDate)} -{" "}
                          {exp.endDate ? formatDate(exp.endDate) : "Present"}
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {exp.company}, {exp.location}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {education.degree && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-teal-800 border-b border-teal-200 pb-1">Education</h2>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">{education.degree}</h3>
                      <div className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs">
                        {education.startDate && formatDate(education.startDate)} -{" "}
                        {education.endDate ? formatDate(education.endDate) : "Present"}
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium">
                      {education.institution}, {education.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
