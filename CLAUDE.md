"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Check,
  ChevronLeft,
  CircleDollarSign,
  Clock3,
  Eye,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

type Period = "7D" | "30D" | "90D";

type DashboardOrder = {
  id: number;
  customer_name: string | null;
  phone: string | null;
  total_price: number | string | null;
  status: string | null;
  created_at: string;
  commune: string | null;
  wilaya: number | null;
  delivery_type: string | null;
  tracking_number: string | null;
};

type DashboardProduct = {
  id: number | string;
  name: string | null;
  price: number | string | null;
  stock: number | null;
  active: boolean | null;
  image: string | null;
  created_at: string | null;
};

type DashboardData = {
  metrics: {
    revenue: number;
    revenuePrevious: number;
    revenueChange: number;
    orders: number;
    ordersPrevious: number;
    ordersChange: number;
    pendingOrders: number;
    products: number;
    lowStock: number;
    soldOut: number;
  };

  pulse: {
    fulfillment: number;
    stockHealth: number;
    deliverySuccess: number;
  };

  chart: {
    period: Period;
    values: number[];
    labels: string[];
  };

  recentOrders: DashboardOrder[];

  collection: DashboardProduct[];

  latestOrderCreatedAt: string | null;
};

type NotificationItem = {
  id: number;
  orderId: number;
  title: string;
  description: string;
  amount: number;
  createdAt: string;
  read: boolean;
};

function formatDzd(value: number) {
  return new Intl.NumberFormat("fr-DZ").format(
    value,
  );
}

function formatCompactCurrency(value: number) {
  return `${formatDzd(value)} DZD`;
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("fr-DZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatRelativeTime(date: string) {
  const created = new Date(date).getTime();
  const diff = Math.max(
    0,
    Date.now() - created,
  );

  const minutes = Math.floor(
    diff / 60000,
  );

  if (minutes < 1) {
    return "الآن";
  }

  if (minutes < 60) {
    return `منذ ${minutes} د`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `منذ ${hours} س`;
  }

  const days = Math.floor(
    hours / 24,
  );

  return `منذ ${days} ي`;
}

function getStatusLabel(
  status: string | null,
) {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase();

  const labels: Record<string, string> = {
    pending: "جديد",
    new: "جديد",
    confirmed: "تم التأكيد",
    processing: "قيد المعالجة",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغي",
    canceled: "ملغي",
    "جديد": "جديد",
    "تم التأكيد": "تم التأكيد",
    "تم الشحن": "تم الشحن",
    "تم التسليم": "تم التسليم",
    "ملغي": "ملغي",
    "ملغى": "ملغي",
  };

  return labels[normalized] ?? status ?? "غير محدد";
}

function getStatusClass(
  status: string | null,
) {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase();

  if (
    normalized === "pending" ||
    normalized === "new" ||
    normalized === "جديد"
  ) {
    return "border-[#C9A227]/25 bg-[#C9A227]/[0.08] text-[#D7B65B]";
  }

  if (
    normalized === "confirmed" ||
    normalized === "تم التأكيد"
  ) {
    return "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300";
  }

  if (
    normalized === "processing" ||
    normalized === "قيد المعالجة"
  ) {
    return "border-sky-400/15 bg-sky-400/[0.07] text-sky-300";
  }

  if (
    normalized === "shipped" ||
    normalized === "تم الشحن"
  ) {
    return "border-violet-400/15 bg-violet-400/[0.07] text-violet-300";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "ملغي" ||
    normalized === "ملغى"
  ) {
    return "border-red-400/15 bg-red-400/[0.06] text-red-300";
  }

  return "border-white/[0.08] bg-white/[0.035] text-white/55";
}

function SectionEyebrow({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-semibold tracking-[0.2em] text-[#C9A227]">
        {number}
      </span>

      <span className="h-px w-5 bg-[#C9A227]/35" />

      <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">
        {label}
      </span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  meta,
  icon: Icon,
  positive = true,
}: {
  label: string;
  value: string;
  change: string;
  meta: string;
  icon: typeof CircleDollarSign;
  positive?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#111111] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227]/25 hover:bg-[#121212]">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#C9A227]/[0.045] blur-3xl transition duration-500 group-hover:bg-[#C9A227]/[0.08]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
              {label}
            </p>

            <p className="mt-4 font-sans text-[28px] font-semibold tracking-[-0.03em] text-[#F7F5F0]">
              {value}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-[#C9A227] transition duration-300 group-hover:border-[#C9A227]/20 group-hover:bg-[#C9A227]/[0.07]">
            <Icon size={17} strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {positive ? (
              <ArrowUpRight
                size={13}
                className="text-[#C9A227]"
              />
            ) : (
              <ArrowDownLeft
                size={13}
                className="text-red-300"
              />
            )}

            <span
              className={`text-[10px] font-semibold ${
                positive
                  ? "text-[#C9A227]"
                  : "text-red-300"
              }`}
            >
              {change}
            </span>
          </div>

          <span className="text-[9px] text-white/25">
            {meta}
          </span>
        </div>
      </div>
    </div>
  );
}

function RevenueChart({
  chart,
}: {
  chart: DashboardData["chart"];
}) {
  const [activeIndex, setActiveIndex] =
    useState<number>(
      Math.max(0, chart.values.length - 1),
    );

  const chartRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveIndex(
      Math.max(0, chart.values.length - 1),
    );
  }, [chart.period, chart.values.length]);

  const geometry = useMemo(() => {
    const width = 1000;
    const height = 330;
    const topPadding = 28;
    const bottomPadding = 48;
    const usableHeight =
      height -
      topPadding -
      bottomPadding;

    const safeValues =
      chart.values.length > 0
        ? chart.values
        : [0];

    const max = Math.max(
      ...safeValues,
    );

    const min = Math.min(
      ...safeValues,
    );

    const points = safeValues.map(
      (value, index) => {
        const x =
          safeValues.length === 1
            ? width / 2
            : (index /
                (safeValues.length - 1)) *
              width;

        const normalized =
          max === min
            ? 0.5
            : (value - min) /
              (max - min);

        const y =
          height -
          bottomPadding -
          normalized * usableHeight;

        return {
          x,
          y,
          value,
        };
      },
    );

    const linePath = points
      .map((point, index) =>
        index === 0
          ? `M ${point.x} ${point.y}`
          : `L ${point.x} ${point.y}`,
      )
      .join(" ");

    const areaPath =
      `${linePath} L ${width} ${
        height - bottomPadding
      } L 0 ${
        height - bottomPadding
      } Z`;

    return {
      width,
      height,
      points,
      linePath,
      areaPath,
    };
  }, [chart]);

  function handleMove(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (!chartRef.current) {
      return;
    }

    const rect =
      chartRef.current.getBoundingClientRect();

    const ratio =
      (event.clientX - rect.left) /
      rect.width;

    const index = Math.round(
      ratio *
        (chart.values.length - 1),
    );

    setActiveIndex(
      Math.max(
        0,
        Math.min(
          chart.values.length - 1,
          index,
        ),
      ),
    );
  }

  const activePoint =
    geometry.points[activeIndex];

  return (
    <div
      ref={chartRef}
      className="relative h-[315px] w-full cursor-crosshair"
      onMouseMove={handleMove}
      onMouseLeave={() =>
        setActiveIndex(
          Math.max(
            0,
            chart.values.length - 1,
          ),
        )
      }
    >
      <svg
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="orvenRevenueAreaReal"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#C9A227"
              stopOpacity="0.2"
            />

            <stop
              offset="100%"
              stopColor="#C9A227"
              stopOpacity="0"
            />
          </linearGradient>

          <linearGradient
            id="orvenRevenueLineReal"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#9E7B1D"
            />

            <stop
              offset="50%"
              stopColor="#C9A227"
            />

            <stop
              offset="100%"
              stopColor="#E2C76D"
            />
          </linearGradient>
        </defs>

        {[65, 130, 195, 260].map(
          (y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="1000"
              y2={y}
              stroke="white"
              strokeOpacity="0.055"
              strokeWidth="1"
            />
          ),
        )}

        <path
          d={geometry.areaPath}
          fill="url(#orvenRevenueAreaReal)"
        />

        <path
          d={geometry.linePath}
          fill="none"
          stroke="url(#orvenRevenueLineReal)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {geometry.points.map(
          (point, index) => (
            <circle
              key={`${chart.period}-${index}`}
              cx={point.x}
              cy={point.y}
              r={
                activeIndex === index
                  ? 7
                  : 3
              }
              fill="#0A0A0A"
              stroke={
                activeIndex === index
                  ? "#E2C76D"
                  : "#C9A227"
              }
              strokeWidth={
                activeIndex === index
                  ? 2.5
                  : 1.5
              }
              className="transition-all duration-150"
            />
          ),
        )}

        {activePoint && (
          <line
            x1={activePoint.x}
            y1="20"
            x2={activePoint.x}
            y2="282"
            stroke="#C9A227"
            strokeOpacity="0.18"
            strokeDasharray="4 6"
          />
        )}
      </svg>

      {activePoint && (
        <div
          className="pointer-events-none absolute top-3 z-10 -translate-x-1/2 rounded-xl border border-[#C9A227]/20 bg-[#090909]/95 px-3 py-2 shadow-2xl backdrop-blur-md"
          style={{
            left: `${
              (activePoint.x / 1000) *
              100
            }%`,
          }}
        >
          <p className="text-[8px] uppercase tracking-[0.15em] text-white/30">
            Revenue
          </p>

          <p className="mt-1 text-xs font-semibold text-[#F7F5F0]">
            {formatCompactCurrency(
              activePoint.value,
            )}
          </p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex justify-between px-1">
        {chart.labels.map(
          (label, index) => (
            <span
              key={`${label}-${index}`}
              className={`text-[9px] uppercase tracking-[0.12em] ${
                activeIndex === index
                  ? "text-[#C9A227]"
                  : "text-white/25"
              }`}
            >
              {label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function CommandWatch() {
  const [rotation, setRotation] =
    useState({
      x: -4,
      y: 8,
    });

  const [isHovering, setIsHovering] =
    useState(false);

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const relativeX =
      (event.clientX - rect.left) /
      rect.width;

    const relativeY =
      (event.clientY - rect.top) /
      rect.height;

    setRotation({
      x: (relativeY - 0.5) * -8,
      y: (relativeX - 0.5) * 12,
    });
  }

  function resetRotation() {
    setRotation({
      x: -4,
      y: 8,
    });

    setIsHovering(false);
  }

  return (
    <div
      className="relative flex h-[310px] w-full items-center justify-center overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0E0E0E]"
      onPointerMove={handlePointerMove}
      onPointerEnter={() =>
        setIsHovering(true)
      }
      onPointerLeave={resetRotation}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.12),transparent_38%)]" />

      <div className="pointer-events-none absolute left-8 top-8 text-[8px] uppercase tracking-[0.22em] text-white/20">
        ORVEN / PRECISION INSTRUMENT
      </div>

      <div className="pointer-events-none absolute bottom-7 right-8 text-[8px] uppercase tracking-[0.18em] text-white/20">
        LIVE COMMAND OBJECT
      </div>

      <div
        className="relative h-[205px] w-[205px]"
        style={{
          perspective: "900px",
        }}
      >
        <div
          className="relative h-full w-full rounded-full transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-[2px] rounded-full border border-[#C9A227]/30 bg-[radial-gradient(circle_at_35%_25%,#3B372C_0%,#191811_30%,#0A0A0A_68%,#050505_100%)] shadow-[0_28px_80px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.03)]" />

          <div
            className="absolute inset-[12px] rounded-full border border-white/[0.08]"
            style={{
              transform:
                "translateZ(12px)",
            }}
          />

          <div
            className="absolute inset-[23px] rounded-full border border-[#C9A227]/35 bg-[#111111]"
            style={{
              transform:
                "translateZ(18px)",
            }}
          />

          <div
            className="absolute inset-[38px] rounded-full border border-white/[0.06] bg-[radial-gradient(circle_at_42%_35%,#1D1D1D,#080808_72%)]"
            style={{
              transform:
                "translateZ(26px)",
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 h-[6px] w-[72px] origin-left rounded-full bg-[#C9A227] shadow-[0_0_14px_rgba(201,162,39,0.2)]"
            style={{
              transform:
                "translateZ(38px) rotate(-22deg)",
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 h-[4px] w-[52px] origin-left rounded-full bg-[#F7F5F0]/80"
            style={{
              transform:
                "translateZ(42px) rotate(48deg)",
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9A227]/80 bg-[#111111]"
            style={{
              transform:
                "translate(-50%, -50%) translateZ(50px)",
            }}
          />

          <span
            className="absolute left-1/2 top-[50px] -translate-x-1/2 text-[9px] font-semibold tracking-[0.24em] text-[#C9A227]/80"
            style={{
              transform:
                "translateX(-50%) translateZ(34px)",
            }}
          >
            ORVEN
          </span>

          <span
            className="absolute left-[38px] top-1/2 -translate-y-1/2 text-[7px] text-white/20"
            style={{
              transform:
                "translateY(-50%) translateZ(34px)",
            }}
          >
            09
          </span>

          <span
            className="absolute right-[38px] top-1/2 -translate-y-1/2 text-[7px] text-white/20"
            style={{
              transform:
                "translateY(-50%) translateZ(34px)",
            }}
          >
            03
          </span>

          <span
            className="absolute bottom-[47px] left-1/2 -translate-x-1/2 text-[7px] tracking-[0.2em] text-white/20"
            style={{
              transform:
                "translateX(-50%) translateZ(34px)",
            }}
          >
            PRECISION
          </span>

          <div
            className={`absolute -inset-5 rounded-full border border-[#C9A227]/10 transition-all duration-500 ${
              isHovering
                ? "scale-105 opacity-100"
                : "opacity-60"
            }`}
            style={{
              transform:
                "translateZ(-8px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function PulseLine({
  label,
  value,
  caption,
  percentage,
  tone = "gold",
}: {
  label: string;
  value: string;
  caption: string;
  percentage: number;
  tone?: "gold" | "green" | "blue";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-400/80"
      : tone === "blue"
        ? "bg-sky-400/80"
        : "bg-[#C9A227]";

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
            {label}
          </p>

          <p className="mt-1 text-[9px] text-white/25">
            {caption}
          </p>
        </div>

        <span className="text-sm font-semibold text-white/80">
          {value}%
        </span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full ${toneClass}`}
          style={{
            width: `${Math.max(
              0,
              Math.min(100, percentage),
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function NotificationPanel({
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onClear,
}: {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onClear: () => void;
}) {
  return (
    <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-[min(92vw,390px)] overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#101010]/98 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C9A227]">
            Command notifications
          </p>

          <h3 className="mt-1 font-serif text-lg text-[#F7F5F0]">
            إشعارات الطلبات
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.05] hover:text-white"
          aria-label="إغلاق الإشعارات"
        >
          <X size={14} />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-white/25">
            <Bell size={17} />
          </div>

          <p className="mt-4 text-xs font-semibold text-white/60">
            لا توجد إشعارات جديدة
          </p>

          <p className="mt-2 text-[9px] leading-5 text-white/25">
            عند وصول طلب جديد سيظهر هنا مباشرة.
          </p>
        </div>
      ) : (
        <>
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.map(
              (notification) => (
                <Link
                  key={notification.id}
                  href={`/admin/orders/${notification.orderId}`}
                  onClick={() => {
                    onMarkRead(
                      notification.id,
                    );
                    onClose();
                  }}
                  className={`group block border-b border-white/[0.05] px-4 py-4 transition hover:bg-white/[0.025] ${
                    notification.read
                      ? "bg-transparent"
                      : "bg-[#C9A227]/[0.025]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#C9A227]/15 bg-[#C9A227]/[0.07] text-[#C9A227]">
                      <ShoppingBag
                        size={15}
                      />

                      {!notification.read && (
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.55)]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[11px] font-semibold text-white/80">
                          {notification.title}
                        </p>

                        <span className="shrink-0 text-[8px] text-white/20">
                          {formatRelativeTime(
                            notification.createdAt,
                          )}
                        </span>
                      </div>

                      <p className="mt-1 text-[9px] leading-5 text-white/35">
                        {notification.description}
                      </p>

                      <p className="mt-2 text-[10px] font-semibold text-[#C9A227]">
                        {formatDzd(
                          notification.amount,
                        )}{" "}
                        DZD
                      </p>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/30 transition hover:text-[#C9A227]"
            >
              <Check size={12} />
              Mark all read
            </button>

            <button
              type="button"
              onClick={onClear}
              className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/20 transition hover:text-red-300"
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationToast({
  order,
  onClose,
}: {
  order: DashboardOrder;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-5 left-5 z-[80] w-[min(92vw,370px)] overflow-hidden rounded-[20px] border border-[#C9A227]/20 bg-[#101010]/95 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="h-0.5 w-full bg-[#C9A227]" />

      <div className="flex items-start gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A227]/10 text-[#C9A227]">
          <Bell size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A227]">
              New order received
            </p>

            <button
              type="button"
              onClick={onClose}
              className="text-white/20 transition hover:text-white"
              aria-label="إغلاق التنبيه"
            >
              <X size={14} />
            </button>
          </div>

          <p className="mt-2 text-xs font-semibold text-white/80">
            طلب جديد #{order.id}
          </p>

          <p className="mt-1 text-[10px] text-white/35">
            {order.customer_name ||
              "عميل جديد"}
          </p>

          <p className="mt-2 text-[10px] font-semibold text-white/60">
            {formatDzd(
              Number(
                order.total_price ?? 0,
              ),
            )}{" "}
            DZD
          </p>

          <Link
            href={`/admin/orders/${order.id}`}
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#C9A227] transition hover:text-[#E2C76D]"
          >
            View order

            <ChevronLeft size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0A0A0A] px-5 py-10 text-[#F7F5F0] sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-[1700px]">
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/[0.07]" />

        <div className="mt-6 h-[280px] animate-pulse rounded-[30px] border border-white/[0.05] bg-[#111111]" />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-[22px] border border-white/[0.05] bg-[#111111]"
              />
            ),
          )}
        </div>

        <div className="mt-6 h-[390px] animate-pulse rounded-[24px] border border-white/[0.05] bg-[#111111]" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] =
    useState<Period>("30D");

  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [toastOrder, setToastOrder] =
    useState<DashboardOrder | null>(null);

  const latestOrderCreatedAtRef =
    useRef<string | null>(null);

  const seenOrderIdsRef =
    useRef<Set<number>>(new Set());

  const processingOrderIdsRef =
    useRef<Set<number>>(new Set());

  const loadDashboard =
    useCallback(
      async (
        selectedPeriod: Period,
        showLoading = false,
      ) => {
        try {
          if (showLoading) {
            setLoading(true);
          }

          const response = await fetch(
            `/admin/dashboard?period=${selectedPeriod}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

          const result =
            (await response.json()) as
              | DashboardData & {
                  newOrders?: DashboardOrder[];
                  error?: string;
                };

          if (!response.ok) {
            throw new Error(
              result.error ??
                "تعذر تحميل لوحة التحكم.",
            );
          }

          setData(result);
          setError(null);

          latestOrderCreatedAtRef.current =
            result.latestOrderCreatedAt;

          for (const order of result.recentOrders) {
            seenOrderIdsRef.current.add(
              order.id,
            );
          }
        } catch (loadError) {
          console.error(
            "Dashboard loading error:",
            loadError,
          );

          setError(
            loadError instanceof Error
              ? loadError.message
              : "تعذر تحميل لوحة التحكم.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadDashboard(
      period,
      true,
    );
  }, [period, loadDashboard]);

  const processIncomingOrder =
    useCallback(
      (order: DashboardOrder) => {
        if (
          seenOrderIdsRef.current.has(
            order.id,
          ) ||
          processingOrderIdsRef.current.has(
            order.id,
          )
        ) {
          return;
        }

        processingOrderIdsRef.current.add(
          order.id,
        );

        seenOrderIdsRef.current.add(
          order.id,
        );

        latestOrderCreatedAtRef.current =
          order.created_at;

        const notification: NotificationItem = {
          id: order.id,
          orderId: order.id,
          title: `طلب جديد #${order.id}`,
          description:
            order.customer_name ||
            "تم استقبال طلب جديد",
          amount: Number(
            order.total_price ?? 0,
          ),
          createdAt:
            order.created_at,
          read: false,
        };

        setNotifications(
          (current) =>
            [
              notification,
              ...current,
            ].slice(0, 12),
        );

        setToastOrder(order);

        window.setTimeout(() => {
          processingOrderIdsRef.current.delete(
            order.id,
          );
        }, 5000);

        void loadDashboard(
          period,
          false,
        );
      },
      [loadDashboard, period],
    );

  useEffect(() => {
    let mounted = true;

    const channel = supabase
      .channel("orven-admin-order-inserts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (!mounted) {
            return;
          }

          processIncomingOrder(
            payload.new as DashboardOrder,
          );
        },
      )
      .subscribe((status) => {
        console.log(
          "Orders realtime status:",
          status,
        );
      });

    return () => {
      mounted = false;

      void supabase.removeChannel(
        channel,
      );
    };
  }, [processIncomingOrder]);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (cancelled) {
        return;
      }

      try {
        const after =
          latestOrderCreatedAtRef.current;

        if (!after) {
          return;
        }

        const response = await fetch(
          `/admin/dashboard?period=${period}&after=${encodeURIComponent(after)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return;
        }

        const result =
          (await response.json()) as {
          newOrders?: DashboardOrder[];
        };

        if (
          cancelled ||
          !result.newOrders ||
          result.newOrders.length === 0
        ) {
          return;
        }

        for (const order of result.newOrders) {
          processIncomingOrder(order);
        }
      } catch (pollError) {
        console.error(
          "Dashboard notification polling error:",
          pollError,
        );
      }
    };

    const interval =
      window.setInterval(
        () => {
          void poll();
        },
        4000,
      );

    return () =>
      window.clearInterval(
        interval,
      );
  }, [period, processIncomingOrder]);

  useEffect(() => {
    if (!toastOrder) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setToastOrder(null);
      }, 7000);

    return () =>
      window.clearTimeout(timeout);
  }, [toastOrder]);

  function markNotificationRead(
    id: number,
  ) {
    setNotifications(
      (current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification,
        ),
    );
  }

  function markAllNotificationsRead() {
    setNotifications(
      (current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        })),
    );
  }

  function clearNotifications() {
    setNotifications([]);
  }

  if (loading && !data) {
    return <LoadingState />;
  }

  if (error && !data) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#0A0A0A] px-5 py-10 text-[#F7F5F0] sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[700px] rounded-[24px] border border-red-400/15 bg-[#111111] p-6">
          <p className="text-[9px] uppercase tracking-[0.2em] text-red-300">
            Dashboard error
          </p>

          <h1 className="mt-3 font-serif text-2xl">
            تعذر تحميل لوحة التحكم
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/40">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              void loadDashboard(
                period,
                true,
              )
            }
            className="mt-6 rounded-xl bg-[#C9A227] px-4 py-2.5 text-[10px] font-bold text-[#0A0A0A]"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const unreadCount =
    notifications.filter(
      (item) => !item.read,
    ).length;

  const revenueChange =
    data.metrics.revenueChange;

  const ordersChange =
    data.metrics.ordersChange;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0A0A0A] text-[#F7F5F0] selection:bg-[#C9A227]/30"
    >
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0A0A0A]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1700px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em]">
            <span className="text-white/25">
              ORVEN LUX
            </span>

            <span className="text-white/15">
              /
            </span>

            <span className="text-white/55">
              Command Atelier
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setNotificationOpen(
                    (current) =>
                      !current,
                  )
                }
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  notificationOpen
                    ? "border-[#C9A227]/30 bg-[#C9A227]/[0.06] text-[#C9A227]"
                    : "border-white/[0.07] text-white/45 hover:border-[#C9A227]/20 hover:text-[#C9A227]"
                }`}
                aria-label="Notifications"
                aria-expanded={
                  notificationOpen
                }
              >
                <Bell
                  size={16}
                  className={
                    unreadCount > 0
                      ? "animate-[pulse_2s_ease-in-out_infinite]"
                      : ""
                  }
                />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#0A0A0A] bg-[#C9A227] px-1 text-[8px] font-bold text-[#0A0A0A] shadow-[0_0_14px_rgba(201,162,39,0.35)]">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <NotificationPanel
                  notifications={
                    notifications
                  }
                  onClose={() =>
                    setNotificationOpen(
                      false,
                    )
                  }
                  onMarkRead={
                    markNotificationRead
                  }
                  onMarkAllRead={
                    markAllNotificationsRead
                  }
                  onClear={
                    clearNotifications
                  }
                />
              )}
            </div>

            <div className="hidden h-8 w-px bg-white/[0.07] sm:block" />

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-[11px] font-semibold text-white/80">
                  Othman
                </p>

                <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-white/25">
                  Administrator
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A227]/20 bg-[#C9A227]/10 text-xs font-semibold text-[#C9A227]">
                O
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1700px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <section className="relative mb-8 overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#111111]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_40%,rgba(201,162,39,0.08),transparent_30%)]" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:p-10">
            <div className="flex flex-col justify-center">
              <SectionEyebrow
                number="00"
                label="Command Center"
              />

              <div className="mt-5 max-w-2xl">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                  ORVEN LUX / PRIVATE OPERATIONS
                </p>

                <h1 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.03em] text-[#F7F5F0] sm:text-5xl lg:text-6xl">
                  Good evening,
                  <span className="block text-white/35">
                    Othman.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/40">
                  Your house at a glance. Monitor
                  real revenue, orders, inventory
                  and delivery operations from one
                  precise command surface.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <Link
                  href="/admin/products/new"
                  className="group inline-flex h-11 items-center gap-2 rounded-xl bg-[#C9A227] px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0A0A0A] transition hover:bg-[#D9BC63]"
                >
                  <Plus
                    size={15}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />

                  New timepiece
                </Link>

                <Link
                  href="/admin/orders"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60 transition hover:border-[#C9A227]/20 hover:text-white"
                >
                  Review orders

                  <ChevronLeft
                    size={14}
                  />
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <CommandWatch />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <SectionEyebrow
                number="01"
                label="Business pulse"
              />

              <h2 className="mt-2 font-serif text-2xl text-[#F7F5F0]">
                The house at a glance
              </h2>
            </div>

            <span className="hidden text-[9px] uppercase tracking-[0.18em] text-white/20 sm:block">
              Live from Supabase
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Revenue"
              value={formatCompactCurrency(
                data.metrics.revenue,
              )}
              change={`${
                revenueChange >= 0
                  ? "+"
                  : ""
              }${revenueChange.toFixed(1)}%`}
              meta="vs previous period"
              icon={CircleDollarSign}
              positive={
                revenueChange >= 0
              }
            />

            <MetricCard
              label="Orders"
              value={String(
                data.metrics.orders,
              )}
              change={`${
                ordersChange >= 0
                  ? "+"
                  : ""
              }${ordersChange.toFixed(1)}%`}
              meta="vs previous period"
              icon={ShoppingBag}
              positive={
                ordersChange >= 0
              }
            />

            <MetricCard
              label="Pending Orders"
              value={String(
                data.metrics.pendingOrders,
              )}
              change={`${data.metrics.pendingOrders} active`}
              meta="all statuses"
              icon={Clock3}
              positive
            />

            <MetricCard
              label="Collection"
              value={String(
                data.metrics.products,
              )}
              change={`${data.metrics.lowStock} low`}
              meta={`${data.metrics.soldOut} sold out`}
              icon={Package}
              positive={
                data.metrics.lowStock === 0
              }
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.8fr)]">
          <div className="overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#111111]">
            <div className="flex flex-col justify-between gap-5 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <SectionEyebrow
                  number="02"
                  label="Performance"
                />

                <div className="mt-3 flex items-end gap-3">
                  <h2 className="font-serif text-2xl text-[#F7F5F0]">
                    Revenue
                  </h2>

                  <span
                    className={`mb-1 text-[10px] font-semibold ${
                      revenueChange >= 0
                        ? "text-emerald-300"
                        : "text-red-300"
                    }`}
                  >
                    {revenueChange >= 0
                      ? "+"
                      : ""}
                    {revenueChange.toFixed(
                      1,
                    )}
                    %
                  </span>
                </div>
              </div>

              <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                {(
                  ["7D", "30D", "90D"] as Period[]
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setPeriod(item)
                    }
                    className={`rounded-lg px-3 py-1.5 text-[9px] font-semibold tracking-[0.12em] transition ${
                      period === item
                        ? "bg-[#C9A227]/10 text-[#C9A227]"
                        : "text-white/25 hover:text-white/60"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 pb-5 pt-5 sm:px-6">
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.03em] text-[#F7F5F0]">
                    {formatDzd(
                      data.metrics.revenue,
                    )}

                    <span className="mr-2 text-sm font-normal text-white/25">
                      DZD
                    </span>
                  </p>

                  <p className="mt-1 text-[9px] text-white/25">
                    Current period
                  </p>
                </div>

                <Sparkles
                  size={17}
                  className="mb-2 text-[#C9A227]/50"
                />
              </div>

              <RevenueChart
                chart={data.chart}
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/[0.07] bg-[#111111] p-5 sm:p-6">
            <SectionEyebrow
              number="03"
              label="House pulse"
            />

            <div className="mt-3 flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl text-[#F7F5F0]">
                Operational health
              </h2>

              <Truck
                size={17}
                className="text-[#C9A227]/70"
              />
            </div>

            <div className="mt-7 space-y-7">
              <PulseLine
                label="Orders fulfilled"
                value={String(
                  data.pulse.fulfillment,
                )}
                caption="Current period completion"
                percentage={
                  data.pulse.fulfillment
                }
              />

              <PulseLine
                label="Stock health"
                value={String(
                  data.pulse.stockHealth,
                )}
                caption="Collection availability"
                percentage={
                  data.pulse.stockHealth
                }
                tone="green"
              />

              <PulseLine
                label="Delivery success"
                value={String(
                  data.pulse.deliverySuccess,
                )}
                caption="Successful dispatches"
                percentage={
                  data.pulse.deliverySuccess
                }
                tone="blue"
              />
            </div>

            <div className="mt-8 border-t border-white/[0.06] pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300">
                  <Truck size={16} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-white/75">
                    Delivery operations
                  </p>

                  <p className="mt-1 text-[9px] text-white/25">
                    Dashboard data synced with Supabase
                  </p>
                </div>

                <span className="mr-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.45)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <div className="overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#111111]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
              <div>
                <SectionEyebrow
                  number="04"
                  label="Latest activity"
                />

                <h2 className="mt-3 font-serif text-2xl text-[#F7F5F0]">
                  Order activity
                </h2>
              </div>

              <Link
                href="/admin/orders"
                className="group flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/30 transition hover:text-[#C9A227]"
              >
                View all

                <ChevronLeft
                  size={13}
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
              </Link>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {data.recentOrders.length ===
              0 ? (
                <div className="px-5 py-12 text-center sm:px-6">
                  <ShoppingBag
                    size={20}
                    className="mx-auto text-white/20"
                  />

                  <p className="mt-4 text-xs font-semibold text-white/50">
                    لا توجد طلبات حتى الآن
                  </p>
                </div>
              ) : (
                data.recentOrders.map(
                  (order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="group block px-5 py-4 transition duration-300 hover:bg-white/[0.02] sm:px-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-[72px_minmax(0,1fr)_150px_110px] sm:items-center">
                        <span className="font-mono text-[10px] font-medium text-[#C9A227]/75">
                          #{order.id}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-xs font-semibold text-white/75 transition group-hover:text-white">
                              {order.customer_name ||
                                "عميل غير محدد"}
                            </p>

                            <Eye
                              size={12}
                              className="shrink-0 text-white/15 transition group-hover:text-[#C9A227]"
                            />
                          </div>

                          <p className="mt-1 truncate text-[9px] text-white/25">
                            {order.commune
                              ? `${order.commune} · `
                              : ""}
                            {order.wilaya
                              ? `Wilaya ${order.wilaya}`
                              : "الموقع غير محدد"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:block">
                          <span className="text-[11px] font-semibold text-white/70">
                            {formatDzd(
                              Number(
                                order.total_price ??
                                  0,
                              ),
                            )}{" "}
                            DZD
                          </span>

                          <span className="text-[9px] text-white/20 sm:mt-1 sm:block">
                            {formatDateTime(
                              order.created_at,
                            )}
                          </span>
                        </div>

                        <div className="flex justify-start sm:justify-end">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.08em] ${getStatusClass(
                              order.status,
                            )}`}
                          >
                            {getStatusLabel(
                              order.status,
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ),
                )
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/[0.07] bg-[#111111] p-5 sm:p-6">
            <SectionEyebrow
              number="05"
              label="Command actions"
            />

            <h2 className="mt-3 font-serif text-2xl text-[#F7F5F0]">
              Actions
            </h2>

            <div className="mt-6 space-y-2">
              <Link
                href="/admin/products/new"
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A227]/20 hover:bg-[#C9A227]/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A227]/10 text-[#C9A227]">
                    <Plus size={16} />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-white/75">
                      New timepiece
                    </p>

                    <p className="mt-1 text-[9px] text-white/25">
                      Create a new product
                    </p>
                  </div>
                </div>

                <ChevronLeft
                  size={15}
                  className="text-white/15 transition group-hover:-translate-x-0.5 group-hover:text-[#C9A227]"
                />
              </Link>

              <Link
                href="/admin/orders"
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A227]/20 hover:bg-[#C9A227]/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-white/45">
                    <ShoppingBag size={16} />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-white/75">
                      Review orders
                    </p>

                    <p className="mt-1 text-[9px] text-white/25">
                      {data.metrics.pendingOrders}{" "}
                      orders need attention
                    </p>
                  </div>
                </div>

                <ChevronLeft
                  size={15}
                  className="text-white/15 transition group-hover:-translate-x-0.5 group-hover:text-[#C9A227]"
                />
              </Link>

              <Link
                href="/admin/products"
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A227]/20 hover:bg-[#C9A227]/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] text-white/45">
                    <Package size={16} />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-white/75">
                      Manage collection
                    </p>

                    <p className="mt-1 text-[9px] text-white/25">
                      {data.metrics.lowStock}{" "}
                      low-stock pieces
                    </p>
                  </div>
                </div>

                <ChevronLeft
                  size={15}
                  className="text-white/15 transition group-hover:-translate-x-0.5 group-hover:text-[#C9A227]"
                />
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-[#C9A227]/10 bg-[#C9A227]/[0.03] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C9A227] shadow-[0_0_10px_rgba(201,162,39,0.45)]" />

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#C9A227]">
                    Inventory signal
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-white/30">
                    {data.metrics.lowStock}{" "}
                    products are at or near the
                    low-stock threshold.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[24px] border border-white/[0.07] bg-[#111111] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionEyebrow
                number="06"
                label="Collection spotlight"
              />

              <h2 className="mt-3 font-serif text-2xl text-[#F7F5F0]">
                Timepieces in focus
              </h2>

              <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/25">
                A live glimpse of the collection
                connected directly to your product
                inventory.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="group inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/30 transition hover:text-[#C9A227]"
            >
              Open collection

              <ChevronLeft
                size={13}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {data.collection
              .slice(0, 3)
              .map(
                (
                  product,
                  index,
                ) => (
                  <Link
                    key={String(
                      product.id,
                    )}
                    href={`/admin/products/${product.id}`}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]/20"
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#C9A227]/[0.04] blur-3xl transition group-hover:bg-[#C9A227]/[0.08]" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-[8px] uppercase tracking-[0.18em] text-[#C9A227]/65">
                          PIECE 0
                          {index + 1}
                        </span>

                        <h3 className="mt-3 truncate font-serif text-xl text-white/80">
                          {product.name ||
                            "Untitled timepiece"}
                        </h3>

                        <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-white/20">
                          {formatCompactCurrency(
                            Number(
                              product.price ??
                                0,
                            ),
                          )}
                        </p>
                      </div>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] text-white/20 transition group-hover:border-[#C9A227]/20 group-hover:text-[#C9A227]">
                        {index + 1}
                      </div>
                    </div>

                    <div className="relative mt-7 flex items-center justify-between border-t border-white/[0.05] pt-4">
                      <span className="text-[8px] uppercase tracking-[0.15em] text-white/20">
                        {product.stock ?? 0}{" "}
                        in stock
                      </span>

                      <ChevronLeft
                        size={13}
                        className="text-white/15 transition group-hover:-translate-x-0.5 group-hover:text-[#C9A227]"
                      />
                    </div>
                  </Link>
                ),
              )}
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] py-6 text-[8px] uppercase tracking-[0.16em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
          <span>
            ORVEN LUX — Command Atelier
          </span>

          <span>
            Live operational intelligence
          </span>
        </footer>
      </main>

      {toastOrder && (
        <NotificationToast
          order={toastOrder}
          onClose={() =>
            setToastOrder(null)
          }
        />
      )}
    </div>
  );
}