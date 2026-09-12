import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

type EcotrackResponse =
  Record<string, unknown>;

const ECOTRACK_API_URL =
  "https://platform.dhd-dz.com/api/v1/create/order";

/* =========================================================
   TEXT HELPERS
========================================================= */

function normalizeText(
  value: string,
) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[’'`]/g,
      "",
    )
    .replace(
      /[-_]/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function getErrorMessage(
  error: unknown,
) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Courier dispatch failed";
}

function getProductName(
  products: unknown,
) {
  if (Array.isArray(products)) {
    const first = products[0];

    if (
      first &&
      typeof first === "object" &&
      "name" in first
    ) {
      const name =
        first.name;

      return name == null
        ? ""
        : String(name);
    }

    return "";
  }

  if (
    products &&
    typeof products === "object" &&
    "name" in products
  ) {
    const name =
      products.name;

    return name == null
      ? ""
      : String(name);
  }

  return "";
}

/* =========================================================
   SAFE VALIDATION
========================================================= */

function isValidOrderId(
  value: number,
) {
  return (
    Number.isSafeInteger(value) &&
    value > 0
  );
}

function clampRetryAttempts(
  value: number,
) {
  if (!Number.isFinite(value)) {
    return 3;
  }

  return Math.max(
    1,
    Math.min(
      5,
      Math.floor(value),
    ),
  );
}

/* =========================================================
   COMMUNE LOOKUP
========================================================= */

async function findEcotrackCommune(
  supabase: ReturnType<
    typeof createAdminClient
  >,
  commune: string,
  wilaya: unknown,
) {
  const originalCommune =
    commune.trim();

  if (!originalCommune) {
    return "";
  }

  /* -------------------------------------------------------
     Exact Arabic database match
  ------------------------------------------------------- */

  const {
    data: exactCity,
    error: exactCityError,
  } =
    await supabase
      .from("algeria_cities")
      .select(
        "commune_name, commune_name_ascii",
      )
      .eq(
        "commune_name",
        originalCommune,
      )
      .limit(1)
      .maybeSingle();

  if (exactCityError) {
    console.error(
      "ECOTRACK EXACT COMMUNE LOOKUP ERROR:",
      {
        commune:
          originalCommune,
        message:
          exactCityError.message,
        code:
          exactCityError.code,
      },
    );
  }

  if (
    exactCity?.commune_name_ascii
  ) {
    return exactCity
      .commune_name_ascii
      .trim();
  }

  /* -------------------------------------------------------
     Wilaya fallback
  ------------------------------------------------------- */

  if (wilaya == null) {
    return originalCommune;
  }

  const wilayaCode =
    Number(wilaya);

  if (
    !Number.isInteger(
      wilayaCode,
    )
  ) {
    return originalCommune;
  }

  const {
    data: wilayaCities,
    error: citiesError,
  } =
    await supabase
      .from("algeria_cities")
      .select(
        "commune_name, commune_name_ascii",
      )
      .eq(
        "wilaya_code",
        wilayaCode,
      );

  if (citiesError) {
    console.error(
      "ECOTRACK WILAYA COMMUNE LOOKUP ERROR:",
      {
        wilayaCode,
        commune:
          originalCommune,
        message:
          citiesError.message,
        code:
          citiesError.code,
      },
    );

    return originalCommune;
  }

  const normalizedOrderCommune =
    normalizeText(
      originalCommune,
    );

  const matchedCity =
    wilayaCities?.find(
      (city) => {
        const databaseName =
          normalizeText(
            city.commune_name ??
              "",
          );

        const asciiName =
          normalizeText(
            city.commune_name_ascii ??
              "",
          );

        return (
          databaseName ===
            normalizedOrderCommune ||
          asciiName ===
            normalizedOrderCommune
        );
      },
    );

  if (
    matchedCity?.commune_name_ascii
  ) {
    return matchedCity
      .commune_name_ascii
      .trim();
  }

  return originalCommune;
}

/* =========================================================
   MARK PENDING
========================================================= */

async function markDispatchAsPending(
  supabase: ReturnType<
    typeof createAdminClient
  >,
  orderId: number,
  message: string,
  delaySeconds?: number,
) {
  const payload: Record<
    string,
    unknown
  > = {
    ecotrack_dispatch_state:
      "pending",

    ecotrack_error:
      message,
  };

  if (
    typeof delaySeconds ===
    "number"
  ) {
    payload.ecotrack_next_attempt_at =
      new Date(
        Date.now() +
          delaySeconds * 1000,
      ).toISOString();
  }

  const { error } =
    await supabase
      .from("orders")
      .update(payload)
      .eq(
        "id",
        orderId,
      );

  if (error) {
    console.error(
      "ECOTRACK MARK PENDING ERROR:",
      {
        orderId,
        message:
          error.message,
        code:
          error.code,
      },
    );
  }
}

/* =========================================================
   DISPATCH ORDER
========================================================= */

export async function dispatchOrderToEcotrack(
  orderId: number,
) {
  if (
    !isValidOrderId(
      orderId,
    )
  ) {
    throw new Error(
      "Invalid order id",
    );
  }

  const supabase =
    createAdminClient();

  /* =======================================================
     READ CURRENT STATE
  ======================================================= */

  const {
    data: currentOrder,
    error: currentOrderError,
  } =
    await supabase
      .from("orders")
      .select(
        "id, sent_to_ecotrack, ecotrack_dispatch_state, ecotrack_dispatch_attempts",
      )
      .eq(
        "id",
        orderId,
      )
      .maybeSingle();

  if (currentOrderError) {
    console.error(
      "ECOTRACK CURRENT ORDER LOOKUP ERROR:",
      {
        orderId,
        message:
          currentOrderError.message,
        code:
          currentOrderError.code,
      },
    );

    throw new Error(
      "Unable to read order before Ecotrack dispatch",
    );
  }

  if (!currentOrder) {
    throw new Error(
      "Order not found",
    );
  }

  if (
    currentOrder.sent_to_ecotrack ===
    true
  ) {
    return {
      dispatched: false,
      reason:
        "already_dispatched_or_processing" as const,
    };
  }

  /* =======================================================
     CLAIM ORDER
  ======================================================= */

  let claimQuery =
    supabase
      .from("orders")
      .update({
        ecotrack_dispatch_state:
          "processing",

        ecotrack_last_attempt_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        orderId,
      )
      .eq(
        "sent_to_ecotrack",
        false,
      );

  /*
   * Support:
   *
   * pending
   * NULL
   *
   * This preserves compatibility with older orders.
   */

  claimQuery =
    claimQuery.or(
      "ecotrack_dispatch_state.eq.pending,ecotrack_dispatch_state.is.null",
    );

  const {
    data: claimed,
    error: claimError,
  } =
    await claimQuery
      .select(
        "id, ecotrack_dispatch_attempts",
      )
      .maybeSingle();

  if (claimError) {
    console.error(
      "ECOTRACK CLAIM ERROR:",
      {
        orderId,
        message:
          claimError.message,
        code:
          claimError.code,
      },
    );

    throw new Error(
      "Unable to claim shipment",
    );
  }

  if (!claimed) {
    const {
      data: latestOrder,
      error:
        latestOrderError,
    } =
      await supabase
        .from("orders")
        .select(
          "id, sent_to_ecotrack, ecotrack_dispatch_state",
        )
        .eq(
          "id",
          orderId,
        )
        .maybeSingle();

    if (latestOrderError) {
      console.error(
        "ECOTRACK CLAIM RECHECK ERROR:",
        {
          orderId,
          message:
            latestOrderError.message,
          code:
            latestOrderError.code,
        },
      );
    }

    if (
      latestOrder?.sent_to_ecotrack ===
        true ||
      latestOrder?.ecotrack_dispatch_state ===
        "processing"
    ) {
      return {
        dispatched: false,
        reason:
          "already_dispatched_or_processing" as const,
      };
    }

    throw new Error(
      "Unable to claim shipment",
    );
  }

  const attempt =
    Number(
      claimed.ecotrack_dispatch_attempts ??
        0,
    ) + 1;

  const {
    error: attemptError,
  } =
    await supabase
      .from("orders")
      .update({
        ecotrack_dispatch_attempts:
          attempt,
      })
      .eq(
        "id",
        orderId,
      )
      .eq(
        "ecotrack_dispatch_state",
        "processing",
      );

  if (attemptError) {
    console.error(
      "ECOTRACK ATTEMPT UPDATE ERROR:",
      {
        orderId,
        attempt,
        message:
          attemptError.message,
        code:
          attemptError.code,
      },
    );
  }

  /* =======================================================
     LOAD FULL ORDER
  ======================================================= */

  const {
    data: order,
    error: orderError,
  } =
    await supabase
      .from("orders")
      .select(
        "*, products(name)",
      )
      .eq(
        "id",
        orderId,
      )
      .single();

  if (
    orderError ||
    !order
  ) {
    await markDispatchAsPending(
      supabase,
      orderId,
      "Order not found",
    );

    throw new Error(
      "Order not found",
    );
  }

  /* =======================================================
     DELIVERY TYPE
  ======================================================= */

  const isOfficeDelivery =
    order.delivery_type ===
    "office";

  const originalCommune =
    typeof order.commune ===
    "string"
      ? order.commune.trim()
      : "";

  const officeName =
    typeof order.office_name ===
    "string"
      ? order.office_name.trim()
      : "";

  /* =======================================================
     VALIDATE DESTINATION
  ======================================================= */

  /*
   * HOME:
   *   commune required
   *
   * OFFICE:
   *   officeName required
   *   commune may be empty
   */

  if (
    !isOfficeDelivery &&
    !originalCommune
  ) {
    const message =
      "اسم البلدية غير موجود في الطلب";

    await markDispatchAsPending(
      supabase,
      orderId,
      message,
    );

    throw new Error(message);
  }

  if (
    isOfficeDelivery &&
    !officeName
  ) {
    const message =
      "اسم مكتب التوصيل غير موجود في الطلب";

    await markDispatchAsPending(
      supabase,
      orderId,
      message,
    );

    throw new Error(message);
  }

  /* =======================================================
     ECOTRACK COMMUNE
  ======================================================= */

  /*
   * HOME:
   *   Customer commune is converted to Ecotrack name.
   *
   * OFFICE:
   *   Do not require commune.
   *   DHD receives the office as address + stop_desk=1.
   */

  const ecotrackCommune =
    isOfficeDelivery
      ? ""
      : await findEcotrackCommune(
          supabase,
          originalCommune,
          order.wilaya,
        );

  if (
    !isOfficeDelivery &&
    !ecotrackCommune
  ) {
    const message =
      "تعذر تحديد بلدية التوصيل لإرسال الطلب إلى Ecotrack";

    await markDispatchAsPending(
      supabase,
      orderId,
      message,
    );

    throw new Error(message);
  }

  /* =======================================================
     STOP DESK
  ======================================================= */

  const stopDesk =
    isOfficeDelivery
      ? "1"
      : "0";

  /* =======================================================
     PRODUCT
  ======================================================= */

  const productName =
    getProductName(
      order.products,
    );

  /* =======================================================
     API TOKEN
  ======================================================= */

  const apiToken =
    process.env.ECOTRACK_API_TOKEN?.trim();

  if (!apiToken) {
    const message =
      "ECOTRACK_API_TOKEN is not configured";

    await markDispatchAsPending(
      supabase,
      orderId,
      message,
    );

    throw new Error(message);
  }

  /* =======================================================
     ADDRESS
  ======================================================= */

  const originalAddress =
    typeof order.address ===
    "string"
      ? order.address.trim()
      : "";

  /*
   * HOME:
   *   customer's address
   *
   * OFFICE:
   *   selected DHD office name/address
   */

  const ecotrackAddress =
    isOfficeDelivery
      ? officeName
      : originalAddress ||
        ecotrackCommune ||
        originalCommune;

  if (!ecotrackAddress) {
    const message =
      "عنوان التوصيل غير موجود";

    await markDispatchAsPending(
      supabase,
      orderId,
      message,
    );

    throw new Error(message);
  }

  /* =======================================================
     PAYLOAD
  ======================================================= */

  const params =
    new URLSearchParams({
      reference:
        String(order.id),

      nom_client:
        order.customer_name ??
        "",

      telephone:
        order.phone ??
        "",

      adresse:
        ecotrackAddress,

      commune:
        ecotrackCommune,

      code_wilaya:
        String(
          order.wilaya ??
            "",
        ),

      montant:
        String(
          order.total_price ??
            0,
        ),

      remarque:
        order.note ??
        "",

      produit:
        productName,

      stock:
        "0",

      quantite:
        String(
          order.quantity ??
            1,
        ),

      boutique:
        "Orven Lux",

      type:
        "1",

      stop_desk:
        stopDesk,

      weight:
        "1",

      fragile:
        "0",
    });

  /* =======================================================
     SAFE LOGGING
  ======================================================= */

  console.log(
    "ECOTRACK DISPATCH:",
    {
      orderId:
        order.id,

      wilaya:
        order.wilaya,

      deliveryType:
        order.delivery_type,

      stopDesk,

      hasCommune:
        Boolean(
          ecotrackCommune,
        ),

      hasAddress:
        Boolean(
          ecotrackAddress,
        ),

      attempt,
    },
  );

  /* =======================================================
     SEND REQUEST
  ======================================================= */

  try {
    /*
     * IMPORTANT DHD COMPATIBILITY
     *
     * DHD historically accepted:
     *
     * 1. Authorization: Bearer TOKEN
     * 2. api_token=TOKEN query parameter
     *
     * We keep both because your previously successful
     * Ecotrack dispatch used this exact compatibility mode.
     *
     * The token is never logged.
     */

    const ecotrackUrl =
      `${ECOTRACK_API_URL}?api_token=${encodeURIComponent(
        apiToken,
      )}`;

    const response =
      await fetch(
        ecotrackUrl,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${apiToken}`,

            Accept:
              "application/json",

            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body:
            params.toString(),

          cache:
            "no-store",

          signal:
            AbortSignal.timeout(
              10_000,
            ),
        },
      );

    const raw =
      await response.text();

    /* ===================================================
       PARSE RESPONSE
    ==================================================== */

    let result:
      EcotrackResponse;

    try {
      const parsed:
        unknown =
        JSON.parse(raw);

      result =
        parsed &&
        typeof parsed ===
          "object"
          ? (parsed as EcotrackResponse)
          : {
              raw,
            };
    } catch {
      result = {
        raw,
      };
    }

    const apiMessage =
      typeof result.message ===
      "string"
        ? result.message
        : "";

    /* ===================================================
       AUTHENTICATION ERROR
    ==================================================== */

    if (
      response.status ===
      401
    ) {
      const message =
        "EcoTrack authentication failed (401). The DHD account token is not being accepted.";

      await markDispatchAsPending(
        supabase,
        orderId,
        apiMessage
          ? `${message} ${apiMessage}`
          : message,
      );

      throw new Error(
        message,
      );
    }

    /* ===================================================
       FORBIDDEN
    ==================================================== */

    if (
      response.status ===
      403
    ) {
      const message =
        "EcoTrack rejected the credentials or API permission (403).";

      await markDispatchAsPending(
        supabase,
        orderId,
        apiMessage
          ? `${message} ${apiMessage}`
          : message,
      );

      throw new Error(
        message,
      );
    }

    /* ===================================================
       OTHER API ERRORS
    ==================================================== */

    if (!response.ok) {
      const safeMessage =
        apiMessage ||
        `HTTP ${response.status}`;

      await markDispatchAsPending(
        supabase,
        orderId,
        `Ecotrack رفض الطلب: ${safeMessage}`,
      );

      throw new Error(
        `Ecotrack رفض الطلب: ${safeMessage}`,
      );
    }

    /* ===================================================
       TRACKING
    ==================================================== */

    const trackingNumber =
      typeof result.tracking ===
      "string"
        ? result.tracking
        : typeof result.tracking_number ===
            "string"
          ? result.tracking_number
          : typeof result.trackingNumber ===
              "string"
            ? result.trackingNumber
            : null;

    const ecotrackReference =
      typeof result.reference ===
      "string"
        ? result.reference
        : null;

    /* ===================================================
       UPDATE ORDER AFTER SUCCESS
    ==================================================== */

    const {
      error: updateError,
    } =
      await supabase
        .from("orders")
        .update({
          sent_to_ecotrack:
            true,

          ecotrack_dispatch_state:
            "sent",

          status:
            "تم الشحن",

          ecotrack_next_attempt_at:
            null,

          tracking_number:
            trackingNumber,

          ecotrack_reference:
            ecotrackReference,

          ecotrack_response:
            result,

          ecotrack_error:
            null,
        })
        .eq(
          "id",
          orderId,
        );

    if (updateError) {
      /*
       * DHD already accepted the shipment.
       * Never mark it pending again.
       */

      console.error(
        "ECOTRACK ACCEPTED / DATABASE UPDATE FAILED:",
        {
          orderId,
          message:
            updateError.message,
          code:
            updateError.code,
        },
      );

      throw new Error(
        "تم قبول الطلب من Ecotrack لكن تعذر تحديث قاعدة البيانات",
      );
    }

    console.log(
      "ECOTRACK DISPATCH SUCCESS:",
      {
        orderId:
          order.id,

        hasTracking:
          Boolean(
            trackingNumber,
          ),
      },
    );

    return {
      dispatched:
        true,

      result,
    };
  } catch (error) {
    const errorMessage =
      getErrorMessage(
        error,
      );

    /*
     * DHD accepted the shipment and only our local
     * database update failed.
     */
    if (
      errorMessage ===
      "تم قبول الطلب من Ecotrack لكن تعذر تحديث قاعدة البيانات"
    ) {
      throw error;
    }

    const delaySeconds =
      Math.min(
        60 * 60,
        30 *
          2 **
            Math.max(
              0,
              attempt - 1,
            ),
      );

    await markDispatchAsPending(
      supabase,
      orderId,
      errorMessage,
      delaySeconds,
    );

    throw error;
  }
}

/* =========================================================
   SLEEP
========================================================= */

const sleep = (
  ms: number,
) =>
  new Promise<void>(
    (resolve) => {
      setTimeout(
        resolve,
        ms,
      );
    },
  );

/* =========================================================
   RETRY
========================================================= */

export async function retryEcotrackDispatch(
  orderId: number,
  maxAttempts = 3,
) {
  if (
    !isValidOrderId(
      orderId,
    )
  ) {
    throw new Error(
      "Invalid order id",
    );
  }

  const safeMaxAttempts =
    clampRetryAttempts(
      maxAttempts,
    );

  let lastError:
    unknown;

  for (
    let attempt = 0;
    attempt <
    safeMaxAttempts;
    attempt++
  ) {
    try {
      const result =
        await dispatchOrderToEcotrack(
          orderId,
        );

      if (
        result.dispatched ||
        result.reason ===
          "already_dispatched_or_processing"
      ) {
        return result;
      }
    } catch (error) {
      lastError =
        error;

      console.error(
        "ECOTRACK RETRY ERROR:",
        {
          orderId,
          retry:
            attempt + 1,
          maxAttempts:
            safeMaxAttempts,
          message:
            error instanceof
            Error
              ? error.message
              : "Unknown error",
        },
      );

      if (
        attempt <
        safeMaxAttempts - 1
      ) {
        await sleep(
          500 *
            2 **
              attempt,
        );
      }
    }
  }

  throw lastError instanceof
    Error
    ? lastError
    : new Error(
        "Courier dispatch failed",
      );
}