type Props = {
  status: string;
};

const styles: Record<string, string> = {
  "جديد": "bg-yellow-100 text-yellow-800",
  "قيد المعالجة": "bg-blue-100 text-blue-800",
  "Envoyé": "bg-green-100 text-green-800",
  "تم التسليم": "bg-emerald-100 text-emerald-800",
  "ملغي": "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}