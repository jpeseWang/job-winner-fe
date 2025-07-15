import mongoose, { type Document, Schema } from "mongoose"

export interface ICV extends Document {
  user: mongoose.Types.ObjectId
  title: string
  template: mongoose.Types.ObjectId
  content: {
    personal: {
      name: string
      email: string
      phone?: string
      address?: string
      website?: string
      summary?: string
    }
    experience: {
      title: string
      company: string
      location?: string
      startDate: Date
      endDate?: Date
      description: string
      isCurrentPosition?: boolean
    }[]
    education: {
      degree: string
      institution: string
      location?: string
      startDate: Date
      endDate?: Date
      description?: string
    }[]
    skills: string[]
    languages?: { language: string; proficiency: string }[]
    certifications?: { name: string; issuer: string; date: Date }[]
    interests?: string[]
    references?: { name: string; position: string; company: string; contact: string }[]
  }
  isPublic: boolean
  views: number
  downloads: number
  createdAt: Date
  updatedAt: Date
  lastGeneratedAt: Date
}

const CVSchema = new Schema<ICV>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title for your CV"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: "CVTemplate",
      required: true,
    },
    content: {
      personal: {
        name: {
          type: String,
          required: [true, "Please provide your name"],
          trim: true,
        },
        email: {
          type: String,
          required: [true, "Please provide your email"],
          trim: true,
        },
        phone: {
          type: String,
          trim: true,
        },
        address: {
          type: String,
          trim: true,
        },
        website: {
          type: String,
          trim: true,
        },
        summary: {
          type: String,
          trim: true,
        },
      },
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
        },
      ],
      interests: [
        {
          type: String,
          trim: true,
        },
      ],
      references: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          position: {
            type: String,
            required: true,
            trim: true,
          },
          company: {
            type: String,
            required: true,
            trim: true,
          },
          contact: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    lastGeneratedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.models.CV || mongoose.model<ICV>("CV", CVSchema)
