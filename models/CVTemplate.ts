import mongoose, { type Document, Schema } from "mongoose"

export enum TemplateCategory {
  PROFESSIONAL = "professional",
  CREATIVE = "creative",
  SIMPLE = "simple",
  MODERN = "modern",
  ACADEMIC = "academic",
  EXECUTIVE = "executive",
}

export interface ICVTemplate extends Document {
  name: string
  description: string
  thumbnail: string
  previewImages: string[]
  htmlTemplate: string
  cssStyles: string
  category: TemplateCategory
  tags: string[]
  creator: mongoose.Types.ObjectId
  isPremium: boolean
  price?: number
  isActive: boolean
  usageCount: number
  rating: {
    average: number
    count: number
  }
  createdAt: Date
  updatedAt: Date
}

const CVTemplateSchema = new Schema<ICVTemplate>(
  {
    name: {
      type: String,
      required: [true, "Please provide a template name"],
      trim: true,
      maxlength: [100, "Template name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a template description"],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Please provide a thumbnail image"],
    },
    previewImages: [
      {
        type: String,
      },
    ],
    htmlTemplate: {
      type: String,
      required: [true, "Please provide HTML template"],
    },
    cssStyles: {
      type: String,
      required: [true, "Please provide CSS styles"],
    },
    category: {
      type: String,
      enum: Object.values(TemplateCategory),
      required: [true, "Please specify template category"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
)

// Create text index for search
CVTemplateSchema.index({
  name: "text",
  description: "text",
  tags: "text",
  category: "text",
})

export default mongoose.models.CVTemplate || mongoose.model<ICVTemplate>("CVTemplate", CVTemplateSchema)
