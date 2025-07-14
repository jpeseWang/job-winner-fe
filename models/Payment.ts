import mongoose, { type Document, Schema } from "mongoose"
import { PaymentStatus, PaymentType } from "@/types/enums/index"

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId
  amount: number
  currency: string
  type: PaymentType
  itemId?: mongoose.Types.ObjectId
  status: PaymentStatus
  paymentMethod: string
  transactionId: string
  invoiceUrl?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide payment amount"],
    },
    currency: {
      type: String,
      required: [true, "Please provide currency"],
      default: "USD",
    },
    type: {
      type: String,
      enum: Object.values(PaymentType),
      required: [true, "Please specify payment type"],
    },
    itemId: {
      type: Schema.Types.ObjectId,
      refPath: "type",
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      required: [true, "Please provide payment method"],
    },
    transactionId: {
      type: String,
      required: [true, "Please provide transaction ID"],
    },
    invoiceUrl: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Set completedAt when payment is completed
PaymentSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === PaymentStatus.COMPLETED && !this.completedAt) {
    this.completedAt = new Date()
  }
  next()
})

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)
