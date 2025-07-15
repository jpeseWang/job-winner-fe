import { NextResponse, NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { role } = await req.json()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()
  const user = await db.collection("users").findOne({ email: session.user.email })

  if (user?.role) {
    // Role already set, just return success without updating
    return NextResponse.json({ success: true })
  }

  await db.collection("users").updateOne(
    { email: session.user.email },
    { $set: { role } }
  )

  return NextResponse.json({ success: true })
}
