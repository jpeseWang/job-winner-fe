import ProtectedLayout from "../ProtectedLayout";
import { UserRole } from "@/types/enums";

export default function JobSeekerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout requiredRole = {UserRole.JOB_SEEKER}>
      {children}
    </ProtectedLayout>
  )
}
