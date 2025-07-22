"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { getUserCVs, deleteCV, shareCV } from "@/services/cvService"
import { formatDate } from "@/utils"
import { Plus, Search, Download, Share, Trash2, Edit, Eye, FileText } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
interface CVData {
  _id: string
  title: string
  template: {
    _id: string
    name: string
    category: string
    thumbnail?: string
  }
  content: any
  isPublic: boolean
  views: number
  downloads: number
  createdAt: string
  updatedAt: string
  lastGeneratedAt: string
}

export default function CVLibraryPage() {
  const { toast } = useToast();
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cvs, setCVs] = useState<CVData[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchCVs()
  }, [pagination.page, searchTerm])

  const fetchCVs = async () => {
    try {
      setIsLoading(true)
      // In a real app, you would get the user ID from the session
      const userId = user?.id ?? ""
      const response = await getUserCVs(userId, {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      })

      setCVs(response.data)
      setPagination(response.pagination)
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

  const handleDelete = async (cvId: string) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      try {
        await deleteCV(cvId)
        setCVs((prevCVs) => prevCVs.filter((cv) => cv._id !== cvId))
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

  const handleDownload = async (cvId: string, title: string) => {
    try {
      const response = await fetch(`/api/cv/${cvId}/download`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Download failed")

      const data = await response.json()

      // Create and download file
      const blob = new Blob([data.data.htmlContent], { type: "text/html" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = data.data.fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "CV Downloaded",
        description: "Your CV has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download CV. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredCVs = cvs.filter(
    (cv) =>
      cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.template.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My CV Library</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and organize your generated CVs</p>
        </div>
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total CVs</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold">{cvs.reduce((sum, cv) => sum + cv.views, 0)}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
                <p className="text-2xl font-bold">{cvs.reduce((sum, cv) => sum + cv.downloads, 0)}</p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Public CVs</p>
                <p className="text-2xl font-bold">{cvs.filter((cv) => cv.isPublic).length}</p>
              </div>
              <Share className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
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
      ) : filteredCVs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No CVs found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? "No CVs match your search criteria." : "You haven't created any CVs yet."}
          </p>
          <Button asChild>
            <Link href="/dashboard/job-seeker/generate-cv">Create Your First CV</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCVs.map((cv) => (
              <Card key={cv._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{cv.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{cv.template.category}</Badge>
                        {cv.isPublic && <Badge variant="secondary">Public</Badge>}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 h-32 rounded-md flex items-center justify-center mb-4">
                    {cv.template.thumbnail ? (
                      <img
                        src={cv.template.thumbnail || "/placeholder.svg"}
                        alt={cv.template.name}
                        className="h-full w-auto object-cover rounded"
                      />
                    ) : (
                      <Eye className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Template:</span>
                      <span className="font-medium">{cv.template.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Views:</span>
                      <span className="font-medium">{cv.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Downloads:</span>
                      <span className="font-medium">{cv.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span className="font-medium">{formatDate(cv.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleShare(cv._id)} title="Share CV">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(cv._id, cv.title)}
                      title="Download CV"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild title="Edit CV">
                      <Link href={`/dashboard/job-seeker/generate-cv?id=${cv._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cv._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete CV"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
