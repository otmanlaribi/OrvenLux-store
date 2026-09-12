import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  Settings,
  PackagePlus,
  ArrowLeft,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const actions = [
  {
    title: "المنتجات",
    description: "إدارة جميع منتجات المتجر",
    href: "/admin/products",
    icon: Package,
    iconClass:
      "bg-[#111111] text-[#C9A227]",
  },
  {
    title: "الطلبات",
    description: "متابعة طلبات العملاء",
    href: "/admin/orders",
    icon: ShoppingCart,
    iconClass:
      "bg-[#C9A227]/15 text-[#9A7718]",
  },
  {
    title: "العملاء",
    description: "عرض وإدارة العملاء",
    href: "/admin/customers",
    icon: Users,
    iconClass:
      "bg-sky-100 text-sky-700",
  },
  {
    title: "الإعدادات",
    description: "إعدادات النظام",
    href: "/admin/settings",
    icon: Settings,
    iconClass:
      "bg-stone-200 text-stone-700",
  },
  {
    title: "إضافة منتج",
    description: "إنشاء منتج جديد",
    href: "/admin/products/new",
    icon: PackagePlus,
    iconClass:
      "bg-emerald-100 text-emerald-700",
  },
];

export default function DashboardQuickActions() {
  return (
    <section
      dir="rtl"
      className="space-y-5"
    >
      {/* العنوان */}
      <div>
        <p className="text-xs font-black tracking-[0.25em] text-[#9A7718]">
          QUICK ACTIONS
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#111111]">
          الوصول السريع
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          اختصارات للوصول إلى أهم أقسام لوحة التحكم.
        </p>
      </div>

      {/* البطاقات */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group block h-full outline-none"
            >
              <Card
                className="
                  relative h-full overflow-hidden rounded-3xl
                  border-[#E8DDC7]
                  bg-[#FCFBF8]
                  shadow-md
                  transition-all duration-300
                  group-hover:-translate-y-1
                  group-hover:border-[#C9A227]/60
                  group-hover:shadow-xl
                  group-focus-visible:ring-2
                  group-focus-visible:ring-[#C9A227]
                  group-focus-visible:ring-offset-2
                "
              >
                {/* الشريط الذهبي */}
                <div
                  className="
                    absolute inset-x-0 top-0 h-1
                    bg-[#C9A227]
                    opacity-0
                    transition-opacity duration-300
                    group-hover:opacity-100
                  "
                />

                {/* الزخرفة */}
                <div
                  className="
                    pointer-events-none
                    absolute -left-10 -top-10
                    h-28 w-28
                    rounded-full
                    bg-[#C9A227]/10
                    opacity-0
                    blur-3xl
                    transition-opacity duration-300
                    group-hover:opacity-100
                  "
                />

                <CardContent className="relative flex h-full flex-col p-6">
                  {/* الأيقونة */}
                  <div
                    className={`
                      flex h-14 w-14
                      items-center justify-center
                      rounded-2xl
                      shadow-sm
                      transition-all duration-300
                      group-hover:scale-110
                      group-hover:rotate-3
                      ${action.iconClass}
                    `}
                  >
                    <Icon
                      size={26}
                      strokeWidth={2}
                    />
                  </div>

                  {/* العنوان */}
                  <h3 className="mt-5 text-lg font-black text-[#111111]">
                    {action.title}
                  </h3>

                  {/* الوصف */}
                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    {action.description}
                  </p>

                  {/* رابط الدخول */}
                  <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-[#9A7718]">
                    <span>الدخول</span>

                    <ArrowLeft
                      size={16}
                      strokeWidth={2.5}
                      className="
                        transition-transform duration-300
                        group-hover:-translate-x-1
                      "
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}