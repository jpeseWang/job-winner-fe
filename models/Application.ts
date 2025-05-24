import mongoose, { type Document, Schema } from "mongoose"

export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  SHORTLISTED = "shortlisted",
  INTERVIEW = "interview",
  REJECTED = "rejected",
  HIRED = "hired",
  WITHDRAWN = "withdrawn",
}

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId
  applicant: mongoose.Types.ObjectId
  resume: string
  coverLetter?: string
  answers: { question: string; answer: string }[]
  status: ApplicationStatus
  notes?: string[]
  isWithdrawn: boolean
  withdrawReason?: string
  createdAt: Date
  updatedAt: Date
  lastStatusChangeAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: String,
      required: [true, "Please provide a resume"],
    },
    coverLetter: {
      type: String,
    },
    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
    },
    notes: [
      {
        type: String,
        trim: true,
      },
    ],
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    withdrawReason: {
      type: String,
      trim: true,
    },
    lastStatusChangeAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Update lastStatusChangeAt when status changes
ApplicationSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.lastStatusChangeAt = new Date()
  }
  next()
})

export default mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)
