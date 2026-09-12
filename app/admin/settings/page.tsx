import Link from "next/link";
import {
  Globe,
  CreditCard,
  Truck,
  Store,
  Database,
  Shield,
} from "lucide-react";

const cards = [
  {
    title: "بيانات المتجر",
    icon: Store,
    href: "/admin/settings/store",
  },
  {
    title: "الشحن",
    icon: Truck,
    href: "/admin/settings/shipping",
  },
  {
    title: "طرق الدفع",
    icon: CreditCard,
    href: "/admin/settings/payment",
  },
  {
    title: "Supabase",
    icon: Database,
    href: "/admin/settings/database",
  },
  {
    title: "الأمان",
    icon: Shield,
    href: "/admin/settings/security",
  },
  {
    title: "إعدادات عامة",
    icon: Globe,
    href: "/admin/settings/general",
  },
];

export default function SettingsPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen space-y-8 bg-[#F3F0E8] px-4 py-6 text-[#111111] sm:px-6 lg:px-8"
    >
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-[#C9A227]/20 bg-white/90 p-8 shadow-xl backdrop-blur">
        <div className="absolute inset-y-0 right-0 w-1.5 bg-[#C9A227]" />

        <p className="text-xs font-black tracking-[0.28em] text-[#9A7718]">
          ORVEN LUX ADMIN
        </p>

        <h1 className="mt-3 text-4xl font-black">
          الإعدادات
        </h1>

        <p className="mt-3 max-w-2xl text-stone-500">
          إدارة إعدادات المتجر بالكامل من مكان واحد.
        </p>
      </section>

      {/* Cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, icon: Icon, href }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227]/40 hover:shadow-xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111111] text-[#C9A227] transition-transform duration-300 group-hover:scale-110">
              <Icon size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-black">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-7 text-stone-500">
              اضغط للدخول إلى هذا القسم وإدارة إعداداته.
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}