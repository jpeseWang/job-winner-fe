"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { UserRole } from "@/types/enums"

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  console.log("Session:", session)
  console.log("Status:", status)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-black text-white py-4 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <span className="font-bold text-xl">Job Winner</span>
          </Link>

          <nav className="hidden md:flex ml-10">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className={`hover:text-teal-400 transition ${pathname === "/" ? "text-teal-400" : ""}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className={`hover:text-teal-400 transition ${pathname === "/jobs" ? "text-teal-400" : ""}`}
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className={`hover:text-teal-400 transition ${pathname === "/about-us" ? "text-teal-400" : ""}`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className={`hover:text-teal-400 transition ${pathname === "/contact-us" ? "text-teal-400" : ""}`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4 relative" ref={menuRef}>
          {status === "authenticated" ? (
            <>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-semibold transition duration-200 hover:ring-2 hover:ring-teal-400 hover:shadow"
              >
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </button>

              <div
                className={`absolute right-0 top-12 bg-white text-black rounded shadow-md py-2 w-40 z-50 transform transition-all duration-200 ${isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
              >
                <Link
                  href={
                    session?.user?.role === UserRole.JOB_SEEKER
                      ? "/dashboard/job-seeker/my-profile"
                      : session?.user?.role === UserRole.RECRUITER
                        ? "/dashboard/recruiter"
                        : "/dashboard/admin"
                  }
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href={
                    session?.user?.role === UserRole.JOB_SEEKER
                      ? "/dashboard/job-seeker/proposals"
                      : session?.user?.role === UserRole.RECRUITER
                        ? "/dashboard/recruiter"
                        : "/dashboard/admin"
                  }
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() =>
                    signOut({ callbackUrl: "/auth/login" })
                  }
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-white hover:text-teal-400 transition">
                Login
              </Link>
              <Link href="/auth/register">
                <Button className="bg-teal-500 hover:bg-teal-600">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <nav>
            <ul className="flex flex-col space-y-4">
              <li>
                <Link
                  href="/"
                  className={`hover:text-teal-400 transition ${pathname === "/" ? "text-teal-400" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className={`hover:text-teal-400 transition ${pathname === "/jobs" ? "text-teal-400" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className={`hover:text-teal-400 transition ${pathname === "/about-us" ? "text-teal-400" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className={`hover:text-teal-400 transition ${pathname === "/contact-us" ? "text-teal-400" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-6 flex flex-col space-y-4">
            <Link
              href="/auth/login"
              className="text-white hover:text-teal-400 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="bg-teal-500 hover:bg-teal-600">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}