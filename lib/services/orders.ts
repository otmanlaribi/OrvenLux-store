import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/database";

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data as Order[];
}