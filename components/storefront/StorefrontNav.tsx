"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function StorefrontNav() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  // تأثير التمرير (Scroll Effect)
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // قفل التمرير وإغلاق القائمة بزر ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false)
    }

    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <>
      {/* Skip to Content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
      >
        تخطي إلى المحتوى (Skip to content)
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex flex-col transition-all duration-500 ease-[var(--ease-luxury)]",
          isScrolled
            ? "bg-[#FAF9F6]/90 backdrop-blur-md border-b-[0.5px] border-border text-foreground"
            : "bg-transparent text-foreground" // اجعله text-white إذا كان الـ Hero Section مظلماً
        )}
      >
        {/* شريط الإعلانات - Announcement Bar */}
        <div className="flex h-8 items-center justify-center border-b-[0.5px] border-border/50 bg-transparent px-4">
          <p className="text-xs font-medium tracking-wide uppercase">
            Nationwide delivery across all 58 wilayas · Cash on delivery
          </p>
        </div>

        {/* الشريط الرئيسي - Main Nav */}
        <div className="flex h-16 items-center justify-between px-6 md:px-12">
          {/* مساحة فارغة لموازنة الشعار في المنتصف */}
          <div className="flex-1" />

          {/* الشعار - Wordmark */}
          <Link
            href="/"
            className="flex-shrink-0 font-serif text-2xl font-semibold tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          >
            ORVENLUX
          </Link>

          {/* زر القائمة - Hamburger */}
          <div className="flex flex-1 justify-end">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity hover:opacity-70"
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* قائمة الجوال - Full-screen Ivory Sheet */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[#FAF9F6] text-foreground animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-24 items-center justify-end px-6 md:px-12">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md transition-opacity hover:opacity-70"
              aria-label="Close menu"
              autoFocus
            >
              <X className="size-8" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-serif text-4xl (2rem) tracking-wide outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-8 focus-visible:ring-offset-[#FAF9F6] animate-in slide-in-from-bottom-4 fade-in"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}