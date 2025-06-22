"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getUserCVs, deleteCV, shareCV } from "@/services/cvService"
import { formatDate } from "@/utils"
import { Plus, Search, Download, Share, Trash2, Edit, Eye } from "lucide-react"

export default function CVLibraryPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cvs, setCVs] = useState<any[]>([])

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        setIsLoading(true)
        // In a real app, you would get the user ID from the session
        const userId = "user-1" // Mock user ID
        const userCVs = await getUserCVs(userId)
        setCVs(userCVs)
      } catch (error) {
        console.error("Error fetching CVs:", error)
        toast({
          title: "Error",
          description: "Failed to load your CVs. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCVs()
  }, [toast])

  const handleDelete = async (cvId: string) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      try {
        await deleteCV(cvId)
        setCVs((prevCVs) => prevCVs.filter((cv) => cv.id !== cvId))
        toast({
          title: "CV Deleted",
          description: "Your CV has been deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete CV. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleShare = async (cvId: string) => {
    try {
      const { shareUrl } = await shareCV(cvId)

      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl)

      toast({
        title: "CV Shared",
        description: "Share link copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share CV. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredCVs = cvs.filter(
    (cv) =>
      cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Mock data for demonstration
  const mockCVs = [
    {
      id: "cv-1",
      title: "Software Engineer CV",
      description: "CV for software engineering positions",
      createdAt: "2023-05-10T10:30:00Z",
      updatedAt: "2023-05-15T14:20:00Z",
      template: "modern",
    },
    {
      id: "cv-2",
      title: "Product Manager Resume",
      description: "Resume tailored for product management roles",
      createdAt: "2023-04-20T09:15:00Z",
      updatedAt: "2023-04-25T11:45:00Z",
      template: "classic",
    },
    {
      id: "cv-3",
      title: "UX Designer Portfolio",
      description: "Creative CV for UX/UI design positions",
      createdAt: "2023-03-15T16:30:00Z",
      updatedAt: "2023-03-20T10:10:00Z",
      template: "creative",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My CV Library</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/dashboard/job-seeker/generate-cv">
            <Plus className="h-4 w-4" /> Create New CV
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your CVs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <div className="h-9 bg-gray-200 rounded w-9"></div>
                <div className="h-9 bg-gray-200 rounded w-9"></div>
                <div className="h-9 bg-gray-200 rounded w-9"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCVs.length === 0 && mockCVs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No CVs found</h3>
          <p className="text-gray-500 mb-6">You haven't created any CVs yet or none match your search.</p>
          <Button asChild>
            <Link href="/dashboard/job-seeker/generate-cv">Create Your First CV</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Use mockCVs for demonstration */}
          {(filteredCVs.length > 0 ? filteredCVs : mockCVs).map((cv) => (
            <Card key={cv.id}>
              <CardHeader>
                <CardTitle>{cv.title}</CardTitle>
                <CardDescription>{cv.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Created: {formatDate(cv.createdAt)}</span>
                  <span>Template: {cv.template}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => handleShare(cv.id)} title="Share CV">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Download CV">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" asChild title="Edit CV">
                  <Link href={`/dashboard/job-seeker/generate-cv?id=${cv.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(cv.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete CV"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
