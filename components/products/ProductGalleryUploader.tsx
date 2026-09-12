"use client";

import Image from "next/image";
import { Upload, Trash2, Star } from "lucide-react";

type GalleryImage = {
  url: string;
  isPrimary: boolean;
};

type Props = {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
};

export default function ProductGalleryUploader({
  images,
  onChange,
}: Props) {
  function removeImage(index: number) {
    const next = [...images];
    next.splice(index, 1);

    if (
      next.length > 0 &&
      !next.some((img) => img.isPrimary)
    ) {
      next[0].isPrimary = true;
    }

    onChange(next);
  }

  function makePrimary(index: number) {
    onChange(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <Upload className="text-[#C9A227]" size={22} />

        <h3 className="text-lg font-black">
          معرض الصور
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border"
          >
            <div className="relative aspect-square">
              <Image
                src={image.url}
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute right-2 top-2 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  makePrimary(index)
                }
                className={`rounded-lg p-2 ${
                  image.isPrimary
                    ? "bg-yellow-500 text-white"
                    : "bg-white"
                }`}
              >
                <Star size={16} />
              </button>

              <button
                type="button"
                onClick={() =>
                  removeImage(index)
                }
                className="rounded-lg bg-red-500 p-2 text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {image.isPrimary && (
              <div className="absolute bottom-2 left-2 rounded-lg bg-[#111111]/80 px-2 py-1 text-xs font-bold text-white">
                الصورة الرئيسية
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}