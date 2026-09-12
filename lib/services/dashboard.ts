import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  const [
    { count: orders },
    { data: revenueData },
    { count: customers },
    { count: delivered },
    { data: recentOrders },
    { data: products },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("orders")
      .select("total_price"),

    supabase
      .from("orders")
      .select("phone", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "تم التسليم"),

    supabase
      .from("orders")
      .select(
        "id, customer_name, total_price, status, created_at"
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("products")
      .select("id, name, stock")
      .order("stock", {
        ascending: true,
      })
      .limit(5),
  ]);

  const revenue =
    revenueData?.reduce(
      (sum, item) =>
        sum + (item.total_price ?? 0),
      0
    ) ?? 0;

  const lowStock =
    products?.filter(
      (product) => product.stock <= 5
    ).length ?? 0;

  return {
    orders: orders ?? 0,
    revenue,
    customers: customers ?? 0,
    delivered: delivered ?? 0,
    recentOrders: recentOrders ?? [],
    products: products ?? [],
    lowStock,
  };
}