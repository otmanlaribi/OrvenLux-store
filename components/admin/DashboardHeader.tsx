import Link from "next/link";
import { PackagePlus } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function DashboardHeader() {
  return (
    <Card
      dir="rtl"
      className="
        relative overflow-hidden
        rounded-3xl
        border-[#C9A227]/25
        bg-white
        shadow-sm
        transition-all duration-300
        hover:border-[#C9A227]/40
        hover:shadow-md
      "
    >
      {/* Luxury gold accent */}
      <div
        aria-hidden="true"
        className="
          absolute inset-y-0 right-0
          w-1.5
          bg-[#C9A227]
        "
      />

      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-16 -top-16
          h-44 w-44
          rounded-full
          bg-[#C9A227]/10
          blur-3xl
        "
      />

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          {/* Header content */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[#C9A227]"
              />

              <span className="text-xs font-black tracking-[0.25em] text-[#9A7718]">
                ORVEN LUX ADMIN
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#111111] sm:text-4xl">
              لوحة التحكم
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
              مرحبًا بك في لوحة إدارة متجر ORVEN LUX.
              يمكنك متابعة الطلبات والمبيعات والمنتجات من
              مكان واحد.
            </p>
          </div>

          {/* Primary action */}
          <Link
            href="/admin/products/new"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#111111]
              px-5
              py-3
              text-sm
              font-black
              text-white
              shadow-sm
              transition-all duration-300
              hover:-translate-y-0.5
              hover:bg-[#252525]
              hover:shadow-lg
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C9A227]
              focus-visible:ring-offset-2
            "
          >
            <PackagePlus
              size={20}
              strokeWidth={2}
            />

            إضافة منتج جديد
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}