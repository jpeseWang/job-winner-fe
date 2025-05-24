import mongoose, { type Document, Schema } from "mongoose"

export enum NotificationType {
  JOB_APPLICATION = "job_application",
  APPLICATION_STATUS = "application_status",
  JOB_POSTING = "job_posting",
  MESSAGE = "message",
  SUBSCRIPTION = "subscription",
  PAYMENT = "payment",
  SYSTEM = "system",
}

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  link?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  readAt?: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: [true, "Please specify notification type"],
    },
    title: {
      type: String,
      required: [true, "Please provide notification title"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please provide notification message"],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Set readAt when notification is marked as read
NotificationSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date()
  }
  next()
})

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
