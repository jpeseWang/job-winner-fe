"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { companyService } from "@/services/companyService"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function RecruiterDashboardHeader() {
  const { user } = useAuth()
  const [myCompany, setMyCompany] = useState<any>(null)
  const pathname = usePathname()
  const isCreatingJob = pathname.includes("/dashboard/recruiter/jobs/new")
  const userId = user?.id
  useEffect(() => {
    const fetchMyCompany = async () => {
      try {
        if (!userId) return
        const res = await companyService.getCompanyById(userId)
        setMyCompany(res)
      } catch (err) {
        console.error(err)
        toast({
          title: "Error",
          description: "Could not fetch your company info.",
          variant: "destructive",
        })
      }
    }

    fetchMyCompany()
  }, [userId])

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          {isCreatingJob && <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/recruiter">Back to Dashboard</Link>
          </Button>}

          <Button asChild>
            <Link href="/dashboard/recruiter/jobs/new">Post New Job</Link>
          </Button>

          {myCompany && !myCompany.isVerified && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-md border border-yellow-400 cursor-not-allowed">
              <Briefcase className="h-4 w-4" />
              Waiting for company verification
            </div>
          )}

          {!myCompany && (
            <Button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition">
              <Link href="/dashboard/recruiter/register-company">Register New Company</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
