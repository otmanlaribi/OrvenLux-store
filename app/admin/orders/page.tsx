import OrdersTable from "@/components/orders/OrdersTable";
import { createAdminClient } from "@/lib/supabase/admin";

const PAGE_SIZE = 50;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const rawPage = Number((await searchParams).page ?? "1");
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const from = (page - 1) * PAGE_SIZE;
  const { data: orders, count, error } = await createAdminClient()
    .from("orders")
    .select("id, customer_name, phone, total_price, status, tracking_number, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) throw new Error("Unable to load orders");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-slate-500">Manage all customer orders</p>
      </div>
      <OrdersTable initialOrders={orders ?? []} page={page} pageCount={Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))} />
    </div>
  );
}
