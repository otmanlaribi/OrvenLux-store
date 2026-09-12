import "server-only";

import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/* =========================================================
   TYPES
========================================================= */

type AuthResult =
  | {
      ok: true;
      userId: string;
      email: string | null;
    }
  | {
      ok: false;
      response: NextResponse;
    };

type Limit = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  limited: boolean;
};

/* =========================================================
   AUTHENTICATION
========================================================= */

/**
 * Requires a valid authenticated Supabase user and,
 * for browser-originated requests, a same-origin request.
 *
 * Important:
 * - Authentication is verified server-side with getUser().
 * - Authorization is handled separately by requireAdmin().
 * - No client-provided user id is trusted.
 */
export async function requireAuthenticatedUser(
  request: Request,
): Promise<AuthResult> {
  if (!isSameOrigin(request)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Invalid request origin",
        },
        {
          status: 403,
        },
      ),
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      ),
    };
  }

  return {
    ok: true,
    userId: user.id,
    email: user.email ?? null,
  };
}

/* =========================================================
   ADMIN AUTHORIZATION
========================================================= */

/**
 * Requires:
 * 1. Valid Supabase authentication
 * 2. The authenticated user to exist in admin_users
 */
export async function requireAdmin(
  request: Request,
): Promise<AuthResult> {
  const auth =
    await requireAuthenticatedUser(request);

  if (!auth.ok) {
    return auth;
  }

  const { data, error } =
    await createAdminClient()
      .from("admin_users")
      .select("user_id")
      .eq(
        "user_id",
        auth.userId,
      )
      .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      ),
    };
  }

  return auth;
}

/**
 * Server-side helper for protected admin pages.
 */
export async function getAdminUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } =
    await createAdminClient()
      .from("admin_users")
      .select("user_id")
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  return data ? user : null;
}

/* =========================================================
   SAME ORIGIN / CSRF PROTECTION
========================================================= */

/**
 * Checks browser-originated requests.
 *
 * Same-origin requests normally include Origin.
 * Some legitimate server-to-server requests may not.
 *
 * We therefore:
 * - reject a supplied invalid Origin
 * - allow an absent Origin
 * - safely reject malformed Origin values
 */
export function isSameOrigin(
  request: Request,
) {
  const origin =
    request.headers.get("origin");

  if (!origin) {
    return true;
  }

  try {
    const requestOrigin =
      new URL(request.url).origin;

    const suppliedOrigin =
      new URL(origin).origin;

    return (
      suppliedOrigin ===
      requestOrigin
    );
  } catch {
    return false;
  }
}

/* =========================================================
   CLIENT IP
========================================================= */

/**
 * Returns the best available client IP.
 *
 * Priority:
 * 1. Cloudflare's authenticated edge header
 * 2. Reverse-proxy real-ip header
 * 3. X-Forwarded-For
 *
 * Important:
 * These headers must only be trusted when the deployment sits
 * behind a trusted reverse proxy/CDN such as Cloudflare/Vercel.
 */
export function getClientIp(
  request: Request,
): string | null {
  const cloudflareIp =
    request.headers
      .get("cf-connecting-ip")
      ?.trim();

  if (
    cloudflareIp &&
    isValidIpValue(cloudflareIp)
  ) {
    return cloudflareIp;
  }

  const realIp =
    request.headers
      .get("x-real-ip")
      ?.trim();

  if (
    realIp &&
    isValidIpValue(realIp)
  ) {
    return realIp;
  }

  const forwarded =
    request.headers.get(
      "x-forwarded-for",
    );

  if (forwarded) {
    const ips =
      forwarded
        .split(",")
        .map((value) =>
          value.trim(),
        )
        .filter(
          Boolean,
        );

    /*
     * In a standard reverse-proxy chain the right-most
     * address is the address added by the most recent
     * trusted proxy.
     *
     * We avoid blindly trusting an arbitrary first value,
     * which is commonly attacker-controlled.
     */
    for (
      let index =
        ips.length - 1;
      index >= 0;
      index -= 1
    ) {
      const candidate =
        ips[index];

      if (
        candidate &&
        isValidIpValue(
          candidate,
        )
      ) {
        return candidate;
      }
    }
  }

  return null;
}

/**
 * Lightweight validation for IPv4/IPv6 values.
 *
 * We intentionally do not try to implement a full IP parser here.
 * The goal is to reject obvious header injection / garbage values.
 */
function isValidIpValue(
  value: string,
) {
  if (
    !value ||
    value.length > 128
  ) {
    return false;
  }

  if (
    /[\r\n]/.test(value)
  ) {
    return false;
  }

  /*
   * IPv4
   */
  if (
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(
      value,
    )
  ) {
    const octets =
      value.split(".");

    return octets.every(
      (octet) => {
        const number =
          Number(octet);

        return (
          number >= 0 &&
          number <= 255
        );
      },
    );
  }

  /*
   * IPv6
   *
   * Deliberately permissive because IPv6 has many valid textual forms.
   */
  if (
    value.includes(":") &&
    /^[0-9a-fA-F:.]+$/.test(
      value,
    )
  ) {
    return true;
  }

  return false;
}

/* =========================================================
   RATE LIMIT STORAGE
========================================================= */

/**
 * Process-local fallback.
 *
 * This protects development and also provides temporary resilience
 * if the distributed limiter is unavailable.
 *
 * Production deployments should keep Upstash configured so the
 * limiter is shared between instances.
 */
const limits =
  new Map<string, Limit>();

/* =========================================================
   RATE LIMIT KEY
========================================================= */

function getRateLimitKey(
  scope: string,
  request: Request,
) {
  const clientIp =
    getClientIp(request);

  /*
   * If an IP cannot be established, requests from that source
   * share one bucket instead of creating unlimited "unknown"
   * buckets.
   */
  return `${scope}:${
    clientIp ?? "unknown"
  }`;
}

/* =========================================================
   LOCAL RATE LIMIT
========================================================= */

function checkLocalRateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now =
    Date.now();

  const current =
    limits.get(key);

  if (
    !current ||
    current.resetAt <= now
  ) {
    limits.set(
      key,
      {
        count: 1,
        resetAt:
          now + windowMs,
      },
    );

    return {
      limited: false,
    };
  }

  current.count += 1;

  return {
    limited:
      current.count > max,
  };
}

/* =========================================================
   UPSTASH RATE LIMIT
========================================================= */

async function checkUpstashRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const url =
    process.env
      .UPSTASH_REDIS_REST_URL;

  const token =
    process.env
      .UPSTASH_REDIS_REST_TOKEN;

  if (
    !url ||
    !token
  ) {
    throw new Error(
      "Upstash is not configured",
    );
  }

  const encodedKey =
    encodeURIComponent(
      `orven-lux:rate-limit:${key}`,
    );

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  /*
   * Atomic increment.
   */
  const increment =
    await fetch(
      `${url}/incr/${encodedKey}`,
      {
        method: "POST",
        headers,
        signal:
          AbortSignal.timeout(
            1_500,
          ),
      },
    );

  if (!increment.ok) {
    throw new Error(
      "Upstash increment failed",
    );
  }

  const body =
    (await increment.json()) as {
      result?: unknown;
    };

  const result =
    Number(body.result);

  if (
    !Number.isSafeInteger(
      result,
    ) ||
    result < 1
  ) {
    throw new Error(
      "Invalid Upstash increment response",
    );
  }

  /*
   * First hit creates the expiration.
   *
   * If expiration fails we intentionally fail the
   * distributed check so we never leave a key permanent.
   */
  if (result === 1) {
    const expiry =
      await fetch(
        `${url}/pexpire/${encodedKey}/${windowMs}`,
        {
          method: "POST",
          headers,
          signal:
            AbortSignal.timeout(
              1_500,
            ),
        },
      );

    if (!expiry.ok) {
      throw new Error(
        "Upstash expiration failed",
      );
    }
  }

  return {
    limited:
      result > max,
  };
}

/* =========================================================
   PUBLIC RATE LIMIT API
========================================================= */

/**
 * Uses Upstash when configured.
 * Falls back to process-local limiting during development
 * or temporary Upstash outages.
 */
export async function isRateLimited(
  scope: string,
  request: Request,
  max: number,
  windowMs: number,
) {
  /*
   * Defensive bounds.
   */
  const safeMax =
    Number.isFinite(max) &&
    max > 0
      ? Math.floor(max)
      : 1;

  const safeWindowMs =
    Number.isFinite(windowMs) &&
    windowMs > 0
      ? Math.floor(windowMs)
      : 60_000;

  const key =
    getRateLimitKey(
      scope,
      request,
    );

  const upstashUrl =
    process.env
      .UPSTASH_REDIS_REST_URL;

  const upstashToken =
    process.env
      .UPSTASH_REDIS_REST_TOKEN;

  if (
    upstashUrl &&
    upstashToken
  ) {
    try {
      return (
        await checkUpstashRateLimit(
          key,
          safeMax,
          safeWindowMs,
        )
      ).limited;
    } catch (error) {
      /*
       * Keep the application available if the distributed
       * limiter temporarily fails, while immediately falling
       * back to local process protection.
       */
      console.error(
        "RATE LIMIT UPSTASH ERROR:",
        error,
      );
    }
  }

  return checkLocalRateLimit(
    key,
    safeMax,
    safeWindowMs,
  ).limited;
}

/* =========================================================
   TURNSTILE / CAPTCHA
========================================================= */

/**
 * Verifies Cloudflare Turnstile.
 *
 * Current production variable:
 *   TURNSTILE_SECRET_KEY
 *
 * Backward compatibility:
 *   CAPTCHA_SECRET_KEY
 *
 * Production always fails closed when no secret is configured.
 */
export async function verifyCaptcha(
  token:
    | string
    | undefined,
  remoteIp:
    | string
    | undefined,
) {
  const secret =
    process.env
      .TURNSTILE_SECRET_KEY ??
    process.env
      .CAPTCHA_SECRET_KEY;

  /*
   * Empty/invalid token must never pass in production.
   */
  if (
    !token ||
    token.trim().length === 0
  ) {
    return false;
  }

  /*
   * Production must have a configured server secret.
   *
   * Development keeps the old behavior only for local testing
   * when no secret exists.
   */
  if (!secret) {
    return (
      process.env.NODE_ENV !==
      "production"
    );
  }

  try {
    const response =
      await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body:
            new URLSearchParams({
              secret:
                secret.trim(),

              response:
                token.trim(),

              remoteip:
                remoteIp?.trim() ??
                "",
            }),

          signal:
            AbortSignal.timeout(
              5_000,
            ),
        },
      );

    if (!response.ok) {
      return false;
    }

    const result =
      (await response.json()) as {
        success?: boolean;
      };

    return (
      result.success === true
    );
  } catch {
    /*
     * Verification failures fail closed.
     */
    return false;
  }
}

/* =========================================================
   AUDIT LOG
========================================================= */

export async function writeAuditLog(
  input: {
    actorId: string | null;
    action: string;
    targetType: string;
    targetId?:
      | string
      | number
      | null;
    request: Request;
    metadata?: Record<
      string,
      unknown
    >;
  },
) {
  try {
    const admin =
      createAdminClient();

    const payload = {
      actor_id:
        input.actorId,

      action:
        input.action,

      target_type:
        input.targetType,

      target_id:
        input.targetId == null
          ? null
          : String(
              input.targetId,
            ),

      ip_address:
        getClientIp(
          input.request,
        ),

      metadata:
        input.metadata ??
        {},
    };

    const {
      data,
      error,
    } = await admin
      .from("audit_logs")
      .insert(
        payload,
      )
      .select(
        "id, actor_id, action, target_type, target_id, ip_address, metadata, created_at",
      )
      .maybeSingle();

    if (error) {
      console.error(
        "AUDIT LOG INSERT ERROR:",
        {
          message:
            error.message,

          details:
            error.details,

          hint:
            error.hint,

          code:
            error.code,
        },
      );

      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "AUDIT LOG UNEXPECTED ERROR:",
      error,
    );

    return {
      success: false,
      error,
    };
  }
}