export enum UserRole {
  ADMIN = "admin",
  RECRUITER = "recruiter",
  JOB_SEEKER = "job_seeker",
}

export enum UserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

export enum JobType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
  INTERNSHIP = "Internship",
}

export enum JobStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  DRAFT = "draft",
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  INTERVIEWED = "interviewed",
  HIRED = "hired",
  REJECTED = "rejected",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
