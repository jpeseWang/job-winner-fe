import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminDashboardHeader from "@/components/dashboard/admin/dashboard-header"
import AdminUsersTab from "@/components/dashboard/admin/users-tab"
import AdminJobsTab from "@/components/dashboard/admin/jobs-tab"
import AdminStatisticsTab from "@/components/dashboard/admin/statistics-tab"
import AdminSettingsTab from "@/components/dashboard/admin/settings-tab"
import AdminTemplatesTab from "@/components/dashboard/admin/templates-tab"
import AdminReportsTab from "@/components/dashboard/admin/reports-tab"

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">


      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="statistics" className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="statistics">
            <AdminStatisticsTab />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="jobs">
            <AdminJobsTab />
          </TabsContent>

          <TabsContent value="templates">
            <AdminTemplatesTab />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReportsTab />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
