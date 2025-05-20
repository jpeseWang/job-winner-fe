import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecruiterJobsTab from "@/components/dashboard/recruiter/jobs-tab"
import RecruiterApplicationsTab from "@/components/dashboard/recruiter/applications-tab"
import RecruiterCandidatesTab from "@/components/dashboard/recruiter/candidates-tab"
import RecruiterAnalyticsTab from "@/components/dashboard/recruiter/analytics-tab"
import RecruiterDashboardHeader from "@/components/dashboard/recruiter/dashboard-header"

export default function RecruiterDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <RecruiterDashboardHeader />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <RecruiterJobsTab />
          </TabsContent>

          <TabsContent value="applications">
            <RecruiterApplicationsTab />
          </TabsContent>

          <TabsContent value="candidates">
            <RecruiterCandidatesTab />
          </TabsContent>

          <TabsContent value="analytics">
            <RecruiterAnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
