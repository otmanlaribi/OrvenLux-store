"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Menu,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

type HeroPoint = {
  x: number;
  y: number;
};

export default function Hero() {
  const [time, setTime] =
    useState<Date | null>(null);

  const heroRef =
    useRef<HTMLElement | null>(null);

  const clockRef =
    useRef<HTMLDivElement | null>(null);

  /* =========================================================
     LIVE TIME
  ========================================================= */

  useEffect(() => {
    const update = () => {
      setTime(new Date());
    };

    update();

    const timer = setInterval(
      update,
      1000,
    );

    return () => {
      clearInterval(timer);
    };
  }, []);

  /* =========================================================
     POINTER / 3D DEPTH
  ========================================================= */

  const handlePointerMove = useCallback(
    (
      event: PointerEvent<HTMLElement>,
    ) => {
      if (
        event.pointerType === "touch" ||
        window.innerWidth < 768
      ) {
        return;
      }

      const hero =
        heroRef.current;

      if (!hero) {
        return;
      }

      const rect =
        hero.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const point: HeroPoint = {
        x:
          (event.clientX - rect.left) /
            rect.width -
          0.5,

        y:
          (event.clientY - rect.top) /
            rect.height -
          0.5,
      };

      const rotateX =
        point.y * -4;

      const rotateY =
        point.x * 5;

      hero.style.setProperty(
        "--hero-x",
        `${point.x}`,
      );

      hero.style.setProperty(
        "--hero-y",
        `${point.y}`,
      );

      hero.style.setProperty(
        "--hero-rx",
        `${rotateX}deg`,
      );

      hero.style.setProperty(
        "--hero-ry",
        `${rotateY}deg`,
      );

      hero.style.setProperty(
        "--hero-light-x",
        `${(point.x + 0.5) * 100}%`,
      );

      hero.style.setProperty(
        "--hero-light-y",
        `${(point.y + 0.5) * 100}%`,
      );
    },
    [],
  );

  const handlePointerLeave =
    useCallback(() => {
      const hero =
        heroRef.current;

      if (!hero) {
        return;
      }

      hero.style.setProperty(
        "--hero-x",
        "0",
      );

      hero.style.setProperty(
        "--hero-y",
        "0",
      );

      hero.style.setProperty(
        "--hero-rx",
        "0deg",
      );

      hero.style.setProperty(
        "--hero-ry",
        "0deg",
      );

      hero.style.setProperty(
        "--hero-light-x",
        "50%",
      );

      hero.style.setProperty(
        "--hero-light-y",
        "50%",
      );
    }, []);

  /* =========================================================
     CLOCK CALCULATIONS
  ========================================================= */

  const hours =
    time?.getHours() ?? 0;

  const minutes =
    time?.getMinutes() ?? 0;

  const seconds =
    time?.getSeconds() ?? 0;

  const hourDeg =
    (hours % 12) * 30 +
    minutes * 0.5;

  const minuteDeg =
    minutes * 6 +
    seconds * 0.1;

  const secondDeg =
    seconds * 6;

  const dateValue =
    String(
      time?.getDate() ?? 1,
    ).padStart(2, "0");

  const monthValue =
    String(
      (time?.getMonth() ?? 0) + 1,
    ).padStart(2, "0");

  return (
    <section
      ref={heroRef}
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={
        handlePointerLeave
      }
      className="
        group
        relative
        min-h-[100svh]
        overflow-hidden
        bg-[#080808]
        text-white
        [--hero-x:0]
        [--hero-y:0]
        [--hero-rx:0deg]
        [--hero-ry:0deg]
        [--hero-light-x:50%]
        [--hero-light-y:50%]
      "
      style={{
        perspective: "1600px",
      }}
    >
      {/* =====================================================
          CINEMATIC BACKGROUND
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
        {/* Base */}
        <div
          className="
            absolute
            inset-0
            bg-[#080808]
          "
        />

        {/* Gold atmosphere */}
        <div
          className="
            absolute
            -right-[18%]
            top-[6%]

            h-[720px]
            w-[720px]

            rounded-full

            bg-[#C9A227]/[0.055]

            blur-[180px]

            transition-transform
            duration-[1400ms]
            ease-[cubic-bezier(.16,1,.3,1)]

            group-hover:translate-x-8
            group-hover:-translate-y-5
            group-hover:scale-[1.08]

            animate-[heroAtmosphere_18s_ease-in-out_infinite]
          "
        />

        {/* Secondary atmosphere */}
        <div
          className="
            absolute
            -left-[20%]
            bottom-[0%]

            h-[560px]
            w-[560px]

            rounded-full

            bg-[#C9A227]/[0.022]

            blur-[170px]

            animate-[heroAtmosphereReverse_22s_ease-in-out_infinite]
          "
        />

        {/* Pointer spotlight */}

        <div
          className="
            absolute
            inset-0

            opacity-0

            transition-opacity
            duration-700

            group-hover:opacity-100
          "
          style={{
            background:
              "radial-gradient(circle 420px at var(--hero-light-x) var(--hero-light-y), rgba(201,162,39,0.075), transparent 70%)",
          }}
        />

        {/* Cinematic vignette */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,0.68)_100%)]
          "
        />

        {/* Subtle editorial grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.022]

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

        {/* Large horizontal hairline */}

        <div
          className="
            absolute
            left-0
            right-0
            top-[50%]

            h-px

            bg-gradient-to-r
            from-transparent
            via-white/[0.035]
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          relative
          z-30

          mx-auto
          flex
          max-w-[1600px]
          items-center
          justify-between

          px-5
          py-6

          sm:px-8

          lg:px-12
        "
      >
        {/* Brand */}

        <Link
          href="/"
          className="
            group/brand
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center

              border
              border-[#C9A227]/35

              bg-[#C9A227]/[0.025]

              text-[10px]
              tracking-[0.12em]

              text-[#C9A227]/85

              transition-all
              duration-500

              group-hover/brand:border-[#C9A227]/75
              group-hover/brand:bg-[#C9A227]/10
              group-hover/brand:text-[#E2C76D]

              group-hover/brand:shadow-[0_0_24px_rgba(201,162,39,0.07)]
            "
          >
            OL

            <span
              aria-hidden="true"
              className="
                absolute
                left-0
                top-0

                h-2
                w-2

                border-l
                border-t
                border-[#C9A227]/45
              "
            />
          </span>

          <span
            className="
              hidden

              text-[10px]
              font-medium
              uppercase
              tracking-[0.32em]

              text-white/55

              transition-colors
              duration-500

              group-hover/brand:text-[#C9A227]/80

              sm:block
            "
          >
            ORVEN LUX
          </span>
        </Link>

        {/* Desktop navigation */}

        <div
          className="
            hidden
            items-center
            gap-10

            md:flex
          "
        >
          <Link
            href="/"
            className="
              relative
              text-[9px]
              uppercase
              tracking-[0.24em]
              text-white/85

              transition-colors
              duration-300

              hover:text-[#C9A227]
            "
          >
            Home

            <span
              className="
                absolute
                -bottom-2
                left-0

                h-px
                w-full

                bg-[#C9A227]/55
              "
            />
          </Link>

          <Link
            href="/products"
            className="
              text-[9px]
              uppercase
              tracking-[0.24em]
              text-white/35

              transition-all
              duration-300

              hover:text-[#C9A227]/80
            "
          >
            Collection
          </Link>

          <Link
            href="/products"
            className="
              text-[9px]
              uppercase
              tracking-[0.24em]
              text-white/35

              transition-all
              duration-300

              hover:text-[#C9A227]/80
            "
          >
            Watches
          </Link>
        </div>

        {/* Right navigation */}

        <div
          className="
            flex
            items-center
            gap-5
          "
        >
          <Link
            href="/products"
            className="
              group/explore

              hidden

              items-center
              gap-3

              text-[9px]
              uppercase
              tracking-[0.24em]

              text-white/45

              transition-colors
              duration-300

              hover:text-white

              sm:inline-flex
            "
          >
            Explore

            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center

                rounded-full

                border
                border-white/10

                text-[#C9A227]/55

                transition-all
                duration-500

                group-hover/explore:border-[#C9A227]/35
                group-hover/explore:bg-[#C9A227]/[0.045]
              "
            >
              <ArrowUpRight
                size={10}
                strokeWidth={1.3}
                className="
                  transition-transform
                  duration-500

                  group-hover/explore:-translate-y-0.5
                  group-hover/explore:translate-x-0.5
                "
              />
            </span>
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center

              border
              border-white/10

              bg-white/[0.015]

              text-white/55

              transition-all
              duration-500

              hover:border-[#C9A227]/40
              hover:bg-[#C9A227]/[0.04]
              hover:text-[#C9A227]

              md:hidden
            "
          >
            <Menu
              size={16}
              strokeWidth={1.2}
            />
          </button>
        </div>
      </nav>

      {/* =====================================================
          MAIN HERO
      ====================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto
          flex

          min-h-[calc(100svh-84px)]

          max-w-[1600px]

          items-center

          px-5
          pb-20

          sm:px-8

          lg:px-12
        "
      >
        <div
          className="
            grid
            w-full
            items-center

            gap-10

            lg:grid-cols-[0.88fr_1.12fr]

            lg:gap-4

            xl:gap-0
          "
        >
          {/* =================================================
              LEFT EDITORIAL CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-20

              max-w-2xl

              pt-4

              lg:pt-0
            "
          >
            {/* Editorial eyebrow */}

            <div
              className="
                flex
                items-center
                gap-4

                opacity-0

                animate-[heroReveal_900ms_100ms_cubic-bezier(.16,1,.3,1)_forwards]
              "
            >
              <span
                className="
                  relative
                  h-px
                  w-10

                  overflow-hidden

                  bg-[#C9A227]/50

                  sm:w-14
                "
              >
                <span
                  className="
                    absolute
                    inset-y-0
                    left-0
                    w-0

                    bg-[#E2C76D]

                    animate-[heroLineReveal_1000ms_350ms_cubic-bezier(.16,1,.3,1)_forwards]
                  "
                />
              </span>

              <span
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.34em]

                  text-[#C9A227]/70

                  sm:text-[9px]
                "
              >
                Independent Watch House
              </span>
            </div>

            {/* Main headline */}

            <h1
              className="
                mt-7

                max-w-[720px]

                font-serif
                text-[54px]
                font-normal

                leading-[0.86]

                tracking-[-0.06em]

                text-[#F7F5F0]

                opacity-0

                animate-[heroTitleReveal_1200ms_200ms_cubic-bezier(.16,1,.3,1)_forwards]

                sm:text-[72px]

                md:text-[82px]

                lg:text-[82px]

                xl:text-[108px]
              "
            >
              Timepieces
              <br />

              <span
                className="
                  italic

                  text-[#C9A227]/90

                  transition-colors
                  duration-700

                  group-hover:text-[#E2C76D]
                "
              >
                that define
              </span>

              <br />

              your presence.
            </h1>

            {/* Short line */}

            <div
              className="
                mt-8

                h-px

                w-0

                bg-gradient-to-r
                from-[#C9A227]
                to-transparent

                animate-[heroLineWide_1200ms_550ms_cubic-bezier(.16,1,.3,1)_forwards]
              "
            />

            {/* Description */}

            <p
              className="
                mt-7

                max-w-md

                text-sm
                leading-7

                text-white/38

                sm:text-[15px]
                sm:leading-8

                opacity-0

                animate-[heroReveal_900ms_550ms_cubic-bezier(.16,1,.3,1)_forwards]
              "
            >
              Discover a curated collection of
              timepieces selected for character,
              precision and timeless presence.
            </p>

            {/* CTA */}

            <div
              className="
                mt-9

                flex
                flex-wrap
                items-center
                gap-3

                opacity-0

                animate-[heroReveal_900ms_680ms_cubic-bezier(.16,1,.3,1)_forwards]
              "
            >
              {/* Primary */}

              <Link
                href="/products"
                className="
                  group/primary

                  relative
                  inline-flex

                  items-center
                  gap-5

                  overflow-hidden

                  border
                  border-[#C9A227]/45

                  bg-[#C9A227]

                  px-5
                  py-3.5

                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]

                  text-[#090909]

                  transition-all
                  duration-500

                  hover:border-[#E2C76D]
                  hover:bg-[#E2C76D]

                  hover:shadow-[0_14px_40px_rgba(201,162,39,0.10)]
                "
              >
                <span
                  className="
                    absolute
                    inset-y-0
                    -left-[70%]
                    w-[45%]

                    -skew-x-[20deg]

                    bg-white/35

                    transition-all
                    duration-700

                    group-hover/primary:left-[125%]
                  "
                />

                <span className="relative z-10">
                  Discover Collection
                </span>

                <span
                  className="
                    relative
                    z-10

                    flex
                    h-6
                    w-6

                    items-center
                    justify-center

                    border
                    border-black/20
                  "
                >
                  <ArrowUpRight
                    size={11}
                    strokeWidth={1.5}
                    className="
                      transition-transform
                      duration-500

                      group-hover/primary:-translate-y-0.5
                      group-hover/primary:translate-x-0.5
                    "
                  />
                </span>
              </Link>

              {/* Secondary */}

              <Link
                href="/products"
                className="
                  group/secondary

                  inline-flex
                  items-center
                  gap-3

                  border
                  border-white/10

                  bg-white/[0.015]

                  px-5
                  py-3.5

                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.25em]

                  text-white/48

                  transition-all
                  duration-500

                  hover:border-white/20
                  hover:bg-white/[0.035]
                  hover:text-white/80
                "
              >
                View Watches

                <span
                  className="
                    h-px
                    w-5

                    bg-white/18

                    transition-all
                    duration-500

                    group-hover/secondary:w-8
                    group-hover/secondary:bg-[#C9A227]
                  "
                />
              </Link>
            </div>

            {/* Editorial metadata */}

            <div
              className="
                mt-11

                flex
                items-center
                gap-5

                border-t
                border-white/[0.07]

                pt-5

                opacity-0

                animate-[heroReveal_900ms_820ms_cubic-bezier(.16,1,.3,1)_forwards]
              "
            >
              <div>
                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.25em]

                    text-white/20
                  "
                >
                  Collection
                </p>

                <p
                  className="
                    mt-1

                    font-serif
                    text-sm

                    text-white/65
                  "
                >
                  2026
                </p>
              </div>

              <span
                className="
                  h-7
                  w-px

                  bg-white/10
                "
              />

              <div>
                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.25em]

                    text-white/20
                  "
                >
                  Edition
                </p>

                <p
                  className="
                    mt-1

                    font-serif
                    text-sm

                    text-white/65
                  "
                >
                  ORVEN LUX
                </p>
              </div>

              <span
                className="
                  h-7
                  w-px

                  bg-white/10
                "
              />

              <div>
                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.25em]

                    text-white/20
                  "
                >
                  Delivery
                </p>

                <p
                  className="
                    mt-1

                    font-serif
                    text-sm

                    text-white/65
                "
                >
                  Algeria
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT 3D WATCH STAGE
          ================================================= */}

          <div
            className="
              relative

              flex

              min-h-[430px]

              items-center
              justify-center

              lg:min-h-[660px]
            "
            style={{
              transform:
                "translate3d(calc(var(--hero-x) * -8px), calc(var(--hero-y) * -5px), 0)",
              transition:
                "transform 1200ms cubic-bezier(.16,1,.3,1)",
            }}
          >
            {/* =================================================
                ORBITAL SYSTEM
            ================================================= */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute

                h-[310px]
                w-[310px]

                rounded-full

                border
                border-[#C9A227]/10

                transition-transform
                duration-[1200ms]
                ease-[cubic-bezier(.16,1,.3,1)]

                group-hover:scale-[1.045]

                sm:h-[430px]
                sm:w-[430px]

                lg:h-[560px]
                lg:w-[560px]
              "
              style={{
                transform:
                  "translate3d(calc(var(--hero-x) * 16px), calc(var(--hero-y) * 12px), 0)",
              }}
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute

                h-[265px]
                w-[265px]

                rounded-full

                border
                border-white/[0.045]

                sm:h-[370px]
                sm:w-[370px]

                lg:h-[495px]
                lg:w-[495px]
              "
              style={{
                transform:
                  "translate3d(calc(var(--hero-x) * -12px), calc(var(--hero-y) * -8px), 0)",
              }}
            />

            {/* Tilted orbit */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute

                h-[380px]
                w-[175px]

                rotate-[28deg]

                rounded-[50%]

                border
                border-[#C9A227]/10

                sm:h-[510px]
                sm:w-[235px]

                lg:h-[680px]
                lg:w-[305px]

                animate-[orbitRotate_22s_linear_infinite]
              "
            />

            {/* Small orbit */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute

                h-[210px]
                w-[90px]

                rotate-[-35deg]

                rounded-[50%]

                border
                border-[#C9A227]/[0.055]

                sm:h-[300px]
                sm:w-[120px]

                lg:h-[410px]
                lg:w-[170px]

                animate-[orbitRotateReverse_17s_linear_infinite]
              "
            />

            {/* Orbit point */}

            <span
              aria-hidden="true"
              className="
                absolute
                right-[14%]
                top-[23%]

                h-[5px]
                w-[5px]

                rounded-full

                bg-[#C9A227]/75

                shadow-[0_0_14px_rgba(201,162,39,0.55)]

                animate-[orbitPoint_5s_ease-in-out_infinite]
              "
            />

            {/* =================================================
                GOLD AURA
            ================================================= */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute

                h-[330px]
                w-[330px]

                rounded-full

                bg-[#C9A227]/[0.035]

                blur-[70px]

                transition-all
                duration-[1300ms]

                group-hover:scale-[1.12]
                group-hover:bg-[#C9A227]/[0.055]

                sm:h-[440px]
                sm:w-[440px]

                lg:h-[530px]
                lg:w-[530px]
              "
            />

            {/* =================================================
                3D WATCH
            ================================================= */}

            <div
              ref={clockRef}
              className="
                relative
                z-10

                h-[275px]
                w-[275px]

                sm:h-[355px]
                sm:w-[355px]

                lg:h-[425px]
                lg:w-[425px]
              "
              style={{
                transform:
                  "translate3d(calc(var(--hero-x) * 18px), calc(var(--hero-y) * 14px), 70px) rotateX(var(--hero-rx)) rotateY(var(--hero-ry))",
                transformStyle:
                  "preserve-3d",
                transition:
                  "transform 950ms cubic-bezier(.16,1,.3,1)",
              }}
            >
              {/* Outer shadow */}

              <div
                className="
                  absolute
                  inset-[1%]

                  rounded-full

                  bg-black

                  shadow-[0_45px_100px_rgba(0,0,0,0.78)]
                "
              />

              {/* Strap top */}

              <div
                className="
                  absolute
                  left-1/2
                  top-[-8%]

                  h-[34%]
                  w-[29%]

                  -translate-x-1/2

                  rounded-t-[36px]
                  rounded-b-[13px]

                  bg-gradient-to-b
                  from-[#141414]
                  via-[#30302E]
                  to-[#0D0D0D]

                  shadow-[0_18px_30px_rgba(0,0,0,0.45)]
                "
                style={{
                  transform:
                    "translateX(-50%) translateZ(-45px)",
                  transformStyle:
                    "preserve-3d",
                }}
              >
                <div
                  className="
                    absolute
                    inset-x-3
                    top-7
                    bottom-6

                    rounded-[20px]

                    border
                    border-white/[0.055]

                    bg-black/[0.12]
                  "
                />
              </div>

              {/* Strap bottom */}

              <div
                className="
                  absolute
                  left-1/2
                  bottom-[-8%]

                  h-[34%]
                  w-[29%]

                  -translate-x-1/2

                  rounded-t-[13px]
                  rounded-b-[36px]

                  bg-gradient-to-b
                  from-[#0B0B0A]
                  via-[#282826]
                  to-[#101010]

                  shadow-[0_24px_35px_rgba(0,0,0,0.55)]
                "
                style={{
                  transform:
                    "translateX(-50%) translateZ(-45px)",
                  transformStyle:
                    "preserve-3d",
                }}
              >
                <div
                  className="
                    absolute
                    inset-x-3
                    bottom-7
                    top-6

                    rounded-[20px]

                    border
                    border-white/[0.055]
                  "
                />
              </div>

              {/* =================================================
                  CASE
              ================================================== */}

              <div
                className="
                  absolute
                  inset-0

                  rounded-full

                  border-[7px]

                  border-[#A6874B]

                  bg-[radial-gradient(
                    circle_at_31%_22%,
                    #F0E1BA_0%,
                    #C0A263_17%,
                    #755E34_35%,
                    #302615_58%,
                    #100F0C_80%,
                    #050505_100%
                  )]

                  p-[9px]

                  shadow-[
                    0_0_70px_rgba(201,162,39,0.10),
                    0_35px_90px_rgba(0,0,0,0.72),
                    inset_0_0_20px_rgba(255,255,255,0.05)
                  ]
                "
                style={{
                  transform:
                    "translateZ(60px)",
                  transformStyle:
                    "preserve-3d",
                }}
              >
                {/* Bezel */}

                <div
                  className="
                    relative
                    h-full
                    w-full

                    rounded-full

                    border
                    border-[#E2C76D]/35

                    bg-[#090909]

                    p-3

                    shadow-[inset_0_0_35px_rgba(0,0,0,0.65)]
                  "
                >
                  {/* Dial */}

                  <div
                    className="
                      relative
                      h-full
                      w-full

                      overflow-hidden

                      rounded-full

                      bg-[radial-gradient(
                        circle_at_47%_37%,
                        #2B261B_0%,
                        #191711_28%,
                        #0D0C0A_57%,
                        #030303_100%
                      )]

                      shadow-[inset_0_0_70px_rgba(0,0,0,0.72)]
                    "
                  >
                    {/* Dial radial light */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-[28%]

                        h-[50%]
                        w-[50%]

                        -translate-x-1/2

                        rounded-full

                        bg-[#C9A227]/[0.025]

                        blur-2xl
                      "
                    />

                    {/* Dial ring */}

                    <div
                      className="
                        absolute
                        inset-[7%]

                        rounded-full

                        border
                        border-[#C9A227]/10
                      "
                    />

                    {/* Inner ring */}

                    <div
                      className="
                        absolute
                        inset-[11%]

                        rounded-full

                        border
                        border-white/[0.025]
                      "
                    />

                    {/* Hour markers */}

                    {Array.from({
                      length: 12,
                    }).map(
                      (_, index) => {
                        const angle =
                          index * 30;

                        const major =
                          index % 3 === 0;

                        return (
                          <div
                            key={index}
                            className="
                              absolute
                              inset-0
                              flex
                              items-start
                              justify-center
                            "
                            style={{
                              transform:
                                `rotate(${angle}deg)`,
                            }}
                          >
                            <span
                              className={
                                major
                                  ? `
                                    mt-[6%]
                                    h-5
                                    w-[2px]
                                    bg-[#C9A227]/85
                                  `
                                  : `
                                    mt-[6%]
                                    h-3
                                    w-px
                                    bg-white/25
                                  `
                              }
                            />
                          </div>
                        );
                      },
                    )}

                    {/* ORVEN */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-[24%]

                        -translate-x-1/2

                        text-center
                      "
                    >
                      <p
                        className="
                          font-serif
                          text-[14px]

                          tracking-[0.22em]

                          text-[#E2C76D]

                          sm:text-[17px]
                        "
                      >
                        ORVEN
                      </p>

                      <p
                        className="
                          mt-1

                          text-[5px]

                          font-medium
                          uppercase
                          tracking-[0.34em]

                          text-white/30

                          sm:text-[6px]
                        "
                      >
                        LUX
                      </p>
                    </div>

                    {/* Automatic */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-[56%]

                        -translate-x-1/2

                        whitespace-nowrap
                      "
                    >
                      <span
                        className="
                          font-mono
                          text-[7px]

                          tracking-[0.22em]

                          text-white/28

                          sm:text-[8px]
                        "
                      >
                        AUTOMATIC
                      </span>
                    </div>

                    {/* Small markers */}

                    <span
                      className="
                        absolute
                        left-[28%]
                        top-[57%]

                        h-1
                        w-1

                        rounded-full

                        bg-[#C9A227]/60

                        shadow-[0_0_8px_rgba(201,162,39,0.3)]
                      "
                    />

                    <span
                      className="
                        absolute
                        right-[28%]
                        top-[57%]

                        h-1
                        w-1

                        rounded-full

                        bg-[#C9A227]/40
                      "
                    />

                    {/* =================================================
                        HANDS
                    ================================================== */}

                    <span
                      className="
                        absolute
                        bottom-1/2
                        left-1/2

                        h-[23%]
                        w-[3px]

                        origin-bottom

                        -translate-x-1/2

                        rounded-full

                        bg-[#E4CF99]

                        shadow-[0_0_8px_rgba(226,199,109,0.12)]
                      "
                      style={{
                        transform:
                          `translateX(-50%) rotate(${hourDeg}deg)`,
                      }}
                    />

                    <span
                      className="
                        absolute
                        bottom-1/2
                        left-1/2

                        h-[34%]
                        w-[2px]

                        origin-bottom

                        -translate-x-1/2

                        rounded-full

                        bg-[#F7F5F0]
                      "
                      style={{
                        transform:
                          `translateX(-50%) rotate(${minuteDeg}deg)`,
                      }}
                    />

                    <span
                      className="
                        absolute
                        bottom-1/2
                        left-1/2

                        h-[39%]
                        w-px

                        origin-bottom

                        -translate-x-1/2

                        bg-[#C9A227]

                        shadow-[0_0_7px_rgba(201,162,39,0.25)]
                      "
                      style={{
                        transform:
                          `translateX(-50%) rotate(${secondDeg}deg)`,
                      }}
                    />

                    {/* Center pin */}

                    <span
                      className="
                        absolute
                        left-1/2
                        top-1/2

                        h-3
                        w-3

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        border
                        border-[#C9A227]

                        bg-[#0A0A0A]

                        shadow-[0_0_12px_rgba(201,162,39,0.15)]
                      "
                    />

                    {/* Date window */}

                    <div
                      className="
                        absolute
                        left-1/2
                        top-[70%]

                        -translate-x-1/2

                        border
                        border-white/[0.08]

                        bg-black/55

                        px-2.5
                        py-1
                      "
                    >
                      <span
                        className="
                          font-mono
                          text-[7px]

                          tracking-[0.15em]

                          text-white/50
                        "
                      >
                        {dateValue}.
                        {monthValue}
                      </span>
                    </div>

                    {/* Glass reflection */}

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-0

                        rounded-full

                        bg-[linear-gradient(
                          125deg,
                          rgba(255,255,255,0.10),
                          transparent_18%,
                          transparent_60%,
                          rgba(201,162,39,0.04)
                        )]
                      "
                    />
                  </div>
                </div>

                {/* Case highlight */}

                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute

                    left-[12%]
                    top-[9%]

                    h-[18%]
                    w-[8%]

                    rotate-[-38deg]

                    rounded-full

                    bg-white/25

                    blur-[3px]
                  "
                />
              </div>
            </div>

            {/* =================================================
                FLOATING SPEC LABEL
            ================================================= */}

            <div
              className="
                absolute
                bottom-[2%]
                right-[1%]

                hidden

                border
                border-white/[0.08]

                bg-[#090909]/55

                px-4
                py-3

                backdrop-blur-xl

                lg:block

                transition-all
                duration-700

                group-hover:translate-x-1
                group-hover:-translate-y-1
                group-hover:border-[#C9A227]/20
              "
              style={{
                transform:
                  "translate3d(calc(var(--hero-x) * -16px), calc(var(--hero-y) * -11px), 100px)",
              }}
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-[4px]
                    w-[4px]

                    rounded-full

                    bg-[#C9A227]

                    shadow-[0_0_9px_rgba(201,162,39,0.6)]
                  "
                />

                <span
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.25em]

                    text-[#C9A227]/75
                  "
                >
                  Precision
                </span>
              </div>

              <p
                className="
                  mt-1.5

                  text-[8px]
                  uppercase
                  tracking-[0.18em]

                  text-white/25
                "
              >
                Crafted for time
              </p>
            </div>

            {/* =================================================
                TIME READOUT
            ================================================= */}

            <div
              className="
                absolute
                left-[2%]
                top-[18%]

                hidden

                lg:block
              "
              style={{
                transform:
                  "translate3d(calc(var(--hero-x) * -10px), calc(var(--hero-y) * -7px), 40px)",
              }}
            >
              <p
                className="
                  text-[7px]
                  uppercase
                  tracking-[0.3em]

                  text-white/20
                "
              >
                Local time
              </p>

              <p
                className="
                  mt-2

                  font-mono
                  text-[10px]

                  tabular-nums
                  tracking-[0.18em]

                  text-[#C9A227]/60
                "
              >
                {time
                  ? time.toLocaleTimeString(
                      "en-GB",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      },
                    )
                  : "--:--:--"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM SCROLL CONTROL
      ====================================================== */}

      <div
        className="
          absolute
          bottom-6
          left-5
          z-20

          sm:left-8

          lg:left-12
        "
      >
        <Link
          href="/products"
          className="
            group/scroll

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

              border
              border-white/10

              bg-white/[0.01]

              text-white/30

              transition-all
              duration-500

              group-hover/scroll:border-[#C9A227]/35
              group-hover/scroll:bg-[#C9A227]/[0.04]
              group-hover/scroll:text-[#C9A227]/80
            "
          >
            <ArrowDown
              size={12}
              strokeWidth={1.2}
              className="
                transition-transform
                duration-500

                animate-[heroArrow_2.6s_ease-in-out_infinite]

                group-hover/scroll:translate-y-1
              "
            />
          </span>

          <span
            className="
              hidden

              text-[8px]
              uppercase
              tracking-[0.28em]

              text-white/22

              transition-colors
              duration-500

              group-hover/scroll:text-[#C9A227]/60

              sm:block
            "
          >
            Discover collection
          </span>
        </Link>
      </div>

      {/* =====================================================
          PAGE INDEX
      ====================================================== */}

      <div
        className="
          absolute
          bottom-7
          right-5
          z-20

          sm:right-8

          lg:right-12
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              font-mono
              text-[8px]
              tracking-[0.25em]

              text-[#C9A227]/60
            "
          >
            01
          </span>

          <span
            className="
              h-px
              w-8

              bg-gradient-to-r
              from-[#C9A227]/55
              to-transparent
            "
          />

          <span
            className="
              font-mono
              text-[8px]
              tracking-[0.25em]

              text-white/18
            "
          >
            04
          </span>
        </div>
      </div>

      {/* =====================================================
          ANIMATION SYSTEM
      ====================================================== */}

      <style>{`
        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translate3d(0, 24px, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes heroTitleReveal {
          from {
            opacity: 0;
            transform:
              translate3d(0, 34px, 0)
              scale(0.985);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform:
              translate3d(0, 0, 0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes heroLineReveal {
          from {
            width: 0;
          }

          to {
            width: 100%;
          }
        }

        @keyframes heroLineWide {
          from {
            width: 0;
          }

          to {
            width: min(260px, 55%);
          }
        }

        @keyframes heroAtmosphere {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0)
              scale(1);
          }

          50% {
            transform:
              translate3d(-28px, 18px, 0)
              scale(1.06);
          }
        }

        @keyframes heroAtmosphereReverse {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0)
              scale(1);
          }

          50% {
            transform:
              translate3d(24px, -24px, 0)
              scale(1.05);
          }
        }

        @keyframes orbitRotate {
          0% {
            transform: rotate(28deg);
          }

          50% {
            transform: rotate(34deg);
          }

          100% {
            transform: rotate(28deg);
          }
        }

        @keyframes orbitRotateReverse {
          0% {
            transform: rotate(-35deg);
          }

          50% {
            transform: rotate(-43deg);
          }

          100% {
            transform: rotate(-35deg);
          }
        }

        @keyframes orbitPoint {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0)
              scale(1);
            opacity: 0.55;
          }

          50% {
            transform:
              translate3d(-14px, 10px, 0)
              scale(1.45);
            opacity: 1;
          }
        }

        @keyframes heroArrow {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(4px);
          }
        }

        @media (max-width: 767px) {
          .group {
            --hero-rx: 0deg !important;
            --hero-ry: 0deg !important;
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
    </section>
  );
}