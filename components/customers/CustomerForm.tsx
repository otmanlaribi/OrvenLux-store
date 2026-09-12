"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const customerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().optional(),
  active: z.boolean(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

type CustomerFormProps = {
  defaultValues?: CustomerFormData;
  customerId?: number;
};

export default function CustomerForm({
  defaultValues,
  customerId,
}: CustomerFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      phone: "",
      active: true,
    },
  });

  async function onSubmit(values: CustomerFormData) {
    try {
      setLoading(true);

      const response = await fetch(
        customerId
          ? `/api/customers/${customerId}`
          : "/api/customers",
        {
          method: customerId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      toast.success(
        customerId
          ? "تم تحديث العميل"
          : "تم إنشاء العميل"
      );

      router.push("/admin/customers");
      router.refresh();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-bold">
          الاسم
        </label>

        <input
          {...form.register("name")}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C9A227]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          البريد الإلكتروني
        </label>

        <input
          type="email"
          {...form.register("email")}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C9A227]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold">
          الهاتف
        </label>

        <input
          {...form.register("phone")}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#C9A227]"
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          {...form.register("active")}
        />

        <span className="font-semibold">
          العميل نشط
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[#111111] px-6 py-3 font-bold text-white transition hover:bg-[#222222] disabled:opacity-60"
      >
        {loading
          ? "جارٍ الحفظ..."
          : customerId
          ? "حفظ التعديلات"
          : "إضافة العميل"}
      </button>
    </form>
  );
}