import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, writeAuditLog } from "@/lib/security";
import { productPatchSchema, validationError } from "@/lib/validation";
import { z } from "zod";

const idSchema = z.coerce.number().int().positive();

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id: rawId } = await params;
  const id = idSchema.safeParse(rawId);
  if (!id.success) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });

  try {
    const parsed = productPatchSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json(validationError(), { status: 400 });
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .update(parsed.data)
      .eq("id", id.data)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Unable to update product" }, { status: 400 });
    }

    await writeAuditLog({ actorId: auth.userId, action: "product.update", targetType: "product", targetId: id.data, request });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id: rawId } = await params;
  const id = idSchema.safeParse(rawId);
  if (!id.success) return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  const supabase = await createClient();

  const { data: product } = await supabase.from("products").select("image").eq("id", id.data).single();

  if (product?.image) {
    const imagePath = product.image.split("/storage/v1/object/public/products/")[1];
    if (imagePath) {
      await supabase.storage.from("products").remove([decodeURIComponent(imagePath)]);
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id.data);

  if (error) {
    return NextResponse.json({ error: "Unable to delete product" }, { status: 400 });
  }

  await writeAuditLog({ actorId: auth.userId, action: "product.delete", targetType: "product", targetId: id.data, request });

  return NextResponse.json({ ok: true });
}
