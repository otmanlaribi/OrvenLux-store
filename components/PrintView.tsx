"use client";

type Product = {
  name: string;
  price: number;
};

type Order = {
  id: number;
  created_at: string;
  customer_name: string;
  phone: string;
  state: string;
  delivery_type: string;
  address: string;
  office_name: string;
  delivery_price: number;
  total_price: number;
  products: Product | null;
};

export default function PrintView({
  order,
}: {
  order: Order;
}) {
  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px",
        border: "2px solid #000",
        borderRadius: "12px",
        background: "#fff",
        fontFamily: "Arial",
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

      <p><strong>رقم الطلب:</strong> {order.id}</p>

      <p>
        <strong>التاريخ:</strong>{" "}
        {new Date(order.created_at).toLocaleString("ar-DZ")}
      </p>

      <p><strong>العميل:</strong> {order.customer_name}</p>

      <p><strong>الهاتف:</strong> {order.phone}</p>

      <p><strong>المنتج:</strong> {order.products?.name}</p>

      <p><strong>الولاية:</strong> {order.state}</p>

      <p>
        <strong>نوع التوصيل:</strong>{" "}
        {order.delivery_type === "home"
          ? "المنزل"
          : "المكتب"}
      </p>

      <p>
        <strong>العنوان:</strong>{" "}
        {order.delivery_type === "home"
          ? order.address
          : order.office_name}
      </p>

      <p>
        <strong>سعر التوصيل:</strong>{" "}
        {order.delivery_price} دج
      </p>

      <p>
        <strong>الإجمالي:</strong>{" "}
        {order.total_price} دج
      </p>

      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <button
          onClick={() => window.print()}
          style={{
            padding: "15px 35px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          🖨️ طباعة
        </button>
      </div>
    </main>
  );
}