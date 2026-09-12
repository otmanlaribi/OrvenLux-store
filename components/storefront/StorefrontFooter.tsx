import * as React from "react"
import Link from "next/link"

export default function StorefrontFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-950 text-zinc-50 border-t border-[#D4AF37]/50 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-serif text-2xl font-semibold tracking-widest">
              ORVENLUX
            </span>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Elegance delivered to your doorstep. Proudly serving all 58 wilayas with uncompromising quality.
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold uppercase tracking-wider text-sm text-zinc-300">Shop</h3>
            <nav className="flex flex-col gap-3 text-sm text-zinc-400">
              <Link href="/collections" className="hover:text-zinc-50 transition-colors w-fit">Collections</Link>
              <Link href="/best-sellers" className="hover:text-zinc-50 transition-colors w-fit">Best Sellers</Link>
              <Link href="/new-arrivals" className="hover:text-zinc-50 transition-colors w-fit">New Arrivals</Link>
            </nav>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold uppercase tracking-wider text-sm text-zinc-300">Support</h3>
            <nav className="flex flex-col gap-3 text-sm text-zinc-400">
              <Link href="/contact" className="hover:text-zinc-50 transition-colors w-fit">Contact Us</Link>
              <Link href="/shipping" className="hover:text-zinc-50 transition-colors w-fit">Shipping Policy</Link>
              <Link href="/returns" className="hover:text-zinc-50 transition-colors w-fit">Returns & Exchanges</Link>
            </nav>
          </div>
        </div>

        {/* 12px Legal Line */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-zinc-800 pt-8 text-[12px] text-zinc-500 md:flex-row">
          <p>© {currentYear} OrvenLux. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with precision in Algeria.</p>
        </div>
      </div>
    </footer>
  )
}