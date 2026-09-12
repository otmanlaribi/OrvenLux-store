import ProductCard from "@/components/store/ProductCard";
import type { Product } from "@/types/database";

type ProductsGridProps = {
  products: Product[];
};

export default function ProductsGrid({
  products,
}: ProductsGridProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section
      aria-label="ORVEN LUX timepieces"
      className="relative"
    >
      {/* =====================================================
          COLLECTION GRID
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-x-6
          gap-y-16
          sm:grid-cols-2
          sm:gap-x-8
          sm:gap-y-20
          lg:grid-cols-3
          lg:gap-x-10
          lg:gap-y-24
          xl:grid-cols-4
          xl:gap-x-8
          xl:gap-y-24
        "
      >
        {products.map((product, index) => (
          <article
            key={product.id}
            className="
              group
              relative
              min-w-0
              opacity-0
              animate-[orvenGridReveal_900ms_cubic-bezier(.16,1,.3,1)_forwards]
            "
            style={{
              animationDelay: `${Math.min(
                index * 80,
                560,
              )}ms`,
            }}
          >
            {/* ===============================================
                EDITORIAL INDEX
            ================================================ */}

            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <div className="flex items-center gap-3">
                <span
                  className="
                    font-mono
                    text-[9px]
                    font-medium
                    tabular-nums
                    tracking-[0.2em]
                    text-black/30
                    transition-colors
                    duration-500
                    group-hover:text-[#A27F3E]
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.22em]
                    text-black/20
                    transition-all
                    duration-500
                    group-hover:translate-x-1
                    group-hover:text-black/40
                  "
                >
                  Timepiece
                </span>
              </div>

              {/* Animated gold rule */}

              <span
                aria-hidden="true"
                className="
                  relative
                  h-px
                  w-8
                  overflow-hidden
                  bg-black/[0.08]
                  transition-all
                  duration-700
                  ease-out
                  group-hover:w-14
                "
              >
                <span
                  className="
                    absolute
                    inset-y-0
                    left-0
                    w-0
                    bg-[#C9A227]
                    transition-all
                    duration-700
                    ease-out
                    group-hover:w-full
                  "
                />
              </span>
            </div>

            {/* ===============================================
                PRODUCT CARD
            ================================================ */}

            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          </article>
        ))}
      </div>

      {/* =====================================================
          COLLECTION END MARKER
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          mt-20
          flex
          items-center
          gap-5
          sm:mt-28
          lg:mt-32
        "
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-black/[0.1] to-black/[0.04]" />

        <div className="flex items-center gap-3">
          <span className="h-[5px] w-[5px] rounded-full bg-[#C9A227]/70" />

          <span
            className="
              whitespace-nowrap
              text-[8px]
              font-medium
              uppercase
              tracking-[0.32em]
              text-black/30
              sm:text-[9px]
            "
          >
            End of Collection 01
          </span>
        </div>

        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-black/[0.1] to-black/[0.04]" />
      </div>

      {/* =====================================================
          LOCAL MOTION
      ===================================================== */}

      <style>{`
        @keyframes orvenGridReveal {
          from {
            opacity: 0;
            transform: translate3d(0, 34px, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[orvenGridReveal_900ms_cubic-bezier\\(\\.16\\,1\\,\\.3\\,1\\)_forwards\\] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}