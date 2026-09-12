"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ArrowDownUp,
  ChevronDown,
} from "lucide-react";

export default function ProductsSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value =
    searchParams.get("sort") ?? "newest";

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const sort = event.target.value;

    if (sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    const query = params.toString();

    router.push(
      query
        ? `${pathname}?${query}`
        : pathname,
    );
  }

  return (
    <div
      className="
        group
        relative
        isolate

        flex
        h-12
        w-full
        items-center

        overflow-hidden

        border
        border-white/[0.08]

        bg-[#0B0B0A]

        text-white

        transition-all
        duration-700
        ease-[cubic-bezier(.16,1,.3,1)]

        hover:border-white/[0.14]

        focus-within:border-[#C9A227]/40

        focus-within:bg-[#0E0E0D]

        focus-within:shadow-[
          0_0_32px_rgba(201,162,39,0.045)
        ]

        sm:w-auto
      "
    >
      {/* =====================================================
          TOP GOLD LINE
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-20

          h-px

          bg-gradient-to-r
          from-transparent
          via-[#C9A227]/0
          to-transparent

          transition-all
          duration-700

          group-focus-within:via-[#C9A227]/50
        "
      />

      {/* =====================================================
          BACKGROUND GOLD ATMOSPHERE
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-12
          top-1/2
          z-0

          h-24
          w-24

          -translate-y-1/2

          rounded-full

          bg-[#C9A227]/[0.035]

          blur-[36px]

          opacity-0

          transition-all
          duration-700

          group-hover:opacity-100

          group-focus-within:scale-125
          group-focus-within:opacity-100
        "
      />

      {/* =====================================================
          EDITORIAL PREFIX
      ====================================================== */}

      <span
        className="
          relative
          z-10
          hidden

          pl-4

          text-[7px]
          font-medium
          uppercase
          tracking-[0.24em]

          text-white/20

          sm:block
        "
      >
        Sort
      </span>

      {/* =====================================================
          SORT ICON
      ====================================================== */}

      <ArrowDownUp
        size={15}
        strokeWidth={1.45}
        aria-hidden="true"
        className="
          pointer-events-none
          relative
          z-10

          ml-4
          shrink-0

          text-white/30

          transition-all
          duration-500
          ease-[cubic-bezier(.16,1,.3,1)]

          group-hover:text-white/50

          group-focus-within:-translate-y-[1px]
          group-focus-within:text-[#C9A227]/85

          group-focus-within:drop-shadow-[
            0_0_8px_rgba(201,162,39,0.22)
          ]

          sm:ml-3
        "
      />

      {/* =====================================================
          SELECT
      ====================================================== */}

      <select
        value={value}
        onChange={handleChange}
        aria-label="Sort watches"
        className="
          relative
          z-10

          h-full

          min-w-[175px]

          cursor-pointer

          appearance-none

          bg-transparent

          pl-3
          pr-11

          text-[11px]
          font-medium
          tracking-[0.01em]

          text-white/80

          outline-none

          transition-colors
          duration-300

          hover:text-white

          focus:text-white

          [&>option]:bg-[#11110F]
          [&>option]:text-[#F7F5F0]

          sm:min-w-[205px]
        "
      >
        <option value="newest">
          Newest
        </option>

        <option value="oldest">
          Oldest
        </option>

        <option value="price-asc">
          Price: Low to High
        </option>

        <option value="price-desc">
          Price: High to Low
        </option>

        <option value="stock">
          Stock
        </option>
      </select>

      {/* =====================================================
          CURRENT VALUE INDICATOR
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-4

          h-px

          w-0

          bg-gradient-to-r
          from-[#C9A227]
          to-transparent

          transition-all
          duration-700
          ease-[cubic-bezier(.16,1,.3,1)]

          group-focus-within:w-20
        "
      />

      {/* =====================================================
          CUSTOM CHEVRON
      ====================================================== */}

      <ChevronDown
        size={14}
        strokeWidth={1.5}
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          right-4
          z-10

          text-white/28

          transition-all
          duration-500
          ease-[cubic-bezier(.16,1,.3,1)]

          group-hover:text-white/45

          group-focus-within:rotate-180
          group-focus-within:text-[#C9A227]/85

          group-focus-within:drop-shadow-[
            0_0_8px_rgba(201,162,39,0.18)
          ]
        "
      />

      {/* =====================================================
          RIGHT CORNER DETAIL
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-0
          top-0

          h-3
          w-3

          border-r
          border-t
          border-[#C9A227]/0

          transition-all
          duration-500

          group-hover:border-[#C9A227]/20

          group-focus-within:h-5
          group-focus-within:w-5
          group-focus-within:border-[#C9A227]/45
        "
      />

      {/* =====================================================
          LEFT CORNER DETAIL
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0

          h-3
          w-3

          border-b
          border-l
          border-white/0

          transition-all
          duration-500

          group-hover:border-white/[0.10]

          group-focus-within:h-5
          group-focus-within:w-5
          group-focus-within:border-white/[0.16]
        "
      />

      {/* =====================================================
          BOTTOM GOLD EDGE
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-20

          h-px

          bg-gradient-to-r
          from-transparent
          via-[#C9A227]/0
          to-transparent

          transition-all
          duration-700

          group-hover:via-[#C9A227]/25
          group-focus-within:via-[#C9A227]/55
        "
      />

      {/* =====================================================
          REDUCED MOTION
      ====================================================== */}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 639px) {
          select {
            min-width: 0 !important;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}