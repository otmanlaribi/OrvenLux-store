"use client";

import {
  Package,
  DollarSign,
  Users,
  Truck,
} from "lucide-react";

import StatCard from "@/components/admin/stat-card";
import { useDashboard } from "@/hooks/use-dashboard";

export default function Dashboard() {
  const { stats, loading } = useDashboard();

  if (loading)
    return (
      <div className="text-lg">
        Loading...
      </div>
    );

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-500">
          Welcome back
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Orders"
          value={stats.orders}
          icon={Package}
        />

        <StatCard
          title="Revenue"
          value={`${stats.revenue} DA`}
          icon={DollarSign}
          color="bg-emerald-600"
        />

        <StatCard
          title="Customers"
          value={stats.customers}
          icon={Users}
          color="bg-blue-600"
        />

        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={Truck}
          color="bg-orange-500"
        />

      </div>

    </div>
  );
}