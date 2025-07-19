"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import JobApplicationForm from "@/components/jobs/job-application-form";
import JobCard from "@/components/job-card";
import { formatSalary } from "@/utils/formatters";
import { getTimeAgo } from "@/utils/getTimeAgo";
import { useAuth } from "@/hooks/use-auth";
import { jobService } from "@/services/jobService";

interface ApplyJobPageProps {
  params: {
    id: string;
  };
}

export default function ApplyJobPage({ params }: ApplyJobPageProps) {
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      redirect("/auth/login?unauthorized=1");
      return;
    }
    jobService.getJobById(params.id, true).then(setJob);
  }, [user, params.id]);

  if (!job) return <div>Loading...</div>;

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
  );
}
