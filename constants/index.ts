export const API_BASE_URL = "/api"

export const JOB_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
  { value: "Internship", label: "Internship" },
]

export const APPLICATION_STATUSES = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "reviewed", label: "Reviewed", color: "blue" },
  { value: "interviewed", label: "Interviewed", color: "purple" },
  { value: "hired", label: "Hired", color: "green" },
  { value: "rejected", label: "Rejected", color: "red" },
]

export const JOB_STATUSES = [
  { value: "active", label: "Active", color: "green" },
  { value: "expired", label: "Expired", color: "red" },
  { value: "draft", label: "Draft", color: "yellow" },
  { value: "approved", label: "Approved", color: "green" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "rejected", label: "Rejected", color: "red" },
]

export const USER_ROLES = [
  { value: "admin", label: "Admin", color: "purple" },
  { value: "recruiter", label: "Recruiter", color: "blue" },
  { value: "job_seeker", label: "Job Seeker", color: "green" },
]

export const USER_STATUSES = [
  { value: "active", label: "Active", color: "green" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "suspended", label: "Suspended", color: "red" },
]

export const ITEMS_PER_PAGE = 10

export const DEFAULT_AVATAR = "/placeholder.svg?height=40&width=40"
