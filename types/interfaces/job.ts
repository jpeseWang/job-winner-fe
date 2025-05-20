
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
