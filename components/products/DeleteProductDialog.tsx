"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteProduct } from "@/lib/services/products";

type Props = {
  id: number;
};

export default function DeleteProductDialog({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      await deleteProduct(id);

      toast.success("Product deleted successfully");

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}