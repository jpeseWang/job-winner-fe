import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Job from "@/models/Job"
import Application from "@/models/Application"
import Payment from "@/models/Payment"
import { PaymentStatus, PaymentType } from "@/types/enums/index"

export async function GET() {
  try {
    await connectDB()
    const year = new Date().getFullYear()

    // Tổng số liệu
    const totalUsersPromise = User.aggregate([
      { $match: { role: { $in: ["job_seeker", "recruiter"] } } }, 
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ])
    const totalJobsPromise = Job.countDocuments({ status: { $in: ["active", "approved"] } })
    const totalApplicationsPromise = Application.countDocuments()

    // User Growth (12 tháng)
    const userGrowthPromise = User.aggregate([
      { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
      { $project: { month: { $month: "$createdAt" }, role: 1 } },
      { $group: { _id: { month: "$month", role: "$role" }, count: { $sum: 1 } } }
    ])

    // Job Postings (12 tháng)
    const jobPostingsPromise = Job.aggregate([
      { $match: { status: { $in: ["active", "approved"] }, publishedAt: { $ne: null } } },
      { $project: { month: { $month: "$publishedAt" } } },
      { $group: { _id: "$month", count: { $sum: 1 } } }
    ])

    // Applications Submitted (12 tháng)
    const applicationsPromise = Application.aggregate([
      { $match: { appliedDate: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
      { $project: { month: { $month: "$appliedDate" } } },
      { $group: { _id: "$month", count: { $sum: 1 } } }
    ])

    // Job Categories distribution
    const jobCategoriesPromise = Job.aggregate([
      { $match: { status: { $in: ["active", "approved"] } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Revenue: Tổng doanh thu và doanh thu từng tháng
    const revenuePromise = Payment.aggregate([
      { $match: { status: PaymentStatus.COMPLETED, type: PaymentType.SUBSCRIPTION } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])
    const monthlyRevenuePromise = Payment.aggregate([
      { $match: { status: PaymentStatus.COMPLETED, type: PaymentType.SUBSCRIPTION, createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
      { $project: { month: { $month: "$createdAt" }, amount: 1 } },
      { $group: { _id: "$month", total: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ])

    // Chạy song song
    const [totalUsers, totalJobs, totalApplications, userGrowth, jobPostings, applications, jobCategories, revenueAgg, monthlyRevenueAgg] = await Promise.all([
      totalUsersPromise, totalJobsPromise, totalApplicationsPromise,
      userGrowthPromise, jobPostingsPromise, applicationsPromise, jobCategoriesPromise,
      revenuePromise, monthlyRevenuePromise
    ])

    // Convert totalUsers to object
    const usersTotals = totalUsers.reduce(
      (acc, cur) => ({ ...acc, [cur._id]: cur.count }),
      {}
    )

    // Format 12 tháng
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      jobSeekers: 0,
      recruiters: 0,
      jobs: 0,
      applications: 0
    }))

    // Đổ userGrowth
    userGrowth.forEach(item => {
      const monthIdx = item._id.month - 1
      if (item._id.role === "job_seeker") months[monthIdx].jobSeekers = item.count
      if (item._id.role === "recruiter") months[monthIdx].recruiters = item.count
    })

    // Đổ jobPostings
    jobPostings.forEach(item => {
      const monthIdx = item._id - 1
      months[monthIdx].jobs = item.count
    })

    // Đổ applications
    applications.forEach(item => {
      const monthIdx = item._id - 1
      months[monthIdx].applications = item.count
    })

    // Xử lý revenue
    const totalRevenue = revenueAgg[0]?.total || 0
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      revenue: 0
    }))
    monthlyRevenueAgg.forEach(item => {
      const idx = item._id - 1
      if (idx >= 0 && idx < 12) monthlyRevenue[idx].revenue = item.total
    })

    // 📊 Tính % tăng trưởng (current vs previous month)
    const getGrowth = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0
      return Number((((current - prev) / prev) * 100).toFixed(1))
    }

    const thisMonthIdx = new Date().getMonth()
    const prevMonthIdx = thisMonthIdx === 0 ? 11 : thisMonthIdx - 1

    const growth = {
      users: getGrowth(
        months[thisMonthIdx].jobSeekers + months[thisMonthIdx].recruiters,
        months[prevMonthIdx].jobSeekers + months[prevMonthIdx].recruiters
      ),
      jobs: getGrowth(
        months[thisMonthIdx].jobs,
        months[prevMonthIdx].jobs
      ),
      applications: getGrowth(
        months[thisMonthIdx].applications,
        months[prevMonthIdx].applications
      )
    }

    const categoryDistribution = jobCategories.map(cat => ({
      name: cat._id,
      value: cat.count
    }))

    return NextResponse.json({
      totals: {
        totalUsers: (usersTotals.job_seeker || 0) + (usersTotals.recruiter || 0),
        users: usersTotals,
        jobs: totalJobs,
        applications: totalApplications,
        growth,
        totalRevenue
      },
      monthly: months,
      categories: categoryDistribution,
      monthlyRevenue
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
