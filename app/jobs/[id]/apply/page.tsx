import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/types/enums";

import JobApplicationForm from "@/components/jobs/job-application-form";
import { jobService } from "@/services/jobService";
import JobCard from "@/components/job-card"
import { formatSalary } from "@/utils/formatters"

interface ApplyJobPageProps {
  params: {
    id: string;
  };
}

export default async function ApplyJobPage({ params }: ApplyJobPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?unauthorized=1");
  }

  const job = await jobService.getJobById(params.id, true);
  if (!job) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Job Info Header */}
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
            postedDays={job.postedDays || 0}
            logo={job.companyLogo || "/placeholder.svg?height=40&width=40"}
            hideButton={true}
          />
        </div>

        {/* Application Form */}
        <JobApplicationForm job={job} />
      </div>
    </main>
  );
}
import { Suspense } from "react"
import { notFound } from "next/navigation"
import JobApplicationForm from "@/components/jobs/job-application-form"
import { jobService } from "@/services/jobService"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ApplyJobPageProps {
  params: {
    id: string
  }
}

async function JobApplicationContent({ jobId }: { jobId: string }) {
  try {
    const job = await jobService.getJobById(jobId)

    if (!job) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Job Info Header */}
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={job.companyLogo || "/placeholder.svg?height=60&width=60"}
                alt={job.company}
                className="w-15 h-15 rounded-lg object-cover"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-lg text-gray-600 mb-1">{job.company}</p>
              <p className="text-gray-500">
                {job.location} • {job.type}
              </p>
              {job.salary && <p className="text-green-600 font-semibold mt-2">{job.salary}</p>}
            </div>
          </div>
        </Card>

        {/* Application Form */}
        <JobApplicationForm job={job} />
      </div>
    )
  } catch (error) {
    console.error("Error loading job:", error)
    notFound()
  }
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6 mb-8">
        <div className="flex items-start gap-4">
          <Skeleton className="w-15 h-15 rounded-lg" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function ApplyJobPage({ params }: ApplyJobPageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSkeleton />}>
        <JobApplicationContent jobId={params.id} />
      </Suspense>
    </main>
  )
}
