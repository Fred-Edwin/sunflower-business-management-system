"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Sentry's global error hook also captures this; logged here too so it
    // is visible in local dev without a DSN configured.
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-lg font-medium">Something went wrong.</p>
      <p className="text-text-muted text-sm">
        Try again, or come back in a moment.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
