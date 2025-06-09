// lib/email.ts
import nodemailer from "nodemailer"

const canSend =
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.EMAIL_FROM

// tạo transporter chỉ khi đủ cấu hình
const transporter = canSend
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== "false", // mặc định true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null

// 👇 helper chung
async function _send(options: {
  to: string
  subject: string
  html: string
  text: string
}) {
  if (transporter) {
    await transporter!.sendMail({ from: process.env.EMAIL_FROM, ...options })
  } else {
    // dev hoặc thiếu SMTP: chỉ log ra console
    /* eslint-disable no-console */
    console.log(`── Email (mock) ──
To: ${options.to}
Subject: ${options.subject}
${options.text}
──────────────────`)
  }
}

// === VERIFY ===
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
) {
  const url = `${process.env.BASE_URL}/auth/verify-email/token?token=${token}`

  await _send({
    to: email,
    subject: "Verify your JobWinner account",
    html: `
      <p>Hi ${name || "there"},</p>
      <p>Thanks for signing up! Please confirm your email by clicking the link below:</p>
      <p><a href="${url}" style="color:#0d9488">Verify my email</a></p>
      <p>This link will expire in 24 hours.</p>
    `,
    text: `Hi ${name || ""}, Confirm your account: ${url}`,
  })
}

// === RESET PASSWORD ===
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
) {
  const url = `${process.env.BASE_URL}/auth/reset-password?token=${token}`

  await _send({
    to: email,
    subject: "Reset your JobWinner password",
    html: `
      <p>Hi ${name || "there"},</p>
      <p>You requested to reset your password. Click the link below:</p>
      <p><a href="${url}" style="color:#0d9488">Reset password</a></p>
      <p>This link will expire in 1 hour. If you didn’t request it, just ignore this email.</p>
    `,
    text: `Hi ${name || ""}, Reset your password: ${url}`,
  })
}
