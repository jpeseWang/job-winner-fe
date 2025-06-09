"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"

import { useState, useEffect } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Short timeout to ensure hydration is complete
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return (
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>

            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                children
            )}

        </SessionProvider>
    )
}
