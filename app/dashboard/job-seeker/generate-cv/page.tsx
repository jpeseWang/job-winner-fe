"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  Share,
  FileText,
  Wand2,
  Library,
  Loader2,
  Lock,
  Crown,
  Save,
  Check,

} from "lucide-react"
import CVTemplateLibrary from "@/components/cv/cv-template-library"
import CVPreview from "@/components/cv/cv-preview"
import { generateCV, generateFieldContent, saveCV, getCVById } from "@/services/cvService"
import type { ICVTemplate } from "@/types/interfaces"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// @ts-ignore
import html2pdf from "html2pdf.js"
import { useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

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
  const planStyles: Record<string, { color: string; icon: JSX.Element }> = {
    free: {
      color: "text-blue-600 bg-blue-50 border-blue-200",
      icon: <Lock className="h-4 w-4 text-blue-600" />,
    },
    premium: {
      color: "text-purple-600 bg-purple-50 border-purple-200",
      icon: <Crown className="h-4 w-4 text-purple-600" />,
    },
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const cvId = searchParams.get("id")
  const { data: session } = useSession()
  // const { toast } = useToast()
  const [subscription, setSubscription] = useState<any>(null)
  const [loadingSubscription, setLoadingSubscription] = useState(true)
  const [activeTab, setActiveTab] = useState("cv-template")
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [generatedCV, setGeneratedCV] = useState<any>(null)
  const [aiPrompt, setAiPrompt] = useState("")
  const [cvTitle, setCvTitle] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<ICVTemplate | null>(null)
  const [isGeneratingField, setIsGeneratingField] = useState<string | null>(null)
  const cvRef = useRef<HTMLDivElement>(null)


  const hiddenAIFields = ["name", "email", "phone", "phone number", "location", "start-date-1", "end-date-1", "start-date-edu", "end-date-edu"]
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
  console.log(user)
  useEffect(() => {
    if (cvId) {
      loadExistingCV(cvId)
    }
  }, [cvId])

  // Track changes to mark as unsaved
  useEffect(() => {
    if (lastSaved) {
      setHasUnsavedChanges(true)
    }
  }, [sections, cvTitle, selectedTemplate])

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/subscription?userId=${session?.user?.id}&role=job_seeker`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()
        console.log("🟢 [GenerateCVPage] Subscription API Response:", data)
        setSubscription(data)
        if (!data.canCreateCV) {
          console.warn("🟠 No permission to generate cv, redirecting...")
          toast.error("Subscription Required")
          router.push("/dashboard/job-seeker/unlock")
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err)
        toast.error("Failed to check subscription. Redirecting...")
        router.push("/dashboard/job-seeker/unlock")
      } finally {
        setLoadingSubscription(false)
      }
    }
    if (session?.user?.id) fetchSubscription()
  }, [session?.user?.id, router])

  const loadExistingCV = async (id: string) => {
    try {
      const cv = await getCVById(id)
      // Populate sections with CV data
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          fields: section.fields.map((field) => ({
            ...field,
            value: cv.content[section.id]?.[field.id] || "",
          })),
        })),
      )
      setSelectedTemplate(cv.template)
      setCvTitle(cv.title)
      setGeneratedCV(cv)
      setLastSaved(new Date(cv.updatedAt))
      setHasUnsavedChanges(false)
    } catch (error) {
      toast.error("Failed to load CV. Please try again.")
    }
  }

  let rawPlan = "free"
  let planStyle = planStyles.free
  if (subscription) {
    rawPlan = subscription.plan.replace(/^job_seeker-/, "") || "free"
    planStyle = planStyles[rawPlan] || planStyles.free
  }

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
        toast.success(`AI-generated content for ${field.label} has been added.`)
      }
    } catch (error) {
      toast.error("Failed to generate content. Please try again.")
      console.error("Error generating field content:", error)
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
    if (template.isPremium && rawPlan === "free") {
      toast.error("This template is only available for premium users.")
      return
    }
    setSelectedTemplate(template)
    toast.success(`You've selected the ${template.name} template.`)
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
      console.error("Error generating CV:", error)
    }
    finally {
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

      setCvTitle(result.title || "My AI Generated CV")
      setHasUnsavedChanges(true)

      toast.success("Your CV has been generated using AI. You can now edit, download, or share it.")
    } catch (error) {
      toast.error("There was an error generating your CV with AI. Please try again.")

    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveCV = async () => {
    if (!selectedTemplate || !cvTitle.trim()) {
      toast.error("Please select a template and provide a title.")
      return
    }

    // Basic validation - get name and email from sections
    const personalSection = sections.find((s) => s.id === "personal")
    const nameField = personalSection?.fields.find((f) => f.id === "name")
    const emailField = personalSection?.fields.find((f) => f.id === "email")

    if (!nameField?.value || !emailField?.value) {
      toast.error("Please fill in at least your name and email.")
      return
    }

    setIsSaving(true)
    try {
      // Format the data for saving
      const formData = sections.reduce((acc, section) => {
        const sectionData = section.fields.reduce((fieldAcc, field) => {
          return { ...fieldAcc, [field.id]: field.value }
        }, {})
        return { ...acc, [section.id]: sectionData }
      }, {})

      const cvData = {
        userId: session?.user?.id || "user-1",
        title: cvTitle,
        templateId: selectedTemplate._id,
        content: formData,
        htmlContent: generatedCV?.htmlContent || "",
        isPublic: false,
      }

      let savedCV
      if (cvId) {
        // Update existing CV
        const response = await fetch(`/api/cv/${cvId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cvData),
        })
        const result = await response.json()
        if (!result.success) throw new Error(result.error)
        savedCV = result.data
      } else {
        // Save new CV
        savedCV = await saveCV(cvData)
        // Redirect to edit mode with the new CV ID
        router.push(`/dashboard/job-seeker/generate-cv?id=${savedCV._id}`)
      }

      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      setGeneratedCV(savedCV)

      toast.success("Your CV has been saved to your library.")
    } catch (error) {
      toast.error("Failed to save CV. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadCV = () => {
    if (!cvRef.current) return

    setIsDownloading(true)

    const sanitizeFilename = (name: string) =>
      name
        .replace(/[^a-z0-9_\- ]/gi, "")
        .trim()
        .replace(/\s+/g, " ")

    const fullName = user?.name || "Unnamed"
    const fileName = `${sanitizeFilename(fullName)} - CV - by JobWinner.pdf`

    const element = cvRef.current as HTMLDivElement
    const originalHeight = element.style.height
    const scrollHeight = element.scrollHeight
    element.style.height = `${element.scrollHeight}px`

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        useCORS: true,
      },
      jsPDF: {
        unit: "px",
        format: [element.offsetWidth, scrollHeight],
        orientation: "portrait",
      },
    }

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast.success("Your CV is being downloaded as a PDF.")
        element.style.height = originalHeight
      })
      .catch((err: any) => {
        toast.error("Something went wrong while generating the PDF.")
        console.error(err)
      })
      .finally(() => {
        setIsDownloading(false)
      })
  }

  const handleShareCV = () => {
    // In a real app, this would open a share dialog
    toast.success("Your CV sharing link has been copied to clipboard.")
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{cvId ? "Edit CV" : "Generate Your CV"}</h1>
              <p className="text-gray-600">Create a professional CV in minutes with our easy-to-use builder</p>
              {subscription && (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span className="text-gray-600">Plan:</span>
                  <Badge variant="outline" className={`${planStyle.color} flex items-center gap-1`}>
                    {planStyle.icon}
                    {rawPlan.toUpperCase()}
                  </Badge>
                  <span className="text-gray-600">
                    ({subscription.cvCreated} /
                    {["Unlimited", -1, Number.POSITIVE_INFINITY, null].includes(subscription.cvLimit)
                      ? "∞"
                      : subscription.cvLimit}
                    )
                  </span>
                </div>
              )}
              {lastSaved && (
                <p className="text-sm text-gray-500 mt-1">
                  {hasUnsavedChanges ? (
                    <span className="text-amber-600">• Unsaved changes</span>
                  ) : (
                    <span className="text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Last saved: {lastSaved.toLocaleString()}
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <div className="space-y-2">
                <Label htmlFor="cv-title" className="text-sm">
                  CV Title
                </Label>
                <Input
                  id="cv-title"
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  placeholder="e.g., Software Engineer Resume"
                  className="w-64"
                />
              </div>
            </div>
          </div>
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
                            {!hiddenAIFields.includes(field.id.toLowerCase()) && (
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
                            )}
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
                              className="flex items-center gap-1 bg-transparent"
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
                      className="flex items-center gap-1 bg-transparent"
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
                  <CardContent ref={cvRef} className="h-[600px] overflow-auto border rounded-md bg-white">
                    <CVPreview data={sections} generatedCV={generatedCV} template={selectedTemplate} />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={handleSaveCV}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-black text-white"
                      variant={hasUnsavedChanges ? "default" : "outline"}
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {isSaving ? "Saving..." : "Save CV"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleShareCV}
                      disabled={!generatedCV}
                      className="flex items-center gap-1 bg-transparent"
                    >
                      <Share className="h-4 w-4" /> Share
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDownloadCV}
                      disabled={isDownloading || !generatedCV}
                      className="flex items-center gap-1"
                    >
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {isDownloading ? "Downloading..." : "Download PDF"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-resume-builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {false ? (<div>
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
              </div>) : (<div>

                <Alert variant="destructive" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  <Lock className="h-5 w-5 text-yellow-600" />
                  <AlertTitle className="font-semibold">Premium Feature</AlertTitle>
                  <AlertDescription>
                    You must be a <span className="font-medium text-yellow-900">Premium member</span> to access this feature.
                  </AlertDescription>
                </Alert></div>
              )}

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
                      onClick={handleSaveCV}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                      variant={hasUnsavedChanges ? "default" : "outline"}
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {isSaving ? "Saving..." : "Save CV"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleShareCV}
                      disabled={!generatedCV}
                      className="flex items-center gap-1 bg-transparent"
                    >
                      <Share className="h-4 w-4" /> Share
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDownloadCV}
                      disabled={isDownloading || !generatedCV}
                      className="flex items-center gap-1"
                    >
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {isDownloading ? "Downloading..." : "Download PDF"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
