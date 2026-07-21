"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

export default function StorefrontNav() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fbfaf8]/90 backdrop-blur"><nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><Link href="/" className="text-xl font-black tracking-[0.22em] text-stone-950">ORVEN LUX</Link><div className="hidden items-center gap-8 text-sm font-medium text-stone-600 md:flex"><a href="#collection" className="transition hover:text-stone-950">Collection</a><a href="#story" className="transition hover:text-stone-950">Our story</a><a href="#delivery" className="transition hover:text-stone-950">Delivery</a></div><div className="flex items-center gap-3"><a href="#collection" className="hidden rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 sm:inline-flex">Shop collection</a><button aria-label="Open navigation" onClick={() => setOpen((value) => !value)} className="rounded-full border border-stone-200 p-2.5 text-stone-900 md:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button><ShoppingBag size={20} className="text-stone-700" aria-hidden /></div></nav>{open && <div className="border-t border-stone-200 bg-[#fbfaf8] px-5 py-5 md:hidden"><div className="flex flex-col gap-4 text-sm font-semibold text-stone-700"><a onClick={() => setOpen(false)} href="#collection">Collection</a><a onClick={() => setOpen(false)} href="#story">Our story</a><a onClick={() => setOpen(false)} href="#delivery">Delivery</a></div></div>}</header>;
}
