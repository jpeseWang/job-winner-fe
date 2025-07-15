import JobDetailsClient from "@/components/jobs/job-details-client"

interface JobDetailsPageProps {
  params: { id: string };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;    
  return <JobDetailsClient id={id} />;
}
