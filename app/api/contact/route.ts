import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { sendContactConfirmationEmail, sendContactEmail } from "@/lib/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Contact from "@/models/Contact"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Require authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để gửi liên hệ." },
        { status: 401 }
      )
    }

    const { firstName, lastName, email, message } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ họ tên, email và nội dung liên hệ." },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ." },
        { status: 400 }
      )
    }

    await dbConnect()
    await Contact.create({
  fullName: `${firstName} ${lastName}`,
  email,
  message,
  replied: false  
})

 try {
  // Gửi email cho admin
  try {
    await sendContactEmail(firstName, lastName, email, message)
  } catch (adminEmailError) {
    console.error(" Gửi email đến admin thất bại:", adminEmailError)
  }

  // Gửi email xác nhận cho user
  try {
    await sendContactConfirmationEmail(firstName, lastName, email, message)
  } catch (userEmailError) {
    console.error(" Gửi email xác nhận cho người dùng thất bại:", userEmailError)
  }

  return NextResponse.json(
    { message: "Tin nhắn đã được gửi thành công." },
    { status: 200 }
  )
} catch (error) {
  console.error("Lỗi xử lý contact:", error)
  return NextResponse.json(
    { error: "Lỗi máy chủ nội bộ." },
    { status: 500 }
  )
}
  } catch (error) {
    console.error("Lỗi gửi liên hệ:", error)
  }
}

// Lấy danh sách liên hệ với các bộ lọc và sắp xếp
export async function GET(req: NextRequest) {
  await dbConnect()

  const searchParams = req.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") // replied | pending
  const sort = searchParams.get("sort") || "-createdAt"

  const query: any = {}

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } }
    ]
  }

  if (status === "replied") {
    query.replied = true
  }

  if (status === "pending") {
    query.$or = [
      ...(query.$or || []),
      { replied: false },
      { replied: { $exists: false } }
    ]
  }

  const contacts = await Contact.find(query).sort(sort)
  return NextResponse.json(contacts)
}
