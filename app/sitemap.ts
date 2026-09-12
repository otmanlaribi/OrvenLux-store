import type { MetadataRoute } from "next";

import { createAdminClient } from "@/lib/supabase/admin";

type ProductItem = {
  id: number;
  created_at?: string | null;
};

const BASE_URL = "https://orvenlux.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    /*
     * IMPORTANT:
     *
     * We intentionally use the admin/service-role client here
     * instead of the server client because sitemap generation
     * must not depend on request cookies.
     *
     * createClient() from "@/lib/supabase/server" uses cookies()
     * and causes /sitemap.xml to become dynamic.
     */
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("products")
      .select("id, created_at")
      .eq("active", true)
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "SITEMAP PRODUCTS ERROR:",
        {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
      );

      return routes;
    }

    const products = (data ?? []) as ProductItem[];

    const productRoutes: MetadataRoute.Sitemap =
      products.map((product) => ({
        /*
         * Your storefront route is:
         * /products/[id]
         *
         * not /products/[slug]
         */
        url: `${BASE_URL}/products/${product.id}`,

        lastModified: product.created_at
          ? new Date(product.created_at)
          : now,

        changeFrequency: "weekly",

        priority: 0.8,
      }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error(
      "Error generating sitemap:",
      error,
    );

    return routes;
  }
}