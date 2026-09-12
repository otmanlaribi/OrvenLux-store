import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  isRateLimited,
  requireAdmin,
  writeAuditLog,
} from "@/lib/security";
import {
  orderStatusSchema,
  validationError,
} from "@/lib/validation";

const idSchema = z.coerce
  .number()
  .int()
  .positive();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  /* =========================================================
     01 — ADMIN AUTHORIZATION
  ========================================================= */

  const auth = await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  /* =========================================================
     02 — RATE LIMIT
  ========================================================= */

  if (
    await isRateLimited(
      "order-status",
      request,
      30,
      60_000,
    )
  ) {
    return NextResponse.json(
      {
        error: "Too many requests",
      },
      {
        status: 429,
      },
    );
  }

  try {
    /* =======================================================
       03 — VALIDATE ORDER ID
    ======================================================= */

    const resolvedParams = await params;

    const parsedId = idSchema.safeParse(
      resolvedParams.id,
    );

    if (!parsedId.success) {
      return NextResponse.json(
        {
          error: "Invalid order id",
        },
        {
          status: 400,
        },
      );
    }

    const orderId = parsedId.data;

    /* =======================================================
       04 — PARSE + VALIDATE BODY
    ======================================================= */

    const body = await request
      .json()
      .catch(() => null);

    const parsedStatus =
      orderStatusSchema.safeParse(body);

    if (!parsedStatus.success) {
      return NextResponse.json(
        validationError(),
        {
          status: 400,
        },
      );
    }

    const newStatus =
      parsedStatus.data.status;

    /* =======================================================
       05 — LOAD CURRENT ORDER
    ======================================================= */

    const admin =
      createAdminClient();

    const {
      data: currentOrder,
      error: currentOrderError,
    } = await admin
      .from("orders")
      .select(
        "id, status, sent_to_ecotrack, ecotrack_dispatch_state",
      )
      .eq("id", orderId)
      .maybeSingle();

    if (currentOrderError) {
      console.error(
        "ORDER STATUS LOOKUP ERROR:",
        {
          orderId,
          error: currentOrderError,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to update order status",
        },
        {
          status: 500,
        },
      );
    }

    if (!currentOrder) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    const previousStatus =
      currentOrder.status ?? null;

    /* =======================================================
       06 — NO-OP PROTECTION
    ======================================================= */

    if (previousStatus === newStatus) {
      return NextResponse.json({
        id: currentOrder.id,
        status: currentOrder.status,
      });
    }

    /* =======================================================
       07 — UPDATE STATUS
    ======================================================= */

    const {
      data: updatedOrder,
      error: updateError,
    } = await admin
      .from("orders")
      .update({
        status: newStatus,
      })
      .eq("id", orderId)
      .select(
        "id, status, sent_to_ecotrack, ecotrack_dispatch_state",
      )
      .maybeSingle();

    if (updateError) {
      console.error(
        "ORDER STATUS UPDATE ERROR:",
        {
          orderId,
          previousStatus,
          newStatus,
          error: updateError,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to update order status",
        },
        {
          status: 500,
        },
      );
    }

    if (!updatedOrder) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    /* =======================================================
       08 — AUDIT LOG
    ======================================================= */

    const auditResult =
      await writeAuditLog({
        actorId: auth.userId,

        action:
          "order.status_update",

        targetType:
          "order",

        targetId:
          orderId,

        request,

        metadata: {
          previous_status:
            previousStatus,

          new_status:
            updatedOrder.status,

          sent_to_ecotrack:
            updatedOrder.sent_to_ecotrack,

          ecotrack_dispatch_state:
            updatedOrder.ecotrack_dispatch_state,
        },
      });

    if (!auditResult.success) {
      /*
       * The order status was already changed successfully.
       * Do not roll the business operation back only because
       * audit logging failed.
       */
      console.error(
        "ORDER STATUS AUDIT LOG FAILED:",
        {
          orderId,
          actorId: auth.userId,
          previousStatus,
          newStatus:
            updatedOrder.status,
          error:
            auditResult.error,
        },
      );
    }

    /* =======================================================
       09 — RESPONSE
    ======================================================= */

    return NextResponse.json({
      id: updatedOrder.id,
      status: updatedOrder.status,
    });
  } catch (error) {
    console.error(
      "ORDER STATUS PATCH ROUTE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update order status",
      },
      {
        status: 500,
      },
    );
  }
}