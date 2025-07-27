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
import { Search, MoreVertical, Eye, Edit, Trash2, Plus, Download, Copy, Power, PowerOff, BarChart3 } from "lucide-react"
import Image from "next/image"
import { useTemplates, useTemplateAnalytics } from "@/hooks/useTemplates"
import { ImageUpload } from "@/components/ui/image-upload"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import type { ICVTemplate } from "@/types/interfaces"
import { ETemplateCategory } from "@/types/enums"

export default function AdminTemplatesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ICVTemplate | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    previewImage: "",
    htmlTemplate: "",
    cssStyles: "",
    category: "",
    tags: [] as string[],
    isPremium: false,
    price: 0,
  })

  const {
    templates,
    pagination,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateStatus,
    duplicateTemplate,
    updateFilters,
  } = useTemplates({
    search: searchTerm,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    isPremium: typeFilter === "all" ? undefined : typeFilter === "premium",
  })

  const { analytics } = useTemplateAnalytics()

  const categories = Object.values(ETemplateCategory)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateFilters({ search: value, page: 1 })
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    updateFilters({
      category: value === "all" ? undefined : value,
      page: 1,
    })
  }

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value)
    updateFilters({
      isPremium: value === "all" ? undefined : value === "premium",
      page: 1,
    })
  }

  const handleCreateTemplate = async () => {
    try {
      await createTemplate(formData)
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating template:", error)
    }
  }

  const handleEditTemplate = (template: ICVTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      description: template.description,
      previewImage: template.previewImage,
      htmlTemplate: template.htmlTemplate,
      cssStyles: template.cssStyles,
      category: template.category,
      tags: template.tags || [],
      isPremium: template.isPremium,
      price: template.price || 0,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return

    try {
      await updateTemplate(selectedTemplate.id, formData)
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error updating template:", error)
    }
  }

  const handlePreviewTemplate = (template: ICVTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewDialogOpen(true)
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate(templateId)
    }
  }

  const handleToggleStatus = async (templateId: string) => {
    await toggleTemplateStatus(templateId)
  }

  const handleDuplicate = async (templateId: string) => {
    await duplicateTemplate(templateId)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      previewImage: "",
      htmlTemplate: "",
      cssStyles: "",
      category: "",
      tags: [],
      isPremium: false,
      price: 0,
    })
    setSelectedTemplate(null)
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
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
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

        <Select value={typeFilter} onValueChange={handleTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="free">Free</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setIsAnalyticsDialogOpen(true)} variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New CV Template</DialogTitle>
              <DialogDescription>Create a new CV template with HTML, CSS, and configuration.</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="e.g., Modern Professional"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
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
                  <Textarea
                    id="template-description"
                    placeholder="Brief description of the template"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preview Image</Label>
                  <ImageUpload
                    value={formData.previewImage ? {
                      id: "1",
                      url: formData.previewImage,
                      publicId: "previewImage",
                      name: "previewImage.png",
                      size: 0
                    } : undefined}
                    onChange={(url) =>
                      setFormData({
                        ...formData,
                        previewImage:
                          typeof url === "string"
                            ? url
                            : url && typeof url === "object" && "url" in url
                              ? url.url
                              : "",
                      })
                    }
                    multiple={false}
                    maxFiles={1}
                    folder="template-previews"
                    placeholder="Upload preview image"
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-html">HTML Template</Label>
                  <Textarea
                    id="template-html"
                    placeholder="Enter HTML template with placeholders"
                    className="font-mono h-[300px]"
                    value={formData.htmlTemplate}
                    onChange={(e) => setFormData({ ...formData, htmlTemplate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-css">CSS Styles</Label>
                  <Textarea
                    id="template-css"
                    placeholder="Enter CSS styles"
                    className="font-mono h-[200px]"
                    value={formData.cssStyles}
                    onChange={(e) => setFormData({ ...formData, cssStyles: e.target.value })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-[500px] border rounded-md p-4 overflow-auto">
                <div className="bg-white p-6 shadow-md">


                  <div className="bg-white p-6 shadow-md">
                    {formData.htmlTemplate ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<style>${formData.cssStyles}</style>${formData.htmlTemplate}`,
                        }}
                      />
                    ) : (
                      <p className="text-center text-gray-500">Preview will appear here</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="premium-template"
                    checked={formData.isPremium}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                  />
                  <Label htmlFor="premium-template">Premium Template</Label>
                </div>

                {formData.isPremium && (
                  <div className="space-y-2">
                    <Label htmlFor="template-price">Price ($)</Label>
                    <Input
                      id="template-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="template-tags">Tags (comma separated)</Label>
                  <Input
                    id="template-tags"
                    placeholder="modern, professional, clean"
                    value={formData.tags.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate} disabled={loading}>
                {loading ? "Creating..." : "Create Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <Image
                src={template.previewImage || "/placeholder.svg?height=200&width=150"}
                alt={template.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {template.isPremium && <Badge className="bg-amber-500">Premium</Badge>}
                <Badge variant={template.isActive ? "default" : "secondary"}>
                  {template.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>
                {template.category.charAt(0).toUpperCase() + template.category.slice(1)} •{template.usageCount} uses •
                ⭐ {template.rating?.average?.toFixed(1) || "0.0"}
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
                  <DropdownMenuItem onClick={() => handleDuplicate(template.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleStatus(template.id)}>
                    {template.isActive ? (
                      <>
                        <PowerOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => updateFilters({ page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => updateFilters({ page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name} Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-white p-6 border rounded-md">
            <div className="aspect-[8.5/11] bg-white shadow-lg p-8 mx-auto max-w-[600px]">
              {selectedTemplate && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedTemplate.htmlTemplate,
                  }}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsPreviewDialogOpen(false)
                if (selectedTemplate) handleEditTemplate(selectedTemplate)
              }}
            >
              Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar to Create but pre-filled */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit CV Template</DialogTitle>
            <DialogDescription>Edit the template configuration and design.</DialogDescription>
          </DialogHeader>

          {/* Similar content to Create Dialog but with update functionality */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-template-name">Template Name</Label>
                  <Input
                    id="edit-template-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-template-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
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

              <div className="space-y-2">
                <Label htmlFor="edit-template-description">Description</Label>
                <Textarea
                  id="edit-template-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* <div className="space-y-2">
                <Label>Template Thumbnail</Label>
                <AvatarUpload
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url || "" })}
                  size={120}
                  name="Template Thumbnail"
                />
              </div> */}
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-html">HTML Template</Label>
                <Textarea
                  id="edit-template-html"
                  className="font-mono h-[300px]"
                  value={formData.htmlTemplate}
                  onChange={(e) => setFormData({ ...formData, htmlTemplate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-css">CSS Styles</Label>
                <Textarea
                  id="edit-template-css"
                  className="font-mono h-[200px]"
                  value={formData.cssStyles}
                  onChange={(e) => setFormData({ ...formData, cssStyles: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="h-[500px] border rounded-md p-4 overflow-auto">
              <div className="bg-white p-6 shadow-md">
                <div
                  dangerouslySetInnerHTML={{
                    __html: formData.htmlTemplate,
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-premium-template"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                />
                <Label htmlFor="edit-premium-template">Premium Template</Label>
              </div>

              {formData.isPremium && (
                <div className="space-y-2">
                  <Label htmlFor="edit-template-price">Price ($)</Label>
                  <Input
                    id="edit-template-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate} disabled={loading}>
              {loading ? "Updating..." : "Update Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Template Analytics</DialogTitle>
            <DialogDescription>Overview of template performance and usage statistics.</DialogDescription>
          </DialogHeader>

          {analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Templates</CardTitle>
                  </CardHeader>
                  <CardDescription className="text-2xl font-bold">{analytics.overview.totalTemplates}</CardDescription>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Active Templates</CardTitle>
                  </CardHeader>
                  <CardDescription className="text-2xl font-bold text-green-600">
                    {analytics.overview.activeTemplates}
                  </CardDescription>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Premium Templates</CardTitle>
                  </CardHeader>
                  <CardDescription className="text-2xl font-bold text-amber-600">
                    {analytics.overview.premiumTemplates}
                  </CardDescription>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Free Templates</CardTitle>
                  </CardHeader>
                  <CardDescription className="text-2xl font-bold text-blue-600">
                    {analytics.overview.freeTemplates}
                  </CardDescription>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Templates by Usage</CardTitle>
                  </CardHeader>
                  <div className="p-4">
                    {analytics.topTemplates.map((template: any, index: number) => (
                      <div key={template._id} className="flex justify-between items-center py-2">
                        <span className="font-medium">{template.name}</span>
                        <Badge variant="outline">{template.usageCount} uses</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                  </CardHeader>
                  <div className="p-4">
                    {analytics.categoryStats.map((category: any) => (
                      <div key={category._id} className="flex justify-between items-center py-2">
                        <span className="font-medium capitalize">{category._id}</span>
                        <Badge variant="outline">{category.count} templates</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnalyticsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
