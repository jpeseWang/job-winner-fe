"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Search, MoreVertical, Eye, Edit, Trash2, Plus, Upload, FileCode, Download, Copy } from "lucide-react"
import Image from "next/image"
import type { CVTemplate } from "@/types/interfaces"
// import { placeholders } from "@/utils/placeholders" 
// Importing placeholders

export default function AdminTemplatesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null)

  // Mock templates data
  const templates: CVTemplate[] = [
    {
      id: "modern-1",
      name: "Modern Professional",
      category: "professional",
      thumbnail: "/placeholder.svg?height=200&width=150",
      htmlTemplate: "<div>Template HTML content</div>",
      isPremium: false,
    },
    {
      id: "classic-1",
      name: "Classic Elegant",
      category: "traditional",
      thumbnail: "/placeholder.svg?height=200&width=150",
      htmlTemplate: "<div>Template HTML content</div>",
      isPremium: false,
    },
    {
      id: "creative-1",
      name: "Creative Design",
      category: "creative",
      thumbnail: "/placeholder.svg?height=200&width=150",
      htmlTemplate: "<div>Template HTML content</div>",
      isPremium: true,
    },
    {
      id: "minimal-1",
      name: "Minimal Clean",
      category: "minimal",
      thumbnail: "/placeholder.svg?height=200&width=150",
      htmlTemplate: "<div>Template HTML content</div>",
      isPremium: false,
    },
    {
      id: "tech-1",
      name: "Tech Professional",
      category: "professional",
      thumbnail: "/placeholder.svg?height=200&width=150",
      htmlTemplate: "<div>Template HTML content</div>",
      isPremium: true,
    },
    {
      id: "executive-1",
      name: "Executive Resume",
      category: "professional",
      thumbnail: "/placeholder.svg?height=200&width=150",
      htmlTemplate: "<div>Template HTML content</div>",
      isPremium: true,
    },
  ]

  // Filter templates based on search term and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const categories = ["professional", "traditional", "creative", "minimal"]

  const handleEditTemplate = (template: CVTemplate) => {
    setSelectedTemplate(template)
    setIsEditDialogOpen(true)
  }

  const handlePreviewTemplate = (template: CVTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewDialogOpen(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    // In a real app, this would call an API to delete the template
    console.log(`Delete template with ID: ${templateId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New CV Template</DialogTitle>
              <DialogDescription>
                Create a new CV template by providing HTML and CSS. Use placeholders for dynamic content.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="editor">Template Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-html">HTML Template</Label>
                  <Textarea
                    id="template-html"
                    placeholder="Enter HTML template with {placeholders}"
                    className="font-mono h-[400px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-css">CSS Styles</Label>
                  <Textarea id="template-css" placeholder="Enter CSS styles" className="font-mono h-[200px]" />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-[650px] border rounded-md p-4 overflow-auto">
                <div className="bg-white p-6 shadow-md">
                  <p className="text-center text-gray-500">Preview will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="e.g., Modern Professional" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-category">Category</Label>
                    <Select>
                      <SelectTrigger id="template-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea id="template-description" placeholder="Brief description of the template" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="premium-template" />
                  <Label htmlFor="premium-template">Premium Template</Label>
                </div>

                <div className="space-y-2">
                  <Label>Template Thumbnail</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drag and drop an image, or click to browse</p>
                    <Input type="file" className="hidden" id="thumbnail-upload" accept="image/*" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => document.getElementById("thumbnail-upload")?.click()}
                    >
                      Upload Thumbnail
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload CV Template</DialogTitle>
              <DialogDescription>
                Upload an HTML template file with CSS. Make sure to use placeholders for dynamic content.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <FileCode className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Drag and drop template files, or click to browse</p>
                <Input type="file" className="hidden" id="template-file-upload" accept=".html,.css,.zip" />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => document.getElementById("template-file-upload")?.click()}
                >
                  Upload Files
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload-template-name">Template Name</Label>
                <Input id="upload-template-name" placeholder="e.g., Modern Professional" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload-template-category">Category</Label>
                <Select>
                  <SelectTrigger id="upload-template-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="upload-premium-template" />
                <Label htmlFor="upload-premium-template">Premium Template</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Upload Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <Image src={template.thumbnail || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
              {template.isPremium && <Badge className="absolute top-2 right-2 bg-amber-500">Premium</Badge>}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>
                Category: {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Template
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Template
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name} Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-white p-6 border rounded-md">
            <div className="aspect-[8.5/11] bg-white shadow-lg p-8 mx-auto max-w-[600px]">
              {/* This would render the actual template with sample data */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">John Doe</h1>
                <p className="text-gray-600">Software Engineer</p>
                <div className="flex justify-center gap-2 mt-2 text-sm text-gray-500">
                  <span>john.doe@example.com</span>
                  <span>•</span>
                  <span>(123) 456-7890</span>
                  <span>•</span>
                  <span>New York, NY</span>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Summary</h2>
                <p className="text-sm">
                  Experienced software engineer with 5+ years of experience in full-stack development. Specialized in
                  React, Node.js, and cloud technologies.
                </p>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h2>
                <div className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Senior Software Engineer</h3>
                    <span className="text-sm text-gray-500">2020 - Present</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Tech Company Inc.</p>
                  <ul className="text-sm list-disc list-inside mt-1">
                    <li>Led development of microservices architecture</li>
                    <li>Improved application performance by 40%</li>
                    <li>Mentored junior developers</li>
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Education</h2>
                <div>
                  <div className="flex justify-between">
                    <h3 className="font-medium">BS in Computer Science</h3>
                    <span className="text-sm text-gray-500">2012 - 2016</span>
                  </div>
                  <p className="text-sm text-gray-600">University of Technology</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded">JavaScript</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">React</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Node.js</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">TypeScript</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">AWS</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Docker</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsPreviewDialogOpen(false)
                handleEditTemplate(selectedTemplate!)
              }}
            >
              Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar to Create but pre-filled */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit CV Template</DialogTitle>
            <DialogDescription>Edit the HTML, CSS, and settings for this template.</DialogDescription>
          </DialogHeader>

          {/* Similar content to Create Dialog but pre-filled with selectedTemplate data */}
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="editor">Template Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-html">HTML Template</Label>
                <Textarea
                  id="edit-template-html"
                  placeholder="Enter HTML template with {placeholders}"
                  className="font-mono h-[400px]"
                  defaultValue={selectedTemplate?.htmlTemplate || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-css">CSS Styles</Label>
                <Textarea id="edit-template-css" placeholder="Enter CSS styles" className="font-mono h-[200px]" />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="h-[650px] border rounded-md p-4 overflow-auto">
              <div className="bg-white p-6 shadow-md">
                {/* Similar preview content as in the Preview Dialog */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">John Doe</h1>
                  <p className="text-gray-600">Software Engineer</p>
                </div>
                <p className="text-center text-gray-500">Preview with sample data</p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-template-name">Template Name</Label>
                  <Input id="edit-template-name" defaultValue={selectedTemplate?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-template-category">Category</Label>
                  <Select defaultValue={selectedTemplate?.category}>
                    <SelectTrigger id="edit-template-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="edit-premium-template" defaultChecked={selectedTemplate?.isPremium} />
                <Label htmlFor="edit-premium-template">Premium Template</Label>
              </div>

              <div className="space-y-2">
                <Label>Template Thumbnail</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  {selectedTemplate?.thumbnail ? (
                    <div className="relative w-full h-32 mb-2">
                      <Image
                        src={selectedTemplate.thumbnail || "/placeholder.svg"}
                        alt={selectedTemplate.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  )}
                  <p className="text-sm text-gray-500">Drag and drop an image, or click to browse</p>
                  <Input type="file" className="hidden" id="edit-thumbnail-upload" accept="image/*" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => document.getElementById("edit-thumbnail-upload")?.click()}
                  >
                    {selectedTemplate?.thumbnail ? "Change Thumbnail" : "Upload Thumbnail"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
