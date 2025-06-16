"use client"

import { useState } from "react"
import JobCard from "@/components/job-card"
import JobFilters from "@/components/job-filters"
import CompanyCard from "@/components/company-card"
import { Button } from "@/components/ui/button"
import { useJobs } from "@/hooks/useJobs"
import { Loader2 } from "lucide-react"
import type { Job } from "@/types/interfaces"

export default function JobsPage() {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: [] as string[],
    type: [] as string[],
    experienceLevel: [] as string[],
  })

  const { jobs, total, isLoading, totalPages, currentPage, goToPage } = useJobs({
    ...filters,
    limit: 10,
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    goToPage(1) 
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="min-h-screen">
      {/* Jobs Header */}
      <section className="bg-black text-white py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Jobs</h1>
        </div>
      </section>

      {/* Jobs Content */}
      <section className="py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="md:col-span-1">
              <JobFilters onChange={handleFilterChange} />
            </div>

            {/* Job Listings */}
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">
                  Showing {jobs.length} out of {total} results
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort by:</span>
                    <select className="border rounded-md px-2 py-1 text-sm">
                      <option>Latest</option>
                      <option>Oldest</option>
                      <option>Highest Salary</option>
                      <option>Lowest Salary</option>
                    </select>
                </div>
              </div>


              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    {jobs.map((job: Job, idx: number) => {
                      const uniqueKey = (job as any)._id ?? job.id ?? idx
                      const jobId = (job as any)._id ?? job.id ?? ""

                      const salaryString = job.salary
                        ? job.salary.isNegotiable
                          ? "Negotiable"
                          : `${job.salary.min ? `$${job.salary.min}` : ""}${
                              job.salary.min && job.salary.max ? " - " : ""
                            }${job.salary.max ? `$${job.salary.max}` : ""} per ${
                              job.salary.period
                            }`
                        : ""

                      return (
                        <JobCard
                          key={uniqueKey}
                          id={jobId}
                          title={job.title}
                          company={job.company}
                          location={job.location}
                          type={job.type}
                          salary={salaryString}
                          postedDays={job.postedDays || 0}
                          logo={job.companyLogo || "/placeholder.svg?height=40&width=40"}
                          detailed
                        />
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => {
                              goToPage(page)
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-teal-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Top Company</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <CompanyCard
              name="Instagram"
              logo="/placeholder.svg?height=60&width=60"
              description="Find jobs from Instagram and explore career opportunities at this social media giant."
              jobCount={25}
            />
            <CompanyCard
              name="Tesla"
              logo="/placeholder.svg?height=60&width=60"
              description="Join the electric revolution with Tesla and work on cutting-edge sustainable energy solutions."
              jobCount={32}
            />
            <CompanyCard
              name="McDonald's"
              logo="/placeholder.svg?height=60&width=60"
              description="Explore diverse roles at McDonald's, from restaurant operations to corporate positions."
              jobCount={18}
            />
            <CompanyCard
              name="Apple"
              logo="/placeholder.svg?height=60&width=60"
              description="Be part of Apple's innovative team and help create products that change the world."
              jobCount={40}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
