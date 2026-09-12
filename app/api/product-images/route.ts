import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();

    const productId = Number(body.product_id);
    const image = String(body.image ?? "").trim();

    if (!productId || !image) {
      return NextResponse.json(
        {
          error: "Missing data",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = createAdminClient();

    // هل توجد صورة رئيسية؟
    const { data: primaryImage } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .eq("is_primary", true)
      .maybeSingle();

    const { data, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image,
        is_primary: !primaryImage,
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: "Unable to save image",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }
}