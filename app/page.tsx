"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import JobCard from "@/components/job-card"
import CategoryCard from "@/components/category-card"
import SearchBar from "@/components/search-bar"
import { Briefcase, Building, Users } from "lucide-react"
import { jobService } from "@/services/jobService"
import type { Job } from "@/types/interfaces"
import type { FilterOption } from "@/types/interfaces/job"
import { formatSalary } from "@/utils/formatters"

export default function Home() {
  const [jobCount, setJobCount] = useState<number>(0)
  const [companyCount, setCompanyCount] = useState<number>(0)
  const [candidateCount, setCandidateCount] = useState(0)
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await jobService.getJobOverview()
        setJobCount(data.jobCount)
        setCompanyCount(data.companyCount)
        setCandidateCount(data.candidateCount)
      } catch (err) {
        console.error("Failed to fetch job count:", err)
      }
    }
    fetchOverview()
  }, []);

  const [latestJobs, setLatestJobs] = useState<Job[]>([])
  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const data = await jobService.getLatestJobs(5)
        setLatestJobs(data)
      } catch (err) {
        console.error("Failed to fetch latest jobs:", err)
      }
    }
    fetchLatestJobs()
  }, []);

  const [categories, setCategories] = useState<FilterOption[]>([])
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await jobService.getFilterMetadata()
        setCategories(data.categories)
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }
    fetchCategories()
  }, [])

  const categoryIconMap: Record<string, string> = {
    "Technology": "cpu",
    "Telecommunications": "radio-tower",
    "Health Medical": "stethoscope",
    "Education": "graduation-cap",
    "Hospitality": "hotel",
    "Manufacturing": "factory",
    "Engineering": "wrench",
    "Financial Services": "landmark",
  }


  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job Today!</h1>
            <p className="text-lg opacity-80 mb-8">
              Connecting Talent with Opportunity. Your Gateway to Career Success.
            </p>

            <SearchBar />
          </div>

          <div className="flex flex-wrap gap-8 justify-start mb-12">
            <div className="flex items-center gap-2">
              <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold">{jobCount.toLocaleString()}</p>
                <p className="text-sm opacity-70">Job Listings</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold">{companyCount.toLocaleString()}</p>
                <p className="text-sm opacity-70">Companies</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold">{candidateCount.toLocaleString()}</p>
                <p className="text-sm opacity-70">Candidates</p>
              </div>
            </div>
          </div>

          {/* Company Logos */}
          <div className="flex flex-wrap gap-8 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">S</span>
              </div>
              <span className="text-white font-semibold">Spotify</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">S</span>
              </div>
              <span className="text-white font-semibold">Slack</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <span className="text-white font-semibold">Adobe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <span className="text-white font-semibold">Asana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">L</span>
              </div>
              <span className="text-white font-semibold">Linear</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Jobs Available</h2>
          <Link href="/jobs" className="text-teal-500 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {latestJobs 
            .filter((j) => j.id)                      // chỉ lấy job hợp lệ
            .map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              type={job.type}
              category={job.category}
              experienceLevel={job.experienceLevel}
              salary={formatSalary(job.salary)}
              postedDays={job.postedDays || 0}
              logo={job.companyLogo || "/placeholder.svg?height=40&width=40"}
            />
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-teal-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.label}
                icon={categoryIconMap[cat.label] || "briefcase"}
                title={cat.label}
                jobCount={cat.count}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Good Life Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src="/cv-upload.jpg"
              alt="Upload your CV illustration"
              className="rounded-lg object-cover w-full h-64"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-4">Good Life Begins With</h2>
            <p className="text-gray-600 mb-4">
              Find your dream job with our comprehensive job marketplace. We connect talented professionals with top
              companies across various industries.
            </p>
            <p className="text-gray-600 mb-6">
              Our AI-powered CV analysis helps you stand out to employers by highlighting your most relevant skills and
              experience.
            </p>
            <Link
              href="/upload-cv"
              className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition"
            >
              Upload Your CV
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
