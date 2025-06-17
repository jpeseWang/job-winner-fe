import mongoose, { type Document, Schema } from "mongoose"
import { IEducation, IExperience, ISocialLinks } from "@/types/interfaces/user"

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId
  title: string
  bio: string
  location?: string
  phone?: string
  website?: string
  skills: string[]
  languages: { language: string; proficiency: string }[]
  education: IEducation[]
  experience: IExperience[]
  certifications: { name: string; issuer: string; date: Date; expires?: Date; url?: string }[]
  socialLinks: ISocialLinks
  resumeUrl?: string
  isPublic: boolean
  completionPercentage: number
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    bio: {
      type: String,
      maxlength: [1000, "Bio cannot be more than 1000 characters"],
    },
    location: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    languages: [
      {
        language: {
          type: String,
          required: true,
          trim: true,
        },
        proficiency: {
          type: String,
          required: true,
          enum: ["Beginner", "Intermediate", "Advanced", "Native/Fluent"],
          default: "Intermediate",
        },
      },
    ],
    education: [
      {
        degree: {
          type: String,
          required: true,
          trim: true,
        },
        institution: {
          type: String,
          required: true,
          trim: true,
        },
        location: {
          type: String,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    experience: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        company: {
          type: String,
          required: true,
          trim: true,
        },
        location: {
          type: String,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
        isCurrentPosition: {
          type: Boolean,
          default: false,
        },
      },
    ],
    certifications: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        issuer: {
          type: String,
          required: true,
          trim: true,
        },
        date: {
          type: Date,
          required: true,
        },
        expires: {
          type: Date,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      portfolio: {
        type: String,
        trim: true,
      },
      other: {
        type: String,
        trim: true,
      },
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

// Calculate profile completion percentage before saving
ProfileSchema.pre("save", function (next) {
  const profile = this
  let totalFields = 0
  let completedFields = 0

  // Count basic fields
  const basicFields = ["title", "bio", "location", "phone", "website"]
  totalFields += basicFields.length
  basicFields.forEach((field) => {
    if (profile[field as keyof typeof profile]) completedFields++
  })

  // Count array fields
  if (profile.skills.length > 0) completedFields++
  if (profile.languages.length > 0) completedFields++
  if (profile.education.length > 0) completedFields++
  if (profile.experience.length > 0) completedFields++
  if (profile.certifications.length > 0) completedFields++
  totalFields += 5 // For the array fields

  // Count social links
  const socialFields = ["linkedin", "github", "twitter", "portfolio", "other"]
  let hasSocialLinks = false
  socialFields.forEach((field) => {
    if (profile.socialLinks[field as keyof typeof profile.socialLinks]) hasSocialLinks = true
  })
  if (hasSocialLinks) completedFields++
  totalFields++

  // Count resume
  if (profile.resumeUrl) completedFields++
  totalFields++

  profile.completionPercentage = Math.round((completedFields / totalFields) * 100)
  next()
})

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema)
