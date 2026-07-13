import { supabase } from "@/lib/supabase";
import OrdersTable from "@/components/OrdersTable";

export default async function Dashboard() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      products (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: 30 }}>
        <h1>حدث خطأ</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  const totalOrders = orders?.length || 0;

  const newOrders =
    orders?.filter((o) => o.status === "جديد").length || 0;

  const processingOrders =
    orders?.filter((o) => o.status === "قيد المعالجة").length || 0;

  const shippedOrders =
    orders?.filter((o) => o.status === "تم الشحن").length || 0;

  const deliveredOrders =
    orders?.filter((o) => o.status === "تم التسليم").length || 0;

  const cancelledOrders =
    orders?.filter((o) => o.status === "ملغي").length || 0;

  return (
    <main
      style={{
        maxWidth: "1450px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: 30 }}>
        لوحة إدارة الطلبات
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <Card title="📦 إجمالي الطلبات" value={totalOrders} />

        <Card title="🆕 طلبات جديدة" value={newOrders} />

        <Card
          title="📞 قيد المعالجة"
          value={processingOrders}
        />

        <Card title="🚚 تم الشحن" value={shippedOrders} />

        <Card
          title="✅ تم التسليم"
          value={deliveredOrders}
        />

        <Card title="❌ ملغية" value={cancelledOrders} />
      </div>

      <OrdersTable initialOrders={orders || []} />
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: "#b8860b",
          fontSize: "40px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}