import Link from "next/link";
import { getProducts } from "@/lib/services/products";
import ProductsTable from "@/components/products/ProductsTable";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-slate-500">
            Manage your store products
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-lg bg-black px-5 py-3 text-white"
        >
          + Add Product
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}