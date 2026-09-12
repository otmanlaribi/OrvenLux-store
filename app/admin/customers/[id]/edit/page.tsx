import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import CustomerForm from "@/components/customers/CustomerForm";
import { getCustomerById } from "@/lib/services/customers";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: Props) {
  const { id } = await params;

  const customer = await getCustomerById(
    Number(id)
  ).catch(() => null);

  if (!customer) {
    notFound();
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen space-y-8 bg-[#F7F5F0] px-4 py-6 text-[#111111] sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black tracking-[0.25em] text-[#C9A227]">
            CUSTOMERS
          </p>

          <h1 className="mt-2 text-3xl font-black">
            تعديل العميل
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            تعديل بيانات العميل.
          </p>
        </div>

        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-black transition hover:border-[#C9A227]"
        >
          <ArrowRight size={18} />

          الرجوع
        </Link>
      </div>

      <CustomerForm
        customerId={customer.id}
        defaultValues={{
          name: customer.name,
          email: customer.email,
          phone: customer.phone ?? "",
          active: customer.active,
        }}
      />
    </div>
  );
}