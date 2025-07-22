import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"
import User from "@/models/User";

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await dbConnect();
    const userId = params.id;
    const { status } = await req.json();

    if (!["active", "banned"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User status updated", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
