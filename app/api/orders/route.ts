import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited, verifyCaptcha, writeAuditLog } from "@/lib/security";
import { orderSchema, validationError } from "@/lib/validation";

const idempotencyKeyPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (await isRateLimited("checkout", request, 5, 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json(validationError(), { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!(await verifyCaptcha(parsed.data.captchaToken, ip))) return NextResponse.json({ error: "Verification failed" }, { status: 400 });

  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey || !idempotencyKeyPattern.test(idempotencyKey)) {
    return NextResponse.json({ error: "Missing or invalid idempotency key" }, { status: 400 });
  }

  const { data: order, error } = await createAdminClient().rpc("create_checkout_order", {
    p_product_id: parsed.data.productId,
    p_customer_name: parsed.data.customerName,
    p_phone: parsed.data.phone,
    p_state: parsed.data.state,
    p_commune: parsed.data.commune,
    p_delivery_type: parsed.data.deliveryType,
    p_address: parsed.data.address ?? null,
    p_office_name: parsed.data.officeName ?? null,
    p_idempotency_key: idempotencyKey,
  }).single();

  if (error || !order) return NextResponse.json({ error: "Unable to create order" }, { status: 400 });
  const createdOrder = order as { id: number; total_price: number; delivery_price: number };
  await writeAuditLog({ actorId: null, action: "order.create", targetType: "order", targetId: createdOrder.id, request });
  return NextResponse.json(createdOrder, { status: 201 });
}
