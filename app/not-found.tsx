import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center bg-background px-6 text-center"
    >
      {/* Diamond Ornament */}
      <div className="mb-6 text-2xl text-primary" aria-hidden="true">
        ◆
      </div>

      <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
        Page Not Found
      </h1>

      <p className="mb-8 text-muted-foreground max-w-md">
        We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
      </p>

      {/* Fixed: Wrapped Link around Button or use Link styled as Button */}
      <Link href="/">
        <Button size="lg">
          Return to Storefront
        </Button>
      </Link>
    </main>
  )
}