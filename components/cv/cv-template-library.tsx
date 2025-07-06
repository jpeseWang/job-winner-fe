"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Search } from "lucide-react"
import type { ICVTemplate } from "@/types/interfaces"
import { ETemplateCategory } from "@/types/enums"
import { useTemplates } from "@/hooks/use-templates"
// Sample template data
const templates: ICVTemplate[] = [
  // {
  //   id: "modern-1",
  //   name: "Modern Professional",
  //   category: ETemplateCategory.PROFESSIONAL,
  //   thumbnail: "https://res.cloudinary.com/da0uq57dc/image/upload/v1750566942/Screenshot_2025-06-22_at_11.32.16_pou1f3.png",
  //   htmlTemplate: `
  //     <div class="cv-template modern-professional">
  //       <header>
  //         <h1>{{name}}</h1>
  //         <p class="subtitle">{{location}}</p>
  //         <div class="contact-info">
  //           <p>{{email}}</p>
  //           <p>{{phone}}</p>
  //         </div>
  //       </header>
  //       <section class="summary">
  //         <h2>Professional Summary</h2>
  //         <p>{{summary}}</p>
  //       </section>
  //       <section class="experience">
  //         <h2>Experience</h2>
  //         {{#each experience}}
  //           <div class="job">
  //             <div class="job-header">
  //               <h3>{{jobTitle}}</h3>
  //               <p class="date">{{startDate}} - {{endDate}}</p>
  //             </div>
  //             <p class="company">{{company}}, {{location}}</p>
  //             <p class="description">{{description}}</p>
  //           </div>
  //         {{/each}}
  //       </section>
  //       <section class="education">
  //         <h2>Education</h2>
  //         <div class="education-item">
  //           <div class="education-header">
  //             <h3>{{degree}}</h3>
  //             <p class="date">{{educationStartDate}} - {{educationEndDate}}</p>
  //           </div>
  //           <p class="institution">{{institution}}, {{educationLocation}}</p>
  //         </div>
  //       </section>
  //       <section class="skills">
  //         <h2>Skills</h2>
  //         <div class="skills-list">
  //           {{#each skills}}
  //             <span class="skill">{{this}}</span>
  //           {{/each}}
  //         </div>
  //       </section>
  //     </div>
  //   `,
  //   isPremium: false,
  //   description: "ffd",

  // },

]



interface CVTemplateLibraryProps {
  onSelectTemplate: (template: ICVTemplate) => void
  selectedTemplateId?: string
}

export default function CVTemplateLibrary({ onSelectTemplate, selectedTemplateId }: CVTemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const {
    templates,
    pagination,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateStatus,
    duplicateTemplate,
    updateFilters,
  } = useTemplates({
    search: searchQuery,
    category: activeCategory === "all" ? undefined : activeCategory
    // ,
    // isPremium: typeFilter === "all" ? undefined : typeFilter === "premium",
  })

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: "all", name: "All" },
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "simple", name: "Simple" },
    { id: "modern", name: "Modern" },
    { id: "academic", name: "Academic" },
    { id: "executive", name: "Executive" },
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
              <TabsList className="grid grid-cols-7">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`overflow-hidden cursor-pointer transition-all ${selectedTemplateId === template.id ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md"
                    }`}
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="relative">
                    <img
                      src={template.previewImage || "/placeholder.svg"}
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
