import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import RecommendedProducts from "@/components/store/RecommendedProducts";
import ProductGallery from "@/components/ProductGallery";
import OrderForm from "@/components/OrderForm";
import { createAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type ProductImage = {
  id: number;
  product_id: number;
  image: string;
  is_primary: boolean;
  sort_order: number | null;
  created_at: string;
};

type ProductRecord = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number | null;
  image: string | null;
  active: boolean;
};

/* =========================================================
   SUPABASE
========================================================= */

function getSupabase() {
  return createAdminClient();
}

/* =========================================================
   ID
========================================================= */

function parseProductId(value: string) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

/* =========================================================
   IMAGE NORMALIZATION
========================================================= */

function normalizeProductImages(
  productImages: ProductImage[] | null | undefined,
  fallbackImage: string | null | undefined,
  productId: number,
): ProductImage[] {
  const sortedImages = [...(productImages ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) {
      return a.is_primary ? -1 : 1;
    }

    const sortOrderDifference =
      Number(a.sort_order ?? 0) -
      Number(b.sort_order ?? 0);

    if (sortOrderDifference !== 0) {
      return sortOrderDifference;
    }

    return (
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
    );
  });

  const seen = new Set<string>();

  const uniqueImages = sortedImages.filter((image) => {
    const imageUrl = image.image?.trim();

    if (!imageUrl || seen.has(imageUrl)) {
      return false;
    }

    seen.add(imageUrl);

    return true;
  });

  if (uniqueImages.length > 0) {
    return uniqueImages;
  }

  const fallback = fallbackImage?.trim();

  if (!fallback) {
    return [];
  }

  return [
    {
      id: 0,
      product_id: productId,
      image: fallback,
      is_primary: true,
      sort_order: 0,
      created_at: "",
    },
  ];
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id: rawId } = await params;

  const productId = parseProductId(rawId);

  if (productId === null) {
    return {
      title: "Product Not Found — ORVEN LUX",
    };
  }

  const supabase = getSupabase();

  const {
    data: product,
    error: productError,
  } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    console.error("PRODUCT METADATA ERROR:", {
      productId,
      message: productError.message,
      details: productError.details,
      hint: productError.hint,
      code: productError.code,
    });
  }

  if (!product) {
    return {
      title: "Product Not Found — ORVEN LUX",
    };
  }

  const {
    data: images,
    error: imagesError,
  } = await supabase
    .from("product_images")
    .select("image, is_primary, sort_order")
    .eq("product_id", product.id)
    .order("is_primary", {
      ascending: false,
    })
    .order("sort_order", {
      ascending: true,
    });

  if (imagesError) {
    console.error(
      "PRODUCT METADATA IMAGES ERROR:",
      {
        productId,
        message: imagesError.message,
        details: imagesError.details,
        hint: imagesError.hint,
        code: imagesError.code,
      },
    );
  }

  const metadataImages = Array.from(
    new Set(
      (images ?? [])
        .map((item) => item.image?.trim())
        .filter(Boolean),
    ),
  );

  if (
    metadataImages.length === 0 &&
    product.image
  ) {
    metadataImages.push(product.image);
  }

  return {
    title: `${product.name} — ORVEN LUX`,
    description:
      product.description ||
      "Discover a selected ORVEN LUX timepiece.",
    openGraph: {
      title: `${product.name} — ORVEN LUX`,
      description:
        product.description ||
        "Discover a selected ORVEN LUX timepiece.",
      images: metadataImages,
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function ProductDetailPage({
  params,
}: Props) {
  const { id: rawId } = await params;

  const productId = parseProductId(rawId);

  if (productId === null) {
    console.error("INVALID PRODUCT ID:", rawId);
    notFound();
  }

  const supabase = getSupabase();

  /* =======================================================
     PRODUCT
  ======================================================= */

  const {
    data: rawProduct,
    error: productError,
  } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    console.error("PRODUCT ERROR:", {
      productId,
      message: productError.message,
      details: productError.details,
      hint: productError.hint,
      code: productError.code,
    });

    notFound();
  }

  if (!rawProduct) {
    console.error("PRODUCT NOT FOUND:", {
      productId,
    });

    notFound();
  }

  const product = rawProduct as ProductRecord;

  /* =======================================================
     PRODUCT IMAGES
  ======================================================= */

  const {
    data: productImages,
    error: imagesError,
  } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("is_primary", {
      ascending: false,
    })
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    });

  if (imagesError) {
    console.error("PRODUCT IMAGES ERROR:", {
      productId,
      message: imagesError.message,
      details: imagesError.details,
      hint: imagesError.hint,
      code: imagesError.code,
    });
  }

  const galleryImages = normalizeProductImages(
    (productImages ?? []) as ProductImage[],
    product.image,
    product.id,
  );

  /* =======================================================
     PRODUCT STATE
  ======================================================= */

  const stock = Number(product.stock ?? 0);

  const isInStock = stock > 0;

  const formattedPrice = Number(
    product.price,
  )
    .toLocaleString("fr-FR")
    .replace(/\s/g, "\u2009");

  const productDescription =
    product.description ||
    "A considered ORVEN LUX timepiece selected for proportion, character and everyday presence.";

  /* =======================================================
     STRUCTURED DATA
  ======================================================= */

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: galleryImages.map(
      (image) => image.image,
    ),
    description: productDescription,
    brand: {
      "@type": "Brand",
      name: "ORVEN LUX",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "DZD",
      price: product.price,
      availability: isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://orvenlux.com/products/${product.id}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://orvenlux.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collection",
        item: "https://orvenlux.com/collections",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://orvenlux.com/products/${product.id}`,
      },
    ],
  };

  return (
    <>
      {/* =================================================
          STRUCTURED DATA
      ================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              productJsonLd,
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbJsonLd,
            ),
        }}
      />

      {/* =================================================
          PAGE
      ================================================= */}

      <main
        id="main-content"
        className="
          min-h-screen
          overflow-hidden
          bg-[#090909]
          text-[#F5F1E7]
          selection:bg-[#C9A227]/20
          selection:text-[#F7F5F0]
        "
      >
        {/* =================================================
            ATMOSPHERIC BACKGROUND
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            inset-0
            z-0
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              -left-[260px]
              -top-[260px]
              h-[680px]
              w-[680px]
              rounded-full
              bg-[#C9A227]/[0.035]
              blur-[145px]
            "
          />

          <div
            className="
              absolute
              -right-[280px]
              top-[18%]
              h-[650px]
              w-[650px]
              rounded-full
              bg-[#C9A227]/[0.025]
              blur-[150px]
            "
          />

          <div
            className="
              absolute
              bottom-[-330px]
              left-[24%]
              h-[760px]
              w-[760px]
              rounded-full
              bg-white/[0.01]
              blur-[150px]
            "
          />

          <div
            className="
              absolute
              inset-0
              opacity-[0.018]
              [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
              [background-size:96px_96px]
              [mask-image:linear-gradient(to_bottom,black,transparent_82%)]
            "
          />
        </div>

        {/* =================================================
            TOP MICRO ANNOUNCEMENT
        ================================================= */}

        <div
          className="
            relative
            z-20
            border-b
            border-white/[0.05]
            bg-[#080808]
          "
        >
          <div
            className="
              mx-auto
              flex
              min-h-9
              max-w-[1540px]
              items-center
              justify-center
              px-5
              sm:px-7
              lg:px-10
              xl:px-14
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                text-center
                text-[7px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-white/25
                sm:text-[8px]
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

              <span>
                ORVEN LUX · SELECTED TIMEPIECES · PAY ON DELIVERY
              </span>

              <span
                className="
                  h-[3px]
                  w-[3px]
                  rounded-full
                  bg-[#C9A227]
                  shadow-[0_0_8px_rgba(201,162,39,.45)]
                "
              />
            </div>
          </div>
        </div>

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div
          className="
            relative
            z-10
            border-b
            border-white/[0.055]
            bg-[#090909]/85
            backdrop-blur-xl
          "
        >
          <div
            className="
              mx-auto
              max-w-[1540px]
              px-5
              sm:px-7
              lg:px-10
              xl:px-14
            "
          >
            <div
              className="
                flex
                min-h-[58px]
                items-center
                justify-between
                gap-5
              "
            >
              <nav
                aria-label="Breadcrumb"
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-white/25
                "
              >
                <Link
                  href="/"
                  className="
                    transition-colors
                    duration-300
                    hover:text-[#C9A227]
                  "
                >
                  Home
                </Link>

                <ChevronLeft
                  size={10}
                  strokeWidth={1.2}
                  className="text-[#C9A227]/55"
                />

                <Link
                  href="/collections"
                  className="
                    transition-colors
                    duration-300
                    hover:text-[#C9A227]
                  "
                >
                  Collection
                </Link>

                <ChevronLeft
                  size={10}
                  strokeWidth={1.2}
                  className="text-[#C9A227]/55"
                />

                <span
                  className="
                    max-w-[180px]
                    truncate
                    text-white/60
                    sm:max-w-[320px]
                  "
                >
                  {product.name}
                </span>
              </nav>

              <div
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-3
                  sm:flex
                "
              >
                <span
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.28em]
                    text-white/18
                  "
                >
                  TIMEPIECE
                </span>

                <span
                  className="
                    h-px
                    w-8
                    bg-[#C9A227]/30
                  "
                />

                <span
                  className="
                    font-mono
                    text-[7px]
                    tracking-[0.2em]
                    text-[#C9A227]/60
                  "
                >
                  {String(product.id).padStart(
                    3,
                    "0",
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            PRODUCT HERO
        ================================================= */}

        <section
          className="
            relative
            z-10
            mx-auto
            max-w-[1540px]
            px-5
            pb-20
            pt-7
            sm:px-7
            sm:pb-24
            sm:pt-10
            lg:px-10
            lg:pb-32
            lg:pt-14
            xl:px-14
          "
        >
          {/* HERO INTRO */}

          <div
            className="
              mb-7
              flex
              items-center
              justify-between
              gap-5
              sm:mb-9
            "
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  h-px
                  w-8
                  bg-[#C9A227]
                  sm:w-12
                "
              />

              <span
                className="
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.34em]
                  text-white/30
                  sm:text-[8px]
                "
              >
                Selected timepiece
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="
                  h-[5px]
                  w-[5px]
                  rounded-full
                  bg-[#C9A227]
                  shadow-[0_0_10px_rgba(201,162,39,.5)]
                "
              />

              <span
                className="
                  text-[7px]
                  uppercase
                  tracking-[0.25em]
                  text-[#C9A227]/70
                "
              >
                ORVEN LUX EDITION
              </span>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-10
              lg:grid-cols-[minmax(0,1.18fr)_minmax(390px,.82fr)]
              lg:gap-14
              xl:grid-cols-[minmax(0,1.22fr)_minmax(430px,.78fr)]
              xl:gap-20
            "
          >
            {/* =================================================
                PRODUCT VISUAL
            ================================================== */}

            <div className="min-w-0">
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-white/[0.07]
                  bg-[#10100F]
                  p-2
                  shadow-[0_45px_130px_rgba(0,0,0,.38)]
                  sm:p-3
                "
              >
                {/* Light layer */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-[42%]
                    h-[470px]
                    w-[470px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[#C9A227]/[0.035]
                    blur-[110px]
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-3
                    rounded-[23px]
                    border
                    border-white/[0.03]
                  "
                />

                <div
                  className="
                    relative
                    z-10
                    overflow-hidden
                    rounded-[22px]
                    bg-[#0E0E0D]
                  "
                >
                  <ProductGallery
                    productName={product.name}
                    images={galleryImages}
                  />
                </div>

                {/* Gallery label */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-6
                    top-6
                    z-20
                    sm:left-8
                    sm:top-8
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/[0.08]
                      bg-[#090909]/45
                      px-3
                      py-1.5
                      backdrop-blur-xl
                    "
                  >
                    <Sparkles
                      size={10}
                      strokeWidth={1.3}
                      className="text-[#C9A227]"
                    />

                    <span
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.25em]
                        text-white/55
                      "
                    >
                      ORVEN / PIECE
                    </span>
                  </div>
                </div>

                {/* Product number */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-6
                    left-6
                    z-20
                    sm:bottom-8
                    sm:left-8
                  "
                >
                  <p
                    className="
                      text-[7px]
                      uppercase
                      tracking-[0.28em]
                      text-white/20
                    "
                  >
                    EDITION
                  </p>

                  <p
                    className="
                      mt-1
                      font-mono
                      text-[9px]
                      tracking-[0.18em]
                      text-white/38
                    "
                  >
                    {String(product.id).padStart(
                      3,
                      "0",
                    )}
                  </p>
                </div>

                {/* Stock */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-6
                    top-6
                    z-20
                    sm:right-8
                    sm:top-8
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/[0.07]
                      bg-black/30
                      px-3
                      py-1.5
                      backdrop-blur-xl
                    "
                  >
                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${
                          isInStock
                            ? "bg-[#C9A227] shadow-[0_0_9px_rgba(201,162,39,.5)]"
                            : "bg-red-400"
                        }
                      `}
                    />

                    <span
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.22em]
                        text-white/45
                      "
                    >
                      {isInStock
                        ? "Available"
                        : "Sold out"}
                    </span>
                  </div>
                </div>
              </div>

              {/* IMAGE REASSURANCE */}

              <div
                className="
                  mt-4
                  grid
                  grid-cols-3
                  overflow-hidden
                  rounded-[18px]
                  border
                  border-white/[0.06]
                  bg-[#0D0D0C]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    border-r
                    border-white/[0.06]
                    px-3
                    py-3.5
                    sm:px-4
                  "
                >
                  <ShieldCheck
                    size={14}
                    strokeWidth={1.3}
                    className="shrink-0 text-[#C9A227]"
                  />

                  <span
                    className="
                      text-[7px]
                      uppercase
                      tracking-[0.12em]
                      text-white/35
                      sm:text-[8px]
                    "
                  >
                    Selected quality
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    border-r
                    border-white/[0.06]
                    px-3
                    py-3.5
                    sm:px-4
                  "
                >
                  <Truck
                    size={14}
                    strokeWidth={1.3}
                    className="shrink-0 text-[#C9A227]"
                  />

                  <span
                    className="
                      text-[7px]
                      uppercase
                      tracking-[0.12em]
                      text-white/35
                      sm:text-[8px]
                    "
                  >
                    Nationwide
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-3.5
                    sm:px-4
                  "
                >
                  <LockKeyhole
                    size={14}
                    strokeWidth={1.3}
                    className="shrink-0 text-[#C9A227]"
                  />

                  <span
                    className="
                      text-[7px]
                      uppercase
                      tracking-[0.12em]
                      text-white/35
                      sm:text-[8px]
                    "
                  >
                    Secure order
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                BUYING EXPERIENCE
            ================================================== */}

            <aside
              className="
                min-w-0
                lg:pt-1
              "
            >
              <div
                className="
                  lg:sticky
                  lg:top-[92px]
                "
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-white/[0.08]
                    bg-[#111110]
                    shadow-[0_35px_110px_rgba(0,0,0,.34)]
                  "
                >
                  {/* GOLD SIGNATURE */}

                  <div
                    className="
                      h-px
                      w-full
                      bg-gradient-to-r
                      from-transparent
                      via-[#C9A227]/70
                      to-transparent
                    "
                  />

                  <div className="p-5 sm:p-7 lg:p-8">
                    {/* BRAND ROW */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >
                      <div>
                        <span
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.38em]
                            text-[#C9A227]
                          "
                        >
                          ORVEN LUX
                        </span>

                        <p
                          className="
                            mt-2
                            text-[7px]
                            uppercase
                            tracking-[0.25em]
                            text-white/20
                          "
                        >
                          TIMEPIECE /{" "}
                          {String(
                            product.id,
                          ).padStart(
                            3,
                            "0",
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-[#C9A227]/15
                          bg-[#C9A227]/[0.035]
                          px-3
                          py-1.5
                        "
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${
                              isInStock
                                ? "bg-[#C9A227] shadow-[0_0_8px_rgba(201,162,39,.35)]"
                                : "bg-red-400"
                            }
                          `}
                        />

                        <span
                          className="
                            text-[7px]
                            font-medium
                            uppercase
                            tracking-[0.17em]
                            text-[#C9A227]/80
                          "
                        >
                          {isInStock
                            ? "In stock"
                            : "Sold out"}
                        </span>
                      </div>
                    </div>

                    {/* TITLE */}

                    <h1
                      className="
                        mt-7
                        max-w-[11ch]
                        font-serif
                        text-[3.25rem]
                        font-normal
                        leading-[0.88]
                        tracking-[-0.055em]
                        text-[#F7F2E8]
                        sm:text-[4rem]
                        lg:text-[4.35rem]
                        xl:text-[4.75rem]
                      "
                    >
                      {product.name}
                    </h1>

                    {/* EDITORIAL RULE */}

                    <div
                      className="
                        mt-7
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          h-px
                          w-12
                          bg-[#C9A227]
                        "
                      />

                      <span
                        className="
                          h-1
                          w-1
                          rounded-full
                          bg-[#C9A227]
                        "
                      />

                      <span
                        className="
                          text-[7px]
                          uppercase
                          tracking-[0.25em]
                          text-white/25
                        "
                      >
                        Crafted for presence
                      </span>
                    </div>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        mt-6
                        max-w-xl
                        text-[12px]
                        leading-7
                        text-white/40
                        sm:text-[13px]
                      "
                    >
                      {productDescription}
                    </p>

                    {/* PRICE */}

                    <div
                      className="
                        mt-7
                        rounded-[20px]
                        border
                        border-white/[0.06]
                        bg-white/[0.018]
                        p-5
                      "
                    >
                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-5
                        "
                      >
                        <div>
                          <p
                            className="
                              text-[7px]
                              font-medium
                              uppercase
                              tracking-[0.28em]
                              text-white/22
                            "
                          >
                            Current price
                          </p>

                          <div
                            className="
                              mt-2
                              flex
                              items-baseline
                              gap-2
                            "
                          >
                            <span
                              className="
                                font-serif
                                text-[2.45rem]
                                leading-none
                                tracking-[-0.04em]
                                text-[#F5F0E6]
                                sm:text-[2.9rem]
                              "
                            >
                              {formattedPrice}
                            </span>

                            <span
                              className="
                                text-[8px]
                                font-medium
                                uppercase
                                tracking-[0.18em]
                                text-white/25
                              "
                            >
                              DZD
                            </span>
                          </div>
                        </div>

                        <div
                          className="
                            border-l
                            border-white/[0.06]
                            pl-4
                            text-left
                          "
                        >
                          <p
                            className="
                              text-[7px]
                              uppercase
                              tracking-[0.25em]
                              text-white/20
                            "
                          >
                            Payment
                          </p>

                          <p
                            className="
                              mt-2
                              text-[9px]
                              font-medium
                              text-white/55
                            "
                          >
                            Cash on delivery
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* TRUST CARDS */}

                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-3
                        gap-2
                      "
                    >
                      <div
                        className="
                          rounded-[16px]
                          border
                          border-white/[0.055]
                          bg-white/[0.014]
                          p-3
                        "
                      >
                        <ShieldCheck
                          size={15}
                          strokeWidth={1.3}
                          className="text-[#C9A227]"
                        />

                        <p
                          className="
                            mt-2
                            text-[7px]
                            uppercase
                            tracking-[0.14em]
                            text-white/22
                          "
                        >
                          Quality
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            text-white/55
                          "
                        >
                          Selected
                        </p>
                      </div>

                      <div
                        className="
                          rounded-[16px]
                          border
                          border-white/[0.055]
                          bg-white/[0.014]
                          p-3
                        "
                      >
                        <MapPin
                          size={15}
                          strokeWidth={1.3}
                          className="text-[#C9A227]"
                        />

                        <p
                          className="
                            mt-2
                            text-[7px]
                            uppercase
                            tracking-[0.14em]
                            text-white/22
                          "
                        >
                          Delivery
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            text-white/55
                          "
                        >
                          58 Wilayas
                        </p>
                      </div>

                      <div
                        className="
                          rounded-[16px]
                          border
                          border-white/[0.055]
                          bg-white/[0.014]
                          p-3
                        "
                      >
                        <PackageCheck
                          size={15}
                          strokeWidth={1.3}
                          className="text-[#C9A227]"
                        />

                        <p
                          className="
                            mt-2
                            text-[7px]
                            uppercase
                            tracking-[0.14em]
                            text-white/22
                          "
                        >
                          Dispatch
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            text-white/55
                          "
                        >
                          Confirmed
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        CTA
                    ================================================== */}

                    {isInStock ? (
                      <>
                        <a
                          href="#reserve-form"
                          className="
                            group
                            relative
                            mt-6
                            flex
                            min-h-[60px]
                            w-full
                            items-center
                            justify-between
                            overflow-hidden
                            rounded-[17px]
                            border
                            border-[#E2C76D]/45
                            bg-[#C9A227]
                            px-5
                            text-[#0B0B0A]
                            shadow-[0_18px_46px_rgba(201,162,39,.08)]
                            transition-all
                            duration-500
                            hover:-translate-y-0.5
                            hover:border-[#E7D17A]
                            hover:bg-[#D8B74B]
                            hover:shadow-[0_22px_58px_rgba(201,162,39,.14)]
                          "
                        >
                          <span
                            aria-hidden="true"
                            className="
                              pointer-events-none
                              absolute
                              inset-y-[-50%]
                              -left-[70%]
                              w-[38%]
                              -skew-x-[18deg]
                              bg-white/35
                              transition-all
                              duration-700
                              group-hover:left-[125%]
                            "
                          />

                          <span
                            className="
                              relative
                              z-10
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-[0.27em]
                            "
                          >
                            Order this timepiece
                          </span>

                          <span
                            className="
                              relative
                              z-10
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              border
                              border-black/15
                              transition-transform
                              duration-500
                              group-hover:translate-x-1
                            "
                          >
                            <ArrowRight
                              size={15}
                              strokeWidth={1.4}
                            />
                          </span>
                        </a>

                        <div
                          className="
                            mt-3
                            flex
                            items-center
                            justify-center
                            gap-2
                          "
                        >
                          <LockKeyhole
                            size={10}
                            strokeWidth={1.4}
                            className="text-[#C9A227]"
                          />

                          <span
                            className="
                              text-[7px]
                              uppercase
                              tracking-[0.22em]
                              text-white/23
                            "
                          >
                            No advance payment required
                          </span>
                        </div>
                      </>
                    ) : (
                      <div
                        className="
                          mt-6
                          flex
                          min-h-[60px]
                          items-center
                          justify-center
                          rounded-[17px]
                          border
                          border-red-400/15
                          bg-red-400/[0.035]
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.22em]
                          text-red-300/70
                        "
                      >
                        Currently unavailable
                      </div>
                    )}
                  </div>

                  {/* SHIPPING MICRO INFO */}

                  <div
                    className="
                      border-t
                      border-white/[0.06]
                      px-5
                      py-4
                      sm:px-7
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <Truck
                        size={14}
                        strokeWidth={1.3}
                        className="
                          mt-0.5
                          shrink-0
                          text-[#C9A227]/75
                        "
                      />

                      <p
                        className="
                          text-[8px]
                          leading-5
                          text-white/27
                        "
                      >
                        Choose your Wilaya, Commune and delivery
                        preference during checkout. Shipping is
                        calculated before your order is submitted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* SCROLL CUE */}

          <div
            className="
              mt-9
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span
              className="
                h-px
                w-7
                bg-white/[0.07]
              "
            />

            <span
              className="
                text-[7px]
                uppercase
                tracking-[0.28em]
                text-white/18
              "
            >
              Discover the details
            </span>

            <ChevronDown
              size={12}
              strokeWidth={1.2}
              className="text-[#C9A227]/50"
            />

            <span
              className="
                h-px
                w-7
                bg-white/[0.07]
              "
            />
          </div>
        </section>

        {/* ===================================================
            TRUST STRIP
        ==================================================== */}

        <section
          className="
            relative
            z-10
            border-y
            border-white/[0.06]
            bg-[#0D0D0C]
          "
        >
          <div
            className="
              mx-auto
              grid
              max-w-[1540px]
              grid-cols-1
              sm:grid-cols-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
                border-b
                border-white/[0.06]
                px-5
                py-5
                sm:border-b-0
                sm:border-r
                sm:px-7
                lg:px-10
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C9A227]/18
                  bg-[#C9A227]/[0.04]
                  text-[#C9A227]
                "
              >
                <ShieldCheck
                  size={16}
                  strokeWidth={1.3}
                />
              </div>

              <div>
                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.23em]
                    text-white/20
                  "
                >
                  ORVEN STANDARD
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-medium
                    text-white/55
                  "
                >
                  Selected product quality
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
                border-b
                border-white/[0.06]
                px-5
                py-5
                sm:border-b-0
                sm:border-r
                sm:px-7
                lg:px-10
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C9A227]/18
                  bg-[#C9A227]/[0.04]
                  text-[#C9A227]
                "
              >
                <Truck
                  size={16}
                  strokeWidth={1.3}
                />
              </div>

              <div>
                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.23em]
                    text-white/20
                  "
                >
                  DELIVERY
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-medium
                    text-white/55
                  "
                >
                  Nationwide delivery
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
                px-5
                py-5
                sm:px-7
                lg:px-10
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C9A227]/18
                  bg-[#C9A227]/[0.04]
                  text-[#C9A227]
                "
              >
                <LockKeyhole
                  size={16}
                  strokeWidth={1.3}
                />
              </div>

              <div>
                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.23em]
                    text-white/20
                  "
                >
                  PAYMENT
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    font-medium
                    text-white/55
                  "
                >
                  Pay when it arrives
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            PRODUCT STORY
        ==================================================== */}

        <section
          className="
            relative
            z-10
            border-b
            border-white/[0.06]
            bg-[#0A0A09]
          "
        >
          <div
            className="
              mx-auto
              max-w-[1540px]
              px-5
              py-20
              sm:px-7
              md:py-24
              lg:px-10
              xl:px-14
            "
          >
            <div
              className="
                grid
                grid-cols-1
                gap-12
                md:grid-cols-[.42fr_.58fr]
                md:gap-16
                lg:gap-24
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      h-px
                      w-10
                      bg-[#C9A227]
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.36em]
                      text-white/28
                    "
                  >
                    The piece
                  </span>
                </div>

                <h2
                  className="
                    mt-6
                    max-w-lg
                    font-serif
                    text-4xl
                    leading-[0.95]
                    tracking-[-0.045em]
                    text-[#F2ECE1]
                    sm:text-5xl
                    lg:text-[4.3rem]
                  "
                >
                  Designed to be noticed
                  <span className="text-white/25">
                    {" "}
                    quietly.
                  </span>
                </h2>
              </div>

              <div>
                <p
                  className="
                    max-w-2xl
                    text-sm
                    leading-8
                    text-white/40
                    md:text-base
                  "
                >
                  {productDescription}
                </p>

                <div
                  className="
                    mt-11
                    grid
                    grid-cols-2
                    gap-x-7
                    gap-y-8
                    border-t
                    border-white/[0.07]
                    pt-8
                    sm:grid-cols-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.25em]
                        text-white/18
                      "
                    >
                      House
                    </p>

                    <p
                      className="
                        mt-2
                        text-xs
                        font-medium
                        text-white/60
                      "
                    >
                      ORVEN LUX
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.25em]
                        text-white/18
                      "
                    >
                      Edition
                    </p>

                    <p
                      className="
                        mt-2
                        text-xs
                        font-medium
                        text-white/60
                      "
                    >
                      #
                      {String(
                        product.id,
                      ).padStart(
                        3,
                        "0",
                      )}
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.25em]
                        text-white/18
                      "
                    >
                      Payment
                    </p>

                    <p
                      className="
                        mt-2
                        text-xs
                        font-medium
                        text-white/60
                      "
                    >
                      Cash on delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            PRIVATE PURCHASE
        ==================================================== */}

        <section
          id="reserve-form"
          className="
            relative
            z-10
            scroll-mt-24
            overflow-hidden
            border-b
            border-white/[0.06]
            bg-[#080808]
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-[240px]
              -top-[240px]
              h-[660px]
              w-[660px]
              rounded-full
              bg-[#C9A227]/[0.032]
              blur-[145px]
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-[-320px]
              left-[5%]
              h-[500px]
              w-[500px]
              rounded-full
              bg-white/[0.008]
              blur-[120px]
            "
          />

          <div
            className="
              relative
              mx-auto
              max-w-[1540px]
              px-5
              py-20
              sm:px-7
              md:py-24
              lg:px-10
              xl:px-14
            "
          >
            <div
              className="
                mb-12
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      h-px
                      w-10
                      bg-[#C9A227]
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.38em]
                      text-[#C9A227]/80
                    "
                  >
                    Private purchase
                  </span>
                </div>

                <h2
                  className="
                    mt-6
                    max-w-2xl
                    font-serif
                    text-4xl
                    leading-[0.95]
                    tracking-[-0.045em]
                    text-[#F3EEE4]
                    sm:text-5xl
                    md:text-6xl
                  "
                >
                  Your timepiece.
                  <span className="block text-white/25">
                    Your way.
                  </span>
                </h2>
              </div>

              <p
                className="
                  max-w-md
                  text-sm
                  leading-7
                  text-white/30
                  lg:mb-1
                "
              >
                Complete your details below. Our team confirms
                the order personally before dispatch. No
                advance payment is required.
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-10
                lg:grid-cols-[.36fr_.64fr]
                lg:gap-20
              "
            >
              {/* PROCESS */}

              <div
                className="
                  lg:sticky
                  lg:top-[92px]
                  lg:self-start
                "
              >
                <div
                  className="
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-white/[0.07]
                    bg-[#0D0D0C]
                  "
                >
                  <div
                    className="
                      border-b
                      border-white/[0.06]
                      px-5
                      py-5
                      sm:px-6
                    "
                  >
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.3em]
                        text-[#C9A227]/80
                      "
                    >
                      The ORVEN process
                    </p>

                    <p
                      className="
                        mt-2
                        text-xs
                        text-white/35
                      "
                    >
                      Simple by design.
                    </p>
                  </div>

                  <div className="divide-y divide-white/[0.06]">
                    <div
                      className="
                        flex
                        gap-4
                        p-5
                        sm:p-6
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#C9A227]/25
                          bg-[#C9A227]/[0.035]
                          font-mono
                          text-[8px]
                          text-[#C9A227]
                        "
                      >
                        01
                      </span>

                      <div>
                        <p
                          className="
                            text-xs
                            font-medium
                            text-white/72
                          "
                        >
                          Your details
                        </p>

                        <p
                          className="
                            mt-1
                            text-[11px]
                            leading-5
                            text-white/25
                          "
                        >
                          Enter your contact and delivery information.
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        gap-4
                        p-5
                        sm:p-6
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#C9A227]/25
                          bg-[#C9A227]/[0.035]
                          font-mono
                          text-[8px]
                          text-[#C9A227]
                        "
                      >
                        02
                      </span>

                      <div>
                        <p
                          className="
                            text-xs
                            font-medium
                            text-white/72
                          "
                        >
                          Personal confirmation
                        </p>

                        <p
                          className="
                            mt-1
                            text-[11px]
                            leading-5
                            text-white/25
                          "
                        >
                          Our team reviews and confirms your order.
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        gap-4
                        p-5
                        sm:p-6
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#C9A227]/25
                          bg-[#C9A227]/[0.035]
                          font-mono
                          text-[8px]
                          text-[#C9A227]
                        "
                      >
                        03
                      </span>

                      <div>
                        <p
                          className="
                            text-xs
                            font-medium
                            text-white/72
                          "
                        >
                          Pay on delivery
                        </p>

                        <p
                          className="
                            mt-1
                            text-[11px]
                            leading-5
                            text-white/25
                          "
                        >
                          No online or advance payment is required.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      border-t
                      border-white/[0.06]
                      px-5
                      py-4
                      sm:px-6
                    "
                  >
                    <LockKeyhole
                      size={14}
                      strokeWidth={1.3}
                      className="text-[#C9A227]"
                    />

                    <span
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.25em]
                        text-white/20
                      "
                    >
                      Your information stays private
                    </span>
                  </div>
                </div>

                <div
                  className="
                    mt-4
                    rounded-[20px]
                    border
                    border-[#C9A227]/10
                    bg-[#C9A227]/[0.025]
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <div
                      className="
                        mt-0.5
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#C9A227]/[0.07]
                        text-[#C9A227]
                      "
                    >
                      <Check
                        size={14}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div>
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#C9A227]
                        "
                      >
                        No pressure
                      </p>

                      <p
                        className="
                          mt-2
                          text-[10px]
                          leading-5
                          text-white/30
                        "
                      >
                        Your order is reviewed and confirmed before
                        it is dispatched.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDER FORM */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-white/[0.08]
                  bg-[#EEECE5]
                  shadow-[0_40px_120px_rgba(0,0,0,.42)]
                "
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    border-b
                    border-black/10
                    bg-[#F2F0E9]
                    px-5
                    py-7
                    sm:px-8
                    md:px-10
                  "
                >
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      -right-12
                      -top-16
                      h-48
                      w-48
                      rounded-full
                      bg-[#C9A227]/[0.08]
                      blur-3xl
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      items-end
                      justify-between
                      gap-6
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.32em]
                          text-[#9A793D]
                        "
                      >
                        Order details
                      </p>

                      <h3
                        className="
                          mt-2
                          font-serif
                          text-2xl
                          tracking-[-0.025em]
                          text-[#171715]
                          sm:text-3xl
                        "
                      >
                        Reserve your piece
                      </h3>
                    </div>

                    <div
                      className="
                        hidden
                        text-right
                        sm:block
                      "
                    >
                      <p
                        className="
                          text-[7px]
                          uppercase
                          tracking-[0.22em]
                          text-[#8A867D]
                        "
                      >
                        Product total
                      </p>

                      <p
                        className="
                          mt-1
                          font-serif
                          text-xl
                          text-[#171715]
                        "
                      >
                        {formattedPrice}

                        <span
                          className="
                            ml-1
                            font-sans
                            text-[8px]
                          "
                        >
                          DZD
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      relative
                      mt-5
                      flex
                      flex-wrap
                      items-center
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Check
                        size={12}
                        strokeWidth={1.8}
                        className="text-[#A0803F]"
                      />

                      <span
                        className="
                          text-[7px]
                          uppercase
                          tracking-[0.2em]
                          text-[#858178]
                        "
                      >
                        No advance payment
                      </span>
                    </div>

                    <span
                      className="
                        hidden
                        h-3
                        w-px
                        bg-black/10
                        sm:block
                      "
                    />

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Truck
                        size={12}
                        strokeWidth={1.6}
                        className="text-[#A0803F]"
                      />

                      <span
                        className="
                          text-[7px]
                          uppercase
                          tracking-[0.2em]
                          text-[#858178]
                        "
                      >
                        Nationwide delivery
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    bg-[#F7F5EF]
                    p-3
                    sm:p-5
                    md:p-7
                  "
                >
                  <OrderForm
                    productId={product.id}
                    productPrice={product.price}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            DELIVERY / PAYMENT REASSURANCE
        ==================================================== */}

        <section
          className="
            relative
            z-10
            border-b
            border-white/[0.06]
            bg-[#0C0C0B]
          "
        >
          <div
            className="
              mx-auto
              max-w-[1540px]
              px-5
              py-14
              sm:px-7
              md:py-16
              lg:px-10
              xl:px-14
            "
          >
            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-3
              "
            >
              <div
                className="
                  rounded-[20px]
                  border
                  border-white/[0.06]
                  bg-white/[0.012]
                  p-5
                  transition-colors
                  duration-300
                  hover:border-[#C9A227]/15
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <MapPin
                    size={16}
                    strokeWidth={1.3}
                    className="text-[#C9A227]"
                  />

                  <span
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-white/30
                    "
                  >
                    Delivery choice
                  </span>
                </div>

                <p
                  className="
                    mt-3
                    text-xs
                    leading-5
                    text-white/45
                  "
                >
                  Select your Wilaya, Commune and preferred
                  delivery route.
                </p>
              </div>

              <div
                className="
                  rounded-[20px]
                  border
                  border-white/[0.06]
                  bg-white/[0.012]
                  p-5
                  transition-colors
                  duration-300
                  hover:border-[#C9A227]/15
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <Truck
                    size={16}
                    strokeWidth={1.3}
                    className="text-[#C9A227]"
                  />

                  <span
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-white/30
                    "
                  >
                    Delivery calculated
                  </span>
                </div>

                <p
                  className="
                    mt-3
                    text-xs
                    leading-5
                    text-white/45
                  "
                >
                  Shipping availability and cost are calculated
                  during your order.
                </p>
              </div>

              <div
                className="
                  rounded-[20px]
                  border
                  border-white/[0.06]
                  bg-white/[0.012]
                  p-5
                  transition-colors
                  duration-300
                  hover:border-[#C9A227]/15
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <LockKeyhole
                    size={16}
                    strokeWidth={1.3}
                    className="text-[#C9A227]"
                  />

                  <span
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.2em]
                      text-white/30
                    "
                  >
                    Payment on arrival
                  </span>
                </div>

                <p
                  className="
                    mt-3
                    text-xs
                    leading-5
                    text-white/45
                  "
                >
                  No card payment or advance payment is required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            RELATED PRODUCTS
        ==================================================== */}

        <section
          className="
            relative
            z-10
            border-b
            border-white/[0.06]
            bg-[#090909]
          "
        >
          <div
            className="
              mx-auto
              max-w-[1540px]
              px-5
              py-18
              sm:px-7
              md:py-24
              lg:px-10
              xl:px-14
            "
          >
            <RecommendedProducts
              currentProductId={product.id}
            />
          </div>
        </section>

        {/* ===================================================
            FINAL BRAND STATEMENT
        ==================================================== */}

        <section
          className="
            relative
            z-10
            overflow-hidden
            bg-[#0A0A09]
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[560px]
              w-[560px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#C9A227]/[0.022]
              blur-[130px]
            "
          />

          <div
            className="
              relative
              mx-auto
              max-w-[940px]
              px-5
              py-24
              text-center
              sm:px-7
              md:py-32
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-10
                  bg-[#C9A227]/60
                "
              />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.35em]
                  text-[#C9A227]/70
                "
              >
                ORVEN LUX
              </span>

              <span
                className="
                  h-px
                  w-10
                  bg-[#C9A227]/60
                "
              />
            </div>

            <h2
              className="
                mt-7
                font-serif
                text-4xl
                leading-[0.97]
                tracking-[-0.045em]
                text-[#F4EFE5]
                sm:text-5xl
                md:text-6xl
              "
            >
              Time should feel
              <span
                className="
                  block
                  text-white/25
                "
              >
                like yours.
              </span>
            </h2>

            <p
              className="
                mx-auto
                mt-6
                max-w-xl
                text-sm
                leading-7
                text-white/28
              "
            >
              Discover the piece. Reserve it personally.
              Let ORVEN LUX handle the rest.
            </p>

            {isInStock && (
              <a
                href="#reserve-form"
                className="
                  group
                  relative
                  mx-auto
                  mt-9
                  inline-flex
                  min-h-12
                  items-center
                  gap-4
                  overflow-hidden
                  rounded-full
                  border
                  border-[#C9A227]/35
                  bg-[#C9A227]
                  px-7
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-[#0B0B0A]
                  transition-all
                  duration-500
                  hover:-translate-y-0.5
                  hover:bg-[#D8B74B]
                  hover:shadow-[0_18px_50px_rgba(201,162,39,.14)]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-y-[-40%]
                    -left-[70%]
                    w-[38%]
                    -skew-x-[18deg]
                    bg-white/35
                    transition-all
                    duration-700
                    group-hover:left-[125%]
                  "
                />

                <span className="relative z-10">
                  Reserve this timepiece
                </span>

                <ArrowUp
                  size={13}
                  strokeWidth={1.5}
                  className="
                    relative
                    z-10
                    transition-transform
                    duration-500
                    group-hover:-translate-y-0.5
                  "
                />
              </a>
            )}
          </div>
        </section>

        {/* ===================================================
            MOBILE PURCHASE BAR
        ==================================================== */}

        {isInStock && (
          <>
            <div
              className="
                fixed
                bottom-0
                left-0
                right-0
                z-[60]
                border-t
                border-white/[0.08]
                bg-[#0A0A09]/[0.97]
                p-3
                shadow-[0_-20px_60px_rgba(0,0,0,.48)]
                backdrop-blur-2xl
                md:hidden
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <p
                    className="
                      truncate
                      text-[7px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      text-white/25
                    "
                  >
                    {product.name}
                  </p>

                  <p
                    className="
                      mt-1
                      font-serif
                      text-lg
                      leading-none
                      text-[#F2ECE2]
                    "
                  >
                    {formattedPrice}

                    <span
                      className="
                        ml-1
                        font-sans
                        text-[7px]
                        text-white/28
                      "
                    >
                      DZD
                    </span>
                  </p>
                </div>

                <a
                  href="#reserve-form"
                  className="
                    flex
                    min-h-11
                    min-w-[150px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#C9A227]
                    px-4
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[#0A0A09]
                    transition-all
                    duration-200
                    active:scale-[0.98]
                  "
                >
                  Order now

                  <ArrowUp
                    size={12}
                    strokeWidth={1.5}
                  />
                </a>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="
                h-20
                md:hidden
              "
            />
          </>
        )}
      </main>
    </>
  );
}