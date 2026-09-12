"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsSearch() {
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

      router.replace(
        `/admin/products?${params.toString()}`
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  function clearSearch() {
    setQuery("");
  }

  return (
    <div className="relative w-full lg:max-w-md">
      <Search
        size={18}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
      />

      <input
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="ابحث باسم المنتج..."
        className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pr-11 pl-12 text-sm outline-none transition focus:border-[#C9A227] focus:bg-white"
      />

      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 transition hover:bg-stone-200 hover:text-stone-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}