import { notFound } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { getProductById } from "@/lib/services/products";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>

      <ProductForm product={product} />
    </div>
  );
}
