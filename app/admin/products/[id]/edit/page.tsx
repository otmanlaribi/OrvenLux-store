import { notFound } from "next/navigation";

import ProductForm from "@/components/products/ProductForm";
import ProductGallery from "@/components/products/ProductGallery";

import { getProductById } from "@/lib/services/products";
import { getProductImages } from "@/lib/services/product-images";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  const images = await getProductImages(productId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">
          تعديل المنتج
        </h1>

        <p className="mt-2 text-stone-500">
          يمكنك تعديل بيانات المنتج وإدارة معرض الصور.
        </p>
      </div>

      <ProductForm product={product} />

      <ProductGallery
        productId={product.id}
        images={images}
      />
    </div>
  );
}