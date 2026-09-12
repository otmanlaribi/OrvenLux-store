import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited } from "@/lib/security";

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_REQUEST_BODY_BYTES = 16 * 1024;

const quoteSchema = z
  .object({
    productId: z
      .number()
      .int()
      .positive(),

    state: z
      .string()
      .trim()
      .min(1)
      .max(120),

    deliveryType: z.enum([
      "home",
      "office",
    ]),
  })
  .strict();

const WILAYA_MAP: Record<
  string,
  string
> = {
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
  "Aïn Témouchent": "عين تموشنت",
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

/*
 * Allow the storefront to send either:
 *
 * English wilaya name:
 *   Oran
 *
 * or the already-normalized Arabic database value:
 *   وهران
 *
 * The returned value is always the Arabic database value.
 */
const ARABIC_WILAYAS = new Set(
  Object.values(WILAYA_MAP),
);

function getArabicState(
  state: string,
): string | null {
  const normalized =
    state.trim();

  if (!normalized) {
    return null;
  }

  const mapped =
    WILAYA_MAP[normalized];

  if (mapped) {
    return mapped;
  }

  if (
    ARABIC_WILAYAS.has(
      normalized,
    )
  ) {
    return normalized;
  }

  return null;
}

function isValidPrice(
  value: unknown,
): value is number {
  const price =
    typeof value === "number"
      ? value
      : Number(value);

  return (
    Number.isFinite(price) &&
    price >= 0
  );
}

/* =========================================================
   REQUEST BODY SIZE
========================================================= */

function hasOversizedBody(
  request: Request,
) {
  const contentLength =
    request.headers.get(
      "content-length",
    );

  if (!contentLength) {
    return false;
  }

  const length =
    Number(contentLength);

  if (!Number.isFinite(length)) {
    return false;
  }

  return (
    length >
    MAX_REQUEST_BODY_BYTES
  );
}

/* =========================================================
   POST — CHECKOUT QUOTE
========================================================= */

export async function POST(
  request: Request,
) {
  try {
    /* =====================================================
       BASIC REQUEST HARDENING
    ====================================================== */

    if (
      hasOversizedBody(request)
    ) {
      return NextResponse.json(
        {
          error:
            "Request payload is too large",
        },
        {
          status: 413,
        },
      );
    }

    /* =====================================================
       RATE LIMIT
    ====================================================== */

    if (
      await isRateLimited(
        "quote",
        request,
        30,
        60_000,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please try again later.",
        },
        {
          status: 429,
        },
      );
    }

    /* =====================================================
       PARSE BODY
    ====================================================== */

    const body =
      await request
        .json()
        .catch(() => null);

    const parsed =
      quoteSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid request payload",
        },
        {
          status: 400,
        },
      );
    }

    const {
      productId,
      state,
      deliveryType,
    } = parsed.data;

    /* =====================================================
       VALIDATE WILAYA
    ====================================================== */

    const arabicState =
      getArabicState(state);

    if (!arabicState) {
      return NextResponse.json(
        {
          error:
            "Invalid wilaya",
        },
        {
          status: 400,
        },
      );
    }

    /* =====================================================
       DATABASE CLIENT
    ====================================================== */

    const admin =
      createAdminClient();

    /* =====================================================
       LOAD PRODUCT + SHIPPING

       We intentionally select only fields required
       for the quote.
    ====================================================== */

    const [
      productResult,
      shippingResult,
    ] = await Promise.all([
      admin
        .from("products")
        .select("price")
        .eq(
          "id",
          productId,
        )
        .eq(
          "active",
          true,
        )
        .maybeSingle(),

      admin
        .from("shipping_prices")
        .select(
          "home_price, office_price, state, wilaya_code",
        )
        .eq(
          "state",
          arabicState,
        )
        .maybeSingle(),
    ]);

    /* =====================================================
       PRODUCT DATABASE ERROR
    ====================================================== */

    if (
      productResult.error
    ) {
      console.error(
        "CHECKOUT QUOTE PRODUCT LOOKUP FAILED:",
        {
          message:
            productResult.error
              .message,
          code:
            productResult.error
              .code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify product",
        },
        {
          status: 500,
        },
      );
    }

    /* =====================================================
       PRODUCT NOT AVAILABLE
    ====================================================== */

    if (
      !productResult.data
    ) {
      return NextResponse.json(
        {
          error:
            "Product unavailable",
        },
        {
          status: 404,
        },
      );
    }

    /* =====================================================
       SHIPPING DATABASE ERROR
    ====================================================== */

    if (
      shippingResult.error
    ) {
      console.error(
        "CHECKOUT QUOTE SHIPPING LOOKUP FAILED:",
        {
          message:
            shippingResult.error
              .message,
          code:
            shippingResult.error
              .code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify shipping price",
        },
        {
          status: 500,
        },
      );
    }

    /* =====================================================
       SHIPPING NOT AVAILABLE
    ====================================================== */

    if (
      !shippingResult.data
    ) {
      return NextResponse.json(
        {
          error:
            "Shipping price unavailable",
        },
        {
          status: 404,
        },
      );
    }

    /* =====================================================
       READ DATABASE PRICES
    ====================================================== */

    const productPrice =
      Number(
        productResult.data
          .price,
      );

    const deliveryPrice =
      deliveryType ===
      "home"
        ? Number(
            shippingResult.data
              .home_price,
          )
        : Number(
            shippingResult.data
              .office_price,
          );

    /* =====================================================
       VALIDATE PRODUCT PRICE
    ====================================================== */

    if (
      !isValidPrice(
        productPrice,
      )
    ) {
      console.error(
        "CHECKOUT QUOTE INVALID PRODUCT PRICE:",
        {
          productId,
        },
      );

      return NextResponse.json(
        {
          error:
            "Invalid product price",
        },
        {
          status: 500,
        },
      );
    }

    /* =====================================================
       VALIDATE DELIVERY PRICE
    ====================================================== */

    if (
      !isValidPrice(
        deliveryPrice,
      )
    ) {
      console.error(
        "CHECKOUT QUOTE INVALID SHIPPING PRICE:",
        {
          state,
          arabicState,
          deliveryType,
        },
      );

      return NextResponse.json(
        {
          error:
            "Invalid shipping price",
        },
        {
          status: 500,
        },
      );
    }

    /* =====================================================
       CALCULATE TOTAL
    ====================================================== */

    const totalPrice =
      productPrice +
      deliveryPrice;

    if (
      !Number.isFinite(
        totalPrice,
      ) ||
      totalPrice < 0
    ) {
      console.error(
        "CHECKOUT QUOTE INVALID TOTAL:",
        {
          productId,
          deliveryType,
          productPrice,
          deliveryPrice,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to calculate order total",
        },
        {
          status: 500,
        },
      );
    }

    /* =====================================================
       RESPONSE
    ====================================================== */

    return NextResponse.json(
      {
        deliveryPrice,
        totalPrice,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "CHECKOUT QUOTE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to calculate checkout quote",
      },
      {
        status: 500,
      },
    );
  }
}