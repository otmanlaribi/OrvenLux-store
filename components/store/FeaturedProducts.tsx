"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useRef,
  type PointerEvent,
} from "react";

import ProductCard from "@/components/store/ProductCard";
import type { Product } from "@/types/database";

type FeaturedProductsProps = {
  products: Product[];
};

export default function FeaturedProducts({
  products,
}: FeaturedProductsProps) {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  /* =========================================================
     POINTER / PARALLAX
  ========================================================= */

  const handlePointerMove = useCallback(
    (
      event: PointerEvent<HTMLElement>,
    ) => {
      if (
        event.pointerType === "touch" ||
        window.innerWidth < 900
      ) {
        return;
      }

      const section =
        sectionRef.current;

      if (!section) {
        return;
      }

      const rect =
        section.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const x =
        (event.clientX -
          rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY -
          rect.top) /
          rect.height -
        0.5;

      section.style.setProperty(
        "--mx",
        String(x),
      );

      section.style.setProperty(
        "--my",
        String(y),
      );

      section.style.setProperty(
        "--light-x",
        `${(x + 0.5) * 100}%`,
      );

      section.style.setProperty(
        "--light-y",
        `${(y + 0.5) * 100}%`,
      );
    },
    [],
  );

  const handlePointerLeave =
    useCallback(() => {
      const section =
        sectionRef.current;

      if (!section) {
        return;
      }

      section.style.setProperty(
        "--mx",
        "0",
      );

      section.style.setProperty(
        "--my",
        "0",
      );

      section.style.setProperty(
        "--light-x",
        "50%",
      );

      section.style.setProperty(
        "--light-y",
        "50%",
      );
    }, []);

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="
        orven-featured
        group
        relative
        isolate
        overflow-hidden

        bg-[#0A0A0A]
        text-white

        [--mx:0]
        [--my:0]
        [--light-x:50%]
        [--light-y:50%]
      "
    >
      {/* =====================================================
          ATMOSPHERE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >
        {/* Main gold glow */}

        <div
          className="
            absolute
            -right-[260px]
            -top-[190px]

            h-[650px]
            w-[650px]

            rounded-full

            bg-[#C9A227]/[0.055]

            blur-[170px]

            transition-transform
            duration-[1500ms]
            ease-out
          "
          style={{
            transform:
              "translate3d(calc(var(--mx) * -24px), calc(var(--my) * -18px), 0)",
          }}
        />

        {/* Lower gold glow */}

        <div
          className="
            absolute
            -left-[260px]
            bottom-[-250px]

            h-[580px]
            w-[580px]

            rounded-full

            bg-[#C9A227]/[0.022]

            blur-[160px]

            transition-transform
            duration-[1700ms]
            ease-out
          "
          style={{
            transform:
              "translate3d(calc(var(--mx) * 18px), calc(var(--my) * 14px), 0)",
          }}
        />

        {/* Mouse spotlight */}

        <div
          className="
            absolute
            inset-0

            opacity-70

            transition-opacity
            duration-700
          "
          style={{
            background:
              "radial-gradient(circle 420px at var(--light-x) var(--light-y), rgba(201,162,39,0.05), transparent 72%)",
          }}
        />

        {/* Editorial grid */}

        <div
          className="
            absolute
            inset-0

            opacity-[0.018]

            [background-image:
              linear-gradient(
                rgba(255,255,255,0.8) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.8) 1px,
                transparent 1px
              )
            ]

            [background-size:90px_90px]
          "
        />

        {/* Vignette */}

        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(
              circle_at_center,
              transparent_24%,
              rgba(0,0,0,0.62)_100%
            )]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="featured-header">
          <div
            className="
              flex
              flex-col
              justify-between
              gap-10

              lg:flex-row
              lg:items-end
            "
          >
            {/* =================================================
                LEFT
            ================================================== */}

            <div
              className="max-w-[900px]"
              style={{
                transform:
                  "translate3d(calc(var(--mx) * 3px), calc(var(--my) * 2px), 0)",
                transition:
                  "transform 1100ms cubic-bezier(.16,1,.3,1)",
              }}
            >
              {/* Eyebrow */}

              <div className="mb-6 flex items-center gap-4">
                <span className="featured-gold-line">
                  <span />
                </span>

                <span
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.34em]

                    text-[#C9A227]/65

                    sm:text-[10px]
                  "
                >
                  Curated Timepieces
                </span>

                <Sparkles
                  size={12}
                  strokeWidth={1.2}
                  className="
                    text-[#C9A227]/45

                    transition-all
                    duration-700

                    group-hover:rotate-12
                    group-hover:text-[#C9A227]/80
                  "
                />
              </div>

              {/* Title */}

              <h2
                className="
                  font-serif
                  text-[48px]
                  font-normal
                  leading-[0.88]
                  tracking-[-0.055em]

                  text-[#F7F5F0]

                  sm:text-[64px]
                  lg:text-[82px]
                  xl:text-[96px]
                "
              >
                Watches worth
                <br />

                <span
                  className="
                    italic
                    text-[#C9A227]/85

                    transition-colors
                    duration-700

                    group-hover:text-[#E2C76D]
                  "
                >
                  remembering.
                </span>
              </h2>

              {/* Underline */}

              <div
                aria-hidden="true"
                className="
                  featured-title-line
                  mt-8
                "
              />

              {/* Description */}

              <p
                className="
                  mt-7
                  max-w-xl

                  text-sm
                  leading-7

                  text-white/37

                  sm:text-[15px]
                  sm:leading-8
                "
              >
                A considered selection of exceptional
                timepieces, chosen for craftsmanship,
                character, proportion and enduring presence.
              </p>
            </div>

            {/* =================================================
                VIEW ALL
            ================================================== */}

            <Link
              href="/products"
              className="
                group/all

                relative
                inline-flex
                w-fit
                shrink-0

                items-center
                gap-4

                overflow-hidden

                border
                border-white/[0.10]

                bg-white/[0.018]

                px-5
                py-3.5

                text-[9px]
                font-medium
                uppercase
                tracking-[0.25em]

                text-white/60

                transition-all
                duration-700

                hover:border-[#C9A227]/45
                hover:bg-[#C9A227]/[0.045]
                hover:text-white

                lg:mb-1
              "
              style={{
                transform:
                  "translate3d(calc(var(--mx) * -4px), calc(var(--my) * -3px), 20px)",
                transition:
                  "transform 900ms cubic-bezier(.16,1,.3,1), border-color 500ms ease, background-color 500ms ease",
              }}
            >
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-y-[-25%]
                  left-[-70%]

                  w-[42%]

                  -skew-x-[18deg]

                  bg-white/[0.10]

                  opacity-0

                  group-hover/all:left-[125%]
                  group-hover/all:opacity-100

                  group-hover/all:transition-[left,opacity]
                  group-hover/all:duration-[1000ms]
                  group-hover/all:ease-out
                "
              />

              <span className="relative z-10">
                View all watches
              </span>

              <span
                className="
                  relative
                  z-10

                  flex
                  h-7
                  w-7

                  items-center
                  justify-center

                  border
                  border-white/10

                  text-[#C9A227]/70

                  transition-all
                  duration-500

                  group-hover/all:border-[#C9A227]/35
                  group-hover/all:text-[#E2C76D]
                "
              >
                <ArrowUpRight
                  size={12}
                  strokeWidth={1.3}
                  className="
                    transition-transform
                    duration-500

                    group-hover/all:-translate-y-0.5
                    group-hover/all:translate-x-0.5
                  "
                />
              </span>
            </Link>
          </div>
        </header>

        {/* ===================================================
            EDITORIAL DIVIDER
        ==================================================== */}

        <div
          className="
            mt-14

            flex
            items-center
            gap-4

            border-t
            border-white/[0.065]

            pt-4

            sm:mt-16

            featured-divider
          "
        >
          <span
            className="
              font-mono
              text-[8px]
              tracking-[0.22em]

              text-[#C9A227]/55
            "
          >
            ORVEN LUX / 01
          </span>

          <span
            className="
              h-px
              flex-1

              bg-gradient-to-r
              from-white/[0.08]
              to-transparent
            "
          />

          <span
            className="
              hidden

              text-[8px]
              uppercase
              tracking-[0.25em]

              text-white/18

              sm:block
            "
          >
            Selected Collection
          </span>

          <span
            className="
              font-mono
              text-[8px]

              tracking-[0.18em]

              text-white/18
            "
          >
            {String(
              Math.min(products.length, 4),
            ).padStart(2, "0")}
          </span>
        </div>

        {/* ===================================================
            PRODUCTS
        ==================================================== */}

        {products.length === 0 ? (
          <EmptyFeaturedProducts />
        ) : (
          <div
            className="
              mt-10

              grid
              grid-cols-1

              gap-x-6
              gap-y-16

              sm:grid-cols-2
              sm:gap-x-8
              sm:gap-y-20

              lg:mt-12
              lg:gap-x-10
              lg:gap-y-24

              xl:grid-cols-4
              xl:gap-x-8
            "
          >
            {products
              .slice(0, 4)
              .map((product, index) => (
                <article
                  key={product.id}
                  className="featured-product"
                  style={{
                    animationDelay: `${index * 110}ms`,
                  }}
                >
                  {/* =========================================
                      INDEX
                  ========================================== */}

                  <div
                    className="
                      mb-4

                      flex
                      items-center
                      justify-between

                      sm:mb-5
                    "
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="
                          font-mono
                          text-[9px]
                          tabular-nums
                          tracking-[0.20em]

                          text-white/25

                          transition-colors
                          duration-500

                          group-hover:text-[#C9A227]/80
                        "
                      >
                        {String(
                          index + 1,
                        ).padStart(2, "0")}
                      </span>

                      <span
                        className="
                          h-px
                          w-5

                          bg-white/[0.08]

                          transition-all
                          duration-500

                          group-hover:w-8
                          group-hover:bg-[#C9A227]/30
                        "
                      />

                      <span
                        className="
                          text-[7px]
                          uppercase
                          tracking-[0.24em]

                          text-white/17
                        "
                      >
                        Selected
                      </span>
                    </div>

                    <span
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.20em]

                        text-[#C9A227]/30

                        transition-colors
                        duration-500

                        group-hover:text-[#C9A227]/65
                      "
                    >
                      ORVEN
                    </span>
                  </div>

                  {/* =========================================
                      PRODUCT
                  ========================================== */}

                  <div
                    className="
                      relative

                      [transform:translateZ(20px)]
                    "
                    style={{
                      transform:
                        "translate3d(calc(var(--mx) * 2px), calc(var(--my) * 2px), 20px)",
                      transition:
                        "transform 1000ms cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {/* Glow */}

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none

                        absolute
                        -inset-4
                        z-0

                        bg-[#C9A227]/0

                        blur-[35px]

                        transition-all
                        duration-700

                        group-hover:bg-[#C9A227]/[0.045]
                      "
                    />

                    {/* Frame */}

                    <div
                      className="
                        relative
                        z-10

                        p-px

                        bg-gradient-to-b
                        from-white/[0.09]
                        via-white/[0.035]
                        to-[#C9A227]/[0.075]

                        transition-all
                        duration-700

                        group-hover:from-[#C9A227]/25
                        group-hover:via-white/[0.05]
                        group-hover:to-[#C9A227]/20
                      "
                    >
                      <div
                        className="
                          relative

                          overflow-hidden

                          bg-[#11110F]

                          shadow-[0_22px_70px_rgba(0,0,0,0.24)]

                          transition-all
                          duration-700

                          group-hover:bg-[#141310]
                          group-hover:shadow-[0_30px_90px_rgba(0,0,0,0.38)]
                        "
                      >
                        {/* Inner spotlight */}

                        <div
                          aria-hidden="true"
                          className="
                            pointer-events-none

                            absolute
                            inset-0
                            z-0

                            bg-[radial-gradient(
                              circle_at_50%_42%,
                              rgba(201,162,39,0.065),
                              transparent_40%
                            )]

                            opacity-60

                            transition-all
                            duration-1000

                            group-hover:scale-110
                            group-hover:opacity-100
                          "
                        />

                        {/* Product */}

                        <div className="relative z-10">
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                          />
                        </div>

                        {/* Corner frame */}

                        <span
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            left-4
                            top-4
                            z-20

                            h-6
                            w-6

                            border-l
                            border-t
                            border-white/[0.10]

                            transition-all
                            duration-700

                            group-hover:h-9
                            group-hover:w-9
                            group-hover:border-[#C9A227]/40
                          "
                        />

                        <span
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            bottom-4
                            right-4
                            z-20

                            h-6
                            w-6

                            border-b
                            border-r
                            border-white/[0.10]

                            transition-all
                            duration-700

                            group-hover:h-9
                            group-hover:w-9
                            group-hover:border-[#C9A227]/40
                          "
                        />
                      </div>
                    </div>
                  </div>

                  {/* =========================================
                      FOOTER
                  ========================================== */}

                  <div
                    className="
                      mt-4

                      flex
                      items-center
                      justify-between

                      border-t
                      border-white/[0.06]

                      pt-3
                    "
                  >
                    <span
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.24em]

                        text-white/20

                        transition-colors
                        duration-500

                        group-hover:text-white/35
                      "
                    >
                      Timepiece
                    </span>

                    <span
                      className="
                        flex
                        items-center
                        gap-1.5

                        text-[7px]
                        uppercase
                        tracking-[0.18em]

                        text-[#C9A227]/30

                        transition-all
                        duration-500

                        group-hover:text-[#C9A227]/75
                      "
                    >
                      Discover

                      <ArrowUpRight
                        size={9}
                        strokeWidth={1.4}
                        className="
                          transition-transform
                          duration-500

                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                        "
                      />
                    </span>
                  </div>
                </article>
              ))}
          </div>
        )}

        {/* ===================================================
            BOTTOM SIGNATURE
        ==================================================== */}

        <div
          className="
            mt-20

            flex
            items-center
            gap-5

            border-t
            border-white/[0.06]

            pt-6

            sm:mt-24
          "
        >
          <span
            className="
              h-px
              flex-1

              bg-gradient-to-r
              from-transparent
              via-white/[0.08]
              to-white/[0.025]
            "
          />

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                h-[5px]
                w-[5px]

                rounded-full

                bg-[#C9A227]/60

                shadow-[0_0_10px_rgba(201,162,39,0.25)]
              "
            />

            <span
              className="
                whitespace-nowrap

                text-[8px]
                font-medium
                uppercase
                tracking-[0.34em]

                text-white/18
              "
            >
              Precision · Heritage · Time
            </span>

            <span
              className="
                h-[5px]
                w-[5px]

                rounded-full

                bg-[#C9A227]/30
              "
            />
          </div>

          <span
            className="
              h-px
              flex-1

              bg-gradient-to-l
              from-transparent
              via-white/[0.08]
              to-white/[0.025]
            "
          />
        </div>
      </div>

      {/* =====================================================
          ANIMATION SYSTEM
      ====================================================== */}

      <style>{`
        /*
         * Explicit CSS animations.
         * We intentionally do not depend on Tailwind
         * arbitrary animation classes here.
         */

        .featured-header {
          opacity: 0;
          transform: translate3d(0, 28px, 0);
          filter: blur(6px);

          animation:
            featuredHeaderIn
            1000ms
            cubic-bezier(.16,1,.3,1)
            80ms
            forwards;
        }

        .featured-divider {
          opacity: 0;

          animation:
            featuredFadeIn
            800ms
            ease
            380ms
            forwards;
        }

        .featured-gold-line {
          position: relative;

          display: block;

          width: 40px;
          height: 1px;

          overflow: hidden;

          background:
            rgba(201,162,39,.30);

          transition:
            width 700ms
            cubic-bezier(.16,1,.3,1);
        }

        .featured-gold-line > span {
          position: absolute;
          inset: 0 auto 0 0;

          width: 0;

          background:
            linear-gradient(
              90deg,
              #C9A227,
              #E2C76D
            );

          transition:
            width 700ms
            cubic-bezier(.16,1,.3,1);
        }

        .group:hover .featured-gold-line {
          width: 62px;
          background:
            rgba(201,162,39,.50);
        }

        .group:hover .featured-gold-line > span {
          width: 100%;
        }

        .featured-title-line {
          width: 0;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              #C9A227,
              rgba(226,199,109,.45),
              transparent
            );

          animation:
            featuredLineIn
            1100ms
            cubic-bezier(.16,1,.3,1)
            420ms
            forwards;
        }

        .featured-product {
          opacity: 0;
          transform:
            translate3d(0, 34px, 0)
            scale(.985);
          filter: blur(5px);

          animation:
            featuredProductIn
            950ms
            cubic-bezier(.16,1,.3,1)
            forwards;
        }

        .orven-featured .group\\/card {
          transform-style: preserve-3d;
        }

        @keyframes featuredHeaderIn {
          from {
            opacity: 0;
            transform:
              translate3d(0, 28px, 0)
              scale(.985);
            filter: blur(6px);
          }

          to {
            opacity: 1;
            transform:
              translate3d(0, 0, 0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes featuredFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes featuredLineIn {
          from {
            width: 0;
          }

          to {
            width: min(260px, 55%);
          }
        }

        @keyframes featuredProductIn {
          0% {
            opacity: 0;
            transform:
              translate3d(0, 34px, 0)
              scale(.985);
            filter: blur(5px);
          }

          70% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform:
              translate3d(0, 0, 0)
              scale(1);
            filter: blur(0);
          }
        }

        @media (max-width: 899px) {
          .orven-featured [style*="translate3d"] {
            transition: none !important;
          }
        }

        @media (max-width: 767px) {
          .featured-header,
          .featured-product,
          .featured-divider {
            animation-duration: 650ms;
          }

          .featured-product {
            transform: translate3d(0, 22px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .featured-header,
          .featured-product,
          .featured-divider,
          .featured-title-line {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }

          .featured-gold-line,
          .featured-gold-line > span {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyFeaturedProducts() {
  return (
    <div
      className="
        relative
        mt-10
        overflow-hidden

        border
        border-dashed
        border-white/[0.10]

        bg-[#11110F]

        px-6
        py-24

        text-center
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

          bg-[#C9A227]/[0.025]

          blur-[100px]
        "
      />

      <div className="relative z-10">
        <p
          className="
            text-[8px]
            font-medium
            uppercase
            tracking-[0.34em]

            text-[#C9A227]/65
          "
        >
          Collection
        </p>

        <h3
          className="
            mt-4

            font-serif
            text-3xl
            font-normal

            tracking-[-0.04em]

            text-[#F7F5F0]
          "
        >
          No watches available
        </h3>

        <p
          className="
            mx-auto
            mt-4
            max-w-md

            text-sm
            leading-7

            text-white/30
          "
        >
          Add active products from the admin
          dashboard to display them here.
        </p>
      </div>
    </div>
  );
}