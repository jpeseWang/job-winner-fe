"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function RegisterCompanyPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        description: "",
        industry: "",
        size: "1-10",
        headquarters: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch("/api/register-company", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })

        if (res.ok) {
            toast.success("Company registration submitted. Please wait for approval.")
            router.push("/")
        } else {
            const data = await res.json()
            toast.error(data.message || "Company registration failed.")
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-bold">Register a New Company</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Company Name</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Description</Label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <Label>Industry</Label>
                    <Input name="industry" value={form.industry} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Company Size</Label>
                    <select name="size" value={form.size} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="1-10">1–10 employees</option>
                        <option value="11-50">11–50 employees</option>
                        <option value="51-200">51–200 employees</option>
                    </select>
                </div>
                <div>
                    <Label>Headquarters</Label>
                    <Input name="headquarters" value={form.headquarters} onChange={handleChange} required />
                </div>
                <Button type="submit" className="w-full">Submit Registration</Button>
            </form>
        </div>
    )
}
