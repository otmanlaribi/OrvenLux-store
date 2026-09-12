"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Archive,
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  Package,
  Save,
  Sparkles,
  Text,
  X,
} from "lucide-react";

import ImageUploader from "@/components/products/ImageUploader";
import {
  createProduct,
  updateProduct,
} from "@/lib/services/products";
import type { Product } from "@/types/database";

const productSchema = z.object({
  name: z
    .string()
    .min(
      2,
      "اسم المنتج يجب أن يحتوي على حرفين على الأقل.",
    ),

  description: z.string().optional(),

  price: z
    .number()
    .min(
      0,
      "السعر يجب أن يكون صفرًا أو أكثر.",
    ),

  stock: z
    .number()
    .int(
      "المخزون يجب أن يكون رقمًا صحيحًا.",
    )
    .min(
      0,
      "المخزون يجب أن يكون صفرًا أو أكثر.",
    ),

  image: z.string().optional(),

  active: z.boolean(),
});

type ProductFormValues =
  z.infer<typeof productSchema>;

type Props = {
  product?: Product;
};

type ProductImageItem = {
  id?: number;
  image: string;
  is_primary?: boolean;
  sort_order?: number | null;
};

function SectionMarker({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/40 bg-[#111111] text-[11px] font-black tracking-[0.12em] text-[#C9A227]">
        {number}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-black tracking-[0.24em] text-[#9A7718]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-black tracking-tight text-[#111111]">
          {title}
        </h2>

        <p className="mt-1 max-w-xl text-xs leading-6 text-stone-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="text-xs font-black text-[#111111]"
      >
        {children}
      </label>

      {hint ? (
        <span className="text-[10px] font-bold text-stone-400">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function StatusPill({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black tracking-[0.12em] ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-stone-200 bg-stone-100 text-stone-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-emerald-500"
            : "bg-stone-400"
        }`}
      />

      {label}
    </span>
  );
}

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "0";
  }

  return new Intl.NumberFormat("fr-DZ", {
    maximumFractionDigits: 2,
  }).format(price);
}

export default function ProductForm({
  product,
}: Props) {
  const router = useRouter();

  const [isSaving, setIsSaving] =
    useState(false);

  /*
   * الصور التي تم حذفها من الواجهة.
   * سيتم حذفها من Storage بعد نجاح الحفظ.
   */
  const [imagesToDelete, setImagesToDelete] =
    useState<string[]>([]);

  /*
   * معرض الصور.
   *
   * إذا كان المنتج قديمًا ولا يحتوي على
   * images، نحاول إنشاء صورة رئيسية
   * من products.image حتى يبقى النظام
   * متوافقًا مع البيانات القديمة.
   */
  const initialImages: ProductImageItem[] =
    product?.images?.length
      ? [...product.images]
          .sort(
            (a, b) =>
              (a.sort_order ?? 0) -
              (b.sort_order ?? 0),
          )
          .map((image) => ({
            id: image.id,
            image: image.image,
            is_primary: image.is_primary,
            sort_order: image.sort_order,
          }))
      : product?.image
        ? [
            {
              image: product.image,
              is_primary: true,
              sort_order: 0,
            },
          ]
        : [];

  const [
    productImages,
    setProductImages,
  ] = useState<ProductImageItem[]>(
    initialImages,
  );

  const form =
    useForm<ProductFormValues>({
      resolver:
        zodResolver(productSchema),

      mode: "onBlur",

      defaultValues: {
        name: product?.name ?? "",
        description:
          product?.description ?? "",
        price: product?.price ?? 0,
        stock: product?.stock ?? 0,
        image: product?.image ?? "",
        active:
          product?.active ?? true,
      },
    });

  const isEditing =
    Boolean(product?.id);

  const imageValue =
    useWatch({
      control: form.control,
      name: "image",
    }) ?? "";

  const activeValue =
    useWatch({
      control: form.control,
      name: "active",
    }) ?? true;

  const nameValue =
    useWatch({
      control: form.control,
      name: "name",
    }) ?? "";

  const descriptionValue =
    useWatch({
      control: form.control,
      name: "description",
    }) ?? "";

  const priceValue =
    useWatch({
      control: form.control,
      name: "price",
    }) ?? 0;

  const stockValue =
    useWatch({
      control: form.control,
      name: "stock",
    }) ?? 0;

  const hasName =
    nameValue.trim().length >= 2;

  const hasImage =
    Boolean(imageValue);

  const hasPrice =
    Number.isFinite(priceValue) &&
    priceValue >= 0;

  const hasStock =
    Number.isInteger(stockValue) &&
    stockValue >= 0;

  const completionCount = [
    hasName,
    hasImage,
    hasPrice,
    hasStock,
  ].filter(Boolean).length;

  const isReady =
    completionCount === 4;

  /*
   * =========================================================
   * IMAGE HANDLING
   * =========================================================
   */

  function handleImageChange(
    url: string,
  ) {
    const currentImage =
      form.getValues("image");

    /*
     * إذا كانت الصورة القديمة مختلفة
     * نسجلها للحذف من Storage.
     *
     * لكن لا نحذفها إذا كانت لا تزال
     * موجودة داخل المعرض.
     */
    if (
      currentImage &&
      currentImage !== url
    ) {
      const stillExists =
        productImages.some(
          (item) =>
            item.image ===
            currentImage,
        );

      if (!stillExists) {
        setImagesToDelete(
          (current) =>
            current.includes(
              currentImage,
            )
              ? current
              : [
                  ...current,
                  currentImage,
                ],
        );
      }
    }

    form.setValue(
      "image",
      url,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  /*
   * عندما يحدد المستخدم صورة رئيسية
   * من ImageUploader.
   */
  function handlePrimaryImageChange(
    nextImages: ProductImageItem[],
  ) {
    const normalized =
      nextImages.map(
        (image, index) => ({
          ...image,
          sort_order: index,
          is_primary:
            Boolean(
              image.is_primary,
            ),
        }),
      );

    const primary =
      normalized.find(
        (image) =>
          image.is_primary,
      ) ??
      normalized[0];

    if (primary) {
      const finalImages =
        normalized.map(
          (image) => ({
            ...image,
            is_primary:
              image.image ===
              primary.image,
          }),
        );

      setProductImages(
        finalImages,
      );

      form.setValue(
        "image",
        primary.image,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    } else {
      setProductImages([]);

      form.setValue(
        "image",
        "",
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }
  }

  /*
   * نحصل على الصور التي كانت موجودة
   * في قاعدة البيانات ولم تعد موجودة
   * في المعرض الحالي.
   */
  function collectDeletedDatabaseImages() {
    const oldImages =
      product?.images ?? [];

    const currentUrls =
      new Set(
        productImages.map(
          (image) =>
            image.image,
        ),
      );

    const deleted =
      oldImages
        .map(
          (image) =>
            image.image,
        )
        .filter(
          (image) =>
            !currentUrls.has(
              image,
            ),
        );

    return deleted;
  }

  /*
   * =========================================================
   * DELETE OLD STORAGE IMAGES
   * =========================================================
   */

  async function deleteOldImages() {
    const deletedDatabaseImages =
      collectDeletedDatabaseImages();

    const uniqueImages =
      [
        ...new Set([
          ...imagesToDelete,
          ...deletedDatabaseImages,
        ]),
      ];

    /*
     * لا نحذف الصورة الحالية.
     */
    const currentUrls =
      new Set(
        productImages.map(
          (image) =>
            image.image,
        ),
      );

    const safeImages =
      uniqueImages.filter(
        (image) =>
          !currentUrls.has(
            image,
          ),
      );

    if (
      safeImages.length ===
      0
    ) {
      return;
    }

    const results =
      await Promise.allSettled(
        safeImages.map(
          async (imageUrl) => {
            const path =
              imageUrl.split(
                "/storage/v1/object/public/products/",
              )[1];

            if (!path) {
              return;
            }

            const response =
              await fetch(
                "/api/storage/delete",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify(
                    {
                      paths: [
                        decodeURIComponent(
                          path,
                        ),
                      ],
                    },
                  ),
                },
              );

            if (!response.ok) {
              throw new Error(
                "تعذر حذف الصورة القديمة.",
              );
            }
          },
        ),
      );

    const failed =
      results.some(
        (result) =>
          result.status ===
          "rejected",
      );

    if (failed) {
      console.warn(
        "Some old product images could not be deleted.",
      );
    }
  }

  /*
   * =========================================================
   * ACTIVE
   * =========================================================
   */

  function setProductActive(
    active: boolean,
  ) {
    form.setValue(
      "active",
      active,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  async function handleSubmit(
    values: ProductFormValues,
  ) {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      /*
       * تأكيد الصورة الرئيسية.
       */
      const primaryImage =
        productImages.find(
          (image) =>
            image.is_primary,
        ) ??
        productImages[0];

      const finalImage =
        primaryImage?.image ??
        values.image ??
        "";

      /*
       * تأكيد ترتيب الصور.
       */
      const finalImages =
        productImages.map(
          (image, index) => ({
            ...image,
            sort_order: index,
            is_primary:
              image.image ===
              finalImage,
          }),
        );

      const payload = {
        name: values.name.trim(),

        description:
          values.description?.trim() ??
          "",

        price: values.price,

        stock: values.stock,

        image: finalImage,

        active: values.active,

        /*
         * مهم:
         * نرسل جميع صور المنتج إلى API.
         */
        images: finalImages.map(
          (image, index) => ({
            id: image.id,
            image: image.image,
            is_primary:
              image.image ===
              finalImage,
            sort_order: index,
          }),
        ),
      };

      if (
        isEditing &&
        product?.id
      ) {
        await updateProduct(
          product.id,
          payload,
        );

        toast.success(
          "تم تحديث المنتج والصور بنجاح.",
        );
      } else {
        await createProduct(
          payload,
        );

        toast.success(
          "تم إنشاء المنتج والصور بنجاح.",
        );
      }

      /*
       * بعد نجاح قاعدة البيانات،
       * نحذف الصور التي لم تعد مستخدمة.
       */
      await deleteOldImages();

      router.push(
        "/admin/products",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Product save error:",
        error,
      );

      toast.error(
        isEditing
          ? "تعذر تحديث المنتج."
          : "تعذر إنشاء المنتج.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      dir="rtl"
      onSubmit={form.handleSubmit(
        handleSubmit,
      )}
      className="min-h-screen pb-8"
    >
      {/* =========================================================
          EDITORIAL HEADER
         ========================================================= */}

      <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#C9A227]/20 bg-[#0A0A0A] text-white shadow-2xl">
        <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#C9A227]/10 blur-3xl" />

        <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-white/[0.025] blur-3xl" />

        <div className="relative px-6 py-7 sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-10 bg-[#C9A227]" />

                <p className="text-[9px] font-black tracking-[0.3em] text-[#C9A227]">
                  ORVEN LUX · PRODUCT STUDIO
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {isEditing
                  ? "EDIT TIMEPIECE"
                  : "NEW TIMEPIECE"}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/50">
                {isEditing
                  ? "Refine the identity, value and visibility of this ORVEN LUX timepiece."
                  : "Create a new piece for the ORVEN LUX collection with precision and intention."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isReady
                        ? "bg-emerald-400"
                        : "bg-[#C9A227]"
                    }`}
                  />

                  <span className="text-[9px] font-black tracking-[0.16em] text-white/70">
                    {isReady
                      ? "READY TO PUBLISH"
                      : "IN PROGRESS"}
                  </span>
                </div>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 sm:block">
                <span className="text-[9px] font-black tracking-[0.16em] text-white/40">
                  {completionCount}/4 COMPLETE
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-white/10">
            <div
              className="h-px bg-[#C9A227] transition-all duration-500"
              style={{
                width: `${
                  (completionCount / 4) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN GRID
         ========================================================= */}

      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 space-y-7">
          {/* =====================================================
              SECTION 01
             ===================================================== */}

          <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            <div className="border-b border-stone-100 px-6 py-6 sm:px-8">
              <SectionMarker
                number="01"
                eyebrow="PRODUCT IDENTITY"
                title="هوية المنتج"
                description="ابدأ بالاسم والوصف اللذين سيعرّفان هذه القطعة داخل مجموعة ORVEN LUX."
              />
            </div>

            <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">
              <div>
                <FieldLabel
                  htmlFor="name"
                  hint="REQUIRED"
                >
                  اسم المنتج
                </FieldLabel>

                <div className="group relative">
                  <Package
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition group-focus-within:text-[#C9A227]"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder="مثال: ORVEN Noir Chronograph"
                    className="w-full rounded-2xl border border-stone-200 bg-[#FCFBF8] py-4 pr-11 pl-4 text-sm font-black text-[#111111] outline-none transition placeholder:font-normal placeholder:text-stone-400 hover:border-stone-300 focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10"
                    {...form.register(
                      "name",
                    )}
                  />
                </div>

                {form.formState
                  .errors.name && (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    {
                      form.formState
                        .errors.name
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="description"
                    className="text-xs font-black text-[#111111]"
                  >
                    وصف المنتج
                  </label>

                  <span className="text-[10px] font-bold text-stone-400">
                    OPTIONAL
                  </span>
                </div>

                <div className="group relative">
                  <Text
                    size={17}
                    className="pointer-events-none absolute right-4 top-4 text-stone-400 transition group-focus-within:text-[#C9A227]"
                  />

                  <textarea
                    id="description"
                    rows={6}
                    placeholder="اكتب وصفاً يبرز شخصية الساعة، تفاصيلها، والخط الذي تنتمي إليه..."
                    className="w-full resize-y rounded-2xl border border-stone-200 bg-[#FCFBF8] py-4 pr-11 pl-4 text-sm leading-8 text-[#111111] outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10"
                    {...form.register(
                      "description",
                    )}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] text-stone-400">
                    وصف مختصر وواضح يليق بصفحة المنتج.
                  </p>

                  <span className="text-[10px] font-bold text-stone-400">
                    {
                      descriptionValue.length
                    }{" "}
                    CHAR
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              SECTION 02 — IMAGERY
             ===================================================== */}

          <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            <div className="border-b border-stone-100 px-6 py-6 sm:px-8">
              <SectionMarker
                number="02"
                eyebrow="PRODUCT IMAGERY"
                title="صور المنتج"
                description="أضف عدة صور للساعة. الصورة المحددة كرئيسية ستظهر في بطاقة المنتج، وباقي الصور ستظهر للزبون داخل صفحة تفاصيل المنتج."
              />
            </div>

            <div className="px-6 py-7 sm:px-8 sm:py-8">
              <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-[#FCFBF8] p-3 transition hover:border-[#C9A227]/60">
                <ImageUploader
                  value={imageValue}
                  onChange={
                    handleImageChange
                  }
                  images={
                    productImages
                  }
                  onImagesChange={
                    handlePrimaryImageChange
                  }
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-stone-100 bg-[#F7F5F0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-[#C9A227]">
                    <ImageIcon
                      size={14}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-black tracking-[0.08em] text-[#111111]">
                      PRODUCT IMAGE GALLERY
                    </p>

                    <p className="mt-0.5 text-[10px] text-stone-400">
                      {
                        productImages.length
                      }{" "}
                      صورة —{" "}
                      الصورة الرئيسية محفوظة تلقائيًا.
                    </p>
                  </div>
                </div>

                <StatusPill
                  active={
                    productImages.length >
                    0
                  }
                  label={
                    productImages.length >
                    0
                      ? "UPLOADED"
                      : "MISSING"
                  }
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              SECTION 03
             ===================================================== */}

          <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            <div className="border-b border-stone-100 px-6 py-6 sm:px-8">
              <SectionMarker
                number="03"
                eyebrow="COMMERCE"
                title="القيمة والمخزون"
                description="حدد قيمة القطعة والكمية المتوفرة في مخزون ORVEN LUX."
              />
            </div>

            <div className="grid gap-5 px-6 py-7 sm:grid-cols-2 sm:px-8 sm:py-8">
              <div>
                <FieldLabel
                  htmlFor="price"
                  hint="DZD"
                >
                  سعر المنتج
                </FieldLabel>

                <div className="group relative">
                  <CircleDollarSign
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition group-focus-within:text-[#C9A227]"
                  />

                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    dir="ltr"
                    placeholder="0"
                    className="w-full rounded-2xl border border-stone-200 bg-[#FCFBF8] py-4 pr-11 pl-14 text-sm font-black text-[#111111] outline-none transition hover:border-stone-300 focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10"
                    {...form.register(
                      "price",
                      {
                        valueAsNumber:
                          true,
                      },
                    )}
                  />

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-[0.08em] text-[#9A7718]">
                    DZD
                  </span>
                </div>

                {form.formState
                  .errors.price && (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    {
                      form.formState
                        .errors.price
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <FieldLabel
                  htmlFor="stock"
                  hint="UNITS"
                >
                  الكمية في المخزون
                </FieldLabel>

                <div className="group relative">
                  <Archive
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition group-focus-within:text-[#C9A227]"
                  />

                  <input
                    id="stock"
                    type="number"
                    min="0"
                    step="1"
                    dir="ltr"
                    placeholder="0"
                    className="w-full rounded-2xl border border-stone-200 bg-[#FCFBF8] py-4 pr-11 pl-4 text-sm font-black text-[#111111] outline-none transition hover:border-stone-300 focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/10"
                    {...form.register(
                      "stock",
                      {
                        valueAsNumber:
                          true,
                      },
                    )}
                  />
                </div>

                {form.formState
                  .errors.stock && (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    {
                      form.formState
                        .errors.stock
                        .message
                    }
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* =====================================================
              SECTION 04
             ===================================================== */}

          <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            <div className="border-b border-stone-100 px-6 py-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/40 bg-[#111111] text-[#C9A227]">
                  <Eye size={17} />
                </div>

                <div>
                  <p className="text-[9px] font-black tracking-[0.24em] text-[#9A7718]">
                    VISIBILITY
                  </p>

                  <h2 className="mt-1 text-xl font-black text-[#111111]">
                    ظهور المنتج
                  </h2>

                  <p className="mt-1 text-xs leading-6 text-stone-500">
                    تحكم فيما إذا كانت القطعة متاحة للعملاء داخل المتجر.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-8">
              <label
                className={`group cursor-pointer rounded-2xl border p-5 transition ${
                  activeValue
                    ? "border-[#C9A227] bg-[#C9A227]/[0.06] shadow-[0_12px_30px_rgba(201,162,39,0.08)]"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="active"
                  value="true"
                  checked={
                    activeValue
                  }
                  onChange={() =>
                    setProductActive(
                      true,
                    )
                  }
                  className="sr-only"
                />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        activeValue
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <Eye size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-[#111111]">
                        LIVE
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-stone-500">
                        يظهر للعملاء
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      activeValue
                        ? "border-[#C9A227] bg-[#C9A227] text-[#111111]"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    {activeValue ? (
                      <Check
                        size={13}
                      />
                    ) : null}
                  </div>
                </div>
              </label>

              <label
                className={`group cursor-pointer rounded-2xl border p-5 transition ${
                  !activeValue
                    ? "border-stone-400 bg-stone-50"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="active"
                  value="false"
                  checked={
                    !activeValue
                  }
                  onChange={() =>
                    setProductActive(
                      false,
                    )
                  }
                  className="sr-only"
                />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        !activeValue
                          ? "bg-stone-200 text-stone-600"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <EyeOff
                        size={18}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-black text-[#111111]">
                        HIDDEN
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-stone-500">
                        محفوظ داخل الإدارة
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      !activeValue
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    {!activeValue ? (
                      <Check
                        size={13}
                      />
                    ) : null}
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* =======================================================
            LIVE PREVIEW
           ======================================================= */}

        <aside className="xl:sticky xl:top-6">
          <div className="overflow-hidden rounded-[2rem] border border-[#C9A227]/20 bg-[#0A0A0A] text-white shadow-[0_25px_80px_rgba(0,0,0,0.18)]">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black tracking-[0.24em] text-[#C9A227]">
                    LIVE PREVIEW
                  </p>

                  <h3 className="mt-1 text-sm font-black">
                    معاينة القطعة
                  </h3>
                </div>

                <Sparkles
                  size={17}
                  className="text-[#C9A227]"
                />
              </div>
            </div>

            <div className="relative aspect-[0.82] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.11),transparent_34%),linear-gradient(145deg,#151515,#090909)]">
              <div className="absolute left-5 top-5">
                <span className="text-[8px] font-black tracking-[0.24em] text-white/30">
                  ORVEN LUX
                </span>
              </div>

              <div className="absolute right-5 top-5">
                <StatusPill
                  active={
                    activeValue
                  }
                  label={
                    activeValue
                      ? "LIVE"
                      : "HIDDEN"
                  }
                />
              </div>

              {imageValue ? (
                <div className="absolute inset-8 flex items-center justify-center">
                  <Image
                    src={imageValue}
                    alt={
                      nameValue ||
                      "Product preview"
                    }
                    fill
                    unoptimized
                    sizes="390px"
                    className="object-contain p-5 transition duration-500"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                  <div className="relative mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-[#C9A227]/20 bg-white/[0.025]">
                    <div className="absolute inset-3 rounded-full border border-white/5" />

                    <ImageIcon
                      size={28}
                      strokeWidth={1}
                      className="text-[#C9A227]/50"
                    />
                  </div>

                  <p className="text-[10px] font-black tracking-[0.18em] text-white/50">
                    A TIMEPIECE AWAITS
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-white/25">
                    أضف صورة المنتج لرؤية المعاينة.
                  </p>
                </div>
              )}

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <span className="text-[8px] font-black tracking-[0.16em] text-white/30">
                  COLLECTION
                </span>

                <span className="text-[8px] font-black tracking-[0.16em] text-[#C9A227]/70">
                  {productImages.length
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="border-b border-white/10 pb-5">
                <p className="text-[9px] font-black tracking-[0.22em] text-[#C9A227]">
                  TIMEPIECE
                </p>

                <h4 className="mt-2 min-h-[30px] text-xl font-black tracking-tight text-white">
                  {nameValue.trim() ||
                    "Unnamed Timepiece"}
                </h4>

                <p className="mt-2 min-h-[42px] text-[10px] leading-6 text-white/35">
                  {descriptionValue.trim() ||
                    "وصف القطعة سيظهر هنا عند إضافته."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                <div className="bg-[#111111] px-4 py-4">
                  <p className="text-[8px] font-black tracking-[0.15em] text-white/30">
                    PRICE
                  </p>

                  <p
                    dir="ltr"
                    className="mt-1 text-sm font-black text-white"
                  >
                    {formatPrice(
                      priceValue,
                    )}{" "}
                    <span className="text-[8px] text-[#C9A227]">
                      DZD
                    </span>
                  </p>
                </div>

                <div className="bg-[#111111] px-4 py-4">
                  <p className="text-[8px] font-black tracking-[0.15em] text-white/30">
                    STOCK
                  </p>

                  <p
                    dir="ltr"
                    className="mt-1 text-sm font-black text-white"
                  >
                    {Number.isFinite(
                      stockValue,
                    )
                      ? stockValue
                      : 0}{" "}
                    <span className="text-[8px] text-white/30">
                      UNITS
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[9px] font-black tracking-[0.16em] text-white/50">
                    COLLECTION READINESS
                  </p>

                  <span className="text-[9px] font-black text-[#C9A227]">
                    {completionCount}/4
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      label:
                        "Product name",
                      done: hasName,
                    },
                    {
                      label:
                        "Primary image",
                      done: hasImage,
                    },
                    {
                      label: "Price",
                      done: hasPrice,
                    },
                    {
                      label:
                        "Inventory",
                      done: hasStock,
                    },
                  ].map(
                    (item) => (
                      <div
                        key={
                          item.label
                        }
                        className="flex items-center justify-between"
                      >
                        <span className="text-[9px] font-bold text-white/35">
                          {
                            item.label
                          }
                        </span>

                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full ${
                            item.done
                              ? "bg-[#C9A227] text-[#111111]"
                              : "border border-white/10 text-transparent"
                          }`}
                        >
                          <Check
                            size={9}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================
          ACTION BAR
         ========================================================= */}

      <section className="mt-8 rounded-[2rem] border border-[#C9A227]/25 bg-white p-4 shadow-[0_18px_60px_rgba(17,17,17,0.08)] sm:p-5">
        <div
          dir="rtl"
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                isReady
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-[#111111] text-[#C9A227]"
              }`}
            >
              {isReady ? (
                <CheckCircle2
                  size={19}
                />
              ) : (
                <Sparkles
                  size={17}
                />
              )}
            </div>

            <div>
              <p className="text-xs font-black tracking-[0.04em] text-[#111111]">
                {isReady
                  ? "المنتج جاهز للحفظ"
                  : "أكمل بيانات المنتج"}
              </p>

              <p className="mt-1 text-[10px] text-stone-400">
                {completionCount} من 4 عناصر أساسية مكتملة
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row lg:w-auto">
            <button
              type="button"
              disabled={isSaving}
              onClick={() =>
                router.push(
                  "/admin/products",
                )
              }
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-xs font-black text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <X size={16} />
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#111111] px-8 py-3 text-xs font-black text-white shadow-lg shadow-black/10 transition hover:bg-[#242424] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {isSaving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save
                    size={16}
                    className="transition group-hover:scale-110"
                  />

                  {isEditing
                    ? "حفظ التعديلات"
                    : "إنشاء المنتج"}

                  <ArrowLeft
                    size={15}
                    className="text-[#C9A227] transition group-hover:-translate-x-1"
                  />
                </>
              )}
            </button>
          )
          </div>
        </div>
      </section>
    </form>
  );
}