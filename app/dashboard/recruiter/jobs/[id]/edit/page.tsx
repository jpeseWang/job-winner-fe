"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { jobService } from "@/services/jobService"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Job } from "@/types/interfaces/job"

export default function EditJobPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Job>>({})

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(params.id as string)
        setJob(data)
        setForm(data)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load job",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [params.id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (name: keyof Job, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value.split("\n").map((v) => v.trim()).filter(Boolean) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await jobService.updateJob(params.id as string, form)
      toast({ title: "Success", description: "Job updated successfully!" })
      router.push(`/dashboard/recruiter/jobs/${params.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!job) return <div className="flex items-center justify-center min-h-screen">Job not found</div>

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <Input name="title" value={form.title || ""} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Company</label>
          <Input name="company" value={form.company || ""} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Location</label>
          <Input name="location" value={form.location || ""} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Type</label>
          <Input name="type" value={form.type || ""} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Category</label>
          <Input name="category" value={form.category || ""} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Experience Level</label>
          <Input name="experienceLevel" value={form.experienceLevel || ""} onChange={handleChange} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <Textarea name="description" value={form.description || ""} onChange={handleChange} required rows={5} />
        </div>
        <div>
          <label className="block font-medium mb-1">Requirements (one per line)</label>
          <Textarea name="requirements" value={(form.requirements || []).join("\n")} onChange={e => handleArrayChange("requirements", e.target.value)} rows={4} />
        </div>
        <div>
          <label className="block font-medium mb-1">Responsibilities (one per line)</label>
          <Textarea name="responsibilities" value={(form.responsibilities || []).join("\n")} onChange={e => handleArrayChange("responsibilities", e.target.value)} rows={4} />
        </div>
        <div>
          <label className="block font-medium mb-1">Benefits (one per line)</label>
          <Textarea name="benefits" value={(form.benefits || []).join("\n")} onChange={e => handleArrayChange("benefits", e.target.value)} rows={4} />
        </div>
        <div>
          <label className="block font-medium mb-1">Skills (one per line)</label>
          <Textarea name="skills" value={(form.skills || []).join("\n")} onChange={e => handleArrayChange("skills", e.target.value)} rows={3} />
        </div>
        <div>
          <label className="block font-medium mb-1">Contact Email</label>
          <Input name="contactEmail" value={form.contactEmail || ""} onChange={handleChange} required />
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/recruiter/jobs/${params.id}`)}>Cancel</Button>
        </div>
      </form>
    </main>
  )
} 