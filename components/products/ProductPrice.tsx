type ProductPriceProps = {
  price: number;
};

export default function ProductPrice({
  price,
}: ProductPriceProps) {
  return (
    <div className="flex flex-col">
      <span className="text-base font-black text-[#111111]">
        {price.toLocaleString()} DA
      </span>

      <span className="text-xs text-stone-400">
        السعر الحالي
      </span>
    </div>
  );
}