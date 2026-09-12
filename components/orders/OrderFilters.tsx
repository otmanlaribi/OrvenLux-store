"use client";

import {
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  wilaya: string;
  setWilaya: (value: string) => void;

  wilayas: number[];

  totalOrders: number;

  reload: () => void;

  clearFilters: () => void;
};

export default function OrderFilters({
  search,
  setSearch,
  status,
  setStatus,
  wilaya,
  setWilaya,
  wilayas,
  totalOrders,
  reload,
  clearFilters,
}: Props) {
  const hasFilters =
    search.trim() !== "" ||
    status !== "" ||
    wilaya !== "";

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden rounded-3xl border border-[#C9A227]/25 bg-white shadow-sm"
    >
      {/* الخط الذهبي العلوي */}
      <div className="h-1 w-full bg-gradient-to-l from-[#111111] via-[#C9A227] to-[#111111]" />

      <div className="p-5 sm:p-6">
        {/* عنوان منطقة الفلاتر */}
        <div className="mb-6 flex flex-col gap-4 border-b border-stone-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-[#C9A227] shadow-sm">
              <SlidersHorizontal size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#C9A227]" />

                <span className="text-[10px] font-black tracking-[0.22em] text-[#9A7718]">
                  ORVEN LUX
                </span>
              </div>

              <h2 className="mt-1 text-base font-black text-[#111111]">
                البحث وتصفية الطلبات
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                ابحث بسرعة وحدد النتائج التي تريد عرضها.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-[#C9A227]/25 bg-[#F7F5F0] px-4 py-3">
            <div className="flex h-8 min-w-8 items-center justify-center rounded-xl bg-[#111111] px-2 text-sm font-black text-[#C9A227]">
              {totalOrders}
            </div>

            <div>
              <p className="text-[10px] font-bold text-stone-400">
                عدد النتائج
              </p>

              <p className="text-xs font-black text-[#111111]">
                طلبًا مطابقًا
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* حقول البحث والفلاتر */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* البحث */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-black text-[#111111]">
                <Search
                  size={15}
                  className="text-[#9A7718]"
                />

                البحث
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9A7718]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="الاسم، الهاتف، رقم الطلب أو التتبع"
                  className="w-full rounded-2xl border border-stone-200 bg-[#FDFCF9] py-3.5 pr-11 pl-4 text-sm text-[#111111] outline-none transition duration-200 placeholder:text-stone-400 hover:border-[#C9A227]/50 focus:border-[#C9A227] focus:bg-white focus:ring-4 focus:ring-[#C9A227]/10"
                />
              </div>
            </div>

            {/* حالة الطلب */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-black text-[#111111]">
                <Filter
                  size={15}
                  className="text-[#9A7718]"
                />

                حالة الطلب
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full cursor-pointer rounded-2xl border border-stone-200 bg-[#FDFCF9] px-4 py-3.5 text-sm font-medium text-[#111111] outline-none transition duration-200 hover:border-[#C9A227]/50 focus:border-[#C9A227] focus:bg-white focus:ring-4 focus:ring-[#C9A227]/10"
              >
                <option value="">
                  جميع الحالات
                </option>

                <option value="جديد">
                  جديد
                </option>

                <option value="تم الشحن">
                  تم الشحن
                </option>

                <option value="تم التسليم">
                  تم التسليم
                </option>

                <option value="ملغي">
                  ملغي
                </option>
              </select>
            </div>

            {/* الولاية */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-black text-[#111111]">
                <Filter
                  size={15}
                  className="text-[#9A7718]"
                />

                الولاية
              </label>

              <select
                value={wilaya}
                onChange={(event) =>
                  setWilaya(event.target.value)
                }
                className="w-full cursor-pointer rounded-2xl border border-stone-200 bg-[#FDFCF9] px-4 py-3.5 text-sm font-medium text-[#111111] outline-none transition duration-200 hover:border-[#C9A227]/50 focus:border-[#C9A227] focus:bg-white focus:ring-4 focus:ring-[#C9A227]/10"
              >
                <option value="">
                  جميع الولايات
                </option>

                {wilayas.map((code) => (
                  <option
                    key={code}
                    value={String(code)}
                  >
                    الولاية رقم {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs leading-6 text-stone-500">
              <Filter
                size={14}
                className="shrink-0 text-[#9A7718]"
              />

              استخدم البحث أو الفلاتر للوصول إلى الطلب المطلوب بسرعة.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9A227]/40 bg-white px-4 py-3 text-sm font-black text-[#111111] transition duration-200 hover:bg-[#F7F5F0] hover:border-[#C9A227]"
                >
                  <X size={17} />

                  مسح الفلاتر
                </button>
              )}

              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-black text-white shadow-sm transition duration-200 hover:bg-[#2A2A2A] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#C9A227]/20"
              >
                <RefreshCw
                  size={17}
                  className="text-[#C9A227]"
                />

                تحديث النتائج
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}