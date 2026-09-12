"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  BarChart3,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

type SalesData = {
  name: string;
  sales: number;
};

type SalesChartProps = {
  data?: SalesData[];
};

const defaultData: SalesData[] = [
  { name: "Mon", sales: 12000 },
  { name: "Tue", sales: 18500 },
  { name: "Wed", sales: 14200 },
  { name: "Thu", sales: 22100 },
  { name: "Fri", sales: 26800 },
  { name: "Sat", sales: 31400 },
  { name: "Sun", sales: 28900 },
];

export default function SalesChart({
  data = defaultData,
}: SalesChartProps) {
  return (
    <Card
      dir="rtl"
      className="
        group relative overflow-hidden
        rounded-3xl
        border-[#E8DDC7]
        bg-[#FCFBF8]
        shadow-sm
        transition-all duration-300
        hover:border-[#C9A227]/50
        hover:shadow-xl
      "
    >
      {/* Luxury accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-[#C9A227]" />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-16 -top-16
          h-44 w-44
          rounded-full
          bg-[#C9A227]/10
          blur-3xl
          transition-opacity duration-300
          group-hover:bg-[#C9A227]/15
        "
      />

      <CardHeader className="relative p-6 pb-0 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[#C9A227] sm:w-10"
              />

              <span className="text-[10px] font-black tracking-[0.25em] text-[#9A7718] sm:text-xs">
                SALES ANALYTICS
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
              Weekly Revenue
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-500">
              متابعة أداء المبيعات خلال آخر سبعة أيام مع عرض
              اتجاه الإيرادات اليومية.
            </p>
          </div>

          {/* Chart icon */}
          <div
            className="
              flex h-14 w-14 shrink-0
              items-center justify-center
              rounded-2xl
              bg-[#111111]
              text-[#C9A227]
              shadow-lg
              transition-all duration-300
              group-hover:scale-105
              group-hover:shadow-xl
              sm:h-16 sm:w-16
            "
          >
            <BarChart3
              size={28}
              strokeWidth={2}
              className="sm:h-[30px] sm:w-[30px]"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative p-6 pt-6 sm:p-7">
        {/* Performance indicator */}
        <div
          className="
            mb-8 inline-flex max-w-full
            items-center gap-2
            rounded-full
            border border-emerald-200
            bg-emerald-50
            px-4 py-2
            text-xs font-bold
            text-emerald-700
            sm:text-sm
          "
        >
          <TrendingUp
            size={16}
            strokeWidth={2.5}
            className="shrink-0"
          />

          <span className="truncate">
            ارتفاع المبيعات مقارنة بالأسبوع السابق
          </span>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full sm:h-[360px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 8,
                left: 8,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="salesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#C9A227"
                    stopOpacity={0.5}
                  />

                  <stop
                    offset="100%"
                    stopColor="#C9A227"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#ECE7DC"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#78716C",
                  fontSize: 12,
                }}
                dy={10}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#78716C",
                  fontSize: 12,
                }}
                tickFormatter={(value) =>
                  Number(value).toLocaleString("fr-FR")
                }
                width={70}
              />

              <Tooltip
                cursor={{
                  stroke: "#C9A227",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString(
                    "fr-FR"
                  )} DA`,
                  "المبيعات",
                ]}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid #E8DDC7",
                  background: "#FCFBF8",
                  boxShadow:
                    "0 12px 32px rgba(0,0,0,.08)",
                  padding: "12px 14px",
                }}
                labelStyle={{
                  color: "#111111",
                  fontWeight: 800,
                  marginBottom: 4,
                }}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#C9A227"
                strokeWidth={3}
                fill="url(#salesGradient)"
                activeDot={{
                  r: 6,
                  stroke: "#111111",
                  strokeWidth: 2,
                  fill: "#C9A227",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}