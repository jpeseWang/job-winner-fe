import axiosInstance from "@/lib/axios"

export const generateCV = async (formData: any, useAI = false): Promise<any> => {
  try {
    const endpoint = useAI ? "/cv/generate-ai" : "/cv/generate"
    const response = await axiosInstance.post(endpoint, formData)
    return response.data
  } catch (error) {
    console.error("Error generating CV:", error)
    throw new Error("Failed to generate CV")
  }
}

export const generateFieldContent = async (fieldId: string, fieldLabel: string, context: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/cv/generate-field", {
      fieldId,
      fieldLabel,
      context,
    })
    return response.data
  } catch (error) {
    console.error("Error generating field content:", error)
    throw new Error("Failed to generate field content")
  }
}

export const saveCV = async (cvData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/cv/save", cvData)
    return response.data
  } catch (error) {
    console.error("Error saving CV:", error)
    throw new Error("Failed to save CV")
  }
}

export const getUserCVs = async (userId: string): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`/cv/user/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user CVs:", error)
    throw new Error("Failed to fetch user CVs")
  }
}

export const getCVById = async (cvId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/cv/${cvId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching CV:", error)
    throw new Error("Failed to fetch CV")
  }
}

export const deleteCV = async (cvId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/cv/${cvId}`)
  } catch (error) {
    console.error("Error deleting CV:", error)
    throw new Error("Failed to delete CV")
  }
}

export const shareCV = async (cvId: string): Promise<{ shareUrl: string }> => {
  try {
    const response = await axiosInstance.post(`/cv/${cvId}/share`)
    return response.data
  } catch (error) {
    console.error("Error sharing CV:", error)
    throw new Error("Failed to share CV")
  }
}

export const getTemplates = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/cv/templates")
    return response.data
  } catch (error) {
    console.error("Error fetching templates:", error)
    throw new Error("Failed to fetch templates")
  }
}
