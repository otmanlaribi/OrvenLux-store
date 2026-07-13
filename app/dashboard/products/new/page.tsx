"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadProductImage } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      alert("اختر صورة المنتج");
      return;
    }

    setLoading(true);

    try {
      // رفع الصورة إلى Supabase Storage
      const imageUrl = await uploadProductImage(imageFile);

      // حفظ المنتج
      const { error } = await supabase.from("products").insert({
        name,
        price: Number(price),
        image: imageUrl,
        stock: 0,
      });

      setLoading(false);

      if (error) {
        alert(error.message);
        return;
      }

      alert("تم إضافة المنتج بنجاح");

      router.push("/dashboard/products");
    } catch (error: any) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>➕ إضافة منتج</h1>

      <form
        onSubmit={saveProduct}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          marginTop: "25px",
        }}
      >
        <input
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={input}
        />

        <input
          type="number"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={input}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files?.[0] || null)
          }
          required
          style={input}
        />

        <button
          disabled={loading}
          style={button}
        >
          {loading ? "جاري رفع الصورة..." : "💾 حفظ المنتج"}
        </button>
      </form>
    </main>
  );
}

const input = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const button = {
  padding: "15px",
  background: "#b8860b",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "17px",
};