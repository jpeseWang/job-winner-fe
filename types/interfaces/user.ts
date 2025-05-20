// User interfaces
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
