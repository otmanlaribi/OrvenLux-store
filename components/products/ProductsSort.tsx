"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const options = [
  {
    label: "الأحدث",
    value: "newest",
  },
  {
    label: "الأقدم",
    value: "oldest",
  },
  {
    label: "السعر: الأعلى",
    value: "price-high",
  },
  {
    label: "السعر: الأقل",
    value: "price-low",
  },
  {
    label: "المخزون: الأعلى",
    value: "stock-high",
  },
  {
    label: "المخزون: الأقل",
    value: "stock-low",
  },
  {
    label: "الاسم A-Z",
    value: "name",
  },
];

export default function ProductsSort() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const value =
    searchParams.get("sort") ?? "newest";

  function onChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    const sort = event.target.value;

    if (sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    params.delete("page");

    router.replace(
      `/admin/products?${params.toString()}`
    );
  }

  return (
    <div className="flex items-center gap-3">
      <ArrowUpDown
        size={18}
        className="text-stone-500"
      />

      <select
        value={value}
        onChange={onChange}
        className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#C9A227]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}