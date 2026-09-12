"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(
    searchParams.get("q") ?? ""
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }

      params.delete("page");

      const nextQuery = params.toString();

      router.replace(
        nextQuery
          ? `/admin/orders?${nextQuery}`
          : "/admin/orders"
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  function clearSearch() {
    setQuery("");
  }

  return (
    <div
      dir="rtl"
      className="relative w-full"
    >
      {/* Search icon */}
      <Search
        size={18}
        strokeWidth={1.8}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          z-10
          -translate-y-1/2
          text-[#5F5A50]
          transition-colors
          duration-300
        "
      />

      <input
        type="search"
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="ابحث باسم العميل أو الهاتف أو رقم الطلب..."
        aria-label="البحث في الطلبات"
        autoComplete="off"
        spellCheck={false}
        className="
          h-[46px]
          w-full
          rounded-[15px]
          border
          border-[#D8D3C9]
          bg-[#F7F5F0]
          px-11
          pl-12
          text-[13px]
          font-medium
          text-[#111111]
          caret-[#C9A227]
          outline-none
          placeholder:text-[#8B857A]
          placeholder:font-normal
          placeholder:opacity-100
          transition-all
          duration-300
          hover:border-[#C9A227]/35
          focus:border-[#C9A227]
          focus:bg-white
          focus:ring-1
          focus:ring-[#C9A227]/20
          focus:shadow-[0_0_0_3px_rgba(201,162,39,0.06)]
        "
      />

      {/* Clear button */}
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="مسح البحث"
          className="
            absolute
            left-3
            top-1/2
            z-10
            flex
            h-7
            w-7
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-[#D8D3C9]
            bg-white
            text-[#777168]
            shadow-sm
            transition-all
            duration-300
            hover:border-[#C9A227]/40
            hover:bg-[#C9A227]/[0.06]
            hover:text-[#8F6C12]
            hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]
          "
        >
          <X
            size={14}
            strokeWidth={1.8}
          />
        </button>
      )}

      {/* Bottom precision line */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-px
          w-0
          -translate-x-1/2
          bg-[#C9A227]
          transition-all
          duration-500
          peer-focus:w-[92%]
        "
      />
    </div>
  );
}