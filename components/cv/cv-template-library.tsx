"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Search } from "lucide-react"
import type { CVTemplate } from "@/types/interfaces"

// Sample template data
const templates: CVTemplate[] = [
  {
    id: "modern-1",
    name: "Modern Professional",
    category: "professional",
    thumbnail: "https://res.cloudinary.com/da0uq57dc/image/upload/v1750566942/Screenshot_2025-06-22_at_11.32.16_pou1f3.png",
    htmlTemplate: `
      <div class="cv-template modern-professional">
        <header>
          <h1>{{name}}</h1>
          <p class="subtitle">{{location}}</p>
          <div class="contact-info">
            <p>{{email}}</p>
            <p>{{phone}}</p>
          </div>
        </header>
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>{{summary}}</p>
        </section>
        <section class="experience">
          <h2>Experience</h2>
          {{#each experience}}
            <div class="job">
              <div class="job-header">
                <h3>{{jobTitle}}</h3>
                <p class="date">{{startDate}} - {{endDate}}</p>
              </div>
              <p class="company">{{company}}, {{location}}</p>
              <p class="description">{{description}}</p>
            </div>
          {{/each}}
        </section>
        <section class="education">
          <h2>Education</h2>
          <div class="education-item">
            <div class="education-header">
              <h3>{{degree}}</h3>
              <p class="date">{{educationStartDate}} - {{educationEndDate}}</p>
            </div>
            <p class="institution">{{institution}}, {{educationLocation}}</p>
          </div>
        </section>
        <section class="skills">
          <h2>Skills</h2>
          <div class="skills-list">
            {{#each skills}}
              <span class="skill">{{this}}</span>
            {{/each}}
          </div>
        </section>
      </div>
    `,
    isPremium: false,
  },
  {
    id: "classic-1",
    name: "Classic Elegant",
    category: "traditional",
    thumbnail: "https://res.cloudinary.com/da0uq57dc/image/upload/v1750566942/Screenshot_2025-06-22_at_11.32.51_dggmqg.png",
    htmlTemplate: `
      <div class="cv-template classic-elegant">
        <header class="text-center">
          <h1>{{name}}</h1>
          <div class="contact-info">
            <p>{{email}} | {{phone}} | {{location}}</p>
          </div>
        </header>
        <section class="summary">
          <h2>PROFESSIONAL SUMMARY</h2>
          <p>{{summary}}</p>
        </section>
        <section class="experience">
          <h2>EXPERIENCE</h2>
          {{#each experience}}
            <div class="job">
              <h3>{{jobTitle}}</h3>
              <p class="company">{{company}}, {{location}}</p>
              <p class="date"><em>{{startDate}} - {{endDate}}</em></p>
              <p class="description">{{description}}</p>
            </div>
          {{/each}}
        </section>
        <section class="education">
          <h2>EDUCATION</h2>
          <div class="education-item">
            <h3>{{degree}}</h3>
            <p class="institution">{{institution}}, {{educationLocation}}</p>
            <p class="date"><em>{{educationStartDate}} - {{educationEndDate}}</em></p>
          </div>
        </section>
        <section class="skills">
          <h2>SKILLS</h2>
          <p>{{skills}}</p>
        </section>
      </div>
    `,
    isPremium: false,
  },
  {
    id: "creative-1",
    name: "Creative Design",
    category: "creative",
    thumbnail: "https://res.cloudinary.com/da0uq57dc/image/upload/v1750566942/Screenshot_2025-06-22_at_11.33.10_sr28xb.png",
    htmlTemplate: `
      <div class="cv-template creative-design">
        <div class="sidebar">
          <div class="profile">
            <div class="profile-image">
              <div class="initials">{{initials}}</div>
            </div>
            <h1>{{name}}</h1>
            <p>{{location}}</p>
          </div>
          <div class="contact">
            <h2>CONTACT</h2>
            <p>{{email}}</p>
            <p>{{phone}}</p>
          </div>
          <div class="skills">
            <h2>SKILLS</h2>
            <div class="skills-list">
              {{#each skills}}
                <span class="skill">{{this}}</span>
              {{/each}}
            </div>
          </div>
        </div>
        <div class="main-content">
          <section class="about">
            <h2>ABOUT ME</h2>
            <p>{{summary}}</p>
          </section>
          <section class="experience">
            <h2>EXPERIENCE</h2>
            {{#each experience}}
              <div class="job">
                <div class="job-header">
                  <h3>{{jobTitle}}</h3>
                  <div class="date-badge">{{startDate}} - {{endDate}}</div>
                </div>
                <p class="company">{{company}}, {{location}}</p>
                <p class="description">{{description}}</p>
              </div>
            {{/each}}
          </section>
          <section class="education">
            <h2>EDUCATION</h2>
            <div class="education-item">
              <div class="education-header">
                <h3>{{degree}}</h3>
                <div class="date-badge">{{educationStartDate}} - {{educationEndDate}}</div>
              </div>
              <p class="institution">{{institution}}, {{educationLocation}}</p>
            </div>
          </section>
        </div>
      </div>
    `,
    isPremium: true,
  },
  {
    id: "minimal-1",
    name: "Minimal Clean",
    category: "minimal",
    thumbnail: "https://res.cloudinary.com/da0uq57dc/image/upload/v1750566942/Screenshot_2025-06-22_at_11.33.55_hmaygz.png",
    htmlTemplate: `
      <div class="cv-template minimal-clean">
        <header>
          <h1>{{name}}</h1>
          <div class="contact-info">
            <p>{{email}} · {{phone}} · {{location}}</p>
          </div>
        </header>
        <hr />
        <section class="summary">
          <p>{{summary}}</p>
        </section>
        <hr />
        <section class="experience">
          <h2>Experience</h2>
          {{#each experience}}
            <div class="job">
              <div class="job-header">
                <h3>{{jobTitle}} | {{company}}</h3>
                <p class="date">{{startDate}} – {{endDate}}</p>
              </div>
              <p class="location">{{location}}</p>
              <p class="description">{{description}}</p>
            </div>
          {{/each}}
        </section>
        <hr />
        <section class="education">
          <h2>Education</h2>
          <div class="education-item">
            <div class="education-header">
              <h3>{{degree}} | {{institution}}</h3>
              <p class="date">{{educationStartDate}} – {{educationEndDate}}</p>
            </div>
            <p class="location">{{educationLocation}}</p>
          </div>
        </section>
        <hr />
        <section class="skills">
          <h2>Skills</h2>
          <p>{{skills}}</p>
        </section>
      </div>
    `,
    isPremium: false,
  },
  {
    id: "tech-1",
    name: "Tech Professional",
    category: "professional",
    thumbnail: "https://res.cloudinary.com/da0uq57dc/image/upload/v1750566942/Screenshot_2025-06-22_at_11.34.17_bkfi9i.png",
    htmlTemplate: `
      <div class="cv-template tech-professional">
        <header>
          <div class="header-content">
            <h1>{{name}}</h1>
            <p class="subtitle">{{location}}</p>
          </div>
          <div class="contact-info">
            <p>{{email}}</p>
            <p>{{phone}}</p>
          </div>
        </header>
        <section class="skills">
          <h2>Technical Skills</h2>
          <div class="skills-list">
            {{#each skills}}
              <span class="skill">{{this}}</span>
            {{/each}}
          </div>
        </section>
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>{{summary}}</p>
        </section>
        <section class="experience">
          <h2>Work Experience</h2>
          {{#each experience}}
            <div class="job">
              <div class="job-header">
                <h3>{{jobTitle}}</h3>
                <p class="date">{{startDate}} - {{endDate}}</p>
              </div>
              <p class="company">{{company}} | {{location}}</p>
              <p class="description">{{description}}</p>
            </div>
          {{/each}}
        </section>
        <section class="education">
          <h2>Education</h2>
          <div class="education-item">
            <div class="education-header">
              <h3>{{degree}}</h3>
              <p class="date">{{educationStartDate}} - {{educationEndDate}}</p>
            </div>
            <p class="institution">{{institution}} | {{educationLocation}}</p>
          </div>
        </section>
      </div>
    `,
    isPremium: true,
  },
  {
    id: "executive-1",
    name: "Executive Resume",
    category: "professional",
    thumbnail: "https://res.cloudinary.com/da0uq57dc/image/upload/v1750566942/Screenshot_2025-06-22_at_11.34.17_bkfi9i.png",
    htmlTemplate: `
      <div class="cv-template executive-resume">
        <header>
          <h1>{{name}}</h1>
          <p class="subtitle">{{location}}</p>
          <div class="contact-info">
            <p>{{email}} | {{phone}}</p>
          </div>
        </header>
        <section class="summary">
          <h2>Executive Summary</h2>
          <p>{{summary}}</p>
        </section>
        <section class="experience">
          <h2>Professional Experience</h2>
          {{#each experience}}
            <div class="job">
              <div class="job-header">
                <h3>{{company}}</h3>
                <p class="date">{{startDate}} - {{endDate}}</p>
              </div>
              <p class="job-title"><strong>{{jobTitle}}</strong> | {{location}}</p>
              <p class="description">{{description}}</p>
            </div>
          {{/each}}
        </section>
        <section class="education">
          <h2>Education</h2>
          <div class="education-item">
            <h3>{{degree}}</h3>
            <p class="institution">{{institution}}, {{educationLocation}}</p>
            <p class="date">{{educationStartDate}} - {{educationEndDate}}</p>
          </div>
        </section>
        <section class="skills">
          <h2>Core Competencies</h2>
          <div class="skills-list">
            {{#each skills}}
              <span class="skill">{{this}}</span>
            {{/each}}
          </div>
        </section>
      </div>
    `,
    isPremium: true,
  },
]

interface CVTemplateLibraryProps {
  onSelectTemplate: (template: CVTemplate) => void
  selectedTemplateId?: string
}

export default function CVTemplateLibrary({ onSelectTemplate, selectedTemplateId }: CVTemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "professional", name: "Professional" },
    { id: "traditional", name: "Traditional" },
    { id: "creative", name: "Creative" },
    { id: "minimal", name: "Minimal" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose a CV Template</CardTitle>
          <CardDescription>Select a template to get started with your CV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`overflow-hidden cursor-pointer transition-all ${selectedTemplateId === template.id ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md"
                    }`}
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="relative">
                    <img
                      src={template.thumbnail || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-48 object-cover"
                    />
                    {template.isPremium && <Badge className="absolute top-2 right-2 bg-amber-500">Premium</Badge>}
                    {selectedTemplateId === template.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardFooter className="p-3">
                    <p className="font-medium text-sm">{template.name}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
