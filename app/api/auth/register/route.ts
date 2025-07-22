import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"
import { UserRole, SubscriptionPlan, SubscriptionStatus, BillingPeriod, PaymentStatus, PaymentType, SubscriptionRole } from "@/types/enums"
import Profile from "@/models/Profile"
import Subscription from "@/models/Subscription"
import Payment from "@/models/Payment"
import { addDays } from "date-fns"

export async function POST(request: Request) {
  try {
    const { name, email, password, role = UserRole.JOB_SEEKER, company, paymentId } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate role
    const validRoles = [UserRole.JOB_SEEKER, UserRole.RECRUITER, UserRole.ADMIN]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 })
    }

    // Validate company for recruiters
    if (role === UserRole.RECRUITER && !company) {
      return NextResponse.json({ error: "Company name is required for recruiters" }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      company: role === UserRole.RECRUITER ? company?.trim() : undefined,
      verificationToken,
      verificationExpires,
      isVerified: false,
      isActive: true,
    })
    await user.save()

    // 🎁 Create default FREE subscription for this role
    let subscription = await Subscription.create({
      user: user._id,
      role,
      plan: SubscriptionPlan.FREE,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      billingPeriod: BillingPeriod.MONTHLY,
      price: 0,
      currency: "USD",
      autoRenew: true,
      paymentMethod: "free",
    })

    if (paymentId) {
      const payment = await Payment.findById(paymentId)
      if (!payment || payment.status !== PaymentStatus.COMPLETED || payment.type !== PaymentType.SUBSCRIPTION) {
        return NextResponse.json({ error: "Invalid or incomplete payment" }, { status: 400 })
      }

      const { plan: paidPlan, billingPeriod: paidBilling } = payment.metadata
      if (!paidPlan || !paidBilling) {
        return NextResponse.json({ error: "Payment metadata missing plan or billing period" }, { status: 400 })
      }

      subscription.plan = paidPlan
      subscription.billingPeriod = paidBilling
      subscription.price = payment.amount
      subscription.currency = payment.currency
      subscription.paymentMethod = payment.paymentMethod
      subscription.endDate =
        paidBilling === BillingPeriod.MONTHLY
          ? addDays(new Date(), 30)
          : addDays(new Date(), 365)
      await subscription.save()

      payment.user = user._id
      await payment.save()
    }

    // Setup subscription fields
    const now = new Date()
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    let plan = SubscriptionPlan.FREE
    let billingPeriod = BillingPeriod.MONTHLY
    let expiresAt: Date | undefined = undefined
    let price = 0
    let paymentMethod = "free"
    expiresAt = undefined

    if (paymentId) {
      const payment = await Payment.findById(paymentId)
      if (!payment || payment.status !== PaymentStatus.COMPLETED || payment.type !== PaymentType.SUBSCRIPTION) {
        return NextResponse.json({ error: "Invalid or incomplete payment" }, { status: 400 })
      }

      const { plan: paidPlan, billingPeriod: paidBilling } = payment.metadata
      if (!paidPlan || !paidBilling) {
        return NextResponse.json({ error: "Payment metadata missing plan or billing period" }, { status: 400 })
      }

      subscription.plan = paidPlan
      subscription.billingPeriod = paidBilling
      subscription.price = payment.amount
      subscription.currency = payment.currency
      subscription.paymentMethod = payment.paymentMethod
      subscription.endDate =
        paidBilling === BillingPeriod.MONTHLY
          ? addDays(new Date(), 30)
          : addDays(new Date(), 365)
      await subscription.save()

      payment.user = user._id
      await payment.save()
    }

    // Setup subscription fields
    const now = new Date()
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    let plan = SubscriptionPlan.FREE
    let billingPeriod = BillingPeriod.MONTHLY
    let expiresAt: Date | undefined = undefined
    let price = 0
    let paymentMethod = "free"
    expiresAt = undefined

    if (paymentId) {
      // Tìm payment để lấy thông tin gói
      const payment = await Payment.findById(paymentId)

      if (!payment || payment.status !== PaymentStatus.COMPLETED || payment.type !== PaymentType.SUBSCRIPTION) {
        return NextResponse.json({ error: "Invalid or incomplete payment" }, { status: 400 })
      }

      const { plan: paidPlan, billingPeriod: paidBilling } = payment.metadata

      if (!paidPlan || !paidBilling) {
        return NextResponse.json({ error: "Payment metadata missing plan or billing period" }, { status: 400 })
      }

      plan = paidPlan
      billingPeriod = paidBilling
      price = payment.amount
      paymentMethod = payment.paymentMethod

      expiresAt = billingPeriod === BillingPeriod.MONTHLY
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)  // Gói tháng: +30 ngày
        : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // Gói năm: +365 ngày
    }

    const subscription = await Subscription.create({
      user: user._id,
      plan,
      status: SubscriptionStatus.ACTIVE,
      startDate: now,
      endDate,
      expiresAt,
      billingPeriod,
      price,
      currency: "USD",
      autoRenew: true,
      paymentMethod,
    })

    // Link subscription to user
    user.subscription = subscription._id
    await user.save()

    // Link user & subscription to payment
    if (paymentId) {
      await Payment.findByIdAndUpdate(
        paymentId,
        { user: user._id, itemId: subscription._id },
        { new: true }
      )
    }

    if (role === UserRole.JOB_SEEKER) {
      await Profile.create({
        user: user._id
      })
    }

    // Gửi email xác thực
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          subscription: {
            plan: subscription.plan,
            role: subscription.role,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
          },
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


