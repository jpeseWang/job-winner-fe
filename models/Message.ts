import mongoose, { type Document, Schema } from "mongoose"

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId
  receiver: mongoose.Types.ObjectId
  conversation: mongoose.Types.ObjectId
  content: string
  attachments?: string[]
  isRead: boolean
  createdAt: Date
  updatedAt: Date
  readAt?: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please provide message content"],
      trim: true,
    },
    attachments: [
      {
        type: String,
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Set readAt when message is marked as read
MessageSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date()
  }
  next()
})

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)
