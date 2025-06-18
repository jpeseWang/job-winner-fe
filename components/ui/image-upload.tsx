"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedImage {
    id: string
    url: string
    publicId: string
    name: string
    size: number
}

interface ImageUploadProps {
    value?: UploadedImage | UploadedImage[]
    onChange: (value: UploadedImage | UploadedImage[] | null) => void
    multiple?: boolean
    maxFiles?: number
    maxSize?: number // in MB
    acceptedTypes?: string[]
    folder?: string
    className?: string
    disabled?: boolean
    placeholder?: string
}

export function ImageUpload({
    value,
    onChange,
    multiple = false,
    maxFiles = 5,
    maxSize = 10,
    acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
    folder = "general",
    className,
    disabled = false,
    placeholder,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const currentImages = multiple ? (Array.isArray(value) ? value : []) : value && !Array.isArray(value) ? [value] : []

    const handleFileSelect = useCallback(
        async (files: FileList) => {
            if (disabled) return

            const fileArray = Array.from(files)

            // Validate file types
            const invalidFiles = fileArray.filter((file) => !acceptedTypes.includes(file.type))
            if (invalidFiles.length > 0) {
                toast({
                    title: "Invalid file type",
                    description: `Please select only ${acceptedTypes.join(", ")} files.`,
                    variant: "destructive",
                })
                return
            }

            // Validate file sizes
            const oversizedFiles = fileArray.filter((file) => file.size > maxSize * 1024 * 1024)
            if (oversizedFiles.length > 0) {
                toast({
                    title: "File too large",
                    description: `Please select files smaller than ${maxSize}MB.`,
                    variant: "destructive",
                })
                return
            }

            // Check max files limit
            if (multiple && currentImages.length + fileArray.length > maxFiles) {
                toast({
                    title: "Too many files",
                    description: `You can only upload up to ${maxFiles} files.`,
                    variant: "destructive",
                })
                return
            }

            // For single upload, only take the first file
            const filesToUpload = multiple ? fileArray : [fileArray[0]]

            setUploading(true)
            setUploadProgress(0)

            try {
                const uploadPromises = filesToUpload.map(async (file, index) => {
                    const formData = new FormData()
                    formData.append("file", file)
                    formData.append("folder", folder)

                    const response = await fetch("/api/upload/image", {
                        method: "POST",
                        body: formData,
                    })

                    if (!response.ok) {
                        throw new Error(`Failed to upload ${file.name}`)
                    }

                    const result = await response.json()

                    // Update progress
                    const progress = ((index + 1) / filesToUpload.length) * 100
                    setUploadProgress(progress)

                    return {
                        id: result.public_id,
                        url: result.secure_url,
                        publicId: result.public_id,
                        name: file.name,
                        size: file.size,
                    }
                })

                const uploadedImages = await Promise.all(uploadPromises)

                if (multiple) {
                    const newImages = [...currentImages, ...uploadedImages]
                    onChange(newImages)
                } else {
                    onChange(uploadedImages[0])
                }

                toast({
                    title: "Upload successful",
                    description: `${uploadedImages.length} image(s) uploaded successfully.`,
                })
            } catch (error) {
                console.error("Upload error:", error)
                toast({
                    title: "Upload failed",
                    description: "There was an error uploading your image(s). Please try again.",
                    variant: "destructive",
                })
            } finally {
                setUploading(false)
                setUploadProgress(0)
            }
        },
        [acceptedTypes, maxSize, maxFiles, multiple, currentImages, folder, onChange, toast, disabled],
    )

    const handleRemoveImage = useCallback(
        async (imageToRemove: UploadedImage) => {
            if (disabled) return

            try {
                // Delete from Cloudinary
                await fetch("/api/upload/delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ publicId: imageToRemove.publicId }),
                })

                if (multiple) {
                    const newImages = currentImages.filter((img) => img.id !== imageToRemove.id)
                    onChange(newImages.length > 0 ? newImages : null)
                } else {
                    onChange(null)
                }

                toast({
                    title: "Image removed",
                    description: "Image has been successfully removed.",
                })
            } catch (error) {
                console.error("Delete error:", error)
                toast({
                    title: "Delete failed",
                    description: "There was an error removing the image. Please try again.",
                    variant: "destructive",
                })
            }
        },
        [currentImages, multiple, onChange, toast, disabled],
    )

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files)
            }
        },
        [handleFileSelect],
    )

    const openFileDialog = () => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Upload Area */}
            <Card
                className={cn(
                    "border-2 border-dashed transition-colors cursor-pointer",
                    dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-gray-400",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <CardContent className="flex flex-col items-center justify-center py-8 px-4">
                    {uploading ? (
                        <div className="text-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto" />
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Uploading images...</p>
                                <Progress value={uploadProgress} className="w-full max-w-xs" />
                                <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% complete</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Upload className="h-8 w-8 text-gray-400 mb-4" />
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">{placeholder || "Click to upload or drag and drop"}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {acceptedTypes.join(", ")} up to {maxSize}MB
                                    {multiple && ` (max ${maxFiles} files)`}
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={acceptedTypes.join(",")}
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
                disabled={disabled}
            />

            {/* Preview Images */}
            {currentImages.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Uploaded Images ({currentImages.length})</h4>
                    <div
                        className={cn(
                            "grid gap-4",
                            multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1 max-w-xs",
                        )}
                    >
                        {currentImages.map((image) => (
                            <div key={image.id} className="relative group">
                                <Card className="overflow-hidden">
                                    <div className="aspect-square relative">
                                        <Image
                                            src={image.url || "/placeholder.svg"}
                                            alt={image.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        />
                                        {!disabled && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveImage(image)
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <CardContent className="p-2">
                                        <p className="text-xs text-gray-600 truncate" title={image.name}>
                                            {image.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
