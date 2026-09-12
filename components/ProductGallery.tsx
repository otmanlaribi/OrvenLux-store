"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type ProductImage = {
  id: number;
  image: string;
  is_primary: boolean;
  sort_order: number | null;
};

type ProductGalleryProps = {
  productName: string;
  images: ProductImage[];
};

export default function ProductGallery({
  productName,
  images,
}: ProductGalleryProps) {
  /*
   * =========================================================
   * NORMALIZE IMAGES
   * =========================================================
   */

  const normalizedImages = useMemo(() => {
    const seenUrls = new Set<string>();

    return [...images]
      .sort((a, b) => {
        if (a.is_primary !== b.is_primary) {
          return a.is_primary ? -1 : 1;
        }

        const sortDifference =
          Number(a.sort_order ?? 0) -
          Number(b.sort_order ?? 0);

        if (sortDifference !== 0) {
          return sortDifference;
        }

        return a.id - b.id;
      })
      .filter((image) => {
        const url = image.image?.trim();

        if (!url || seenUrls.has(url)) {
          return false;
        }

        seenUrls.add(url);

        return true;
      });
  }, [images]);

  /*
   * =========================================================
   * ACTIVE IMAGE
   * =========================================================
   */

  const [activeIndex, setActiveIndex] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);

  /*
   * We intentionally do not use an effect to reset activeIndex.
   * React can derive the safe index directly from the current
   * list, avoiding the setState-in-effect lint error.
   */

  const safeActiveIndex =
    normalizedImages.length === 0
      ? 0
      : Math.min(
          activeIndex,
          normalizedImages.length - 1,
        );

  const currentImage =
    normalizedImages[safeActiveIndex]?.image ?? "";

  /*
   * =========================================================
   * LIGHTBOX KEYBOARD + BODY LOCK
   * =========================================================
   */

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
        return;
      }

      if (
        event.key === "ArrowLeft" &&
        normalizedImages.length > 1
      ) {
        setActiveIndex((current) =>
          current >=
          normalizedImages.length - 1
            ? 0
            : current + 1,
        );

        return;
      }

      if (
        event.key === "ArrowRight" &&
        normalizedImages.length > 1
      ) {
        setActiveIndex((current) =>
          current <= 0
            ? normalizedImages.length - 1
            : current - 1,
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    lightboxOpen,
    normalizedImages.length,
  ]);

  /*
   * =========================================================
   * IMAGE NAVIGATION
   * =========================================================
   */

  function previousImage() {
    if (normalizedImages.length <= 1) {
      return;
    }

    setActiveIndex((current) =>
      current <= 0
        ? normalizedImages.length - 1
        : current - 1,
    );
  }

  function nextImage() {
    if (normalizedImages.length <= 1) {
      return;
    }

    setActiveIndex((current) =>
      current >=
      normalizedImages.length - 1
        ? 0
        : current + 1,
    );
  }

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */

  if (normalizedImages.length === 0) {
    return (
      <div
        className="
          relative
          flex
          aspect-[5/4]
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-[22px]
          border
          border-white/[0.07]
          bg-[#11110F]
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            left-1/2
            top-1/2
            h-56
            w-56
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#C9A227]/[0.035]
            blur-[80px]
          "
        />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            gap-4
          "
        >
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-[#C9A227]/20
              bg-[#C9A227]/[0.035]
            "
          >
            <span
              className="
                font-serif
                text-3xl
                tracking-[0.12em]
                text-[#C9A227]/45
              "
            >
              OL
            </span>
          </div>

          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-white/20
            "
          >
            No product imagery
          </span>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * MAIN GALLERY
   * =========================================================
   */

  return (
    <>
      <div className="mx-auto w-full max-w-[900px]">
        <div
          className="
            group/gallery
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-white/[0.065]
            bg-[#11110F]
            shadow-[0_30px_90px_rgba(0,0,0,0.28)]
            sm:rounded-[26px]
          "
        >
          {/* Gold atmosphere */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[58%]
              w-[58%]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#C9A227]/[0.045]
              blur-[90px]
              transition-all
              duration-1000
              group-hover/gallery:bg-[#C9A227]/[0.065]
            "
          />

          {/* Inner frame */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-3
              z-20
              rounded-[17px]
              border
              border-white/[0.035]
              sm:inset-4
              sm:rounded-[21px]
            "
          />

          {/* Top editorial marker */}

          <div
            className="
              pointer-events-none
              absolute
              left-5
              top-5
              z-30
              flex
              items-center
              gap-2
              sm:left-6
              sm:top-6
            "
          >
            <span
              className="
                h-[3px]
                w-[3px]
                rounded-full
                bg-[#C9A227]
                shadow-[0_0_8px_rgba(201,162,39,.45)]
              "
            />

            <span
              className="
                rounded-full
                border
                border-white/[0.07]
                bg-black/25
                px-3
                py-1.5
                text-[7px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-white/40
                backdrop-blur-xl
              "
            >
              ORVEN LUX
            </span>
          </div>

          {/* Counter */}

          <div
            className="
              pointer-events-none
              absolute
              right-5
              top-5
              z-30
              sm:right-6
              sm:top-6
            "
          >
            <div
              className="
                rounded-full
                border
                border-white/[0.07]
                bg-black/25
                px-3
                py-1.5
                font-mono
                text-[7px]
                tracking-[0.18em]
                text-white/30
                backdrop-blur-xl
              "
            >
              {String(
                safeActiveIndex + 1,
              ).padStart(2, "0")}

              {" / "}

              {String(
                normalizedImages.length,
              ).padStart(2, "0")}
            </div>
          </div>

          {/* Main visual area */}

          <div
            className="
              relative
              aspect-[5/4]
              min-h-[350px]
              w-full
              sm:min-h-[430px]
              lg:min-h-[520px]
            "
          >
            {/* Floor shadow */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                bottom-[11%]
                left-1/2
                h-16
                w-[45%]
                -translate-x-1/2
                rounded-full
                bg-black/40
                blur-2xl
              "
            />

            {/* Product image stage */}

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                p-8
                sm:p-12
                md:p-14
                lg:p-16
              "
            >
              <button
                type="button"
                onClick={() =>
                  setLightboxOpen(true)
                }
                aria-label={`تكبير صورة ${productName}`}
                className="
                  relative
                  h-full
                  w-full
                  cursor-zoom-in
                  outline-none
                "
              >
                <Image
                  src={currentImage}
                  alt={productName}
                  fill
                  priority
                  unoptimized
                  sizes="
                    (max-width: 768px) 100vw,
                    (max-width: 1200px) 60vw,
                    55vw
                  "
                  className="
                    object-contain
                    object-center
                    drop-shadow-[0_28px_35px_rgba(0,0,0,0.28)]
                    transition-transform
                    duration-1000
                    ease-out
                    group-hover/gallery:scale-[1.025]
                  "
                />

                {/* Zoom button */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    bottom-1
                    right-1
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-black/25
                    text-white/35
                    opacity-0
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    group-hover/gallery:opacity-100
                  "
                >
                  <Maximize2
                    size={14}
                    strokeWidth={1.3}
                  />
                </span>
              </button>
            </div>

            {/* Previous image */}

            {normalizedImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="الصورة السابقة"
                  className="
                    absolute
                    left-4
                    top-1/2
                    z-30
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-[#0A0A09]/65
                    text-white/40
                    opacity-0
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    group-hover/gallery:opacity-100
                    hover:-translate-x-0.5
                    hover:border-[#C9A227]/35
                    hover:bg-[#C9A227]/[0.07]
                    hover:text-[#C9A227]
                    focus-visible:opacity-100
                    sm:left-5
                  "
                >
                  <ChevronLeft
                    size={17}
                    strokeWidth={1.35}
                  />
                </button>

                {/* Next image */}

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="الصورة التالية"
                  className="
                    absolute
                    right-4
                    top-1/2
                    z-30
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C9A227]/20
                    bg-[#C9A227]/[0.05]
                    text-[#C9A227]/80
                    opacity-0
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    group-hover/gallery:opacity-100
                    hover:translate-x-0.5
                    hover:border-[#C9A227]/45
                    hover:bg-[#C9A227]/[0.09]
                    hover:text-[#E2C76D]
                    focus-visible:opacity-100
                    sm:right-5
                  "
                >
                  <ChevronRight
                    size={17}
                    strokeWidth={1.35}
                  />
                </button>
              </>
            )}

            {/* Bottom metadata */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-5
                left-5
                right-5
                z-20
                flex
                items-end
                justify-between
                sm:bottom-6
                sm:left-6
                sm:right-6
              "
            >
              <div>
                <p
                  className="
                    text-[6px]
                    uppercase
                    tracking-[0.3em]
                    text-white/18
                  "
                >
                  TIMEPIECE
                </p>

                <p
                  className="
                    mt-1
                    font-mono
                    text-[8px]
                    tracking-[0.18em]
                    text-white/28
                  "
                >
                  {String(
                    normalizedImages[
                      safeActiveIndex
                    ]?.id ?? 0,
                  ).padStart(3, "0")}
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-px
                    w-8
                    bg-white/[0.08]
                  "
                />

                <span
                  className="
                    text-[6px]
                    uppercase
                    tracking-[0.25em]
                    text-white/18
                  "
                >
                  Selected piece
                </span>
              </div>
            </div>
          </div>

          {/* Gold hairline */}

          <div
            aria-hidden="true"
            className="
              absolute
              bottom-0
              left-[12%]
              right-[12%]
              z-30
              h-px
              bg-gradient-to-r
              from-transparent
              via-[#C9A227]/30
              to-transparent
            "
          />
        </div>

        {/* ===================================================
            THUMBNAILS
        ==================================================== */}

        {normalizedImages.length > 1 && (
          <div className="mt-4">
            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-1
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                sm:gap-3
              "
            >
              {normalizedImages.map(
                (image, index) => {
                  const isActive =
                    index ===
                    safeActiveIndex;

                  return (
                    <button
                      key={`${image.id}-${image.image}`}
                      type="button"
                      onClick={() =>
                        setActiveIndex(
                          index,
                        )
                      }
                      aria-label={`عرض صورة ${index + 1}`}
                      aria-pressed={
                        isActive
                      }
                      className={[
                        "group/thumb relative aspect-square w-[74px] min-w-[74px] overflow-hidden rounded-[14px] border bg-[#11110F] transition-all duration-500 sm:w-[82px] sm:min-w-[82px]",
                        isActive
                          ? "border-[#C9A227]/60 shadow-[0_8px_24px_rgba(201,162,39,0.09)]"
                          : "border-white/[0.065] opacity-60 hover:border-white/[0.14] hover:opacity-100",
                      ].join(" ")}
                    >
                      {/* Thumbnail wash */}

                      <span
                        aria-hidden="true"
                        className={[
                          "absolute inset-0 z-10 bg-[#C9A227]/[0.04] transition-opacity duration-300",
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover/thumb:opacity-100",
                        ].join(" ")}
                      />

                      <Image
                        src={image.image}
                        alt={`${productName} - صورة ${index + 1}`}
                        fill
                        unoptimized
                        sizes="82px"
                        className="
                          object-contain
                          object-center
                          p-2
                          transition-transform
                          duration-500
                          group-hover/thumb:scale-105
                        "
                      />

                      {/* Active marker */}

                      <span
                        aria-hidden="true"
                        className={[
                          "absolute bottom-1.5 left-1/2 z-20 h-[2px] -translate-x-1/2 rounded-full bg-[#C9A227] transition-all duration-300",
                          isActive
                            ? "w-7 opacity-100"
                            : "w-0 opacity-0",
                        ].join(" ")}
                      />

                      {/* Primary badge */}

                      {image.is_primary && (
                        <span
                          className="
                            absolute
                            left-1.5
                            top-1.5
                            z-20
                            rounded-full
                            border
                            border-white/[0.08]
                            bg-black/45
                            px-1.5
                            py-1
                            text-[5px]
                            font-medium
                            uppercase
                            tracking-[0.14em]
                            text-white/45
                            backdrop-blur-md
                          "
                        >
                          Main
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {/* Gallery meta */}

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                border-t
                border-white/[0.055]
                pt-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-px
                    w-5
                    bg-[#C9A227]/35
                  "
                />

                <span
                  className="
                    text-[6px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-white/20
                  "
                >
                  Product gallery
                </span>
              </div>

              <span
                className="
                  text-[6px]
                  uppercase
                  tracking-[0.2em]
                  text-white/16
                "
              >
                Click image to enlarge
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}

      {lightboxOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#050505]/[0.96]
            p-4
            backdrop-blur-xl
            sm:p-8
          "
          role="dialog"
          aria-modal="true"
          aria-label={`تكبير صورة ${productName}`}
          onClick={() =>
            setLightboxOpen(false)
          }
        >
          {/* Background atmosphere */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[60vh]
              w-[60vh]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#C9A227]/[0.035]
              blur-[120px]
            "
          />

          {/* Close button */}

          <button
            type="button"
            onClick={() =>
              setLightboxOpen(false)
            }
            aria-label="إغلاق الصورة"
            className="
              absolute
              right-4
              top-4
              z-[110]
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.09]
              bg-black/40
              text-white/55
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-[#C9A227]/35
              hover:text-[#C9A227]
              sm:right-7
              sm:top-7
            "
          >
            <X
              size={18}
              strokeWidth={1.3}
            />
          </button>

          {/* Image frame */}

          <div
            className="
              relative
              flex
              h-full
              max-h-[88vh]
              w-full
              max-w-[1100px]
              items-center
              justify-center
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                absolute
                inset-0
                rounded-[28px]
                border
                border-white/[0.06]
                bg-[#11110F]
                shadow-[0_45px_140px_rgba(0,0,0,.55)]
              "
            />

            <div
              className="
                relative
                h-[78vh]
                w-full
                max-w-[1000px]
              "
            >
              <Image
                src={currentImage}
                alt={productName}
                fill
                priority
                unoptimized
                sizes="95vw"
                className="
                  object-contain
                  object-center
                  p-8
                  drop-shadow-[0_35px_45px_rgba(0,0,0,.32)]
                  sm:p-14
                "
              />
            </div>

            {/* Lightbox previous */}

            {normalizedImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="الصورة السابقة"
                  className="
                    absolute
                    left-3
                    top-1/2
                    z-20
                    flex
                    h-12
                    w-12
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-black/45
                    text-white/55
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-x-0.5
                    hover:border-[#C9A227]/35
                    hover:text-[#C9A227]
                    sm:left-6
                  "
                >
                  <ChevronLeft
                    size={20}
                    strokeWidth={1.25}
                  />
                </button>

                {/* Lightbox next */}

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="الصورة التالية"
                  className="
                    absolute
                    right-3
                    top-1/2
                    z-20
                    flex
                    h-12
                    w-12
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#C9A227]/25
                    bg-[#C9A227]/[0.06]
                    text-[#C9A227]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:translate-x-0.5
                    hover:border-[#C9A227]/45
                    hover:bg-[#C9A227]/[0.09]
                  "
                >
                  <ChevronRight
                    size={20}
                    strokeWidth={1.25}
                  />
                </button>
              </>
            )}

            {/* Lightbox footer */}

            <div
              className="
                absolute
                bottom-5
                left-1/2
                z-20
                flex
                -translate-x-1/2
                items-center
                gap-3
                rounded-full
                border
                border-white/[0.07]
                bg-black/40
                px-4
                py-2
                text-white/35
                backdrop-blur-xl
              "
            >
              <span
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.18em]
                "
              >
                {String(
                  safeActiveIndex + 1,
                ).padStart(2, "0")}
                {" / "}
                {String(
                  normalizedImages.length,
                ).padStart(2, "0")}
              </span>

              <span
                className="
                  h-3
                  w-px
                  bg-white/[0.08]
                "
              />

              <span
                className="
                  max-w-[180px]
                  truncate
                  text-[7px]
                  uppercase
                  tracking-[0.2em]
                "
              >
                {productName}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}