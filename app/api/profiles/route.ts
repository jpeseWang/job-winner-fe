import { NextResponse } from "next/server"

// GET /api/profiles - Get job seeker profiles (requires authentication)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const skills = searchParams.get("skills")?.split(",")
  const experience = searchParams.get("experience")
  const location = searchParams.get("location")

  // In a real app, we would fetch from database
  // For demo, we'll return mock data
  const profiles = [
    {
      id: "profile-1",
      userId: "user-1",
      name: "John Doe",
      title: "Frontend Developer",
      location: "New York, USA",
      skills: ["JavaScript", "React", "CSS", "HTML", "TypeScript"],
      experience: "3 years",
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "New York University",
          year: "2020",
        },
      ],
      bio: "Passionate frontend developer with experience in building responsive web applications.",
      contactEmail: "john@example.com",
      profilePicture: "/placeholder.svg?height=100&width=100",
      resumeUrl: "/resumes/john-doe.pdf",
      socialLinks: {
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        portfolio: "https://johndoe.dev",
      },
      isPublic: true,
    },
    {
      id: "profile-2",
      userId: "user-2",
      name: "Jane Smith",
      title: "UX/UI Designer",
      location: "San Francisco, USA",
      skills: ["UI Design", "UX Research", "Figma", "Adobe XD", "Prototyping"],
      experience: "5 years",
      education: [
        {
          degree: "Master of Fine Arts in Design",
          institution: "California Institute of Arts",
          year: "2018",
        },
      ],
      bio: "Creative designer focused on creating intuitive and beautiful user experiences.",
      contactEmail: "jane@example.com",
      profilePicture: "/placeholder.svg?height=100&width=100",
      resumeUrl: "/resumes/jane-smith.pdf",
      socialLinks: {
        linkedin: "https://linkedin.com/in/janesmith",
        dribbble: "https://dribbble.com/janesmith",
        portfolio: "https://janesmith.design",
      },
      isPublic: true,
    },
  ]

  let filteredProfiles = [...profiles]

  // Apply filters
  if (skills && skills.length > 0) {
    filteredProfiles = filteredProfiles.filter((profile) => skills.some((skill) => profile.skills.includes(skill)))
  }

  if (experience) {
    // Simple filtering by experience (in a real app, this would be more sophisticated)
    const years = Number.parseInt(experience)
    if (!isNaN(years)) {
      filteredProfiles = filteredProfiles.filter((profile) => {
        const profileYears = Number.parseInt(profile.experience)
        return !isNaN(profileYears) && profileYears >= years
      })
    }
  }

  if (location) {
    filteredProfiles = filteredProfiles.filter((profile) =>
      profile.location.toLowerCase().includes(location.toLowerCase()),
    )
  }

  return NextResponse.json(filteredProfiles)
}
