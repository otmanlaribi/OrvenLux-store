"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

 async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  console.log("DATA =", data);
  console.log("ERROR =", error);

  if (error) {
    return;
  }

  setProducts(data || []);
}

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        متجر ORVEN LUX
      </h1>

      <h2>المنتجات</h2>

      {products.length === 0 ? (
        <p>لا توجد منتجات.</p>
      ) : (
        <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "25px",
    justifyContent: "center",
    marginTop: "30px",
  }}
>
  {products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
    />
  ))}
</div>
      )}
    </main>
  );
}