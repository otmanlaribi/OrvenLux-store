import Link from "next/link";
import {
  ArrowRight,
  PackagePlus,
} from "lucide-react";

import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen space-y-8 bg-[#F7F5F0] px-4 py-6 text-[#111111] sm:px-6 lg:px-8"
    >
      {/* رأس الصفحة */}
      <section className="relative overflow-hidden rounded-3xl border border-[#C9A227]/25 bg-[#111111] px-6 py-8 text-white shadow-lg sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1.5 bg-[#C9A227]" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#C9A227] transition hover:text-white"
            >
              <ArrowRight size={17} />

              العودة إلى المنتجات
            </Link>

            <div className="mt-6 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C9A227] text-[#111111]">
                <PackagePlus size={27} />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#C9A227]" />

                  <span className="text-[10px] font-black tracking-[0.22em] text-[#C9A227]">
                    PRODUCT MANAGEMENT
                  </span>
                </div>

                <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                  إضافة منتج جديد
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
                  أضف بيانات المنتج، السعر، المخزون،
                  الصورة وحالة العرض في المتجر.
                </p>
              </div>
            </div>
          </div>

          <div className="w-fit rounded-2xl border border-[#C9A227]/30 bg-white/5 px-5 py-4">
            <p className="text-xs font-bold text-stone-400">
              ORVEN LUX
            </p>

            <p className="mt-1 text-sm font-black text-[#C9A227]">
              منتج جديد
            </p>
          </div>
        </div>
      </section>

      {/* نموذج المنتج */}
      <ProductForm />
    </div>
  );
}