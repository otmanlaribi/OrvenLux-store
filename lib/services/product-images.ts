import { createClient } from "@/lib/supabase/client";

export type NewProductImage = {
  product_id: number;
  image: string;
  is_primary?: boolean;
  sort_order?: number;
};

export async function getProductImages(
  productId: number
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function createProductImage(
  image: NewProductImage
) {
  const response = await fetch(
    "/api/product-images",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(image),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create image"
    );
  }

  return response.json();
}

export async function deleteProductImage(
  id: number
) {
  const response = await fetch(
    `/api/product-images/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete image"
    );
  }
}

export async function setPrimaryImage(
  id: number
) {
  const response = await fetch(
    `/api/product-images/${id}/primary`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update image"
    );
  }

  return response.json();
}