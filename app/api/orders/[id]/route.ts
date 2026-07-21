import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited, requireAdmin, writeAuditLog } from "@/lib/security";
import { orderStatusSchema, validationError } from "@/lib/validation";

const idSchema = z.coerce.number().int().positive();

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  if (await isRateLimited("order-status", request, 30, 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const id = idSchema.safeParse((await params).id);
  const payload = orderStatusSchema.safeParse(await request.json().catch(() => null));
  if (!id.success || !payload.success) return NextResponse.json(validationError(), { status: 400 });
  const { data, error } = await createAdminClient().from("orders").update({ status: payload.data.status }).eq("id", id.data).select("id, status").maybeSingle();
  if (error || !data) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  await writeAuditLog({ actorId: auth.userId, action: "order.status_update", targetType: "order", targetId: id.data, request, metadata: { status: data.status } });
  return NextResponse.json(data);
}
