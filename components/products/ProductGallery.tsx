"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Star, Trash2 } from "lucide-react";

type ProductImage = {
  id: number;
  image: string;
  is_primary: boolean;
};

type ProductGalleryProps = {
  productId: number;
  images: ProductImage[];
};

export default function ProductGallery({
  productId,
  images,
}: ProductGalleryProps) {
  const [gallery, setGallery] = useState(images);
  console.log("IMAGES PROP =", images);
console.log("GALLERY =", gallery);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadImages(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        // رفع الصورة إلى Supabase Storage
        const uploadResponse = await fetch(
          "/api/storage/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const error = await uploadResponse
            .json()
            .catch(() => ({}));

          throw new Error(
            error.error ??
              "Upload failed"
          );
        }

        const uploadData =
          await uploadResponse.json();

        console.log(
          "UPLOAD RESPONSE:",
          uploadData
        );

        // حفظ الصورة داخل product_images
        const saveResponse = await fetch(
          "/api/product-images",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              product_id: productId,
              image:
                uploadData.publicUrl,
            }),
          }
        );

        if (!saveResponse.ok) {
          const error =
            await saveResponse
              .json()
              .catch(() => ({}));

          console.error(error);

          throw new Error(
            error.error ??
              "Database save failed"
          );
        }

        const saved =
          await saveResponse.json();

        setGallery((current) => [
          ...current,
          saved,
        ]);
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "تعذر رفع الصورة"
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function makePrimary(
    id: number
  ) {
    const response = await fetch(
      `/api/product-images/${id}/primary`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      alert(
        "تعذر تعيين الصورة الرئيسية"
      );
      return;
    }

    setGallery((current) =>
      current.map((img) => ({
        ...img,
        is_primary:
          img.id === id,
      }))
    );
  }

  async function deleteImage(
    id: number
  ) {
    if (
      !confirm(
        "هل تريد حذف هذه الصورة؟"
      )
    ) {
      return;
    }

    const response = await fetch(
      `/api/product-images/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      alert("تعذر حذف الصورة");
      return;
    }

    setGallery((current) =>
      current.filter(
        (img) => img.id !== id
      )
    );
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">
            معرض الصور
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            يمكنك إضافة عدد غير محدود
            من الصور.
          </p>
        </div>

        <>
          <input
            ref={inputRef}
            hidden
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              uploadImages(
                e.target.files
              )
            }
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() =>
              inputRef.current?.click()
            }
            className="flex items-center gap-2 rounded-xl bg-[#C9A227] px-4 py-2 font-bold text-white transition hover:bg-[#9A7718] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={18} />

            {uploading
              ? "جاري الرفع..."
              : "إضافة صور"}
          </button>
        </>
      </div>

      {gallery.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center text-stone-400">
          لا توجد صور إضافية
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 xl:grid-cols-5">
          {gallery.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-2xl border border-stone-200"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between p-3">
                {image.is_primary ? (
                  <span className="rounded-full bg-[#C9A227]/15 px-3 py-1 text-xs font-bold text-[#9A7718]">
                    الرئيسية
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      makePrimary(
                        image.id
                      )
                    }
                    className="rounded-lg p-2 transition hover:bg-yellow-50"
                  >
                    <Star size={18} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    deleteImage(
                      image.id
                    )
                  }
                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}