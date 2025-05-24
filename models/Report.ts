import mongoose, { type Document, Schema } from "mongoose"

export enum ReportType {
  JOB = "job",
  USER = "user",
  COMPANY = "company",
  CV = "cv",
  BLOG = "blog",
  COMMENT = "comment",
  OTHER = "other",
}

export enum ReportStatus {
  PENDING = "pending",
  INVESTIGATING = "investigating",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
}

export interface IReport extends Document {
  type: ReportType
  reporter: mongoose.Types.ObjectId
  targetId: mongoose.Types.ObjectId
  reason: string
  description: string
  evidence?: string[]
  status: ReportStatus
  adminNotes?: string[]
  resolution?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

const ReportSchema = new Schema<IReport>(
  {
    type: {
      type: String,
      enum: Object.values(ReportType),
      required: [true, "Please specify report type"],
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "type",
    },
    reason: {
      type: String,
      required: [true, "Please provide a reason for the report"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description of the issue"],
      trim: true,
    },
    evidence: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
    },
    adminNotes: [
      {
        type: String,
        trim: true,
      },
    ],
    resolution: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Set resolvedAt when report is resolved or dismissed
ReportSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    (this.status === ReportStatus.RESOLVED || this.status === ReportStatus.DISMISSED) &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date()
  }
  next()
})

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema)
