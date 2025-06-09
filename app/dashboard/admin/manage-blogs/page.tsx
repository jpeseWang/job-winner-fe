"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Plus, Heart, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { placeholderBlogs } from "@/utils/placeholders"

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState(placeholderBlogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBlog, setSelectedBlog] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleViewBlog = (blog: any) => {
    setSelectedBlog(blog)
    setIsViewDialogOpen(true)
  }

  const handleDeleteBlog = (blog: any) => {
    setSelectedBlog(blog)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setBlogs(blogs.filter((blog) => blog.id !== selectedBlog.id))
    setIsDeleteDialogOpen(false)
    setSelectedBlog(null)
  }

  const updateBlogStatus = (blogId: string, newStatus: string) => {
    setBlogs(blogs.map((blog) => (blog.id === blogId ? { ...blog, status: newStatus } : blog)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Published
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Draft
          </Badge>
        )
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "career-advice":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Career Advice
          </Badge>
        )
      case "interview-tips":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Interview Tips
          </Badge>
        )
      case "industry-news":
        return <Badge variant="outline">Industry News</Badge>
      case "resume-tips":
        return <Badge variant="secondary">Resume Tips</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Blogs</h1>
          <p className="text-gray-600">Manage blog posts and articles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Articles</CardTitle>
          <CardDescription>
            Total articles: {blogs.length} | Published: {blogs.filter((b) => b.status === "published").length} | Drafts:{" "}
            {blogs.filter((b) => b.status === "draft").length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="career-advice">Career Advice</SelectItem>
                <SelectItem value="interview-tips">Interview Tips</SelectItem>
                <SelectItem value="industry-news">Industry News</SelectItem>
                <SelectItem value="resume-tips">Resume Tips</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{blog.title}</div>
                      <div className="text-sm text-gray-500">by {blog.author}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(blog.category)}</TableCell>
                  <TableCell>{getStatusBadge(blog.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {blog.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-gray-400" />
                      {blog.likes}
                    </div>
                  </TableCell>
                  <TableCell>{blog.publishedAt || "Not published"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewBlog(blog)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Article
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Article
                        </DropdownMenuItem>
                        {blog.status === "draft" && (
                          <DropdownMenuItem onClick={() => updateBlogStatus(blog.id, "published")}>
                            Publish Article
                          </DropdownMenuItem>
                        )}
                        {blog.status === "published" && (
                          <DropdownMenuItem onClick={() => updateBlogStatus(blog.id, "archived")}>
                            Archive Article
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteBlog(blog)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Article
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">No articles found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* View Blog Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Article Details</DialogTitle>
            <DialogDescription>Review article information and statistics.</DialogDescription>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Title</h4>
                <p>{selectedBlog.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Author</h4>
                  <p>{selectedBlog.author}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Category</h4>
                  {getCategoryBadge(selectedBlog.category)}
                </div>
                <div>
                  <h4 className="font-semibold">Status</h4>
                  {getStatusBadge(selectedBlog.status)}
                </div>
                <div>
                  <h4 className="font-semibold">Published</h4>
                  <p>{selectedBlog.publishedAt || "Not published"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Views</h4>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    {selectedBlog.views.toLocaleString()}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Likes</h4>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-gray-400" />
                    {selectedBlog.likes}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>Edit Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Blog Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
