import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      <p className="mt-2 text-gray-500">{message}</p>
    </main>
  )
}
