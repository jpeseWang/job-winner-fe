import Link from "next/link"
import JobCard from "@/components/job-card"
import CategoryCard from "@/components/category-card"
import SearchBar from "@/components/search-bar"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 px-4 md:px-8 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job Today!</h1>
            <p className="text-lg opacity-80 mb-8">
              Connecting Talent with Opportunity. Your Gateway to Career Success.
            </p>

            <SearchBar />
          </div>

          <div className="flex flex-wrap gap-8 justify-start mb-12">
            <div className="flex items-center gap-2">
              <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-white font-semibold">25</span>
              </div>
              <div>
                <p className="font-bold">75,000</p>
                <p className="text-sm opacity-70">Job Listings</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-white font-semibold">25</span>
              </div>
              <div>
                <p className="font-bold">95,000</p>
                <p className="text-sm opacity-70">Companies</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-white font-semibold">25</span>
              </div>
              <div>
                <p className="font-bold">150,000</p>
                <p className="text-sm opacity-70">Candidates</p>
              </div>
            </div>
          </div>

          {/* Company Logos */}
          <div className="flex flex-wrap gap-8 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">S</span>
              </div>
              <span className="text-white font-semibold">Spotify</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">S</span>
              </div>
              <span className="text-white font-semibold">Slack</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <span className="text-white font-semibold">Adobe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <span className="text-white font-semibold">Asana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-black font-bold">L</span>
              </div>
              <span className="text-white font-semibold">Linear</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Jobs Available</h2>
          <Link href="/jobs" className="text-teal-500 hover:underline">
            View all
          </Link>
        </div>

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
          />
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-teal-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CategoryCard icon="leaf" title="Agriculture" jobCount={1250} />
            <CategoryCard icon="factory" title="Metal Production" jobCount={1450} />
            <CategoryCard icon="shopping-bag" title="Commerce" jobCount={1300} />
            <CategoryCard icon="hard-hat" title="Construction" jobCount={1500} />
            <CategoryCard icon="hotel" title="Hotels & Tourism" jobCount={1350} />
            <CategoryCard icon="graduation-cap" title="Education" jobCount={1400} />
            <CategoryCard icon="landmark" title="Financial Services" jobCount={1550} />
            <CategoryCard icon="truck" title="Transport" jobCount={1200} />
          </div>
        </div>
      </section>

      {/* Good Life Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-4">Good Life Begins With</h2>
            <p className="text-gray-600 mb-4">
              Find your dream job with our comprehensive job marketplace. We connect talented professionals with top
              companies across various industries.
            </p>
            <p className="text-gray-600 mb-6">
              Our AI-powered CV analysis helps you stand out to employers by highlighting your most relevant skills and
              experience.
            </p>
            <Link
              href="/upload-cv"
              className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition"
            >
              Upload Your CV
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
