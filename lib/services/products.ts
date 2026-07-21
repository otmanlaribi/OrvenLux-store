import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data as Product[];
}

export async function getProductById(id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data as Product;
}

export type NewProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  active: boolean;
};

export async function createProduct(product: NewProduct) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error ?? "Failed to create product");
  }

  return response.json();
}

export async function updateProduct(
  id: number,
  product: Partial<NewProduct>
) {
  const response = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error ?? "Failed to update product");
  }

  return response.json();
}

export async function deleteProduct(id: number) {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error ?? "Failed to delete product");
  }
}
