import type { LucideIcon } from "lucide-react";

type Props = { title: string; value: string | number; icon: LucideIcon; color?: string; detail?: string };

export default function StatCard({ title, value, icon: Icon, color = "bg-stone-950", detail = "Live store data" }: Props) {
  return <article className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-stone-950"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-stone-500">{title}</p><p className="mt-3 text-3xl font-black tracking-[-.04em] text-stone-950 dark:text-white">{value}</p></div><div className={`rounded-2xl p-3 text-white ${color}`}><Icon size={21} /></div></div><p className="mt-5 text-xs font-medium text-stone-400">{detail}</p></article>;
}
