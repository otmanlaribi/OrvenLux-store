import { createClient } from "@/lib/supabase/client";

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

const DEFAULT_PAGE_SIZE = 20;

export async function getCustomersPaginated(options?: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
}) {
  const supabase = createClient();

  const page = Math.max(0, options?.page ?? 0);
  const pageSize = Math.max(1, options?.pageSize ?? DEFAULT_PAGE_SIZE);

  const from = page * pageSize;
  const to = from + pageSize;

  let query = supabase
    .from("customers")
    .select("*")
    .range(from, to);

  switch (options?.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;

    case "name":
      query = query.order("name", { ascending: true });
      break;

    default:
      query = query.order("created_at", {
        ascending: false,
      });
  }

  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);

    return {
      customers: [],
      page,
      pageSize,
      hasMore: false,
    };
  }

  const customers = (data ?? []).slice(0, pageSize);

  return {
    customers,
    page,
    pageSize,
    hasMore: (data ?? []).length > pageSize,
  };
}

export async function getCustomerById(id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}