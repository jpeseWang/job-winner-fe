import ProtectedLayout from "../ProtectedLayout";
import { UserRole } from "@/types/enums";

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout requiredRole = {UserRole.RECRUITER}>
      {children}
    </ProtectedLayout>
  )
}
