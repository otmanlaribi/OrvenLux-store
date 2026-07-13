"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/services/orders";

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }

    load();
  }, []);

  return {
    orders,
    loading,
  };
}