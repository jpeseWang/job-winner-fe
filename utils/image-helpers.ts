import { getOptimizedImageUrl, getThumbnailUrl } from "@/lib/cloudinary"

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
    try {
        const regex = /\/v\d+\/(.+)\.[a-zA-Z]+$/
        const match = url.match(regex)
        return match ? match[1] : null
    } catch {
        return null
    }
}

/**
 * Get responsive image URLs for different screen sizes
 */
export function getResponsiveImageUrls(publicId: string) {
    return {
        thumbnail: getThumbnailUrl(publicId, 150),
        small: getOptimizedImageUrl(publicId, { width: 300, height: 300 }),
        medium: getOptimizedImageUrl(publicId, { width: 600, height: 600 }),
        large: getOptimizedImageUrl(publicId, { width: 1200, height: 1200 }),
        original: getOptimizedImageUrl(publicId),
    }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!acceptedTypes.includes(file.type)) {
        return {
            valid: false,
            error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        }
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: "File too large. Maximum size is 10MB.",
        }
    }

    return { valid: true }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Generate image alt text based on context
 */
export function generateImageAlt(context: string, name?: string): string {
    switch (context) {
        case "avatar":
            return `${name || "User"}'s profile picture`
        case "company-logo":
            return `${name || "Company"} logo`
        case "job-image":
            return `Image for ${name || "job posting"}`
        case "cv-template":
            return `${name || "CV template"} preview`
        default:
            return name || "Image"
    }
}
