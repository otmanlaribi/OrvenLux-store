type ProductStockProps = {
  stock: number;
};

export default function ProductStock({
  stock,
}: ProductStockProps) {
  const value = Number(stock ?? 0);

  const percentage = Math.min(
    Math.max(value * 10, 0),
    100
  );

  let status = {
    label: "متوفر",
    text: "text-emerald-700",
    bar: "bg-emerald-500",
    bg: "bg-emerald-50",
  };

  if (value <= 0) {
    status = {
      label: "نفد المخزون",
      text: "text-red-700",
      bar: "bg-red-500",
      bg: "bg-red-50",
    };
  } else if (value <= 5) {
    status = {
      label: "مخزون منخفض",
      text: "text-[#9A7718]",
      bar: "bg-[#C9A227]",
      bg: "bg-[#C9A227]/10",
    };
  }

  return (
    <div className="min-w-[150px]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-black text-[#111111]">
          {value}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.bg} ${status.text}`}
        >
          {status.label}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
        <div
          className={`h-full rounded-full transition-all ${status.bar}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}