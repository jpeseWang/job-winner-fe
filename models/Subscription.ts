import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  planId: { type: String, required: true },
  canPostJob: { type: Boolean, default: false },
  jobPostingsUsed: { type: Number, default: 0 },
  jobPostingsLimit: { type: Number, default: 5 },
});

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
