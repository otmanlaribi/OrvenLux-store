"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ImageUploader from "@/components/products/ImageUploader";
import { createProduct, updateProduct } from "@/lib/services/products";
import type { Product } from "@/types/database";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required."),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be zero or more."),
  stock: z.number().int().min(0, "Stock must be zero or more."),
  image: z.string().optional(),
  active: z.preprocess(
    (value) => value === true || value === "true",
    z.boolean()
  ),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Props = {
  product?: Product;
};

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(productSchema),
    mode: "onBlur",
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      image: product?.image ?? "",
      active: product?.active ?? true,
    },
  });

  const isEditing = Boolean(product?.id);

  function handleImageChange(url: string) {
    const currentImage = form.getValues("image");

    if (currentImage && currentImage !== url) {
      setImagesToDelete((current) => [...current, currentImage]);
    }

    form.setValue("image", url, { shouldDirty: true });
  }

  async function handleSubmit(values: ProductFormValues) {
    setIsSaving(true);

    try {
      const payload = {
        name: values.name,
        description: values.description ?? "",
        price: values.price,
        stock: values.stock,
        image: values.image ?? "",
        active: values.active,
      };

      if (isEditing && product?.id) {
        await updateProduct(product.id, payload);
        toast.success("Product updated successfully.");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully.");
      }

      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map(async (imageUrl) => {
            const path = imageUrl.split("/storage/v1/object/public/products/")[1];
            if (!path) {
              return;
            }

            await fetch("/api/storage/delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ paths: [decodeURIComponent(path)] }),
            });
          })
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6 rounded-xl border bg-white p-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Product Name
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
            {...form.register("price", { valueAsNumber: true })}
          />
          {form.formState.errors.price && (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Stock
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
            {...form.register("stock", { valueAsNumber: true })}
          />
          {form.formState.errors.stock && (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.stock.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                value="true"
                {...form.register("active")}
                className="h-4 w-4"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                value="false"
                {...form.register("active")}
                className="h-4 w-4"
              />
              Disabled
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
          rows={4}
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <ImageUploader
        value={useWatch({ control: form.control, name: "image" }) ?? ""}
        onChange={handleImageChange}
      />

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "Saving product…" : isEditing ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
