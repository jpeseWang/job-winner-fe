import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.role) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  const target =
    session.user.role == "admin"
      ? "/dashboard/admin"
      : session.user.role == "recruiter"
        ? "/dashboard/recruiter"
        : "/dashboard/job-seeker"

  return NextResponse.redirect(new URL(target, request.url))
}