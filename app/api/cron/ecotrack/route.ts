import { NextResponse } from "next/server";
import { retryEcotrackDispatch } from "@/lib/ecotrack-server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await createAdminClient().from("orders").select("id").eq("sent_to_ecotrack", false).eq("ecotrack_dispatch_state", "pending").lte("ecotrack_next_attempt_at", new Date().toISOString()).order("ecotrack_next_attempt_at", { ascending: true }).limit(10);
  if (error) return NextResponse.json({ error: "Unable to load pending shipments" }, { status: 500 });
  const results = await Promise.allSettled((data ?? []).map(({ id }) => retryEcotrackDispatch(id)));
  return NextResponse.json({ processed: results.length, succeeded: results.filter((result) => result.status === "fulfilled").length });
}
