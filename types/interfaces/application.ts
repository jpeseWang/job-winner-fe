
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