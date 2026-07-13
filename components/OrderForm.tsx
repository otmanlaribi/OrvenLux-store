"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  productId: number;
  productPrice: number;
};

type ShippingPrice = {
  state: string;
  wilaya_code: number;
  home_price: number;
  office_price: number;
};

type DeliveryOffice = {
  state: string;
  office_name: string;
};

type Commune = {
  commune_name: string;
  commune_name_ascii: string;
};

export default function OrderForm({
  productId,
  productPrice,
}: Props) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const [state, setState] = useState("");
  const [commune, setCommune] = useState("");

  const [address, setAddress] = useState("");

  const [deliveryType, setDeliveryType] = useState("home");
  const [officeName, setOfficeName] = useState("");

  const [shippingPrices, setShippingPrices] = useState<ShippingPrice[]>([]);
  const [offices, setOffices] = useState<DeliveryOffice[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: prices } = await supabase
      .from("shipping_prices")
      .select("*")
      .order("id");

    const { data: deliveryOffices } = await supabase
      .from("delivery_offices")
      .select("*")
      .order("id");

    setShippingPrices(prices || []);
    setOffices(deliveryOffices || []);
  }

  const currentPrice = shippingPrices.find(
    (item) => item.state === state
  );

  useEffect(() => {
    if (!currentPrice?.wilaya_code) {
      setCommunes([]);
      setCommune("");
      return;
    }

    async function loadCommunes() {
      const res = await fetch(
        `/api/communes?wilaya=${currentPrice.wilaya_code}`
      );

      const data = await res.json();

      setCommunes(data || []);
      setCommune("");
    }

    loadCommunes();
  }, [currentPrice]);

  const deliveryPrice =
    deliveryType === "home"
      ? currentPrice?.home_price || 0
      : currentPrice?.office_price || 0;

  const total = productPrice + deliveryPrice;

  const stateOffices = offices.filter(
    (office) => office.state === state
  );

  async function submitOrder() {
    if (!customerName || !phone || !state || !commune) {
      alert("يرجى ملء جميع البيانات المطلوبة");
      return;
    }

    if (deliveryType === "home" && !address) {
      alert("يرجى إدخال العنوان");
      return;
    }

    if (deliveryType === "office" && !officeName) {
      alert("يرجى اختيار مكتب التوصيل");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,

        phone,

        state,

        commune,

        wilaya: currentPrice?.wilaya_code,

        address:
          deliveryType === "home"
            ? address
            : officeName,

        delivery_type: deliveryType,

        office_name:
          deliveryType === "office"
            ? officeName
            : "",

        delivery_price: deliveryPrice,

        total_price: total,

        quantity: 1,

        status: "جديد",

        product_id: productId,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      alert("حدث خطأ أثناء حفظ الطلب");
      return;
    }

    const response = await fetch("/api/ecotrack/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: data.id,
      }),
    });

    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      setLoading(false);
      alert(JSON.stringify(result));
      return;
    }

    setLoading(false);

    alert("✅ تم إرسال الطلب بنجاح");

    setCustomerName("");
    setPhone("");
    setState("");
    setCommune("");
    setAddress("");
    setOfficeName("");
    setDeliveryType("home");
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h2>معلومات الطلب</h2>

      <input
        placeholder="الاسم الكامل"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 15,
        }}
      />

      <input
        placeholder="رقم الهاتف"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 15,
        }}
      />

      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 15,
        }}
      >
        <option value="">اختر الولاية</option>

        {shippingPrices.map((item) => (
          <option key={item.state} value={item.state}>
            {item.state}
          </option>
        ))}
      </select>

      <select
        value={commune}
        onChange={(e) => setCommune(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 15,
        }}
      >
        <option value="">اختر البلدية</option>

        {communes.map((item) => (
          <option
            key={item.commune_name_ascii}
            value={item.commune_name}
          >
            {item.commune_name}
          </option>
        ))}
      </select>

      <select
        value={deliveryType}
        onChange={(e) => setDeliveryType(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 15,
        }}
      >
        <option value="home">التوصيل إلى المنزل</option>
        <option value="office">التوصيل إلى المكتب</option>
      </select>

      {deliveryType === "home" ? (
        <input
          placeholder="العنوان الكامل"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
          }}
        />
      ) : (
        <select
          value={officeName}
          onChange={(e) => setOfficeName(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
          }}
        >
          <option value="">اختر المكتب</option>

          {stateOffices.map((office) => (
            <option
              key={office.office_name}
              value={office.office_name}
            >
              {office.office_name}
            </option>
          ))}
        </select>
      )}

      <h3>سعر التوصيل: {deliveryPrice} دج</h3>

      <h2>المجموع: {total} دج</h2>

      <button
        onClick={submitOrder}
        disabled={loading}
        style={{
          width: "100%",
          padding: 15,
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        {loading ? "جارٍ الإرسال..." : "تأكيد الطلب"}
      </button>
    </div>
  );
}