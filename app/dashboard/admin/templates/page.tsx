import type { Metadata } from "next"
import Link from "next/link"
import { Plus, Search, Filter, Edit, Trash, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const metadata: Metadata = {
  title: "Template Management | Admin Dashboard | Job Winner",
  description: "Manage CV templates in the marketplace",
}

export default function AdminTemplatesPage() {
  // Mock data - in a real app, you would fetch this from an API
  const templates = Array.from({ length: 10 }).map((_, i) => ({
    id: `template-${i + 1}`,
    name: [
      "Executive Pro",
      "Modern Minimal",
      "Creative Edge",
      "Professional Plus",
      "Technical Pro",
      "Academic Standard",
      "Entry Level",
      "Designer Portfolio",
      "Developer CV",
      "Corporate Leader",
    ][i % 10],
    category: [
      "Executive",
      "Modern",
      "Creative",
      "Professional",
      "Technical",
      "Academic",
      "Entry Level",
      "Creative",
      "Technical",
      "Executive",
    ][i % 10],
    price: i % 3 === 0 ? 0 : 19.99 + i * 2,
    downloads: Math.floor(Math.random() * 1000),
    rating: 4 + Math.random() * 1,
    status: ["active", "draft", "archived"][i % 3],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
    isPremium: i % 3 !== 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Template Management</h1>
        <Button asChild>
          <Link href="/dashboard/admin/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Template
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <Input placeholder="Search templates..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {template.name}
                          {template.isPremium && (
                            <Badge
                              variant="outline"
                              className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                            >
                              Premium
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell>
                        {template.price === 0 ? (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        ) : (
                          <span>${template.price.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell>{template.downloads}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-1">{template.rating.toFixed(1)}</span>
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            template.status === "active"
                              ? "default"
                              : template.status === "draft"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <strong>1-10</strong> of <strong>42</strong> templates
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="flex items-center justify-center h-40 border rounded-md border-dashed">
            <p className="text-gray-500 dark:text-gray-400">Active templates will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="flex items-center justify-center h-40 border rounded-md border-dashed">
            <p className="text-gray-500 dark:text-gray-400">Draft templates will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="archived">
          <div className="flex items-center justify-center h-40 border rounded-md border-dashed">
            <p className="text-gray-500 dark:text-gray-400">Archived templates will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
