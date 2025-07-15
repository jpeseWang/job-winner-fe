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
import { Search, MoreHorizontal, Eye, Edit, Trash2, Plus, Star } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { placeholderTemplates } from "@/utils/placeholders"

export default function ManageTemplatesPage() {
  const [templates, setTemplates] = useState(placeholderTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    const matchesType = typeFilter === "all" || template.type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template)
    setIsViewDialogOpen(true)
  }

  const handleDeleteTemplate = (template: any) => {
    setSelectedTemplate(template)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setTemplates(templates.filter((template) => template.id !== selectedTemplate.id))
    setIsDeleteDialogOpen(false)
    setSelectedTemplate(null)
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "premium":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Premium
          </Badge>
        )
      case "free":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Free
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "professional":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Professional
          </Badge>
        )
      case "creative":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Creative
          </Badge>
        )
      case "modern":
        return <Badge variant="outline">Modern</Badge>
      case "classic":
        return <Badge variant="secondary">Classic</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Templates</h1>
          <p className="text-gray-600">Manage CV templates and their availability</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CV Templates</CardTitle>
          <CardDescription>
            Total templates: {templates.length} | Premium: {templates.filter((t) => t.type === "premium").length} |
            Free: {templates.filter((t) => t.type === "free").length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates by name..."
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
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        className="w-12 h-16 object-cover rounded border"
                      />
                      <div>
                        <div className="font-medium">{template.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(template.category)}</TableCell>
                  <TableCell>{getTypeBadge(template.type)}</TableCell>
                  <TableCell>{template.price === 0 ? "Free" : `$${template.price}`}</TableCell>
                  <TableCell>{template.downloads.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{template.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewTemplate(template)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Template
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteTemplate(template)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">No templates found matching your criteria.</div>
          )}  
        </CardContent>
      </Card>

      {/* View Template Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Details</DialogTitle>
            <DialogDescription>Review template information and statistics.</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={selectedTemplate.thumbnail || "/placeholder.svg"}
                  alt={selectedTemplate.name}
                  className="w-32 h-40 object-cover rounded border"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold">Template Name</h4>
                    <p>{selectedTemplate.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Category</h4>
                    {getCategoryBadge(selectedTemplate.category)}
                  </div>
                  <div>
                    <h4 className="font-semibold">Type</h4>
                    {getTypeBadge(selectedTemplate.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold">Price</h4>
                    <p>{selectedTemplate.price === 0 ? "Free" : `$${selectedTemplate.price}`}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold">Downloads</h4>
                  <p>{selectedTemplate.downloads.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Rating</h4>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedTemplate.rating}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Created</h4>
                  <p>{selectedTemplate.createdAt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>Edit Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTemplate?.name}"? This action cannot be undone and will affect
              users who have purchased this template.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
