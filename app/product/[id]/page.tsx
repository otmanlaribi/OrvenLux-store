import { supabase } from "@/lib/supabase";
import OrderForm from "@/components/OrderForm";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();

  if (error) {
    console.error(error);
  }

  if (!product) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>المنتج غير موجود</h1>
        <p>رقم المنتج: {id}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          borderRadius: "15px",
        }}
      />

      <h1>{product.name}</h1>

      <p>{product.description}</p>

      <h2>{product.price} دج</h2>

      <hr style={{ margin: "30px 0" }} />

      <OrderForm
        productId={product.id}
        productPrice={product.price}
      />
    </main>
  );
}