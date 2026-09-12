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

export async function DELETE(
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
    const {
      data: image,
      error: imageError,
    } = await supabase
      .from("product_images")
      .select("*")
      .eq("id", parsedId.data)
      .maybeSingle();

    if (imageError) {
      console.error(imageError);

      return NextResponse.json(
        {
          error:
            "Unable to find image",
        },
        {
          status: 400,
        }
      );
    }

    if (!image) {
      return NextResponse.json(
        {
          error: "Image not found",
        },
        {
          status: 404,
        }
      );
    }

    const {
      error: deleteError,
    } = await supabase
      .from("product_images")
      .delete()
      .eq("id", parsedId.data);

    if (deleteError) {
      console.error(deleteError);

      return NextResponse.json(
        {
          error:
            "Unable to delete image",
        },
        {
          status: 400,
        }
      );
    }

    if (image.image) {
      const imagePath =
        image.image.split(
          "/storage/v1/object/public/products/"
        )[1];

      if (imagePath) {
        const {
          error: storageError,
        } = await supabase.storage
          .from("products")
          .remove([
            decodeURIComponent(
              imagePath
            ),
          ]);

        if (storageError) {
          console.error(
            storageError
          );
        }
      }
    }

    await writeAuditLog({
      actorId: auth.userId,
      action:
        "product.image.delete",
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
          "Unable to delete image",
      },
      {
        status: 500,
      }
    );
  }
}