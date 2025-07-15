// lib/email.ts
import nodemailer from "nodemailer"
import path from "path"
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
  includeLogo?: boolean
}) {
  if (transporter) {
    const attachments = options.includeLogo
      ? [{
        filename: "logo2.jpg",
        path: path.resolve("public/logo2.jpg"),
        cid: "jobwinnerlogo",
      }]
      : []

    if (options.includeLogo) {
      console.log("📦 Logo path resolved:", path.resolve("public/logo2.jpg"))
    }

    await transporter!.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments,
    })
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

// === CONTACT FORM ===
export async function sendContactEmail(
  firstName: string,
  lastName: string,
  email: string,
  message: string,
) {
  const fullName = `${firstName.trim()} ${lastName.trim()}`
  const adminEmail = process.env.ADMIN_EMAIL || "jobwinnerr@gmail.com"

  const html = loadHtmlTemplate('verification-contact', {
    name: fullName,
    email,
    message,
  })

 await _send({
  to: adminEmail,
  subject: `📬 New contact from ${fullName}`,
  html,
  text: `New contact from ${fullName} (${email}):\n\n${message}`,
  includeLogo: true,
})

}
// === Verify Contact FORM ===
export async function sendContactConfirmationEmail(
  firstName: string,
  lastName: string,
  email: string,
  message: string
) {
  const fullName = `${firstName.trim()} ${lastName.trim()}`
  const html = loadHtmlTemplate("contact-information", {
    name: fullName,
    email,
    message,
  })

 await _send({
  to: email,
  subject: "We have received your contact request",
  html,
  text: `Hello ${fullName},\n\nThank you for reaching out to us. We will get back to you as soon as possible.\n\nYour message:\n${message}`,
  includeLogo: true,
})
}

// === ADMIN REPLY EMAIL ===
export async function sendAdminReplyEmail(
  fullName: string,
  email: string,
  message: string,
  replyMessage: string
) {
  const html = loadHtmlTemplate("admin-reply", {
    name: fullName,
    message,
    replyMessage,
  })

await _send({
  to: email,
  subject: "Reply from Job Winner",
  html,
  text: `Hello ${fullName},\n\nHere is our reply from Job Winner:\n\n${replyMessage}`,
  includeLogo: true,
});

}



// === VERIFY EMAIL===
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
    includeLogo: true,
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
    includeLogo: true,
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
    includeLogo: true,
  });
}

// === JOB APPLICATION NOTIFICATION ===
export async function sendRecruiterNotificationEmail({
  recruiterEmail,
  recruiterName,
  applicantName,
  applicantEmail,
  jobTitle,
  company,
}: {
  recruiterEmail: string
  recruiterName: string
  applicantName: string
  applicantEmail: string
  jobTitle: string
  company: string
}) {
  const html = loadHtmlTemplate("notify-recruiter", {
    name: recruiterName || "Recruiter",
    applicantName,
    applicantEmail,
    jobTitle,
    company,
    dashboardUrl: `${process.env.BASE_URL}/dashboard/recruiter`,
  })

  await _send({
    to: recruiterEmail,
    subject: `📨 Ứng viên mới cho công việc: ${jobTitle}`,
    html,
    text: `${applicantName} vừa nộp đơn cho công việc ${jobTitle}. Email: ${applicantEmail}`,
    includeLogo: true,
  })
}


