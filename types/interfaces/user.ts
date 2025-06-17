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

export interface IUser {
  user: {
    id: string
    name: string
    email: string
    photo?: string
  }
  id: string
  name: string
  phone: string
  email: string
  role: UserRole
  status: UserStatus
  photo?: string
  company?: string
  createdAt: string
  lastActive: string
}

export interface IUserProfile {
  id: string
  name: string
  email?: string
  phone?: string
  title: string
  location: string
  skills: string[]
  experience: IExperience[]
  education: IEducation[]
  bio: string
  contactEmail: string
  profilePicture?: string
  resumeUrl?: string
  socialLinks?: ISocialLinks
  isPublic: boolean
}

export interface IEducation {
  degree: string
  institution: string
  location?: string
  startDate: Date
  endDate?: Date
  description?: string
}

export interface ISocialLinks {
  linkedin?: string
  github?: string
  twitter?: string
  portfolio?: string
  other?: string
}

export interface IExperience {
  title: string
  company: string
  location?: string
  startDate: Date
  endDate?: Date
  description: string
  isCurrentPosition?: boolean
}