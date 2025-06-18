import JobDetailsClient from "@/components/jobs/job-details-client"

interface JobDetailsPageProps {
  params: {
    id: string
  }
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = params

  return <JobDetailsClient id={id} />
}
