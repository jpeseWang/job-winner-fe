import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import Application from "@/models/Application";
import { UserRole } from "@/types/enums";

// Tính conversion rate (ví dụ: số ứng tuyển / số lượt xem)
function calculateConversionRate(applications: number, views: number) {
  return views > 0 ? ((applications / views) * 100).toFixed(2) : "0.00";
}

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.RECRUITER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recruiterId = session.user.id;

    // Lấy tất cả công việc của nhà tuyển dụng
    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map((job) => job._id.toString()); // Chuyển ObjectId thành chuỗi

    // Lấy đơn ứng tuyển
    const applications = await Application.find({ jobId: { $in: jobIds } }); // Sử dụng jobId

    // Ứng viên được tuyển
    const candidatesHired = applications.filter((app) => app.status === "hired");

    // Lượt xem
    const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

    // Dòng thời gian: đơn ứng tuyển theo tháng
    const timeline = await Application.aggregate([
      {
        $match: {
          jobId: { $in: jobIds } // Sử dụng jobId
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const applicationTimeline = timeline.map((item) => ({
      month: item._id,
      count: item.count
    }));

    // Phân tích trạng thái đơn
    const statusCounts = await Application.aggregate([
      {
        $match: {
          jobId: { $in: jobIds } // Sử dụng jobId
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const applicationStatusBreakdown = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Hiệu suất công việc
    const topJobPerformance = jobs.map((job) => {
      const jobApplications = applications.filter((a) => a.jobId === job._id.toString()); // Sử dụng jobId
      return {
        title: job.title,
        applications: jobApplications.length,
        views: job.views || 0
      };
    }).sort((a, b) => b.applications - a.applications).slice(0, 5);

    const responseData = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((job) => job.status === "active").length,
      totalApplications: applications.length,
      candidatesHired: candidatesHired.length,
      totalViews,
      conversionRate: calculateConversionRate(applications.length, totalViews),
      applicationTimeline,
      applicationStatusBreakdown,
      topJobPerformance
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("❌ Lỗi trong API phân tích nhà tuyển dụng:", error);
    return NextResponse.json({ error: "Lỗi server nội bộ" }, { status: 500 });
  }
}
