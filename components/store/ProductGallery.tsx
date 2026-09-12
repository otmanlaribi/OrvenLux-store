"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type ProductImage = {
  id: number;
  image: string;
  is_primary: boolean;
  sort_order?: number | null;
};

type ProductGalleryProps = {
  productName: string;
  primaryImage?: string | null;
  images: ProductImage[];
};

export default function ProductGallery({
  productName,
  primaryImage,
  images,
}: ProductGalleryProps) {
  /* =======================================================
     NORMALIZE + DEDUPLICATE IMAGES
     ======================================================= */

  const allImages = useMemo(() => {
    const sourceImages = [...images];

    /*
     * إذا كانت الصورة الرئيسية القديمة موجودة في products
     * وليست موجودة داخل product_images، نضيفها للمعرض.
     */
    const normalizedPrimaryImage =
      primaryImage?.trim() || null;

    if (
      normalizedPrimaryImage &&
      !sourceImages.some(
        (image) =>
          image.image?.trim() === normalizedPrimaryImage,
      )
    ) {
      sourceImages.unshift({
        id: -1,
        image: normalizedPrimaryImage,
        is_primary: true,
        sort_order: -1,
      });
    }

    /*
     * ترتيب الصورة الرئيسية أولًا،
     * ثم sort_order،
     * ثم id كترتيب ثابت إضافي.
     */
    sourceImages.sort((a, b) => {
      if (a.is_primary !== b.is_primary) {
        return a.is_primary ? -1 : 1;
      }

      const sortDifference =
        Number(a.sort_order ?? 0) -
        Number(b.sort_order ?? 0);

      if (sortDifference !== 0) {
        return sortDifference;
      }

      return Number(a.id) - Number(b.id);
    });

    /*
     * إزالة أي صورة مكررة بناءً على URL.
     *
     * هذا مهم لأن نفس الصورة قد تكون موجودة
     * أكثر من مرة في product_images.
     */
    const seenImages = new Set<string>();

    return sourceImages.filter((image) => {
      const imageUrl = image.image?.trim();

      if (!imageUrl) {
        return false;
      }

      if (seenImages.has(imageUrl)) {
        return false;
      }

      seenImages.add(imageUrl);

      return true;
    });
  }, [images, primaryImage]);

  /* =======================================================
     SELECTED IMAGE
     ======================================================= */

  const [selectedImage, setSelectedImage] =
    useState<string | null>(
      allImages[0]?.image ??
        primaryImage ??
        null,
    );

  /*
   * إذا تغيرت الصور القادمة من السيرفر
   * وكانت الصورة المحددة القديمة لم تعد موجودة،
   * نستخدم أول صورة متاحة.
   */
  const activeImage =
    selectedImage &&
    allImages.some(
      (image) => image.image === selectedImage,
    )
      ? selectedImage
      : allImages[0]?.image ??
        primaryImage ??
        null;

  /* =======================================================
     EMPTY STATE
     ======================================================= */

  if (!activeImage) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF9F6] md:rounded-xl">
        <div className="flex h-full w-full items-center justify-center bg-[#F3F0E6]">
          <span className="select-none font-serif text-6xl tracking-widest text-[#D4AF37]/30">
            OL
          </span>
        </div>
      </div>
    );
  }

  /* =======================================================
     GALLERY
     ======================================================= */

  return (
    <div className="flex flex-col gap-4">
      {/* =================================================
          MAIN IMAGE
          ================================================= */}

      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF9F6] md:rounded-xl">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* =================================================
          THUMBNAILS
          ================================================= */}

      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7">
          {allImages.map((image, index) => {
            const isSelected =
              image.image === activeImage;

            return (
              <button
                key={`${image.id}-${image.image}`}
                type="button"
                onClick={() =>
                  setSelectedImage(image.image)
                }
                className={`relative aspect-square overflow-hidden rounded-lg bg-[#FAF9F6] transition ${
                  isSelected
                    ? "ring-2 ring-[#C9A227] ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View ${productName} image ${index + 1}`}
                aria-pressed={isSelected}
              >
                <Image
                  src={image.image}
                  alt={`${productName} image ${index + 1}`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 20vw, (max-width: 768px) 16vw, 10vw"
                  className="object-cover"
                />

                {image.is_primary && (
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    الرئيسية
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}