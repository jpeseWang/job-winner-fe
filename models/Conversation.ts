import mongoose, { type Document, Schema } from "mongoose"

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]
  lastMessage?: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Update lastMessageAt when lastMessage is updated
ConversationSchema.pre("save", function (next) {
  if (this.isModified("lastMessage")) {
    this.lastMessageAt = new Date()
  }
  next()
})

export default mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema)
