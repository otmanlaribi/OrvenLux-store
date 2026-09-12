 "use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type CustomerActionsProps = {
  id: number;
};

export default function CustomerActions({
  id,
}: CustomerActionsProps) {
  function handleDelete() {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا العميل؟"
    );

    if (!confirmed) return;

    // سيتم ربطه مع API لاحقًا
    console.log("Delete customer:", id);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* عرض */}
      <Link
        href={`/admin/customers/${id}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition hover:border-[#C9A227] hover:bg-[#F7F5F0] hover:text-[#C9A227]"
        title="عرض"
      >
        <Eye size={17} />
      </Link>

      {/* تعديل */}
      <Link
        href={`/admin/customers/${id}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
        title="تعديل"
      >
        <Pencil size={17} />
      </Link>

      {/* حذف */}
      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
        title="حذف"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}