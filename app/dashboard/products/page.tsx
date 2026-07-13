import { supabase } from "@/lib/supabase";

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: 40 }}>
        <h1>حدث خطأ</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>📦 إدارة المنتجات</h1>

        <a
          href="/dashboard/products/new"
          style={{
            background: "#b8860b",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ➕ إضافة منتج
        </a>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#111",
              color: "#fff",
            }}
          >
            <th style={th}>#</th>
            <th style={th}>الصورة</th>
            <th style={th}>الاسم</th>
            <th style={th}>السعر</th>
            <th style={th}>إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {products?.map((product) => (
            <tr key={product.id}>
              <td style={td}>{product.id}</td>

              <td style={td}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
              </td>

              <td style={td}>{product.name}</td>

              <td style={td}>
                {product.price} دج
              </td>

              <td style={td}>
                <a
                  href={`/dashboard/products/edit/${product.id}`}
                  style={{
                    marginRight: 10,
                  }}
                >
                  ✏️ تعديل
                </a>

                <button>
                  🗑 حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const th = {
  border: "1px solid #ddd",
  padding: "12px",
};

const td = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center" as const,
};