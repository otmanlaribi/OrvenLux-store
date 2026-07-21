"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const statuses = ["جديد", "قيد المعالجة", "تم الشحن", "تم التسليم", "ملغي"] as const;

type Props = {
  orderId: number;
  status: string;
  sentToEcotrack: boolean;
};

export default function OrderActions({ orderId, status, sentToEcotrack }: Props) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [saving, setSaving] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  async function updateStatus() {
    if (selectedStatus === status) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      if (!response.ok) throw new Error();
      toast.success("Order status updated.");
      router.refresh();
    } catch {
      toast.error("Unable to update the order status.");
    } finally {
      setSaving(false);
    }
  }

  async function dispatch() {
    setDispatching(true);
    try {
      const response = await fetch("/api/ecotrack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (response.status === 409) {
        toast.info("This shipment is already being processed or was sent.");
      } else if (!response.ok) {
        throw new Error();
      } else {
        toast.success("Shipment dispatched successfully.");
      }
      router.refresh();
    } catch {
      toast.error("Unable to dispatch this shipment.");
    } finally {
      setDispatching(false);
    }
  }

  return (
    <section className="flex flex-wrap gap-3 rounded-xl border bg-white p-4">
      <select
        aria-label="Order status"
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        {statuses.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <button type="button" onClick={updateStatus} disabled={saving || selectedStatus === status} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50">
        {saving ? "Saving…" : "Update status"}
      </button>
      <button type="button" onClick={() => window.open(`/dashboard/print/${orderId}`, "_blank", "noopener,noreferrer")} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">
        Print order
      </button>
      <button type="button" onClick={dispatch} disabled={dispatching || sentToEcotrack} className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
        {sentToEcotrack ? "Dispatched" : dispatching ? "Dispatching…" : "Dispatch to Ecotrack"}
      </button>
    </section>
  );
}
