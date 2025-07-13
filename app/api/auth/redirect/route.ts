import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"
import { UserRole } from "@/types/enums"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.role) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    return NextResponse.redirect(loginUrl)
  }

  let targetPath: string;
  switch (session.user.role) {
    case UserRole.ADMIN:
      targetPath = "/dashboard/admin";
      break;
    case UserRole.RECRUITER:
      targetPath = "/dashboard/recruiter";
      break;
    case UserRole.JOB_SEEKER:
      targetPath = "/dashboard/job-seeker";
      break;
    default:
      targetPath = "/unauthorized";
      break;
  }
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = targetPath

  return NextResponse.redirect(redirectUrl)
}