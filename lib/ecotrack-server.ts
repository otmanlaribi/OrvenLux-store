import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export async function dispatchOrderToEcotrack(orderId: number) {
  const supabase = createAdminClient();
  const { data: claimed, error: claimError } = await supabase
    .from("orders")
    .update({ ecotrack_dispatch_state: "processing", ecotrack_last_attempt_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("sent_to_ecotrack", false)
    .eq("ecotrack_dispatch_state", "pending")
    .select("id, ecotrack_dispatch_attempts")
    .maybeSingle();

  if (claimError) throw new Error("Unable to claim shipment");
  if (!claimed) return { dispatched: false, reason: "already_dispatched_or_processing" as const };
  const attempt = (claimed.ecotrack_dispatch_attempts ?? 0) + 1;
  await supabase.from("orders").update({ ecotrack_dispatch_attempts: attempt }).eq("id", orderId).eq("ecotrack_dispatch_state", "processing");

  const { data: order, error } = await supabase.from("orders").select("*, products(name)").eq("id", orderId).single();
  if (error || !order) throw new Error("Order not found");

  const { data: city } = await supabase.from("algeria_cities").select("commune_name_ascii").eq("commune_name", order.commune).maybeSingle();
  const params = new URLSearchParams({
    reference: String(order.id), nom_client: order.customer_name ?? "", telephone: order.phone ?? "",
    adresse: order.address ?? "", commune: city?.commune_name_ascii ?? order.commune,
    code_wilaya: String(order.wilaya ?? ""), montant: String(order.total_price ?? 0), remarque: "",
    produit: order.products?.name ?? "", stock: "0", quantite: String(order.quantity ?? 1),
    boutique: "Orven Lux", type: "1", stop_desk: order.delivery_type === "office" ? "1" : "0",
    weight: "1", fragile: "0",
  });

  try {
    const response = await fetch("https://platform.dhd-dz.com/api/v1/create/order", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.ECOTRACK_API_TOKEN ?? ""}`, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: params, signal: AbortSignal.timeout(10_000),
    });
    const raw = await response.text();
    let result: Record<string, unknown> = {};
    try { result = JSON.parse(raw) as Record<string, unknown>; } catch { result = { response: "non_json" }; }
    if (!response.ok) throw new Error("Courier rejected shipment");
    await supabase.from("orders").update({
      sent_to_ecotrack: true, ecotrack_dispatch_state: "sent", status: "تم الشحن", ecotrack_next_attempt_at: null,
      tracking_number: typeof result.tracking === "string" ? result.tracking : typeof result.tracking_number === "string" ? result.tracking_number : null,
      ecotrack_reference: typeof result.reference === "string" ? result.reference : null,
      ecotrack_response: result, ecotrack_error: null,
    }).eq("id", orderId);
    return { dispatched: true, result };
  } catch (error) {
    const delaySeconds = Math.min(60 * 60, 30 * 2 ** Math.max(0, attempt - 1));
    await supabase.from("orders").update({ ecotrack_dispatch_state: "pending", ecotrack_error: "Courier dispatch failed", ecotrack_next_attempt_at: new Date(Date.now() + delaySeconds * 1_000).toISOString() }).eq("id", orderId);
    throw error;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Retries a claimed shipment with bounded exponential backoff. Use this from the secured admin route or a scheduler. */
export async function retryEcotrackDispatch(orderId: number, maxAttempts = 3) {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const result = await dispatchOrderToEcotrack(orderId);
      if (result.dispatched || result.reason === "already_dispatched_or_processing") return result;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts - 1) await sleep(500 * 2 ** attempt);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Courier dispatch failed");
}
