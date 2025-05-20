"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Briefcase, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jobService } from "@/services/jobService"
import type { Job } from "@/types/interfaces"

interface RelatedJobsProps {
  currentJobId: string
  category?: string
}

export default function RelatedJobs({ currentJobId, category }: RelatedJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      try {
        const allJobsResponse = await jobService.getJobs({ category })
        const jobsArray = Array.isArray(allJobsResponse.data) ? allJobsResponse.data : []
        const filteredJobs = jobsArray.filter((job) => job.id !== currentJobId).slice(0, 4)
        setJobs(filteredJobs)
      } catch (error) {
        console.error("Failed to fetch related jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedJobs()
  }, [currentJobId, category])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-grow">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Image
                src={job.companyLogo || "/placeholder.svg"}
                alt={job.company}
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-gray-600 text-sm">{job.company}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.floor(Math.random() * 30) + 1} day{Math.floor(Math.random() * 30) + 1 !== 1 ? "s" : ""} ago
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>{job.salary}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button size="sm" className="bg-teal-500 hover:bg-teal-600" asChild>
                <Link href={`/jobs/${job.id}`}>Job Details</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
