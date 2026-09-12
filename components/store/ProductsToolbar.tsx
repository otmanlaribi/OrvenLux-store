import ProductsSearch from "./ProductsSearch";
import ProductsSort from "./ProductsSort";

type ProductsToolbarProps = {
  totalProducts: number;
};

export default function ProductsToolbar({
  totalProducts,
}: ProductsToolbarProps) {
  return (
    <section className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-[0_12px_45px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:border-[#C8A45D]/25 sm:p-6">
      {/* Ambient gold atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-[#C8A45D]/10 blur-[85px] transition-all duration-700 group-hover:bg-[#C8A45D]/15"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -bottom-32 h-48 w-48 rounded-full bg-[#C8A45D]/5 blur-[80px]"
      />

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        {/* Collection information */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C8A45D] transition-all duration-500 group-hover:w-12" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A27F3E]">
              Collection
            </span>
          </div>

          <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[#111111] sm:text-2xl">
            Browse Collection
          </h2>

          <p className="mt-2 text-xs leading-6 text-black/45 sm:text-sm">
            Showing{" "}
            <span className="font-semibold tabular-nums text-[#A27F3E]">
              {totalProducts}
            </span>{" "}
            luxury watches from ORVEN LUX.
          </p>
        </div>

        {/* Search & Sorting */}
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
          <div className="w-full sm:min-w-[260px] lg:w-[300px]">
            <ProductsSearch />
          </div>

          <div className="w-full sm:w-auto">
            <ProductsSort />
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C8A45D]/0 to-transparent transition-all duration-700 group-hover:via-[#C8A45D]/50"
      />

      {/* Corner detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-5 h-2 w-2 rounded-full bg-[#C8A45D]/30 transition-all duration-500 group-hover:bg-[#C8A45D]/70"
      />
    </section>
  );
}