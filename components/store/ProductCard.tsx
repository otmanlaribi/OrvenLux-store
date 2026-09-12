"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
} from "lucide-react";
import {
  useCallback,
  useRef,
  type PointerEvent,
} from "react";

import type { Product } from "@/types/database";

interface ProductCardProps {
  id?: string | number;
  name?: string;
  price?: number;
  image?: string | null;
  description?: string;
  badge?: string;

  // Support legacy usage:
  // <ProductCard product={product} />
  product?: Product;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  badge,
  product,
}: ProductCardProps) {
  const finalId =
    id ?? product?.id;

  const finalName =
    name ??
    product?.name ??
    "ORVEN LUX";

  const finalPrice =
    price ??
    product?.price ??
    0;

  const finalImage =
    image ??
    product?.image ??
    null;

  const cardRef =
    useRef<HTMLAnchorElement | null>(
      null,
    );

  /*
   * =========================================================
   * POINTER LIGHT
   * =========================================================
   *
   * CSS variables are updated directly.
   * This avoids React state updates on every pointer movement.
   */

  const handlePointerMove =
    useCallback(
      (
        event: PointerEvent<HTMLAnchorElement>,
      ) => {
        if (
          event.pointerType ===
            "touch" ||
          window.innerWidth < 768
        ) {
          return;
        }

        const card =
          cardRef.current;

        if (!card) {
          return;
        }

        const rect =
          card.getBoundingClientRect();

        if (
          !rect.width ||
          !rect.height
        ) {
          return;
        }

        const x =
          ((event.clientX -
            rect.left) /
            rect.width) *
          100;

        const y =
          ((event.clientY -
            rect.top) /
            rect.height) *
          100;

        card.style.setProperty(
          "--mouse-x",
          `${x}%`,
        );

        card.style.setProperty(
          "--mouse-y",
          `${y}%`,
        );
      },
      [],
    );

  const handlePointerLeave =
    useCallback(() => {
      const card =
        cardRef.current;

      if (!card) {
        return;
      }

      card.style.setProperty(
        "--mouse-x",
        "50%",
      );

      card.style.setProperty(
        "--mouse-y",
        "50%",
      );
    }, []);

  return (
    <Link
      ref={cardRef}
      href={`/products/${finalId}`}
      aria-label={`View ${finalName}`}
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={
        handlePointerLeave
      }
      className="
        group
        relative
        block
        outline-none

        [--mouse-x:50%]
        [--mouse-y:50%]

        focus-visible:ring-1
        focus-visible:ring-[#C9A227]/70
        focus-visible:ring-offset-4
        focus-visible:ring-offset-[#090909]
      "
    >
      {/* =====================================================
          PRODUCT STAGE
      ====================================================== */}

      <div className="relative">
        {/* ===================================================
            IMAGE FRAME
        ==================================================== */}

        <div
          className="
            relative
            aspect-[4/5]
            w-full
            overflow-hidden

            bg-[#10100F]

            ring-1
            ring-white/[0.055]

            transition-all
            duration-[900ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]

            group-hover:ring-[#C9A227]/25

            group-hover:shadow-[
              0_30px_90px_rgba(0,0,0,0.45)
            ]
          "
        >
          {/* =================================================
              CINEMATIC BACKGROUND
          ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(
                circle_at_50%_45%,
                rgba(201,162,39,0.09),
                transparent_34%
              )]
              opacity-70
              transition-all
              duration-[1200ms]
              ease-out

              group-hover:scale-110
              group-hover:opacity-100
            "
          />

          {/* =================================================
              SECONDARY GOLD ATMOSPHERE
          ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full

              bg-[#C9A227]/[0.055]

              blur-[90px]

              transition-transform
              duration-[1400ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]

              group-hover:translate-x-8
              group-hover:-translate-y-5
              group-hover:scale-110
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -bottom-28
              -left-20
              h-64
              w-64
              rounded-full

              bg-white/[0.018]

              blur-[85px]

              transition-transform
              duration-[1600ms]
              ease-out

              group-hover:-translate-x-5
              group-hover:translate-y-4
            "
          />

          {/* =================================================
              FINE EDITORIAL GRID
          ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.028]

              [background-image:
                linear-gradient(
                  rgba(255,255,255,0.7) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.7) 1px,
                  transparent 1px
                )
              ]

              [background-size:60px_60px]

              [mask-image:
                _linear-gradient(
                  to_bottom,
                  black,
                  transparent_80%
                )
              ]
            "
          />

          {/* =================================================
              POINTER GOLD LIGHT
          ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-[2]

              opacity-0

              transition-opacity
              duration-700

              group-hover:opacity-100
            "
            style={{
              background:
                "radial-gradient(circle 180px at var(--mouse-x) var(--mouse-y), rgba(201,162,39,0.16), transparent 72%)",
            }}
          />

          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          {finalImage ? (
            <div
              className="
                absolute
                inset-0
                z-[3]

                flex
                items-center
                justify-center

                p-7
                sm:p-9
                lg:p-10
              "
            >
              <div
                className="
                  relative
                  h-full
                  w-full

                  transition-transform
                  duration-[1200ms]

                  ease-[cubic-bezier(0.16,1,0.3,1)]

                  group-hover:scale-[1.035]
                  group-hover:-translate-y-1
                "
              >
                <Image
                  src={finalImage}
                  alt={finalName}
                  fill
                  unoptimized
                  sizes="
                    (max-width: 640px) 92vw,
                    (max-width: 1024px) 45vw,
                    (max-width: 1280px) 29vw,
                    23vw
                  "
                  className="
                    object-contain
                    object-center

                    drop-shadow-[
                      0_24px_30px_rgba(0,0,0,0.35)
                    ]

                    transition-all
                    duration-[1200ms]

                    ease-[cubic-bezier(0.16,1,0.3,1)]

                    group-hover:drop-shadow-[
                      0_32px_45px_rgba(0,0,0,0.55)
                    ]
                  "
                />
              </div>
            </div>
          ) : (
            <div
              className="
                relative
                z-[3]
                flex
                h-full
                w-full
                items-center
                justify-center
              "
            >
              <div
                className="
                  flex
                  h-28
                  w-28
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#C9A227]/15

                  bg-white/[0.018]

                  shadow-[
                    0_0_60px_rgba(201,162,39,0.05)
                  ]
                "
              >
                <span
                  className="
                    select-none
                    font-serif
                    text-4xl
                    italic
                    tracking-[0.16em]
                    text-[#C9A227]/35
                  "
                >
                  OL
                </span>
              </div>
            </div>
          )}

          {/* =================================================
              TOP BRAND MARK
          ================================================= */}

          <div
            className="
              absolute
              left-5
              top-5
              z-10

              flex
              items-center
              gap-2

              transition-all
              duration-500

              group-hover:translate-x-1
            "
          >
            <span
              className="
                h-[4px]
                w-[4px]
                rounded-full

                bg-[#C9A227]

                shadow-[
                  0_0_10px_rgba(201,162,39,0.55)
                ]
              "
            />

            <span
              className="
                text-[8px]
                font-medium
                uppercase
                tracking-[0.30em]

                text-[#C9A227]/55

                transition-colors
                duration-500

                group-hover:text-[#C9A227]/85
              "
            >
              ORVEN LUX
            </span>
          </div>

          {/* =================================================
              COLLECTION NUMBER
          ================================================= */}

          <div
            className="
              absolute
              right-5
              top-5
              z-10

              text-[8px]
              font-medium
              tabular-nums
              tracking-[0.2em]

              text-white/20

              transition-colors
              duration-500

              group-hover:text-white/45
            "
          >
            01
          </div>

          {/* =================================================
              BADGE
          ================================================= */}

          {badge && (
            <div
              className="
                absolute
                left-5
                top-12
                z-10

                border
                border-[#C9A227]/20

                bg-[#0A0A0A]/70

                px-3
                py-1.5

                text-[7px]
                font-semibold
                uppercase
                tracking-[0.22em]

                text-[#C9A227]/80

                backdrop-blur-xl

                transition-all
                duration-500

                group-hover:border-[#C9A227]/40
                group-hover:text-[#C9A227]
              "
            >
              {badge}
            </div>
          )}

          {/* =================================================
              LUXURY LIGHT SWEEP
          ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              -left-[70%]
              z-[6]

              w-[42%]

              skew-x-[-18deg]

              bg-gradient-to-r
              from-transparent
              via-white/[0.12]
              to-transparent

              opacity-0

              transition-none

              group-hover:left-[125%]
              group-hover:opacity-100

              group-hover:transition-[
                left,
                opacity
              ]

              group-hover:duration-[1200ms]

              group-hover:ease-[
                cubic-bezier(0.16,1,0.3,1)
              ]
            "
          />

          {/* =================================================
              LOWER CINEMATIC SCRIM
          ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              z-[5]

              h-40

              bg-gradient-to-t
              from-black/75
              via-black/20
              to-transparent

              opacity-0

              transition-opacity
              duration-700

              group-hover:opacity-100
            "
          />

          {/* =================================================
              DISCOVER BUTTON
          ================================================= */}

          <div
            className="
              absolute
              bottom-5
              left-5
              right-5
              z-10

              translate-y-4
              opacity-0

              transition-all
              duration-700

              ease-[cubic-bezier(0.16,1,0.3,1)]

              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <div
              className="
                flex
                items-center
                justify-between

                border
                border-white/10

                bg-[#090909]/85

                px-4
                py-3.5

                text-white

                backdrop-blur-xl

                transition-all
                duration-500

                group-hover:border-[#C9A227]/25
              "
            >
              <div className="flex items-center gap-3">
                <span
                  className="
                    h-1
                    w-1
                    rounded-full

                    bg-[#C9A227]

                    shadow-[
                      0_0_12px_rgba(201,162,39,0.8)
                    ]
                  "
                />

                <span
                  className="
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-white/75
                  "
                >
                  Discover piece
                </span>
              </div>

              <ArrowUpRight
                size={14}
                strokeWidth={1.2}
                className="
                  text-[#C9A227]/80

                  transition-all
                  duration-500

                  group-hover:-translate-y-1
                  group-hover:translate-x-1
                  group-hover:text-[#C9A227]
                "
              />
            </div>
          </div>

          {/* =================================================
              CORNER FRAME
          ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-5
              bottom-5
              z-[7]

              h-8
              w-8

              border-r
              border-b
              border-[#C9A227]/25

              transition-all
              duration-700

              group-hover:h-11
              group-hover:w-11

              group-hover:border-[#C9A227]/60
            "
          />

          {/* =================================================
              GOLD EDGE
          ================================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              z-[8]

              h-px
              w-0

              bg-gradient-to-r
              from-[#C9A227]
              via-[#E0C66D]
              to-transparent

              transition-all
              duration-[900ms]

              ease-[cubic-bezier(0.16,1,0.3,1)]

              group-hover:w-full
            "
          />
        </div>

        {/* ===================================================
            EDITORIAL IDENTIFIER
        ==================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              relative
              h-px
              w-8
              overflow-hidden

              bg-[#C9A227]/25

              transition-all
              duration-700

              group-hover:w-12
              group-hover:bg-[#C9A227]/40
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

                ease-[cubic-bezier(0.16,1,0.3,1)]

                group-hover:w-full
              "
            />
          </span>

          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.28em]

              text-[#C9A227]/45

              transition-all
              duration-500

              group-hover:translate-x-0.5
              group-hover:text-[#C9A227]/75
            "
          >
            ORVEN LUX
          </span>

          <span
            className="
              ml-auto

              text-[8px]
              uppercase
              tracking-[0.18em]

              text-white/15

              transition-colors
              duration-500

              group-hover:text-white/30
            "
          >
            TIMEPIECE
          </span>
        </div>
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ====================================================== */}

      <div
        className="
          mt-3
          flex
          items-start
          justify-between
          gap-4
          px-0.5
        "
      >
        <div className="min-w-0">
          <h3
            className="
              truncate

              font-serif
              text-[17px]
              font-normal
              tracking-[-0.015em]

              text-[#F3F0E8]

              transition-all
              duration-500

              group-hover:translate-x-0.5
              group-hover:text-[#C9A227]
            "
          >
            {finalName}
          </h3>

          <p
            className="
              mt-1

              text-[9px]
              uppercase
              tracking-[0.18em]

              text-white/25

              transition-colors
              duration-500

              group-hover:text-white/40
            "
          >
            Timepiece
          </p>
        </div>

        <p
          className="
            shrink-0
            pt-0.5

            font-serif
            text-[13px]
            tracking-wide

            text-white/55

            transition-all
            duration-500

            group-hover:text-[#C9A227]
          "
        >
          {Number(
            finalPrice,
          ).toLocaleString(
            "fr-FR",
          )}{" "}
          DZD
        </p>
      </div>

      {/* =====================================================
          BOTTOM MICRO INDICATOR
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          mt-4

          h-px
          w-full
          overflow-hidden

          bg-white/[0.055]
        "
      >
        <div
          className="
            h-full
            w-0

            bg-gradient-to-r
            from-[#C9A227]
            via-[#E0C66D]
            to-transparent

            transition-all
            duration-[900ms]

            ease-[cubic-bezier(0.16,1,0.3,1)]

            group-hover:w-full
          "
        />
      </div>

      {/* =====================================================
          MOBILE / TOUCH MICRO ACCENT
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          mt-3
          h-px
          w-5

          bg-[#C9A227]/20

          transition-all
          duration-500

          group-hover:w-8
          group-hover:bg-[#C9A227]/40

          md:hidden
        "
      />
    </Link>
  );
}