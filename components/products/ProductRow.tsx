import Image from "next/image";

import ProductActions from "./ProductActions";

import type { Product } from "@/types/database";

type ProductRowProps = {
  product: Product;
  mobile?: boolean;
};

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "0";
  }

  return new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 2,
  }).format(price);
}

function ProductState({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        "text-[8px] font-bold uppercase tracking-[0.18em]",
        "transition-all duration-300",
        active
          ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
          : "border-white/[0.08] bg-white/[0.035] text-white/35",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          active
            ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]"
            : "bg-white/25",
        ].join(" ")}
      />

      {active ? "Active" : "Hidden"}
    </span>
  );
}

function InventoryState({
  stock,
}: {
  stock: number;
}) {
  const safeStock = Number.isFinite(stock)
    ? Math.max(0, stock)
    : 0;

  const percentage =
    safeStock === 0
      ? 0
      : Math.min(
          100,
          Math.max(10, safeStock * 5),
        );

  const tone =
    safeStock === 0
      ? "text-red-300"
      : safeStock <= 5
        ? "text-[#D7B96D]"
        : "text-emerald-300";

  const barTone =
    safeStock === 0
      ? "bg-red-400/70"
      : safeStock <= 5
        ? "bg-[#C9A227]"
        : "bg-emerald-400";

  return (
    <div className="min-w-[155px]">
      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            "text-[8px] font-bold uppercase tracking-[0.18em]",
            tone,
          ].join(" ")}
        >
          {safeStock === 0
            ? "Out of stock"
            : safeStock <= 5
              ? "Low stock"
              : "In stock"}
        </span>

        <span className="font-serif text-lg leading-none text-[#F0EBE1]">
          {safeStock}
        </span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={[
            "h-full rounded-full",
            "transition-all duration-700 ease-out",
            barTone,
          ].join(" ")}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function PriceDisplay({
  price,
}: {
  price: number;
}) {
  return (
    <div className="min-w-[135px]">
      <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-white/25">
        Current price
      </p>

      <p className="mt-1 font-serif text-xl leading-none tracking-[-0.02em] text-[#F1ECE2]">
        DA {formatPrice(price)}
      </p>
    </div>
  );
}

/* =========================================================
   ACTIONS WRAPPER

   يفرض لغة بصرية داكنة على ProductActions الحالي
   بدون تغيير وظائف View / Edit / Delete.
========================================================= */

function ActionsShell({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "shrink-0",
        compact
          ? [
              "rounded-xl",
              "[&_a]:!border-white/[0.08]",
              "[&_a]:!bg-white/[0.035]",
              "[&_a]:!text-white/65",
              "[&_a:hover]:!border-[#C9A227]/35",
              "[&_a:hover]:!bg-[#C9A227]/[0.08]",
              "[&_a:hover]:!text-[#C9A227]",
              "[&_button]:!border-white/[0.08]",
              "[&_button]:!bg-white/[0.035]",
              "[&_button]:!text-white/65",
              "[&_button:hover]:!border-[#C9A227]/35",
              "[&_button:hover]:!bg-[#C9A227]/[0.08]",
              "[&_button:hover]:!text-[#C9A227]",
            ]
          : [
              "rounded-xl",
              "[&_a]:!border-white/[0.08]",
              "[&_a]:!bg-[#1D1C19]",
              "[&_a]:!text-white/65",
              "[&_a:hover]:!border-[#C9A227]/35",
              "[&_a:hover]:!bg-[#C9A227]/[0.08]",
              "[&_a:hover]:!text-[#C9A227]",
              "[&_button]:!border-white/[0.08]",
              "[&_button]:!bg-[#1D1C19]",
              "[&_button]:!text-white/65",
              "[&_button:hover]:!border-[#C9A227]/35",
              "[&_button:hover]:!bg-[#C9A227]/[0.08]",
              "[&_button:hover]:!text-[#C9A227]",
            ],
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function ProductRow({
  product,
  mobile = false,
}: ProductRowProps) {
  const stock = Number(product.stock ?? 0);
  const active = Boolean(product.active);

  /* =========================================================
     MOBILE PRODUCT CARD
  ========================================================= */

  if (mobile) {
    return (
      <article
        className="
          group
          relative
          overflow-hidden
          rounded-[1.35rem]
          border
          border-white/[0.07]
          bg-[#181815]
          text-[#F1ECE2]
          shadow-[0_18px_50px_rgba(0,0,0,0.18)]
          transition-all
          duration-500
          hover:-translate-y-0.5
          hover:border-[#C9A227]/25
          hover:shadow-[0_22px_65px_rgba(0,0,0,0.25)]
        "
      >
        {/* =================================================
            CURSOR-LIKE SPOTLIGHT
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-52
            w-52
            rounded-full
            bg-[#C9A227]/[0.06]
            blur-[70px]
            opacity-70
            transition-all
            duration-700
            group-hover:bg-[#C9A227]/[0.1]
            group-hover:opacity-100
          "
        />

        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className="
            relative
            h-[220px]
            overflow-hidden
            border-b
            border-white/[0.07]
            bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.09),transparent_38%),linear-gradient(145deg,#1B1A17,#0E0E0D)]
          "
        >
          {/* top metadata */}

          <div className="absolute left-4 top-4 z-20">
            <span className="rounded-full border border-white/[0.08] bg-black/35 px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.2em] text-white/45 backdrop-blur-md">
              ORVEN LUX
            </span>
          </div>

          <div className="absolute right-4 top-4 z-20">
            <ProductState active={active} />
          </div>

          {/* ambient ring */}

          <div
            aria-hidden="true"
            className="
              absolute
              left-1/2
              top-1/2
              h-32
              w-32
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-[#C9A227]/10
              transition-all
              duration-700
              group-hover:h-36
              group-hover:w-36
              group-hover:border-[#C9A227]/20
            "
          />

          {/* image */}

          {product.image ? (
            <div className="absolute inset-0 flex items-center justify-center p-9">
              <Image
                src={product.image}
                alt={product.name}
                width={320}
                height={320}
                sizes="(max-width: 767px) 72vw, 320px"
                unoptimized
                className="
                  h-full
                  w-full
                  object-contain
                  drop-shadow-[0_24px_38px_rgba(0,0,0,0.5)]
                  transition-all
                  duration-700
                  ease-out
                  group-hover:scale-[1.045]
                  group-hover:-translate-y-1
                "
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A227]/15 bg-white/[0.025]">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">
                  No image
                </span>
              </div>
            </div>
          )}

          {/* bottom metadata */}

          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between">
            <div>
              <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-white/20">
                TIMEPIECE
              </p>

              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-[#C9A227]/70">
                ID / {product.id}
              </p>
            </div>

            <span
              aria-hidden="true"
              className="
                h-8
                w-8
                rounded-full
                border
                border-white/[0.08]
                bg-black/25
                transition-all
                duration-500
                group-hover:border-[#C9A227]/30
                group-hover:bg-[#C9A227]/[0.08]
              "
            />
          </div>
        </div>

        {/* =================================================
            MOBILE INFO
        ================================================= */}

        <div className="relative z-10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-[#C9A227]/70">
                ORVEN COLLECTION
              </p>

              <h3 className="mt-2 truncate font-serif text-xl tracking-[-0.02em] text-[#F2EDE2]">
                {product.name}
              </h3>

              <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-white/25">
                Product ID · {product.id}
              </p>
            </div>

            <div className="h-2 w-2 shrink-0 rounded-full bg-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.45)]" />
          </div>

          {/* Metrics */}

          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-white/[0.07] bg-[#121210]">
            <div className="px-3 py-4">
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/25">
                PRICE
              </p>

              <p className="mt-2 font-serif text-lg text-[#F0EBE1]">
                DA {formatPrice(
                  Number(product.price ?? 0),
                )}
              </p>
            </div>

            <div className="border-r border-white/[0.07] px-3 py-4">
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/25">
                STOCK
              </p>

              <div className="mt-2 flex items-center justify-between">
                <span
                  className={[
                    "font-serif text-lg",
                    stock === 0
                      ? "text-red-300"
                      : stock <= 5
                        ? "text-[#D7B96D]"
                        : "text-emerald-300",
                  ].join(" ")}
                >
                  {stock}
                </span>

                <span className="text-[7px] uppercase tracking-[0.12em] text-white/20">
                  units
                </span>
              </div>
            </div>
          </div>

          {/* Inventory */}

          <div className="mt-4">
            <InventoryState stock={stock} />
          </div>

          {/* Actions */}

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
            <div>
              <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/20">
                VISIBILITY
              </p>

              <div className="mt-2">
                <ProductState active={active} />
              </div>
            </div>

            <ActionsShell compact>
              <ProductActions
                id={product.id}
                compact
              />
            </ActionsShell>
          </div>
        </div>
      </article>
    );
  }

  /* =========================================================
     DESKTOP TABLE ROW
  ========================================================= */

  return (
    <tr
      className="
        group
        relative
        border-b
        border-white/[0.055]
        bg-[#171715]
        text-[#F1ECE2]
        transition-all
        duration-500
        hover:bg-[#1C1B18]
      "
    >
      {/* =================================================
          PRODUCT
      ================================================= */}

      <td className="relative px-5 py-5">
        <div className="absolute inset-y-0 right-0 w-px bg-transparent transition-all duration-500 group-hover:bg-[#C9A227]/30" />

        <div className="flex items-center gap-4">
          {/* Image */}

          <div
            className="
              relative
              flex
              h-[70px]
              w-[70px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-white/[0.08]
              bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.08),transparent_55%),#121210]
              shadow-[0_12px_28px_rgba(0,0,0,0.22)]
              transition-all
              duration-500
              group-hover:border-[#C9A227]/25
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                inset-2
                rounded-lg
                border
                border-white/[0.035]
              "
            />

            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={110}
                height={110}
                sizes="70px"
                unoptimized
                className="
                  relative
                  z-10
                  h-[60px]
                  w-[60px]
                  object-contain
                  drop-shadow-[0_10px_18px_rgba(0,0,0,0.42)]
                  transition-all
                  duration-500
                  group-hover:scale-[1.08]
                  group-hover:-translate-y-0.5
                "
              />
            ) : (
              <span className="relative z-10 text-[7px] font-bold uppercase tracking-[0.16em] text-white/20">
                N/A
              </span>
            )}
          </div>

          {/* Product identity */}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227] shadow-[0_0_8px_rgba(201,162,39,0.35)] transition-all duration-500 group-hover:scale-125" />

              <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#C9A227]/60">
                TIMEPIECE
              </span>
            </div>

            <p className="mt-2 max-w-[220px] truncate font-serif text-lg tracking-[-0.02em] text-[#F1ECE2]">
              {product.name}
            </p>

            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.16em] text-white/25">
              Product ID · {product.id}
            </p>
          </div>
        </div>
      </td>

      {/* =================================================
          PRICE
      ================================================= */}

      <td className="px-5 py-5">
        <PriceDisplay
          price={Number(product.price ?? 0)}
        />
      </td>

      {/* =================================================
          INVENTORY
      ================================================= */}

      <td className="px-5 py-5">
        <InventoryState stock={stock} />
      </td>

      {/* =================================================
          STATUS
      ================================================= */}

      <td className="px-5 py-5">
        <div className="flex flex-col items-start gap-2">
          <ProductState active={active} />

          <span className="text-[7px] uppercase tracking-[0.18em] text-white/20">
            {active
              ? "Visible in store"
              : "Hidden from store"}
          </span>
        </div>
      </td>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <td className="px-5 py-5">
        <ActionsShell>
          <ProductActions
            id={product.id}
          />
        </ActionsShell>
      </td>
    </tr>
  );
}