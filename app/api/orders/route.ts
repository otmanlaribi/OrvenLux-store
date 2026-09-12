import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  getClientIp,
  isRateLimited,
  requireAdmin,
  verifyCaptcha,
  writeAuditLog,
} from "@/lib/security";
import {
  orderSchema,
  validationError,
} from "@/lib/validation";
import {
  sendNewOrderTelegramNotification,
} from "@/lib/integrations/telegram";

const idempotencyKeyPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const orderIdSchema = z.coerce
  .number()
  .int()
  .positive();

type CreatedOrder = {
  id: number;
  total_price: number;
  delivery_price: number;
};

const WILAYA_MAP: Record<string, string> = {
  Adrar: "أدرار",
  Chlef: "الشلف",
  Laghouat: "الأغواط",
  "Oum El Bouaghi": "أم البواقي",
  Batna: "باتنة",
  "Béjaïa": "بجاية",
  Biskra: "بسكرة",
  Béchar: "بشار",
  Blida: "البليدة",
  Bouira: "البويرة",
  Tamanrasset: "تمنراست",
  Tébessa: "تبسة",
  Tlemcen: "تلمسان",
  Tiaret: "تيارت",
  "Tizi Ouzou": "تيزي وزو",
  Alger: "الجزائر",
  Djelfa: "الجلفة",
  Jijel: "جيجل",
  Sétif: "سطيف",
  Saïda: "سعيدة",
  Skikda: "سكيكدة",
  "Sidi Bel Abbès": "سيدي بلعباس",
  Annaba: "عنابة",
  Guelma: "قالمة",
  Constantine: "قسنطينة",
  Médéa: "المدية",
  Mostaganem: "مستغانم",
  "M'Sila": "المسيلة",
  Mascara: "معسكر",
  Ouargla: "ورقلة",
  Oran: "وهران",
  "El Bayadh": "البيض",
  Illizi: "إليزي",
  "Bordj Bou Arréridj":
    "برج بوعريريج",
  Boumerdès: "بومرداس",
  "El Tarf": "الطارف",
  Tindouf: "تندوف",
  Tissemsilt: "تيسمسيلت",
  "El Oued": "الوادي",
  Khenchela: "خنشلة",
  "Souk Ahras": "سوق أهراس",
  Tipaza: "تيبازة",
  Mila: "ميلة",
  "Aïn Defla": "عين الدفلى",
  Naâma: "النعامة",
  "Aïn Témouchent":
    "عين تموشنت",
  "Ghardaïa": "غرداية",
  Relizane: "غليزان",
  Timimoun: "تيميمون",
  "Bordj Badji Mokhtar":
    "برج باجي مختار",
  "Ouled Djellal":
    "أولاد جلال",
  "Béni Abbès": "بني عباس",
  "In Salah": "عين صالح",
  "In Guezzam": "عين قزام",
  Touggourt: "تقرت",
  Djanet: "جانت",
  "El M'Ghair": "المغير",
  "El Meniaa": "المنيعة",
};

function getArabicState(
  state: string,
) {
  return (
    WILAYA_MAP[state] ??
    state
  );
}

/* =========================================================
   POST — CREATE ORDER
========================================================= */

export async function POST(
  request: Request,
) {
  try {
    /* =====================================================
       01 — RATE LIMIT
    ===================================================== */

    if (
      await isRateLimited(
        "checkout",
        request,
        5,
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

    /* =====================================================
       02 — PARSE BODY
    ===================================================== */

    const body =
      await request
        .json()
        .catch(() => null);

    const parsed =
      orderSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        validationError(),
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       03 — VERIFY TURNSTILE
    ===================================================== */

    const ip =
      getClientIp(request);

    const captchaValid =
      await verifyCaptcha(
        parsed.data
          .captchaToken,
        ip ?? undefined,
      );

    if (!captchaValid) {
      return NextResponse.json(
        {
          error:
            "Verification failed",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       04 — IDEMPOTENCY KEY
    ===================================================== */

    const idempotencyKey =
      request.headers.get(
        "idempotency-key",
      );

    if (
      !idempotencyKey ||
      !idempotencyKeyPattern.test(
        idempotencyKey,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid idempotency key",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       05 — NORMALIZE WILAYA
    ===================================================== */

    const arabicState =
      getArabicState(
        parsed.data.state,
      );

    const isOfficeDelivery =
      parsed.data
        .deliveryType ===
      "office";

    /* =====================================================
       06 — COMMUNE
    ===================================================== */

    /*
     * Customer commune is required for both delivery types.
     * Office delivery still carries the customer's commune
     * for EcoTrack routing.
     */

    const commune =
      parsed.data.commune?.trim() ||
      null;

    if (!commune) {
      return NextResponse.json(
        {
          error:
            "Commune is required for all delivery methods",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       07 — ADDRESS
    ===================================================== */

    const address =
      isOfficeDelivery
        ? null
        : parsed.data.address?.trim() ||
          null;

    if (
      !isOfficeDelivery &&
      !address
    ) {
      return NextResponse.json(
        {
          error:
            "Delivery address is required",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       08 — OFFICE NAME
    ===================================================== */

    const officeName =
      isOfficeDelivery
        ? parsed.data.officeName?.trim() ||
          null
        : null;

    if (
      isOfficeDelivery &&
      !officeName
    ) {
      return NextResponse.json(
        {
          error:
            "Delivery office is required",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Deliberately do not log:
     * - customer address
     * - office full address
     * - phone
     *
     * These are customer data and are not needed
     * in normal production logs.
     */

    console.log(
      "CREATE ORDER:",
      {
        receivedState:
          parsed.data.state,
        databaseState:
          arabicState,
        deliveryType:
          parsed.data
            .deliveryType,
        hasCommune:
          Boolean(commune),
        hasAddress:
          Boolean(address),
        hasOffice:
          Boolean(officeName),
      },
    );

    /* =====================================================
       09 — CREATE ORDER THROUGH DATABASE RPC
    ===================================================== */

    const {
      data,
      error,
    } =
      await createAdminClient()
        .rpc(
          "create_checkout_order",
          {
            p_product_id:
              parsed.data
                .productId,

            p_customer_name:
              parsed.data
                .customerName,

            p_phone:
              parsed.data
                .phone,

            p_state:
              arabicState,

            /*
             * Always pass commune.
             */
            p_commune:
              commune,

            p_delivery_type:
              parsed.data
                .deliveryType,

            p_address:
              address,

            p_office_name:
              officeName,

            p_idempotency_key:
              idempotencyKey,
          },
        )
        .single();

    if (error || !data) {
      /*
       * Keep detailed database diagnostics
       * server-side only.
       */

      console.error(
        "CREATE ORDER ERROR:",
        {
          message:
            error?.message,
          details:
            error?.details,
          hint:
            error?.hint,
          code:
            error?.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to create order",
        },
        {
          status: 400,
        },
      );
    }

    const order =
      data as CreatedOrder;

    /* =====================================================
       10 — AUDIT CREATE
    ===================================================== */

    const auditResult =
      await writeAuditLog({
        actorId: null,

        action:
          "order.create",

        targetType:
          "order",

        targetId:
          order.id,

        request,

        metadata: {
          product_id:
            parsed.data
              .productId,

          delivery_type:
            parsed.data
              .deliveryType,

          wilaya:
            arabicState,

          has_commune:
            Boolean(commune),

          has_address:
            Boolean(address),

          has_office:
            Boolean(officeName),
        },
      });

    if (!auditResult.success) {
      /*
       * Do not fail a successful customer order
       * because the audit layer failed.
       */

      console.error(
        "ORDER CREATE AUDIT LOG FAILED:",
        {
          orderId:
            order.id,
          error:
            auditResult.error,
        },
      );
    }

    /* =====================================================
       11 — TELEGRAM NOTIFICATION
    ===================================================== */

    try {
      await sendNewOrderTelegramNotification(
        {
          id: order.id,

          customerName:
            parsed.data
              .customerName,

          phone:
            parsed.data
              .phone,

          totalPrice:
            order.total_price,

          status:
            "pending",

          wilaya:
            arabicState,

          commune,

          deliveryType:
            parsed.data
              .deliveryType,
        },
      );

      console.log(
        "TELEGRAM ORDER NOTIFICATION SENT:",
        {
          orderId:
            order.id,
        },
      );
    } catch (
      telegramError
    ) {
      /*
       * Telegram is notification only.
       * The order remains successful.
       */

      console.error(
        "TELEGRAM ORDER NOTIFICATION ERROR:",
        {
          orderId:
            order.id,
          error:
            telegramError,
        },
      );
    }

    /* =====================================================
       12 — SUCCESS
    ===================================================== */

    return NextResponse.json(
      order,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "ORDER API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV ===
          "development"
            ? error instanceof
              Error
              ? error.message
              : "Internal server error"
            : "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   DELETE — ADMIN ONLY
========================================================= */

export async function DELETE(
  request: Request,
) {
  try {
    /* =====================================================
       01 — ADMIN AUTHORIZATION
    ===================================================== */

    const auth =
      await requireAdmin(
        request,
      );

    if (!auth.ok) {
      return auth.response;
    }

    /* =====================================================
       02 — RATE LIMIT
    ===================================================== */

    if (
      await isRateLimited(
        "order-delete",
        request,
        20,
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

    /* =====================================================
       03 — READ ORDER ID
    ===================================================== */

    const url =
      new URL(request.url);

    const rawId =
      url.searchParams.get(
        "id",
      );

    const parsedId =
      orderIdSchema.safeParse(
        rawId,
      );

    if (!parsedId.success) {
      return NextResponse.json(
        {
          error:
            rawId
              ? "Invalid order id"
              : "Order id is required",
        },
        {
          status: 400,
        },
      );
    }

    const orderId =
      parsedId.data;

    /* =====================================================
       04 — LOAD ORDER
    ===================================================== */

    const admin =
      createAdminClient();

    const {
      data: existingOrder,
      error:
        existingOrderError,
    } = await admin
      .from("orders")
      .select(
        "id, status, sent_to_ecotrack, tracking_number, total_price",
      )
      .eq(
        "id",
        orderId,
      )
      .maybeSingle();

    if (existingOrderError) {
      console.error(
        "DELETE ORDER LOOKUP ERROR:",
        {
          orderId,
          message:
            existingOrderError.message,
          code:
            existingOrderError.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify order",
        },
        {
          status: 500,
        },
      );
    }

    if (!existingOrder) {
      return NextResponse.json(
        {
          error:
            "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Safety guard:
     *
     * Never silently remove an order that has already
     * been dispatched to EcoTrack.
     *
     * This protects the operational history from becoming
     * inconsistent with the courier platform.
     */
    if (
      existingOrder.sent_to_ecotrack ===
      true ||
      Boolean(
        existingOrder.tracking_number,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Dispatched orders cannot be deleted",
        },
        {
          status: 409,
        },
      );
    }

    console.log(
      "DELETE ORDER REQUEST:",
      {
        orderId,
        adminUserId:
          auth.userId,
      },
    );

    /* =====================================================
       05 — DELETE ORDER
    ===================================================== */

    const {
      data: deletedOrder,
      error: deleteError,
    } = await admin
      .from("orders")
      .delete()
      .eq(
        "id",
        orderId,
      )
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error(
        "DELETE ORDER DATABASE ERROR:",
        {
          orderId,
          adminUserId:
            auth.userId,
          message:
            deleteError.message,
          code:
            deleteError.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete order",
        },
        {
          status: 500,
        },
      );
    }

    if (!deletedOrder) {
      return NextResponse.json(
        {
          error:
            "Order was not deleted",
        },
        {
          status: 500,
        },
      );
    }

    /* =====================================================
       06 — FINAL VERIFICATION
    ===================================================== */

    const {
      data: remainingOrder,
      error: verifyError,
    } = await admin
      .from("orders")
      .select("id")
      .eq(
        "id",
        orderId,
      )
      .maybeSingle();

    if (verifyError) {
      console.error(
        "DELETE ORDER VERIFICATION ERROR:",
        {
          orderId,
          message:
            verifyError.message,
          code:
            verifyError.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Order deleted but verification failed",
        },
        {
          status: 500,
        },
      );
    }

    if (remainingOrder) {
      console.error(
        "DELETE ORDER: ROW STILL EXISTS",
        {
          orderId,
          adminUserId:
            auth.userId,
        },
      );

      return NextResponse.json(
        {
          error:
            "Order still exists after delete",
        },
        {
          status: 500,
        },
      );
    }

    /* =====================================================
       07 — AUDIT DELETE
    ===================================================== */

    const auditResult =
      await writeAuditLog({
        actorId:
          auth.userId,

        action:
          "order.delete",

        targetType:
          "order",

        targetId:
          orderId,

        request,

        metadata: {
          previous_status:
            existingOrder.status,

          sent_to_ecotrack:
            existingOrder.sent_to_ecotrack,

          had_tracking_number:
            Boolean(
              existingOrder.tracking_number,
            ),

          total_price:
            existingOrder.total_price,
        },
      });

    if (!auditResult.success) {
      /*
       * The destructive operation already succeeded.
       * Do not restore the order automatically.
       */
      console.error(
        "ORDER DELETE AUDIT LOG FAILED:",
        {
          orderId,
          adminUserId:
            auth.userId,
          error:
            auditResult.error,
        },
      );
    }

    console.log(
      "DELETE ORDER SUCCESS:",
      {
        orderId,
        adminUserId:
          auth.userId,
      },
    );

    /* =====================================================
       08 — RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
        id: deletedOrder.id,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "ORDER DELETE API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete order",
      },
      {
        status: 500,
      },
    );
  }
}