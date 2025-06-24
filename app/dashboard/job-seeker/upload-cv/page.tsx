"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyzeCV } from "@/lib/ai-cv-analyzer"
import { Progress } from "@/components/ui/progress"

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a PDF or Word document")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      clearInterval(interval)
      setProgress(100)

      // Start CV analysis
      setIsUploading(false)
      setIsAnalyzing(true)

      // Call AI CV analyzer
      const result = await analyzeCV(file)
      setAnalysis(result)
      setIsAnalyzing(false)
    } catch (err) {
      setError("An error occurred during upload or analysis")
      setIsUploading(false)
      setIsAnalyzing(false)
      clearInterval(interval)
    }
  }

  return (
    <main className="py-12 px-4 md:px-8 lg:px-16 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI CV Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Your CV</CardTitle>
              <CardDescription>
                Our AI will analyze your CV and provide personalized job recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-teal-500"
                }`}
                onClick={() => document.getElementById("cv-upload")?.click()}
              >
                <input
                  type="file"
                  id="cv-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={isUploading || isAnalyzing}
                />

                <div className="flex flex-col items-center justify-center">
                  {file ? (
                    <>
                      <FileText className="h-12 w-12 text-teal-500 mb-4" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="font-medium">Drag and drop your CV here</p>
                      <p className="text-sm text-gray-500">or click to browse (PDF, DOC, DOCX)</p>
                    </>
                  )}

                  {error && (
                    <div className="mt-4 flex items-center text-red-500">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>
              </div>

              {(isUploading || isAnalyzing) && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">{isUploading ? "Uploading..." : "Analyzing your CV..."}</p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} disabled={!file || isUploading || isAnalyzing} className="w-full">
                {isUploading ? "Uploading..." : isAnalyzing ? "Analyzing..." : "Analyze CV"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          {analysis ? (
            <Card>
              <CardHeader>
                <CardTitle>CV Analysis Results</CardTitle>
                <CardDescription>Here's what our AI found in your CV</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="skills">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="matches">Job Matches</TabsTrigger>
                    <TabsTrigger value="improvements">Improvements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="skills">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Key Skills Identified</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skills.map((skill: string, index: number) => (
                          <div key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </div>
                        ))}
                      </div>

                      <h3 className="font-semibold mt-4">Experience Level</h3>
                      <p>{analysis.experienceLevel}</p>

                      <h3 className="font-semibold mt-4">Education</h3>
                      <p>{analysis.education}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="matches">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Top Job Matches</h3>
                      <ul className="space-y-3">
                        {analysis.jobMatches.map((job: any, index: number) => (
                          <li key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{job.title}</h4>
                              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                {job.matchPercentage}% Match
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{job.company}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="improvements">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Suggested Improvements</h3>
                      <ul className="space-y-2">
                        {analysis.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="font-semibold mt-4">Missing Skills for Target Roles</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map((skill: string, index: number) => (
                          <div key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Download Report</Button>
                <Button>Apply to Matched Jobs</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>CV Analysis Benefits</CardTitle>
                <CardDescription>How our AI-powered CV analysis can help your job search</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Check className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Personalized Job Matches</h3>
                      <p className="text-sm text-gray-600">
                        Get job recommendations that match your skills and experience
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Check className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Skills Assessment</h3>
                      <p className="text-sm text-gray-600">
                        Identify your key skills and how they align with job market demands
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Check className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">CV Improvement Tips</h3>
                      <p className="text-sm text-gray-600">
                        Get actionable suggestions to enhance your CV and stand out
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Check className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Career Path Insights</h3>
                      <p className="text-sm text-gray-600">Discover potential career paths based on your experience</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
