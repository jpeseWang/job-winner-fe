import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"
import { UserRole } from "@/types/enums"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.role) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  console.log("ROLE >> :", session.user.role)
  const target =
    session.user.role == UserRole.ADMIN
      ? "/dashboard/admin"
      : session.user.role == UserRole.RECRUITER
        ? "/dashboard/recruiter"
        : session.user.role == UserRole.JOB_SEEKER
          ? "/dashboard/job-seeker/proposals"
          : "/unauthorized"

  return NextResponse.redirect(new URL(target, request.url))
}