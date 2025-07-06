import mongoose, { type Document, Schema } from "mongoose"
import type { ICVTemplate } from "@/types/interfaces"
import { ETemplateCategory } from "@/types/enums"

interface CVTemplate extends Document, Omit<ICVTemplate, "id" | "creator"> {
  createdAt: Date
  updatedAt: Date
  creator: mongoose.Types.ObjectId
}

const CVTemplateSchema = new Schema<CVTemplate>(
  {
    name: {
      type: String,
      required: [true, "Please provide a template name"],
      trim: true,
      maxLength: [100, "Template name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a template description"],
      trim: true,
    },
    previewImage:
    {
      type: String,
    }
    ,
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
      enum: Object.values(ETemplateCategory),
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

export default (mongoose.models && mongoose.models.CVTemplate)
  ? mongoose.models.CVTemplate
  : mongoose.model<CVTemplate>("CVTemplate", CVTemplateSchema)
