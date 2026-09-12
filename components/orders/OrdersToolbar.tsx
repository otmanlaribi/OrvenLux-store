import {
  ChevronDown,
  ListFilter,
  SlidersHorizontal,
} from "lucide-react";

import OrdersStatusFilter from "./OrdersStatusFilter";

type OrdersToolbarProps = {
  totalOrders: number;
};

export default function OrdersToolbar({
  totalOrders,
}: OrdersToolbarProps) {
  return (
    <section
      dir="rtl"
      className="
        group
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.07]
        bg-[#111111]
        shadow-[0_20px_55px_rgba(0,0,0,0.22)]
        sm:rounded-[24px]
      "
    >
      {/* =====================================================
          Ambient console glow
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[#C9A227]/[0.035]
            blur-[70px]
            transition-opacity
            duration-700
            group-hover:opacity-100
          "
        />

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-16
            bg-gradient-to-b
            from-white/[0.025]
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-x-6
            bottom-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#C9A227]/20
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          Console Header
          ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-4
          border-b
          border-white/[0.06]
          px-5
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[#C9A227]/20
              bg-[#C9A227]/[0.045]
              text-[#C9A227]
            "
          >
            <SlidersHorizontal
              size={14}
              strokeWidth={1.6}
            />
          </div>

          <div>
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-white/28
              "
            >
              Command Interface
            </p>

            <p
              className="
                mt-0.5
                text-xs
                font-medium
                text-white/65
              "
            >
              Order Control
            </p>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            text-[9px]
            uppercase
            tracking-[0.2em]
            text-white/25
          "
        >
          <span
            aria-hidden="true"
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#C9A227]
              shadow-[0_0_10px_rgba(201,162,39,0.65)]
            "
          />

          Live Registry
        </div>
      </div>

      {/* =====================================================
          Controls
          ===================================================== */}

      <div
        className="
          relative
          z-10
          p-4
          sm:p-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:flex-wrap
            sm:items-center
            sm:justify-end
          "
        >
          {/* =================================================
              Status Filter
              ================================================= */}

          <div
            className="
              rounded-[15px]
              border
              border-white/[0.07]
              bg-[#0B0B0B]
              p-0.5
              transition-all
              duration-300
              hover:border-white/[0.11]
            "
          >
            <OrdersStatusFilter />
          </div>

          {/* =================================================
              Sort
              ================================================= */}

          <button
            type="button"
            aria-label="فرز الطلبات حسب الأحدث"
            className="
              group/sort
              inline-flex
              min-h-[44px]
              items-center
              justify-center
              gap-2
              rounded-[15px]
              border
              border-white/[0.07]
              bg-[#0B0B0B]
              px-3.5
              text-xs
              font-medium
              text-white/55
              shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
              transition-all
              duration-300
              hover:border-[#C9A227]/25
              hover:bg-[#131313]
              hover:text-[#F7F5F0]
            "
          >
            <ListFilter
              size={15}
              strokeWidth={1.6}
              className="
                text-white/35
                transition-transform
                duration-300
                group-hover/sort:rotate-[-8deg]
                group-hover/sort:text-[#C9A227]
              "
            />

            <span>
              الأحدث أولًا
            </span>

            <ChevronDown
              size={13}
              strokeWidth={1.5}
              className="
                text-white/25
                transition-transform
                duration-300
                group-hover/sort:translate-y-0.5
              "
            />
          </button>

          {/* =================================================
              Counter
              ================================================= */}

          <div
            className="
              relative
              inline-flex
              min-h-[44px]
              min-w-[104px]
              items-center
              justify-center
              overflow-hidden
              rounded-[15px]
              border
              border-[#C9A227]/20
              bg-[#C9A227]/[0.055]
              px-4
              text-xs
              font-medium
              text-[#C9A227]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
            "
          >
            <span
              aria-hidden="true"
              className="
                absolute
                -right-5
                top-1/2
                h-12
                w-12
                -translate-y-1/2
                rounded-full
                bg-[#C9A227]/[0.08]
                blur-xl
              "
            />

            <span className="relative z-10">
              {totalOrders.toLocaleString("ar-DZ")} طلب
            </span>
          </div>
        </div>

        {/* =================================================
            Console Footer
            ===================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-white/[0.05]
            pt-3
          "
        >
          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.25em]
              text-white/20
            "
          >
            ORVEN / COMMAND
          </span>

          <div className="flex items-center gap-2">
            <span
              className="
                h-px
                w-8
                bg-white/10
              "
            />

            <span
              className="
                h-px
                w-3
                bg-[#C9A227]/40
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}