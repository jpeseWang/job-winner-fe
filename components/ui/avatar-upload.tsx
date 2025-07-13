"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Camera, Loader2, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
    value?: string
    onChange: (url: string | null) => void
    size?: number
    className?: string
    disabled?: boolean
    name?: string
}

export function AvatarUpload({
    value,
    onChange,
    size = 120,
    className,
    disabled = false,
    name = "User",
}: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleFileSelect = async (file: File) => {
        if (disabled) return

        // Validate file type
        const acceptedTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!acceptedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please select a JPEG, PNG, or WebP image.",
                variant: "destructive",
            })
            return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please select an image smaller than 5MB.",
                variant: "destructive",
            })
            return
        }

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", "avatars")

            const response = await fetch("/api/upload/image", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to upload avatar")
            }

            const result = await response.json()
            onChange(result.secure_url)

            toast({
                title: "Avatar updated",
                description: "Your profile picture has been updated successfully.",
            })
        } catch (error) {
            console.error("Upload error:", error)
            toast({
                title: "Upload failed",
                description: "There was an error uploading your avatar. Please try again.",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const openFileDialog = () => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
    }

    return (
        <div className={cn("flex flex-col items-center space-y-4", className)}>
            <div
                className={cn(
                    "relative rounded-full border-4 border-dashed transition-all duration-200 cursor-pointer group",
                    dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-gray-400",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
                style={{ width: size, height: size }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                {value ? (
                    <>
                        <Image
                            src={value || "/placeholder.svg"}
                            alt={`${name}'s avatar`}
                            fill
                            className="rounded-full object-cover"
                            sizes={`${size}px`}
                        />
                        {!disabled && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                {uploading ? (
                                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                                ) : (
                                    <Camera className="h-6 w-6 text-white" />
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                        {uploading ? (
                            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                        ) : (
                            <User className="h-8 w-8 text-gray-400" />
                        )}
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                disabled={disabled}
            />

            {!disabled && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={openFileDialog}
                    disabled={uploading}
                    className="flex items-center gap-2"
                >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Uploading..." : "Change Avatar"}
                </Button>
            )}
        </div>
    )
}
