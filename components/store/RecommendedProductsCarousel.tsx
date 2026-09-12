"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MoveUpRight,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import  ProductCard  from "@/components/ProductCard";
import type { Product } from "@/types/database";

type RecommendedProductsCarouselProps = {
  products: Product[];
};

type DragState = {
  pointerId: number;
  startX: number;
  startScrollLeft: number;
  moved: boolean;
};

export default function RecommendedProductsCarousel({
  products,
}: RecommendedProductsCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const dragRef = useRef<DragState>({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const uniqueProducts = products.filter(
    (product, index, array) =>
      array.findIndex(
        (item) => item.id === product.id,
      ) === index,
  );

  const updateNavigation = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const maxScroll = Math.max(
      0,
      track.scrollWidth - track.clientWidth,
    );

    const tolerance = 8;

    setCanPrev(track.scrollLeft > tolerance);

    setCanNext(
      track.scrollLeft <
        maxScroll - tolerance,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    updateNavigation();

    const handleScroll = () => {
      updateNavigation();
    };

    const handleResize = () => {
      updateNavigation();
    };

    track.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      track.removeEventListener(
        "scroll",
        handleScroll,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [
    uniqueProducts.length,
    updateNavigation,
  ]);

  const getScrollStep = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return 340;
    }

    const width = track.clientWidth;

    if (width <= 640) {
      return width * 0.88;
    }

    if (width <= 1024) {
      return width * 0.84;
    }

    return width * 0.76;
  }, []);

  const moveCarousel = useCallback(
    (direction: "previous" | "next") => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const amount = getScrollStep();

      track.scrollBy({
        left:
          direction === "next"
            ? amount
            : -amount,
        behavior: "smooth",
      });
    },
    [getScrollStep],
  );

  const handlePointerDown = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>,
    ) => {
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      const target =
        event.target as HTMLElement | null;

      if (
        target?.closest(
          "a, button, input, textarea, select",
        )
      ) {
        return;
      }

      const track = trackRef.current;

      if (!track) {
        return;
      }

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft:
          track.scrollLeft,
        moved: false,
      };

      setIsDragging(true);

      try {
        track.setPointerCapture(
          event.pointerId,
        );
      } catch {
        // Pointer capture is not guaranteed.
      }
    },
    [],
  );

  const handlePointerMove = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>,
    ) => {
      if (!isDragging) {
        return;
      }

      const track = trackRef.current;

      if (!track) {
        return;
      }

      if (
        dragRef.current.pointerId !==
        event.pointerId
      ) {
        return;
      }

      const distance =
        event.clientX -
        dragRef.current.startX;

      if (
        Math.abs(distance) > 6
      ) {
        dragRef.current.moved = true;
      }

      track.scrollLeft =
        dragRef.current.startScrollLeft -
        distance;
    },
    [isDragging],
  );

  const finishDrag = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>,
    ) => {
      const track = trackRef.current;

      if (
        track &&
        dragRef.current.pointerId ===
          event.pointerId
      ) {
        try {
          if (
            track.hasPointerCapture(
              event.pointerId,
            )
          ) {
            track.releasePointerCapture(
              event.pointerId,
            );
          }
        } catch {
          // Ignore pointer capture errors.
        }
      }

      setIsDragging(false);

      window.requestAnimationFrame(
        updateNavigation,
      );
    },
    [updateNavigation],
  );

  const cancelDrag = useCallback(
    (
      event: ReactPointerEvent<HTMLDivElement>,
    ) => {
      const track = trackRef.current;

      if (
        track &&
        dragRef.current.pointerId ===
          event.pointerId
      ) {
        try {
          if (
            track.hasPointerCapture(
              event.pointerId,
            )
          ) {
            track.releasePointerCapture(
              event.pointerId,
            );
          }
        } catch {
          // Ignore pointer capture errors.
        }
      }

      dragRef.current.moved = false;

      setIsDragging(false);

      window.requestAnimationFrame(
        updateNavigation,
      );
    },
    [updateNavigation],
  );

  if (uniqueProducts.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Recommended watches"
      className="relative w-full"
    >
      {/* HEADER */}
      <div
        className="
          mb-8
          flex
          flex-col
          gap-5
          sm:mb-10
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A227]" />

            <span
              className="
                text-[8px]
                font-medium
                uppercase
                tracking-[0.38em]
                text-[#77736B]
              "
            >
              Continue Exploring
            </span>
          </div>

          <h2
            className="
              mt-5
              font-serif
              text-3xl
              tracking-[-0.03em]
              text-[#EEE9DF]
              sm:text-4xl
            "
          >
            More from ORVEN LUX
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-[11px]
              leading-6
              text-[#77736B]
              sm:text-xs
            "
          >
            Discover more timepieces
            from the ORVEN LUX
            collection.
          </p>
        </div>

        {/* NAVIGATION */}
        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          <span
            className="
              mr-2
              hidden
              text-[8px]
              font-medium
              uppercase
              tracking-[0.25em]
              text-[#514E49]
              sm:block
            "
          >
            {uniqueProducts.length} Pieces
          </span>

          <button
            type="button"
            aria-label="Previous recommended watches"
            disabled={!canPrev}
            onClick={() =>
              moveCarousel("previous")
            }
            className="
              group
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-white/[0.08]
              bg-[#11110F]
              text-[#77736C]
              transition-all
              duration-500
              hover:-translate-y-0.5
              hover:border-[#C9A227]/35
              hover:bg-[#C9A227]/[0.05]
              hover:text-[#C9A227]
              hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]
              disabled:cursor-not-allowed
              disabled:opacity-25
              disabled:hover:translate-y-0
              disabled:hover:border-white/[0.08]
              disabled:hover:bg-[#11110F]
              disabled:hover:text-[#77736C]
            "
          >
            <ChevronLeft
              size={17}
              strokeWidth={1.3}
              className="
                relative
                z-10
                transition-transform
                duration-500
                group-hover:-translate-x-0.5
              "
            />
          </button>

          <button
            type="button"
            aria-label="Next recommended watches"
            disabled={!canNext}
            onClick={() =>
              moveCarousel("next")
            }
            className="
              group
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-[#C9A227]/25
              bg-[#C9A227]/[0.055]
              text-[#C9A227]
              transition-all
              duration-500
              hover:-translate-y-0.5
              hover:border-[#C9A227]/50
              hover:bg-[#C9A227]/[0.09]
              hover:shadow-[0_12px_32px_rgba(201,162,39,0.08)]
              disabled:cursor-not-allowed
              disabled:opacity-25
              disabled:hover:translate-y-0
              disabled:hover:border-[#C9A227]/25
              disabled:hover:bg-[#C9A227]/[0.055]
            "
          >
            <ChevronRight
              size={17}
              strokeWidth={1.3}
              className="
                relative
                z-10
                transition-transform
                duration-500
                group-hover:translate-x-0.5
              "
            />
          </button>
        </div>
      </div>

      {/* CAROUSEL */}
      <div className="relative">
        {/* LEFT FADE */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-20
            w-8
            bg-gradient-to-r
            from-[#0A0A09]
            to-transparent
            sm:w-12
          "
        />

        {/* RIGHT FADE */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-20
            w-8
            bg-gradient-to-l
            from-[#0A0A09]
            to-transparent
            sm:w-12
          "
        />

        {/* TRACK */}
        <div
          ref={trackRef}
          className={`
            flex
            min-w-0
            gap-4
            overflow-x-auto
            overflow-y-visible
            pb-5
            pt-2
            snap-x
            snap-mandatory
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            sm:gap-5
            lg:gap-6
            ${
              isDragging
                ? "cursor-grabbing select-none"
                : "cursor-grab"
            }
          `}
          style={{
            scrollbarWidth: "none",
            touchAction: "pan-x",
            scrollBehavior:
              isDragging
                ? "auto"
                : "smooth",
          }}
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={finishDrag}
          onPointerCancel={cancelDrag}
        >
          {uniqueProducts.map(
            (product, index) => (
              <article
                key={product.id}
                className="
                  group
                  relative
                  w-[82vw]
                  min-w-[82vw]
                  snap-start
                  sm:w-[48vw]
                  sm:min-w-[48vw]
                  md:w-[38vw]
                  md:min-w-[38vw]
                  lg:w-[30vw]
                  lg:min-w-[30vw]
                  xl:w-[27vw]
                  xl:min-w-[27vw]
                  2xl:w-[320px]
                  2xl:min-w-[320px]
                "
              >
                {/* PIECE INDEX */}
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    px-1
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[8px]
                      tracking-[0.28em]
                      text-[#C9A227]/55
                    "
                  >
                    PIECE{" "}
                    {String(
                      index + 1,
                    ).padStart(2, "0")}
                  </span>

                  <span
                    className="
                      h-px
                      w-8
                      bg-white/[0.06]
                      transition-all
                      duration-500
                      group-hover:w-14
                      group-hover:bg-[#C9A227]/25
                    "
                  />
                </div>

                {/* CARD */}
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-white/[0.07]
                    bg-[#11110F]
                    p-2
                    shadow-[0_24px_70px_rgba(0,0,0,0.16)]
                    transition-all
                    duration-700
                    group-hover:-translate-y-1
                    group-hover:border-[#C9A227]/22
                    group-hover:shadow-[0_34px_90px_rgba(0,0,0,0.28)]
                    sm:rounded-[24px]
                  "
                >
                  {/* GOLD ATMOSPHERE */}
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
                      bg-[#C9A227]/[0.035]
                      blur-3xl
                      transition-all
                      duration-700
                      group-hover:bg-[#C9A227]/[0.075]
                    "
                  />

                  {/* IMAGE AURA */}
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-1/3
                      h-44
                      w-44
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-white/[0.012]
                      blur-3xl
                      transition-all
                      duration-700
                      group-hover:bg-[#C9A227]/[0.025]
                    "
                  />

                  {/* NUMBER */}
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-4
                      z-20
                      flex
                      h-7
                      min-w-7
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/[0.08]
                      bg-black/30
                      px-2
                      font-mono
                      text-[7px]
                      tracking-[0.14em]
                      text-white/30
                      backdrop-blur-md
                      transition-all
                      duration-500
                      group-hover:border-[#C9A227]/25
                      group-hover:text-[#C9A227]/75
                    "
                  >
                    {String(
                      index + 1,
                    ).padStart(2, "0")}
                  </span>

                  {/* PRODUCT */}
                  <div
                    className="
                      relative
                      z-10
                      overflow-hidden
                      rounded-[18px]
                    "
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={Number(
                        product.price,
                      )}
                      image={
                        product.image
                      }
                    />
                  </div>

                  {/* FOOTER */}
                  <div
                    className="
                      relative
                      z-20
                      flex
                      items-center
                      justify-between
                      gap-3
                      border-t
                      border-white/[0.06]
                      px-3
                      py-3
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[7px]
                          font-medium
                          uppercase
                          tracking-[0.24em]
                          text-[#55514B]
                        "
                      >
                        ORVEN LUX
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[8px]
                          text-[#69655E]
                        "
                      >
                        {product.name}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      draggable={false}
                      onClick={(event) => {
                        if (
                          dragRef.current.moved
                        ) {
                          event.preventDefault();
                        }
                      }}
                      className="
                        group/discover
                        inline-flex
                        shrink-0
                        items-center
                        gap-1.5
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-[#8D897F]
                        transition-colors
                        duration-300
                        hover:text-[#C9A227]
                      "
                    >
                      Discover

                      <MoveUpRight
                        size={11}
                        strokeWidth={1.3}
                        className="
                          transition-transform
                          duration-300
                          group-hover/discover:-translate-y-0.5
                          group-hover/discover:translate-x-0.5
                        "
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ),
          )}

          <div
            aria-hidden="true"
            className="min-w-5 shrink-0"
          />
        </div>
      </div>

      {/* BOTTOM META */}
      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            text-[7px]
            font-medium
            uppercase
            tracking-[0.28em]
            text-[#504D47]
          "
        >
          <span className="h-px w-5 bg-[#C9A227]/25" />

          <span className="sm:hidden">
            Swipe to explore
          </span>

          <span className="hidden sm:inline">
            Drag or use the arrows to explore
          </span>

          <span className="h-px w-5 bg-[#C9A227]/15" />
        </div>

        <span
          className="
            text-[7px]
            uppercase
            tracking-[0.24em]
            text-[#45423D]
          "
        >
          ORVEN / COLLECTION
        </span>
      </div>
    </section>
  );
}