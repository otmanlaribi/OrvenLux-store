import {
  AlertTriangle,
  CheckCircle2,
  Package,
  XCircle,
} from "lucide-react";

type ProductsStatsProps = {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
};

type StatCard = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  value: number;
  Icon: typeof Package;
  accent: string;
  accentSoft: string;
  signal: string;
};

export default function ProductsStats({
  totalProducts,
  activeProducts,
  lowStockProducts,
  outOfStockProducts,
}: ProductsStatsProps) {
  const cards: StatCard[] = [
    {
      key: "total",
      eyebrow: "ARCHIVE",
      title: "إجمالي القطع",
      description: "كامل القطع المسجلة في مجموعة ORVEN LUX.",
      value: totalProducts,
      Icon: Package,
      accent: "text-[#C9A227]",
      accentSoft: "bg-[#C9A227]/10",
      signal: "TOTAL COLLECTION",
    },
    {
      key: "active",
      eyebrow: "LIVE",
      title: "المنتجات النشطة",
      description: "القطع الظاهرة حاليًا داخل المتجر.",
      value: activeProducts,
      Icon: CheckCircle2,
      accent: "text-emerald-400",
      accentSoft: "bg-emerald-400/10",
      signal: "VISIBLE IN STORE",
    },
    {
      key: "low-stock",
      eyebrow: "ATTENTION",
      title: "مخزون منخفض",
      description: "قطع تحتاج إلى متابعة قبل نفادها.",
      value: lowStockProducts,
      Icon: AlertTriangle,
      accent: "text-[#D6A62A]",
      accentSoft: "bg-[#D6A62A]/10",
      signal: "REQUIRES CARE",
    },
    {
      key: "out-of-stock",
      eyebrow: "OFFLINE",
      title: "نفد المخزون",
      description: "قطع غير متاحة حاليًا بسبب المخزون.",
      value: outOfStockProducts,
      Icon: XCircle,
      accent: "text-red-300",
      accentSoft: "bg-red-400/10",
      signal: "CURRENTLY OFF",
    },
  ];

  return (
    <section dir="rtl" className="relative">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.Icon;

          return (
            <article
              key={card.key}
              className="
                group
                relative
                min-h-[194px]
                overflow-hidden
                rounded-[28px]
                border
                border-[#2A2925]
                bg-[#11110F]
                p-5
                shadow-[0_16px_45px_rgba(20,18,14,0.10)]
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-[#C9A227]/25
                hover:shadow-[0_22px_55px_rgba(20,18,14,0.16)]
              "
            >
              {/* Ambient spotlight */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-32
                  w-32
                  rounded-full
                  bg-[#C9A227]/[0.07]
                  blur-3xl
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />

              {/* Bottom signal line */}
              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-0
                  left-5
                  right-5
                  h-px
                  overflow-hidden
                  bg-[#282722]
                "
              >
                <div
                  className={`
                    h-full
                    w-1/3
                    opacity-70
                    transition-all
                    duration-500
                    group-hover:w-2/3
                    ${card.accent.replace("text-", "bg-")}
                  `}
                />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-[#68655E]">
                      {card.eyebrow}
                    </span>

                    <h3 className="mt-2 text-[15px] font-bold text-[#DDD8CF]">
                      {card.title}
                    </h3>
                  </div>

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-white/[0.05]
                      ${card.accentSoft}
                      ${card.accent}
                      transition-all
                      duration-300
                      group-hover:scale-105
                    `}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Middle */}
                <div className="mt-7 flex items-end justify-between gap-4">
                  <div>
                    <div
                      className="
                        font-serif
                        text-5xl
                        font-medium
                        leading-none
                        tracking-[-0.05em]
                        text-[#F7F5F0]
                        transition-transform
                        duration-500
                        group-hover:-translate-y-0.5
                      "
                    >
                      {String(card.value).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="pb-1 text-left">
                    <span
                      className={`
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        ${card.accent}
                      `}
                    >
                      {card.signal}
                    </span>
                  </div>
                </div>

                {/* Bottom */}
                <div className="mt-5">
                  <p className="max-w-[250px] text-xs leading-5 text-[#706C64]">
                    {card.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}