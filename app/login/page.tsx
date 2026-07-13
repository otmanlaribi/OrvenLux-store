"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");

  function login() {
    if (password === "orven123") {
      document.cookie = "admin=true; path=/";
      window.location.href = "/dashboard";
    } else {
      alert("كلمة المرور غير صحيحة");
    }
  }

  return (
    <main
      style={{
        maxWidth: "420px",
        margin: "120px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,.15)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        🔐 تسجيل دخول الإدارة
      </h1>

      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          marginBottom: "20px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={login}
        style={{
          width: "100%",
          padding: "14px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        تسجيل الدخول
      </button>
    </main>
  );
}