import Link from "next/link";
import { getProductsPaginated } from "@/lib/services/products";
import ProductsTable from "@/components/products/ProductsTable";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  const params = await searchParams;
  const pageParam = params.page;
  const pageSizeParam = params.pageSize;

  // Always fetch a single page server-side to avoid loading the entire catalog.
  const { products } = await getProductsPaginated({
    page: pageParam ? Math.max(0, Number(pageParam) - 1) : 0,
    pageSize: pageSizeParam ? Number(pageSizeParam) : undefined,
  });

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