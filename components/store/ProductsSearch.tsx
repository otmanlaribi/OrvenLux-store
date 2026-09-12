"use client";

import { useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ArrowUpRight,
  Search,
  X,
} from "lucide-react";

export default function ProductsSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.get("search") ?? "",
  );

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value.trim()) {
      params.set(
        "search",
        value.trim(),
      );
    } else {
      params.delete("search");
    }

    router.push(
      `${pathname}?${params.toString()}`,
    );
  }

  function clearSearch() {
    setValue("");

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("search");

    router.push(
      `${pathname}?${params.toString()}`,
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="
        group
        relative
        flex
        h-12
        w-full
        items-center
        gap-3

        overflow-hidden

        border
        border-white/[0.08]

        bg-[#0B0B0A]

        px-4

        text-white

        transition-all
        duration-700
        ease-[cubic-bezier(.16,1,.3,1)]

        hover:border-white/[0.13]

        focus-within:border-[#C9A227]/40

        focus-within:bg-[#0D0D0C]

        focus-within:shadow-[0_0_35px_rgba(201,162,39,0.045)]
      "
    >
      {/* =====================================================
          GOLD TOP EDGE
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0

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
          POINTER / FOCUS ATMOSPHERE
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          top-1/2

          h-28
          w-28

          -translate-y-1/2

          rounded-full

          bg-[#C9A227]/[0.035]

          blur-[45px]

          opacity-0

          transition-all
          duration-1000

          group-hover:opacity-100

          group-focus-within:opacity-100
          group-focus-within:scale-125
        "
      />

      {/* =====================================================
          SEARCH ICON
      ====================================================== */}

      <Search
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className="
          relative
          z-10
          shrink-0

          text-white/30

          transition-all
          duration-500

          group-hover:text-white/45

          group-focus-within:-translate-y-[1px]
          group-focus-within:text-[#C9A227]/85

          group-focus-within:drop-shadow-[0_0_8px_rgba(201,162,39,0.24)]
        "
      />

      {/* =====================================================
          INPUT
      ====================================================== */}

      <input
        type="search"
        value={value}
        onChange={(event) =>
          setValue(event.target.value)
        }
        placeholder="Search watches..."
        aria-label="Search watches"
        autoComplete="off"
        className="
          relative
          z-10

          min-w-0
          flex-1

          bg-transparent

          text-[12px]
          text-white/85

          outline-none

          placeholder:text-white/22

          transition-colors
          duration-300

          selection:bg-[#C9A227]/20
          selection:text-white

          [appearance:textfield]

          [&::-webkit-search-cancel-button]:appearance-none
        "
      />

      {/* =====================================================
          CLEAR
      ====================================================== */}

      {value && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="
            group/clear
            relative
            z-10

            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center

            border
            border-white/[0.07]

            bg-white/[0.018]

            text-white/25

            transition-all
            duration-400
            ease-out

            hover:border-[#C9A227]/25
            hover:bg-[#C9A227]/[0.045]
            hover:text-[#C9A227]/85

            active:scale-90

            focus-visible:outline-none
            focus-visible:ring-1
            focus-visible:ring-[#C9A227]/60
          "
        >
          <X
            size={13}
            strokeWidth={1.5}
            className="
              transition-transform
              duration-300

              group-hover/clear:rotate-90
            "
          />
        </button>
      )}

      {/* =====================================================
          SEARCH SUBMIT
      ====================================================== */}

      <button
        type="submit"
        aria-label="Search watches"
        className="
          group/search
          relative
          z-10

          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center

          overflow-hidden

          rounded-full

          border
          border-[#C9A227]/35

          bg-[#C9A227]/[0.09]

          text-[#C9A227]

          shadow-[0_0_20px_rgba(201,162,39,0.035)]

          transition-all
          duration-500
          ease-[cubic-bezier(.16,1,.3,1)]

          hover:scale-105
          hover:border-[#C9A227]/60
          hover:bg-[#C9A227]
          hover:text-[#090909]
          hover:shadow-[0_0_25px_rgba(201,162,39,0.16)]

          active:scale-90

          focus-visible:outline-none
          focus-visible:ring-1
          focus-visible:ring-[#E2C76D]/70
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[#0B0B0A]
        "
      >
        {/* Button glow */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0

            rounded-full

            bg-[#E2C76D]

            opacity-0

            scale-50

            transition-all
            duration-500

            group-hover/search:scale-100
            group-hover/search:opacity-100
          "
        />

        {/* Shine */}

        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-[-20%]
            left-[-80%]

            w-[55%]

            rotate-[25deg]

            bg-white/50

            opacity-0

            transition-none

            group-hover/search:left-[125%]
            group-hover/search:opacity-100
            group-hover/search:transition-[left,opacity]
            group-hover/search:duration-[700ms]
            group-hover/search:ease-[cubic-bezier(.16,1,.3,1)]
          "
        />

        <ArrowUpRight
          size={13}
          strokeWidth={1.6}
          className="
            relative
            z-10

            transition-all
            duration-400
            ease-out

            group-hover/search:-translate-y-0.5
            group-hover/search:translate-x-0.5
          "
        />
      </button>

      {/* =====================================================
          BOTTOM GOLD LINE
      ====================================================== */}

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute

          bottom-0
          left-4
          right-4

          h-px

          bg-gradient-to-r
          from-transparent
          via-[#C9A227]/0
          to-transparent

          transition-all
          duration-700

          group-focus-within:via-[#C9A227]/45
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
      `}</style>
    </form>
  );
}