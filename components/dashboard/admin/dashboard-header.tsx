import Link from "next/link"
import { Bell, User, LogOut, Settings, Shield } from "lucide-react"


export default function AdminDashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded inline-flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard/admin"
                className="border-teal-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/admin/users"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Users
              </Link>
              <Link
                href="/dashboard/admin/companies"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Company manager
              </Link>

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
