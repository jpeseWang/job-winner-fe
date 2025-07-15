"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jobService } from "@/services"

interface Category {
  label: string
  count: number
}

export default function SearchBar() {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [locations, setLocations] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await jobService.getFilterMetadata()
        setLocations(data.locations)
        setCategories(data.categories)
      } catch (err) {
        console.error("Failed to fetch filter metadata", err)
      }
    }

    fetchFilters()
  }, [])

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
        {/* Keyword input */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-2 flex-1">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Job Title or Keywords"
            className="w-full focus:outline-none text-black"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Location select */}
        <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-200 p-2 flex-1">
          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          <select
            className="w-full focus:outline-none bg-transparent text-gray-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc} className="text-black">
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Category select */}
        <div className="flex items-center p-2 flex-1">
          <Briefcase className="h-5 w-5 text-gray-400 mr-2 " />
          <select
            className="w-full focus:outline-none bg-transparent text-gray-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.label} value={cat.label} className="text-black">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 mt-2 md:mt-0 md:ml-2"
        >
          Search Job
        </Button>
      </div>
    </form>
  )
}
