import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";

import type { Product } from "@/types/database";
import DeleteProductDialog from "./DeleteProductDialog";

type Props = {
  products: Product[];
};

export default function ProductsTable({
  products,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-white py-16 text-center">
        <h3 className="text-xl font-semibold">
          No products found
        </h3>

        <p className="mt-2 text-slate-500">
          Create your first product.
        </p>

        <Link
          href="/admin/products/new"
          className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-white transition hover:bg-zinc-800"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {products.map((product) => (

            <tr
              key={product.id}
              className="border-t transition hover:bg-slate-50"
            >

              <td className="p-4">

                {product.image ? (

                  <Image
                    src={product.image}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="rounded-lg object-cover"
                  />

                ) : (

                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                    No Image
                  </div>

                )}

              </td>

              <td className="p-4 font-semibold">
                {product.name}
              </td>

              <td className="p-4">
                {product.price} DA
              </td>

              <td className="p-4">
                {product.stock}
              </td>

              <td className="p-4">

                {product.active ? (

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Active
                  </span>

                ) : (

                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                    Disabled
                  </span>

                )}

              </td>

              <td className="p-4">

                <div className="flex justify-center gap-2">

                  <Link
                    href={`/admin/products/${product.id}`}
                    className="rounded-lg border p-2 transition hover:bg-slate-100"
                    title="Edit Product"
                  >
                    <Pencil size={18} />
                  </Link>

                  <DeleteProductDialog id={product.id} />

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}