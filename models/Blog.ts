import mongoose, { type Document, Schema } from "mongoose"

export interface IBlog extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  author: mongoose.Types.ObjectId
  featuredImage?: string
  categories: string[]
  tags: string[]
  status: "draft" | "published" | "archived"
  publishedAt?: Date
  views: number
  likes: number
  comments: {
    user: mongoose.Types.ObjectId
    content: string
    createdAt: Date
    isApproved: boolean
  }[]
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Please provide a blog title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Please provide blog content"],
    },
    excerpt: {
      type: String,
      required: [true, "Please provide a blog excerpt"],
      trim: true,
      maxlength: [500, "Excerpt cannot be more than 500 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featuredImage: {
      type: String,
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isApproved: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
)

// Set publishedAt when blog becomes published
BlogSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

// Create text index for search
BlogSchema.index({
  title: "text",
  content: "text",
  excerpt: "text",
  categories: "text",
  tags: "text",
})

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema)
