"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Check,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { validateImageFile } from "@/lib/storage";

type ProductImageItem = {
  id?: number;
  image: string;
  is_primary?: boolean;
  sort_order?: number | null;
};

type Props = {
  value: string;
  onChange: (url: string) => void;

  /**
   * معرض الصور الاختياري.
   *
   * يبقى اختياريًا حتى لا ينكسر أي استخدام قديم
   * للمكون يعتمد على صورة واحدة فقط.
   */
  images?: ProductImageItem[];
  onImagesChange?: (images: ProductImageItem[]) => void;
};

export default function ImageUploader({
  value,
  onChange,
  images = [],
  onImagesChange,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const objectUrl = useMemo(
    () =>
      selectedFile
        ? URL.createObjectURL(selectedFile)
        : null,
    [selectedFile]
  );

  const previewUrl = objectUrl || value;

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  async function uploadFile(file: File) {
    const validationError = validateImageFile(file);

    if (validationError) {
      toast.error(validationError);
      return null;
    }

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "/api/storage/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorPayload =
        await response
          .json()
          .catch(() => ({}));

      throw new Error(
        errorPayload.error ??
          "Upload failed."
      );
    }

    const result =
      await response.json();

    if (!result.publicUrl) {
      throw new Error(
        "لم يتم إرجاع رابط الصورة."
      );
    }

    return result.publicUrl as string;
  }

  async function handleFileChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0] ?? null;

    e.target.value = "";

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setProgress(10);

    try {
      const publicUrl =
        await uploadFile(file);

      if (!publicUrl) {
        return;
      }

      setProgress(100);

      /*
       * الوضع القديم:
       * إذا لم يتم تمرير onImagesChange،
       * نتعامل مع المكون كـ uploader لصورة واحدة.
       */
      if (!onImagesChange) {
        onChange(publicUrl);

        toast.success(
          "Image uploaded successfully."
        );

        return;
      }

      /*
       * الوضع الجديد:
       * إضافة الصورة إلى معرض الصور.
       */

      const currentImages =
        Array.isArray(images)
          ? images
          : [];

      const alreadyExists =
        currentImages.some(
          (item) =>
            item.image === publicUrl
        );

      if (alreadyExists) {
        toast.error(
          "هذه الصورة موجودة بالفعل."
        );

        return;
      }

      const newImage: ProductImageItem = {
        image: publicUrl,
        is_primary:
          currentImages.length === 0,
        sort_order:
          currentImages.length,
      };

      const nextImages = [
        ...currentImages,
        newImage,
      ];

      onImagesChange(nextImages);

      /*
       * إذا كانت هذه أول صورة،
       * نجعلها أيضًا الصورة الرئيسية
       * في الحقل القديم products.image.
       */
      if (
        currentImages.length === 0
      ) {
        onChange(publicUrl);
      }

      toast.success(
        "تمت إضافة الصورة إلى المعرض."
      );
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);

      /*
       * نترك preview للصورة الحالية
       * ولا نحتفظ بالـ File بعد انتهاء الرفع.
       */
      setTimeout(() => {
        setSelectedFile(null);
        setProgress(0);
      }, 300);
    }
  }

  function removeImage(
    index: number
  ) {
    if (!onImagesChange) {
      onChange("");
      return;
    }

    const currentImages = [
      ...images,
    ];

    const removed =
      currentImages[index];

    if (!removed) {
      return;
    }

    const nextImages =
      currentImages.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

    /*
     * إعادة ترتيب الصور.
     */
    let normalizedImages =
      nextImages.map(
        (image, imageIndex) => ({
          ...image,
          sort_order: imageIndex,
        })
      );

    /*
     * إذا حذفنا الصورة الرئيسية،
     * نجعل أول صورة هي الرئيسية.
     */
    const removedWasPrimary =
      Boolean(removed.is_primary);

    if (
      removedWasPrimary &&
      normalizedImages.length > 0
    ) {
      normalizedImages =
        normalizedImages.map(
          (image, imageIndex) => ({
            ...image,
            is_primary:
              imageIndex === 0,
          })
        );

      onChange(
        normalizedImages[0].image
      );
    }

    if (
      normalizedImages.length === 0
    ) {
      onChange("");
    }

    onImagesChange(
      normalizedImages
    );
  }

  function setPrimaryImage(
    index: number
  ) {
    if (!onImagesChange) {
      return;
    }

    const nextImages =
      images.map(
        (image, imageIndex) => ({
          ...image,
          is_primary:
            imageIndex === index,
        })
      );

    const primaryImage =
      nextImages[index];

    if (primaryImage) {
      onChange(
        primaryImage.image
      );
    }

    onImagesChange(
      nextImages
    );

    toast.success(
      "تم تحديد الصورة الرئيسية."
    );
  }

  const hasGallery =
    onImagesChange &&
    images.length > 0;

  return (
    <div
      dir="rtl"
      className="space-y-5 rounded-[1.5rem] border border-stone-200 bg-white p-5"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111111] text-[#C9A227]">
              <ImagePlus size={16} />
            </div>

            <div>
              <p className="text-xs font-black text-[#111111]">
                صور المنتج
              </p>

              <p className="mt-1 text-[10px] text-stone-400">
                JPG, JPEG, PNG, WEBP — max 5MB
              </p>
            </div>
          </div>
        </div>

        {hasGallery ? (
          <span className="rounded-full border border-[#C9A227]/25 bg-[#C9A227]/[0.06] px-3 py-1.5 text-[9px] font-black text-[#9A7718]">
            {images.length} صور
          </span>
        ) : null}
      </div>

      {/* =====================================================
          CURRENT GALLERY
      ===================================================== */}

      {hasGallery ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map(
            (item, index) => {
              const isPrimary =
                Boolean(
                  item.is_primary
                );

              return (
                <div
                  key={
                    item.id ??
                    `${item.image}-${index}`
                  }
                  className={`group relative overflow-hidden rounded-2xl border bg-[#F7F5F0] ${
                    isPrimary
                      ? "border-[#C9A227] ring-2 ring-[#C9A227]/10"
                      : "border-stone-200"
                  }`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={`Product image ${
                        index + 1
                      }`}
                      fill
                      unoptimized
                      sizes="240px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                    {/* رقم الصورة */}

                    <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 text-[9px] font-black text-white backdrop-blur">
                      {index + 1}
                    </div>

                    {/* Primary */}

                    {isPrimary ? (
                      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#C9A227] px-2 py-1 text-[8px] font-black text-[#111111]">
                        <Check size={10} />
                        الرئيسية
                      </div>
                    ) : null}

                    {/* Actions */}

                    <div className="absolute inset-x-2 bottom-2 flex items-center gap-2">
                      {!isPrimary ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPrimaryImage(
                              index
                            )
                          }
                          className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-white/90 px-2 text-[8px] font-black text-[#111111] backdrop-blur transition hover:bg-white"
                        >
                          <Check
                            size={11}
                          />
                          رئيسية
                        </button>
                      ) : (
                        <div className="flex h-8 flex-1 items-center justify-center rounded-lg bg-[#C9A227]/90 text-[8px] font-black text-[#111111]">
                          الصورة الرئيسية
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-white backdrop-blur transition hover:bg-red-600"
                        aria-label="حذف الصورة"
                      >
                        <Trash2
                          size={13}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : previewUrl ? (
        /* =====================================================
           LEGACY SINGLE IMAGE PREVIEW
        ===================================================== */

        <div className="relative aspect-[1.7] w-full overflow-hidden rounded-2xl border border-stone-200 bg-[#F7F5F0]">
          <Image
            src={previewUrl}
            alt="Product preview"
            fill
            unoptimized
            sizes="800px"
            className="object-contain p-4"
          />

          <div className="absolute left-3 top-3 rounded-full bg-[#C9A227] px-3 py-1.5 text-[8px] font-black text-[#111111]">
            الصورة الرئيسية
          </div>
        </div>
      ) : (
        <div className="flex aspect-[1.7] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-[#FCFBF8]">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A227]/20 bg-[#C9A227]/[0.05] text-[#C9A227]">
              <ImagePlus
                size={22}
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-3 text-xs font-black text-[#111111]">
              لم تتم إضافة صورة
            </p>

            <p className="mt-1 text-[10px] text-stone-400">
              أضف صورة المنتج للبدء
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          UPLOAD BUTTON
      ===================================================== */}

      <label
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#C9A227]/30 bg-[#111111] px-4 py-3.5 text-xs font-black text-white transition hover:border-[#C9A227] hover:bg-[#1A1A1A] ${
          uploading
            ? "cursor-not-allowed opacity-60"
            : ""
        }`}
      >
        {uploading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin text-[#C9A227]"
            />

            جاري رفع الصورة...
          </>
        ) : (
          <>
            <Upload
              size={16}
              className="text-[#C9A227]"
            />

            {hasGallery
              ? "إضافة صورة أخرى"
              : "إضافة صورة المنتج"}
          </>
        )}

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={
            handleFileChange
          }
          className="sr-only"
          disabled={uploading}
        />
      </label>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      {uploading ? (
        <div className="space-y-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-[#C9A227] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-bold text-stone-400">
            <span>
              Uploading image...
            </span>

            <span>
              {progress}%
            </span>
          </div>
        </div>
      ) : null}

      {/* =====================================================
          HINT
      ===================================================== */}

      {hasGallery ? (
        <div className="rounded-xl border border-stone-100 bg-[#F7F5F0] px-4 py-3">
          <p className="text-[9px] leading-5 text-stone-500">
            <span className="font-black text-[#111111]">
              نصيحة:
            </span>{" "}
            حدد الصورة الرئيسية التي ستظهر
            في بطاقة المنتج، ويمكنك إضافة
            عدة صور للمعرض.
          </p>
        </div>
      ) : null}
    </div>
  );
}
