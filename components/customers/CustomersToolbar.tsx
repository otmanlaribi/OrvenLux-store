"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import { useState, useTransition } from "react";

type CustomersToolbarProps = {
  totalCustomers: number;
};

const sortOptions = [
  {
    value: "newest",
    label: "الأحدث",
  },
  {
    value: "oldest",
    label: "الأقدم",
  },
  {
    value: "name_asc",
    label: "الاسم (أ-ي)",
  },
  {
    value: "name_desc",
    label: "الاسم (ي-أ)",
  },
];

export default function CustomersToolbar({
  totalCustomers,
}: CustomersToolbarProps) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [isPending, startTransition] =
    useTransition();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  const currentSort =
    searchParams.get("sort") ?? "newest";

  function updateQuery(
    key: string,
    value: string
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(
        `/admin/customers?${params.toString()}`
      );
    });
  }

  return (
    <section className="rounded-3xl border border-[#C9A227]/25 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black tracking-[0.22em] text-[#9A7718]">
            CUSTOMER MANAGEMENT
          </p>

          <h2 className="mt-2 text-xl font-black">
            العملاء
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            إجمالي العملاء:{" "}
            <span className="font-black text-[#111111]">
              {totalCustomers}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateQuery(
                    "search",
                    search.trim()
                  );
                }
              }}
              placeholder="بحث باسم العميل..."
              className="h-11 w-72 rounded-xl border border-stone-300 bg-white pr-10 pl-4 text-sm outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Sorting */}
          <div className="relative">
            <ArrowUpDown
              size={17}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <select
              value={currentSort}
              onChange={(e) =>
                updateQuery(
                  "sort",
                  e.target.value
                )
              }
              className="h-11 rounded-xl border border-stone-300 bg-white pr-10 pl-8 text-sm outline-none transition focus:border-[#C9A227]"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => router.refresh()}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 text-sm font-black text-white transition hover:bg-[#252525] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                isPending
                  ? "animate-spin"
                  : ""
              }
            />

            تحديث
          </button>
        </div>
      </div>
    </section>
  );
}