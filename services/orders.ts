import { supabase } from "@/lib/supabase";

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      products(name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}