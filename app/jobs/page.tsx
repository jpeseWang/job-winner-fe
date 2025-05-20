import JobCard from "@/components/job-card"
import JobFilters from "@/components/job-filters"
import CompanyCard from "@/components/company-card"
import { Button } from "@/components/ui/button"
import Banner from "@/components/banner"

export default function JobsPage() {
  return (
    <main className="min-h-screen">
      {/* Jobs Header */}
      <Banner title="Job Market"/>

      {/* Jobs Content */}
      <section className="py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">Showing 5 out of 72 results</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select className="border rounded-md px-2 py-1 text-sm">
                <option>Latest</option>
                <option>Oldest</option>
                <option>Highest Salary</option>
                <option>Lowest Salary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="md:col-span-1">
              <JobFilters />
            </div>

            {/* Job Listings */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 gap-6">
                <JobCard
                  id="1"
                  title="Forward Security Director"
                  company="Reach, Fortitude and Strategi Inc."
                  location="New York, USA"
                  type="Full-time"
                  salary="$120,000-$140,000"
                  postedDays={2}
                  logo="/placeholder.svg?height=40&width=40"
                  detailed
                />

                <JobCard
                  id="2"
                  title="Regional Creative Facilitator"
                  company="Sketch - Studio Inc."
                  location="Los Angeles, USA"
                  type="Full-time"
                  salary="$90,000-$110,000"
                  postedDays={3}
                  logo="/placeholder.svg?height=40&width=40"
                  detailed
                />

                <JobCard
                  id="3"
                  title="Internal Integration Planner"
                  company="Trello, Spotify and Figma Inc."
                  location="Texas, USA"
                  type="Full-time"
                  salary="$100,000-$120,000"
                  postedDays={5}
                  logo="/placeholder.svg?height=40&width=40"
                  detailed
                />

                <JobCard
                  id="4"
                  title="District Intranet Director"
                  company="VoiceRadar - Media Inc."
                  location="Nevada, USA"
                  type="Full-time"
                  salary="$110,000-$130,000"
                  postedDays={7}
                  logo="/placeholder.svg?height=40&width=40"
                  detailed
                />

                <JobCard
                  id="5"
                  title="Corporate Tactics Facilitator"
                  company="Central, Focal and Metrics Inc."
                  location="Boston, USA"
                  type="Full-time"
                  salary="$95,000-$115,000"
                  postedDays={8}
                  logo="/placeholder.svg?height=40&width=40"
                  detailed
                />

                <JobCard
                  id="6"
                  title="Forward Accounts Consultant"
                  company="Plato, Inc."
                  location="Boston, USA"
                  type="Full-time"
                  salary="$85,000-$105,000"
                  postedDays={10}
                  logo="/placeholder.svg?height=40&width=40"
                  detailed
                />
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    ...
                  </Button>
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    8
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-teal-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Top Company</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <CompanyCard
              name="Instagram"
              logo="/placeholder.svg?height=60&width=60"
              description="Find jobs from Instagram and explore career opportunities at this social media giant."
              jobCount={25}
            />
            <CompanyCard
              name="Tesla"
              logo="/placeholder.svg?height=60&width=60"
              description="Join the electric revolution with Tesla and work on cutting-edge sustainable energy solutions."
              jobCount={32}
            />
            <CompanyCard
              name="McDonald's"
              logo="/placeholder.svg?height=60&width=60"
              description="Explore diverse roles at McDonald's, from restaurant operations to corporate positions."
              jobCount={18}
            />
            <CompanyCard
              name="Apple"
              logo="/placeholder.svg?height=60&width=60"
              description="Be part of Apple's innovative team and help create products that change the world."
              jobCount={40}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
