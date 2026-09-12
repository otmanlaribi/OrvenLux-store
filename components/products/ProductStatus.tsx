type ProductStatusProps = {
  active: boolean;
};

export default function ProductStatus({
  active,
}: ProductStatusProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-stone-200 text-stone-600"
      }`}
    >
      {active ? "نشط" : "غير نشط"}
    </span>
  );
}