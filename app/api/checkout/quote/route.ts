import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited } from "@/lib/security";

const quoteSchema = z.object({ productId: z.number().int().positive(), state: z.string().trim().min(1).max(120), deliveryType: z.enum(["home", "office"]) }).strict();

export async function POST(request: Request) {
  if (await isRateLimited("quote", request, 30, 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const parsed = quoteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  const admin = createAdminClient();
  const [{ data: product }, { data: shipping }] = await Promise.all([
    admin.from("products").select("price").eq("id", parsed.data.productId).eq("active", true).maybeSingle(),
    admin.from("shipping_prices").select("home_price, office_price").eq("state", parsed.data.state).maybeSingle(),
  ]);
  if (!product || !shipping) return NextResponse.json({ error: "Quote unavailable" }, { status: 404 });
  const deliveryPrice = parsed.data.deliveryType === "home" ? shipping.home_price : shipping.office_price;
  return NextResponse.json({ deliveryPrice, totalPrice: product.price + deliveryPrice });
}
