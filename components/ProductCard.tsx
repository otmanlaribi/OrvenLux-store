import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image?: string | null;
  description?: string;
  badge?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  badge,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col gap-4 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
    >
      {/* =====================================================
          PRODUCT IMAGE
          ===================================================== */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[8px] bg-[#FAF9F6]">
        {badge && (
          <div className="absolute left-3 top-3 z-10 border border-black/10 bg-white/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-foreground backdrop-blur-md">
            {badge}
          </div>
        )}

        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-[var(--duration-fast)] ease-[var(--ease-luxury)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F3F0E6]">
            <span className="select-none font-serif text-5xl tracking-widest text-[#D4AF37]/30">
              OL
            </span>
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT DETAILS
          ===================================================== */}
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="w-fit font-serif text-lg text-foreground">
          <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-all duration-[var(--duration-fast)] ease-[var(--ease-luxury)] group-hover:bg-[length:100%_1px]">
            {name}
          </span>
        </h3>

        <p className="font-serif text-sm text-muted-foreground">
          {price.toLocaleString()} DZD
        </p>
      </div>
    </Link>
  );
}