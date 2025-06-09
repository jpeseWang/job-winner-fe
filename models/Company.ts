import mongoose, { type Document, Schema } from "mongoose"

export interface ICompany extends Document {
  name: string
  owner: mongoose.Types.ObjectId
  logo?: string
  website?: string
  description: string
  industry: string
  size: string
  founded?: number
  headquarters: string
  specialties: string[]
  socialLinks: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  isVerified: boolean
  employees: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, "Please provide company name"],
      trim: true,
      maxlength: [100, "Company name cannot be more than 100 characters"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide company description"],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, "Please provide company industry"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "Please provide company size"],
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"],
    },
    founded: {
      type: Number,
    },
    headquarters: {
      type: String,
      required: [true, "Please provide company headquarters"],
      trim: true,
    },
    specialties: [
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
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
)

// Create text index for search
CompanySchema.index({
  name: "text",
  description: "text",
  industry: "text",
  specialties: "text",
  headquarters: "text",
})

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema)
