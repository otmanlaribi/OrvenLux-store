import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  requireAdmin,
  writeAuditLog,
} from "@/lib/security";
import {
  productPatchSchema,
  validationError,
} from "@/lib/validation";

const idSchema = z.coerce
  .number()
  .int()
  .positive();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ProductImagePayload = {
  id?: number;
  image: string;
  is_primary?: boolean;
  sort_order?: number | null;
};

type ProductImageRow = {
  product_id: number;
  image: string;
  is_primary: boolean;
  sort_order: number;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  const auth =
    await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  const { id: rawId } =
    await params;

  const parsedId =
    idSchema.safeParse(rawId);

  if (!parsedId.success) {
    return NextResponse.json(
      {
        error:
          "Invalid product id",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const body =
      await request.json();

    /*
     * =========================================================
     * 01 — VALIDATE PRODUCT + IMAGES
     * =========================================================
     */

    const parsedProduct =
      productPatchSchema.safeParse(
        body,
      );

    if (!parsedProduct.success) {
      console.error(
        "PRODUCT VALIDATION ERROR:",
        parsedProduct.error.flatten(),
      );

      return NextResponse.json(
        validationError(),
        {
          status: 400,
        },
      );
    }

    /*
     * =========================================================
     * 02 — SEPARATE IMAGES FROM PRODUCT DATA
     * =========================================================
     *
     * images موجودة في product_images
     * وليست في products.
     *
     * لذلك يجب عدم إرسال images
     * إلى .from("products").update()
     */

    const {
      images: validatedImages,
      ...productData
    } = parsedProduct.data;

    const images: ProductImagePayload[] =
      validatedImages?.map(
        (
          item,
          index,
        ) => ({
          id: item.id,

          image:
            item.image.trim(),

          is_primary:
            Boolean(
              item.is_primary,
            ),

          sort_order:
            typeof item.sort_order ===
            "number"
              ? item.sort_order
              : index,
        }),
      ) ?? [];

    const supabase =
      createAdminClient();

    /*
     * =========================================================
     * 03 — GET CURRENT PRODUCT
     * =========================================================
     */

    const {
      data: currentProduct,
      error:
        currentProductError,
    } = await supabase
      .from("products")
      .select("*")
      .eq(
        "id",
        parsedId.data,
      )
      .maybeSingle();

    if (currentProductError) {
      console.error(
        "CURRENT PRODUCT ERROR:",
        currentProductError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to find product",
        },
        {
          status: 400,
        },
      );
    }

    if (!currentProduct) {
      return NextResponse.json(
        {
          error:
            "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * =========================================================
     * 04 — UPDATE PRODUCT
     * =========================================================
     *
     * مهم جدًا:
     *
     * نستخدم productData وليس parsedProduct.data
     *
     * لأن parsedProduct.data يحتوي images أيضًا،
     * وعمود images غير موجود في جدول products.
     */

    let updatedProduct =
      currentProduct;

    if (
      Object.keys(productData)
        .length > 0
    ) {
      const {
        data,
        error:
          updateError,
      } = await supabase
        .from("products")
        .update(productData)
        .eq(
          "id",
          parsedId.data,
        )
        .select()
        .maybeSingle();

      if (updateError) {
        console.error(
          "PRODUCT UPDATE ERROR:",
          updateError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to update product",
          },
          {
            status: 400,
          },
        );
      }

      if (!data) {
        return NextResponse.json(
          {
            error:
              "Product not found or update was denied",
          },
          {
            status: 404,
          },
        );
      }

      updatedProduct = data;
    }

    /*
     * =========================================================
     * 05 — NORMALIZE IMAGE GALLERY
     * =========================================================
     */

    let normalizedImages:
      ProductImagePayload[] =
      images.map(
        (
          item: ProductImagePayload,
          index: number,
        ) => ({
          id: item.id,

          image:
            item.image.trim(),

          is_primary:
            Boolean(
              item.is_primary,
            ),

          sort_order:
            index,
        }),
      );

    /*
     * إذا لم يرسل ProductForm معرض صور،
     * نستخدم الصورة الموجودة في products.image
     * حتى لا نفقد الصورة القديمة.
     */

    if (
      normalizedImages.length ===
        0 &&
      updatedProduct.image
    ) {
      normalizedImages = [
        {
          image:
            updatedProduct.image,

          is_primary: true,

          sort_order: 0,
        },
      ];
    }

    /*
     * =========================================================
     * 06 — ENSURE ONE PRIMARY IMAGE
     * =========================================================
     */

    if (
      normalizedImages.length > 0
    ) {
      let primaryIndex =
        normalizedImages.findIndex(
          (
            item: ProductImagePayload,
          ) =>
            item.is_primary === true,
        );

      if (primaryIndex === -1) {
        primaryIndex = 0;
      }

      normalizedImages =
        normalizedImages.map(
          (
            item: ProductImagePayload,
            index: number,
          ) => ({
            ...item,

            is_primary:
              index ===
              primaryIndex,

            sort_order:
              index,
          }),
        );
    }

    /*
     * =========================================================
     * 07 — DETERMINE PRIMARY IMAGE
     * =========================================================
     */

    const primaryImage =
      normalizedImages.find(
        (
          item: ProductImagePayload,
        ) =>
          item.is_primary ===
          true,
      )?.image ??
      updatedProduct.image ??
      "";

    /*
     * =========================================================
     * 08 — UPDATE products.image
     * =========================================================
     *
     * products.image يجب أن يطابق
     * الصورة الرئيسية في product_images.
     */

    if (
      primaryImage !==
      updatedProduct.image
    ) {
      const {
        data:
          primaryUpdatedProduct,
        error:
          primaryImageError,
      } = await supabase
        .from("products")
        .update({
          image:
            primaryImage,
        })
        .eq(
          "id",
          parsedId.data,
        )
        .select()
        .maybeSingle();

      if (primaryImageError) {
        console.error(
          "PRIMARY IMAGE UPDATE ERROR:",
          primaryImageError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to update primary product image",
          },
          {
            status: 400,
          },
        );
      }

      if (
        primaryUpdatedProduct
      ) {
        updatedProduct =
          primaryUpdatedProduct;
      }
    }

    /*
     * =========================================================
     * 09 — SAVE PRODUCT IMAGE GALLERY
     * =========================================================
     *
     * نحذف السجلات القديمة ثم نعيد
     * بناء المعرض بالكامل.
     */

    const {
      error:
        deleteImagesError,
    } = await supabase
      .from("product_images")
      .delete()
      .eq(
        "product_id",
        parsedId.data,
      );

    if (deleteImagesError) {
      console.error(
        "OLD PRODUCT IMAGES DELETE ERROR:",
        deleteImagesError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to update product images",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * =========================================================
     * 10 — INSERT NEW IMAGE GALLERY
     * =========================================================
     */

    if (
      normalizedImages.length > 0
    ) {
      const rows:
        ProductImageRow[] =
        normalizedImages.map(
          (
            item: ProductImagePayload,
            index: number,
          ) => ({
            product_id:
              parsedId.data,

            image:
              item.image,

            is_primary:
              Boolean(
                item.is_primary,
              ),

            sort_order:
              index,
          }),
        );

      const {
        error:
          insertImagesError,
      } = await supabase
        .from(
          "product_images",
        )
        .insert(rows);

      if (insertImagesError) {
        console.error(
          "NEW PRODUCT IMAGES INSERT ERROR:",
          insertImagesError,
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

    /*
     * =========================================================
     * 11 — GET SAVED IMAGES
     * =========================================================
     */

    const {
      data: savedImages,
      error:
        savedImagesError,
    } = await supabase
      .from("product_images")
      .select("*")
      .eq(
        "product_id",
        parsedId.data,
      )
      .order(
        "sort_order",
        {
          ascending: true,
        },
      );

    if (savedImagesError) {
      console.error(
        "SAVED PRODUCT IMAGES ERROR:",
        savedImagesError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to load saved product images",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * =========================================================
     * 12 — AUDIT LOG
     * =========================================================
     */

    await writeAuditLog({
      actorId:
        auth.userId,

      action:
        "product.update",

      targetType:
        "product",

      targetId:
        parsedId.data,

      request,
    });

    /*
     * =========================================================
     * 13 — RESPONSE
     * =========================================================
     */

    return NextResponse.json({
      ...updatedProduct,

      image:
        primaryImage,

      images:
        savedImages ?? [],
    });
  } catch (error) {
    console.error(
      "PRODUCT PATCH ROUTE ERROR:",
      error,
    );

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
}

export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  const auth =
    await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  const { id: rawId } =
    await params;

  const parsedId =
    idSchema.safeParse(rawId);

  if (!parsedId.success) {
    return NextResponse.json(
      {
        error:
          "Invalid product id",
      },
      {
        status: 400,
      },
    );
  }

  const supabase =
    createAdminClient();

  try {
    /*
     * =========================================================
     * 01 — GET PRODUCT
     * =========================================================
     */

    const {
      data: product,
      error:
        productError,
    } = await supabase
      .from("products")
      .select(
        "id, image",
      )
      .eq(
        "id",
        parsedId.data,
      )
      .maybeSingle();

    if (productError) {
      console.error(
        "PRODUCT LOOKUP ERROR:",
        productError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to find product",
        },
        {
          status: 400,
        },
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * =========================================================
     * 02 — GET ALL PRODUCT IMAGES
     * =========================================================
     */

    const {
      data: productImages,
      error:
        productImagesError,
    } = await supabase
      .from("product_images")
      .select("image")
      .eq(
        "product_id",
        parsedId.data,
      );

    if (productImagesError) {
      console.error(
        "PRODUCT IMAGES LOOKUP ERROR:",
        productImagesError,
      );
    }

    /*
     * نجمع كل روابط الصور حتى نحذفها
     * من Storage بعد حذف المنتج.
     */

    const imageUrls = [
      ...(productImages ?? []).map(
        (
          item: {
            image: string;
          },
        ) =>
          item.image,
      ),

      product.image,
    ].filter(
      (
        image:
          | string
          | null,
      ): image is string =>
        Boolean(image),
    );

    const uniqueImageUrls =
      [
        ...new Set(
          imageUrls,
        ),
      ];

    /*
     * =========================================================
     * 03 — DELETE PRODUCT IMAGES
     * =========================================================
     */

    const {
      error:
        deleteImagesError,
    } = await supabase
      .from("product_images")
      .delete()
      .eq(
        "product_id",
        parsedId.data,
      );

    if (deleteImagesError) {
      console.error(
        "PRODUCT IMAGES DELETE ERROR:",
        deleteImagesError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete product images",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * =========================================================
     * 04 — DELETE PRODUCT
     * =========================================================
     */

    const {
      data: deletedProduct,
      error:
        deleteError,
    } = await supabase
      .from("products")
      .delete()
      .eq(
        "id",
        parsedId.data,
      )
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error(
        "PRODUCT DELETE ERROR:",
        deleteError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete product",
        },
        {
          status: 400,
        },
      );
    }

    if (!deletedProduct) {
      return NextResponse.json(
        {
          error:
            "Product was not deleted. Check Supabase RLS policies.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * =========================================================
     * 05 — DELETE IMAGES FROM STORAGE
     * =========================================================
     */

    if (
      uniqueImageUrls.length >
      0
    ) {
      const storagePaths =
        uniqueImageUrls
          .map(
            (
              imageUrl: string,
            ) => {
              const marker =
                "/storage/v1/object/public/products/";

              const index =
                imageUrl.indexOf(
                  marker,
                );

              if (index === -1) {
                return null;
              }

              const path =
                imageUrl.slice(
                  index +
                    marker.length,
                );

              if (!path) {
                return null;
              }

              return decodeURIComponent(
                path,
              );
            },
          )
          .filter(
            (
              path:
                | string
                | null,
            ): path is string =>
              Boolean(path),
          );

      if (
        storagePaths.length >
        0
      ) {
        const {
          error:
            storageError,
        } = await supabase.storage
          .from("products")
          .remove(
            storagePaths,
          );

        if (storageError) {
          /*
           * لا نفشل حذف المنتج إذا فشل
           * حذف ملف من Storage.
           */

          console.error(
            "PRODUCT STORAGE DELETE ERROR:",
            storageError,
          );
        }
      }
    }

    /*
     * =========================================================
     * 06 — AUDIT LOG
     * =========================================================
     */

    await writeAuditLog({
      actorId:
        auth.userId,

      action:
        "product.delete",

      targetType:
        "product",

      targetId:
        parsedId.data,

      request,
    });

    /*
     * =========================================================
     * 07 — RESPONSE
     * =========================================================
     */

    return NextResponse.json({
      ok: true,

      deletedId:
        deletedProduct.id,
    });
  } catch (error) {
    console.error(
      "PRODUCT DELETE ROUTE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete product",
      },
      {
        status: 500,
      },
    );
  }
}