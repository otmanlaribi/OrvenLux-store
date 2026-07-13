import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div
      style={{
        width: "320px",
        background: "#fff",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,.12)",
        transition: ".3s",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "20px" }}>
        <h2
          style={{
            marginBottom: "10px",
            fontSize: "24px",
          }}
        >
          {product.name}
        </h2>

        <p
          style={{
            color: "#666",
            lineHeight: 1.6,
            minHeight: "70px",
          }}
        >
          {product.description}
        </p>

        <h3
          style={{
            color: "#b8860b",
            fontSize: "28px",
            margin: "15px 0",
          }}
        >
          {product.price} دج
        </h3>

        <Link
          href={`/product/${product.id}`}
          style={{
            display: "block",
            width: "100%",
            padding: "14px",
            background: "#000",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "18px",
            textAlign: "center",
            textDecoration: "none",
            boxSizing: "border-box",
          }}
        >
          اطلب الآن
        </Link>
      </div>
    </div>
  );
}