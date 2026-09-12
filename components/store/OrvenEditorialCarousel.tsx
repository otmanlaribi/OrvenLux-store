"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { Product } from "@/types/database";

import styles from "./OrvenEditorialCarousel.module.css";

type VisualKind =
  | "house"
  | "craft"
  | "character"
  | "hero";

interface EditorialPiece {
  id?: number;
  name: string;
  price: string;
  href?: string;
  imageUrl?: string;
}

interface EditorialSlide {
  id: string;
  eyebrow: string;
  headline: string;
  supporting?: string;
  meta?: string;
  visual: VisualKind | "collection";
  imageUrl?: string;
  pieces?: EditorialPiece[];
  ctas?: {
    primary: string;
    secondary: string;
    primaryHref?: string;
    secondaryHref?: string;
  };
}

export interface OrvenEditorialCarouselProps {
  products?: Product[];
  slides?: EditorialSlide[];
  autoplayMs?: number | false;
  className?: string;
}

const DEFAULT_SLIDES: EditorialSlide[] = [
  {
    id: "house",
    eyebrow: "ORVEN LUX / THE HOUSE",
    headline: "Precision becomes presence.",
    supporting:
      "ORVEN LUX is built around the details that remain unnoticed at first glance — proportion, balance, material and character.",
    visual: "house",
  },
  {
    id: "craft",
    eyebrow: "02 / CRAFT",
    headline: "Every detail has a purpose.",
    supporting:
      "From the silhouette to the smallest finishing detail, every ORVEN LUX piece is selected for balance, restraint and character.",
    visual: "craft",
  },
  {
    id: "character",
    eyebrow: "03 / CHARACTER",
    headline: "Luxury is rarely loud.",
    supporting:
      "A distinguished timepiece does not need to compete for attention. Its character reveals itself through proportion, texture and presence.",
    visual: "character",
    meta: "ORVEN / EDITION 01",
  },
  {
    id: "collection",
    eyebrow: "04 / THE COLLECTION",
    headline:
      "Choose the piece that speaks quietly.",
    visual: "collection",
    pieces: [],
  },
  {
    id: "reserve",
    eyebrow: "05 / PRIVATE PURCHASE",
    headline:
      "Your timepiece, reserved personally.",
    supporting:
      "Discover the collection and reserve your chosen piece with personal confirmation and payment on delivery.",
    visual: "hero",
    ctas: {
      primary: "Explore the collection",
      secondary: "Reserve a timepiece",
      primaryHref: "/products",
      secondaryHref: "/products",
    },
  },
];

/* =========================================================
   WATCH PLACEHOLDER
========================================================= */

function WatchFace({
  size = "default",
}: {
  size?: "default" | "small" | "large";
}) {
  return (
    <div
      className={`${styles.watchFace} ${
        styles[`watchFace_${size}`] ?? ""
      }`}
      aria-hidden="true"
    >
      <span
        className={`${styles.hand} ${styles.handHour}`}
      />

      <span
        className={`${styles.hand} ${styles.handMinute}`}
      />

      <span className={styles.hub} />
    </div>
  );
}

/* =========================================================
   REAL PRODUCT VISUAL
========================================================= */

function ProductVisual({
  imageUrl,
  className = "",
  priority = false,
}: {
  imageUrl?: string;
  className?: string;
  priority?: boolean;
}) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div
      className={`${styles.productVisual} ${className}`}
      aria-hidden="true"
    >
      <div className={styles.productGlow} />

      <div
        className={styles.productHalo}
        aria-hidden="true"
      />

      <div
        className="
          relative
          h-full
          w-full
        "
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          priority={priority}
          sizes="
            (max-width: 640px) 70vw,
            (max-width: 1024px) 48vw,
            700px
          "
          draggable={false}
          className={styles.productImage}
        />
      </div>
    </div>
  );
}

/* =========================================================
   VISUAL STAGE
========================================================= */

function SlideVisual({
  slide,
  isActive,
}: {
  slide: EditorialSlide;
  isActive?: boolean;
}) {
  switch (slide.visual) {
    case "house":
      if (slide.imageUrl) {
        return (
          <div
            className={`${styles.panelVisual} ${styles.visualHouse}`}
            aria-hidden="true"
          >
            <div
              className={
                styles.visualAmbient
              }
            />

            <div
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

                border
                border-[#C9A227]/[0.08]

                transition-transform
                duration-[1200ms]
                ease-[cubic-bezier(.16,1,.3,1)]

                sm:h-[420px]
                sm:w-[420px]

                lg:h-[540px]
                lg:w-[540px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2

                h-[250px]
                w-[250px]

                -translate-x-1/2
                -translate-y-1/2

                rounded-full

                border
                border-white/[0.035]

                sm:h-[340px]
                sm:w-[340px]

                lg:h-[430px]
                lg:w-[430px]
              "
            />

            <ProductVisual
              imageUrl={
                slide.imageUrl
              }
              className={
                styles.visualProductHouse
              }
              priority={isActive}
            />

            <div
              className="
                absolute
                bottom-6
                right-6
                z-10

                border
                border-white/[0.08]

                bg-black/35

                px-3
                py-2

                text-[7px]
                uppercase
                tracking-[0.25em]

                text-white/35

                backdrop-blur-xl

                sm:bottom-8
                sm:right-8
              "
            >
              SELECTED TIMEPIECE / 01
            </div>
          </div>
        );
      }

      return (
        <div
          className={`${styles.panelVisual} ${styles.watchScene}`}
          aria-hidden="true"
        >
          <div
            className={
              styles.sceneVignette
            }
          />

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2

              h-[330px]
              w-[330px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              border
              border-[#C9A227]/10

              sm:h-[440px]
              sm:w-[440px]

              lg:h-[560px]
              lg:w-[560px]
            "
          />

          <WatchFace />

          <div
            className="
              absolute
              bottom-6
              right-6
              z-10

              border
              border-white/[0.08]

              bg-black/35

              px-3
              py-2

              text-[7px]
              uppercase
              tracking-[0.25em]

              text-white/35

              backdrop-blur-xl
            "
          >
            SELECTED TIMEPIECE / 01
          </div>
        </div>
      );

    case "craft":
      return (
        <div
          className={`${styles.panelVisual} ${styles.macroDetail}`}
          aria-hidden="true"
        >
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2

              h-[300px]
              w-[300px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              border
              border-[#C9A227]/[0.07]

              sm:h-[420px]
              sm:w-[420px]

              sm:border-[#C9A227]/[0.085]

              lg:h-[540px]
              lg:w-[540px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2

              h-[210px]
              w-[210px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              border
              border-white/[0.035]

              sm:h-[280px]
              sm:w-[280px]

              lg:h-[360px]
              lg:w-[360px]
            "
          />

          <span
            className={
              styles.macroArc
            }
          />

          <span
            className={
              styles.macroCrown
            }
          />

          <span
            className={
              styles.macroHighlight
            }
          />

          <span
            className={
              styles.macroReflection
            }
          />

          <div
            className="
              absolute
              bottom-6
              left-6
              z-10

              text-[7px]
              uppercase
              tracking-[0.30em]

              text-[#C9A227]/55
            "
          >
            MATERIAL / FORM / FINISH
          </div>
        </div>
      );

    case "character":
      if (slide.imageUrl) {
        return (
          <div
            className={`${styles.panelVisual} ${styles.visualCharacter}`}
            aria-hidden="true"
          >
            <div
              className={
                styles.visualAmbient
              }
            />

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2

                h-[360px]
                w-[360px]

                -translate-x-1/2
                -translate-y-1/2

                rounded-full

                border
                border-[#C9A227]/[0.07]

                sm:h-[480px]
                sm:w-[480px]

                lg:h-[580px]
                lg:w-[580px]
              "
            />

            <ProductVisual
              imageUrl={
                slide.imageUrl
              }
              className={
                styles.visualProductCharacter
              }
              priority={isActive}
            />

            <div
              className="
                absolute
                bottom-6
                left-6
                z-10

                border-l
                border-[#C9A227]/35

                pl-3

                text-[7px]
                uppercase
                tracking-[0.27em]

                text-white/35
              "
            >
              ORVEN / EDITION 01
            </div>
          </div>
        );
      }

      return (
        <div
          className={`${styles.panelVisual} ${styles.lifestyleScene}`}
          aria-hidden="true"
        >
          <div
            className={`${styles.lsLayer} ${styles.lsBg}`}
            data-layer="bg"
          />

          <div
            className={`${styles.lsLayer} ${styles.lsMid}`}
            data-layer="mid"
          />

          <div
            className={`${styles.lsLayer} ${styles.lsFg}`}
            data-layer="fg"
          >
            <WatchFace size="small" />
          </div>

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2

              h-[250px]
              w-[250px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              border
              border-[#C9A227]/[0.06]

              sm:h-[340px]
              sm:w-[340px]
            "
          />
        </div>
      );

    case "hero":
      if (slide.imageUrl) {
        return (
          <div
            className={`${styles.panelVisual} ${styles.visualHero}`}
            aria-hidden="true"
          >
            <div
              className={
                styles.visualAmbient
              }
            />

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2

                h-[390px]
                w-[390px]

                -translate-x-1/2
                -translate-y-1/2

                rounded-full

                border
                border-[#C9A227]/10

                sm:h-[500px]
                sm:w-[500px]

                lg:h-[620px]
                lg:w-[620px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2

                h-[260px]
                w-[260px]

                -translate-x-1/2
                -translate-y-1/2

                rounded-full

                border
                border-white/[0.035]

                sm:h-[360px]
                sm:w-[360px]

                lg:h-[460px]
                lg:w-[460px]
              "
            />

            <ProductVisual
              imageUrl={
                slide.imageUrl
              }
              className={
                styles.visualProductHero
              }
              priority={isActive}
            />

            <div
              className="
                absolute
                bottom-6
                right-6
                z-10

                border
                border-[#C9A227]/20

                bg-black/40

                px-3
                py-2

                text-[7px]
                uppercase
                tracking-[0.27em]

                text-[#C9A227]/65

                backdrop-blur-xl
              "
            >
              PRIVATE SELECTION / 05
            </div>
          </div>
        );
      }

      return (
        <div
          className={`${styles.panelVisual} ${styles.heroScene}`}
          aria-hidden="true"
        >
          <div
            className={
              styles.heroAura
            }
          />

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2

              h-[420px]
              w-[420px]

              -translate-x-1/2
              -translate-y-1/2

              rounded-full

              border
              border-[#C9A227]/10

              sm:h-[520px]
              sm:w-[520px]

              lg:h-[640px]
              lg:w-[640px]
            "
          />

          <WatchFace size="large" />

          <div
            className="
              absolute
              bottom-6
              right-6
              z-10

              border
              border-[#C9A227]/20

              bg-black/40

              px-3
              py-2

              text-[7px]
              uppercase
              tracking-[0.27em]

              text-[#C9A227]/65

              backdrop-blur-xl
            "
          >
            PRIVATE SELECTION / 05
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* =========================================================
   COLLECTION GRID
========================================================= */

function CollectionGrid({
  pieces,
}: {
  pieces: EditorialPiece[];
}) {
  if (!pieces.length) {
    return null;
  }

  return (
    <div
      className={styles.collectionGrid}
      onPointerDown={(event) =>
        event.stopPropagation()
      }
      onPointerMove={(event) =>
        event.stopPropagation()
      }
      onPointerUp={(event) =>
        event.stopPropagation()
      }
    >
      {pieces.map(
        (piece, index) => {
          const content = (
            <>
              <span
                className={
                  styles.pieceNumber
                }
              >
                {String(
                  index + 1,
                ).padStart(2, "0")}
              </span>

              <span
                className={
                  styles.cardWatchFrame
                }
                aria-hidden="true"
              >
                {piece.imageUrl ? (
                  <div
                    className="
                      relative
                      h-full
                      w-full
                    "
                  >
                    <Image
                      src={
                        piece.imageUrl
                      }
                      alt=""
                      fill
                      unoptimized
                      sizes="160px"
                      draggable={false}
                      className={
                        styles.cardWatchImage
                      }
                    />
                  </div>
                ) : (
                  <span
                    className={
                      styles.cardWatch
                    }
                  />
                )}
              </span>

              <span
                className={
                  styles.pieceInfo
                }
              >
                <span
                  className={
                    styles.pieceName
                  }
                >
                  {piece.name}
                </span>

                <span
                  className={
                    styles.piecePrice
                  }
                >
                  {piece.price}
                </span>
              </span>

              <span
                className={
                  styles.pieceCta
                }
              >
                Discover

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </>
          );

          if (piece.href) {
            return (
              <Link
                key={
                  piece.id ??
                  `${piece.name}-${piece.href}`
                }
                href={piece.href}
                className={
                  styles.pieceCard
                }
                aria-label={`Discover ${piece.name}`}
                draggable={false}
                onPointerDown={(
                  event,
                ) =>
                  event.stopPropagation()
                }
                onPointerMove={(
                  event,
                ) =>
                  event.stopPropagation()
                }
                onPointerUp={(
                  event,
                ) =>
                  event.stopPropagation()
                }
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={
                piece.id ??
                `${piece.name}-button`
              }
              type="button"
              className={
                styles.pieceCard
              }
              aria-label={`Discover ${piece.name}`}
              onPointerDown={(event) =>
                event.stopPropagation()
              }
            >
              {content}
            </button>
          );
        },
      )}
    </div>
  );
}

/* =========================================================
   HEADLINE WORDS
========================================================= */

function wrapWords(
  text: string,
) {
  const words =
    text.split(" ");

  return words.map(
    (
      word,
      index,
    ) => (
      <span
        key={`${word}-${index}`}
        className={
          styles.word
        }
        style={{
          transitionDelay:
            `${index * 55}ms`,
        }}
      >
        {word}

        {index <
        words.length - 1
          ? "\u00A0"
          : ""}
      </span>
    ),
  );
}

/* =========================================================
   MAIN
========================================================= */

export function OrvenEditorialCarousel({
  products = [],
  slides,
  autoplayMs = 6200,
  className,
}: OrvenEditorialCarouselProps) {
  /* =========================================================
     RESOLVE PRODUCT CONTENT
  ========================================================= */

  const resolvedSlides =
    useMemo<EditorialSlide[]>(
      () => {
        const activeProducts =
          products
            .filter(
              (product) =>
                Boolean(
                  product.active,
                ) &&
                Boolean(
                  product.image,
                ),
            )
            .slice(0, 8);

        const collectionPieces: EditorialPiece[] =
          activeProducts
            .slice(0, 3)
            .map(
              (product) => ({
                id: product.id,
                name: product.name,
                price: `${Number(
                  product.price,
                ).toLocaleString(
                  "fr-FR",
                )} DZD`,
                href: `/products/${product.id}`,
                imageUrl:
                  product.image ??
                  undefined,
              }),
            );

        const productOne =
          activeProducts[0];

        const productTwo =
          activeProducts[1];

        const productThree =
          activeProducts[2];

        const sourceSlides =
          slides ??
          DEFAULT_SLIDES;

        return sourceSlides.map(
          (slide) => {
            if (
              slide.id ===
              "collection"
            ) {
              return {
                ...slide,
                pieces:
                  collectionPieces.length >
                  0
                    ? collectionPieces
                    : slide.pieces ??
                      [],
              };
            }

            if (
              slide.id ===
                "house" &&
              productOne?.image
            ) {
              return {
                ...slide,
                imageUrl:
                  productOne.image,
              };
            }

            if (
              slide.id ===
                "character" &&
              productTwo?.image
            ) {
              return {
                ...slide,
                imageUrl:
                  productTwo.image,
              };
            }

            if (
              slide.id ===
                "reserve" &&
              productThree?.image
            ) {
              return {
                ...slide,
                imageUrl:
                  productThree.image,
              };
            }

            return slide;
          },
        );
      },
      [products, slides],
    );

  const count =
    resolvedSlides.length;

  /* =========================================================
     ACTIVE INDEX
     ---------------------------------------------------------
     We deliberately do not use an effect to "fix" active.
     Instead, the current index is derived safely during render.
     This avoids react-hooks/set-state-in-effect.
  ========================================================= */

  const [active, setActive] =
    useState(0);

  const currentIndex =
    count > 0
      ? ((active % count) +
          count) %
        count
      : 0;

  const activeSlide =
    count > 0
      ? resolvedSlides[
          currentIndex
        ]
      : undefined;

  /* =========================================================
     INTERACTION STATE
  ========================================================= */

  const [hasInteracted, setHasInteracted] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const [isPointerInside, setIsPointerInside] =
    useState(false);

  const [isPointerDown, setIsPointerDown] =
    useState(false);

  /* =========================================================
     REFS
  ========================================================= */

  const stageRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const dragStartX =
    useRef(0);

  const dragDeltaX =
    useRef(0);

  const dragMoved =
    useRef(false);

  const autoplayRef =
    useRef<ReturnType<
      typeof setInterval
    > | null>(null);

  const reducedMotionRef =
    useRef(false);

  /* =========================================================
     UTILITIES
  ========================================================= */

  const pauseAutoplay =
    useCallback(() => {
      if (
        autoplayRef.current
      ) {
        clearInterval(
          autoplayRef.current,
        );

        autoplayRef.current =
          null;
      }
    }, []);

  const markInteracted =
    useCallback(() => {
      setHasInteracted(true);
    }, []);

  const goTo = useCallback(
    (index: number) => {
      if (!count) {
        return;
      }

      setActive(
        ((index % count) +
          count) %
          count,
      );
    },
    [count],
  );

  const next = useCallback(
    () => {
      if (!count) {
        return;
      }

      setActive(
        (current) =>
          (current + 1) %
          count,
      );
    },
    [count],
  );

  const prev = useCallback(
    () => {
      if (!count) {
        return;
      }

      setActive(
        (current) =>
          (current - 1 + count) %
          count,
      );
    },
    [count],
  );

  /* =========================================================
     REDUCED MOTION
  ========================================================= */

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const update =
      () => {
        reducedMotionRef.current =
          media.matches;
      };

    update();

    media.addEventListener(
      "change",
      update,
    );

    return () => {
      media.removeEventListener(
        "change",
        update,
      );
    };
  }, []);

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (
      !autoplayMs ||
      count <= 1 ||
      reducedMotionRef.current ||
      isPointerInside ||
      isDragging ||
      isPointerDown
    ) {
      pauseAutoplay();
      return;
    }

    pauseAutoplay();

    autoplayRef.current =
      setInterval(() => {
        setActive(
          (current) =>
            (current + 1) %
            count,
        );
      }, autoplayMs);

    return pauseAutoplay;
  }, [
    autoplayMs,
    count,
    isDragging,
    isPointerDown,
    isPointerInside,
    pauseAutoplay,
  ]);

  useEffect(() => {
    return () => {
      pauseAutoplay();
    };
  }, [pauseAutoplay]);

  /* =========================================================
     KEYBOARD
  ========================================================= */

  useEffect(() => {
    function onKeyDown(
      event: KeyboardEvent,
    ) {
      const target =
        event.target as HTMLElement | null;

      if (
        target?.tagName ===
          "INPUT" ||
        target?.tagName ===
          "TEXTAREA" ||
        target?.tagName ===
          "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        event.preventDefault();

        markInteracted();
        prev();

        return;
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        event.preventDefault();

        markInteracted();
        next();

        return;
      }

      if (
        event.key ===
        "Home"
      ) {
        event.preventDefault();

        markInteracted();
        goTo(0);

        return;
      }

      if (
        event.key ===
        "End"
      ) {
        event.preventDefault();

        markInteracted();
        goTo(count - 1);
      }
    }

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
    };
  }, [
    count,
    goTo,
    markInteracted,
    next,
    prev,
  ]);

  /* =========================================================
     POINTER / SWIPE
  ========================================================= */

  const onPointerDown =
    useCallback(
      (
        event: ReactPointerEvent<HTMLDivElement>,
      ) => {
        const target =
          event.target as HTMLElement | null;

        if (
          target?.closest(
            "a, button, input, textarea, select, [role='button']",
          )
        ) {
          return;
        }

        markInteracted();

        setIsPointerDown(
          true,
        );

        setIsDragging(
          true,
        );

        dragStartX.current =
          event.clientX;

        dragDeltaX.current =
          0;

        dragMoved.current =
          false;

        try {
          event.currentTarget.setPointerCapture(
            event.pointerId,
          );
        } catch {
          // Ignore pointer capture errors.
        }
      },
      [markInteracted],
    );

  const onPointerMove =
    useCallback(
      (
        event: ReactPointerEvent<HTMLDivElement>,
      ) => {
        if (
          !isDragging
        ) {
          return;
        }

        const distance =
          event.clientX -
          dragStartX.current;

        dragDeltaX.current =
          distance;

        if (
          Math.abs(
            distance,
          ) > 8
        ) {
          dragMoved.current =
            true;
        }
      },
      [isDragging],
    );

  const endDrag =
    useCallback(
      (
        event?: ReactPointerEvent<HTMLDivElement>,
      ) => {
        if (
          !isDragging
        ) {
          return;
        }

        const distance =
          dragDeltaX.current;

        const moved =
          dragMoved.current;

        setIsDragging(
          false,
        );

        setIsPointerDown(
          false,
        );

        dragStartX.current =
          0;

        dragDeltaX.current =
          0;

        dragMoved.current =
          false;

        if (event) {
          try {
            if (
              event.currentTarget.hasPointerCapture(
                event.pointerId,
              )
            ) {
              event.currentTarget.releasePointerCapture(
                event.pointerId,
              );
            }
          } catch {
            // Ignore release errors.
          }
        }

        if (
          !moved ||
          Math.abs(distance) <=
            55
        ) {
          return;
        }

        if (
          distance < 0
        ) {
          next();
        } else {
          prev();
        }
      },
      [
        isDragging,
        next,
        prev,
      ],
    );

  const onPointerCancel =
    useCallback(
      (
        event?: ReactPointerEvent<HTMLDivElement>,
      ) => {
        if (event) {
          try {
            if (
              event.currentTarget.hasPointerCapture(
                event.pointerId,
              )
            ) {
              event.currentTarget.releasePointerCapture(
                event.pointerId,
              );
            }
          } catch {
            // Ignore release errors.
          }
        }

        dragStartX.current =
          0;

        dragDeltaX.current =
          0;

        dragMoved.current =
          false;

        setIsDragging(
          false,
        );

        setIsPointerDown(
          false,
        );
      },
      [],
    );

  /* =========================================================
     PARALLAX
  ========================================================= */

  const onStageMouseMove =
    useCallback(
      (
        event: ReactPointerEvent<HTMLDivElement>,
      ) => {
        if (
          isDragging ||
          event.pointerType ===
            "touch" ||
          typeof window ===
            "undefined" ||
          window.innerWidth <=
            860
        ) {
          return;
        }

        const stage =
          stageRef.current;

        if (!stage) {
          return;
        }

        const activePanel =
          stage.querySelector<HTMLElement>(
            `[data-index="${currentIndex}"]`,
          );

        if (!activePanel) {
          return;
        }

        const rect =
          stage.getBoundingClientRect();

        if (
          !rect.width ||
          !rect.height
        ) {
          return;
        }

        const px =
          (event.clientX -
            rect.left) /
            rect.width -
          0.5;

        const py =
          (event.clientY -
            rect.top) /
            rect.height -
          0.5;

        activePanel.style.setProperty(
          "--mx",
          `${px}`,
        );

        activePanel.style.setProperty(
          "--my",
          `${py}`,
        );

        const bg =
          activePanel.querySelector<HTMLElement>(
            '[data-layer="bg"]',
          );

        const mid =
          activePanel.querySelector<HTMLElement>(
            '[data-layer="mid"]',
          );

        const fg =
          activePanel.querySelector<HTMLElement>(
            '[data-layer="fg"]',
          );

        if (bg) {
          bg.style.transform =
            `translate3d(${px * 8}px, ${py * 8}px, 0) scale(1.025)`;
        }

        if (mid) {
          mid.style.transform =
            `translate3d(${px * 18}px, ${py * 12}px, 0)`;
        }

        if (fg) {
          fg.style.transform =
            `translate3d(${px * 28}px, ${py * 18}px, 0)`;
        }

        const product =
          activePanel.querySelector<HTMLElement>(
            `.${styles.productVisual}`,
          );

        if (product) {
          product.style.transform =
            `translate3d(${px * 13}px, ${py * 10}px, 70px)`;
        }
      },
      [
        currentIndex,
        isDragging,
      ],
    );

  const resetParallax =
    useCallback(() => {
      const stage =
        stageRef.current;

      if (!stage) {
        return;
      }

      const activePanel =
        stage.querySelector<HTMLElement>(
          `[data-index="${currentIndex}"]`,
        );

      if (!activePanel) {
        return;
      }

      activePanel.style.setProperty(
        "--mx",
        "0",
      );

      activePanel.style.setProperty(
        "--my",
        "0",
      );

      const bg =
        activePanel.querySelector<HTMLElement>(
          '[data-layer="bg"]',
        );

      const mid =
        activePanel.querySelector<HTMLElement>(
          '[data-layer="mid"]',
        );

      const fg =
        activePanel.querySelector<HTMLElement>(
          '[data-layer="fg"]',
        );

      if (bg) {
        bg.style.transform =
          "translate3d(0, 0, 0) scale(1)";
      }

      if (mid) {
        mid.style.transform =
          "translate3d(0, 0, 0)";
      }

      if (fg) {
        fg.style.transform =
          "translate3d(0, 0, 0)";
      }

      const product =
        activePanel.querySelector<HTMLElement>(
          `.${styles.productVisual}`,
        );

      if (product) {
        product.style.transform =
          "translate3d(0, 0, 0)";
      }
    }, [currentIndex]);

  /* =========================================================
     GEOMETRY
  ========================================================= */

  const geometry =
    useMemo(
      () =>
        resolvedSlides.map(
          (_, index) => {
            if (!count) {
              return 0;
            }

            let diff =
              index -
              currentIndex;

            if (
              diff >
              count / 2
            ) {
              diff -= count;
            }

            if (
              diff <
              -count / 2
            ) {
              diff += count;
            }

            return diff;
          },
        ),
      [
        resolvedSlides,
        currentIndex,
        count,
      ],
    );

  if (!count) {
    return null;
  }

  return (
    <section
      className={`${styles.orven} ${
        className ?? ""
      } group`}
      aria-roledescription="carousel"
      aria-label="ORVEN LUX editorial stories"
      onMouseEnter={() =>
        setIsPointerInside(true)
      }
      onMouseLeave={() => {
        setIsPointerInside(false);
        resetParallax();
      }}
    >
      {/* ===================================================
          ATMOSPHERE
      ==================================================== */}

      <div
        className={styles.atmosphere}
        aria-hidden="true"
      />

      {/* ===================================================
          SIGNATURE LIGHT
      ==================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0

          bg-[radial-gradient(
            circle_at_50%_48%,
            rgba(201,162,39,.026),
            transparent_42%
          )]
        "
      />

      {/* ===================================================
          TOP CHROME
      ==================================================== */}

      <div
        className={styles.chromeTop}
        aria-hidden="true"
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

              shadow-[0_0_10px_rgba(201,162,39,.55)]
            "
          />

          <div
            className={
              styles.brand
            }
          >
            ORVEN LUX
          </div>
        </div>

        <div
          className={
            styles.counter
          }
        >
          <b>
            {String(
              currentIndex + 1,
            ).padStart(
              2,
              "0",
            )}
          </b>

          <span className="text-white/18">
            /
          </span>

          {String(
            count,
          ).padStart(
            2,
            "0",
          )}
        </div>
      </div>

      {/* ===================================================
          STAGE
      ==================================================== */}

      <div
        ref={stageRef}
        className={`
          ${styles.stage}
          ${
            isDragging
              ? styles.dragging
              : ""
          }
        `}
        onPointerDown={
          onPointerDown
        }
        onPointerMove={(
          event,
        ) => {
          onPointerMove(
            event,
          );

          onStageMouseMove(
            event,
          );
        }}
        onPointerUp={(
          event,
        ) =>
          endDrag(event)
        }
        onPointerCancel={(
          event,
        ) =>
          onPointerCancel(
            event,
          )
        }
        onPointerLeave={(
          event,
        ) => {
          if (
            isDragging
          ) {
            endDrag(event);
          }

          resetParallax();
        }}
        tabIndex={0}
        role="region"
        aria-label={`ORVEN LUX editorial carousel — ${
          activeSlide?.headline ??
          ""
        }`}
        style={
          {
            touchAction:
              "pan-y",
          } as CSSProperties
        }
      >
        <div
          className={
            styles.track
          }
        >
          {resolvedSlides.map(
            (
              slide,
              index,
            ) => {
              const diff =
                geometry[index];

              const isActive =
                diff === 0;

              const isNear =
                Math.abs(
                  diff,
                ) === 1;

              return (
                <article
                  key={
                    slide.id
                  }
                  data-index={
                    index
                  }
                  className={`
                    ${styles.panel}

                    ${
                      isActive
                        ? styles.isActive
                        : ""
                    }

                    ${
                      isNear
                        ? styles.isNear
                        : ""
                    }

                    group/carousel-panel
                  `}
                  style={
                    {
                      ...panelStyle(
                        diff,
                      ),
                      "--slide-index":
                        index,
                    } as CSSProperties
                  }
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}: ${slide.headline}`}
                  aria-hidden={
                    !isActive
                  }
                >
                  {/* =================================================
                      VISUAL
                  ================================================== */}

                  {slide.visual !==
                    "collection" && (
                    <SlideVisual
                      slide={slide}
                      isActive={
                        isActive
                      }
                    />
                  )}

                  {/* =================================================
                      POINTER LIGHT
                  ================================================== */}

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      z-[3]

                      opacity-0

                      transition-opacity
                      duration-[900ms]

                      group-hover/carousel-panel:opacity-100
                    "
                    style={{
                      background:
                        "radial-gradient(circle 280px at calc(50% + var(--mx,0) * 180px) calc(45% + var(--my,0) * 120px), rgba(201,162,39,.06), transparent 72%)",
                    }}
                  />

                  {/* =================================================
                      TEXTURE
                  ================================================== */}

                  <div
                    className={
                      styles.panelTexture
                    }
                    aria-hidden="true"
                  />

                  <div
                    className={
                      styles.panelScrim
                    }
                    aria-hidden="true"
                  />

                  {/* =================================================
                      META
                  ================================================== */}

                  {slide.meta && (
                    <div
                      className={
                        styles.metaFloat
                      }
                    >
                      {slide.meta}
                    </div>
                  )}

                  {/* =================================================
                      PANEL BODY
                  ================================================== */}

                  <div
                    className={`
                      ${styles.panelBody}

                      relative
                      z-10
                    `}
                  >
                    {/* Eyebrow */}

                    <div
                      className="
                        mb-4

                        flex
                        items-center
                        gap-4
                      "
                    >
                      <span
                        className="
                          h-px
                          w-8

                          bg-[#C9A227]/55

                          transition-all
                          duration-700

                          group-hover/carousel-panel:w-14
                          group-hover/carousel-panel:bg-[#C9A227]
                        "
                      />

                      <p
                        className={`
                          ${styles.eyebrow}
                          !mb-0
                        `}
                      >
                        {
                          slide.eyebrow
                        }
                      </p>
                    </div>

                    {/* Headline */}

                    <h2
                      className={`
                        ${styles.headline}

                        !max-w-[16ch]

                        text-balance
                      `}
                    >
                      {wrapWords(
                        slide.headline,
                      )}
                    </h2>

                    {/* Gold rule */}

                    <div
                      aria-hidden="true"
                      className="
                        my-5

                        h-px
                        w-12

                        bg-gradient-to-r
                        from-[#C9A227]
                        to-transparent

                        transition-all
                        duration-700

                        group-hover/carousel-panel:w-20
                      "
                    />

                    {/* Collection */}

                    {slide.visual ===
                      "collection" &&
                    slide.pieces &&
                    slide.pieces.length >
                      0 ? (
                      <CollectionGrid
                        pieces={
                          slide.pieces
                        }
                      />
                    ) : (
                      <>
                        {slide.supporting && (
                          <p
                            className={
                              styles.supporting
                            }
                          >
                            {
                              slide.supporting
                            }
                          </p>
                        )}

                        {slide.ctas && (
                          <div
                            className={`
                              ${styles.ctaRow}

                              mt-7
                            `}
                            onPointerDown={(
                              event,
                            ) => {
                              event.stopPropagation();
                            }}
                          >
                            {/* Primary */}

                            <Link
                              href={
                                slide
                                  .ctas
                                  .primaryHref ??
                                "/products"
                              }
                              className={`${styles.btn} ${styles.btnPrimary} group/primary`}
                              onPointerDown={(
                                event,
                              ) => {
                                event.stopPropagation();
                              }}
                              onClick={() =>
                                markInteracted()
                              }
                              draggable={
                                false
                              }
                            >
                              <span className="relative z-10">
                                {
                                  slide
                                    .ctas
                                    .primary
                                }
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
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                  className="
                                    h-3
                                    w-3

                                    transition-transform
                                    duration-500

                                    group-hover/primary:-translate-y-0.5
                                    group-hover/primary:translate-x-0.5
                                  "
                                  aria-hidden="true"
                                >
                                  <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                              </span>

                              <span
                                aria-hidden="true"
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-y-[-20%]
                                  -left-[80%]
                                  w-[42%]

                                  -skew-x-[20deg]

                                  bg-white/25

                                  transition-all
                                  duration-700

                                  group-hover/primary:left-[125%]
                                "
                              />
                            </Link>

                            {/* Secondary */}

                            <Link
                              href={
                                slide
                                  .ctas
                                  .secondaryHref ??
                                "/products"
                              }
                              className={`${styles.btn} ${styles.btnSecondary} group/secondary`}
                              onPointerDown={(
                                event,
                              ) => {
                                event.stopPropagation();
                              }}
                              onClick={() =>
                                markInteracted()
                              }
                              draggable={
                                false
                              }
                            >
                              <span>
                                {
                                  slide
                                    .ctas
                                    .secondary
                                }
                              </span>

                              <span
                                aria-hidden="true"
                                className="
                                  h-px
                                  w-5

                                  bg-white/20

                                  transition-all
                                  duration-500

                                  group-hover/secondary:w-9
                                  group-hover/secondary:bg-[#C9A227]
                                "
                              />
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* =================================================
                      EDGE
                  ================================================== */}

                  <div
                    className={
                      styles.panelEdge
                    }
                    aria-hidden="true"
                  />

                  {/* =================================================
                      SLIDE INDEX
                  ================================================== */}

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none

                      absolute
                      bottom-7
                      right-7
                      z-10

                      hidden

                      font-mono
                      text-[8px]

                      tracking-[0.22em]

                      text-white/20

                      lg:block
                    "
                  >
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </div>
                </article>
              );
            },
          )}
        </div>
      </div>

      {/* ===================================================
          DRAG HINT
      ==================================================== */}

      <div
        className={`${styles.dragHint} ${
          !hasInteracted
            ? styles.show
            : ""
        }`}
        aria-hidden="true"
      >
        <span
          className="
            inline-flex
            items-center
            gap-3
          "
        >
          <span
            className="
              h-px
              w-6
              bg-[#C9A227]/45
            "
          />

          DRAG TO EXPLORE

          <span
            className="
              h-px
              w-6
              bg-[#C9A227]/25
            "
          />
        </span>
      </div>

      {/* ===================================================
          BOTTOM CHROME
      ==================================================== */}

      <div
        className={
          styles.chromeBottom
        }
      >
        <div
          className={
            styles.progressWrap
          }
          role="tablist"
          aria-label="Slide progress"
        >
          {resolvedSlides.map(
            (
              slide,
              index,
            ) => (
              <button
                key={
                  slide.id
                }
                type="button"
                className={`
                  ${styles.seg}

                  ${
                    index <
                    currentIndex
                      ? styles.done
                      : ""
                  }

                  ${
                    index ===
                    currentIndex
                      ? styles.active
                      : ""
                  }
                `}
                role="tab"
                aria-selected={
                  index ===
                  currentIndex
                }
                aria-label={`Go to slide ${
                  index + 1
                }`}
                onPointerDown={(
                  event,
                ) =>
                  event.stopPropagation()
                }
                onClick={() => {
                  markInteracted();
                  goTo(index);
                }}
              >
                <i />
              </button>
            ),
          )}
        </div>

        <div
          className={
            styles.arrows
          }
        >
          <button
            type="button"
            className={`${styles.arrowBtn} group/prev`}
            aria-label="Previous slide"
            onPointerDown={(
              event,
            ) =>
              event.stopPropagation()
            }
            onClick={() => {
              markInteracted();
              prev();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              aria-hidden="true"
              className="
                transition-transform
                duration-500

                group-hover/prev:-translate-x-0.5
              "
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.arrowBtn} group/next`}
            aria-label="Next slide"
            onPointerDown={(
              event,
            ) =>
              event.stopPropagation()
            }
            onClick={() => {
              markInteracted();
              next();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              aria-hidden="true"
              className="
                transition-transform
                duration-500

                group-hover/next:translate-x-0.5
              "
            >
              <path d="M9 5l7 6-7 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===================================================
          LOCAL MOTION
      ==================================================== */}

      <style>{`
        .${styles.panel}.${styles.isActive} .${styles.panelBody} {
          animation:
            orvenEditorialBodyIn
            760ms
            cubic-bezier(.16,1,.3,1)
            both;
        }

        .${styles.panel}.${styles.isActive} .${styles.productVisual} {
          will-change: transform;
        }

        @keyframes orvenEditorialBodyIn {
          from {
            opacity: 0;
            transform:
              translate3d(0,18px,0);
          }

          to {
            opacity: 1;
            transform:
              translate3d(0,0,0);
          }
        }

        @media (max-width: 860px) {
          .${styles.panelBody} {
            max-width: 92%;
          }
        }

        @media (max-width: 640px) {
          .${styles.panelBody} {
            max-width: 94%;
          }

          .${styles.headline} {
            max-width: 14ch !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .${styles.panel}.${styles.isActive} .${styles.panelBody} {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   PANEL GEOMETRY
========================================================= */

function panelStyle(
  diff: number,
): CSSProperties {
  if (diff === 0) {
    return {
      transform:
        "translate3d(0, 0, 0) rotateY(0deg) scale(1)",
      opacity: 1,
      zIndex: 5,
      filter: "none",
      pointerEvents: "auto",
    };
  }

  if (
    Math.abs(diff) === 1
  ) {
    const direction =
      diff < 0 ? -1 : 1;

    return {
      transform: `
        translate3d(
          ${direction * 15}%,
          0,
          -80px
        )
        rotateY(
          ${direction * -3}deg
        )
        scale(0.92)
      `,
      opacity: 0.24,
      zIndex: 3,
      filter:
        "brightness(0.58) blur(1px)",
      pointerEvents: "none",
    };
  }

  const direction =
    diff < 0 ? -1 : 1;

  return {
    transform: `
      translate3d(
        ${direction * 26}%,
        0,
        -150px
      )
      rotateY(
        ${direction * -5}deg
      )
      scale(0.84)
    `,
    opacity: 0,
    zIndex: 1,
    filter:
      "brightness(0.46) blur(3px)",
    pointerEvents: "none",
  };
}

export default OrvenEditorialCarousel;