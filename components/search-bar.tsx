"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (keyword) params.append("keyword", keyword)
    if (location) params.append("location", location)
    if (category) params.append("category", category)

    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg p-2 shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-2 flex-1">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Job Title or Keywords"
            className="w-full focus:outline-none bg-white"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-2 flex-1">
          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Location"
            className="w-full focus:outline-none bg-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex items-center p-2 flex-1">
          <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
          <select
            className="w-full focus:outline-none bg-transparent text-gray-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <Button type="submit" className="bg-teal-500 text-white hover:bg-teal-600 mt-2 md:mt-0 md:ml-2">
          Search Job
        </Button>
      </div>
    </form>
  )
}
