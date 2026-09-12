import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  requireAdmin,
  writeAuditLog,
} from "@/lib/security";

const idSchema = z.coerce
  .number()
  .int()
  .positive();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const auth = await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  const parsedId =
    idSchema.safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json(
      {
        error: "Invalid image id",
      },
      {
        status: 400,
      }
    );
  }

  const supabase =
    createAdminClient();

  try {
    /*
     * نحصل على الصورة المطلوبة
     */
    const {
      data: image,
      error: imageError,
    } = await supabase
      .from("product_images")
      .select("*")
      .eq("id", parsedId.data)
      .maybeSingle();

    if (imageError || !image) {
      return NextResponse.json(
        {
          error: "Image not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * إزالة الصورة الرئيسية من جميع صور المنتج
     */
    const {
      error: resetError,
    } = await supabase
      .from("product_images")
      .update({
        is_primary: false,
      })
      .eq(
        "product_id",
        image.product_id
      );

    if (resetError) {
      console.error(resetError);

      return NextResponse.json(
        {
          error:
            "Unable to update gallery",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * جعل الصورة الحالية رئيسية
     */
    const {
      error: primaryError,
    } = await supabase
      .from("product_images")
      .update({
        is_primary: true,
      })
      .eq("id", image.id);

    if (primaryError) {
      console.error(primaryError);

      return NextResponse.json(
        {
          error:
            "Unable to set primary image",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * تحديث الصورة الرئيسية في جدول المنتجات
     */
    const {
      error: productError,
    } = await supabase
      .from("products")
      .update({
        image: image.image,
      })
      .eq(
        "id",
        image.product_id
      );

    if (productError) {
      console.error(productError);

      return NextResponse.json(
        {
          error:
            "Unable to update product",
        },
        {
          status: 400,
        }
      );
    }

    await writeAuditLog({
      actorId: auth.userId,
      action:
        "product.image.primary",
      targetType: "product",
      targetId:
        image.product_id,
      request,
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unexpected server error",
      },
      {
        status: 500,
      }
    );
  }
}