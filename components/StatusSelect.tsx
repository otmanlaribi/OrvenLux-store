"use client";

import { supabase } from "@/lib/supabase";

type Props = {
  orderId: number;
  status: string;
  onStatusChange: (status: string) => void;
};

export default function StatusSelect({
  orderId,
  status,
  onStatusChange,
}: Props) {
  async function changeStatus(newStatus: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("حدث خطأ أثناء تحديث الحالة");
      return;
    }

    onStatusChange(newStatus);
  }

  const background =
    status === "جديد"
      ? "#3b82f6"
      : status === "قيد المعالجة"
      ? "#f59e0b"
      : status === "تم الشحن"
      ? "#8b5cf6"
      : status === "تم التسليم"
      ? "#22c55e"
      : "#ef4444";

  return (
    <select
      value={status}
      onChange={(e) => changeStatus(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: "8px",
        border: "none",
        background,
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      <option value="جديد">جديد</option>
      <option value="قيد المعالجة">قيد المعالجة</option>
      <option value="تم الشحن">تم الشحن</option>
      <option value="تم التسليم">تم التسليم</option>
      <option value="ملغي">ملغي</option>
    </select>
  );
}