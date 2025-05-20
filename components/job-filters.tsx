"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function JobFilters() {
  const [showFilters, setShowFilters] = useState(false)
  const [salary, setSalary] = useState([30000, 150000])

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
          <input type="text" placeholder="e.g. Web Developer" className="w-full border rounded-md px-3 py-2 text-sm" />
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Location</h4>
          <select className="w-full border rounded-md px-3 py-2 text-sm">
            <option value="">All Locations</option>
            <option value="new-york">New York</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="chicago">Chicago</option>
            <option value="houston">Houston</option>
            <option value="miami">Miami</option>
          </select>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Category</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="tech" className="mr-2" />
              <label htmlFor="tech" className="text-sm">
                Technology
              </label>
              <span className="ml-auto text-xs text-gray-500">(45)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="telecom" className="mr-2" />
              <label htmlFor="telecom" className="text-sm">
                Telecommunications
              </label>
              <span className="ml-auto text-xs text-gray-500">(32)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="health" className="mr-2" />
              <label htmlFor="health" className="text-sm">
                Health & Medical
              </label>
              <span className="ml-auto text-xs text-gray-500">(25)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="education" className="mr-2" />
              <label htmlFor="education" className="text-sm">
                Education
              </label>
              <span className="ml-auto text-xs text-gray-500">(18)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="finance" className="mr-2" />
              <label htmlFor="finance" className="text-sm">
                Financial Services
              </label>
              <span className="ml-auto text-xs text-gray-500">(12)</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Job Type</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="full-time" className="mr-2" />
              <label htmlFor="full-time" className="text-sm">
                Full Time
              </label>
              <span className="ml-auto text-xs text-gray-500">(56)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="part-time" className="mr-2" />
              <label htmlFor="part-time" className="text-sm">
                Part Time
              </label>
              <span className="ml-auto text-xs text-gray-500">(24)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="contract" className="mr-2" />
              <label htmlFor="contract" className="text-sm">
                Contract
              </label>
              <span className="ml-auto text-xs text-gray-500">(32)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="freelance" className="mr-2" />
              <label htmlFor="freelance" className="text-sm">
                Freelance
              </label>
              <span className="ml-auto text-xs text-gray-500">(18)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="internship" className="mr-2" />
              <label htmlFor="internship" className="text-sm">
                Internship
              </label>
              <span className="ml-auto text-xs text-gray-500">(9)</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Experience Level</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="no-experience" className="mr-2" />
              <label htmlFor="no-experience" className="text-sm">
                No Experience
              </label>
              <span className="ml-auto text-xs text-gray-500">(15)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="entry-level" className="mr-2" />
              <label htmlFor="entry-level" className="text-sm">
                Entry Level
              </label>
              <span className="ml-auto text-xs text-gray-500">(22)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="mid-level" className="mr-2" />
              <label htmlFor="mid-level" className="text-sm">
                Mid Level
              </label>
              <span className="ml-auto text-xs text-gray-500">(35)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="senior" className="mr-2" />
              <label htmlFor="senior" className="text-sm">
                Senior
              </label>
              <span className="ml-auto text-xs text-gray-500">(28)</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="expert" className="mr-2" />
              <label htmlFor="expert" className="text-sm">
                Expert
              </label>
              <span className="ml-auto text-xs text-gray-500">(12)</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Salary Range</h4>
          <div className="px-2">
            <Slider
              defaultValue={[30000, 150000]}
              min={0}
              max={200000}
              step={5000}
              value={salary}
              onValueChange={setSalary}
              className="my-6"
            />
            <div className="flex justify-between text-sm">
              <span>${salary[0].toLocaleString()}</span>
              <span>${salary[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs">Development</div>
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs">Design</div>
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs">Marketing</div>
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs">Management</div>
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs">Remote</div>
          </div>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600">Apply Filters</Button>
      </div>
    </div>
  )
}
