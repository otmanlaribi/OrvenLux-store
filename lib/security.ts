import "server-only";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type AuthResult =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; response: NextResponse };

export async function requireAuthenticatedUser(request: Request): Promise<AuthResult> {
  if (!isSameOrigin(request)) {
    return { ok: false, response: NextResponse.json({ error: "Invalid request origin" }, { status: 403 }) };
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true, userId: user.id, email: user.email ?? null };
}

export async function requireAdmin(request: Request): Promise<AuthResult> {
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth;

  const { data, error } = await createAdminClient()
    .from("admin_users")
    .select("user_id")
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return auth;
}

export async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await createAdminClient()
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return data ? user : null;
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser callers cannot forge an authenticated cookie cross-site.
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

type Limit = { count: number; resetAt: number };
const limits = new Map<string, Limit>();

type RateLimitResult = { limited: boolean };

function getRateLimitKey(scope: string, request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${scope}:${forwarded || "unknown"}`;
}

function checkLocalRateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = limits.get(key);
  if (!current || current.resetAt <= now) {
    limits.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }
  current.count += 1;
  return { limited: current.count > max };
}

async function checkUpstashRateLimit(key: string, max: number, windowMs: number): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Upstash is not configured");
  const encodedKey = encodeURIComponent(`orven-lux:rate-limit:${key}`);
  const increment = await fetch(`${url}/incr/${encodedKey}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(1_500) });
  if (!increment.ok) throw new Error("Upstash increment failed");
  const { result } = (await increment.json()) as { result: number };
  if (result === 1) await fetch(`${url}/pexpire/${encodedKey}/${windowMs}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(1_500) });
  return { limited: result > max };
}

/** Uses Upstash Redis when configured; development and outage fallback is process-local. */
export async function isRateLimited(scope: string, request: Request, max: number, windowMs: number) {
  const key = getRateLimitKey(scope, request);
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      return (await checkUpstashRateLimit(key, max, windowMs)).limited;
    } catch {
      // Preserve availability during an external limiter outage; configure edge limiting in production as a second layer.
    }
  }
  return checkLocalRateLimit(key, max, windowMs).limited;
}

export async function verifyCaptcha(token: string | undefined, remoteIp: string | undefined) {
  const secret = process.env.CAPTCHA_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: remoteIp ?? "" }),
    signal: AbortSignal.timeout(5_000),
  });
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export async function writeAuditLog(input: {
  actorId: string | null;
  action: string;
  targetType: string;
  targetId?: string | number | null;
  request: Request;
  metadata?: Record<string, unknown>;
}) {
  try {
    await createAdminClient().from("audit_logs").insert({
      actor_id: input.actorId,
      action: input.action,
      target_type: input.targetType,
      target_id: input.targetId == null ? null : String(input.targetId),
      ip_address: input.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      metadata: input.metadata ?? {},
    });
  } catch {
    // Audit availability must not turn a completed customer action into an error.
  }
}
