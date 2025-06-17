import { z } from "zod"
import { JobType, UserRole, ExperienceLevel, JobStatus } from "@/types/enums"

// Job validation schema
export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),
  recruiter: z.string().min(1, "Recruiter ID is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is needed"),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
  benefits: z.array(z.string()).optional(),
  type: z.nativeEnum(JobType, { errorMap: () => ({ message: "Invalid job type" }) }),
  category: z.string().min(1, "Category is required"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),
  isRemote: z.boolean().optional(),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default("USD"),
    isNegotiable: z.boolean().default(false),
    period: z.enum(["hourly", "daily", "weekly", "monthly", "yearly"]).default("yearly"),
  }).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel, { errorMap: () => ({ message: "Invalid experience level" }) }),
  educationLevel: z.string().optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  applicationDeadline: z.string().optional(),
  applicationUrl: z.string().url("Invalid URL").optional(),
  contactEmail: z.string().email("Invalid email address"),
  status: z.nativeEnum(JobStatus).default(JobStatus.DRAFT).optional(),
  rejectionReason: z.string().optional(),
  isFeatured: z.boolean().optional(),
  views: z.number().default(0).optional(),
  applications: z.number().default(0).optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// Application validation schema
export const applicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  resumeUrl: z.string().min(1, "Resume is required"),
  coverLetter: z.string().optional(),
})

// User validation schema
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: "Invalid user role" }) }),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  company: z.string().optional(),
})

// Profile validation schema
export const profileSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title cannot exceed 100 characters"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.string().min(1, "Experience is required"),
  education: z.array(
    z.object({
      degree: z.string().min(1, "Degree is required"),
      institution: z.string().min(1, "Institution is required"),
      year: z.string().min(1, "Year is required"),
    }),
  ),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  contactEmail: z.string().email("Invalid email address"),
  isPublic: z.boolean(),
})

// Validate job data
export const validateJob = (data: any) => {
  try {
    return { data: jobSchema.parse(data), errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, errors: error.errors }
    }
    return { data: null, errors: [{ message: "Validation failed" }] }
  }
}

// Validate application data
export const validateApplication = (data: any) => {
  try {
    return { data: applicationSchema.parse(data), errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, errors: error.errors }
    }
    return { data: null, errors: [{ message: "Validation failed" }] }
  }
}

// Validate user data
export const validateUser = (data: any) => {
  try {
    return { data: userSchema.parse(data), errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, errors: error.errors }
    }
    return { data: null, errors: [{ message: "Validation failed" }] }
  }
}

// Validate profile data
export const validateProfile = (data: any) => {
  try {
    return { data: profileSchema.parse(data), errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, errors: error.errors }
    }
    return { data: null, errors: [{ message: "Validation failed" }] }
  }
}
