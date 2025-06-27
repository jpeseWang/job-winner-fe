// models/Contact.ts
import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
  {
    message: String,
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ContactSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    message: String,
    replied: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    replies: [ReplySchema], // Lưu lịch sử trả lời từ admin
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
