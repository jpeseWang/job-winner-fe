import ProtectedLayout from "../ProtectedLayout";
import { UserRole } from "@/types/enums";
import AdminDashboardHeader from "@/components/dashboard/admin/dashboard-header";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout requiredRole={UserRole.ADMIN}>
      <AdminDashboardHeader />
      {children}
    </ProtectedLayout>
  )
}
