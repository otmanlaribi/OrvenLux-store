"use client";

import { useState } from "react";
import RefreshOrdersButton from "./RefreshOrdersButton";

type PointerState = {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
};

export default function OrdersHeader() {
  const [pointer, setPointer] = useState<PointerState>({
    x: 50,
    y: 50,
    rotateX: 0,
    rotateY: 0,
  });

  const [isHovered, setIsHovered] = useState(false);

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 100;

    const y =
      ((event.clientY - rect.top) / rect.height) * 100;

    const rotateY = (x - 50) * 0.08;
    const rotateX = -(y - 50) * 0.06;

    setPointer({
      x,
      y,
      rotateX,
      rotateY,
    });
  }

  function handlePointerLeave() {
    setIsHovered(false);

    setPointer({
      x: 50,
      y: 50,
      rotateX: 0,
      rotateY: 0,
    });
  }

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerEnter={() =>
        setIsHovered(true)
      }
      onPointerLeave={handlePointerLeave}
      className="
        group
        relative
        min-h-[360px]
        overflow-hidden
        rounded-[28px]
        border
        border-white/[0.08]
        bg-[#0B0B0B]
        px-6
        py-8
        shadow-[0_30px_90px_rgba(0,0,0,0.35)]
        sm:min-h-[400px]
        sm:rounded-[32px]
        sm:px-9
        sm:py-9
        lg:px-12
        lg:py-11
      "
    >
      {/* =====================================================
          Ambient Background
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
        {/* Main soft light */}
        <div
          className="
            absolute
            -right-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#C9A227]/[0.055]
            blur-[90px]
          "
        />

        {/* Secondary graphite glow */}
        <div
          className="
            absolute
            -bottom-44
            left-1/4
            h-[460px]
            w-[460px]
            rounded-full
            bg-white/[0.018]
            blur-[100px]
          "
        />

        {/* Fine editorial lines */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.28]
            [background-image:linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)]
            [background-size:72px_72px]
          "
        />

        {/* Horizon line */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#C9A227]/35
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          Cursor Light
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
        style={{
          background: `radial-gradient(
            360px circle at ${pointer.x}% ${pointer.y}%,
            rgba(201,162,39,0.09),
            rgba(201,162,39,0.025) 28%,
            transparent 62%
          )`,
        }}
      />

      {/* =====================================================
          Main Content
          ===================================================== */}

      <div className="relative z-10 flex min-h-[300px] flex-col justify-between gap-10 lg:min-h-[315px] lg:flex-row lg:items-center">
        {/* ===================================================
            Left / Editorial Copy
            =================================================== */}

        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-3">
            <span
              className="
                h-px
                w-12
                bg-[#C9A227]
                shadow-[0_0_12px_rgba(201,162,39,0.28)]
              "
            />

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.34em]
                text-[#C9A227]
              "
            >
              ORVEN LUX / COMMAND
            </span>
          </div>

          {/* Main title */}
          <h1
            className="
              font-serif
              text-[2.9rem]
              font-medium
              leading-[0.95]
              tracking-[-0.035em]
              text-[#F7F5F0]
              sm:text-[4rem]
              lg:text-[4.6rem]
            "
          >
            Order
            <span className="block italic text-[#C9A227]">
              Command
            </span>
          </h1>

          {/* Divider */}
          <div className="mt-7 h-px w-24 bg-white/[0.12]" />

          {/* Description */}
          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-white/48
              sm:text-[15px]
              sm:leading-8
            "
          >
            متابعة دقيقة لكل طلب، من لحظة إنشائه
            حتى اكتمال رحلة التسليم — داخل مركز
            التشغيل الخاص بـ ORVEN LUX.
          </p>

          {/* Status line */}
          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-3
            "
          >
            <div className="flex items-center gap-2">
              <span
                className="
                  relative
                  flex
                  h-2
                  w-2
                "
              >
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-[#C9A227]/45
                  "
                />
                <span
                  className="
                    relative
                    inline-flex
                    h-2
                    w-2
                    rounded-full
                    bg-[#C9A227]
                    shadow-[0_0_12px_rgba(201,162,39,0.7)]
                  "
                />
              </span>

              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-white/45
                "
              >
                Live Operations
              </span>
            </div>

            <span className="h-3 w-px bg-white/10" />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-white/30
              "
            >
              Precision / 01
            </span>
          </div>
        </div>

        {/* ===================================================
            Right / Interactive 3D Instrument
            =================================================== */}

        <div
          className="
            relative
            flex
            min-h-[190px]
            shrink-0
            items-center
            justify-center
            lg:min-h-[270px]
            lg:w-[390px]
          "
          style={{
            perspective: "1100px",
          }}
        >
          {/* Outer glow */}
          <div
            aria-hidden="true"
            className="
              absolute
              h-[190px]
              w-[190px]
              rounded-full
              bg-[#C9A227]/[0.055]
              blur-[55px]
              transition-transform
              duration-700
              ease-out
              lg:h-[240px]
              lg:w-[240px]
            "
            style={{
              transform: `
                translate(
                  ${pointer.rotateY * -1.8}px,
                  ${pointer.rotateX * 1.8}px
                )
                scale(${isHovered ? 1.08 : 1})
              `,
            }}
          />

          {/* Ambient orbit */}
          <div
            aria-hidden="true"
            className="
              absolute
              h-[190px]
              w-[190px]
              rounded-full
              border
              border-[#C9A227]/[0.10]
              transition-transform
              duration-700
              ease-out
              lg:h-[250px]
              lg:w-[250px]
            "
            style={{
              transform: `
                rotateX(${pointer.rotateX}deg)
                rotateY(${pointer.rotateY}deg)
                rotateZ(${isHovered ? 5 : 0}deg)
              `,
            }}
          >
            <div
              className="
                absolute
                -right-1
                top-1/2
                h-1.5
                w-1.5
                -translate-y-1/2
                rounded-full
                bg-[#C9A227]
                shadow-[0_0_16px_rgba(201,162,39,0.8)]
              "
            />
          </div>

          {/* =================================================
              3D Watch-inspired Command Object
              ================================================= */}

          <div
            className="
              relative
              h-[160px]
              w-[160px]
              transition-transform
              duration-200
              ease-out
              will-change-transform
              lg:h-[205px]
              lg:w-[205px]
            "
            style={{
              transformStyle: "preserve-3d",
              transform: `
                rotateX(${pointer.rotateX}deg)
                rotateY(${pointer.rotateY}deg)
                translateZ(${isHovered ? 12 : 0}px)
              `,
            }}
          >
            {/* Rear plate */}
            <div
              className="
                absolute
                inset-[8%]
                rounded-full
                border
                border-white/[0.08]
                bg-[#111111]
                shadow-[0_35px_60px_rgba(0,0,0,0.4)]
              "
              style={{
                transform:
                  "translateZ(-24px)",
              }}
            />

            {/* Outer metallic ring */}
            <div
              className="
                absolute
                inset-0
                rounded-full
                border
                border-[#C9A227]/20
                bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.09),rgba(255,255,255,0.015)_34%,rgba(201,162,39,0.06)_64%,rgba(0,0,0,0.4)_100%)]
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035),0_25px_60px_rgba(0,0,0,0.45)]
              "
              style={{
                transform:
                  "translateZ(8px)",
              }}
            />

            {/* Inner dial */}
            <div
              className="
                absolute
                inset-[12%]
                rounded-full
                border
                border-white/[0.06]
                bg-[#0A0A0A]
                shadow-[inset_0_0_35px_rgba(0,0,0,0.8)]
              "
              style={{
                transform:
                  "translateZ(18px)",
              }}
            />

            {/* Dial highlight */}
            <div
              className="
                absolute
                left-[23%]
                top-[18%]
                h-[32%]
                w-[24%]
                rotate-[28deg]
                rounded-full
                bg-white/[0.06]
                blur-[5px]
              "
              style={{
                transform:
                  "translateZ(25px) rotate(28deg)",
              }}
            />

            {/* Gold hand */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[35%]
                w-px
                origin-bottom
                bg-gradient-to-t
                from-[#C9A227]
                to-[#E8D48A]
                shadow-[0_0_9px_rgba(201,162,39,0.3)]
              "
              style={{
                transform:
                  "translate(-50%, -100%) rotate(38deg) translateZ(30px)",
              }}
            />

            {/* Secondary hand */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[27%]
                w-px
                origin-bottom
                bg-white/65
              "
              style={{
                transform:
                  "translate(-50%, -100%) rotate(-52deg) translateZ(27px)",
              }}
            />

            {/* Center pin */}
            <div
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
                border-[#C9A227]/55
                bg-[#C9A227]
                shadow-[0_0_16px_rgba(201,162,39,0.5)]
              "
              style={{
                transform:
                  "translate(-50%, -50%) translateZ(34px)",
              }}
            />

            {/* Cardinal markers */}
            <span
              className="
                absolute
                left-1/2
                top-[14%]
                h-2
                w-px
                -translate-x-1/2
                bg-[#C9A227]/75
              "
              style={{
                transform:
                  "translateX(-50%) translateZ(25px)",
              }}
            />

            <span
              className="
                absolute
                bottom-[14%]
                left-1/2
                h-2
                w-px
                -translate-x-1/2
                bg-white/30
              "
              style={{
                transform:
                  "translateX(-50%) translateZ(25px)",
              }}
            />

            <span
              className="
                absolute
                left-[14%]
                top-1/2
                h-px
                w-2
                -translate-y-1/2
                bg-white/25
              "
              style={{
                transform:
                  "translateY(-50%) translateZ(25px)",
              }}
            />

            <span
              className="
                absolute
                right-[14%]
                top-1/2
                h-px
                w-2
                -translate-y-1/2
                bg-white/25
              "
              style={{
                transform:
                  "translateY(-50%) translateZ(25px)",
              }}
            />

            {/* Floating center label */}
            <div
              className="
                absolute
                inset-x-0
                bottom-[24%]
                text-center
              "
              style={{
                transform:
                  "translateZ(30px)",
              }}
            >
              <span
                className="
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.4em]
                  text-white/35
                "
              >
                ORVEN
              </span>
            </div>
          </div>

          {/* 3D caption */}
          <div
            className="
              absolute
              bottom-0
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              text-center
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.32em]
                text-white/25
              "
            >
              Precision Instrument
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          Refresh Action
          ===================================================== */}

      <div
        className="
          absolute
          bottom-6
          left-6
          z-20
          sm:bottom-8
          sm:left-8
          lg:bottom-10
          lg:left-12
        "
      >
        <div
          className="
            rounded-full
            border
            border-white/[0.08]
            bg-white/[0.035]
            p-1
            shadow-[0_12px_30px_rgba(0,0,0,0.2)]
            backdrop-blur-md
            transition-all
            duration-300
            hover:border-[#C9A227]/25
            hover:bg-white/[0.055]
          "
        >
          <RefreshOrdersButton />
        </div>
      </div>

      {/* =====================================================
          Top Right Accent
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute
          right-0
          top-0
          h-full
          w-px
          bg-gradient-to-b
          from-[#C9A227]/0
          via-[#C9A227]/45
          to-[#C9A227]/0
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          right-0
          top-14
          h-20
          w-1
          rounded-l-full
          bg-[#C9A227]
          shadow-[0_0_18px_rgba(201,162,39,0.35)]
        "
      />
    </section>
  );
}