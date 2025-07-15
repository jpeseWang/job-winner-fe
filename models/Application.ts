import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema(
  {
    // Job Information
    jobId: {
      type: String,
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },

    // User Information
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // Personal Information
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    // Professional Information
    currentPosition: String,
    experience: {
      type: String,
      required: true,
    },
    expectedSalary: String,
    availableFrom: String,

    // Education & Skills
    education: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],

    // Application Materials
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    portfolioUrls: [String],

    // Social Links
    linkedinUrl: String,
    githubUrl: String,
    websiteUrl: String,

    // Preferences
    remoteWork: {
      type: Boolean,
      default: false,
    },
    relocation: {
      type: Boolean,
      default: false,
    },

    // Legal
    workAuthorization: {
      type: Boolean,
      required: true,
    },
    agreeToTerms: {
      type: Boolean,
      required: true,
    },

    // Application Status
    status: {
      type: String,
      enum: ["pending", "reviewed", "interviewed", "hired", "rejected"],
      default: "pending",
    },

    // Timestamps
    appliedDate: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // Recruiter Notes
    recruiterNotes: String,
    interviewDate: Date,

    // Tracking
    viewedByRecruiter: {
      type: Boolean,
      default: false,
    },
    viewedAt: Date,
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true })
applicationSchema.index({ status: 1 })
applicationSchema.index({ appliedDate: -1 })
applicationSchema.index({ company: 1 })

// Update the updatedAt field before saving
applicationSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Application || mongoose.model("Application", applicationSchema)
