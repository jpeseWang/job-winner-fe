import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db"
import CV from "@/models/CV"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Calendar } from "lucide-react"

interface SharedCVPageProps {
    params: { id: string }
}

export default async function SharedCVPage({ params }: SharedCVPageProps) {
    await connectDB()

    const cv = await CV.findById(params.id).populate("template", "name category").populate("user", "name").lean()

    if (!cv || !cv.isPublic) {
        notFound()
    }

    // Increment view count
    await CV.findByIdAndUpdate(params.id, { $inc: { views: 1 } })

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold">{cv.title}</h1>
                            <p className="text-gray-600 dark:text-gray-400">Shared by {cv.user.name}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {cv.views} views
                            </div>
                            <div className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                {cv.downloads} downloads
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(cv.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline">{cv.template.category}</Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>CV Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {cv.htmlContent ? (
                            <div
                                className="cv-content border rounded-lg p-6 bg-white"
                                dangerouslySetInnerHTML={{ __html: cv.htmlContent }}
                            />
                        ) : (
                            <div className="text-center py-12 text-gray-500">CV content not available for preview</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
