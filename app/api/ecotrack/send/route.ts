import { NextResponse } from "next/server";
import { retryEcotrackDispatch } from "@/lib/ecotrack-server";
import { requireAdmin, writeAuditLog } from "@/lib/security";
import { ecotrackSchema, validationError } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const parsed = ecotrackSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json(validationError(), { status: 400 });
  try {
    const result = await retryEcotrackDispatch(parsed.data.orderId);
    await writeAuditLog({ actorId: auth.userId, action: "ecotrack.dispatch", targetType: "order", targetId: parsed.data.orderId, request, metadata: result });
    return NextResponse.json(result, { status: result.dispatched ? 200 : 409 });
  } catch {
    return NextResponse.json({ error: "Unable to dispatch shipment" }, { status: 502 });
  }
}
