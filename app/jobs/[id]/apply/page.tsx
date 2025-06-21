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
