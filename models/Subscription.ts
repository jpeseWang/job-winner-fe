import mongoose, { type Document, Schema } from "mongoose"

export enum SubscriptionPlan {
  FREE = "free",
  BASIC = "basic",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
  PAST_DUE = "past_due",
  PENDING = "pending",
}

export enum BillingPeriod {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  ANNUAL = "annual",
}

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startDate: Date
  endDate: Date
  billingPeriod: BillingPeriod
  price: number
  currency: string
  autoRenew: boolean
  paymentMethod: string
  paymentId?: string
  features: {
    name: string
    description: string
    limit?: number
  }[]
  usageStats: {
    jobPostings: number
    cvDownloads: number
    featuredJobs: number
    premiumTemplates: number
  }
  cancelReason?: string
  createdAt: Date
  updatedAt: Date
  lastBillingDate?: Date
  nextBillingDate?: Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      required: [true, "Please specify subscription plan"],
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    billingPeriod: {
      type: String,
      enum: Object.values(BillingPeriod),
      required: [true, "Please specify billing period"],
    },
    price: {
      type: Number,
      required: [true, "Please provide subscription price"],
    },
    currency: {
      type: String,
      required: [true, "Please provide currency"],
      default: "USD",
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "Please provide payment method"],
    },
    paymentId: {
      type: String,
    },
    features: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        limit: {
          type: Number,
        },
      },
    ],
    usageStats: {
      jobPostings: {
        type: Number,
        default: 0,
      },
      cvDownloads: {
        type: Number,
        default: 0,
      },
      featuredJobs: {
        type: Number,
        default: 0,
      },
      premiumTemplates: {
        type: Number,
        default: 0,
      },
    },
    cancelReason: {
      type: String,
    },
    lastBillingDate: {
      type: Date,
    },
    nextBillingDate: {
      type: Date,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema)
