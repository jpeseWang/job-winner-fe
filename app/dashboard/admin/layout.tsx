import ProtectedLayout from "../ProtectedLayout";
import { UserRole } from "@/types/enums";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout requiredRole = {UserRole.ADMIN}>
      {children}
    </ProtectedLayout>
  )
}
