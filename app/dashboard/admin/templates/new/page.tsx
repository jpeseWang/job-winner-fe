import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Save, Eye, Upload, Code, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const email = "email" // Declare the email variable
const skills = "skills" // Declare the skills variable

export const metadata: Metadata = {
  title: "Add New Template | Admin Dashboard | Job Winner",
  description: "Create a new CV template for the marketplace",
}

export default function NewTemplatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/templates"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold">Add New Template</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Create a new CV template for the marketplace</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" placeholder="e.g. Executive Pro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="entry-level">Entry Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea id="description" placeholder="Brief description of the template" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long-description">Detailed Description</Label>
                  <Textarea
                    id="long-description"
                    placeholder="Detailed description with features and benefits"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" min="0" step="0.01" placeholder="e.g. 19.99" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="premium" />
                  <Label htmlFor="premium">Mark as Premium Template</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="html">
                <TabsList className="mb-4">
                  <TabsTrigger value="html">HTML Template</TabsTrigger>
                  <TabsTrigger value="css">CSS Styles</TabsTrigger>
                  <TabsTrigger value="upload">Upload Files</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>HTML Template Code</Label>
                    <Button variant="outline" size="sm">
                      <Code className="mr-2 h-4 w-4" />
                      Format Code
                    </Button>
                  </div>
                  <Textarea
                    className="font-mono text-sm min-h-[400px]"
                    placeholder={`Paste your HTML template code here with {{placeholders}} for dynamic content. Example: {{${email}}}, {{${skills}}}`}
                  ></Textarea>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Use double curly braces for placeholders, e.g. {{ name }}, {email}, {skills}, etc.
                  </div>
                </TabsContent>

                <TabsContent value="css" className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>CSS Styles</Label>
                    <Button variant="outline" size="sm">
                      <Code className="mr-2 h-4 w-4" />
                      Format Code
                    </Button>
                  </div>
                  <Textarea className="font-mono text-sm min-h-[400px]" placeholder="Paste your CSS styles here" />
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">Upload Template Files</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Drag and drop your HTML, CSS, and image files here
                    </p>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Browse Files
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Supported file types: .html, .css, .jpg, .png, .svg
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Template Preview</h3>
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preview will appear here</p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Template Thumbnail</h3>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Upload a thumbnail image (600×800px recommended)
                </p>
                <Button variant="outline" size="sm">
                  Upload Image
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Template Features</h3>
              <div className="space-y-2">
                {[
                  "ATS-Friendly Design",
                  "Multiple Color Schemes",
                  "Matching Cover Letter",
                  "Reference Page",
                  "Custom Sections",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Switch id={`feature-${i}`} />
                    <Label htmlFor={`feature-${i}`}>{feature}</Label>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Add Custom Feature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
