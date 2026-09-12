"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/database";

type RecommendedProductsProps = {
  currentProductId: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startScrollLeft: number;
  moved: boolean;
};

const MOBILE_STEP = 0.88;
const TABLET_STEP = 0.82;
const DESKTOP_STEP = 0.74;

export default function RecommendedProducts({
  currentProductId,
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/products?active=true&limit=24&excludeId=${currentProductId}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load recommended products",
          );
        }

        const result = (await response.json()) as
          | Product[]
          | {
              products?: Product[];
            };

        const receivedProducts = Array.isArray(result)
          ? result
          : result.products ?? [];

        const uniqueProducts =
          receivedProducts.filter(
            (product, index, array) =>
              array.findIndex(
                (item) => item.id === product.id,
              ) === index,
          );

        if (mounted) {
          setProducts(uniqueProducts);
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "RECOMMENDED PRODUCTS ERROR:",
          error,
        );

        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [currentProductId]);

  /* =========================================================
     UPDATE CONTROLS
  ========================================================= */

  const updateControls = useCallback(() => {
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

  /* =========================================================
     OBSERVERS
  ========================================================= */

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const frame = window.requestAnimationFrame(
      updateControls,
    );

    const handleScroll = () => {
      updateControls();
    };

    const handleResize = () => {
      updateControls();
    };

    track.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.cancelAnimationFrame(frame);

      track.removeEventListener(
        "scroll",
        handleScroll,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [products.length, updateControls]);

  /* =========================================================
     STEP
  ========================================================= */

  const getStep = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return 320;
    }

    const width = track.clientWidth;

    if (width <= 640) {
      return width * MOBILE_STEP;
    }

    if (width <= 1024) {
      return width * TABLET_STEP;
    }

    return width * DESKTOP_STEP;
  }, []);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const moveCarousel = useCallback(
    (direction: "prev" | "next") => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const amount = getStep();

      track.scrollBy({
        left:
          direction === "next"
            ? amount
            : -amount,
        behavior: "smooth",
      });
    },
    [getStep],
  );

  /* =========================================================
     POINTER DOWN
  ========================================================= */

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
        startScrollLeft: track.scrollLeft,
        moved: false,
      };

      setIsDragging(true);

      try {
        track.setPointerCapture(
          event.pointerId,
        );
      } catch {
        // Pointer capture is optional.
      }
    },
    [],
  );

  /* =========================================================
     POINTER MOVE
  ========================================================= */

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

      const delta =
        event.clientX -
        dragRef.current.startX;

      if (Math.abs(delta) > 6) {
        dragRef.current.moved = true;
      }

      track.scrollLeft =
        dragRef.current.startScrollLeft -
        delta;
    },
    [isDragging],
  );

  /* =========================================================
     POINTER UP
  ========================================================= */

  const handlePointerUp = useCallback(
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
          // Ignore.
        }
      }

      setIsDragging(false);

      window.requestAnimationFrame(
        updateControls,
      );
    },
    [updateControls],
  );

  /* =========================================================
     POINTER CANCEL
  ========================================================= */

  const handlePointerCancel =
    useCallback(
      (
        event: ReactPointerEvent<HTMLDivElement>,
      ) => {
        const track =
          trackRef.current;

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
            // Ignore.
          }
        }

        dragRef.current.moved = false;

        setIsDragging(false);

        window.requestAnimationFrame(
          updateControls,
        );
      },
      [updateControls],
    );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section
        aria-label="Recommended watches"
        className="relative w-full"
      >
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#C9A227]/65" />

              <span className="text-[8px] font-medium uppercase tracking-[0.38em] text-[#827D73]">
                Continue Exploring
              </span>
            </div>

            <h2 className="mt-5 font-serif text-3xl tracking-[-0.035em] text-[#EEE9DF] sm:text-4xl">
              More from ORVEN LUX
            </h2>

            <p className="mt-3 max-w-xl text-[11px] leading-6 text-[#77736B] sm:text-xs">
              Discover more timepieces from the
              ORVEN LUX collection.
            </p>
          </div>

          <div className="hidden h-10 w-24 animate-pulse rounded-full bg-white/[0.04] sm:block" />
        </div>

        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className={[
                "w-[78vw] min-w-[78vw]",
                "sm:w-[46vw] sm:min-w-[46vw]",
                "lg:w-[31vw] lg:min-w-[31vw]",
                "2xl:w-[320px] 2xl:min-w-[320px]",
              ].join(" ")}
            >
              <div className="mb-3 h-3 w-20 animate-pulse rounded bg-white/[0.04]" />

              <div className="h-[390px] animate-pulse rounded-[24px] border border-white/[0.06] bg-[#11110F]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (products.length === 0) {
    return null;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      aria-label="Recommended watches"
      className="relative w-full"
    >
      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="mb-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-[#C9A227]" />

            <span className="text-[8px] font-medium uppercase tracking-[0.38em] text-[#7D786F]">
              Continue Exploring
            </span>

            <Sparkles
              size={11}
              strokeWidth={1.25}
              className="text-[#C9A227]/55"
            />
          </div>

          <h2 className="mt-5 max-w-2xl font-serif text-3xl tracking-[-0.04em] text-[#F0EBE1] sm:text-4xl lg:text-[3.15rem]">
            More from ORVEN LUX
          </h2>

          <p className="mt-4 max-w-xl text-[11px] leading-6 text-[#77736B] sm:text-xs">
            Pieces selected to continue the
            experience.
          </p>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="mr-1 hidden text-right sm:block">
            <p className="text-[7px] font-medium uppercase tracking-[0.22em] text-[#514E49]">
              Collection
            </p>

            <p className="mt-1 font-mono text-[8px] tracking-[0.18em] text-[#77736B]">
              {String(products.length).padStart(
                2,
                "0",
              )}{" "}
              PIECES
            </p>
          </div>

          <button
            type="button"
            aria-label="Previous recommended products"
            disabled={!canPrev}
            onClick={() =>
              moveCarousel("prev")
            }
            className={[
              "group relative flex h-12 w-12 items-center justify-center",
              "overflow-hidden rounded-full border",
              "border-white/[0.08] bg-[#10100F]",
              "text-[#858077] shadow-[0_12px_28px_rgba(0,0,0,0.16)]",
              "transition-all duration-500",
              "hover:-translate-y-0.5",
              "hover:border-[#C9A227]/35",
              "hover:bg-[#C9A227]/[0.045]",
              "hover:text-[#C9A227]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-25",
              "disabled:hover:translate-y-0",
            ].join(" ")}
          >
            <ChevronLeft
              size={18}
              strokeWidth={1.25}
              className="transition-transform duration-500 group-hover:-translate-x-0.5"
            />
          </button>

          <button
            type="button"
            aria-label="Next recommended products"
            disabled={!canNext}
            onClick={() =>
              moveCarousel("next")
            }
            className={[
              "group relative flex h-12 w-12 items-center justify-center",
              "overflow-hidden rounded-full",
              "border border-[#C9A227]/28",
              "bg-[#C9A227]/[0.06]",
              "text-[#C9A227]",
              "shadow-[0_12px_30px_rgba(201,162,39,0.05)]",
              "transition-all duration-500",
              "hover:-translate-y-0.5",
              "hover:border-[#C9A227]/55",
              "hover:bg-[#C9A227]/[0.11]",
              "hover:shadow-[0_18px_42px_rgba(201,162,39,0.09)]",
              "disabled:cursor-not-allowed",
              "disabled:opacity-25",
              "disabled:hover:translate-y-0",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(226,199,109,0.18),transparent_58%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <ChevronRight
              size={18}
              strokeWidth={1.25}
              className="relative z-10 transition-transform duration-500 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      {/* ===================================================
          CAROUSEL
      ==================================================== */}

      <div className="relative">
        {/* LEFT FADE */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-[#090909] via-[#090909]/75 to-transparent sm:w-20"
        />

        {/* RIGHT FADE */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-[#090909] via-[#090909]/75 to-transparent sm:w-20"
        />

        {/* TRACK */}

        <div
          ref={trackRef}
          className={[
            "flex min-w-0 gap-4 sm:gap-5 lg:gap-6",
            "overflow-x-auto overflow-y-visible",
            "pb-6 pt-4",
            "snap-x snap-proximity",
            "[scrollbar-width:none]",
            "[-ms-overflow-style:none]",
            isDragging
              ? "cursor-grabbing select-none"
              : "cursor-grab",
          ].join(" ")}
          style={{
            scrollbarWidth: "none",
            touchAction: "pan-x",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={
            handlePointerCancel
          }
        >
          {products.map((product, index) => (
            <article
              key={product.id}
              className={[
                "group relative shrink-0 snap-start",
                "w-[79vw] min-w-[79vw]",
                "sm:w-[47vw] sm:min-w-[47vw]",
                "md:w-[37vw] md:min-w-[37vw]",
                "lg:w-[31vw] lg:min-w-[31vw]",
                "xl:w-[27vw] xl:min-w-[27vw]",
                "2xl:w-[320px] 2xl:min-w-[320px]",
              ].join(" ")}
            >
              {/* =================================================
                  CARD HEADER
              ================================================== */}

              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] tracking-[0.22em] text-[#C9A227]/60">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span className="h-px w-5 bg-white/[0.07]" />

                  <span className="text-[7px] uppercase tracking-[0.22em] text-[#514E49]">
                    ORVEN PIECE
                  </span>
                </div>

                <span className="text-[7px] uppercase tracking-[0.19em] text-[#4D4943]">
                  VIEW
                </span>
              </div>

              {/* =================================================
                  CARD
              ================================================== */}

              <div
                className={[
                  "relative overflow-hidden rounded-[24px]",
                  "border border-white/[0.07]",
                  "bg-[#11110F]",
                  "p-2",
                  "shadow-[0_28px_75px_rgba(0,0,0,0.20)]",
                  "transition-all duration-700",
                  "group-hover:-translate-y-1",
                  "group-hover:border-[#C9A227]/25",
                  "group-hover:shadow-[0_38px_100px_rgba(0,0,0,0.31)]",
                ].join(" ")}
              >
                {/* GOLD ORBIT */}

                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute -right-20 -top-20",
                    "h-48 w-48 rounded-full",
                    "bg-[#C9A227]/[0.025] blur-3xl",
                    "transition-all duration-1000",
                    "group-hover:bg-[#C9A227]/[0.075]",
                    "group-hover:scale-125",
                  ].join(" ")}
                />

                {/* CENTER ATMOSPHERE */}

                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute left-1/2 top-[38%]",
                    "h-56 w-56 -translate-x-1/2 -translate-y-1/2",
                    "rounded-full bg-white/[0.012] blur-3xl",
                    "transition-all duration-1000",
                    "group-hover:bg-[#C9A227]/[0.028]",
                  ].join(" ")}
                />

                {/* INDEX BADGE */}

                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute left-5 top-5 z-20",
                    "flex h-8 min-w-8 items-center justify-center",
                    "rounded-full border border-white/[0.075]",
                    "bg-black/25 px-2",
                    "font-mono text-[7px] tracking-[0.16em]",
                    "text-white/30 backdrop-blur-xl",
                    "transition-all duration-500",
                    "group-hover:border-[#C9A227]/25",
                    "group-hover:text-[#C9A227]/75",
                  ].join(" ")}
                >
                  {String(index + 1).padStart(
                    2,
                    "0",
                  )}
                </div>

                {/* IMAGE */}

                <div className="relative z-10 overflow-hidden rounded-[19px]">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    image={product.image}
                  />
                </div>

                {/* GOLD HAIRLINE */}

                <div
                  aria-hidden="true"
                  className="mx-3 h-px bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent"
                />

                {/* CARD FOOTER */}

                <div className="relative z-10 flex items-center justify-between gap-4 px-3 py-4">
                  <div className="min-w-0">
                    <p className="text-[6px] font-medium uppercase tracking-[0.28em] text-[#57534C]">
                      ORVEN LUX
                    </p>

                    <p className="mt-1 truncate font-serif text-[13px] tracking-[-0.01em] text-[#C4BFB4]">
                      {product.name}
                    </p>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    draggable={false}
                    onClick={(event) => {
                      if (
                        dragRef.current
                          .moved
                      ) {
                        event.preventDefault();
                      }

                      dragRef.current.moved =
                        false;
                    }}
                    className={[
                      "group/discover relative inline-flex shrink-0",
                      "items-center gap-2",
                      "rounded-full border",
                      "border-white/[0.08]",
                      "bg-white/[0.025]",
                      "px-3 py-2",
                      "text-[7px] font-semibold uppercase",
                      "tracking-[0.19em]",
                      "text-[#8F8A81]",
                      "transition-all duration-400",
                      "hover:border-[#C9A227]/35",
                      "hover:bg-[#C9A227]/[0.05]",
                      "hover:text-[#C9A227]",
                    ].join(" ")}
                  >
                    Discover

                    <MoveUpRight
                      size={10}
                      strokeWidth={1.3}
                      className="transition-transform duration-300 group-hover/discover:-translate-y-0.5 group-hover/discover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {/* END SPACING */}

          <div
            aria-hidden="true"
            className="min-w-6 shrink-0"
          />
        </div>
      </div>

      {/* ===================================================
          BOTTOM NAVIGATION STATUS
      ==================================================== */}

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#C9A227]/25" />

          <span className="text-[7px] font-medium uppercase tracking-[0.25em] text-[#55514B]">
            Swipe to explore
          </span>

          <span className="h-px w-8 bg-[#C9A227]/15" />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[7px] uppercase tracking-[0.22em] text-[#48443F]">
            {canPrev
              ? "Previous available"
              : "Start"}{" "}
            ·{" "}
            {canNext
              ? "More pieces"
              : "End of selection"}
          </span>

          <span className="h-1 w-1 rounded-full bg-[#C9A227]/45" />

          <span className="text-[7px] uppercase tracking-[0.22em] text-[#48443F]">
            ORVEN / COLLECTION
          </span>
        </div>
      </div>

      {/* ===================================================
          SCROLLBAR / REDUCED MOTION
      ==================================================== */}

      <style jsx>{`
        div[style*="scrollbar-width"]::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          div[style*="scrollbar-width"] {
            scroll-behavior: auto !important;
          }

          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}