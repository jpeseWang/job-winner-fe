"use client"
import Link from "next/link"
import { Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"

export default function JobSeekerDashboardHeader() {
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", href: "/dashboard/job-seeker" },
    { name: "My Applications", href: "/dashboard/job-seeker/proposals" },
    { name: "My Profile", href: "/dashboard/job-seeker/my-profile" },
    { name: "CV Library", href: "/dashboard/job-seeker/cv-library" },
  ]
  let activeItem = navItems.find(item =>
    item.href !== "/dashboard/job-seeker" && pathname.startsWith(item.href)
  );
  if (!activeItem) {
    activeItem = navItems.find(item => item.href === "/dashboard/job-seeker");
  }
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded inline-flex items-center">
                <User className="h-3 w-3 mr-1" />
                Job Seeker
              </span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = activeItem?.name === item.name;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                        ? "border-teal-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>

          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>


          </div>
        </div>
      </div>
    </header>
  )
}
