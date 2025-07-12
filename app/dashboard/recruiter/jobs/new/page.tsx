"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Plus, Trash2, Building2, AlertCircle, Lock, Crown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { JobLocation, JobCategory, JobType, ExperienceLevel } from "@/types/enums"
import { useCompanyById } from "@/hooks/use-company"
import { useSubscription } from "@/hooks/useSubscription"
import toast from "react-hot-toast"

export default function NewJobPage() {
  const router = useRouter()
  const { data: session } = useSession()
  // const { toast } = useToast()
  const { company, isLoading: companyLoading, isError: companyError, hasCompany } = useCompanyById(session?.user?.id || "")
  const { subscription, isLoading: subscriptionLoading } = useSubscription()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([""])
  const [benefits, setBenefits] = useState<string[]>([""])
  const [responsibilities, setResponsibilities] = useState<string[]>([""])
  const [skills, setSkills] = useState<string[]>([""])

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    companyId: "",
    location: "",
    type: "Full-time",
    category: "",
    salary: "",
    description: "",
    contactEmail: "",
    applicationUrl: "",
    featured: false,
    experienceLevel: "Mid Level",
    companyLogo: "",
  })

  // Auto-populate company data when company is loaded
  useEffect(() => {
    if (company && !formData.company) {
      setFormData((prev) => ({
        ...prev,
        company: company.name,
        companyId: company._id,
        companyLogo: company.logo || "",
        contactEmail: session?.user?.email || "",
      }))
    }
  }, [company, session, formData.company])

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""])
  }

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = [...requirements]
    newRequirements.splice(index, 1)
    setRequirements(newRequirements)
  }

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements]
    newRequirements[index] = value
    setRequirements(newRequirements)
  }

  const handleAddBenefit = () => {
    setBenefits([...benefits, ""])
  }

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = [...benefits]
    newBenefits.splice(index, 1)
    setBenefits(newBenefits)
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits]
    newBenefits[index] = value
    setBenefits(newBenefits)
  }

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, ""])
  }

  const handleRemoveResponsibility = (index: number) => {
    const newResponsibilities = [...responsibilities]
    newResponsibilities.splice(index, 1)
    setResponsibilities(newResponsibilities)
  }

  const handleResponsibilityChange = (index: number, value: string) => {
    const newResponsibilities = [...responsibilities]
    newResponsibilities[index] = value
    setResponsibilities(newResponsibilities)
  }

  const handleAddSkill = () => {
    setSkills([...skills, ""])
  }

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills]
    newSkills.splice(index, 1)
    setSkills(newSkills)
  }

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills]
    newSkills[index] = value
    setSkills(newSkills)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user can post job
    if (!subscription?.canPostJob) {
      router.push("/dashboard/recruiter/unlock")
      return
    }
    
    setIsSubmitting(true)

    try {
      // Parse salary range from string (e.g., "80000-100000")
      let transformedSalary = undefined
      if (formData.salary) {
        const [minStr, maxStr] = formData.salary.split("-").map((s) => s.trim().replace(/[^0-9]/g, ""))
        transformedSalary = {
          min: minStr ? Number.parseInt(minStr, 10) : undefined,
          max: maxStr ? Number.parseInt(maxStr, 10) : undefined,
          currency: "USD",
          isNegotiable: false,
          period: "yearly",
        }
      }

      const jobData = {
        ...formData,
        requirements: requirements.filter((req) => req.trim() !== ""),
        benefits: benefits.filter((benefit) => benefit.trim() !== ""),
        responsibilities: responsibilities.filter((resp) => resp.trim() !== ""),
        skills: skills.filter((skill) => skill.trim() !== ""),
        salary: transformedSalary,
        status: "active",
        postedDate: new Date().toISOString(),
        recruiter: session?.user?.id || "",
      }

      console.log("Submitting job data:", jobData)

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      })

      const data = await response.json()
      console.log("Response:", data)

      if (!response.ok) {
        console.error("API Error Response:", data)
        toast.error("Failed to create job. Please check the form and try again.")
        let errorMessage = "Failed to create job"
        if (data.error) {
          if (Array.isArray(data.error) && data.error.length > 0) {
            errorMessage = data.error.map((err: any) => err.message).join(", ")
          } else if (typeof data.error === "string") {
            errorMessage = data.error
          }
        }
        throw new Error(errorMessage)
      }

      toast.success("Job posted successfully!")
      router.push("/dashboard/recruiter?tab=jobs")
    } catch (error) {
      console.error("Error posting job:", error)
      toast.error(error instanceof Error ? error.message : "Failed to post job. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  console.log("formData:", formData)
  // Show loading state while fetching company
  if (companyLoading) {
    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Show error if no company found
  if (companyError || !hasCompany) {
    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to register your company before posting jobs.
            <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => router.push("/dashboard/recruiter/register-company")}>
              Register your company here
            </Button>
          </AlertDescription>
        </Alert>
      </main>
    )
  }

  // Show subscription warning if user can't post job
  if (!subscriptionLoading && !subscription?.canPostJob) {
    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold">Post a New Job</h1>
            <p className="text-gray-600">Upgrade your plan to create more job postings</p>
          </div>
        </div>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-orange-600" />
              Subscription Required
            </CardTitle>
            <CardDescription>
              You've reached your job posting limit. Upgrade your plan to continue posting jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="font-medium">Current Plan: {subscription?.planName}</p>
                  <p className="text-sm text-gray-600">
                    {subscription?.jobPostingsUsed} / {subscription?.jobPostingsLimit === -1 ? "Unlimited" : subscription?.jobPostingsLimit} jobs posted
                  </p>
                </div>
                <Button onClick={() => router.push("/dashboard/recruiter/unlock")}>
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Post a New Job</h1>
            <p className="text-sm text-muted-foreground">
              Posting as <span className="font-medium">{company?.name}</span>
            </p>
          </div>
        </div>
        
        {/* Subscription Status */}
        {subscription && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Plan:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {subscription.planName}
            </Badge>
            <span className="text-gray-600">
              ({subscription.jobPostingsUsed} / {subscription.jobPostingsLimit === -1 ? "∞" : subscription.jobPostingsLimit})
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Provide the basic information about the job position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Frontend Developer"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="e.g. Tech Solutions Inc."
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Auto-filled from your company profile</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select job location" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(JobLocation).map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(JobType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Job Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select job category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(JobCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) => handleSelectChange("experienceLevel", value)}
                  >
                    <SelectTrigger id="experienceLevel">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ExperienceLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="e.g. $80,000-$100,000"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job role, responsibilities, and ideal candidate..."
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                {responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      id={`responsibility-${index}`}
                      placeholder="Add a responsibility (e.g., Manage a team)"
                      value={resp}
                      onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                      required
                    />
                    {responsibilities.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveResponsibility(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={handleAddResponsibility}>
                  <Plus className="h-4 w-4 mr-2" /> Add Responsibility
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      id={`requirement-${index}`}
                      placeholder="Add a requirement (e.g., 5+ years of experience)"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      required
                    />
                    {requirements.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveRequirement(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={handleAddRequirement}>
                  <Plus className="h-4 w-4 mr-2" /> Add Requirement
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      id={`skill-${index}`}
                      placeholder="Add a skill (e.g., JavaScript, React)"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      required
                    />
                    {skills.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveSkill(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={handleAddSkill}>
                  <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      id={`benefit-${index}`}
                      placeholder="Add a benefit (e.g., Health Insurance)"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                    />
                    {benefits.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveBenefit(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={handleAddBenefit}>
                  <Plus className="h-4 w-4 mr-2" /> Add Benefit
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="e.g. careers@company.com"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Pre-filled with your account email</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationUrl">Application URL (Optional)</Label>
                  <Input
                    id="applicationUrl"
                    name="applicationUrl"
                    type="url"
                    placeholder="e.g. https://company.com/careers/job-title"
                    value={formData.applicationUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting Job...
                  </>
                ) : (
                  "Post Job"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </main>
  )
}
