"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Building2, Globe, MapPin, Users, Calendar, Tag } from "lucide-react"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import toast from "react-hot-toast"

const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"]

const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Transportation",
    "Energy",
    "Media & Entertainment",
    "Real Estate",
    "Consulting",
    "Non-profit",
    "Government",
    "Other",
]

export default function RegisterCompanyPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        logo: "",
        website: "",
        description: "",
        industry: "",
        size: "",
        founded: "",
        headquarters: "",
        specialties: [] as string[],
        socialLinks: {
            linkedin: "",
            twitter: "",
            facebook: "",
            instagram: "",
        },
    })

    const [newSpecialty, setNewSpecialty] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name.startsWith("socialLinks.")) {
            const socialField = name.split(".")[1]
            setForm((prev) => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialField]: value,
                },
            }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSelectChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const addSpecialty = () => {
        if (newSpecialty.trim() && !form.specialties.includes(newSpecialty.trim())) {
            setForm((prev) => ({
                ...prev,
                specialties: [...prev.specialties, newSpecialty.trim()],
            }))
            setNewSpecialty("")
        }
    }

    const removeSpecialty = (specialty: string) => {
        setForm((prev) => ({
            ...prev,
            specialties: prev.specialties.filter((s) => s !== specialty),
        }))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addSpecialty()
        }
    }

    const validateForm = () => {
        const required = ["name", "description", "industry", "size", "headquarters"]
        const missing = required.filter((field) => !form[field as keyof typeof form])

        if (missing.length > 0) {
            toast.error(`Please fill in required fields: ${missing.join(", ")}`)
            return false
        }

        if (form.website && !form.website.startsWith("http")) {
            setForm((prev) => ({ ...prev, website: `https://${prev.website}` }))
        }

        if (
            form.founded &&
            (Number.parseInt(form.founded) < 1800 || Number.parseInt(form.founded) > new Date().getFullYear())
        ) {
            toast.error("Please enter a valid founding year")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const submitData = {
                ...form,
                founded: form.founded ? Number.parseInt(form.founded) : undefined,
                socialLinks: Object.fromEntries(Object.entries(form.socialLinks).filter(([_, value]) => value.trim() !== "")),
            }

            const res = await fetch("api/company/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Company registration submitted successfully! Please wait for approval.")
                router.push("/dashboard/recruiter")
            } else {
                toast.error(data.message || "Company registration failed.")
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900">Register Your Company</h1>
                    <p className="text-gray-600 mt-2">Join our platform and start hiring top talent</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>Essential details about your company</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Company Logo */}
                            <div>
                                <Label className="text-sm font-medium">Company Logo</Label>
                                <div className="mt-2">
                                    <AvatarUpload
                                        value={form.logo}
                                        onChange={(url) => setForm((prev) => ({ ...prev, logo: url ?? "" }))}
                                        size={100}
                                        name={form.name || "Company"}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Company Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter company name"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="website" className="text-sm font-medium flex items-center gap-1">
                                        <Globe className="h-4 w-4" />
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        type="url"
                                        value={form.website}
                                        onChange={handleChange}
                                        placeholder="https://www.company.com"
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Company Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe your company, mission, and what makes you unique..."
                                    rows={4}
                                    required
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Company Details
                            </CardTitle>
                            <CardDescription>Information about your company size and industry</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-sm font-medium">Industry *</Label>
                                    <Select value={form.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries.map((industry) => (
                                                <SelectItem key={industry} value={industry}>
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Company Size *</Label>
                                    <Select value={form.size} onValueChange={(value) => handleSelectChange("size", value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companySizes.map((size) => (
                                                <SelectItem key={size} value={size}>
                                                    {size} employees
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="founded" className="text-sm font-medium flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Founded Year
                                    </Label>
                                    <Input
                                        id="founded"
                                        name="founded"
                                        type="number"
                                        value={form.founded}
                                        onChange={handleChange}
                                        placeholder="2020"
                                        min="1800"
                                        max={new Date().getFullYear()}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="headquarters" className="text-sm font-medium flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    Headquarters *
                                </Label>
                                <Input
                                    id="headquarters"
                                    name="headquarters"
                                    value={form.headquarters}
                                    onChange={handleChange}
                                    placeholder="City, Country"
                                    required
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specialties */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Specialties & Expertise
                            </CardTitle>
                            <CardDescription>Add tags that describe your company's areas of expertise</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newSpecialty}
                                    onChange={(e) => setNewSpecialty(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a specialty (e.g., Web Development, AI, Marketing)"
                                    className="flex-1"
                                />
                                <Button type="button" onClick={addSpecialty} variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {form.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {form.specialties.map((specialty) => (
                                        <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                                            {specialty}
                                            <button
                                                type="button"
                                                onClick={() => removeSpecialty(specialty)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media Links</CardTitle>
                            <CardDescription>Connect your social media profiles (optional)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="linkedin" className="text-sm font-medium">
                                        LinkedIn
                                    </Label>
                                    <Input
                                        id="linkedin"
                                        name="socialLinks.linkedin"
                                        value={form.socialLinks.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/company/yourcompany"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="twitter" className="text-sm font-medium">
                                        Twitter
                                    </Label>
                                    <Input
                                        id="twitter"
                                        name="socialLinks.twitter"
                                        value={form.socialLinks.twitter}
                                        onChange={handleChange}
                                        placeholder="https://twitter.com/yourcompany"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="facebook" className="text-sm font-medium">
                                        Facebook
                                    </Label>
                                    <Input
                                        id="facebook"
                                        name="socialLinks.facebook"
                                        value={form.socialLinks.facebook}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com/yourcompany"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="instagram" className="text-sm font-medium">
                                        Instagram
                                    </Label>
                                    <Input
                                        id="instagram"
                                        name="socialLinks.instagram"
                                        value={form.socialLinks.instagram}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/yourcompany"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <Button type="submit" size="lg" disabled={isLoading} className="w-full md:w-auto px-8">
                            {isLoading ? "Submitting..." : "Submit Company Registration"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
