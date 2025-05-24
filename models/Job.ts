import mongoose, { type Document, Schema } from "mongoose"

export enum JobType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
  INTERNSHIP = "Internship",
  TEMPORARY = "Temporary",
}

export enum JobStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACTIVE = "active",
  PAUSED = "paused",
  CLOSED = "closed",
  REJECTED = "rejected",
}

export enum ExperienceLevel {
  ENTRY = "Entry level",
  JUNIOR = "Junior",
  MID = "Mid level",
  SENIOR = "Senior",
  LEAD = "Lead",
  EXECUTIVE = "Executive",
}

export interface IJob extends Document {
  title: string
  company: mongoose.Types.ObjectId
  recruiter: mongoose.Types.ObjectId
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  type: JobType
  category: string
  location: string
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
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      required: [true, "Please specify job category"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please provide job location"],
      trim: true,
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
  },
  { timestamps: true },
)

// Set publishedAt when job becomes active
JobSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === JobStatus.ACTIVE && !this.publishedAt) {
    this.publishedAt = new Date()
  }
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

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)
