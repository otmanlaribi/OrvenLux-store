import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Add Product
      </h1>

      <ProductForm />
    </div>
  );
}