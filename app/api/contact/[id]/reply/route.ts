import { NextResponse } from "next/server"
import Contact from "@/models/Contact"
import dbConnect from "@/lib/db"
import { sendAdminReplyEmail } from "@/lib/email"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  const { id } = params  
  const contact = await Contact.findById(id)
  if (!contact) {
    return NextResponse.json({ error: "Liên hệ không tồn tại" }, { status: 404 })
  }

  const { replyMessage } = await request.json()

  // Lưu phản hồi
  contact.replied = true
  contact.replies = contact.replies || []
  contact.replies.push({ message: replyMessage, createdAt: new Date() })
  await contact.save()

  // Gửi email phản hồi
  try {
await sendAdminReplyEmail(contact.fullName, contact.email, contact.message ,replyMessage)
  } catch (err) {
    console.error("Gửi email thất bại", err)
  }

  return NextResponse.json({ success: true })
}
