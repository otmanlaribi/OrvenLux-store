import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Boxes,
  CheckCircle,
  Clock3,
  DollarSign,
  Hash,
  Package,
  Pencil,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { getProductById } from "@/lib/services/products";

type ProductImage = {
  id: number;
  product_id: number;
  image: string;
  is_primary: boolean;
  sort_order: number | null;
};

type ProductWithImages = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  active: boolean;
  created_at: string;
  images?: ProductImage[];
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-DZ").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-DZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getPrimaryImage(
  product: ProductWithImages
): string {
  const images = Array.isArray(product.images)
    ? [...product.images]
    : [];

  const primaryImage = images.find(
    (image) => image.is_primary && image.image
  );

  if (primaryImage?.image) {
    return primaryImage.image;
  }

  const sortedImage = images
    .filter((image) => Boolean(image.image))
    .sort((a, b) => {
      const aOrder = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.sort_order ?? Number.MAX_SAFE_INTEGER;

      return aOrder - bOrder;
    })[0];

  if (sortedImage?.image) {
    return sortedImage.image;
  }

  if (product.image) {
    return product.image;
  }

  return "/images/product-placeholder.png";
}

export default async function ProductPage({
  params,
}: Props) {
  const { id } = await params;

  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = (await getProductById(
    productId
  )) as ProductWithImages;

  if (!product) {
    notFound();
  }

  const stock = Number(product.stock ?? 0);

  const productImage = getPrimaryImage(product);

  const stockStatus =
    stock <= 0
      ? {
          label: "نفد المخزون",
          description: "هذا المنتج غير متوفر حالياً",
          className:
            "border-red-400/20 bg-red-400/[0.06] text-red-300",
          dotClassName: "bg-red-400",
        }
      : stock <= 5
        ? {
            label: "مخزون منخفض",
            description: "يفضل مراجعة المخزون قريباً",
            className:
              "border-[#C8A45D]/25 bg-[#C8A45D]/[0.06] text-[#C8A45D]",
            dotClassName: "bg-[#C8A45D]",
          }
        : {
            label: "متوفر",
            description: "المخزون ضمن المستوى الطبيعي",
            className:
              "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
            dotClassName: "bg-emerald-400",
          };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0A0A0A] text-[#F7F5F0]"
    >
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="border-b border-white/[0.06] bg-[#0A0A0A]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="group inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.02] px-4 text-xs font-semibold text-white/65 transition hover:border-[#C8A45D]/30 hover:bg-[#C8A45D]/[0.04] hover:text-[#C8A45D]"
            >
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />

              الرجوع
            </Link>

            <div className="hidden h-5 w-px bg-white/[0.08] sm:block" />

            <div className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/25 sm:flex">
              <span>ORVEN LUX</span>
              <span>/</span>
              <span className="text-white/50">
                Product Details
              </span>
            </div>
          </div>

          <Link
            href={`/admin/products/${product.id}/edit`}
            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-[#C8A45D] px-5 text-xs font-bold text-[#0A0A0A] transition hover:bg-[#D5B46F]"
          >
            <Pencil
              size={16}
              className="transition-transform group-hover:-rotate-6"
            />

            تعديل المنتج
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        {/* ===================================================
            EYEBROW
        =================================================== */}

        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-[#C8A45D]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C8A45D]">
              ORVEN LUX / PRODUCT
            </span>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-[#F7F5F0] sm:text-4xl lg:text-5xl">
                تفاصيل المنتج
              </h1>

              <p className="mt-3 max-w-2xl text-xs leading-6 text-white/35">
                نظرة تفصيلية على المنتج والمخزون
                والحالة الحالية ضمن مجموعة ORVEN LUX.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-white/25">
              <Hash size={12} />

              Product #{product.id}
            </div>
          </div>
        </section>

        {/* ===================================================
            PRODUCT HERO
        =================================================== */}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)]">
          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111111]">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#C8A45D]/[0.045] blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/[0.02] blur-3xl" />

            {/*
              مهم:
              هذه الحاوية لديها min-h حقيقي.
              لذلك Image fill الموجودة بداخلها
              لن تحصل على height = 0.
            */}
            <div className="relative min-h-[520px] sm:min-h-[620px] lg:min-h-[680px]">
              {/* editorial frame */}
              <div className="pointer-events-none absolute inset-5 rounded-[22px] border border-white/[0.045] sm:inset-8" />

              <div className="pointer-events-none absolute left-10 top-10 z-10 flex items-center gap-2 text-[8px] uppercase tracking-[0.25em] text-white/20 sm:left-14 sm:top-14">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A45D]" />

                ORVEN LUX
              </div>

              <div className="pointer-events-none absolute bottom-10 right-10 z-10 text-[8px] uppercase tracking-[0.2em] text-white/15 sm:bottom-14 sm:right-14">
                TIMEPIECE / {product.id}
              </div>

              {/*
                الحل الأساسي للمشكلة:
                absolute inset-0 يعطي Image مساحة واضحة.
              */}
              <div className="absolute inset-0">
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1280px) 100vw, 70vw"
                  className="object-contain p-12 transition duration-700 group-hover:scale-[1.015] sm:p-16 lg:p-20"
                />
              </div>
            </div>

            {/* image footer */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4 sm:px-8">
              <div>
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                  Primary visual
                </p>

                <p className="mt-1 text-[10px] text-white/45">
                  الصورة الرئيسية للمنتج
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#C8A45D]/15 bg-[#C8A45D]/[0.04] px-3 py-1.5 text-[8px] uppercase tracking-[0.14em] text-[#C8A45D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A45D]" />

                Primary
              </div>
            </div>
          </div>

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="flex flex-col gap-6">
            {/* product identity */}
            <div className="rounded-[28px] border border-white/[0.08] bg-[#111111] p-6 sm:p-8">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C8A45D]">
                    Product identity
                  </p>

                  <h2 className="mt-3 font-serif text-3xl leading-tight text-[#F7F5F0]">
                    {product.name}
                  </h2>
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    product.active
                      ? "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300"
                      : "border-red-400/20 bg-red-400/[0.05] text-red-300"
                  }`}
                >
                  {product.active ? (
                    <CheckCircle size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="pt-5">
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Description
                </p>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  {product.description ||
                    "لا يوجد وصف لهذا المنتج حالياً."}
                </p>
              </div>
            </div>

            {/* price */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#C8A45D]/20 bg-[#111111] p-6 sm:p-8">
              <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#C8A45D]/[0.06] blur-3xl" />

              <div className="relative flex items-end justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/25">
                    <DollarSign size={13} />

                    Product price
                  </div>

                  <p className="mt-4 font-serif text-4xl text-[#C8A45D] sm:text-5xl">
                    {formatPrice(Number(product.price))}
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    DZD
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C8A45D]/15 bg-[#C8A45D]/[0.05] text-[#C8A45D]">
                  <DollarSign size={20} />
                </div>
              </div>
            </div>

            {/* stock + status */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/[0.08] bg-[#111111] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/25">
                    <Boxes size={14} />

                    Inventory
                  </div>

                  <Package
                    size={15}
                    className="text-white/15"
                  />
                </div>

                <p className="mt-5 text-3xl font-semibold text-[#F7F5F0]">
                  {stock}
                </p>

                <p className="mt-2 text-[10px] text-white/25">
                  وحدة متوفرة
                </p>
              </div>

              <div
                className={`rounded-[24px] border p-6 ${stockStatus.className}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] opacity-70">
                    <ShieldCheck size={14} />

                    Stock status
                  </div>

                  <span
                    className={`h-2 w-2 rounded-full ${stockStatus.dotClassName}`}
                  />
                </div>

                <p className="mt-5 text-xl font-semibold">
                  {stockStatus.label}
                </p>

                <p className="mt-2 text-[10px] opacity-50">
                  {stockStatus.description}
                </p>
              </div>
            </div>

            {/* metadata */}
            <div className="rounded-[24px] border border-white/[0.08] bg-[#111111]">
              <div className="grid divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:divide-x-reverse">
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-white/20">
                    <Hash size={13} />

                    Product ID
                  </div>

                  <p className="mt-3 text-sm font-semibold text-white/70">
                    #{product.id}
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-white/20">
                    <Clock3 size={13} />

                    Created
                  </div>

                  <p className="mt-3 text-sm font-semibold text-white/70">
                    {formatDate(product.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            STATUS FOOTER
        =================================================== */}

        <section className="mt-6 rounded-[24px] border border-white/[0.07] bg-[#111111] px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`h-2 w-2 rounded-full ${
                  product.active
                    ? "bg-emerald-400"
                    : "bg-red-400"
                }`}
              />

              <div>
                <p className="text-xs font-semibold text-white/70">
                  {product.active
                    ? "المنتج نشط ومتاح في المتجر"
                    : "المنتج غير نشط حالياً"}
                </p>

                <p className="mt-1 text-[9px] text-white/25">
                  حالة الظهور الحالية في ORVEN LUX
                </p>
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] sm:self-auto ${
                product.active
                  ? "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300"
                  : "border-red-400/20 bg-red-400/[0.05] text-red-300"
              }`}
            >
              {product.active ? (
                <>
                  <CheckCircle size={13} />
                  Active
                </>
              ) : (
                <>
                  <XCircle size={13} />
                  Inactive
                </>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] py-6 text-[9px] uppercase tracking-[0.14em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
          <span>
            ORVEN LUX — Product Intelligence
          </span>

          <span>
            Precision / Elegance / Control
          </span>
        </footer>
      </main>
    </div>
  );
}