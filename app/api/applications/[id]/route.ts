import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Application from "@/models/Application"
import Company from "@/models/Company"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect()

        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 },
            )
        }

        // Get application with populated job and company data
        const application = await Application.findById(params.id)
            .populate("jobId")
            .populate("userId", "name email")
            .lean()



        if (!application) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Application not found",
                },
                { status: 404 },
            )
        }

        // Check if user owns this application or is the job poster
        const isOwner =
            !Array.isArray(application) &&
            application.userId &&
            application.userId._id &&
            application.userId._id.toString() === session.user.id
        const isJobPoster =
            !Array.isArray(application) &&
            application.userId?.toString() === session.user.id

        if (!isOwner && !isJobPoster) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Forbidden",
                },
                { status: 403 },
            )
        }
        console.log("Application API:", application)
        // Transform the data to match the expected structure
        const transformedApplication = {
            ...application,
            job: {
                _id: application.jobId._id,
                title: application.jobId.title,
                location: application.jobId.location,
                salary: application.jobId.salary,

            },
        }

        return NextResponse.json({
            success: true,
            data: transformedApplication,
        })
    } catch (error) {
        console.error("Error fetching application:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch application",
            },
            { status: 500 },
        )
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect()

        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 },
            )
        }

        const body = await request.json()
        const { status, notes, feedback, interviewDate } = body

        // Find the application
        const application = await Application.findById(params.id)
        if (!application) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Application not found",
                },
                { status: 404 },
            )
        }

        // Check permissions
        const isOwner = application.userId.toString() === session.user.id
        const job = await Application.findById(params.id).populate({
            path: "jobId",
            populate: { path: "companyId" },
        })
        const isJobPoster = job?.jobId?.companyId?.userId?.toString() === session.user.id

        if (!isOwner && !isJobPoster) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Forbidden",
                },
                { status: 403 },
            )
        }

        // Update fields based on user role
        const updateData: any = {}

        if (isJobPoster) {
            // Job poster can update status, feedback, and interview date
            if (status) updateData.status = status
            if (feedback !== undefined) updateData.feedback = feedback
            if (interviewDate) updateData.interviewDate = new Date(interviewDate)
        }

        if (isOwner) {
            // Application owner can update notes
            if (notes !== undefined) updateData.notes = notes
        }

        updateData.updatedAt = new Date()

        const updatedApplication = await Application.findByIdAndUpdate(params.id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate({
                path: "jobId",
                populate: {
                    path: "companyId",
                    model: "Company",
                },
            })
            .populate("userId", "name email")

        return NextResponse.json({
            success: true,
            data: updatedApplication,
        })
    } catch (error) {
        console.error("Error updating application:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update application",
            },
            { status: 500 },
        )
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect()

        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                { status: 401 },
            )
        }

        // Find the application
        const application = await Application.findById(params.id)
        if (!application) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Application not found",
                },
                { status: 404 },
            )
        }

        // Check if user owns this application
        if (application.userId.toString() !== session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Forbidden",
                },
                { status: 403 },
            )
        }

        await Application.findByIdAndDelete(params.id)

        return NextResponse.json({
            success: true,
            message: "Application deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting application:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete application",
            },
            { status: 500 },
        )
    }
}
