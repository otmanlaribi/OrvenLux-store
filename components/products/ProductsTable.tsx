import ProductRow from "./ProductRow";

import type { Product } from "@/types/database";

type ProductsTableProps = {
  products: Product[];
};

export default function ProductsTable({
  products,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div
        className="
          overflow-hidden
          rounded-[1.75rem]
          border
          border-white/[0.08]
          bg-[#151513]
          shadow-[0_30px_90px_rgba(24,20,14,0.14)]
        "
      >
        <div
          className="
            relative
            flex
            min-h-[300px]
            flex-col
            items-center
            justify-center
            overflow-hidden
            px-6
            py-16
            text-center
          "
        >
          {/* Ambient light */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-52
              w-52
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#C9A227]/[0.05]
              blur-[80px]
            "
          />

          {/* Fine texture */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.025]
              [background-image:radial-gradient(rgba(255,255,255,0.8)_0.7px,transparent_0.7px)]
              [background-size:8px_8px]
            "
          />

          <div
            className="
              relative
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-[#C9A227]/20
              bg-[#C9A227]/[0.06]
              text-[#C9A227]
              shadow-[0_0_35px_rgba(201,162,39,0.05)]
            "
          >
            <span className="text-xl font-light">
              ∅
            </span>
          </div>

          <p className="relative text-sm font-semibold text-[#F1EDE4]">
            لا توجد منتجات
          </p>

          <p className="relative mt-2 max-w-sm text-xs leading-6 text-white/35">
            لم يتم العثور على منتجات مطابقة
            للبحث أو الفلاتر الحالية.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        group/table
        overflow-hidden
        rounded-[1.75rem]
        border
        border-white/[0.08]
        bg-[#151513]
        shadow-[0_30px_90px_rgba(24,20,14,0.14)]
      "
    >
      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table
            className="
              w-full
              border-separate
              border-spacing-0
              text-right
              [&_tbody_tr]:!bg-[#171715]
              [&_tbody_tr]:!text-[#EAE5DB]
              [&_tbody_td]:!border-white/[0.055]
              [&_tbody_td]:!bg-[#171715]
              [&_tbody_tr:hover_td]:!bg-[#1D1C19]
              [&_tbody_tr:hover_td]:transition-colors
              [&_tbody_tr:hover_td]:duration-300
            "
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <thead>
              <tr
                className="
                  bg-[#0B0B0A]
                  text-white
                  shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]
                "
              >
                <th className="px-5 py-5 text-[8px] font-black uppercase tracking-[0.18em] text-white/45">
                  PRODUCT
                </th>

                <th className="px-5 py-5 text-[8px] font-black uppercase tracking-[0.18em] text-white/45">
                  PRICE
                </th>

                <th className="px-5 py-5 text-[8px] font-black uppercase tracking-[0.18em] text-white/45">
                  INVENTORY
                </th>

                <th className="px-5 py-5 text-[8px] font-black uppercase tracking-[0.18em] text-white/45">
                  STATUS
                </th>

                <th className="px-5 py-5 text-left text-[8px] font-black uppercase tracking-[0.18em] text-white/45">
                  ACTIONS
                </th>
              </tr>
            </thead>

            {/* =================================================
                BODY
            ================================================= */}

            <tbody
              className="
                divide-y
                divide-white/[0.055]
                bg-[#171715]
              "
            >
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom signature */}
        <div className="flex items-center justify-between border-t border-white/[0.055] bg-[#121210] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227] shadow-[0_0_10px_rgba(201,162,39,0.45)]" />

            <span className="text-[7px] font-black uppercase tracking-[0.22em] text-white/25">
              ORVEN LUX / COLLECTION
            </span>
          </div>

          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/15">
            LIVE INVENTORY
          </span>
        </div>
      </div>

      {/* =====================================================
          MOBILE CATALOG
      ===================================================== */}

      <div
        className="
          grid
          gap-3
          bg-[#11110F]
          p-3
          md:hidden
        "
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-white/[0.07]
              bg-[#181815]
              transition-all
              duration-300
              hover:border-[#C9A227]/20
              hover:bg-[#1C1B18]
              hover:shadow-[0_14px_35px_rgba(0,0,0,0.18)]
            "
          >
            <ProductRow
              product={product}
              mobile
            />
          </div>
        ))}
      </div>

      {/* =====================================================
          TABLE FOOTER
      ===================================================== */}

      <div className="border-t border-white/[0.06] bg-[#0F0F0E] px-4 py-3 md:hidden">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#C9A227]/40" />

          <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white/25">
            ORVEN LUX
          </span>

          <span className="h-px w-8 bg-[#C9A227]/40" />
        </div>
      </div>
    </div>
  );
}