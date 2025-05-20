

// CV interfaces
export interface CVTemplate {
  id: string
  name: string
  category: string
  thumbnail: string
  htmlTemplate: string
  isPremium: boolean
}

export interface CV {
  id: string
  userId: string
  name: string
  templateId: string
  data: any
  htmlContent: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  shareUrl?: string
}