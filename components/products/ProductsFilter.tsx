"use client";

import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  {
    label: "الكل",
    value: "",
  },
  {
    label: "نشطة",
    value: "active",
  },
  {
    label: "غير نشطة",
    value: "inactive",
  },
  {
    label: "مخزون منخفض",
    value: "low-stock",
  },
  {
    label: "نفد المخزون",
    value: "out-of-stock",
  },
];

export default function ProductsFilter() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const current =
    searchParams.get("filter") ?? "";

  function changeFilter(value: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set("filter", value);
    } else {
      params.delete("filter");
    }

    params.delete("page");

    router.replace(
      `/admin/products?${params.toString()}`
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const active =
          current === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() =>
              changeFilter(filter.value)
            }
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              active
                ? "bg-[#111111] text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:border-[#C9A227] hover:text-[#C9A227]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}