"use client"

import { useEffect, useMemo, useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jobService } from "@/services"
import type { Filters } from "@/types/interfaces/job"
import { debounce } from "lodash"

type Props = {
  onChange: (filters: {
    keyword: string
    location: string
    category: string[]
    type: string[]
    experienceLevel: string[]
  }) => void
}

export default function JobFilters({ onChange }: Props) {
  const [showFilters, setShowFilters] = useState(false)

  const [selected, setSelected] = useState({
    keyword: "",
    location: "",
    categories: new Set<string>(),
    types: new Set<string>(),
    experienceLevels: new Set<string>(),
  })

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    locations: [],
    types: [],
    experienceLevels: [],
  })

  useEffect(() => {
    const fetchFilters = async () => {
      const data = await jobService.getFilterMetadata()
      setFilters(data)
    }
    fetchFilters()
  }, [])

  // ✅ Debounced keyword handler
  const debouncedKeywordChange = useMemo(
    () =>
      debounce((updatedKeyword: string) => {
        onChange({
          keyword: updatedKeyword,
          location: selected.location,
          category: [...selected.categories],
          type: [...selected.types],
          experienceLevel: [...selected.experienceLevels],
        })
      }, 300),
    [selected]
  )

  const toggle = (
    field: "categories" | "types" | "experienceLevels",
    val: string
  ) =>
    setSelected((p) => {
      const s = new Set(p[field])
      s.has(val) ? s.delete(val) : s.add(val)
      return { ...p, [field]: s }
    })

  const apply = () => {
    onChange({
      keyword: selected.keyword,
      location: selected.location,
      category: [...selected.categories],
      type: [...selected.types],
      experienceLevel: [...selected.experienceLevels],
    })
  }

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        </Button>
      </div>

      <div className={`${showFilters ? "block" : "hidden"} md:block`}>
        <div className="mb-6">
          <h4 className="font-medium mb-2">Search by Job Title</h4>
          <input
            type="text"
            placeholder="e.g. Web Developer"
            value={selected.keyword}
            onChange={(e) => {
              const keyword = e.target.value
              setSelected((prev) => ({ ...prev, keyword }))
              debouncedKeywordChange(keyword)
            }}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Location</h4>
          <select
            value={selected.location}
            onChange={(e) => setSelected({ ...selected, location: e.target.value })}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Locations</option>
            {filters.locations.map((loc: string) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Category</h4>
          <div className="space-y-2">
            {filters.categories.map((cat) => (
              <div key={cat.label} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${cat.label}`}
                  checked={selected.categories.has(cat.label)}
                  onChange={() => toggle("categories", cat.label)}
                  className="mr-2"
                />
                <label htmlFor={`cat-${cat.label}`} className="text-sm">
                  {cat.label}
                </label>
                <span className="ml-auto text-xs text-gray-500">({cat.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Job Type</h4>
          <div className="space-y-2">
            {filters.types.map((type) => (
              <div key={type.label} className="flex items-center">
                <input
                  type="checkbox"
                  id={`type-${type.label}`}
                  checked={selected.types.has(type.label)}
                  onChange={() => toggle("types", type.label)}
                  className="mr-2"
                />
                <label htmlFor={`type-${type.label}`} className="text-sm">
                  {type.label}
                </label>
                <span className="ml-auto text-xs text-gray-500">({type.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Experience Level</h4>
          <div className="space-y-2">
            {filters.experienceLevels.map((exp) => (
              <div key={exp.label} className="flex items-center">
                <input
                  type="checkbox"
                  id={`exp-${exp.label}`}
                  checked={selected.experienceLevels.has(exp.label)}
                  onChange={() => toggle("experienceLevels", exp.label)}
                  className="mr-2"
                />
                <label htmlFor={`exp-${exp.label}`} className="text-sm">
                  {exp.label}
                </label>
                <span className="ml-auto text-xs text-gray-500">({exp.count})</span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600" onClick={apply}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
