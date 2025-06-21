"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building,
  GraduationCap,
  Bookmark,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import JobContactForm from "@/components/jobs/job-contact-form";
import RelatedJobs from "@/components/jobs/related-jobs";
import { useJob } from "@/hooks/useJobs";
import { useToast } from "@/components/ui/use-toast";
import Loading from "@/components/ui/loading";
import { formatSalary } from "@/utils/formatters";
import ContactForm from "@/components/contact/contact-form"
import { DEFAULT_AVATAR } from "@/constants";

interface JobDetailsClientProps {
  id: string;
}

export default function JobDetailsClient({ id }: JobDetailsClientProps) {

  const { toast } = useToast();
  const { job, isLoading, error } = useJob(id);

  if (isLoading) {
    return <Loading message="Loading job details..." />
  }

  if (error || !job) {
    toast({
      title: "Error",
      description: error ? error.message : "Failed to load job details.",
      variant: "destructive",
    });
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-lg text-gray-500">
          Job not found or an error occurred.
        </p>
      </main>
    );
  }

  const formattedSalary = formatSalary(job.salary);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Job Posted Time */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Posted {(job.postedDays || 0)} day{job.postedDays !== 1 ? "s" : ""} ago
          </span>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Save job</span>
          </Button>
        </div>
      </div>

      {/* Job Header */}
      <section className="container mx-auto px-4 md:px-6 pb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-shrink-0">
            <Image
              src={job.companyLogo || DEFAULT_AVATAR}
              alt={job.company}
              width={60}
              height={60}
              className="rounded-full border"
            />
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <Link href={`/jobs/${job.id}/apply`}>
            <Button className="bg-teal-500 hover:bg-teal-600">Apply Job</Button>
          </Link>
        </div>
      </section>

      {/* Job Content */}
      <section className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>{formattedSalary}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>
                  {job.applicationDeadline
                    ? `Apply by ${new Date(
                      job.applicationDeadline
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}`
                    : "No deadline specified"}
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-gray-600 mb-4">{job.description}</p>
            </div>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Key Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 text-teal-500">✓</div>
                      <p className="text-gray-600">{resp}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Professional Skills / Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 text-teal-500">✓</div>
                      <p className="text-gray-600">{req}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Professional Skills
                </h2>
                <ul className="space-y-3">
                  {job.skills.map((skill, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 text-teal-500">✓</div>
                      <p className="text-gray-600">{skill}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-gray-50 hover:bg-gray-100"
                >
                  {job.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gray-50 hover:bg-gray-100"
                >
                  {job.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gray-50 hover:bg-gray-100"
                >
                  {job.location}
                </Badge>
                {job.isRemote && (
                  <Badge
                    variant="outline"
                    className="bg-gray-50 hover:bg-gray-100"
                  >
                    Remote-friendly
                  </Badge>
                )}
                {job.skills?.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-50 hover:bg-gray-100"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Share Job */}
            <div>
              <h3 className="font-semibold mb-3">Share Job:</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Overview */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">Job Overview</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Briefcase className="h-5 w-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Job Title</h4>
                    <p className="text-gray-600">{job.title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Building className="h-5 w-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Job Type</h4>
                    <p className="text-gray-600">{job.type}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Category</h4>
                    <p className="text-gray-600">{job.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Clock className="h-5 w-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Experience</h4>
                    <p className="text-gray-600">{job.experienceLevel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <GraduationCap className="h-5 w-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Degree</h4>
                    <p className="text-gray-600">
                      {job.educationLevel || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <DollarSign className="h-5 w-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Offered Salary</h4>
                    <p className="text-gray-600">{formattedSalary}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Location</h4>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-4 h-[150px] w-full rounded-md overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(job.location)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Card>

            {/* Contact Form */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">Send Us Message</h3>
              <ContactForm />
            </Card>
          </div>
        </div>
      </section>

      {/* Related Jobs */}
      <section className="container mx-auto px-4 md:px-6 py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Related Jobs</h2>
        {job.id && (
          <RelatedJobs currentJobId={job.id} category={job.category} />
        )}
      </section>
    </main>

  );
}
