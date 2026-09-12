"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Printer,
  Save,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";

const statuses = [
  "جديد",
  "قيد المعالجة",
  "تم الشحن",
  "تم التسليم",
  "ملغي",
] as const;

type Props = {
  orderId: number;
  status: string;
  sentToEcotrack: boolean;
};

export default function OrderActions({
  orderId,
  status,
  sentToEcotrack,
}: Props) {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] =
    useState(status);

  const [saving, setSaving] =
    useState(false);

  const [dispatching, setDispatching] =
    useState(false);

  const statusChanged =
    selectedStatus !== status;

  async function updateStatus() {
    if (!statusChanged || saving) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to update order status"
        );
      }

      toast.success(
        "تم تحديث حالة الطلب بنجاح"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "ORDER STATUS ERROR:",
        error
      );

      toast.error(
        "تعذر تحديث حالة الطلب"
      );
    } finally {
      setSaving(false);
    }
  }

  async function dispatch() {
    if (
      dispatching ||
      sentToEcotrack
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "هل تريد إرسال هذا الطلب إلى Ecotrack؟\nلن يتم إرسال الطلب مرتين."
      );

    if (!confirmed) {
      return;
    }

    setDispatching(true);

    try {
      const response = await fetch(
        "/api/ecotrack/send",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId,
          }),
        }
      );

      if (response.status === 409) {
        toast.info(
          "الطلب تم إرساله مسبقاً أو تتم معالجته حالياً"
        );

        router.refresh();

        return;
      }

      const responseText =
        await response.text();

      if (!response.ok) {
        throw new Error(
          responseText ||
            "Ecotrack dispatch failed"
        );
      }

      toast.success(
        "تم إرسال الطلب إلى Ecotrack بنجاح"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "ECOTRACK DISPATCH ERROR:",
        error
      );

      toast.error(
        "تعذر إرسال الطلب إلى Ecotrack"
      );
    } finally {
      setDispatching(false);
    }
  }

  function printOrder() {
    window.open(
      `/dashboard/print/${orderId}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-[#C9A227]/25 bg-[#FDFCF9] p-4 sm:p-5"
    >
      <div className="flex flex-col gap-5">
        {/* عنوان القسم */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-[#111111]">
              إجراءات الطلب
            </h3>

            <p className="mt-1 text-xs text-stone-500">
              تحديث حالة الطلب أو إرساله
              إلى شركة التوصيل.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/25 bg-white px-3 py-2">
            <ShieldCheck
              size={16}
              className="text-[#9A7718]"
            />

            <span className="text-xs font-bold text-stone-600">
              رقم الطلب #{orderId}
            </span>
          </div>
        </div>

        {/* تغيير الحالة */}
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <select
              aria-label="حالة الطلب"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
              disabled={saving}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-white px-4 py-3 pl-11 text-sm font-bold text-[#111111] outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {statuses.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
          </div>

          <button
            type="button"
            onClick={updateStatus}
            disabled={
              saving ||
              !statusChanged
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#111111] bg-white px-5 py-3 text-sm font-black text-[#111111] transition hover:bg-[#111111] hover:text-[#C9A227] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                جارٍ الحفظ...
              </>
            ) : (
              <>
                <Save size={18} />

                حفظ الحالة
              </>
            )}
          </button>
        </div>

        {/* الأزرار الرئيسية */}
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={printOrder}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-black text-[#111111] transition hover:border-[#C9A227] hover:bg-[#F7F5F0]"
          >
            <Printer size={18} />

            طباعة الطلب
          </button>

          <button
            type="button"
            onClick={dispatch}
            disabled={
              dispatching ||
              sentToEcotrack
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-black text-white transition hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sentToEcotrack ? (
              <>
                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                تم الإرسال إلى Ecotrack
              </>
            ) : dispatching ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin text-[#C9A227]"
                />

                جارٍ الإرسال...
              </>
            ) : (
              <>
                <Send
                  size={18}
                  className="text-[#C9A227]"
                />

                إرسال إلى Ecotrack
              </>
            )}
          </button>
        </div>

        {/* ملاحظة */}
        <div className="flex items-start gap-2 rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/5 p-3">
          <Truck
            size={17}
            className="mt-0.5 shrink-0 text-[#9A7718]"
          />

          <p className="text-xs leading-6 text-stone-600">
            بعد الإرسال الناجح سيتم حفظ
            رقم التتبع وتحديث حالة الطلب
            تلقائياً.
          </p>
        </div>
      </div>
    </section>
  );
}
