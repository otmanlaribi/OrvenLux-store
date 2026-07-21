"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

const links = [{ href: "/admin", label: "Overview", icon: LayoutDashboard }, { href: "/admin/orders", label: "Orders", icon: ShoppingBag }, { href: "/admin/products", label: "Products", icon: Package }];

export default function Sidebar() {
  const pathname = usePathname();
  return <aside className="hidden w-72 shrink-0 border-r border-stone-200 bg-[#fcfbfa] p-5 dark:border-white/10 dark:bg-stone-950 lg:block"><div className="flex h-full flex-col"><Link href="/admin" className="flex items-center gap-3 px-3 py-3 text-lg font-black tracking-[.18em] text-stone-950 dark:text-white"><span className="rounded-xl bg-stone-950 p-2 text-white dark:bg-white dark:text-stone-950"><Boxes size={17} /></span> ORVEN</Link><p className="mt-8 px-3 text-[11px] font-bold uppercase tracking-[.18em] text-stone-400">Store management</p><nav className="mt-3 space-y-1">{links.map(({ href, label, icon: Icon }) => { const active = pathname === href || (href !== "/admin" && pathname.startsWith(href)); return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-stone-950 text-white dark:bg-white dark:text-stone-950" : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/10"}`}><Icon size={18} />{label}</Link>; })}</nav><div className="mt-auto rounded-2xl bg-stone-100 p-4 dark:bg-white/5"><p className="text-sm font-semibold text-stone-900 dark:text-white">Need help?</p><p className="mt-1 text-xs leading-5 text-stone-500">Your store tools are protected by your administrator account.</p><div className="mt-4"><LogoutButton /></div></div></div></aside>;
}
