import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export type ProductImage = {
  id?: number;
  product_id?: number;
  image: string;
  is_primary?: boolean;
  sort_order?: number | null;
};

export type ProductWithImages = Product & {
  images?: ProductImage[];
};

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

const DEFAULT_PAGE_SIZE = 20;

type GetProductsOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
};

export async function getProductsPaginated(
  options?: GetProductsOptions
): Promise<{
  products: Product[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}> {
  const supabase = createClient();

  const page = Math.max(0, options?.page ?? 0);
  const pageSize = Math.max(1, options?.pageSize ?? DEFAULT_PAGE_SIZE);

  const from = page * pageSize;
  const to = from + pageSize;

  let query = supabase
    .from("products")
    .select("*")
    .range(from, to);

  const search = options?.search?.trim();

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,id.eq.${Number(search) || -1}`
    );
  }

  switch (options?.sort) {
    case "oldest":
      query = query.order("id", { ascending: true });
      break;

    case "price_asc":
      query = query.order("price", { ascending: true });
      break;

    case "price_desc":
      query = query.order("price", { ascending: false });
      break;

    case "stock_asc":
      query = query.order("stock", { ascending: true });
      break;

    case "stock_desc":
      query = query.order("stock", { ascending: false });
      break;

    default:
      query = query.order("id", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);

    return {
      products: [],
      page,
      pageSize,
      hasMore: false,
    };
  }

  const products = (data ?? []).slice(0, pageSize) as Product[];

  const hasMore = (data ?? []).length > pageSize;

  return {
    products,
    page,
    pageSize,
    hasMore,
  };
}

export async function getProductById(
  id: number
): Promise<ProductWithImages> {
  const supabase = createClient();

  const {
    data: product,
    error: productError,
  } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (productError || !product) {
    console.error(productError);
    throw productError;
  }

  const {
    data: images,
    error: imagesError,
  } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  if (imagesError) {
    console.error(imagesError);
  }

  /*
   * المنتجات القديمة قد تحتوي على products.image فقط.
   * لا نضيفها إلى images هنا حتى لا تتكرر عند وجودها
   * فعليًا داخل product_images.
   */
  return {
    ...product,
    images: (images ?? []) as ProductImage[],
  } as ProductWithImages;
}

export type NewProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  active: boolean;

  /*
   * معرض الصور المرتبط بهذا المنتج.
   *
   * image في products.image = الصورة الرئيسية.
   * images = جميع صور المنتج الإضافية + الرئيسية.
   */
  images?: ProductImage[];
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

    throw new Error(
      errorPayload.error ?? "Failed to create product"
    );
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

    throw new Error(
      errorPayload.error ?? "Failed to update product"
    );
  }

  return response.json();
}

export async function deleteProduct(id: number) {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));

    throw new Error(
      errorPayload.error ?? "Failed to delete product"
    );
  }
}