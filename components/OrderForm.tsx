"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
  Building2,
  Home,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import Turnstile from "@/components/Turnstile";

type Props = {
  productId: number;
  productPrice: number;
};

type ShippingState = {
  state: string;
  wilaya_code: number;
};

type Office = {
  id?: number;
  state: string;
  office_name: string;
  address?: string | null;
  commune?: string | null;
};

type Commune = {
  commune_name: string;
  commune_name_ascii: string;
};

/* =========================================================
   ALGERIAN WILAYAS
========================================================= */

const ALGERIAN_WILAYAS: ShippingState[] = [
  { wilaya_code: 1, state: "Adrar" },
  { wilaya_code: 2, state: "Chlef" },
  { wilaya_code: 3, state: "Laghouat" },
  { wilaya_code: 4, state: "Oum El Bouaghi" },
  { wilaya_code: 5, state: "Batna" },
  { wilaya_code: 6, state: "Béjaïa" },
  { wilaya_code: 7, state: "Biskra" },
  { wilaya_code: 8, state: "Béchar" },
  { wilaya_code: 9, state: "Blida" },
  { wilaya_code: 10, state: "Bouira" },
  { wilaya_code: 11, state: "Tamanrasset" },
  { wilaya_code: 12, state: "Tébessa" },
  { wilaya_code: 13, state: "Tlemcen" },
  { wilaya_code: 14, state: "Tiaret" },
  { wilaya_code: 15, state: "Tizi Ouzou" },
  { wilaya_code: 16, state: "Alger" },
  { wilaya_code: 17, state: "Djelfa" },
  { wilaya_code: 18, state: "Jijel" },
  { wilaya_code: 19, state: "Sétif" },
  { wilaya_code: 20, state: "Saïda" },
  { wilaya_code: 21, state: "Skikda" },
  { wilaya_code: 22, state: "Sidi Bel Abbès" },
  { wilaya_code: 23, state: "Annaba" },
  { wilaya_code: 24, state: "Guelma" },
  { wilaya_code: 25, state: "Constantine" },
  { wilaya_code: 26, state: "Médéa" },
  { wilaya_code: 27, state: "Mostaganem" },
  { wilaya_code: 28, state: "M'Sila" },
  { wilaya_code: 29, state: "Mascara" },
  { wilaya_code: 30, state: "Ouargla" },
  { wilaya_code: 31, state: "Oran" },
  { wilaya_code: 32, state: "El Bayadh" },
  { wilaya_code: 33, state: "Illizi" },
  { wilaya_code: 34, state: "Bordj Bou Arréridj" },
  { wilaya_code: 35, state: "Boumerdès" },
  { wilaya_code: 36, state: "El Tarf" },
  { wilaya_code: 37, state: "Tindouf" },
  { wilaya_code: 38, state: "Tissemsilt" },
  { wilaya_code: 39, state: "El Oued" },
  { wilaya_code: 40, state: "Khenchela" },
  { wilaya_code: 41, state: "Souk Ahras" },
  { wilaya_code: 42, state: "Tipaza" },
  { wilaya_code: 43, state: "Mila" },
  { wilaya_code: 44, state: "Aïn Defla" },
  { wilaya_code: 45, state: "Naâma" },
  { wilaya_code: 46, state: "Aïn Témouchent" },
  { wilaya_code: 47, state: "Ghardaïa" },
  { wilaya_code: 48, state: "Relizane" },
  { wilaya_code: 49, state: "Timimoun" },
  { wilaya_code: 50, state: "Bordj Badji Mokhtar" },
  { wilaya_code: 51, state: "Ouled Djellal" },
  { wilaya_code: 52, state: "Béni Abbès" },
  { wilaya_code: 53, state: "In Salah" },
  { wilaya_code: 54, state: "In Guezzam" },
  { wilaya_code: 55, state: "Touggourt" },
  { wilaya_code: 56, state: "Djanet" },
  { wilaya_code: 57, state: "El M'Ghair" },
  { wilaya_code: 58, state: "El Meniaa" },
];

const WILAYA_ARABIC_NAMES: Record<string, string> = {
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
  "Bordj Bou Arréridj": "برج بوعريريج",
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
  "Bordj Badji Mokhtar": "برج باجي مختار",
  "Ouled Djellal": "أولاد جلال",
  "Béni Abbès": "بني عباس",
  "In Salah": "عين صالح",
  "In Guezzam": "عين قزام",
  Touggourt: "تقرت",
  Djanet: "جانت",
  "El M'Ghair": "المغير",
  "El Meniaa": "المنيعة",
};

/* =========================================================
   FIELD STYLE
========================================================= */

const fieldClass =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-medium text-stone-950 outline-none transition-all duration-300 placeholder:text-stone-400 focus:border-[#A0803F] focus:ring-4 focus:ring-[#C9A227]/10 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400";

/* =========================================================
   HELPERS
========================================================= */

function normalizeStateName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getArabicWilayaName(stateName: string) {
  const normalized = normalizeStateName(stateName);

  const entry = Object.entries(
    WILAYA_ARABIC_NAMES,
  ).find(
    ([englishName]) =>
      normalizeStateName(englishName) === normalized,
  );

  return entry?.[1] ?? stateName;
}

function extractWilayaCode(value: string) {
  const text = String(value ?? "").trim();

  if (!text) {
    return null;
  }

  const matches = text.match(/\d{1,3}/g);

  if (!matches) {
    return null;
  }

  for (const raw of matches) {
    const code = Number(raw);

    if (
      Number.isInteger(code) &&
      code >= 1 &&
      code <= 58
    ) {
      return code;
    }
  }

  return null;
}

function isOfficeForWilaya(
  office: Office,
  selectedState: ShippingState,
) {
  const officeState = String(
    office.state ?? "",
  ).trim();

  if (!officeState) {
    return false;
  }

  const officeWilayaCode =
    extractWilayaCode(officeState);

  if (
    officeWilayaCode !== null &&
    officeWilayaCode ===
      selectedState.wilaya_code
  ) {
    return true;
  }

  const normalizedOffice =
    normalizeStateName(officeState);

  const normalizedEnglish =
    normalizeStateName(
      selectedState.state,
    );

  if (
    normalizedOffice ===
      normalizedEnglish ||
    normalizedOffice.includes(
      normalizedEnglish,
    )
  ) {
    return true;
  }

  const normalizedArabic =
    normalizeStateName(
      getArabicWilayaName(
        selectedState.state,
      ),
    );

  if (
    normalizedOffice ===
      normalizedArabic ||
    normalizedOffice.includes(
      normalizedArabic,
    )
  ) {
    return true;
  }

  return false;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function OrderForm({
  productId,
  productPrice,
}: Props) {
  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [state, setState] =
    useState("");

  const [commune, setCommune] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [deliveryType, setDeliveryType] =
    useState<"home" | "office">("home");

  const [officeName, setOfficeName] =
    useState("");

  const [shippingStates] =
    useState<ShippingState[]>(
      ALGERIAN_WILAYAS,
    );

  const [offices, setOffices] =
    useState<Office[]>([]);

  const [communes, setCommunes] =
    useState<Commune[]>([]);

  const [quote, setQuote] =
    useState<{
      deliveryPrice: number;
      totalPrice: number;
    } | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [
    captchaToken,
    setCaptchaToken,
  ] = useState("");

  const idempotencyKey =
    useRef(
      crypto.randomUUID(),
    );

  const handleCaptchaToken =
    useCallback((token: string) => {
      setCaptchaToken(token);
    }, []);

  const currentState =
    shippingStates.find(
      (item) =>
        item.state === state,
    );

  const filteredOffices =
    useMemo(() => {
      if (!currentState) {
        return [];
      }

      return offices.filter(
        (office) =>
          isOfficeForWilaya(
            office,
            currentState,
          ),
      );
    }, [
      offices,
      currentState,
    ]);

  const selectedOffice =
    useMemo(() => {
      if (
        deliveryType !== "office" ||
        !officeName
      ) {
        return null;
      }

      return (
        filteredOffices.find(
          (office) =>
            office.office_name ===
            officeName,
        ) ?? null
      );
    }, [
      deliveryType,
      officeName,
      filteredOffices,
    ]);

  const displayedQuote =
    state ? quote : null;

  const formattedProductPrice =
    Number(productPrice).toLocaleString(
      "fr-FR",
    );

/* =========================================================
   LOAD OFFICES
========================================================= */

  useEffect(() => {
    let active = true;

    async function loadOffices() {
      try {
        const response = await fetch(
          "/api/delivery-offices",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result =
          (await response
            .json()
            .catch(() => null)) as
            | {
                offices?: Office[];
                error?: string;
              }
            | null;

        if (!active) {
          return;
        }

        if (
          !response.ok ||
          !result ||
          !Array.isArray(
            result.offices,
          )
        ) {
          console.error(
            "delivery_offices API error:",
            result?.error,
          );

          toast.error(
            "Unable to load delivery offices.",
          );

          setOffices([]);

          return;
        }

        setOffices(
          result.offices,
        );
      } catch (error) {
        console.error(
          "delivery_offices request failed:",
          error,
        );

        if (!active) {
          return;
        }

        toast.error(
          "Unable to load delivery offices.",
        );

        setOffices([]);
      }
    }

    void loadOffices();

    return () => {
      active = false;
    };
  }, []);

/* =========================================================
   LOAD COMMUNES
   IMPORTANT:
   Commune is required for BOTH delivery types.
========================================================= */

  useEffect(() => {
    let active = true;

    /*
     * Do not call setState synchronously here.
     * The current state is reset by handleStateChange().
     *
     * This satisfies React's effect rule while preserving
     * the exact existing commune-loading behavior.
     */
    if (!currentState) {
      return () => {
        active = false;
      };
    }

    void fetch(
      `/api/communes?wilaya=${currentState.wilaya_code}`,
      {
        cache: "no-store",
      },
    )
      .then((response) =>
        response.ok
          ? response.json()
          : [],
      )
      .then((data) => {
        if (!active) {
          return;
        }

        setCommunes(
          Array.isArray(data)
            ? data
            : [],
        );
      })
      .catch(() => {
        if (active) {
          setCommunes([]);
        }
      });

    return () => {
      active = false;
    };
  }, [currentState]);

/* =========================================================
   DELIVERY QUOTE
========================================================= */

  useEffect(() => {
    let active = true;

    /*
     * Quote is already cleared by:
     * - handleStateChange()
     * - handleDeliveryTypeChange()
     *
     * Therefore no synchronous setState is needed here.
     */
    if (!state) {
      return () => {
        active = false;
      };
    }

    void fetch(
      "/api/checkout/quote",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          productId,
          state,
          deliveryType,
        }),
      },
    )
      .then((response) =>
        response.ok
          ? response.json()
          : null,
      )
      .then((data) => {
        if (!active) {
          return;
        }

        setQuote(data);
      })
      .catch(() => {
        if (active) {
          setQuote(null);
        }
      });

    return () => {
      active = false;
    };
  }, [
    productId,
    state,
    deliveryType,
  ]);

/* =========================================================
   CHANGE WILAYA
========================================================= */

  function handleStateChange(
    nextState: string,
  ) {
    setState(nextState);

    /*
     * Commune always belongs to the selected Wilaya.
     * Therefore changing Wilaya must clear the previous
     * commune before loading the new list.
     */
    setCommune("");
    setCommunes([]);

    /*
     * Existing office selection becomes invalid whenever
     * Wilaya changes.
     */
    setOfficeName("");

    /*
     * Existing quote belongs to the previous Wilaya.
     */
    setQuote(null);
  }

/* =========================================================
   CHANGE DELIVERY TYPE
   Commune is intentionally preserved.
========================================================= */

  function handleDeliveryTypeChange(
    type: "home" | "office",
  ) {
    setDeliveryType(type);

    setQuote(null);

    if (type === "home") {
      /*
       * Switching back to home means no office
       * selection is necessary.
       */
      setOfficeName("");
    } else {
      /*
       * IMPORTANT:
       * Commune is intentionally preserved.
       *
       * The courier requires commune even for
       * delivery-office orders.
       *
       * Address is not submitted for office delivery.
       */
      setAddress("");
    }
  }

/* =========================================================
   SUBMIT ORDER
========================================================= */

  async function submitOrder() {
    const commonFieldsMissing =
      !customerName.trim() ||
      !phone.trim() ||
      !state ||
      !commune.trim() ||
      !captchaToken;

    const homeFieldsMissing =
      deliveryType === "home" &&
      !address.trim();

    const officeFieldsMissing =
      deliveryType === "office" &&
      (!officeName.trim() ||
        !selectedOffice ||
        filteredOffices.length === 0);

    if (
      commonFieldsMissing ||
      homeFieldsMissing ||
      officeFieldsMissing
    ) {
      toast.error(
        "Please complete all required fields",
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              "Idempotency-Key":
                idempotencyKey.current,
            },
            body: JSON.stringify({
              productId,

              customerName:
                customerName.trim(),

              phone:
                phone.trim(),

              state,

              /*
               * COMMUNE IS REQUIRED FOR BOTH:
               *
               * Home:
               *   customer's selected commune
               *
               * Office:
               *   customer's selected commune
               *
               * We intentionally do not use
               * selectedOffice.commune here.
               */
              commune:
                commune.trim(),

              deliveryType,

              address:
                deliveryType ===
                "home"
                  ? address.trim()
                  : undefined,

              officeName:
                deliveryType ===
                "office"
                  ? officeName.trim()
                  : undefined,

              captchaToken,
            }),
          },
        );

      if (!response.ok) {
        let errorMessage =
          "Unable to submit your order. Please try again.";

        try {
          const data =
            await response.json();

          if (
            typeof data?.error ===
            "string"
          ) {
            errorMessage =
              data.error;
          }
        } catch {
          // Keep generic message.
        }

        throw new Error(
          errorMessage,
        );
      }

      toast.success(
        "Order submitted successfully",
      );

      setCustomerName("");
      setPhone("");
      setState("");
      setCommune("");
      setAddress("");
      setOfficeName("");
      setDeliveryType("home");
      setCommunes([]);
      setQuote(null);
      setCaptchaToken("");

      idempotencyKey.current =
        crypto.randomUUID();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit your order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-[#F7F5EF] shadow-[0_24px_80px_rgba(22,20,16,0.10)]">
      {/* =====================================================
          TOP GOLD LINE
      ====================================================== */}

      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/70 to-transparent" />

      <div className="relative p-5 sm:p-7 lg:p-8">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/[0.07] text-[#A0803F]">
            <CheckCircle2
              size={21}
              strokeWidth={1.5}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#9A793D]">
                Private purchase
              </span>
            </div>

            <h2 className="mt-2 font-serif text-2xl tracking-[-0.025em] text-[#171715] sm:text-3xl">
              Complete your order
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-6 text-stone-500 sm:text-sm">
              Choose your delivery details below.
              Our team will personally confirm your
              order before dispatch.
            </p>
          </div>
        </div>

        {/* ===================================================
            MINI TRUST BAR
        ==================================================== */}

        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="flex items-center gap-2 border-r border-stone-200 px-3 py-3">
            <ShieldCheck
              size={15}
              strokeWidth={1.5}
              className="shrink-0 text-[#A0803F]"
            />

            <span className="text-[7px] font-semibold uppercase tracking-[0.13em] text-stone-500 sm:text-[8px]">
              Secure
            </span>
          </div>

          <div className="flex items-center gap-2 border-r border-stone-200 px-3 py-3">
            <Truck
              size={15}
              strokeWidth={1.5}
              className="shrink-0 text-[#A0803F]"
            />

            <span className="text-[7px] font-semibold uppercase tracking-[0.13em] text-stone-500 sm:text-[8px]">
              Nationwide
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-3">
            <Check
              size={15}
              strokeWidth={1.7}
              className="shrink-0 text-[#A0803F]"
            />

            <span className="text-[7px] font-semibold uppercase tracking-[0.13em] text-stone-500 sm:text-[8px]">
              COD
            </span>
          </div>
        </div>

        {/* ===================================================
            CUSTOMER INFORMATION
        ==================================================== */}

        <div className="mt-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#C9A227]" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#8D8880]">
              Your details
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-stone-700">
              Full name

              <input
                aria-label="Full name"
                className={`${fieldClass} mt-2`}
                value={customerName}
                onChange={(event) =>
                  setCustomerName(
                    event.target.value,
                  )
                }
                placeholder="Your full name"
                autoComplete="name"
              />
            </label>

            <label className="text-xs font-semibold text-stone-700">
              Phone number

              <input
                aria-label="Phone number"
                className={`${fieldClass} mt-2`}
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value,
                  )
                }
                placeholder="0X XX XX XX XX"
                inputMode="tel"
                autoComplete="tel"
              />
            </label>
          </div>
        </div>

        {/* ===================================================
            LOCATION
        ==================================================== */}

        <div className="mt-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#C9A227]" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#8D8880]">
              Delivery location
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* WILAYA */}

            <label className="text-xs font-semibold text-stone-700">
              Wilaya

              <div className="relative">
                <select
                  aria-label="Wilaya"
                  required
                  className={`${fieldClass} mt-2 appearance-none pr-10`}
                  value={state}
                  onChange={(event) =>
                    handleStateChange(
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Choose a wilaya
                  </option>

                  {shippingStates.map(
                    (item) => (
                      <option
                        key={
                          item.wilaya_code
                        }
                        value={
                          item.state
                        }
                      >
                        {
                          item.wilaya_code
                        }{" "}
                        —{" "}
                        {getArabicWilayaName(
                          item.state,
                        )}
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={16}
                  strokeWidth={1.6}
                  className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-stone-400"
                />
              </div>
            </label>

            {/* COMMUNE — ALWAYS REQUIRED */}

            <label className="text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-2">
                Commune

                <span className="rounded-full bg-[#A0803F]/10 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.08em] text-[#8D6F37]">
                  Required
                </span>
              </span>

              <div className="relative">
                <select
                  aria-label="Commune"
                  required
                  className={`${fieldClass} mt-2 appearance-none pr-10`}
                  value={commune}
                  onChange={(event) =>
                    setCommune(
                      event.target.value,
                    )
                  }
                  disabled={!state}
                >
                  <option value="">
                    {!state
                      ? "Choose a wilaya first"
                      : communes.length ===
                          0
                        ? "Loading communes..."
                        : "Choose a commune"}
                  </option>

                  {communes.map(
                    (item) => (
                      <option
                        key={
                          item.commune_name_ascii
                        }
                        value={
                          item.commune_name
                        }
                      >
                        {
                          item.commune_name
                        }
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={16}
                  strokeWidth={1.6}
                  className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-stone-400"
                />
              </div>

              <p className="mt-2 text-[10px] font-normal leading-4 text-stone-400">
                Required for all delivery methods,
                including delivery office.
              </p>
            </label>
          </div>
        </div>

        {/* ===================================================
            DELIVERY METHOD
        ==================================================== */}

        <fieldset className="mt-7">
          <legend className="mb-4 text-xs font-semibold text-stone-700">
            Delivery method
          </legend>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                handleDeliveryTypeChange(
                  "home",
                )
              }
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                deliveryType ===
                "home"
                  ? "border-[#A0803F]/55 bg-[#1A1916] text-white shadow-[0_12px_30px_rgba(20,18,14,0.15)]"
                  : "border-stone-200 bg-white text-stone-700 hover:border-[#A0803F]/35"
              }`}
            >
              <div className="relative z-10 flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    deliveryType ===
                    "home"
                      ? "border-[#C9A227]/30 bg-[#C9A227]/10 text-[#C9A227]"
                      : "border-stone-200 bg-stone-50 text-stone-500"
                  }`}
                >
                  <Home
                    size={17}
                    strokeWidth={1.4}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Home delivery
                  </p>

                  <p
                    className={`mt-1 text-[10px] leading-4 ${
                      deliveryType ===
                      "home"
                        ? "text-white/40"
                        : "text-stone-400"
                    }`}
                  >
                    Delivered directly to your
                    address.
                  </p>
                </div>
              </div>

              {deliveryType ===
                "home" && (
                <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A227] text-[#171715]">
                  <Check
                    size={11}
                    strokeWidth={2.5}
                  />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                handleDeliveryTypeChange(
                  "office",
                )
              }
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                deliveryType ===
                "office"
                  ? "border-[#A0803F]/55 bg-[#1A1916] text-white shadow-[0_12px_30px_rgba(20,18,14,0.15)]"
                  : "border-stone-200 bg-white text-stone-700 hover:border-[#A0803F]/35"
              }`}
            >
              <div className="relative z-10 flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    deliveryType ===
                    "office"
                      ? "border-[#C9A227]/30 bg-[#C9A227]/10 text-[#C9A227]"
                      : "border-stone-200 bg-stone-50 text-stone-500"
                  }`}
                >
                  <Building2
                    size={17}
                    strokeWidth={1.4}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Delivery office
                  </p>

                  <p
                    className={`mt-1 text-[10px] leading-4 ${
                      deliveryType ===
                      "office"
                        ? "text-white/40"
                        : "text-stone-400"
                    }`}
                  >
                    Collect your order from
                    a delivery office.
                  </p>
                </div>
              </div>

              {deliveryType ===
                "office" && (
                <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A227] text-[#171715]">
                  <Check
                    size={11}
                    strokeWidth={2.5}
                  />
                </span>
              )}
            </button>
          </div>
        </fieldset>

        {/* ===================================================
            DELIVERY DESTINATION
        ==================================================== */}

        <div className="mt-5">
          {deliveryType ===
          "home" ? (
            <label className="text-xs font-semibold text-stone-700">
              Full address

              <input
                aria-label="Full address"
                required
                className={`${fieldClass} mt-2`}
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value,
                  )
                }
                placeholder="Street, building, area"
                autoComplete="street-address"
              />

              <p className="mt-2 text-[10px] font-normal text-stone-400">
                Include enough detail for the
                courier to find you easily.
              </p>
            </label>
          ) : (
            <div className="rounded-2xl border border-[#C9A227]/15 bg-[#C9A227]/[0.035] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Building2
                  size={15}
                  strokeWidth={1.4}
                  className="text-[#A0803F]"
                />

                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#8D6F37]">
                  Choose delivery office
                </span>
              </div>

              <label className="text-xs font-semibold text-stone-700">
                Delivery office

                <div className="relative">
                  <select
                    aria-label="Delivery office"
                    required
                    className={`${fieldClass} mt-2 appearance-none pr-10`}
                    value={officeName}
                    onChange={(event) =>
                      setOfficeName(
                        event.target.value,
                      )
                    }
                    disabled={
                      !state ||
                      filteredOffices.length ===
                        0
                    }
                  >
                    <option value="">
                      {!state
                        ? "Choose a wilaya first"
                        : filteredOffices.length ===
                            0
                          ? "No office available"
                          : "Choose an office"}
                    </option>

                    {filteredOffices.map(
                      (
                        office,
                        index,
                      ) => (
                        <option
                          key={
                            office.id ??
                            `${office.state}-${office.office_name}-${index}`
                          }
                          value={
                            office.office_name
                          }
                        >
                          {
                            office.office_name
                          }
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown
                    size={16}
                    strokeWidth={1.6}
                    className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-stone-400"
                  />
                </div>
              </label>

              {state &&
                filteredOffices.length >
                  0 && (
                  <p className="mt-2 text-[10px] font-normal text-stone-500">
                    {filteredOffices.length ===
                    1
                      ? "1 delivery office available"
                      : `${filteredOffices.length} delivery offices available`}
                  </p>
                )}

              {selectedOffice && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-stone-200 bg-white px-3 py-3">
                  <MapPin
                    size={13}
                    strokeWidth={1.4}
                    className="mt-0.5 shrink-0 text-[#A0803F]"
                  />

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-stone-400">
                      Selected office
                    </p>

                    <p className="mt-1 text-xs font-medium text-stone-700">
                      {
                        selectedOffice.office_name
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================================
            PRICE
        ==================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                Product
              </p>

              <p className="mt-1 font-serif text-base text-stone-900">
                {formattedProductPrice}{" "}
                <span className="font-sans text-[8px] uppercase tracking-[0.15em] text-stone-400">
                  DZD
                </span>
              </p>
            </div>

            <div className="h-8 w-px bg-stone-200" />

            <div className="text-right">
              <p className="inline-flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                <MapPin size={11} />

                Delivery
              </p>

              <p className="mt-1 text-sm font-semibold text-stone-900">
                {displayedQuote?.deliveryPrice ??
                  "—"}{" "}
                <span className="text-[9px] font-medium text-stone-400">
                  DA
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-stone-200 bg-[#F8F6F0] px-4 py-4">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#8D8880]">
                Order total
              </p>
            </div>

            <div className="text-right">
              <p className="font-serif text-2xl tracking-[-0.02em] text-stone-950">
                {displayedQuote?.totalPrice ??
                  "—"}{" "}
                <span className="font-sans text-[8px] uppercase tracking-[0.15em] text-stone-400">
                  DA
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            CAPTCHA
        ==================================================== */}

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck
              size={14}
              strokeWidth={1.4}
              className="text-[#A0803F]"
            />

            <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-stone-400">
              Secure verification
            </span>
          </div>

          <Turnstile
            onToken={
              handleCaptchaToken
            }
          />
        </div>

        {/* ===================================================
            SUBMIT
        ==================================================== */}

        <button
          type="button"
          onClick={submitOrder}
          disabled={loading}
          className="
            group
            relative
            mt-5
            flex
            min-h-[58px]
            w-full
            items-center
            justify-between
            overflow-hidden
            rounded-2xl
            border
            border-[#A0803F]/50
            bg-[#171715]
            px-5
            text-[#F7F5EF]
            shadow-[0_15px_35px_rgba(20,18,14,0.12)]
            transition-all
            duration-500
            hover:-translate-y-0.5
            hover:border-[#C9A227]/70
            hover:bg-[#201F1B]
            hover:shadow-[0_20px_45px_rgba(20,18,14,0.16)]
            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:hover:translate-y-0
          "
        >
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-[-50%]
              -left-[55%]
              w-[34%]
              -skew-x-[18deg]
              bg-[#E2C76D]/10
              transition-all
              duration-700
              group-hover:left-[120%]
            "
          />

          <span className="relative z-10 flex items-center gap-3">
            {loading ? (
              <>
                <Loader2
                  size={17}
                  strokeWidth={1.5}
                  className="animate-spin text-[#C9A227]"
                  aria-hidden="true"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.24em]">
                  Submitting order...
                </span>
              </>
            ) : (
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em]">
                Confirm secure order
              </span>
            )}
          </span>

          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 text-[#C9A227]">
            {loading ? (
              <Loader2
                size={13}
                className="animate-spin"
              />
            ) : (
              <Check
                size={14}
                strokeWidth={1.6}
              />
            )}
          </span>
        </button>

        {/* ===================================================
            FOOTER REASSURANCE
        ==================================================== */}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <span className="flex items-center gap-1.5 text-[7px] font-medium uppercase tracking-[0.18em] text-stone-400">
            <ShieldCheck
              size={11}
              strokeWidth={1.4}
              className="text-[#A0803F]"
            />
            Secure order
          </span>

          <span className="h-3 w-px bg-stone-200" />

          <span className="flex items-center gap-1.5 text-[7px] font-medium uppercase tracking-[0.18em] text-stone-400">
            <Truck
              size={11}
              strokeWidth={1.4}
              className="text-[#A0803F]"
            />
            Pay on delivery
          </span>

          <span className="h-3 w-px bg-stone-200" />

          <span className="text-[7px] font-medium uppercase tracking-[0.18em] text-stone-400">
            ORVEN LUX
          </span>
        </div>
      </div>
    </section>
  );
}