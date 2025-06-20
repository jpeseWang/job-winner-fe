import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { UserRole } from "@/types/enums"

import dbConnect from "@/lib/db"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const { email, password, role } = credentials as {
          email: string
          password: string
          role: UserRole.JOB_SEEKER | UserRole.RECRUITER 
        }
        // 1) Kết nối DB & tìm user theo email
        await dbConnect()
        const user = await User.findOne({ email: credentials!.email.toLowerCase() })

        // so khớp role
        // if (user.role !== role) {
        //   throw new Error("Wrong role selected")        // front-end sẽ nhận error
        // }

        // 2) Nếu không có user hoặc user không có password (tài khoản OAuth), báo lỗi chung
        if (!user || !user.password) throw new Error("Invalid email or password")

        // 3) So khớp mật khẩu (comparePassword đã dùng bcrypt bên Model)
        const isMatch = await user.comparePassword(credentials!.password)
        if (!isMatch) throw new Error("Invalid email or password")

        // 4) Kiểm tra đã xác thực email chưa
        if (!user.isVerified) throw new Error("Please verify your email")

        // 5) Trả object cho NextAuth ghi vào JWT / session
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {

      if (account?.provider === "google") {
        return true
      }

      const client = await clientPromise
      const db = client.db()
      const dbUser = await db.collection("users").findOne({ email: user.email })

      // nếu user chưa xác thực, không cho đăng nhập
      if (!dbUser?.isVerified) {
        throw new Error("Please verify your email before signing in.")
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      return token
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

