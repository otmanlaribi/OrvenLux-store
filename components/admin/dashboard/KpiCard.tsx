import {
  LucideIcon,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

type KpiCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  color?: string;
};

export default function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  color = "#C9A227",
}: KpiCardProps) {
  return (
    <Card
      className="
        group relative overflow-hidden
        rounded-3xl
        border-[#E8DDC7]
        bg-[#FCFBF8]
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#C9A227]/60
        hover:shadow-xl
      "
    >
      {/* Luxury top accent */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: color }}
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-12 -top-12
          h-40 w-40
          rounded-full
          opacity-10
          blur-3xl
          transition-opacity duration-300
          group-hover:opacity-20
        "
        style={{ backgroundColor: color }}
      />

      <CardHeader className="relative p-6 pb-0">
        <div className="flex items-start justify-between gap-4">
          {/* KPI information */}
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-500">
              {title}
            </p>

            <h3 className="mt-3 truncate text-3xl font-black tracking-tight text-[#111111] sm:text-4xl">
              {value}
            </h3>
          </div>

          {/* KPI icon */}
          <div
            className="
              flex h-14 w-14 shrink-0
              items-center justify-center
              rounded-2xl
              shadow-lg
              transition-all duration-300
              group-hover:scale-110
              group-hover:rotate-3
              sm:h-16 sm:w-16
            "
            style={{ backgroundColor: color }}
          >
            <Icon
              size={28}
              strokeWidth={2}
              className="text-white sm:h-[30px] sm:w-[30px]"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative p-6 pt-4">
        {/* Description */}
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-stone-500">
          <TrendingUp
            size={16}
            strokeWidth={2.5}
            className="shrink-0"
            style={{ color }}
          />

          <span className="truncate">
            {description}
          </span>
        </div>

        {/* Visual progress indicator */}
        <div className="mt-7">
          <div
            className="h-2 overflow-hidden rounded-full bg-stone-200"
            aria-hidden="true"
          >
            <div
              className="
                h-full rounded-full
                transition-all duration-700
                group-hover:w-full
              "
              style={{
                width: "70%",
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}