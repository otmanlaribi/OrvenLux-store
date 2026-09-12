"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

type ProductActionsProps = {
  id: number;
  compact?: boolean;
};

export default function ProductActions({
  id,
  compact = false,
}: ProductActionsProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "هل تريد حذف هذا المنتج؟",
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "DELETE",
        },
      );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ??
            "فشل حذف المنتج",
        );
      }

      router.refresh();

      alert(
        "تم حذف المنتج بنجاح",
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء الحذف",
      );
    } finally {
      setLoading(false);
    }
  }

  const buttonClass = compact
    ? "flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-[#FCFBF8] text-stone-500 transition hover:border-[#C8A45D] hover:bg-[#C8A45D]/[0.06] hover:text-[#9A7718]"
    : "flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:border-[#C8A45D] hover:bg-[#C8A45D]/[0.06] hover:text-[#9A7718]";

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/admin/products/${id}`}
        className={buttonClass}
        title="عرض المنتج"
        aria-label="عرض المنتج"
      >
        <Eye size={15} />
      </Link>

      <Link
        href={`/admin/products/${id}/edit`}
        className={buttonClass}
        title="تعديل المنتج"
        aria-label="تعديل المنتج"
      >
        <Pencil size={15} />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 ${
          compact
            ? "bg-[#FCFBF8]"
            : ""
        }`}
        title="حذف المنتج"
        aria-label="حذف المنتج"
      >
        {loading ? (
          <Loader2
            size={15}
            className="animate-spin"
          />
        ) : (
          <Trash2 size={15} />
        )}
      </button>
    </div>
  );
}