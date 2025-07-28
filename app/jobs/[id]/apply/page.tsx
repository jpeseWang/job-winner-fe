"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import JobApplicationForm from "@/components/jobs/job-application-form"
import JobCard from "@/components/job-card"
import { formatSalary } from "@/utils/formatters"
import { getTimeAgo } from "@/utils/getTimeAgo"
import { useAuth } from "@/hooks/useAuth"
import { jobService } from "@/services/jobService"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface ApplyJobPageProps {
  params: {
    id: string
  }
}

export default function ApplyJobPage({ params }: ApplyJobPageProps) {
  const { user } = useAuth()
  const [job, setJob] = useState<any>(null)
  const [subscriptionChecked, setSubscriptionChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      redirect("/auth/login?unauthorized=1")
      return
    }

    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/subscription?userId=${user.id}&role=job_seeker`)
        if (!response.ok) throw new Error(`HTTP error ${response.status}`)
        const data = await response.json()

        if (!data.canApply) {
          toast.error(data.applyReason)
          router.push("/dashboard/job-seeker/unlock")
        }
      } catch (error) {
        console.error("Error checking subscription:", error)
        toast.error("Failed to check subscription. Redirecting...")
        redirect("/dashboard/job-seeker/unlock")
      } finally {
        setSubscriptionChecked(true)
      }
    }

    checkSubscription()
  }, [user])

  useEffect(() => {
    if (subscriptionChecked) {
      jobService.getJobById(params.id, true).then(setJob)
    }
  }, [subscriptionChecked, params.id])

  if (!subscriptionChecked || !job) return <div className="p-8 text-center">Loading...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <JobCard
            id={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            type={job.type}
            category={job.category}
            experienceLevel={job.experienceLevel}
            salary={formatSalary(job.salary)}
            postedDays={getTimeAgo(job.createdAt ?? "") || ""}
            logo={job.companyLogo || "/placeholder.svg?height=40&width=40"}
            hideButton={true}
          />
        </div>
        <JobApplicationForm job={job} />
      </div>
    </main>
  )
}