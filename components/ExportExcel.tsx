"use client";

import * as XLSX from "xlsx";

type Order = {
  id: number;
  created_at: string;
  customer_name: string;
  phone: string;
  state: string;
  delivery_type: string;
  address: string;
  office_name: string;
  delivery_price: number;
  total_price: number;
  status: string;
  products: {
    name: string;
  } | null;
};

export default function ExportExcel({
  orders,
}: {
  orders: Order[];
}) {
  function exportFile() {
    const data = orders.map((order) => ({
      "رقم الطلب": order.id,
      "التاريخ": new Date(order.created_at).toLocaleString("ar-DZ"),
      "العميل": order.customer_name,
      "الهاتف": order.phone,
      "المنتج": order.products?.name || "",
      "الولاية": order.state,
      "نوع التوصيل":
        order.delivery_type === "home"
          ? "المنزل"
          : "المكتب",
      "العنوان / المكتب":
        order.delivery_type === "home"
          ? order.address
          : order.office_name,
      "سعر التوصيل": order.delivery_price,
      "المجموع": order.total_price,
      "الحالة": order.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Orders"
    );

    XLSX.writeFile(workbook, "طلبات_ORVEN_LUX.xlsx");
  }

  return (
    <button
      onClick={exportFile}
      style={{
        padding: "12px 18px",
        background: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      📥 تصدير إلى Excel
    </button>
  );
}