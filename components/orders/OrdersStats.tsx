"use client";

import {
  CheckCircle,
  Clock,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useState } from "react";

type OrdersStatsProps = {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
};

type StatItemProps = {
  index: string;
  title: string;
  value: number;
  description: string;
  icon: typeof ShoppingBag;
  accent: string;
  active?: boolean;
};

function StatItem({
  index,
  title,
  value,
  description,
  icon: Icon,
  accent,
  active = false,
}: StatItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className="
        group
        relative
        min-h-[180px]
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.07]
        bg-[#0D0D0D]
        px-5
        py-5
        shadow-[0_18px_45px_rgba(0,0,0,0.22)]
        transition-all
        duration-500
        ease-out
        hover:border-white/[0.12]
        hover:shadow-[0_24px_55px_rgba(0,0,0,0.3)]
        sm:rounded-[24px]
        sm:px-6
        sm:py-6
      "
      style={{
        transform: isHovered
          ? "translateY(-3px)"
          : "translateY(0)",
      }}
    >
      {/* =================================================
          Ambient spotlight
          ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-44
          w-44
          rounded-full
          opacity-0
          blur-[55px]
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
        style={{
          background: accent,
          opacity: isHovered ? 0.08 : 0,
        }}
      />

      {/* =================================================
          Top accent line
          ================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-5
          top-0
          h-px
          transition-all
          duration-500
          sm:inset-x-6
        "
        style={{
          background: `linear-gradient(
            to left,
            ${accent},
            transparent 72%
          )`,
          opacity: isHovered || active ? 0.65 : 0.3,
        }}
      />

      {/* =================================================
          Subtle radial atmosphere
          ================================================= */}

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
            circle at 88% 8%,
            ${accent}12,
            transparent 30%
          )`,
        }}
      />

      {/* =================================================
          Header line
          ================================================= */}

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-white/25
              "
            >
              {index}
            </span>

            <span className="h-px w-5 bg-white/10" />
          </div>

          <p
            className="
              mt-3
              text-[10px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-white/42
            "
          >
            {title}
          </p>
        </div>

        {/* =================================================
            Icon instrument
            ================================================= */}

        <div
          className="
            relative
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/[0.08]
            bg-white/[0.025]
            transition-all
            duration-500
            group-hover:border-white/[0.14]
            group-hover:bg-white/[0.045]
          "
          style={{
            transform: isHovered
              ? "rotate(-6deg) translateZ(8px)"
              : "rotate(0deg)",
          }}
        >
          <Icon
            size={16}
            strokeWidth={1.6}
            style={{
              color: accent,
              filter: isHovered
                ? `drop-shadow(0 0 7px ${accent}55)`
                : "none",
            }}
          />

          <span
            aria-hidden="true"
            className="
              absolute
              inset-0
              rounded-full
              opacity-0
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
            style={{
              boxShadow: `inset 0 0 0 1px ${accent}24`,
            }}
          />
        </div>
      </div>

      {/* =================================================
          Main number
          ================================================= */}

      <div className="relative z-10 mt-8 flex items-end justify-between gap-4">
        <div>
          <p
            className="
              font-serif
              text-[2.55rem]
              font-medium
              leading-none
              tracking-[-0.04em]
              text-[#F7F5F0]
              transition-transform
              duration-500
              ease-out
              sm:text-[2.9rem]
            "
            style={{
              transform: isHovered
                ? "translateX(-2px)"
                : "translateX(0)",
            }}
          >
            {value.toLocaleString("en-US")}
          </p>

          <p
            className="
              mt-3
              max-w-[190px]
              text-xs
              leading-5
              text-white/32
            "
          >
            {description}
          </p>
        </div>

        {/* Status mark */}
        <div
          className="
            mb-1
            hidden
            h-2
            w-2
            shrink-0
            rounded-full
            sm:block
          "
          style={{
            background: accent,
            boxShadow: `0 0 14px ${accent}55`,
            opacity: active ? 0.95 : 0.55,
          }}
        />
      </div>

      {/* =================================================
          Bottom instrument rail
          ================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-4
          left-5
          right-5
          flex
          items-center
          justify-between
          sm:left-6
          sm:right-6
        "
      >
        <span className="text-[8px] uppercase tracking-[0.24em] text-white/16">
          ORVEN / DATA
        </span>

        <div className="flex items-center gap-1">
          <span
            className="h-px w-3"
            style={{
              background: accent,
              opacity: 0.5,
            }}
          />
          <span
            className="
              h-px
              w-6
              bg-white/10
            "
          />
        </div>
      </div>
    </article>
  );
}

export default function OrdersStats({
  totalOrders,
  pendingOrders,
  shippedOrders,
  deliveredOrders,
}: OrdersStatsProps) {
  return (
    <div
      className="
        grid
        gap-3
        md:grid-cols-2
        xl:grid-cols-4
      "
      style={{
        perspective: "1200px",
      }}
    >
      <StatItem
        index="01"
        title="Total Orders"
        value={totalOrders}
        description="All customer orders currently registered."
        icon={ShoppingBag}
        accent="#C9A227"
        active
      />

      <StatItem
        index="02"
        title="Pending"
        value={pendingOrders}
        description="Orders waiting for processing."
        icon={Clock}
        accent="#D7B84C"
      />

      <StatItem
        index="03"
        title="Shipped"
        value={shippedOrders}
        description="Orders currently moving through delivery."
        icon={Truck}
        accent="#BFA24A"
      />

      <StatItem
        index="04"
        title="Delivered"
        value={deliveredOrders}
        description="Successfully completed customer orders."
        icon={CheckCircle}
        accent="#D4C27A"
      />
    </div>
  );
}