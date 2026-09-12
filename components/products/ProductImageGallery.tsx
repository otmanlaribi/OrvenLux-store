"use client";

import { useState } from "react";
import Image from "next/image";

type ProductImage = {
  id: number;
  image: string;
  is_primary: boolean;
  sort_order: number;
};

type ProductImageGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) {
      return a.is_primary ? -1 : 1;
    }

    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  const [selectedImage, setSelectedImage] =
    useState<ProductImage | null>(
      sortedImages[0] ?? null
    );

  if (sortedImages.length === 0) {
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

  const activeImage =
    selectedImage ?? sortedImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* الصورة الرئيسية */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF9F6] md:rounded-xl">
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-10">
          <div className="relative h-full w-full">
            <Image
              src={activeImage.image}
              alt={productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain object-center transition-opacity duration-300"
            />
          </div>
        </div>
      </div>

      {/* الصور المصغرة */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
          {sortedImages.map((image) => {
            const isSelected =
              activeImage.id === image.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  setSelectedImage(image)
                }
                aria-label={`عرض صورة ${productName}`}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-[#FAF9F6] transition-all ${
                  isSelected
                    ? "border-[#111111] ring-1 ring-[#111111]"
                    : "border-transparent hover:border-stone-300"
                }`}
              >
                <Image
                  src={image.image}
                  alt={productName}
                  fill
                  sizes="(max-width: 768px) 25vw, 12vw"
                  className="object-contain object-center p-1.5"
                />

                {image.is_primary && (
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
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