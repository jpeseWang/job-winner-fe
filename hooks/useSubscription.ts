import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Subscription {
  userId: string
  planId: string
  canPostJob: boolean
  jobPostingsUsed: number
  jobPostingsLimit: number
}

export function useSubscription() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/subscription?userId=${session.user.id}`)
        const data = await res.json()
        setSubscription(data.subscription)
      } catch (err) {
        setError("Failed to fetch subscription")
        console.error("Error fetching subscription:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubscription()
  }, [session?.user?.id])

  return {
    subscription,
    isLoading,
    error,
  }
} 