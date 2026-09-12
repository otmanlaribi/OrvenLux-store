import Link from "next/link";
import {
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import ProductsStats from "@/components/products/ProductsStats";
import ProductsTable from "@/components/products/ProductsTable";
import ProductsToolbar from "@/components/products/ProductsToolbar";
import { getProductsPaginated } from "@/lib/services/products";

type Props = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const rawPage = Number(params.page ?? "1");

  const page =
    Number.isSafeInteger(rawPage) &&
    rawPage > 0
      ? rawPage
      : 1;

  const rawPageSize = Number(
    params.pageSize ?? "50",
  );

  const pageSize =
    Number.isSafeInteger(rawPageSize) &&
    rawPageSize > 0
      ? Math.min(rawPageSize, 100)
      : 50;

  const search =
    params.search?.trim() ?? "";

  const sort =
    params.sort ?? "newest";

  const {
    products,
    hasMore,
  } = await getProductsPaginated({
    page: page - 1,
    pageSize,
    search,
    sort,
  });

  const totalProducts =
    products.length;

  const activeProducts =
    products.filter(
      (product) =>
        Boolean(product.active),
    ).length;

  const lowStockProducts =
    products.filter(
      (product) => {
        const stock = Number(
          product.stock ?? 0,
        );

        return (
          stock > 0 &&
          stock <= 5
        );
      },
    ).length;

  const outOfStockProducts =
    products.filter(
      (product) =>
        Number(product.stock ?? 0) <= 0,
    ).length;

  const inactiveProducts =
    totalProducts -
    activeProducts;

  const query =
    new URLSearchParams();

  query.set(
    "pageSize",
    String(pageSize),
  );

  if (search) {
    query.set(
      "search",
      search,
    );
  }

  if (sort) {
    query.set(
      "sort",
      sort,
    );
  }

  const queryString =
    query.toString();

  const previousPageHref =
    page > 1
      ? `/admin/products?page=${
          page - 1
        }&${queryString}`
      : null;

  const nextPageHref = hasMore
    ? `/admin/products?page=${
        page + 1
      }&${queryString}`
    : null;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden bg-[#E9E3D8] text-[#171615]"
    >
      {/* Ambient luxury atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 top-[34rem] h-[34rem] w-[34rem] rounded-full bg-[#C9A227]/[0.07] blur-[120px] animate-pulse" />
        <div className="absolute -left-48 top-[68rem] h-[30rem] w-[30rem] rounded-full bg-[#8B7A5B]/[0.06] blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(70,61,48,0.12)_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <header className="relative overflow-hidden bg-[#0A0A0A] text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C9A227]/10 blur-[110px]" />

        <div className="pointer-events-none absolute left-[20%] top-[55%] h-72 w-72 rounded-full bg-white/[0.02] blur-[110px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(rgba(255,255,255,0.9)_0.6px,transparent_0.6px)] [background-size:6px_6px]" />

        <div className="relative mx-auto max-w-[1700px] px-4 pb-8 pt-7 sm:px-7 sm:pb-10 sm:pt-9 lg:px-10 lg:pb-12">
          {/* Eyebrow */}

          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-px w-8 bg-[#C9A227]" />

              <span className="text-[8px] font-black tracking-[0.3em] text-[#C9A227] sm:text-[9px]">
                ORVEN LUX
              </span>

              <span className="hidden text-[8px] tracking-[0.2em] text-white/25 sm:block">
                / PRODUCT ATELIER
              </span>
            </div>

            <span className="text-[7px] font-black tracking-[0.16em] text-white/25 sm:text-[8px]">
              COLLECTION · 01
            </span>
          </div>

          {/* Hero content */}

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Sparkles
                  size={14}
                  strokeWidth={1.4}
                  className="text-[#C9A227]"
                />

                <span className="text-[8px] font-black tracking-[0.2em] text-white/35">
                  CURATED TIMEPIECES
                </span>
              </div>

              <h1 className="max-w-5xl font-serif text-[clamp(2.8rem,6vw,6rem)] leading-[0.88] tracking-[-0.06em] text-[#F7F5F0]">
                The collection
                <span className="block text-white/25">
                  deserves precision.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[11px] leading-7 text-white/40 sm:text-sm">
                تحكم في مجموعة ORVEN LUX من
                مكان واحد، مع رؤية واضحة للقطع
                والمخزون والحالة والقيمة.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/admin/products/new"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#C9A227] px-5 text-[9px] font-black tracking-[0.15em] text-[#0A0A0A] transition duration-300 hover:bg-[#D7B94E] hover:shadow-[0_14px_45px_rgba(201,162,39,0.2)]"
                >
                  <Plus
                    size={16}
                    strokeWidth={2.4}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />

                  NEW TIMEPIECE

                  <ArrowUpLeft
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                <div className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-5 text-[8px] font-black tracking-[0.14em] text-white/40">
                  {totalProducts} PIECES IN VIEW
                </div>
              </div>
            </div>

            {/* Edition panel */}

            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-7">
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#C9A227]/10 blur-3xl" />

                <div className="relative">
                  <p className="text-[8px] font-black tracking-[0.2em] text-white/25">
                    EDITION STATUS
                  </p>

                  <div className="mt-5 flex items-end gap-3">
                    <span className="font-serif text-6xl leading-none tracking-[-0.06em] text-[#C9A227]">
                      {String(
                        totalProducts,
                      ).padStart(2, "0")}
                    </span>

                    <span className="mb-1 text-[8px] font-black tracking-[0.18em] text-white/30">
                      PIECES
                    </span>
                  </div>

                  <div className="mt-6 h-px bg-white/10">
                    <div
                      className="h-px bg-[#C9A227] transition-all duration-500"
                      style={{
                        width:
                          totalProducts > 0
                            ? `${Math.min(
                                100,
                                Math.max(
                                  10,
                                  (activeProducts /
                                    totalProducts) *
                                    100,
                                ),
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[8px] font-black tracking-[0.12em] text-white/25">
                      LIVE COLLECTION
                    </span>

                    <span className="text-[8px] font-black text-emerald-400">
                      {activeProducts} ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meta */}

          <div className="mt-10 grid grid-cols-2 border-t border-white/[0.07] pt-5 sm:grid-cols-4">
            <div className="border-l border-white/[0.06] px-3 first:pr-0 sm:px-6">
              <p className="text-[7px] font-black tracking-[0.16em] text-white/25">
                TOTAL
              </p>

              <p className="mt-2 text-lg font-black text-white/85">
                {totalProducts}
              </p>
            </div>

            <div className="border-l border-white/[0.06] px-3 sm:px-6">
              <p className="text-[7px] font-black tracking-[0.16em] text-white/25">
                LIVE
              </p>

              <p className="mt-2 text-lg font-black text-emerald-400">
                {activeProducts}
              </p>
            </div>

            <div className="border-l border-white/[0.06] px-3 sm:px-6">
              <p className="text-[7px] font-black tracking-[0.16em] text-white/25">
                LOW STOCK
              </p>

              <p className="mt-2 text-lg font-black text-[#C9A227]">
                {lowStockProducts}
              </p>
            </div>

            <div className="px-3 sm:px-6">
              <p className="text-[7px] font-black tracking-[0.16em] text-white/25">
                SOLD OUT
              </p>

              <p className="mt-2 text-lg font-black text-white/55">
                {outOfStockProducts}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative z-10 mx-auto max-w-[1700px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-11">
        {/* =====================================================
            HEALTH
        ===================================================== */}

        <section className="mb-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black tracking-[0.22em] text-[#9A7718]">
                  01
                </span>

                <span className="h-px w-5 bg-[#C9A227]" />

                <span className="text-[8px] font-black tracking-[0.18em] text-stone-400">
                  COLLECTION HEALTH
                </span>
              </div>

              <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#24211D] sm:text-3xl">
                حالة المجموعة
              </h2>

              <p className="mt-1 text-[10px] text-stone-400 sm:text-xs">
                نظرة سريعة على توفر القطع وحالة
                المخزون.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-[8px] font-black tracking-[0.14em] text-stone-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              LIVE INVENTORY
            </div>
          </div>

          <div className="[&>div]:rounded-[1.5rem] [&>div]:border-stone-200 [&>div]:bg-[#F4F0E8] [&>div]:shadow-[0_18px_55px_rgba(54,46,35,0.07)]">
            <ProductsStats
              totalProducts={
                totalProducts
              }
              activeProducts={
                activeProducts
              }
              lowStockProducts={
                lowStockProducts
              }
              outOfStockProducts={
                outOfStockProducts
              }
            />
          </div>
        </section>

        {/* =====================================================
            CONTROLS
        ===================================================== */}

        <section className="mb-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black tracking-[0.22em] text-[#9A7718]">
                  02
                </span>

                <span className="h-px w-5 bg-[#C9A227]" />

                <span className="text-[8px] font-black tracking-[0.18em] text-stone-400">
                  COLLECTION SEARCH
                </span>
              </div>

              <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#24211D] sm:text-3xl">
                ابحث في القطع
              </h2>

              <p className="mt-1 text-[10px] leading-6 text-stone-400 sm:text-xs">
                ابحث ورتّب المنتجات للوصول إلى
                القطعة المطلوبة بسرعة.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-[8px] font-black tracking-[0.14em] text-stone-300 sm:flex">
              <Search size={13} />
              SEARCH / SORT
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.6rem] border border-[#D9D1C3] bg-[#F4F0E8] p-2 shadow-[0_18px_60px_rgba(54,46,35,0.07)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.05),transparent_28%)]" />

            <div className="relative">
              <ProductsToolbar
                totalProducts={
                  totalProducts
                }
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT EDIT
        ===================================================== */}

        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black tracking-[0.22em] text-[#9A7718]">
                  03
                </span>

                <span className="h-px w-5 bg-[#C9A227]" />

                <span className="text-[8px] font-black tracking-[0.18em] text-stone-400">
                  THE COLLECTION
                </span>
              </div>

              <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#24211D] sm:text-3xl">
                قطع ORVEN LUX
              </h2>

              <p className="mt-1 text-[10px] text-stone-400 sm:text-xs">
                {search
                  ? `نتائج البحث عن "${search}"`
                  : inactiveProducts > 0
                    ? `${inactiveProducts} قطعة غير نشطة في الصفحة الحالية`
                    : "المجموعة الحالية جاهزة للإدارة"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-[8px] font-black tracking-[0.1em] text-stone-400">
                PAGE {page}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/[0.06] px-3 py-2 text-[8px] font-black tracking-[0.1em] text-[#9A7718]">
                {totalProducts} PIECES
              </div>
            </div>
          </div>

          <ProductsTable
            products={products}
          />
        </section>

        {/* =====================================================
            PAGINATION — LUXURY NAVIGATION CONSOLE
        ===================================================== */}

        <section className="mt-8">
          <div
            className="
              group/pagination
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-[#D2C8B8]
              bg-[#161613]
              p-[1px]
              shadow-[0_24px_80px_rgba(34,29,21,0.12)]
              [perspective:1400px]
            "
          >
            {/* Outer gold atmosphere */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-[#C9A227]/[0.09]
                blur-[90px]
                transition-all
                duration-700
                group-hover/pagination:scale-125
                group-hover/pagination:bg-[#C9A227]/[0.13]
              "
            />

            {/* Secondary atmosphere */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -bottom-28
                -left-24
                h-64
                w-64
                rounded-full
                bg-white/[0.025]
                blur-[80px]
                transition-transform
                duration-700
                group-hover/pagination:translate-x-6
                group-hover/pagination:-translate-y-4
              "
            />

            {/* Fine texture */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-30
                [background-image:radial-gradient(rgba(255,255,255,0.12)_0.5px,transparent_0.5px)]
                [background-size:13px_13px]
              "
            />

            <div
              className="
                relative
                overflow-hidden
                rounded-[1.95rem]
                border
                border-white/[0.055]
                bg-[#11110F]
                px-4
                py-5
                sm:px-6
                sm:py-6
              "
            >
              {/* Top rail */}
              <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/[0.07]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.65)]" />
                  </div>

                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.24em] text-[#C9A227]">
                      COLLECTION NAVIGATION
                    </p>

                    <p className="mt-1 text-[9px] text-white/30">
                      تنقّل بين صفحات المجموعة بدقة.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 sm:self-auto">
                  <span className="text-[8px] font-black tracking-[0.18em] text-white/25">
                    PAGE
                  </span>

                  <span className="font-serif text-sm leading-none text-[#C9A227]">
                    {String(page).padStart(2, "0")}
                  </span>

                  <span className="text-[8px] text-white/15">
                    / {hasMore ? "∞" : String(page).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Navigation console */}
              <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                {/* Previous */}
                <div className="order-2 lg:order-1">
                  {previousPageHref ? (
                    <Link
                      href={previousPageHref}
                      className="
                        group/previous
                        relative
                        flex
                        min-h-14
                        w-full
                        items-center
                        justify-between
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-[#171715]
                        px-4
                        text-white
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-[#C9A227]/30
                        hover:bg-[#1C1C19]
                        hover:shadow-[0_14px_35px_rgba(0,0,0,0.22)]
                        sm:px-5
                      "
                    >
                      <span className="pointer-events-none absolute inset-y-0 -left-24 w-24 rotate-[18deg] bg-[#C9A227]/[0.08] blur-xl transition-transform duration-700 group-hover/previous:translate-x-[34rem]" />

                      <span className="relative flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] transition-all duration-300 group-hover/previous:border-[#C9A227]/25 group-hover/previous:bg-[#C9A227]/[0.06]">
                          <ChevronRight
                            size={16}
                            strokeWidth={1.7}
                            className="transition-transform duration-300 group-hover/previous:-translate-x-0.5"
                          />
                        </span>

                        <span className="text-right">
                          <span className="block text-[8px] font-black tracking-[0.2em] text-white/25">
                            PREVIOUS
                          </span>

                          <span className="mt-1 block text-xs font-bold text-white/80">
                            الصفحة السابقة
                          </span>
                        </span>
                      </span>

                      <span className="relative hidden text-[9px] font-black text-[#C9A227]/60 sm:block">
                        {String(page - 1).padStart(2, "0")}
                      </span>
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="
                        flex
                        min-h-14
                        w-full
                        cursor-not-allowed
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        border-white/[0.035]
                        bg-white/[0.018]
                        px-4
                        opacity-55
                        sm:px-5
                      "
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.035] bg-white/[0.012]">
                          <ChevronRight
                            size={16}
                            strokeWidth={1.7}
                            className="text-white/20"
                          />
                        </span>

                        <span className="text-right">
                          <span className="block text-[8px] font-black tracking-[0.2em] text-white/15">
                            PREVIOUS
                          </span>

                          <span className="mt-1 block text-xs font-bold text-white/20">
                            الصفحة السابقة
                          </span>
                        </span>
                      </span>
                    </span>
                  )}
                </div>

                {/* Active page */}
                <div className="order-1 flex justify-center lg:order-2">
                  <div
                    className="
                      relative
                      [transform-style:preserve-3d]
                      transition-transform
                      duration-500
                      ease-out
                      group-hover/pagination:[transform:rotateX(2deg)_rotateY(-2deg)_translateZ(10px)]
                    "
                  >
                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-[-12px]
                        rounded-[1.75rem]
                        bg-[#C9A227]/[0.08]
                        blur-2xl
                      "
                    />

                    <div
                      className="
                        relative
                        flex
                        min-w-[150px]
                        flex-col
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[1.65rem]
                        border
                        border-[#C9A227]/35
                        bg-[linear-gradient(145deg,#23231E,#121210)]
                        px-7
                        py-5
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.28)]
                      "
                    >
                      <div
                        aria-hidden="true"
                        className="
                          pointer-events-none
                          absolute
                          -right-8
                          -top-8
                          h-24
                          w-24
                          rounded-full
                          bg-[#C9A227]/[0.13]
                          blur-2xl
                        "
                      />

                      <span className="relative text-[8px] font-black tracking-[0.24em] text-white/25">
                        CURRENT PAGE
                      </span>

                      <span className="relative mt-2 font-serif text-4xl leading-none tracking-[-0.06em] text-[#F7F5F0]">
                        {String(page).padStart(2, "0")}
                      </span>

                      <div className="relative mt-3 h-px w-16 overflow-hidden bg-white/[0.08]">
                        <div className="h-full w-2/3 bg-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.45)]" />
                      </div>

                      <span className="relative mt-2 text-[8px] font-black tracking-[0.18em] text-[#C9A227]/70">
                        {totalProducts} PIECES
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next */}
                <div className="order-3">
                  {nextPageHref ? (
                    <Link
                      href={nextPageHref}
                      className="
                        group/next
                        relative
                        flex
                        min-h-14
                        w-full
                        items-center
                        justify-between
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-[#171715]
                        px-4
                        text-white
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-[#C9A227]/30
                        hover:bg-[#1C1C19]
                        hover:shadow-[0_14px_35px_rgba(0,0,0,0.22)]
                        sm:px-5
                      "
                    >
                      <span className="pointer-events-none absolute -right-24 top-0 h-full w-24 rotate-[18deg] bg-[#C9A227]/[0.08] blur-xl transition-transform duration-700 group-hover/next:-translate-x-[34rem]" />

                      <span className="relative text-[9px] font-black text-[#C9A227]/60">
                        {String(page + 1).padStart(2, "0")}
                      </span>

                      <span className="relative flex items-center gap-3">
                        <span className="text-right">
                          <span className="block text-[8px] font-black tracking-[0.2em] text-white/25">
                            NEXT
                          </span>

                          <span className="mt-1 block text-xs font-bold text-white/80">
                            الصفحة التالية
                          </span>
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] transition-all duration-300 group-hover/next:border-[#C9A227]/25 group-hover/next:bg-[#C9A227]/[0.06]">
                          <ChevronLeft
                            size={16}
                            strokeWidth={1.7}
                            className="transition-transform duration-300 group-hover/next:translate-x-0.5"
                          />
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="
                        flex
                        min-h-14
                        w-full
                        cursor-not-allowed
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        border-white/[0.035]
                        bg-white/[0.018]
                        px-4
                        opacity-55
                        sm:px-5
                      "
                    >
                      <span className="text-[9px] font-black text-white/15">
                        —
                      </span>

                      <span className="flex items-center gap-3">
                        <span className="text-right">
                          <span className="block text-[8px] font-black tracking-[0.2em] text-white/15">
                            NEXT
                          </span>

                          <span className="mt-1 block text-xs font-bold text-white/20">
                            الصفحة التالية
                          </span>
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.035] bg-white/[0.012]">
                          <ChevronLeft
                            size={16}
                            strokeWidth={1.7}
                            className="text-white/20"
                          />
                        </span>
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom metadata */}
              <div className="relative z-10 mt-5 flex flex-col gap-3 border-t border-white/[0.05] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-[8px] font-black tracking-[0.16em] text-white/20">
                  <span>PAGE {String(page).padStart(2, "0")}</span>

                  <span className="h-1 w-1 rounded-full bg-[#C9A227]/70" />

                  <span>{pageSize} PIECES / PAGE</span>
                </div>

                <span className="text-[8px] font-black tracking-[0.14em] text-white/15">
                  ORVEN LUX · PRECISION NAVIGATION
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-10 flex flex-col gap-3 border-t border-[#D5CDC0] py-7 text-[8px] font-black tracking-[0.16em] text-stone-300 sm:flex-row sm:items-center sm:justify-between">
          <span>
            ORVEN LUX — PRODUCT ATELIER
          </span>

          <div className="flex items-center gap-3">
            <span>PRECISION</span>
            <span className="h-1 w-1 rounded-full bg-[#C9A227]" />
            <span>ELEGANCE</span>
            <span className="h-1 w-1 rounded-full bg-[#C9A227]" />
            <span>CONTROL</span>
          </div>
        </footer>
      </main>
    </div>
  );
}