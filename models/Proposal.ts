import mongoose, { type Document, Schema } from "mongoose"

export enum ProposalStatus {
  DRAFT = "draft",
  SENT = "sent",
  VIEWED = "viewed",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export interface IProposal extends Document {
  user: mongoose.Types.ObjectId
  title: string
  client: string
  content: string
  services: {
    name: string
    description: string
    price: number
  }[]
  totalAmount: number
  currency: string
  validUntil: Date
  status: ProposalStatus
  notes?: string
  terms?: string
  clientEmail: string
  viewCount: number
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
  viewedAt?: Date
  respondedAt?: Date
}

const ProposalSchema = new Schema<IProposal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a proposal title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    client: {
      type: String,
      required: [true, "Please provide client name"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please provide proposal content"],
    },
    services: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Please provide total amount"],
    },
    currency: {
      type: String,
      required: [true, "Please provide currency"],
      default: "USD",
    },
    validUntil: {
      type: Date,
      required: [true, "Please provide validity date"],
    },
    status: {
      type: String,
      enum: Object.values(ProposalStatus),
      default: ProposalStatus.DRAFT,
    },
    notes: {
      type: String,
      trim: true,
    },
    terms: {
      type: String,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, "Please provide client email"],
      trim: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    sentAt: {
      type: Date,
    },
    viewedAt: {
      type: Date,
    },
    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Update timestamps based on status changes
ProposalSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === ProposalStatus.SENT && !this.sentAt) {
      this.sentAt = new Date()
    }
    if (this.status === ProposalStatus.VIEWED && !this.viewedAt) {
      this.viewedAt = new Date()
    }
    if ((this.status === ProposalStatus.ACCEPTED || this.status === ProposalStatus.REJECTED) && !this.respondedAt) {
      this.respondedAt = new Date()
    }
  }
  next()
})

export default mongoose.models.Proposal || mongoose.model<IProposal>("Proposal", ProposalSchema)
