import mongoose, { type Document, Schema } from "mongoose"

export enum JobCategory{
  TECHNOLOGY = "Technology",
  TELECOMMUNICATIONS = "Telecommunications",
  HEALTH = "Health Medical",
  EDUCATION = "Education",
  FINANCIAL = "Financial Services"
}

export enum JobLocation {
  HAICHAU = "Hai Chau",
  LIENCHIEU = "Lien Chieu",
  SONTRA = "Son Tra",
  THANHKHE = "Thanh Khe",
  CAMLE = "Cam Le"
}

export enum JobType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
  INTERNSHIP = "Internship",
  TEMPORARY = "Temporary",
  REMOTE = "Remote",
}

export enum ExperienceLevel {
  ENTRY = "Entry Level",
  MID = "Mid Level",
  SENIOR = "Senior Level",
  LEAD = "Lead",
  MANAGER = "Manager",
}

export enum JobStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACTIVE = "active",
  PAUSED = "paused",
  CLOSED = "closed",
  REJECTED = "rejected",
}

export interface IJob extends Document {
  title: string
  company: string
  recruiter: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  type: JobType
  category: JobCategory
  location: JobLocation
  isRemote: boolean
  salary: {
    min?: number
    max?: number
    currency: string
    isNegotiable: boolean
    period: "hourly" | "daily" | "weekly" | "monthly" | "yearly"
  }
  experienceLevel: ExperienceLevel
  educationLevel?: string
  skills: string[]
  applicationDeadline?: Date
  applicationUrl?: string
  contactEmail: string
  status: JobStatus
  rejectionReason?: string
  isFeatured: boolean
  views: number
  applications: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, "Please provide a job title"],
      trim: true,
      maxlength: [100, "Job title cannot be more than 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    recruiter: {
      type: String,
      required: [true, "Please provide a recruiter ID"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a job description"],
      trim: true,
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    type: {
      type: String,
      enum: Object.values(JobType),
      required: [true, "Please specify job type"],
    },
    category: {
      type: String,
      enum: Object.values(JobCategory),
      required: [true, "Please specify job category"],
    },
    location: {
      type: String,
      enum: Object.values(JobLocation),
      required: [true, "Please provide job location"],
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    salary: {
min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        default: "USD",
      },
      isNegotiable: {
        type: Boolean,
        default: false,
      },
      period: {
        type: String,
        enum: ["hourly", "daily", "weekly", "monthly", "yearly"],
        default: "yearly",
      },
    },
    experienceLevel: {
      type: String,
      enum: Object.values(ExperienceLevel),
      required: [true, "Please specify experience level"],
    },
    educationLevel: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    applicationDeadline: {
      type: Date,
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, "Please provide a contact email"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.DRAFT,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    applications: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true },
)

// Set publishedAt when job becomes active
JobSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === JobStatus.ACTIVE && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  this.updatedAt = new Date()
  next()
})

// Create text index for search
JobSchema.index({
  title: "text",
  description: "text",
  responsibilities: "text",
  requirements: "text",
  skills: "text",
  location: "text",
  category: "text",
})

// Delete the existing model if it exists to prevent the "Cannot overwrite model once compiled" error
if (mongoose.models.Job) {
  delete mongoose.models.Job
}

export default mongoose.model<IJob>("Job", JobSchema)