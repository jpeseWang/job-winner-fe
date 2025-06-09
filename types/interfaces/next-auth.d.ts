import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role?: string
    isVerified?: boolean
  }

  interface Session {
    user: {
      id: string
      role?: string
      isVerified?: boolean
    } & DefaultSession["user"]
  }

  interface JWT {
    id?: string
    role?: string
    isVerified?: boolean
  }
}
