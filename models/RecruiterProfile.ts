import mongoose, { type Document, Schema } from "mongoose"

export interface IRecruiterProfile extends Document {
  user: mongoose.Types.ObjectId
  firstName: string
  lastName: string
  position: string
  bio: string
  location?: string
  phone?: string
  personalWebsite?: string
  yearsOfExperience?: number
  specializations: string[]
  socialLinks: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
    personalWebsite?: string
  }
  profilePicture?: string
  isPublic: boolean
  completionPercentage: number
  // Company information (optional, can be filled later)
  companyName?: string
  companyId?: mongoose.Types.ObjectId
  companyRole?: string
  createdAt: Date
  updatedAt: Date
}

const RecruiterProfileSchema = new Schema<IRecruiterProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot be more than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot be more than 50 characters"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: [100, "Position cannot be more than 100 characters"],
    },
    bio: {
      type: String,
      trim: true,
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
    personalWebsite: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      min: [0, "Years of experience cannot be negative"],
      max: [50, "Years of experience cannot exceed 50"],
    },
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    socialLinks: {
      linkedin: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      personalWebsite: {
        type: String,
        trim: true,
      },
    },
    profilePicture: {
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
    // Company information (optional)
    companyName: {
      type: String,
      trim: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    companyRole: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

// Calculate profile completion percentage before saving
RecruiterProfileSchema.pre("save", function (next) {
  const requiredFields = ["firstName", "lastName", "position", "bio", "location"]
  const optionalFields = ["phone", "personalWebsite", "yearsOfExperience", "specializations", "socialLinks"]
  
  let completedFields = 0
  const totalFields = requiredFields.length + optionalFields.length

  // Check required fields
  requiredFields.forEach(field => {
    if (this[field as keyof IRecruiterProfile]) {
      completedFields++
    }
  })

  // Check optional fields
  optionalFields.forEach(field => {
    if (this[field as keyof IRecruiterProfile]) {
      if (Array.isArray(this[field as keyof IRecruiterProfile])) {
        if ((this[field as keyof IRecruiterProfile] as any[]).length > 0) {
          completedFields++
        }
      } else if (typeof this[field as keyof IRecruiterProfile] === 'object') {
        // For socialLinks object, check if at least one link exists
        const socialLinks = this[field as keyof IRecruiterProfile] as any
        if (socialLinks && Object.values(socialLinks).some((link: any) => link && link.trim() !== '')) {
          completedFields++
        }
      } else {
        completedFields++
      }
    }
  })

  this.completionPercentage = Math.round((completedFields / totalFields) * 100)
  next()
})

export default mongoose.models.RecruiterProfile || mongoose.model<IRecruiterProfile>("RecruiterProfile", RecruiterProfileSchema) 