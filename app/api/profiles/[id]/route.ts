import { NextResponse, NextRequest } from "next/server";
import Profile from "@/models/Profile";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { UserRole } from "@/types/enums";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await params.id;
        await dbConnect()

        let profile = await Profile.findOne({ user: userId }).populate("user", "name email role");

        if (!profile) {
            const user = await User.findById(userId);

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            if (user.role === UserRole.JOB_SEEKER) {
                profile = await Profile.create({ user: user._id });
                profile = await Profile.findById(profile._id).populate("user", "name email role");
            } else {
                return NextResponse.json({ error: "Profile not found" }, { status: 404 });
            }
        }


        return NextResponse.json(profile, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await params.id;
        const profileData = await request.json();
        await dbConnect();

        // Update profile
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: userId },
            profileData,
            { new: true, runValidators: true }
        ).populate("user", "name email role");

        if (!updatedProfile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProfile, { status: 200 });
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}