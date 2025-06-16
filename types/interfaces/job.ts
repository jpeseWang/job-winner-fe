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

export interface Salary {
  min?: number;
  max?: number;
  currency: string;
  isNegotiable: boolean;
  period: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: JobType
  category: string
  salary?: Salary
  description: string
  requirements: string[]
  responsibilities?: string[]
  skills?: string[]
  benefits?: string[]
  contactEmail: string
  applicationUrl?: string
  companyLogo?: string
  postedDate: string
  postedDays: number
  applicationDeadline?: string
  isRemote?: boolean
  experienceLevel?: string
  educationLevel?: string
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

export interface FilterOption {
  label: string
  count: number
}

export interface Filters {
  categories: FilterOption[]
  locations: string[]
  types: FilterOption[]
  experienceLevels: FilterOption[]
}

export interface JobFilters {
  keyword?: string
  location?: string
  category?: string[]
  type?: string[]
  experienceLevel?: string[]
  minSalary?: number
  maxSalary?: number
  page?: number
  limit?: number
  status?: JobStatus
  featured?: boolean
}

