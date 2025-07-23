import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const userId = params.id;
    const { name, email, role, status } = await req.json();

    if (!name || !email || !role || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role, status },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("[USER_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
