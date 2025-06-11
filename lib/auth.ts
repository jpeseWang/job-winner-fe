import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { UserRole } from "@/types/enums"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = Promise.resolve(client)

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: UserRole.JOB_SEEKER, // Default role for Google sign-up
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        await dbConnect()

        try {
          const user = await User.findOne({ email: credentials.email.toLowerCase() })

          if (!user) {
            throw new Error("No user found with this email")
          }

          if (!user.isActive) {
            throw new Error("Account is deactivated")
          }

          const isPasswordValid = await user.comparePassword(credentials.password)

          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.profilePicture,
            isVerified: user.isVerified,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          throw new Error(error instanceof Error ? error.message : "Authentication failed")
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.isVerified = user.isVerified
      }

      // Handle Google OAuth
      if (account?.provider === "google" && user) {
        await dbConnect()

        // Check if user exists in our database
        let dbUser = await User.findOne({ email: user.email })

        if (!dbUser) {
          // Create new user for Google OAuth
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            profilePicture: user.image,
            role: UserRole.JOB_SEEKER,
            isVerified: true, // Google accounts are pre-verified
            isActive: true,
          })
        } else {
          // Update existing user's Google info
          await User.findByIdAndUpdate(dbUser._id, {
            profilePicture: user.image,
            lastLogin: new Date(),
          })
        }

        token.role = dbUser.role
        token.isVerified = dbUser.isVerified
        token.id = dbUser._id.toString()
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        console.log("Google sign-in successful for:", user.email)
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
}
