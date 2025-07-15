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

export enum JobCategory {
  TECHNOLOGY = "Technology",
  TELECOMMUNICATIONS = "Telecommunications",
  HEALTH = "Health Medical",
  EDUCATION = "Education",
  HOSPITALITY = "Hospitality",
  MANUFACTURING = "Manufacturing",
  ENGINEERING = "Engineering",
  FINANCIAL = "Financial Services",
}

export enum JobLocation {
  HAICHAU = "Hai Chau",
  LIENCHIEU = "Lien Chieu",
  SONTRA = "Son Tra",
  THANHKHE = "Thanh Khe",
  CAMLE = "Cam Le"
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

export enum ExperienceLevel {
  ENTRY = "Entry Level",
  MID = "Mid Level",
  SENIOR = "Senior Level",
  LEAD = "Lead",
  MANAGER = "Manager",
}

export enum ETemplateCategory {
  PROFESSIONAL = "professional",
  CREATIVE = "creative",
  SIMPLE = "simple",
  MODERN = "modern",
  ACADEMIC = "academic",
  EXECUTIVE = "executive",
}

export enum SubscriptionRole {
  RECRUITER = "recruiter",
  JOB_SEEKER = "job_seeker"
}

export enum SubscriptionPlan {
  FREE = "free",
  BASIC = "basic",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
  PAST_DUE = "past_due",
  PENDING = "pending",
}

export enum BillingPeriod {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  ANNUAL = "annual",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentType {
  SUBSCRIPTION = "subscription",
  TEMPLATE = "template",
  FEATURE = "feature",
  OTHER = "other",
}