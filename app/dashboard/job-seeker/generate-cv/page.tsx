"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, Plus, Trash2, Download, Share, FileText, Wand2, Library } from "lucide-react"
import CVTemplateLibrary from "@/components/cv/cv-template-library"
import CVPreview from "@/components/cv/cv-preview"
import { generateCV, generateFieldContent } from "@/services/cvService"
import type { ICVTemplate } from "@/types/interfaces"
import toast from "react-hot-toast"
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { useRef } from "react";
import { useAuth } from "@/hooks/use-auth"

interface FormSection {
  id: string
  title: string
  fields: FormField[]
}

interface FormField {
  id: string
  label: string
  type: "text" | "textarea" | "date" | "email" | "tel"
  placeholder: string
  value: string
}

export default function GenerateCVPage() {

  const [activeTab, setActiveTab] = useState("cv-template")
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCV, setGeneratedCV] = useState<any>(null)
  const [aiPrompt, setAiPrompt] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<ICVTemplate | null>(null)
  const [isGeneratingField, setIsGeneratingField] = useState<string | null>(null)
  const cvRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<FormSection[]>([
    {
      id: "personal",
      title: "Personal Details",
      fields: [
        { id: "name", label: "Full Name", type: "text", placeholder: "John Doe", value: "" },
        { id: "email", label: "Email Address", type: "email", placeholder: "john@example.com", value: "" },
        { id: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 123-4567", value: "" },
        { id: "location", label: "Location", type: "text", placeholder: "New York, USA", value: "" },
        {
          id: "summary",
          label: "Professional Summary",
          type: "textarea",
          placeholder: "A brief summary of your professional background and goals...",
          value: "",
        },
      ],
    },
    {
      id: "experience",
      title: "Work Experience",
      fields: [
        { id: "job-title-1", label: "Job Title", type: "text", placeholder: "Software Engineer", value: "" },
        { id: "company-1", label: "Company", type: "text", placeholder: "Acme Inc.", value: "" },
        { id: "location-1", label: "Location", type: "text", placeholder: "San Francisco, CA", value: "" },
        { id: "start-date-1", label: "Start Date", type: "date", placeholder: "2020-01", value: "" },
        { id: "end-date-1", label: "End Date", type: "date", placeholder: "2023-01", value: "" },
        {
          id: "description-1",
          label: "Description",
          type: "textarea",
          placeholder: "Describe your responsibilities and achievements...",
          value: "",
        },
      ],
    },
    {
      id: "education",
      title: "Education",
      fields: [
        {
          id: "degree",
          label: "Degree",
          type: "text",
          placeholder: "Bachelor of Science in Computer Science",
          value: "",
        },
        { id: "institution", label: "Institution", type: "text", placeholder: "University of Technology", value: "" },
        { id: "location-edu", label: "Location", type: "text", placeholder: "Boston, MA", value: "" },
        { id: "start-date-edu", label: "Start Date", type: "date", placeholder: "2016-09", value: "" },
        { id: "end-date-edu", label: "End Date", type: "date", placeholder: "2020-05", value: "" },
      ],
    },
    {
      id: "skills",
      title: "Skills",
      fields: [
        {
          id: "skills-list",
          label: "Skills",
          type: "textarea",
          placeholder: "List your skills separated by commas (e.g., JavaScript, React, Node.js, Project Management)",
          value: "",
        },
      ],
    },
  ])

  const { user } = useAuth()

  const handleFieldChange = (sectionId: string, fieldId: string, value: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map((field) => {
              if (field.id === fieldId) {
                return { ...field, value }
              }
              return field
            }),
          }
        }
        return section
      }),
    )
  }

  const handleGenerateFieldContent = async (sectionId: string, fieldId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    const field = section?.fields.find((f) => f.id === fieldId)

    if (!field) return

    setIsGeneratingField(fieldId)

    try {
      // Get context from other filled fields
      const context = sections.reduce((acc, section) => {
        const sectionData = section.fields.reduce((fieldAcc, field) => {
          if (field.value) {
            return { ...fieldAcc, [field.id]: field.value }
          }
          return fieldAcc
        }, {})
        return { ...acc, [section.id]: sectionData }
      }, {})

      const result = await generateFieldContent(fieldId, field.label, context)

      if (result && result.content) {
        handleFieldChange(sectionId, fieldId, result.content)
        toast.success(`AI-generated content for ${field.label} has been added.`
        )
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.")
    } finally {
      setIsGeneratingField(null)
    }
  }

  const addExperienceSection = () => {
    const experienceSection = sections.find((section) => section.id === "experience")
    if (!experienceSection) return

    const newIndex = experienceSection.fields.length / 6 + 1
    const newFields = [
      { id: `job-title-${newIndex}`, label: "Job Title", type: "text", placeholder: "Software Engineer", value: "" },
      { id: `company-${newIndex}`, label: "Company", type: "text", placeholder: "Acme Inc.", value: "" },
      { id: `location-${newIndex}`, label: "Location", type: "text", placeholder: "San Francisco, CA", value: "" },
      { id: `start-date-${newIndex}`, label: "Start Date", type: "date", placeholder: "2020-01", value: "" },
      { id: `end-date-${newIndex}`, label: "End Date", type: "date", placeholder: "2023-01", value: "" },
      {
        id: `description-${newIndex}`,
        label: "Description",
        type: "textarea",
        placeholder: "Describe your responsibilities and achievements...",
        value: "",
      },
    ] as FormField[]

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === "experience") {
          return {
            ...section,
            fields: [...section.fields, ...newFields],
          }
        }
        return section
      }),
    )
  }

  const removeExperienceSection = (index: number) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === "experience") {
          const startIdx = index * 6
          const endIdx = startIdx + 6
          return {
            ...section,
            fields: section.fields.filter((_, idx) => idx < startIdx || idx >= endIdx),
          }
        }
        return section
      }),
    )
  }

  const handleNext = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSelectTemplate = (template: ICVTemplate) => {
    setSelectedTemplate(template)
    toast.success(`You've selected the ${template.name} template.`
    )
  }

  const handleGenerateCV = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a CV template first.")
      return
    }

    setIsGenerating(true)

    try {
      // Format the data for CV generation
      const formData = sections.reduce((acc, section) => {
        const sectionData = section.fields.reduce((fieldAcc, field) => {
          return { ...fieldAcc, [field.id]: field.value }
        }, {})
        return { ...acc, [section.id]: sectionData }
      }, {})

      // Call the CV generation service
      const result = await generateCV({
        data: formData,
        templateId: selectedTemplate._id,
      })

      setGeneratedCV(result)

      toast.success("Your CV has been generated. You can now download or share it.")
    } catch (error) {
      toast.error("There was an error generating your CV. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateWithAI = async () => {
    if (!aiPrompt) {
      toast.error("Please enter a prompt to generate your CV with AI.")
      return
    }

    if (!selectedTemplate) {
      toast.error("Please select a CV template first.")
      return
    }

    setIsGenerating(true)

    try {
      // Call the AI CV generation service
      const result = await generateCV(
        {
          prompt: aiPrompt,
          templateId: selectedTemplate._id,
        },
        true,
      )

      setGeneratedCV(result)

      // Populate the form with AI-generated data
      const aiData = result.data
      setSections((prevSections) =>
        prevSections.map((section) => {
          if (aiData[section.id]) {
            return {
              ...section,
              fields: section.fields.map((field) => {
                const aiValue = aiData[section.id][field.id] || ""
                return { ...field, value: aiValue }
              }),
            }
          }
          return section
        }),
      )

      toast.success("Your CV has been generated using AI. You can now edit, download, or share it."
      )
    } catch (error) {
      toast.error("There was an error generating your CV with AI. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadCV = () => {

    if (!cvRef.current) return;

    const sanitizeFilename = (name: string) =>
      name.replace(/[^a-z0-9_\- ]/gi, '').trim().replace(/\s+/g, ' ');
    const fullName = user?.name || "Unnamed";
    const fileName = `${sanitizeFilename(fullName)} - CV - by JobWinner.pdf`;

    const element = cvRef.current as HTMLDivElement;
    const originalHeight = element.style.height;
    const scrollHeight = element.scrollHeight;
    element.style.height = `${element.scrollHeight}px`;
    console.log("scrollHeight", element.style.height);

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        useCORS: true,
      },
      jsPDF: {
        unit: 'px',
        format: [element.offsetWidth, scrollHeight],
        orientation: 'portrait',
      },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast("Your CV is being downloaded as a PDF.");
        element.style.height = originalHeight;
      })
      .catch((err: any) => {
        toast.error("Something went wrong while generating the PDF.");
        console.error(err);
      });
  }

  const handleShareCV = () => {
    // In a real app, this would open a share dialog
    toast.success("Your CV sharing link has been copied to clipboard."
    )
  }
  console.log("selectedTemplate", selectedTemplate)


  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Generate Your CV</h1>
          <p className="text-gray-600">Create a professional CV in minutes with our easy-to-use builder</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cv-template" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              CV Template
            </TabsTrigger>
            <TabsTrigger value="cv-editor" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              CV Editor
            </TabsTrigger>
            <TabsTrigger value="ai-resume-builder" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              AI Resume Builder
            </TabsTrigger>
            {/* <TabsTrigger value="proposal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Proposal
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Settings
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="cv-template" className="space-y-6">
            <CVTemplateLibrary onSelectTemplate={handleSelectTemplate} selectedTemplateId={selectedTemplate?._id} />
          </TabsContent>

          <TabsContent value="cv-editor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{sections[currentStep].title}</CardTitle>
                    <CardDescription>
                      Step {currentStep + 1} of {sections.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sections[currentStep].fields.map((field, fieldIndex) => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label htmlFor={field.id}>{field.label}</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerateFieldContent(sections[currentStep].id, field.id)}
                              disabled={isGeneratingField === field.id}
                              className="h-8 px-2 text-xs"
                            >
                              {isGeneratingField === field.id ? "Generating..." : "✨ Generate with AI"}
                            </Button>
                          </div>
                          {field.type === "textarea" ? (
                            <Textarea
                              id={field.id}
                              placeholder={field.placeholder}
                              value={field.value}
                              onChange={(e) => handleFieldChange(sections[currentStep].id, field.id, e.target.value)}
                              rows={4}
                            />
                          ) : (
                            <Input
                              id={field.id}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={field.value}
                              onChange={(e) => handleFieldChange(sections[currentStep].id, field.id, e.target.value)}
                            />
                          )}
                        </div>
                      ))}

                      {sections[currentStep].id === "experience" && (
                        <div className="pt-4">
                          <Separator className="my-4" />
                          <div className="flex justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addExperienceSection}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" /> Add Another Experience
                            </Button>
                            {sections[currentStep].fields.length > 6 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeExperienceSection(1)}
                                className="flex items-center gap-1 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" /> Remove Last Experience
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    {currentStep < sections.length - 1 ? (
                      <Button type="button" onClick={handleNext} className="flex items-center gap-1">
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleGenerateCV}
                        disabled={isGenerating || !selectedTemplate}
                        className="flex items-center gap-1"
                      >
                        {isGenerating ? "Generating..." : "Generate CV"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>CV Preview</CardTitle>
                    <CardDescription>See how your CV will look</CardDescription>
                  </CardHeader>
                  <CardContent
                    ref={cvRef}
                    className="h-[600px] overflow-auto border rounded-md bg-white">
                    <CVPreview data={sections} generatedCV={generatedCV} template={selectedTemplate} />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleShareCV}
                      disabled={!generatedCV}
                      className="flex items-center gap-1"
                    >
                      <Share className="h-4 w-4" /> Share
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDownloadCV}
                      disabled={!generatedCV}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-resume-builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>AI Resume Builder</CardTitle>
                    <CardDescription>Let AI generate your CV based on your description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ai-prompt">Describe your experience and skills</Label>
                        <Textarea
                          id="ai-prompt"
                          placeholder="I'm a software engineer with 5 years of experience in React and Node.js. I've worked at companies like Acme Inc. and Tech Solutions..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          rows={10}
                        />
                        <p className="text-xs text-gray-500">
                          Include your work experience, education, skills, and any other relevant information. The more
                          details you provide, the better the AI can generate your CV.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      onClick={handleGenerateWithAI}
                      disabled={isGenerating || !aiPrompt || !selectedTemplate}
                      className="w-full flex items-center gap-1"
                    >
                      <Wand2 className="h-4 w-4" />
                      {isGenerating ? "Generating..." : "Generate with AI"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>CV Preview</CardTitle>
                    <CardDescription>See how your CV will look</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[600px] overflow-auto border rounded-md bg-white">
                    <CVPreview data={sections} generatedCV={generatedCV} template={selectedTemplate} />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleShareCV}
                      disabled={!generatedCV}
                      className="flex items-center gap-1"
                    >
                      <Share className="h-4 w-4" /> Share
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDownloadCV}
                      disabled={!generatedCV}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* <TabsContent value="proposal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Proposal Generator</CardTitle>
                <CardDescription>Create professional proposals for your clients</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">Proposal generator coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Customize your CV generation preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">Settings panel coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </main>
  )
}
