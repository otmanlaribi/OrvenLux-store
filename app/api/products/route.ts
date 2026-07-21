import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, writeAuditLog } from "@/lib/security";
import { productSchema, validationError } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const parsed = productSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json(validationError(), { status: 400 });
    const payload = parsed.data;
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").insert(payload).select().single();

    if (error) {
      return NextResponse.json({ error: "Unable to create product" }, { status: 400 });
    }

    await writeAuditLog({ actorId: auth.userId, action: "product.create", targetType: "product", targetId: data.id, request });

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
