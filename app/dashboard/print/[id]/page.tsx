import { createClient } from "@/lib/supabase/server";
import PrintButton from "@/components/orders/PrintButton";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      products (
        name,
        price
      )
    `
    )
    .eq("id", Number(id))
    .single();

  if (!order) {
    return (
      <main
        style={{
          padding: 40,
          textAlign: "center",
        }}
      >
        <h1>الطلب غير موجود</h1>
      </main>
    );
  }

  return (
    <main
      style={{
        width: "105mm",
        minHeight: "148mm",
        margin: "20px auto",
        padding: "12mm",
        border: "2px solid #000",
        borderRadius: "12px",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        ORVEN LUX
      </h1>

      <h2>بيانات الطلب</h2>

      <hr />

      <p>
        <strong>رقم الطلب :</strong> {order.id}
      </p>

      <p>
        <strong>التاريخ :</strong>{" "}
        {new Date(order.created_at).toLocaleString("ar-DZ")}
      </p>

      <p>
        <strong>العميل :</strong> {order.customer_name}
      </p>

      <p>
        <strong>الهاتف :</strong> {order.phone}
      </p>

      <p>
        <strong>المنتج :</strong> {order.products?.name}
      </p>

      <p>
        <strong>الولاية :</strong> {order.state}
      </p>

      <p>
        <strong>نوع التوصيل :</strong>{" "}
        {order.delivery_type === "home"
          ? "المنزل"
          : "المكتب"}
      </p>

      <p>
        <strong>العنوان :</strong>{" "}
        {order.delivery_type === "home"
          ? order.address
          : order.office_name}
      </p>

      <p>
        <strong>سعر التوصيل :</strong>{" "}
        {order.delivery_price} دج
      </p>

      <p>
        <strong>الإجمالي :</strong>{" "}
        {order.total_price} دج
      </p>

      <hr />

      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <PrintButton />
      </div>
    </main>
  );
}
