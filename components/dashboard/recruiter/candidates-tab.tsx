"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Calendar, Star, StarOff, Download, Eye } from "lucide-react"

// Mock candidates data
const candidates = [
  {
    id: "profile-1",
    name: "John Doe",
    title: "Frontend Developer",
    location: "New York, USA",
    skills: ["JavaScript", "React", "CSS", "HTML", "TypeScript"],
    experience: "3 years",
    education: "Bachelor of Science in Computer Science",
    photo: "/placeholder.svg?height=80&width=80",
    resumeUrl: "/resumes/john-doe.pdf",
    matchScore: 92,
    saved: true,
  },
  {
    id: "profile-2",
    name: "Jane Smith",
    title: "UX/UI Designer",
    location: "San Francisco, USA",
    skills: ["UI Design", "UX Research", "Figma", "Adobe XD", "Prototyping"],
    experience: "5 years",
    education: "Master of Fine Arts in Design",
    photo: "/placeholder.svg?height=80&width=80",
    resumeUrl: "/resumes/jane-smith.pdf",
    matchScore: 88,
    saved: false,
  },
  {
    id: "profile-3",
    name: "Mike Johnson",
    title: "Full Stack Developer",
    location: "Austin, USA",
    skills: ["JavaScript", "Node.js", "React", "MongoDB", "Express"],
    experience: "4 years",
    education: "Bachelor of Engineering in Computer Science",
    photo: "/placeholder.svg?height=80&width=80",
    resumeUrl: "/resumes/mike-johnson.pdf",
    matchScore: 85,
    saved: true,
  },
  {
    id: "profile-4",
    name: "Sarah Williams",
    title: "Product Manager",
    location: "Chicago, USA",
    skills: ["Product Strategy", "User Research", "Agile", "Roadmapping", "Analytics"],
    experience: "6 years",
    education: "MBA in Product Management",
    photo: "/placeholder.svg?height=80&width=80",
    resumeUrl: "/resumes/sarah-williams.pdf",
    matchScore: 78,
    saved: false,
  },
  {
    id: "profile-5",
    name: "David Brown",
    title: "DevOps Engineer",
    location: "Seattle, USA",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    experience: "4 years",
    education: "Bachelor of Science in Information Technology",
    photo: "/placeholder.svg?height=80&width=80",
    resumeUrl: "/resumes/david-brown.pdf",
    matchScore: 82,
    saved: true,
  },
]

export default function RecruiterCandidatesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [savedFilter, setSavedFilter] = useState("all")
  const [candidatesList, setCandidatesList] = useState(candidates)

  // Get unique skills for filter
  const allSkills = Array.from(new Set(candidates.flatMap((candidate) => candidate.skills)))

  // Filter candidates based on search term, skills, and saved status
  const filteredCandidates = candidatesList.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSkill = skillFilter === "all" || candidate.skills.includes(skillFilter)
    const matchesSaved =
      savedFilter === "all" ||
      (savedFilter === "saved" && candidate.saved) ||
      (savedFilter === "unsaved" && !candidate.saved)

    return matchesSearch && matchesSkill && matchesSaved
  })

  const toggleSaved = (id: string) => {
    setCandidatesList((prev) =>
      prev.map((candidate) => (candidate.id === id ? { ...candidate, saved: !candidate.saved } : candidate)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search candidates..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            {allSkills.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={savedFilter} onValueChange={setSavedFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Saved status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Candidates</SelectItem>
            <SelectItem value="saved">Saved</SelectItem>
            <SelectItem value="unsaved">Not Saved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 mb-4">No candidates found. Try adjusting your search filters.</p>
              <Button variant="outline">Browse All Candidates</Button>
            </CardContent>
          </Card>
        ) : (
          filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 bg-gray-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="relative mb-4">
                      <Image
                        src={candidate.photo || "/placeholder.svg"}
                        alt={candidate.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      <button
                        className="absolute -right-2 -bottom-2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                        onClick={() => toggleSaved(candidate.id)}
                      >
                        {candidate.saved ? (
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <h3 className="font-semibold text-center">{candidate.name}</h3>
                    <p className="text-gray-500 text-sm text-center mb-4">{candidate.title}</p>
                    <Badge className="bg-teal-100 text-teal-800 border-none mb-2">{candidate.matchScore}% Match</Badge>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="md:w-3/4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                        <p>{candidate.location}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Experience</h4>
                        <p>{candidate.experience}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Education</h4>
                        <p>{candidate.education}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Resume</h4>
                        <Button variant="link" className="p-0 h-auto text-teal-500">
                          Download Resume
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
