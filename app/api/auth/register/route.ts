import { NextResponse } from "next/server"
import { userService } from "@/services"
import { validateUser } from "@/utils/validators"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate user data
    const { data, errors } = validateUser(body)

    if (errors) {
      return NextResponse.json({ error: errors[0].message }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(body.email)

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create user
    const newUser = await userService.createUser({
      name: body.name,
      email: body.email,
      password: body.password, // In a real app, this would be hashed
      role: body.role,
      company: body.company,
    })

    // Return success response without sensitive data
    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register user" },
      { status: 500 },
    )
  }
}
