"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Crown,
  Gem,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import {
  useCallback,
  useRef,
  type PointerEvent,
} from "react";

const categories = [
  {
    title: "Luxury",
    description:
      "Premium luxury watches from world-class collections.",
    icon: Crown,
    href: "/products?category=luxury",
    number: "01",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1400&q=88",
    code: "LV-01",
  },
  {
    title: "Classic",
    description:
      "Elegant timepieces with timeless designs.",
    icon: Gem,
    href: "/products?category=classic",
    number: "02",
    image:
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=1400&q=88",
    code: "CL-02",
  },
  {
    title: "Sport",
    description:
      "Built for performance and everyday durability.",
    icon: TimerReset,
    href: "/products?category=sport",
    number: "03",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1400&q=88",
    code: "SP-03",
  },
  {
    title: "Premium",
    description:
      "Exclusive pieces selected for true enthusiasts.",
    icon: ShieldCheck,
    href: "/products?category=premium",
    number: "04",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1400&q=88",
    code: "PR-04",
  },
];

export default function Categories() {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
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
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      section.style.setProperty(
        "--category-x",
        String(x),
      );

      section.style.setProperty(
        "--category-y",
        String(y),
      );

      section.style.setProperty(
        "--category-light-x",
        `${(x + 0.5) * 100}%`,
      );

      section.style.setProperty(
        "--category-light-y",
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
        "--category-x",
        "0",
      );

      section.style.setProperty(
        "--category-y",
        "0",
      );

      section.style.setProperty(
        "--category-light-x",
        "50%",
      );

      section.style.setProperty(
        "--category-light-y",
        "50%",
      );
    }, []);

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="
        orven-categories
        group
        relative
        isolate
        overflow-hidden

        bg-[#090909]
        text-white

        [--category-x:0]
        [--category-y:0]
        [--category-light-x:50%]
        [--category-light-y:50%]
      "
    >
      {/* =====================================================
          GLOBAL ATMOSPHERE
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
        {/* Upper gold light */}

        <div
          className="
            absolute
            -right-[250px]
            -top-[180px]

            h-[620px]
            w-[620px]

            rounded-full

            bg-[#C9A227]/[0.05]

            blur-[170px]

            transition-transform
            duration-[1400ms]
            ease-out
          "
          style={{
            transform:
              "translate3d(calc(var(--category-x) * -24px), calc(var(--category-y) * -18px), 0)",
          }}
        />

        {/* Lower atmosphere */}

        <div
          className="
            absolute
            -left-[240px]
            bottom-[-250px]

            h-[560px]
            w-[560px]

            rounded-full

            bg-[#C9A227]/[0.022]

            blur-[160px]

            transition-transform
            duration-[1600ms]
            ease-out
          "
          style={{
            transform:
              "translate3d(calc(var(--category-x) * 18px), calc(var(--category-y) * 12px), 0)",
          }}
        />

        {/* Cursor spotlight */}

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
              "radial-gradient(circle 430px at var(--category-light-x) var(--category-light-y), rgba(201,162,39,0.045), transparent 72%)",
          }}
        />

        {/* Fine grid */}

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
              transparent_20%,
              rgba(0,0,0,0.58)_100%
            )]
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto
          max-w-[1500px]

          px-5
          py-24

          sm:px-8
          sm:py-28

          lg:px-12
          lg:py-36
        "
      >
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header
          className="
            relative

            category-header
          "
        >
          {/* Giant background number */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute

              right-[-10px]
              top-1/2

              -translate-y-1/2

              select-none

              font-serif
              text-[150px]
              font-light
              leading-none
              tracking-[-0.09em]

              text-white/[0.025]

              sm:text-[220px]

              lg:text-[320px]
            "
            style={{
              transform:
                "translate3d(calc(var(--category-x) * -14px), calc(var(--category-y) * -10px), 0) translateY(-50%)",
            }}
          >
            02
          </div>

          <div
            className="
              relative
              z-10

              max-w-[900px]
            "
            style={{
              transform:
                "translate3d(calc(var(--category-x) * 3px), calc(var(--category-y) * 2px), 0)",
              transition:
                "transform 1100ms cubic-bezier(.16,1,.3,1)",
            }}
          >
            {/* Eyebrow */}

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

                    group-hover:w-full
                  "
                />
              </span>

              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.34em]

                  text-[#C9A227]/70
                "
              >
                ORVEN LUX / COLLECTIONS
              </span>
            </div>

            {/* Title */}

            <h2
              className="
                mt-7

                max-w-[850px]

                font-serif
                text-[48px]
                font-normal
                leading-[0.9]
                tracking-[-0.055em]

                text-[#F7F5F0]

                sm:text-[64px]
                lg:text-[82px]
                xl:text-[94px]
              "
            >
              Find the watch
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
                that defines you.
              </span>
            </h2>

            {/* Gold line */}

            <div
              aria-hidden="true"
              className="
                mt-8

                h-px
                w-0

                bg-gradient-to-r
                from-[#C9A227]
                via-[#E2C76D]/50
                to-transparent

                animate-[categoryLineReveal_1100ms_cubic-bezier(.16,1,.3,1)_350ms_forwards]
              "
            />

            {/* Description */}

            <p
              className="
                mt-7

                max-w-xl

                text-sm
                leading-7

                text-white/38

                sm:text-[15px]
                sm:leading-8
              "
            >
              Explore carefully selected collections
              created for different personalities,
              occasions and ways of living.
            </p>
          </div>

          {/* Header bottom rail */}

          <div
            className="
              relative
              z-10

              mt-10

              flex
              items-center
              justify-between

              border-t
              border-white/[0.065]

              pt-4

              sm:mt-12
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
              02 / COLLECTIONS
            </span>

            <span
              className="
                hidden

                text-[8px]
                uppercase
                tracking-[0.26em]

                text-white/18

                sm:block
              "
            >
              Choose your character
            </span>

            <Link
              href="/products"
              className="
                group/all

                flex
                items-center
                gap-2

                text-[8px]
                uppercase
                tracking-[0.22em]

                text-white/35

                transition-colors
                duration-500

                hover:text-[#C9A227]/80
              "
            >
              All watches

              <ArrowUpRight
                size={11}
                strokeWidth={1.3}
                className="
                  transition-transform
                  duration-500

                  group-hover/all:-translate-y-0.5
                  group-hover/all:translate-x-0.5
                "
              />
            </Link>
          </div>
        </header>

        {/* ===================================================
            CATEGORY GRID
        ==================================================== */}

        <div
          className="
            mt-10

            grid

            grid-cols-1

            gap-5

            sm:grid-cols-2

            lg:mt-12

            lg:grid-cols-4

            lg:gap-6
          "
        >
          {categories.map(
            (category, index) => {
              const Icon =
                category.icon;

              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="
                    category-card
                    group/card

                    relative

                    min-h-[440px]

                    overflow-hidden

                    border
                    border-white/[0.08]

                    bg-[#11110F]

                    outline-none

                    transition-all
                    duration-[900ms]

                    ease-[cubic-bezier(.16,1,.3,1)]

                    hover:-translate-y-1

                    hover:border-[#C9A227]/35

                    focus-visible:ring-1
                    focus-visible:ring-[#C9A227]/70
                  "
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* =================================================
                      IMAGE
                  ================================================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      z-0

                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-[-6%]

                        bg-cover
                        bg-center

                        opacity-65

                        transition-transform
                        duration-[1500ms]

                        ease-[cubic-bezier(.16,1,.3,1)]

                        group-hover/card:scale-110
                        group-hover/card:opacity-75
                      "
                      style={{
                        backgroundImage:
                          `url("${category.image}")`,
                        transform:
                          "translate3d(calc(var(--category-x) * -10px), calc(var(--category-y) * -7px), 0)",
                      }}
                    />
                  </div>

                  {/* =================================================
                      IMAGE COLOR / CINEMATIC OVERLAY
                  ================================================== */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      inset-0
                      z-[1]

                      bg-gradient-to-b
                      from-black/38
                      via-black/35
                      to-black/90

                      transition-all
                      duration-700

                      group-hover/card:from-black/28
                      group-hover/card:via-black/25
                      group-hover/card:to-black/84
                    "
                  />

                  {/* =================================================
                      LOCAL GOLD LIGHT
                  ================================================== */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      -right-24
                      top-[25%]
                      z-[2]

                      h-[230px]
                      w-[230px]

                      rounded-full

                      bg-[#C9A227]/0

                      blur-[80px]

                      transition-all
                      duration-1000

                      group-hover/card:bg-[#C9A227]/[0.13]
                      group-hover/card:scale-110
                    "
                  />

                  {/* =================================================
                      POINTER SPOTLIGHT
                  ================================================== */}

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      z-[2]

                      opacity-0

                      transition-opacity
                      duration-500

                      group-hover/card:opacity-100
                    "
                    style={{
                      background:
                        "radial-gradient(circle 150px at calc(50% + var(--category-x) * 120px) calc(50% + var(--category-y) * 120px), rgba(201,162,39,0.10), transparent 75%)",
                    }}
                  />

                  {/* =================================================
                      TOP META
                  ================================================== */}

                  <div
                    className="
                      relative
                      z-10

                      flex
                      items-start
                      justify-between

                      p-6

                      sm:p-7
                    "
                    style={{
                      transform:
                        "translate3d(calc(var(--category-x) * 5px), calc(var(--category-y) * 4px), 30px)",
                      transition:
                        "transform 900ms cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {/* Number */}

                    <div className="flex items-center gap-3">
                      <span
                        className="
                          font-mono
                          text-[9px]
                          tracking-[0.2em]

                          text-white/38

                          transition-colors
                          duration-500

                          group-hover/card:text-[#C9A227]/80
                        "
                      >
                        {category.number}
                      </span>

                      <span
                        className="
                          h-px
                          w-5

                          bg-white/10

                          transition-all
                          duration-500

                          group-hover/card:w-8
                          group-hover/card:bg-[#C9A227]/40
                        "
                      />
                    </div>

                    {/* Icon */}

                    <div
                      className="
                        relative

                        flex
                        h-11
                        w-11

                        items-center
                        justify-center

                        border
                        border-white/[0.13]

                        bg-black/25

                        text-[#C9A227]/65

                        backdrop-blur-md

                        transition-all
                        duration-700

                        group-hover/card:border-[#C9A227]/55
                        group-hover/card:bg-[#C9A227]/[0.08]
                        group-hover/card:text-[#E2C76D]

                        group-hover/card:rotate-3
                      "
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.2}
                      />

                      <span
                        aria-hidden="true"
                        className="
                          absolute
                          -right-1
                          -top-1

                          h-2
                          w-2

                          border-r
                          border-t
                          border-[#C9A227]/35
                        "
                      />
                    </div>
                  </div>

                  {/* =================================================
                      CENTER CODE
                  ================================================== */}

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      left-1/2
                      top-[42%]
                      z-[3]

                      -translate-x-1/2
                      -translate-y-1/2

                      whitespace-nowrap

                      font-mono
                      text-[7px]

                      tracking-[0.35em]

                      text-white/[0.0]

                      transition-all
                      duration-700

                      group-hover/card:text-[#C9A227]/55
                    "
                  >
                    {category.code}
                  </div>

                  {/* =================================================
                      BOTTOM CONTENT
                  ================================================== */}

                  <div
                    className="
                      absolute
                      inset-x-6
                      bottom-6
                      z-10

                      sm:inset-x-7
                      sm:bottom-7
                    "
                    style={{
                      transform:
                        "translate3d(calc(var(--category-x) * 6px), calc(var(--category-y) * 5px), 45px)",
                      transition:
                        "transform 900ms cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {/* Gold mini line */}

                    <div
                      className="
                        mb-4

                        h-px
                        w-8

                        bg-[#C9A227]/40

                        transition-all
                        duration-700

                        group-hover/card:w-14
                        group-hover/card:bg-[#C9A227]/75
                      "
                    />

                    {/* Title */}

                    <h3
                      className="
                        font-serif
                        text-4xl
                        font-normal

                        tracking-[-0.045em]

                        text-white

                        transition-all
                        duration-700

                        group-hover/card:translate-x-0.5
                      "
                    >
                      {category.title}
                    </h3>

                    {/* Description */}

                    <p
                      className="
                        mt-3

                        max-w-[260px]

                        text-[12px]
                        leading-6

                        text-white/45

                        transition-colors
                        duration-500

                        group-hover/card:text-white/60
                      "
                    >
                      {category.description}
                    </p>

                    {/* CTA */}

                    <div
                      className="
                        mt-6

                        flex
                        items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-[0.27em]

                          text-[#C9A227]/65

                          transition-colors
                          duration-500

                          group-hover/card:text-[#E2C76D]
                        "
                      >
                        Discover
                      </span>

                      <span
                        className="
                          flex
                          h-6
                          w-6

                          items-center
                          justify-center

                          border
                          border-white/10

                          text-white/35

                          transition-all
                          duration-500

                          group-hover/card:translate-x-1
                          group-hover/card:border-[#C9A227]/30
                          group-hover/card:text-[#C9A227]
                        "
                      >
                        <ArrowUpRight
                          size={10}
                          strokeWidth={1.3}
                        />
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      CORNER FRAME
                  ================================================== */}

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-5
                      top-5
                      z-20

                      h-8
                      w-8

                      border-l
                      border-t
                      border-white/[0.12]

                      transition-all
                      duration-700

                      group-hover/card:h-11
                      group-hover/card:w-11
                      group-hover/card:border-[#C9A227]/40
                    "
                  />

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      bottom-5
                      right-5
                      z-20

                      h-8
                      w-8

                      border-b
                      border-r
                      border-white/[0.10]

                      transition-all
                      duration-700

                      group-hover/card:h-11
                      group-hover/card:w-11
                      group-hover/card:border-[#C9A227]/40
                    "
                  />

                  {/* =================================================
                      BOTTOM GOLD EDGE
                  ================================================== */}

                  <span
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

                      transition-all
                      duration-[900ms]

                      group-hover/card:w-full
                    "
                  />
                </Link>
              );
            })}
        </div>

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
            border-white/[0.065]

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

                shadow-[0_0_12px_rgba(201,162,39,.25)]
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
              Luxury · Classic · Sport · Premium
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
          LOCAL ANIMATION SYSTEM
      ====================================================== */}

      <style>{`
        .category-header {
          opacity: 0;
          transform: translate3d(0, 28px, 0);
          filter: blur(6px);

          animation:
            categoryHeaderReveal
            1000ms
            cubic-bezier(.16,1,.3,1)
            80ms
            forwards;
        }

        .category-card {
          opacity: 0;
          transform:
            translate3d(0, 34px, 0)
            scale(.985);
          filter: blur(5px);

          animation:
            categoryCardReveal
            950ms
            cubic-bezier(.16,1,.3,1)
            forwards;
        }

        @keyframes categoryHeaderReveal {
          from {
            opacity: 0;
            transform:
              translate3d(0,28px,0)
              scale(.985);
            filter: blur(6px);
          }

          to {
            opacity: 1;
            transform:
              translate3d(0,0,0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes categoryCardReveal {
          0% {
            opacity: 0;
            transform:
              translate3d(0,34px,0)
              scale(.985);
            filter: blur(5px);
          }

          65% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform:
              translate3d(0,0,0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes categoryLineReveal {
          from {
            width: 0;
          }

          to {
            width: min(260px, 55%);
          }
        }

        @media (max-width: 899px) {
          .orven-categories [style*="var(--category-x)"] {
            transition: none !important;
          }
        }

        @media (max-width: 767px) {
          .category-card {
            min-height: 420px;
            animation-duration: 700ms;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-header,
          .category-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }

          *,
          *::before,
          *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}