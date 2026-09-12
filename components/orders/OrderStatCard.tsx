import { LucideIcon, TrendingUp } from "lucide-react";

type OrderStatCardProps = {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  color?: string;
};

export default function OrderStatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "#C9A227",
}: OrderStatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227]/40 hover:shadow-xl dark:border-stone-800 dark:bg-[#111111]">
      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#C9A227]/10 blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-black tracking-tight text-stone-900 dark:text-white">
            {value}
          </h3>

          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={16} />
            <span>{description}</span>
          </div>
        </div>

        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: color,
          }}
        >
          <Icon className="text-white" size={30} />
        </div>
      </div>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
        <div
          className="h-full rounded-full transition-all duration-500 group-hover:w-full"
          style={{
            width: "70%",
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}