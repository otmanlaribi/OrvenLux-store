"use client";

import * as React from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center bg-background px-6 text-center"
    >
      {/* Diamond Ornament */}
      <div className="mb-6 text-2xl text-destructive" aria-hidden="true">
        ◆
      </div>

      <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
        Something went wrong
      </h1>

      <p className="mb-8 text-muted-foreground max-w-md">
        An unexpected error occurred. We have been notified and are working to fix the issue.
      </p>

      {/* Using Phase 2 Button */}
      <Button onClick={() => reset()} size="lg" variant="outline">
        Try Again
      </Button>
    </main>
  )
}