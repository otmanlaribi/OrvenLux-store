import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  isRateLimited,
  requireAdmin,
  writeAuditLog,
} from "@/lib/security";

/* =========================================================
   VALIDATION
========================================================= */

const customerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Customer name is required",
      )
      .max(
        120,
        "Customer name is too long",
      ),

    email: z
      .union([
        z
          .string()
          .trim()
          .email("Invalid email address")
          .max(254),
        z.literal(""),
        z.null(),
      ])
      .optional()
      .transform((value) => {
        if (
          value === null ||
          value === undefined
        ) {
          return null;
        }

        const normalized =
          value.trim();

        return normalized || null;
      }),

    phone: z
      .string()
      .trim()
      .min(
        5,
        "Customer phone is required",
      )
      .max(
        30,
        "Customer phone is too long",
      ),

    active: z
      .boolean()
      .default(true),
  })
  .strict();

/* =========================================================
   POST — ADMIN CREATE CUSTOMER
========================================================= */

export async function POST(
  request: Request,
) {
  /* -------------------------------------------------------
     01 — ADMIN AUTHENTICATION
  ------------------------------------------------------- */

  const auth =
    await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  /* -------------------------------------------------------
     02 — RATE LIMIT
  ------------------------------------------------------- */

  if (
    await isRateLimited(
      "customer-create",
      request,
      30,
      60_000,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Too many requests",
      },
      {
        status: 429,
      },
    );
  }

  try {
    /* -----------------------------------------------------
       03 — PARSE REQUEST BODY
    ----------------------------------------------------- */

    const body =
      await request
        .json()
        .catch(() => null);

    /* -----------------------------------------------------
       04 — VALIDATE INPUT
    ----------------------------------------------------- */

    const parsed =
      customerSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid customer data",
        },
        {
          status: 400,
        },
      );
    }

    const customer =
      parsed.data;

    /* -----------------------------------------------------
       05 — CREATE CUSTOMER
    ----------------------------------------------------- */

    const supabase =
      createAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from("customers")
      .insert({
        name:
          customer.name,
        email:
          customer.email,
        phone:
          customer.phone,
        active:
          customer.active,
      })
      .select(
        "id, name, email, phone, active",
      )
      .single();

    if (error || !data) {
      /*
       * Do NOT expose raw Supabase/Postgres
       * errors to the browser.
       */
      console.error(
        "CUSTOMER CREATE ERROR:",
        {
          message:
            error?.message,
          details:
            error?.details,
          hint:
            error?.hint,
          code:
            error?.code,
          adminUserId:
            auth.userId,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to create customer",
        },
        {
          status: 400,
        },
      );
    }

    /* -----------------------------------------------------
       06 — AUDIT LOG
    ----------------------------------------------------- */

    await writeAuditLog({
      actorId:
        auth.userId,

      action:
        "customer.create",

      targetType:
        "customer",

      targetId:
        data.id,

      request,
    });

    /* -----------------------------------------------------
       07 — SUCCESS
    ----------------------------------------------------- */

    return NextResponse.json(
      data,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "CUSTOMER POST ROUTE ERROR:",
      {
        adminUserId:
          auth.userId,
        error,
      },
    );

    return NextResponse.json(
      {
        error:
          "Unexpected server error",
      },
      {
        status: 500,
      },
    );
  }
}