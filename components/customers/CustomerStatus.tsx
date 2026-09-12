type CustomerStatusProps = {
  active: boolean;
};

export default function CustomerStatus({
  active,
}: CustomerStatusProps) {
  if (active) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
        نشط
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
      غير نشط
    </span>
  );
}