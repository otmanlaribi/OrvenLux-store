"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

const statuses = [
  { value: "", label: "جميع الحالات" },
  { value: "جديد", label: "جديد" },
  { value: "تم التأكيد", label: "تم التأكيد" },
  { value: "تم الشحن", label: "تم الشحن" },
  { value: "تم التسليم", label: "تم التسليم" },
  { value: "ملغي", label: "ملغي" },
];

export default function OrdersStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current =
    searchParams.get("status") ?? "";

  function handleChange(value: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }

    params.delete("page");

    const query = params.toString();

    router.replace(
      query
        ? `/admin/orders?${query}`
        : "/admin/orders"
    );
  }

  return (
    <select
      dir="rtl"
      value={current}
      onChange={(event) =>
        handleChange(event.target.value)
      }
      aria-label="فلترة الطلبات حسب الحالة"
      className="
        h-[46px]
        min-w-[168px]
        cursor-pointer
        rounded-[15px]
        border
        border-[#D8D3C9]
        bg-[#F7F5F0]
        px-4
        text-[13px]
        font-medium
        text-[#111111]
        outline-none
        transition-all
        duration-300
        hover:border-[#C9A227]
        focus:border-[#C9A227]
        focus:ring-1
        focus:ring-[#C9A227]/20
      "
    >
      {statuses.map((status) => (
        <option
          key={status.value}
          value={status.value}
          className="bg-white text-[#111111]"
        >
          {status.label}
        </option>
      ))}
    </select>
  );
}