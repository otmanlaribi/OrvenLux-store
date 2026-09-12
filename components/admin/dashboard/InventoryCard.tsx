import Link from "next/link";
import {
  CircleCheck,
  CircleX,
  Package,
  Pencil,
  TriangleAlert,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

type Product = {
  id: number | string;
  name: string;
  stock: number;
};

type InventoryCardProps = {
  products: Product[];
  lowStock: number;
};

export default function InventoryCard({
  products,
  lowStock,
}: InventoryCardProps) {
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
          absolute -bottom-16 -right-16
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
                INVENTORY
              </span>
            </div>

            <h2 className="text-4xl font-black tracking-tight text-[#111111]">
              {lowStock}
            </h2>

            <p className="mt-3 text-sm leading-7 text-stone-500">
              المنتجات التي تحتاج إلى متابعة أو إعادة تزويد.
            </p>
          </div>

          {/* Inventory icon */}
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
              sm:h-16 sm:w-16
            "
          >
            <Package
              size={28}
              strokeWidth={2}
              className="sm:h-[30px] sm:w-[30px]"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative p-6 pt-7 sm:p-7">
        {products.length === 0 ? (
          <div
            className="
              rounded-3xl
              border border-dashed
              border-[#D8CCB7]
              bg-[#F9F7F2]
              px-5 py-16
              text-center
            "
          >
            <Package
              size={42}
              strokeWidth={1.8}
              className="mx-auto text-[#C9A227]"
            />

            <h3 className="mt-4 text-lg font-black text-[#111111]">
              لا توجد منتجات
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              ستظهر المنتجات هنا بعد إضافتها.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const maxStock = 20;

              const percentage = Math.min(
                100,
                (product.stock / maxStock) * 100
              );

              const out = product.stock <= 0;

              const low =
                product.stock > 0 &&
                product.stock <= 5;

              return (
                <div
                  key={product.id}
                  className="
                    rounded-2xl
                    border border-[#ECE3D3]
                    bg-white
                    p-5
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-[#C9A227]/50
                    hover:shadow-lg
                  "
                >
                  {/* Product header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-[#111111]">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-stone-500">
                        حالة المخزون الحالية
                      </p>
                    </div>

                    <Link
                      href={`/admin/products/${product.id}`}
                      className="
                        inline-flex shrink-0
                        items-center gap-2
                        rounded-xl
                        border border-[#E8DDC7]
                        bg-white
                        px-3 py-2
                        text-xs font-black
                        text-[#111111]
                        transition
                        hover:border-[#C9A227]
                        hover:bg-[#F7F5F0]
                        sm:px-4 sm:text-sm
                      "
                    >
                      <Pencil size={14} />

                      تعديل
                    </Link>
                  </div>

                  {/* Status */}
                  <div className="mt-5">
                    {out ? (
                      <Badge
                        variant="destructive"
                        className="
                          gap-2
                          rounded-full
                          border-red-200
                          bg-red-50
                          px-3 py-1
                          text-xs font-black
                          text-red-600
                          hover:bg-red-50
                        "
                      >
                        <CircleX size={14} />

                        نفد المخزون
                      </Badge>
                    ) : low ? (
                      <Badge
                        className="
                          gap-2
                          rounded-full
                          border-amber-200
                          bg-amber-50
                          px-3 py-1
                          text-xs font-black
                          text-amber-700
                          hover:bg-amber-50
                        "
                      >
                        <TriangleAlert size={14} />

                        مخزون منخفض
                      </Badge>
                    ) : (
                      <Badge
                        className="
                          gap-2
                          rounded-full
                          border-emerald-200
                          bg-emerald-50
                          px-3 py-1
                          text-xs font-black
                          text-emerald-700
                          hover:bg-emerald-50
                        "
                      >
                        <CircleCheck size={14} />

                        متوفر
                      </Badge>
                    )}
                  </div>

                  {/* Stock progress */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-stone-500">
                        {product.stock} قطعة
                      </span>

                      <span className="text-sm font-black text-[#111111]">
                        {Math.round(percentage)}%
                      </span>
                    </div>

                    <div
                      className="h-2 overflow-hidden rounded-full bg-stone-200"
                      aria-label={`مستوى مخزون ${product.name}`}
                    >
                      <div
                        className={`
                          h-full rounded-full
                          transition-all duration-700
                          ${
                            out
                              ? "bg-red-500"
                              : low
                              ? "bg-amber-500"
                              : "bg-[#C9A227]"
                          }
                        `}
                        style={{
                          width: `${Math.max(
                            5,
                            percentage
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}