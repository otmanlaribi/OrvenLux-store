import { Bell, Menu } from "lucide-react";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  return <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-stone-200 bg-[#fbfaf8]/90 px-5 backdrop-blur dark:border-white/10 dark:bg-stone-950/90 lg:px-8"><div className="flex items-center gap-3"><Menu className="text-stone-600 lg:hidden" size={20} /><div><p className="text-sm font-bold text-stone-950 dark:text-white">ORVEN LUX</p><p className="text-xs text-stone-500">Store administration</p></div></div><div className="flex items-center gap-2"><ThemeToggle /><button type="button" aria-label="Notifications" className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-700 dark:border-white/10 dark:bg-stone-900 dark:text-stone-200"><Bell size={18} /></button><div className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-stone-950 text-sm font-bold text-white dark:bg-white dark:text-stone-950">O</div></div></header>;
}
