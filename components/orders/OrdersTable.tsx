"use client";

import { useMemo, useState } from "react";
import OrderFilters from "./OrderFilters";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";

import type { Order } from "@/types/database";

type OrderListItem = Pick<Order, "id" | "customer_name" | "phone" | "total_price" | "status" | "tracking_number">;

export default function OrdersTable({ initialOrders, page, pageCount }: { initialOrders: OrderListItem[]; page: number; pageCount: number }) {
  const [orders] = useState<OrderListItem[]>(initialOrders);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.phone.includes(search);

      const matchesStatus =
        status === "" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  return (
    <div className="space-y-5">

      <OrderFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        totalOrders={filteredOrders.length}
        reload={() => window.location.reload()}
      />

      <div className="overflow-hidden rounded-xl border bg-white">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tracking</th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr
  key={order.id}
  className="border-t hover:bg-slate-50"
>
  <td className="p-4">
  <Link
    href={`/admin/orders/${order.id}`}
    className="text-blue-600 hover:underline font-semibold"
  >
    #{order.id}
  </Link>
</td>

  <td className="p-4 font-medium">
    {order.customer_name}
  </td>

  <td className="p-4">
    {order.phone}
  </td>

  <td className="p-4">
    {order.total_price} DA
  </td>

  <td className="p-4">
    <StatusBadge status={order.status} />
  </td>

  <td className="p-4">
    {order.tracking_number ?? "-"}
  </td>
</tr>

            ))}

          </tbody>

        </table>

      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm">
          {page > 1 && <Link href={`/admin/orders?page=${page - 1}`} className="rounded border px-3 py-2">Previous</Link>}
          <span>Page {page} of {pageCount}</span>
          {page < pageCount && <Link href={`/admin/orders?page=${page + 1}`} className="rounded border px-3 py-2">Next</Link>}
        </div>
      )}

    </div>
  );
}
