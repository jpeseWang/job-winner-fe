import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
    public_id: string
    secure_url: string
    width: number
    height: number
    format: string
    resource_type: string
    created_at: string
    bytes: number
}

export interface UploadOptions {
    folder?: string
    transformation?: any[]
    resource_type?: "image" | "video" | "raw" | "auto"
    public_id?: string
    overwrite?: boolean
    tags?: string[]
}

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(
    file: string | Buffer,
    options: UploadOptions = {},
): Promise<CloudinaryUploadResult> {
    try {
        const baseOptions = {
            folder: "job-marketplace",
            resource_type: options.resource_type || "auto",
        }

        const imageOnlyOptions = baseOptions.resource_type === "image"
            ? {
                quality: "auto",
                fetch_format: "auto",
            }
            : {}

        const uploadOptions = {
            ...baseOptions,
            ...imageOnlyOptions,
            ...options,
        }

        let result;
        if (typeof file === "string") {
            result = await cloudinary.uploader.upload(file, uploadOptions)
        } else {
            result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, uploadResult) => {
                    if (error) return reject(error)
                    resolve(uploadResult)
                })
                stream.end(file)
            })
        }

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
            created_at: result.created_at,
            bytes: result.bytes,
        }
    } catch (error) {
        console.error("Cloudinary upload error:", error)
        throw new Error("Failed to upload image to Cloudinary")
    }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error("Cloudinary delete error:", error)
        throw new Error("Failed to delete image from Cloudinary")
    }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
    publicId: string,
    options: {
        width?: number
        height?: number
        crop?: string
        quality?: string | number
        format?: string
    } = {},
): string {
    const { width, height, crop = "fill", quality = "auto", format = "auto" } = options

    let transformation = `q_${quality},f_${format}`

    if (width || height) {
        transformation += `,c_${crop}`
        if (width) transformation += `,w_${width}`
        if (height) transformation += `,h_${height}`
    }

    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`
}

/**
 * Generate thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size = 150): string {
    return getOptimizedImageUrl(publicId, {
        width: size,
        height: size,
        crop: "fill",
        quality: 80,
    })
}

export default cloudinary
