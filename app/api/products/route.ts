import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  isRateLimited,
  requireAdmin,
  writeAuditLog,
} from "@/lib/security";
import {
  productSchema,
  validationError,
} from "@/lib/validation";

type ProductImagePayload = {
  id?: number;
  image: string;
  is_primary?: boolean;
  sort_order?: number | null;
};

const productImageSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    image: z
      .string()
      .trim()
      .min(1)
      .max(2048),
    is_primary: z.boolean().optional(),
    sort_order: z
      .number()
      .int()
      .min(0)
      .max(100)
      .nullable()
      .optional(),
  })
  .strict();

const publicProductsQuerySchema = z.object({
  active: z
    .enum(["true", "false"])
    .optional(),

  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(50)
    .default(24),

  excludeId: z
    .coerce
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
});

/* =========================================================
   GET — STORE / RECOMMENDED PRODUCTS
========================================================= */

export async function GET(
  request: Request,
) {
  try {
    /* =====================================================
       01 — RATE LIMIT
    ===================================================== */

    if (
      await isRateLimited(
        "products-read",
        request,
        120,
        60_000,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Too many requests",
        },
        {
          status: 429,
          headers: {
            "Cache-Control":
              "no-store",
          },
        },
      );
    }

    const url =
      new URL(request.url);

    /* =====================================================
       02 — PARSE QUERY
    ===================================================== */

    const queryResult =
      publicProductsQuerySchema.safeParse(
        {
          active:
            url.searchParams.get(
              "active",
            ) ?? undefined,

          limit:
            url.searchParams.get(
              "limit",
            ) ?? undefined,

          excludeId:
            url.searchParams.get(
              "excludeId",
            ) ?? undefined,
        },
      );

    if (!queryResult.success) {
      return NextResponse.json(
        {
          error:
            "Invalid query parameters",
        },
        {
          status: 400,
        },
      );
    }

    const {
      active,
      limit,
      excludeId:
        parsedExcludeId,
    } = queryResult.data;

    /* =====================================================
       03 — ADMIN CHECK FOR HIDDEN PRODUCTS
    ===================================================== */

    /*
     * The endpoint is public because the storefront and
     * RecommendedProducts component use it directly.
     *
     * IMPORTANT SECURITY RULE:
     *
     * - Public callers can only read active products.
     * - `active=false` is accepted only for authenticated
     *   administrators.
     *
     * This prevents the Admin client from exposing hidden
     * products to anonymous visitors.
     */

    let canReadInactive =
      false;

    if (active === "false") {
      const auth =
        await requireAdmin(
          request,
        );

      if (!auth.ok) {
        return NextResponse.json(
          {
            error:
              "Forbidden",
          },
          {
            status: 403,
          },
        );
      }

      canReadInactive =
        true;
    }

    const onlyActive =
      canReadInactive
        ? false
        : true;

    /* =====================================================
       04 — BUILD QUERY
    ===================================================== */

    const supabase =
      createAdminClient();

    let query = supabase
      .from("products")
      .select(
        "id, name, description, price, stock, image, active, created_at",
      )
      .eq(
        "active",
        onlyActive,
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      )
      .limit(limit);

    if (
      parsedExcludeId != null
    ) {
      query = query.neq(
        "id",
        parsedExcludeId,
      );
    }

    const {
      data: products,
      error,
    } = await query;

    if (error) {
      console.error(
        "STORE PRODUCTS GET ERROR:",
        {
          message:
            error.message,
          code:
            error.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to load products",
        },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store",
          },
        },
      );
    }

    /* =====================================================
       05 — SAFE RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        products:
          products ?? [],
      },
      {
        status: 200,

        headers: {
          /*
           * Storefront responses may be cached.
           * Admin hidden-product responses must never be
           * accidentally cached publicly.
           */
          "Cache-Control":
            canReadInactive
              ? "private, no-store"
              : "public, s-maxage=60, stale-while-revalidate=300",

          "X-Content-Type-Options":
            "nosniff",

          "Referrer-Policy":
            "strict-origin-when-cross-origin",
        },
      },
    );
  } catch (error) {
    console.error(
      "PRODUCT GET ROUTE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load products",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }
}

/* =========================================================
   POST — ADMIN CREATE PRODUCT
========================================================= */

export async function POST(
  request: Request,
) {
  const auth =
    await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  /* =====================================================
     ADMIN WRITE RATE LIMIT
  ===================================================== */

  if (
    await isRateLimited(
      "product-create",
      request,
      30,
      60_000,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Too many requests",
      },
      {
        status: 429,
      },
    );
  }

  try {
    /* =====================================================
       01 — PARSE BODY
    ===================================================== */

    const body =
      await request
        .json()
        .catch(() => null);

    if (
      !body ||
      typeof body !==
        "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payload",
        },
        {
          status: 400,
        },
      );
    }

    const rawBody =
      body as Record<
        string,
        unknown
      >;

    const {
      images:
        rawImages,
      ...productBody
    } = rawBody;

    /* =====================================================
       02 — VALIDATE PRODUCT
    ===================================================== */

    const parsed =
      productSchema.safeParse(
        productBody,
      );

    if (!parsed.success) {
      console.error(
        "PRODUCT VALIDATION ERROR:",
        parsed.error.flatten(),
      );

      return NextResponse.json(
        validationError(),
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       03 — VALIDATE GALLERY
    ===================================================== */

    let images:
      ProductImagePayload[] =
      [];

    if (
      rawImages !==
      undefined
    ) {
      if (
        !Array.isArray(
          rawImages,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid product images",
          },
          {
            status: 400,
          },
        );
      }

      if (
        rawImages.length >
        50
      ) {
        return NextResponse.json(
          {
            error:
              "Too many product images",
          },
          {
            status: 400,
          },
        );
      }

      const parsedImages =
        z
          .array(
            productImageSchema,
          )
          .safeParse(
            rawImages,
          );

      if (
        !parsedImages.success
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid product images",
          },
          {
            status: 400,
          },
        );
      }

      images =
        parsedImages.data;
    }

    const payload =
      parsed.data;

    const supabase =
      createAdminClient();

    /* =====================================================
       04 — CREATE PRODUCT
    ===================================================== */

    const {
      data: product,
      error:
        productError,
    } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (
      productError ||
      !product
    ) {
      console.error(
        "PRODUCT CREATE ERROR:",
        {
          message:
            productError?.message,
          code:
            productError?.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to create product",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       05 — PREPARE GALLERY
    ===================================================== */

    let productImages:
      ProductImagePayload[] =
      [];

    if (
      images.length > 0
    ) {
      productImages =
        images
          .filter(
            (
              item,
            ) =>
              item &&
              typeof item.image ===
                "string" &&
              item.image
                .trim()
                .length >
                0,
          )
          .map(
            (
              item,
              index,
            ) => ({
              image:
                item.image
                  .trim(),

              is_primary:
                index === 0
                  ? true
                  : Boolean(
                      item.is_primary,
                    ),

              sort_order:
                index,
            }),
          );
    } else if (
      product.image
    ) {
      /*
       * Backward compatibility.
       */

      productImages = [
        {
          image:
            product.image,

          is_primary:
            true,

          sort_order:
            0,
        },
      ];
    }

    /* =====================================================
       06 — GUARANTEE ONE PRIMARY
    ===================================================== */

    if (
      productImages.length >
      0
    ) {
      const primaryIndex =
        productImages.findIndex(
          (
            item,
          ) =>
            item.is_primary ===
            true,
        );

      productImages =
        productImages.map(
          (
            item,
            index,
          ) => ({
            ...item,

            is_primary:
              primaryIndex ===
              -1
                ? index === 0
                : index ===
                  primaryIndex,

            sort_order:
              index,
          }),
        );
    }

    /* =====================================================
       07 — SAVE GALLERY
    ===================================================== */

    if (
      productImages.length >
      0
    ) {
      const rows =
        productImages.map(
          (
            item,
          ) => ({
            product_id:
              product.id,

            image:
              item.image,

            is_primary:
              Boolean(
                item.is_primary,
              ),

            sort_order:
              item.sort_order ??
              0,
          }),
        );

      const {
        error:
          imagesError,
      } = await supabase
        .from(
          "product_images",
        )
        .insert(rows);

      if (imagesError) {
        console.error(
          "PRODUCT IMAGES CREATE ERROR:",
          {
            message:
              imagesError.message,
            code:
              imagesError.code,
          },
        );

        /*
         * Roll back product row.
         */
        await supabase
          .from("products")
          .delete()
          .eq(
            "id",
            product.id,
          );

        return NextResponse.json(
          {
            error:
              "Unable to save product images",
          },
          {
            status: 400,
          },
        );
      }
    }

    /* =====================================================
       08 — SYNCHRONIZE PRIMARY IMAGE
    ===================================================== */

    const primaryImage =
      productImages.find(
        (
          item,
        ) =>
          item.is_primary ===
          true,
      )?.image ??
      product.image ??
      "";

    if (
      primaryImage &&
      primaryImage !==
        product.image
    ) {
      const {
        error:
          primaryUpdateError,
      } = await supabase
        .from("products")
        .update({
          image:
            primaryImage,
        })
        .eq(
          "id",
          product.id,
        );

      if (
        primaryUpdateError
      ) {
        console.error(
          "PRIMARY IMAGE UPDATE ERROR:",
          {
            message:
              primaryUpdateError.message,
            code:
              primaryUpdateError.code,
          },
        );

        /*
         * Do not leave an inconsistent product row.
         * Attempt rollback.
         */

        await supabase
          .from(
            "product_images",
          )
          .delete()
          .eq(
            "product_id",
            product.id,
          );

        await supabase
          .from("products")
          .delete()
          .eq(
            "id",
            product.id,
          );

        return NextResponse.json(
          {
            error:
              "Unable to synchronize primary product image",
          },
          {
            status: 400,
          },
        );
      }
    }

    /* =====================================================
       09 — AUDIT LOG
    ===================================================== */

    const auditResult =
      await writeAuditLog({
        actorId:
          auth.userId,

        action:
          "product.create",

        targetType:
          "product",

        targetId:
          product.id,

        request,

        metadata: {
          image_count:
            productImages.length,

          active:
            Boolean(
              product.active,
            ),

          stock:
            product.stock,

          has_primary_image:
            Boolean(
              primaryImage,
            ),
        },
      });

    if (
      !auditResult.success
    ) {
      /*
       * Product creation succeeded.
       * Audit failure should not destroy the valid
       * product, but it must remain visible server-side.
       */
      console.error(
        "PRODUCT CREATE AUDIT ERROR:",
        {
          productId:
            product.id,
          error:
            auditResult.error,
        },
      );
    }

    /* =====================================================
       10 — RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        ...product,

        image:
          primaryImage,

        images:
          productImages.map(
            (
              item,
              index,
            ) => ({
              id: 0,

              product_id:
                product.id,

              image:
                item.image,

              is_primary:
                Boolean(
                  item.is_primary,
                ),

              sort_order:
                index,
            }),
          ),
      },
      {
        status: 201,

        headers: {
          "Cache-Control":
            "no-store",

          "X-Content-Type-Options":
            "nosniff",
        },
      },
    );
  } catch (error) {
    console.error(
      "PRODUCT POST ROUTE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV ===
          "development"
            ? error instanceof
              Error
              ? error.message
              : "Invalid payload"
            : "Invalid payload",
      },
      {
        status: 400,
      },
    );
  }
}