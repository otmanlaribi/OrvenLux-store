import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/types/database";

type GetStoreProductsOptions = {
  active?: boolean;
  limit?: number;
  excludeId?: number;
};

export async function getStoreProducts({
  active,
  limit = 8,
  excludeId,
}: GetStoreProductsOptions = {}): Promise<Product[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (typeof active === "boolean") {
    query = query.eq("active", active);
  }

  if (typeof excludeId === "number") {
    query = query.neq("id", excludeId);
  }

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
  console.error("Failed to load store products:", {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });

  return [];
}

  return data as Product[];
}