"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/hooks/use-toast"
import toast from "react-hot-toast"
import { userService } from "@/services"
import { validateProfile } from "@/utils/validators"
import { Plus, Trash2, Upload, Save, User, MapPin, Mail, Phone, Briefcase, GraduationCap, Award } from "lucide-react"
import { DEFAULT_AVATAR } from "@/constants"
import { useAuth } from "@/hooks/use-auth"
import { IUserProfile, IUser } from "@/types/interfaces/user"
import { AvatarUpload } from "@/components/ui/avatar-upload"

export default function MyProfilePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const [profile, setProfile] = useState<IUserProfile>({
    user: {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      photo: user?.photo || DEFAULT_AVATAR,
    },
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    title: "",
    location: "",
    profilePicture: user?.photo || DEFAULT_AVATAR,
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      portfolio: "",
    },
    skills: [],
    experience: [],
    education: [],
    isPublic: true,
    bio: "",
    contactEmail: user?.email || "",
    resumeUrl: "",

  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)

        const userId = user?.id
        if (!userId) {
          throw new Error("User ID is missing")
        }
        const userProfile = await userService.getUserProfile(userId)

        if (userProfile) {
          setProfile((prev) => ({
            ...prev,
            ...userProfile,
            name: userProfile.user?.name || prev.name,
            email: userProfile.user?.email || prev.email,
            contactEmail: userProfile.user?.email || prev.contactEmail,
          }))
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [toast, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }))
  }

  const handleSkillChange = (index: number, value: string) => {
    setProfile((prev) => {
      const newSkills = [...(prev.skills || [])]
      newSkills[index] = value
      return { ...prev, skills: newSkills }
    })
  }

  const addSkill = () => {
    setProfile((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), ""],
    }))
  }

  const removeSkill = (index: number) => {
    setProfile((prev) => {
      const newSkills = [...prev.skills]
      newSkills.splice(index, 1)
      return { ...prev, skills: newSkills }
    })
  }

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setProfile((prev) => {
      const newExperience = [...prev.experience]
      newExperience[index] = { ...newExperience[index], [field]: value }
      return { ...prev, experience: newExperience }
    })
  }

  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: new Date(),
          endDate: new Date(),
          description: "",
        },
      ],
    }))
  }

  const removeExperience = (index: number) => {
    setProfile((prev) => {
      const newExperience = [...prev.experience]
      newExperience.splice(index, 1)
      return { ...prev, experience: newExperience }
    })
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    setProfile((prev) => {
      const newEducation = [...prev.education]
      newEducation[index] = { ...newEducation[index], [field]: value }
      return { ...prev, education: newEducation }
    })
  }

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          location: "",
          startDate: new Date(),
          endDate: new Date(),
        },
      ],
    }))
  }

  const removeEducation = (index: number) => {
    setProfile((prev) => {
      const newEducation = [...prev.education]
      newEducation.splice(index, 1)
      return { ...prev, education: newEducation }
    })
  }

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const reader = new FileReader()
      reader.onload = () => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just set the file name
      setProfile((prev) => ({
        ...prev,
        resumeUrl: file.name,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate profile data
      const { data, errors } = validateProfile(profile)

      if (errors) {
        console.error("Validation errors:", errors)
        toast.error(errors[0]?.message || "Please check your information and try again.")
        setIsLoading(false)
        return
      }

      const userId = user?.id || ""
      await userService.updateUserProfile(userId, profile)
      toast.success("Profile updated successfully!")
      // toast({
      //   title: "Profile Updated",
      //   description: "Your profile has been updated successfully.",
      // })
    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
      // toast({
      //   title: "Update Failed",
      //   description: "There was an error updating your profile. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  console.log("Profile data > ", profile)
  return (
    <div className="container mx-auto py-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <AvatarUpload
                      value={profile.profilePicture}
                      onChange={(url) => setProfile((prev) => ({ ...prev, profilePicture: url || DEFAULT_AVATAR }))}
                      size={100}
                      name={profile.name}
                      disabled={isLoading}
                    />

                  </div>
                  <h2 className="text-xl font-semibold">{profile?.name || "Your Name"}</h2>
                  <p className="text-gray-500">{profile?.title || "Your Title"}</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{profile.location || "Your Location"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{profile?.email || "your.email@example.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{profile?.phone || "Your Phone Number"}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-medium">Resume</h3>
                  {profile.resumeUrl ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{profile.resumeUrl}</span>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="resume-upload" className="flex items-center gap-2 text-teal-500 cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span>Upload Resume</span>
                      <input
                        type="file"
                        id="resume-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information and career details</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="personal" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Experience
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Skills
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={profile.title}
                          onChange={handleChange}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          value={profile.contactEmail}
                          disabled={true}
                          type="email"
                          onChange={handleChange}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={profile.location}
                          onChange={handleChange}
                          placeholder="New York, USA"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Write a short bio about yourself..."
                        rows={5}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            name="linkedin"
                            value={profile.socialLinks?.linkedin}
                            onChange={handleSocialLinkChange}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            name="github"
                            value={profile.socialLinks?.github}
                            onChange={handleSocialLinkChange}
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input
                            id="twitter"
                            name="twitter"
                            value={profile.socialLinks?.twitter}
                            onChange={handleSocialLinkChange}
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="portfolio">Portfolio</Label>
                          <Input
                            id="portfolio"
                            name="portfolio"
                            value={profile.socialLinks?.portfolio}
                            onChange={handleSocialLinkChange}
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-6">
                    {profile.experience?.map((exp, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">Work Experience {index + 1}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`exp-title-${index}`}>Job Title</Label>
                              <Input
                                id={`exp-title-${index}`}
                                value={exp.title}
                                onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                                placeholder="Software Engineer"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`exp-company-${index}`}>Company</Label>
                              <Input
                                id={`exp-company-${index}`}
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                                placeholder="Acme Inc."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`exp-location-${index}`}>Location</Label>
                              <Input
                                id={`exp-location-${index}`}
                                value={exp.location}
                                onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                                placeholder="New York, USA"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                                <Input
                                  id={`exp-start-${index}`}
                                  type="month"
                                  value={exp.startDate instanceof Date ? exp.startDate.toISOString().slice(0, 7) : exp.startDate}
                                  onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                                <Input
                                  id={`exp-end-${index}`}
                                  type="month"
                                  value={exp.endDate instanceof Date ? exp.endDate.toISOString().slice(0, 7) : exp.endDate}
                                  onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                                  placeholder="Present"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`exp-description-${index}`}>Description</Label>
                            <Textarea
                              id={`exp-description-${index}`}
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                              placeholder="Describe your responsibilities and achievements..."
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addExperience}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" /> Add Work Experience
                    </Button>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-6">
                    {profile.education.map((edu, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">Education {index + 1}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                              <Input
                                id={`edu-degree-${index}`}
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                                placeholder="Bachelor of Science in Computer Science"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                              <Input
                                id={`edu-institution-${index}`}
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                placeholder="University of Technology"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edu-location-${index}`}>Location</Label>
                              <Input
                                id={`edu-location-${index}`}
                                value={edu.location}
                                onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                                placeholder="Boston, MA"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                                <Input
                                  id={`edu-start-${index}`}
                                  type="month"
                                  value={edu.startDate instanceof Date ? edu.startDate.toISOString().slice(0, 7) : edu.startDate}
                                  onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                                <Input
                                  id={`edu-end-${index}`}
                                  type="month"
                                  value={edu.endDate instanceof Date ? edu.endDate.toISOString().slice(0, 7) : edu.endDate}
                                  onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addEducation}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" /> Add Education
                    </Button>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Skills</h3>
                      <p className="text-sm text-gray-500">
                        Add skills that showcase your expertise. These will be visible to recruiters.
                      </p>

                      {profile.skills?.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={skill}
                            onChange={(e) => handleSkillChange(index, e.target.value)}
                            placeholder="e.g. JavaScript, Project Management, etc."
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Button variant="outline" onClick={addSkill} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Skill
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  // onClick={()=>{console.log("Save Profile")}}
                  type="submit"
                  disabled={isLoading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
