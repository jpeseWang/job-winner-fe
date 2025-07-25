"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Tags,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { jobService } from "@/services/jobService";
import type { Job } from "@/types/interfaces";
import { formatSalary } from "@/utils/formatters";

interface RelatedJobsProps {
  currentJobId: string;
  category?: string;
}

export default function RelatedJobs({
  currentJobId,
  category,
}: RelatedJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect triggered:", { currentJobId, category });
    if (!currentJobId) return; 

    const fetchRelatedJobs = async () => {
      console.log("Fetching related jobs with ID:", currentJobId);
      
      try {
        const res = await jobService.getJobs({
          category: category ? [category] : undefined,
        });

        const allJobs = Array.isArray(res) ? res : res?.data ?? []

        const filteredJobs = allJobs
          .filter((job: Job) => job.id && job.id !== currentJobId)
          .slice(0, 4);

        console.log("filteredJobs:", filteredJobs)

        setJobs(filteredJobs);
      } catch (error) {
        console.error("Failed to fetch related jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRelatedJobs();
  }, [currentJobId, category]);


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
    );
  }

  if (jobs.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic">
        No related jobs found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job, index) => (
        <div
          key={job.id ?? `job-${index}`}
          className="border rounded-lg p-4 hover:shadow-md transition"
        >
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
                  {(job.postedDays || 0)} day{job.postedDays !== 1 ? "s" : ""} ago
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Tags className="h-4 w-4 text-gray-400" />
                  <span>{category}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <BarChart className="h-4 w-4 text-gray-400" />
                  <span>{job.experienceLevel}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    Apply by{" "}
                    {new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                size="sm"
                className="bg-teal-500 hover:bg-teal-600"
                asChild
              >
                <Link href={`/jobs/${job.id}`}>Job Details</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
