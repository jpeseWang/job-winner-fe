// lib/email.ts
import nodemailer from "nodemailer"
import { loadHtmlTemplate } from '@/utils/loadHtmlTemplate'

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

  const html = loadHtmlTemplate('verification-code', {
    name: name || 'there',
    token,
    url,
  })

  await _send({
    to: email,
    subject: 'Verify your JobWinner account',
    html,
    text: `Hi ${name || ''}, confirm your account: ${url}`,
  })
}

// === RESET PASSWORD ===
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
) {
  const url = `${process.env.BASE_URL}/auth/reset-password?token=${token}`

  const html = loadHtmlTemplate('reset-password', {
    name: name || 'there',
    url,
  })

  await _send({
    to: email,
    subject: 'Reset your JobWinner password',
    html,
    text: `Hi ${name || ''}, reset your password: ${url}`,
  })
}

// === WELCOME ===
export async function sendWelcomeEmail(email: string, name: string) {
  const url = `${process.env.BASE_URL}/dashboard`;         
  const html = loadHtmlTemplate('welcome', { name, url }); 

  await _send({
    to: email,
    subject: 'Welcome to Job Winner 🎉',
    html,
    text: `Hi ${name || ''}, welcome to Job Winner! Visit your dashboard: ${url}`,
  });
}
