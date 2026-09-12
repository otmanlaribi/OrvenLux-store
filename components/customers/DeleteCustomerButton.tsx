"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type DeleteCustomerButtonProps = {
  id: number;
  name: string;
};

export default function DeleteCustomerButton({
  id,
  name,
}: DeleteCustomerButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      `هل تريد حذف العميل "${name}"؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/customers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      toast.success("تم حذف العميل");

      router.push("/admin/customers");

      router.refresh();
    } catch {
      toast.error("تعذر حذف العميل");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
    >
      <Trash2 size={18} />

      حذف العميل
    </button>
  );
}