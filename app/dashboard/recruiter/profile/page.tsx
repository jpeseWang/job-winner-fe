"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Camera, Plus, Trash2 } from "lucide-react"

// State for fields other than firstName and lastName
interface RecruiterProfileBaseState {
  position: string
  bio: string
  location: string
  phone: string
  personalWebsite: string
  yearsOfExperience: number | ""
  specializations: string[]
  socialLinks: {
    linkedin: string
    twitter: string
    facebook: string
    instagram: string
  }
  profilePicture: string
  isPublic: boolean
  companyName: string
  companyRole: string
}

const RecruiterProfilePage = () => {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Isolate firstName and lastName into their own state to prevent update issues
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  
  const [profile, setProfile] = useState<RecruiterProfileBaseState>({
    position: "",
    bio: "",
    location: "",
    phone: "",
    personalWebsite: "",
    yearsOfExperience: "",
    specializations: [],
    socialLinks: { linkedin: "", twitter: "", facebook: "", instagram: "" },
    profilePicture: "",
    isPublic: true,
    companyName: "",
    companyRole: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return
      
      try {
        const response = await fetch("/api/profiles/recruiter")
        if (response.ok) {
          const data = await response.json()
          // Set the isolated and the main state
          setFirstName(data.firstName ?? "")
          setLastName(data.lastName ?? "")
          setProfile({
            position: data.position ?? "",
            bio: data.bio ?? "",
            location: data.location ?? "",
            phone: data.phone ?? "",
            personalWebsite: data.personalWebsite ?? "",
            yearsOfExperience: data.yearsOfExperience ?? "",
            specializations: data.specializations ?? [],
            socialLinks: {
              linkedin: data.socialLinks?.linkedin ?? "",
              twitter: data.socialLinks?.twitter ?? "",
              facebook: data.socialLinks?.facebook ?? "",
              instagram: data.socialLinks?.instagram ?? "",
            },
            profilePicture: data.profilePicture ?? "",
            isPublic: data.isPublic ?? true,
            companyName: data.companyName ?? "",
            companyRole: data.companyRole ?? "",
          })
        }
      } catch (error) {
        toast({ title: "Error", description: "Could not load profile data.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [session, toast])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const isNumberInput = type === 'number'
    
    setProfile(prev => ({
      ...prev,
      [name]: isNumberInput ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleSocialLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }))
  }

  const handleSpecializationChange = (index: number, value: string) => {
    const updatedSpecializations = [...profile.specializations]
    updatedSpecializations[index] = value
    setProfile(prev => ({ ...prev, specializations: updatedSpecializations }))
  }

  const addSpecialization = () => {
    setProfile(prev => ({ ...prev, specializations: [...prev.specializations, ""] }))
  }

  const removeSpecialization = (index: number) => {
    setProfile(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }))
  }
  
  // Helper to combine all state parts for saving
  const getFullProfile = (updatedProfilePicture?: string) => {
    return {
      firstName,
      lastName,
      ...profile,
      profilePicture: updatedProfilePicture ?? profile.profilePicture,
    }
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload/profile-picture", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const result = await response.json()
      const newProfilePicture = result.imageUrl

      // Update local state and trigger a save to persist the new picture URL
      const fullProfileToSave = getFullProfile(newProfilePicture)
      await saveProfile(fullProfileToSave)
      
      // Update session for header avatar and local state
      await update({ profilePicture: newProfilePicture }) 
      setProfile(prev => ({...prev, profilePicture: newProfilePicture}))
      toast({ title: "Success", description: "Profile picture updated!" })

    } catch (error) {
      toast({ title: "Upload Error", description: "Failed to upload image.", variant: "destructive" })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const saveProfile = async (dataToSave: any) => {
    const response = await fetch("/api/profiles/recruiter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to save profile.")
    }
    
    return response.json()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const fullProfileToSave = getFullProfile()
      const savedData = await saveProfile(fullProfileToSave)
      
      // Resync state with sanitized data from server
      setFirstName(savedData.firstName)
      setLastName(savedData.lastName)
      setProfile(prev => ({ ...prev, ...savedData }))
      
      toast({ title: "Success", description: "Profile saved successfully!" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
      toast({ title: "Save Error", description: errorMessage, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Recruiter Profile</h1>
          <Button type="submit" disabled={isSaving || isUploading}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profilePicture || undefined} />
              <AvatarFallback>{firstName?.charAt(0)}{lastName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Camera className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Change Picture"}
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic information about you. Fields with * are required.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div>
                <Label htmlFor="position">Position / Role *</Label>
                <Input id="position" name="position" value={profile.position} onChange={handleInputChange} placeholder="e.g., Senior Technical Recruiter" required />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={profile.location} onChange={handleInputChange} placeholder="e.g., Ho Chi Minh City, Vietnam" />
              </div>
              <div>
                <Label htmlFor="bio">Biography</Label>
                <Textarea id="bio" name="bio" value={profile.bio} onChange={handleInputChange} placeholder="Tell us about your professional background..." rows={5} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Details</CardTitle>
              <CardDescription>Fill this out to help candidates connect with you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={profile.phone} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="personalWebsite">Personal or Company Website</Label>
                <Input id="personalWebsite" name="personalWebsite" value={profile.personalWebsite} onChange={handleInputChange} type="url" />
              </div>
              <div>
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input id="yearsOfExperience" name="yearsOfExperience" type="number" value={profile.yearsOfExperience} onChange={handleInputChange} min="0" />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input id="companyName" name="companyName" value={profile.companyName} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="companyRole">Role at Company (Optional)</Label>
                <Input id="companyRole" name="companyRole" value={profile.companyRole} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Specializations</CardTitle>
            <CardDescription>List your areas of expertise (e.g., "IT Staffing", "Executive Search").</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.specializations.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={spec} onChange={(e) => handleSpecializationChange(index, e.target.value)} placeholder={`Specialization #${index + 1}`} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecialization(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSpecialization}><Plus className="mr-2 h-4 w-4" />Add Specialization</Button>
          </CardContent>
        </Card>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" name="linkedin" value={profile.socialLinks.linkedin} onChange={handleSocialLinkChange} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" name="twitter" value={profile.socialLinks.twitter} onChange={handleSocialLinkChange} placeholder="https://twitter.com/..." />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" name="facebook" value={profile.socialLinks.facebook} onChange={handleSocialLinkChange} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" name="instagram" value={profile.socialLinks.instagram} onChange={handleSocialLinkChange} placeholder="https://instagram.com/..." />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPublic" className="font-medium">Public Profile</Label>
                <p className="text-sm text-muted-foreground">Allow job seekers and others to view your profile.</p>
              </div>
              <Switch id="isPublic" checked={profile.isPublic} onCheckedChange={(checked) => setProfile(p => ({...p, isPublic: checked}))} />
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}

export default RecruiterProfilePage 