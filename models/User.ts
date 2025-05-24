import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export enum UserRole {
  JOB_SEEKER = "job_seeker",
  RECRUITER = "recruiter",
  ADMIN = "admin",
}

export enum SubscriptionTier {
  FREE = "free",
  BASIC = "basic",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  profilePicture?: string
  isVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  isActive: boolean
  subscription: {
    tier: SubscriptionTier
    startDate?: Date
    endDate?: Date
    isActive: boolean
    paymentMethod?: string
  }
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.JOB_SEEKER,
    },
    profilePicture: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    subscription: {
      tier: {
        type: String,
        enum: Object.values(SubscriptionTier),
        default: SubscriptionTier.FREE,
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: true,
      },
      paymentMethod: String,
    },
  },
  { timestamps: true },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
