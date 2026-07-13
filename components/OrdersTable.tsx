"use client";

import { useMemo, useState } from "react";
import StatusSelect from "./StatusSelect";
import ActionButtons from "./ActionButtons";
import ExportExcel from "./ExportExcel";
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

export default function OrdersTable({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const states = [...new Set(orders.map((o) => o.state))];

  const filteredOrders = useMemo(() => {
    const text = search.toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order.customer_name?.toLowerCase().includes(text) ||
        order.phone?.includes(text);

      const matchesStatus =
        statusFilter === "" ||
        order.status === statusFilter;

      const matchesState =
        stateFilter === "" ||
        order.state === stateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesState
      );
    });
  }, [orders, search, statusFilter, stateFilter]);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 ابحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 2,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
          }}
        >
          <option value="">كل الحالات</option>
          <option value="جديد">جديد</option>
          <option value="قيد المعالجة">قيد المعالجة</option>
          <option value="تم الشحن">تم الشحن</option>
          <option value="تم التسليم">تم التسليم</option>
          <option value="ملغي">ملغي</option>
        </select>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
          }}
        >
          <option value="">كل الولايات</option>

          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  }}
>
  <h3>
    عدد الطلبات: {filteredOrders.length}
  </h3>

  <ExportExcel orders={filteredOrders} />
</div>

<table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#111", color: "#fff" }}>
            <th style={th}>#</th>
            <th style={th}>التاريخ</th>
            <th style={th}>العميل</th>
            <th style={th}>الهاتف</th>
            <th style={th}>المنتج</th>
            <th style={th}>الولاية</th>
            <th style={th}>نوع التوصيل</th>
            <th style={th}>العنوان / المكتب</th>
            <th style={th}>سعر التوصيل</th>
            <th style={th}>المجموع</th>
            <th style={th}>الحالة</th>
            <th style={th}>إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td style={td}>{order.id}</td>

              <td style={td}>
                {new Date(order.created_at).toLocaleString("ar-DZ")}
              </td>

              <td style={td}>{order.customer_name}</td>

              <td style={td}>{order.phone}</td>

              <td style={td}>{order.products?.name || "-"}</td>

              <td style={td}>{order.state}</td>

              <td style={td}>
                {order.delivery_type === "home"
                  ? "🏠 المنزل"
                  : "🏢 المكتب"}
              </td>

              <td style={td}>
                {order.delivery_type === "home"
                  ? order.address
                  : order.office_name}
              </td>

              <td style={td}>
                {order.delivery_price} دج
              </td>

              <td style={td}>
                {order.total_price} دج
              </td>

              <td style={td}>
                <StatusSelect
                  orderId={order.id}
                  status={order.status}
                  onStatusChange={(newStatus) =>
                    setOrders((prev) =>
                      prev.map((o) =>
                        o.id === order.id
                          ? { ...o, status: newStatus }
                          : o
                      )
                    )
                  }
                />
              </td>

              <td style={td}>
                <ActionButtons
  phone={order.phone}
  orderId={order.id}
/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const th = {
  border: "1px solid #ddd",
  padding: "12px",
};

const td = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center" as const,
};