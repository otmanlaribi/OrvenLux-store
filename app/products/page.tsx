import { Suspense } from "react";

import ProductsHeader from "@/components/store/ProductsHeader";
import ProductsToolbar from "@/components/store/ProductsToolbar";
import ProductsGrid from "@/components/store/ProductsGrid";

import { getStoreProducts } from "@/lib/services/store";

type Props = {
  searchParams: Promise<{
    search?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const products = await getStoreProducts({
    active: true,
  });

  let filteredProducts = [...products];

  /* =========================================================
     SEARCH
  ========================================================= */

  if (params.search?.trim()) {
    const search = params.search.trim().toLowerCase();

    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(search),
    );
  }

  /* =========================================================
     SORTING
  ========================================================= */

  switch (params.sort) {
    case "price-asc":
      filteredProducts.sort(
        (a, b) => Number(a.price) - Number(b.price),
      );
      break;

    case "price-desc":
      filteredProducts.sort(
        (a, b) => Number(b.price) - Number(a.price),
      );
      break;

    case "stock":
      filteredProducts.sort(
        (a, b) =>
          Number(b.stock ?? 0) -
          Number(a.stock ?? 0),
      );
      break;

    case "oldest":
      filteredProducts.sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime(),
      );
      break;

    default:
      filteredProducts.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      );
      break;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#F7F5F0]">

      {/* =====================================================
          AMBIENT DARK LUXURY BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Primary gold atmosphere */}
        <div
          className="
            absolute
            -right-[240px]
            top-[180px]
            h-[650px]
            w-[650px]
            rounded-full
            bg-[#C9A227]/[0.045]
            blur-[170px]
            animate-[orvenAmbient_18s_ease-in-out_infinite]
          "
        />

        {/* Secondary atmosphere */}
        <div
          className="
            absolute
            -left-[260px]
            bottom-[100px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#C9A227]/[0.025]
            blur-[160px]
            animate-[orvenAmbientReverse_22s_ease-in-out_infinite]
          "
        />

        {/* Very subtle center glow */}
        <div
          className="
            absolute
            left-1/2
            top-[42%]
            h-[380px]
            w-[380px]
            -translate-x-1/2
            rounded-full
            bg-[#C9A227]/[0.012]
            blur-[150px]
          "
        />

        {/* Editorial grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
            [background-size:90px_90px]
          "
        />

        {/* Cinematic vignette */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_20%,#0A0A0A_85%)]
          "
        />
      </div>

      {/* =====================================================
          TOP EDITORIAL BAR
      ===================================================== */}

      <div className="relative z-10 border-b border-white/[0.07]">
        <div
          className="
            mx-auto
            flex
            max-w-[1500px]
            items-center
            justify-between
            px-5
            py-4
            sm:px-8
            lg:px-12
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-[9px]
              font-medium
              uppercase
              tracking-[0.34em]
              text-white/45
              sm:text-[10px]
            "
          >
            <span
              className="
                h-[5px]
                w-[5px]
                rounded-full
                bg-[#C9A227]
                shadow-[0_0_12px_rgba(201,162,39,0.35)]
              "
            />

            <span className="text-[#C9A227]/75">
              ORVEN LUX
            </span>

            <span className="hidden text-white/15 sm:inline">
              /
            </span>

            <span className="hidden sm:inline">
              TIMEPIECES
            </span>
          </div>

          <div
            className="
              text-[9px]
              uppercase
              tracking-[0.28em]
              text-white/30
              sm:text-[10px]
            "
          >
            Collection 01
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">

        {/* ===================================================
            HERO
        =================================================== */}

        <header
          className="
            relative
            flex
            min-h-[500px]
            flex-col
            justify-center
            border-b
            border-white/[0.07]
            py-20
            sm:min-h-[580px]
            sm:py-24
            lg:min-h-[650px]
            lg:py-28
          "
        >

          {/* Giant background number */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-[-20px]
              top-1/2
              -translate-y-1/2
              select-none
              font-serif
              text-[190px]
              font-light
              leading-none
              tracking-[-0.08em]
              text-white/[0.025]
              sm:text-[280px]
              lg:text-[390px]
            "
          >
            01
          </div>

          {/* Gold editorial mark */}

          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-4
              opacity-0
              animate-[orvenReveal_900ms_120ms_cubic-bezier(.16,1,.3,1)_forwards]
            "
          >
            <span
              className="
                h-px
                w-10
                bg-[#C9A227]
                shadow-[0_0_10px_rgba(201,162,39,0.2)]
                sm:w-16
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.34em]
                text-white/45
                sm:text-[10px]
              "
            >
              Selected Timepieces
            </span>
          </div>

          {/* Main title */}

          <h1
            className="
              relative
              z-10
              mt-7
              max-w-[1000px]
              font-serif
              text-[58px]
              font-normal
              leading-[0.88]
              tracking-[-0.055em]
              text-[#F7F5F0]
              opacity-0
              animate-[orvenReveal_1000ms_220ms_cubic-bezier(.16,1,.3,1)_forwards]
              sm:mt-9
              sm:text-[90px]
              lg:text-[128px]
              xl:text-[150px]
            "
          >
            THE
            <br />

            <span
              className="
                italic
                text-[#C9A227]/90
              "
            >
              COLLECTION
            </span>
          </h1>

          {/* Description */}

          <div
            className="
              relative
              z-10
              mt-9
              flex
              max-w-[620px]
              flex-col
              gap-7
              opacity-0
              animate-[orvenReveal_1000ms_420ms_cubic-bezier(.16,1,.3,1)_forwards]
              sm:mt-11
              sm:flex-row
              sm:items-end
            "
          >
            <p
              className="
                max-w-[440px]
                text-sm
                leading-7
                text-white/42
                sm:text-[15px]
                sm:leading-8
              "
            >
              Selected timepieces for quiet precision.
              Discover pieces designed around presence,
              character and everyday movement.
            </p>

            <div className="hidden h-px w-20 bg-white/10 sm:block" />
          </div>

          {/* Bottom navigation hint */}

          <div
            className="
              absolute
              bottom-7
              left-0
              right-0
              flex
              items-center
              justify-between
              opacity-0
              animate-[orvenFade_1000ms_650ms_ease_forwards]
              sm:bottom-8
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/25
              "
            >
              Explore the collection
            </span>

            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                text-xs
                text-[#C9A227]/60
                animate-[orvenFloat_3s_ease-in-out_infinite]
              "
            >
              ↓
            </span>
          </div>

          {/* Gold reveal line */}

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-0
              left-0
              h-px
              w-0
              bg-[#C9A227]
              shadow-[0_0_12px_rgba(201,162,39,0.25)]
              animate-[orvenLineReveal_1500ms_500ms_cubic-bezier(.16,1,.3,1)_forwards]
            "
          />
        </header>

        {/* ===================================================
            COLLECTION META
        =================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            border-b
            border-white/[0.07]
            py-6
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:py-7
          "
        >
          <div className="flex items-center gap-4">
            <span
              className="
                font-mono
                text-[10px]
                tracking-[0.2em]
                text-[#C9A227]/70
              "
            >
              01
            </span>

            <span className="h-px w-8 bg-white/10" />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-white/35
              "
            >
              Current Selection
            </span>
          </div>

          <div
            className="
              text-[10px]
              uppercase
              tracking-[0.22em]
              text-white/25
            "
          >
            {filteredProducts.length
              .toString()
              .padStart(2, "0")}{" "}
            Timepieces
          </div>
        </div>

        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <div
          className="
            relative
            z-20
            mt-8
            opacity-0
            animate-[orvenReveal_900ms_500ms_cubic-bezier(.16,1,.3,1)_forwards]
            sm:mt-10
          "
        >
          <ProductsToolbar
            totalProducts={filteredProducts.length}
          />
        </div>

        {/* ===================================================
            PRODUCTS HEADER
        =================================================== */}

        <div
          className="
            mt-14
            opacity-0
            animate-[orvenReveal_900ms_600ms_cubic-bezier(.16,1,.3,1)_forwards]
            sm:mt-20
          "
        >
          <ProductsHeader
            totalProducts={filteredProducts.length}
          />
        </div>

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <section
          className="
            relative
            mt-8
            pb-24
            sm:mt-12
            sm:pb-32
            lg:pb-40
          "
        >
          {/* Editorial vertical line */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -left-5
              top-0
              hidden
              h-full
              w-px
              bg-gradient-to-b
              from-transparent
              via-[#C9A227]/20
              to-transparent
              lg:block
            "
          />

          <Suspense fallback={<ProductsSkeleton />}>
            {filteredProducts.length > 0 ? (
              <div
                className="
                  opacity-0
                  animate-[orvenProductsReveal_1100ms_700ms_cubic-bezier(.16,1,.3,1)_forwards]
                "
              >
                <ProductsGrid
                  products={filteredProducts}
                />
              </div>
            ) : (
              <EmptyProducts />
            )}
          </Suspense>
        </section>

        {/* ===================================================
            CLOSING STATEMENT
        =================================================== */}

        <section
          className="
            relative
            overflow-hidden
            border-t
            border-white/[0.07]
            py-24
            sm:py-32
            lg:py-40
          "
        >
          {/* Background word */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -bottom-10
              left-1/2
              -translate-x-1/2
              select-none
              whitespace-nowrap
              font-serif
              text-[100px]
              italic
              tracking-[-0.06em]
              text-white/[0.025]
              sm:text-[180px]
              lg:text-[260px]
            "
          >
            ORVEN
          </div>

          <div
            className="
              relative
              z-10
              mx-auto
              max-w-[900px]
              text-center
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.35em]
                text-[#C9A227]/65
              "
            >
              ORVEN LUX / 01
            </span>

            <h2
              className="
                mt-6
                font-serif
                text-[42px]
                font-normal
                leading-[0.95]
                tracking-[-0.045em]
                text-[#F7F5F0]
                sm:text-[64px]
                lg:text-[84px]
              "
            >
              PRECISION
              <br />

              <span className="italic text-[#C9A227]/85">
                IS NOT LOUD.
              </span>
            </h2>

            <p
              className="
                mx-auto
                mt-7
                max-w-[470px]
                text-sm
                leading-7
                text-white/35
                sm:mt-9
                sm:text-[15px]
              "
            >
              A timepiece should not compete for attention.
              It should become part of your presence.
            </p>

            <div className="mt-9 flex justify-center sm:mt-11">
              <div
                className="
                  group
                  relative
                  inline-flex
                  cursor-pointer
                  items-center
                  gap-4
                  border-b
                  border-white/15
                  pb-3
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.28em]
                  text-white/60
                  transition-colors
                  duration-500
                  hover:text-[#C9A227]
                "
              >
                <span>
                  Find your timepiece
                </span>

                <span
                  className="
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:translate-x-2
                  "
                >
                  →
                </span>

                <span
                  className="
                    absolute
                    bottom-[-1px]
                    left-0
                    h-px
                    w-0
                    bg-[#C9A227]
                    shadow-[0_0_10px_rgba(201,162,39,0.25)]
                    transition-all
                    duration-700
                    ease-out
                    group-hover:w-full
                  "
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          MOTION SYSTEM
      ===================================================== */}

      <style>{`
        @keyframes orvenReveal {
          from {
            opacity: 0;
            transform: translateY(28px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes orvenProductsReveal {
          from {
            opacity: 0;
            transform: translateY(36px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes orvenFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes orvenLineReveal {
          from {
            width: 0%;
          }

          to {
            width: min(420px, 42%);
          }
        }

        @keyframes orvenAmbient {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-35px, 22px, 0) scale(1.07);
          }
        }

        @keyframes orvenAmbientReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(30px, -28px, 0) scale(1.06);
          }
        }

        @keyframes orvenFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(5px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

/* ============================================================
   SKELETON
============================================================ */

function ProductsSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-x-6
        gap-y-14
        sm:grid-cols-2
        sm:gap-x-8
        sm:gap-y-20
        lg:gap-x-10
        lg:gap-y-24
      "
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="group">
          <div
            className="
              relative
              aspect-[4/5]
              overflow-hidden
              border
              border-white/[0.07]
              bg-[#111111]
            "
          >
            <div
              className="
                absolute
                inset-0
                animate-pulse
                bg-white/[0.025]
              "
            />

            <div
              className="
                absolute
                left-5
                top-5
                h-3
                w-12
                animate-pulse
                bg-white/[0.06]
              "
            />

            <div
              className="
                absolute
                bottom-5
                left-5
                h-3
                w-20
                animate-pulse
                bg-white/[0.05]
              "
            />
          </div>

          <div className="mt-5 flex items-start justify-between gap-5">
            <div className="flex-1 space-y-3">
              <div className="h-2.5 w-20 animate-pulse bg-white/[0.06]" />
              <div className="h-5 w-2/3 animate-pulse bg-white/[0.07]" />
            </div>

            <div className="h-5 w-20 animate-pulse bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyProducts() {
  return (
    <div
      className="
        relative
        overflow-hidden
        border-y
        border-white/[0.07]
        py-28
        text-center
        sm:py-36
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[320px]
          w-[320px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#C9A227]/[0.035]
          blur-[110px]
        "
      />

      <div className="relative z-10">
        <div
          className="
            mx-auto
            flex
            h-14
            w-14
            items-center
            justify-center
            border
            border-[#C9A227]/20
            bg-[#C9A227]/[0.025]
          "
        >
          <span className="font-serif text-xl italic text-[#C9A227]/65">
            0
          </span>
        </div>

        <span
          className="
            mt-7
            block
            text-[9px]
            uppercase
            tracking-[0.35em]
            text-[#C9A227]/60
          "
        >
          Collection Empty
        </span>

        <h2
          className="
            mt-4
            font-serif
            text-4xl
            tracking-[-0.04em]
            text-[#F7F5F0]
            sm:text-5xl
          "
        >
          No watches found
        </h2>

        <p
          className="
            mx-auto
            mt-5
            max-w-[430px]
            text-sm
            leading-7
            text-white/35
          "
        >
          We could not find a timepiece matching your
          current search. Try another search or change
          the sorting options.
        </p>
      </div>
    </div>
  );
}