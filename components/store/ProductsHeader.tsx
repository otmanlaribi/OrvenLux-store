"use client";

import {
  useCallback,
  useRef,
  type PointerEvent,
} from "react";

import { ArrowDownRight } from "lucide-react";

type ProductsHeaderProps = {
  totalProducts: number;
};

export default function ProductsHeader({
  totalProducts,
}: ProductsHeaderProps) {
  const headerRef =
    useRef<HTMLElement | null>(null);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (
        event.pointerType === "touch" ||
        window.innerWidth < 768
      ) {
        return;
      }

      const element =
        headerRef.current;

      if (!element) {
        return;
      }

      const rect =
        element.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      /*
       * Deliberately restrained values.
       * ORVEN LUX should feel precise, not playful.
       */
      const rotateY = x * 4;
      const rotateX = y * -3;

      element.style.setProperty(
        "--mx",
        `${x}`,
      );

      element.style.setProperty(
        "--my",
        `${y}`,
      );

      element.style.setProperty(
        "--rx",
        `${rotateX}deg`,
      );

      element.style.setProperty(
        "--ry",
        `${rotateY}deg`,
      );

      element.style.setProperty(
        "--px",
        `${x * 28}px`,
      );

      element.style.setProperty(
        "--py",
        `${y * 20}px`,
      );
    },
    [],
  );

  const handlePointerLeave =
    useCallback(() => {
      const element =
        headerRef.current;

      if (!element) {
        return;
      }

      element.style.setProperty(
        "--mx",
        "0",
      );

      element.style.setProperty(
        "--my",
        "0",
      );

      element.style.setProperty(
        "--rx",
        "0deg",
      );

      element.style.setProperty(
        "--ry",
        "0deg",
      );

      element.style.setProperty(
        "--px",
        "0px",
      );

      element.style.setProperty(
        "--py",
        "0px",
      );
    }, []);

  const formattedCount =
    String(totalProducts).padStart(
      2,
      "0",
    );

  return (
    <section
      ref={headerRef}
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={
        handlePointerLeave
      }
      className="
        group
        relative
        isolate
        overflow-hidden

        border
        border-white/[0.075]

        bg-[#11110F]

        text-white

        shadow-[0_35px_110px_rgba(0,0,0,0.32)]

        outline-none

        [--mx:0]
        [--my:0]
        [--rx:0deg]
        [--ry:0deg]
        [--px:0px]
        [--py:0px]

        transition-[border-color,box-shadow]
        duration-1000

        hover:border-[#C9A227]/25
        hover:shadow-[0_45px_130px_rgba(0,0,0,0.42)]
      "
      style={{
        transform:
          "perspective(1400px) rotateX(var(--rx)) rotateY(var(--ry))",
        transformStyle:
          "preserve-3d",
        transition:
          "transform 900ms cubic-bezier(0.16,1,0.3,1), border-color 700ms ease, box-shadow 900ms ease",
      }}
    >
      {/* =====================================================
          ATMOSPHERIC LIGHT
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0

          bg-[radial-gradient(
            circle_at_20%_20%,
            rgba(201,162,39,0.07),
            transparent_34%
          )]

          transition-all
          duration-[1200ms]

          group-hover:bg-[radial-gradient(
            circle_at_var(--mx)_var(--my),
            rgba(201,162,39,0.12),
            transparent_32%
          )]
        "
      />

      {/* =====================================================
          GOLD ORBIT
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-28
          top-1/2
          z-[1]

          h-[390px]
          w-[390px]

          -translate-y-1/2

          rounded-full

          border
          border-[#C9A227]/10

          transition-transform
          duration-[1200ms]
          ease-[cubic-bezier(.16,1,.3,1)]

          group-hover:scale-[1.06]
        "
        style={{
          transform:
            "translate3d(var(--px), var(--py), 0) translateY(-50%) rotate(calc(var(--mx) * 5deg))",
        }}
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-4
          top-1/2
          z-[1]

          h-[230px]
          w-[230px]

          -translate-y-1/2

          rounded-full

          border
          border-[#C9A227]/[0.075]

          transition-transform
          duration-[1400ms]
          ease-[cubic-bezier(.16,1,.3,1)]

          group-hover:scale-[1.1]
        "
        style={{
          transform:
            "translate3d(calc(var(--px) * 0.6), calc(var(--py) * 0.6), 0) translateY(-50%)",
        }}
      />

      {/* =====================================================
          GIANT COLLECTION NUMBER
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[-22px]
          top-1/2
          z-[1]

          -translate-y-1/2

          select-none

          font-serif
          text-[190px]
          font-light
          leading-none
          tracking-[-0.09em]

          text-white/[0.028]

          transition-transform
          duration-[1300ms]
          ease-[cubic-bezier(.16,1,.3,1)]
        "
        style={{
          transform:
            "translate3d(calc(var(--px) * -0.35), calc(var(--py) * -0.35), 0) translateY(-50%)",
        }}
      >
        01
      </div>

      {/* =====================================================
          FINE GRID
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          opacity-[0.025]

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

          [background-size:72px_72px]
        "
      />

      {/* =====================================================
          TOP EDGE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          top-0
          z-20
          h-px

          bg-gradient-to-r
          from-transparent
          via-[#C9A227]/45
          to-transparent

          opacity-60
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10

          px-7
          py-11

          sm:px-10
          sm:py-14

          lg:px-14
          lg:py-16
        "
        style={{
          transform:
            "translate3d(calc(var(--px) * 0.18), calc(var(--py) * 0.18), 0)",
          transformStyle:
            "preserve-3d",
          transition:
            "transform 900ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* ===================================================
            EYEBROW
        ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <span
            className="
              relative
              h-px
              w-10
              overflow-hidden

              bg-[#C9A227]/45

              transition-all
              duration-700

              group-hover:w-16
              group-hover:bg-[#C9A227]/75
            "
          >
            <span
              className="
                absolute
                inset-y-0
                left-0
                w-0
                bg-[#E2C76D]

                transition-all
                duration-700
                ease-[cubic-bezier(.16,1,.3,1)]

                group-hover:w-full
              "
            />
          </span>

          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.34em]

              text-[#C9A227]/70

              sm:text-[10px]
            "
          >
            ORVEN LUX / COLLECTION
          </p>

          <span
            className="
              ml-auto
              hidden
              font-mono
              text-[9px]
              tabular-nums
              tracking-[0.2em]
              text-white/20
              sm:block
            "
          >
            01 / 01
          </span>
        </div>

        {/* ===================================================
            HERO CONTENT
        ==================================================== */}

        <div
          className="
            mt-10
            grid
            gap-12

            lg:grid-cols-[1.2fr_0.8fr]
            lg:items-end
            lg:gap-16
          "
        >
          {/* LEFT */}

          <div>
            <span
              className="
                block

                text-[8px]
                font-medium
                uppercase
                tracking-[0.30em]

                text-white/28

                opacity-0

                animate-[orvenHeaderFade_800ms_120ms_cubic-bezier(.16,1,.3,1)_forwards]
              "
            >
              Selected timepieces
            </span>

            <h1
              className="
                mt-4

                max-w-[850px]

                font-serif
                text-[54px]
                font-normal
                leading-[0.88]
                tracking-[-0.055em]

                text-[#F7F5F0]

                opacity-0

                animate-[orvenHeaderReveal_1000ms_200ms_cubic-bezier(.16,1,.3,1)_forwards]

                sm:text-[76px]

                lg:text-[96px]

                xl:text-[112px]
              "
            >
              Luxury
              <br />

              <span
                className="
                  italic
                  text-[#C9A227]/85
                  transition-colors
                  duration-500

                  group-hover:text-[#E2C76D]
                "
              >
                watches.
              </span>
            </h1>

            {/* Thin underline */}

            <div
              aria-hidden="true"
              className="
                mt-8

                h-px
                w-0

                bg-gradient-to-r
                from-[#C9A227]
                via-[#E2C76D]/55
                to-transparent

                animate-[orvenHeaderLine_1200ms_420ms_cubic-bezier(.16,1,.3,1)_forwards]
              "
            />
          </div>

          {/* RIGHT */}

          <div
            className="
              lg:pb-2

              opacity-0

              animate-[orvenHeaderFade_900ms_460ms_cubic-bezier(.16,1,.3,1)_forwards]
            "
          >
            <p
              className="
                max-w-[420px]

                text-[13px]
                leading-7

                text-white/42

                sm:text-sm
                sm:leading-8
              "
            >
              Discover our curated collection of
              exceptional timepieces, selected for
              precision, character, proportion and
              timeless presence.
            </p>

            {/* Mini direction cue */}

            <div
              className="
                mt-7
                flex
                items-center
                gap-4
              "
            >
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

                  text-[#C9A227]/70

                  transition-all
                  duration-500

                  group-hover:border-[#C9A227]/35
                  group-hover:bg-[#C9A227]/[0.045]
                  group-hover:text-[#E2C76D]
                "
              >
                <ArrowDownRight
                  size={14}
                  strokeWidth={1.2}
                />
              </span>

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.28em]
                  text-white/25
                "
              >
                Explore collection
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            BOTTOM INFORMATION
        ==================================================== */}

        <div
          className="
            mt-12

            flex
            flex-col
            gap-7

            border-t
            border-white/[0.075]

            pt-6

            sm:mt-14
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          {/* Product count */}

          <div className="flex items-center gap-5">
            <div
              className="
                relative
                flex
                h-14
                min-w-14
                items-center
                justify-center

                border
                border-[#C9A227]/20

                bg-[#C9A227]/[0.035]

                transition-all
                duration-700

                group-hover:border-[#C9A227]/45
                group-hover:bg-[#C9A227]/[0.065]
              "
            >
              {/* Inner corner */}

              <span
                aria-hidden="true"
                className="
                  absolute
                  left-0
                  top-0
                  h-3
                  w-3
                  border-l
                  border-t
                  border-[#C9A227]/35
                "
              />

              <span
                className="
                  font-serif
                  text-lg
                  tracking-wide

                  text-[#C9A227]/85
                "
              >
                {formattedCount}
              </span>
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-white/85
                "
              >
                Watches available
              </p>

              <p
                className="
                  mt-1

                  text-[9px]
                  uppercase
                  tracking-[0.18em]

                  text-white/25
                "
              >
                Curated ORVEN LUX collection
              </p>
            </div>
          </div>

          {/* Signature */}

          <div
            className="
              flex
              items-center
              gap-4

              text-[9px]
              uppercase
              tracking-[0.23em]

              text-white/22

              transition-colors
              duration-500

              group-hover:text-white/35
            "
          >
            <span
              className="
                h-px
                w-8

                bg-white/10

                transition-all
                duration-500

                group-hover:w-14
                group-hover:bg-[#C9A227]/30
              "
            />

            <span>
              Precision
            </span>

            <span className="text-[#C9A227]/35">
              ·
            </span>

            <span>
              Heritage
            </span>

            <span className="text-[#C9A227]/35">
              ·
            </span>

            <span>
              Time
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          HOVER EDGE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          z-20

          h-px
          w-0

          bg-gradient-to-r
          from-[#C9A227]
          via-[#E2C76D]
          to-transparent

          shadow-[0_0_14px_rgba(201,162,39,0.18)]

          transition-all
          duration-[1000ms]
          ease-[cubic-bezier(.16,1,.3,1)]

          group-hover:w-full
        "
      />

      {/* =====================================================
          CORNER MARKS
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-6
          top-6
          z-20

          h-7
          w-7

          border-r
          border-t
          border-[#C9A227]/25

          transition-all
          duration-700

          group-hover:h-10
          group-hover:w-10
          group-hover:border-[#C9A227]/50
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-6
          left-6
          z-20

          h-7
          w-7

          border-b
          border-l
          border-white/[0.08]

          transition-all
          duration-700

          group-hover:h-10
          group-hover:w-10
          group-hover:border-white/[0.16]
        "
      />

      {/* =====================================================
          REDUCED MOTION
      ====================================================== */}

      <style>{`
        @keyframes orvenHeaderFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes orvenHeaderReveal {
          from {
            opacity: 0;
            transform: translate3d(0, 26px, 0);
            filter: blur(7px);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            filter: blur(0);
          }
        }

        @keyframes orvenHeaderLine {
          from {
            width: 0;
          }

          to {
            width: min(260px, 45%);
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

          [style*="rotateX"],
          [style*="translate3d"] {
            transform: none !important;
          }
        }

        @media (max-width: 767px) {
          [style*="perspective"] {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}