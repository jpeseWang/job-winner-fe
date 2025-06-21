"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { FileText, User, Mail, Phone, MapPin, Briefcase, CheckCircle, ArrowLeft, ArrowRight, Send } from "lucide-react"
import type { Job } from "@/types/interfaces"
import { applicationService } from "@/services/applicationService";

const applicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(2, "Please enter your location"),

  // Professional Information
  currentPosition: z.string().optional(),
  experience: z.string().min(1, "Please select your experience level"),
  expectedSalary: z.string().optional(),
  availableFrom: z
    .string()
    .min(1, "Please select your available start date")
    .refine((val) => {
      const selected = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, {
      message: "Start date cannot be in the past",
    }),

  // Education
  education: z.string().min(1, "Please enter your education background"),
  skills: z.array(z.string()).min(1, "Please add at least one skill"),

  // Application Materials
  resumeUrl: z.string({
    required_error: "Please upload your resume"
  }).min(1, "Please upload your resume"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  portfolioUrls: z.array(z.string()).optional(),

  // Additional Information
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  websiteUrl: z.string().optional(),

  // Preferences
  remoteWork: z.boolean().optional(),
  relocation: z.boolean().optional(),

  // Legal
  workAuthorization: z.boolean({
    required_error: "Please confirm your work authorization status",
  }),
  agreeToTerms: z
    .boolean({
      required_error: "Please agree to the terms and conditions",
    })
    .refine((val) => val === true, "You must agree to the terms and conditions"),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

interface JobApplicationFormProps {
  job: Job
}

const EXPERIENCE_OPTIONS = [
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-level (3-5 years)",
  "Senior (5-8 years)",
  "Lead/Principal (8+ years)",
  "Executive/Director (10+ years)",
]

const EDUCATION_OPTIONS = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD/Doctorate",
  "Professional Certification",
  "Bootcamp/Self-taught",
]

export default function JobApplicationForm({ job }: JobApplicationFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skillInput, setSkillInput] = useState("")
  const [portfolioInput, setPortfolioInput] = useState("")

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: session?.user?.name?.split(" ")[0] || "",
      lastName: session?.user?.name?.split(" ")[1] || "",
      email: session?.user?.email || "",
      skills: [],
      portfolioUrls: [],
      remoteWork: false,
      relocation: false,
      workAuthorization: false,
      agreeToTerms: false,
    },
  })

  const { watch, setValue, getValues } = form
  const watchedFields = watch()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const addSkill = () => {
    if (skillInput.trim() && !watchedFields.skills?.includes(skillInput.trim())) {
      const currentSkills = watchedFields.skills || []
      setValue("skills", [...currentSkills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = watchedFields.skills || []
    setValue(
      "skills",
      currentSkills.filter((skill) => skill !== skillToRemove),
    )
  }

  const addPortfolioUrl = () => {
    if (portfolioInput.trim()) {
      const currentUrls = watchedFields.portfolioUrls || []
      setValue("portfolioUrls", [...currentUrls, portfolioInput.trim()])
      setPortfolioInput("")
    }
  }

  const removePortfolioUrl = (urlToRemove: string) => {
    const currentUrls = watchedFields.portfolioUrls || []
    setValue(
      "portfolioUrls",
      currentUrls.filter((url) => url !== urlToRemove),
    )
  }

  const validateStep = (step: number): boolean => {
    const values = getValues()

    switch (step) {
      case 1:
        return !!(values.firstName && values.lastName && values.email && values.phone && values.location)
      case 2:
        return !!(values.experience && values.education && values.skills?.length)
      case 3:
        return !!(values.resumeUrl && values.coverLetter)
      case 4:
        return !!(values.workAuthorization && values.agreeToTerms)
      default:
        return true
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "email", "phone", "location"]
    } else if (currentStep === 2) {
      fieldsToValidate = ["experience", "education", "skills", "availableFrom"]
    } else if (currentStep === 3) {
      fieldsToValidate = ["resumeUrl", "coverLetter"]
    } else if (currentStep === 4) {
      fieldsToValidate = ["workAuthorization", "agreeToTerms"]
    }

    const isValid = await form.trigger(fieldsToValidate)
    console.log(form.formState.errors.resumeUrl)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      const firstErrorField = Object.keys(form.formState.errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;

      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }

      toast({
        title: "Please complete all required fields",
        description: "Some required information is missing or incorrect.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)

    try {
      const applicationData = {
        ...data,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedDate: new Date().toISOString(),
      }

      const result = await applicationService.submitApplication(applicationData);

      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and get back to you soon.",
      })

      router.push(`/jobs/${job.id}/application-success`)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Failed to submit application",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" {...form.register("firstName")} placeholder="Enter your first name" readOnly />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" {...form.register("lastName")} placeholder="Enter your last name" readOnly />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="your.email@example.com"
                  className="pl-10"
                  readOnly
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  placeholder="(+84) 123-456-7890"
                  className="pl-10"
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Current Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  {...form.register("location")}
                  placeholder="City, State/Country"
                  className="pl-10"
                />
              </div>
              {form.formState.errors.location && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Professional Background</h3>
            </div>

            <div>
              <Label htmlFor="currentPosition">Current Position</Label>
              <Input
                id="currentPosition"
                {...form.register("currentPosition")}
                placeholder="e.g., Senior Software Engineer at Tech Corp"
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience Level *</Label>
              <select
                id="experience"
                {...form.register("experience")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your experience level</option>
                {EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {form.formState.errors.experience && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.experience.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="education">Education *</Label>
              <select
                id="education"
                {...form.register("education")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your education level</option>
                {EDUCATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {form.formState.errors.education && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.education.message}</p>
              )}
            </div>

            <div>
              <Label>Skills *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill (e.g., JavaScript, Project Management)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedFields.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                    {skill} ×
                  </Badge>
                ))}
              </div>
              {form.formState.errors.skills && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.skills.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedSalary">Expected Salary</Label>
                <Input
                  id="expectedSalary"
                  {...form.register("expectedSalary")}
                  placeholder="e.g., $80,000 - $100,000"
                />
              </div>

              <div>
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  {...form.register("availableFrom")}
                  min={new Date().toISOString().split("T")[0]}
                />
                {form.formState.errors.availableFrom && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.availableFrom.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Application Materials</h3>
            </div>

            <div>
              <Label>Resume/CV *</Label>
              <ImageUpload
                  value={watchedFields.resumeUrl ? { 
                  id: "1", 
                  url: watchedFields.resumeUrl, 
                  publicId: "resume", 
                  name: "resume.pdf", 
                  size: 0 
                } : undefined}
                onChange={(file) => {
                  const uploaded = Array.isArray(file) ? file[0] : file;
                  setValue("resumeUrl", uploaded?.url || "");
                }}
                multiple={false}
                acceptedTypes={[
                  "image/jpeg", "image/png", "image/webp", "image/gif",
                  "application/pdf", "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ]}
                folder="resumes"
                placeholder="Upload your resume or image (PDF, DOC, DOCX, JPG, PNG)"
              />
              {form.formState.errors.resumeUrl && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.resumeUrl.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                {...form.register("coverLetter")}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                rows={6}
                className="min-h-[150px]"
              />
              <p className="text-sm text-gray-500 mt-1">
                {watchedFields.coverLetter?.length || 0} characters (minimum 50)
              </p>
              {form.formState.errors.coverLetter && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.coverLetter.message}</p>
              )}
            </div>

            <div>
              <Label>Portfolio Links (Optional)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={portfolioInput}
                  onChange={(e) => setPortfolioInput(e.target.value)}
                  placeholder="https://your-portfolio.com"
                  type="url"
                />
                <Button type="button" onClick={addPortfolioUrl} variant="outline">
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {watchedFields.portfolioUrls?.map((url, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {url}
                    </a>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removePortfolioUrl(url)}>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  {...form.register("linkedinUrl")}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <Label htmlFor="githubUrl">GitHub Profile</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  {...form.register("githubUrl")}
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl">Personal Website</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  {...form.register("websiteUrl")}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Final Details</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remoteWork"
                  checked={watchedFields.remoteWork}
                  onCheckedChange={(checked) => setValue("remoteWork", checked as boolean)}
                />
                <Label htmlFor="remoteWork">I'm open to remote work opportunities</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="relocation"
                  checked={watchedFields.relocation}
                  onCheckedChange={(checked) => setValue("relocation", checked as boolean)}
                />
                <Label htmlFor="relocation">I'm willing to relocate for this position</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="workAuthorization"
                  checked={watchedFields.workAuthorization}
                  onCheckedChange={(checked) => setValue("workAuthorization", checked as boolean)}
                />
                <Label htmlFor="workAuthorization">I am authorized to work in this location *</Label>
              </div>
              {form.formState.errors.workAuthorization && (
                <p className="text-sm text-red-600">{form.formState.errors.workAuthorization.message}</p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={watchedFields.agreeToTerms}
                  onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="agreeToTerms">I agree to the terms and conditions and privacy policy *</Label>
              </div>
              {form.formState.errors.agreeToTerms && (
                <p className="text-sm text-red-600">{form.formState.errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Application Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Application Summary</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Name:</strong> {watchedFields.firstName} {watchedFields.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {watchedFields.email}
                </p>
                <p>
                  <strong>Experience:</strong> {watchedFields.experience}
                </p>
                <p>
                  <strong>Skills:</strong> {watchedFields.skills?.join(", ")}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <strong>Resume:</strong>
                  {watchedFields.resumeUrl ? (
                    <Badge className="bg-green-100 text-green-800">✓ Uploaded</Badge>
                  ) : (
                    <Badge variant="secondary">Not uploaded</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Apply for this Position</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (currentStep === 1) {
                router.push(`/jobs/${job.id}`);
              } else {
                prevStep();
              }
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-s2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
