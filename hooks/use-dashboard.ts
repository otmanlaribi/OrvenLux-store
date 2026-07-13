"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/dashboard";

export function useDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    customers: 0,
    delivered: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getDashboardStats();

      setStats(data);

      setLoading(false);
    }

    load();
  }, []);

  return {
    stats,
    loading,
  };
}