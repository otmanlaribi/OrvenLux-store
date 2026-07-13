import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const { count: orders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_price");

  const revenue =
    revenueData?.reduce(
      (sum, item) => sum + (item.total_price ?? 0),
      0
    ) ?? 0;

  const { count: customers } = await supabase
    .from("orders")
    .select("phone", {
      count: "exact",
      head: true,
    });

  const { count: delivered } = await supabase
    .from("orders")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "Envoyé");

  return {
    orders: orders ?? 0,
    revenue,
    customers: customers ?? 0,
    delivered: delivered ?? 0,
  };
}