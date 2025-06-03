export enum UserRole {
  ADMIN = "admin",
  RECRUITER = "recruiter",
  JOB_SEEKER = "job_seeker",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  photo?: string
  company?: string
  createdAt: string
  lastActive: string
}

export interface UserProfile {
  id: string
  userId: string
  name: string
  title: string
  location: string
  skills: string[]
  experience: string
  education: Education[]
  bio: string
  contactEmail: string
  profilePicture?: string
  resumeUrl?: string
  socialLinks?: SocialLinks
  isPublic: boolean
}

export interface Education {
  degree: string
  institution: string
  year: string
}

export interface SocialLinks {
  linkedin?: string
  github?: string
  dribbble?: string
  portfolio?: string
}

// Job interfaces
export enum JobType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  FREELANCE = "freelance",
}

export enum JobStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  PENDING = "pending",
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: JobType
  category: string
  salary?: string
  description: string
  requirements: string[]
  benefits?: string[]
  contactEmail: string
  applicationUrl?: string
  companyLogo?: string
  postedDate: string
  postedDays: number
  featured?: boolean
  status?: JobStatus
  updatedAt?: string
}

export interface JobCategory {
  id: string
  name: string
  count: number
}

export interface Company {
  id: string
  name: string
  logo: string
  description: string
  jobCount: number
  location: string
  website: string
  industry: string
}

// Application interfaces
export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  INTERVIEWED = "interviewed",
  HIRED = "hired",
  REJECTED = "rejected",
}

export interface JobApplication {
  id: string
  jobId: string
  jobTitle?: string
  userId?: string
  name: string
  email: string
  phone?: string
  resumeUrl: string
  coverLetter?: string
  status: ApplicationStatus
  appliedDate: string
  candidatePhoto?: string
}

// CV interfaces
export interface CVTemplate {
  id: string
  name: string
  category: string
  thumbnail: string
  htmlTemplate: string
  isPremium: boolean
}

export interface CV {
  id: string
  userId: string
  name: string
  templateId: string
  data: any
  htmlContent: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  shareUrl?: string
}

// Statistics interfaces
export interface PlatformStats {
  users: UserStats
  jobs: JobStats
  applications: ApplicationStats
  categories: CategoryStat[]
  locations: LocationStat[]
  revenue: RevenueStats
}

export interface UserStats {
  total: number
  jobSeekers: number
  recruiters: number
  admins: number
  newThisMonth: number
}

export interface JobStats {
  total: number
  active: number
  expired: number
  featured: number
  newThisMonth: number
}

export interface ApplicationStats {
  total: number
  pending: number
  reviewed: number
  interviewed: number
  hired: number
  newThisMonth: number
}

export interface CategoryStat {
  name: string
  count: number
}

export interface LocationStat {
  name: string
  count: number
}

export interface RevenueStats {
  total: number
  thisMonth: number
  lastMonth: number
  growth: number
}

// API response interfaces
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}
