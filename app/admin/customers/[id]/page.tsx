import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Pencil,
  Mail,
  Phone,
  Calendar,
  User,
} from "lucide-react";

import CustomerStatus from "@/components/customers/CustomerStatus";
import DeleteCustomerButton from "@/components/customers/DeleteCustomerButton";
import { getCustomerById } from "@/lib/services/customers";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDetailsPage({
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black tracking-[0.25em] text-[#C9A227]">
            CUSTOMER
          </p>

          <h1 className="mt-2 text-3xl font-black">
            {customer.name}
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            تفاصيل العميل
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-black transition hover:border-[#C9A227]"
          >
            <ArrowRight size={18} />
            الرجوع
          </Link>

          <Link
            href={`/admin/customers/${customer.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-black text-white transition hover:bg-[#252525]"
          >
            <Pencil size={18} />
            تعديل
          </Link>

          <DeleteCustomerButton
            id={customer.id}
            name={customer.name}
          />
        </div>
      </div>

      <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center gap-4">
            <User
              className="text-[#C9A227]"
              size={22}
            />

            <div>
              <p className="text-xs text-stone-500">
                الاسم
              </p>

              <p className="font-black text-lg">
                {customer.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Mail
              className="text-[#C9A227]"
              size={22}
            />

            <div>
              <p className="text-xs text-stone-500">
                البريد الإلكتروني
              </p>

              <p className="font-black">
                {customer.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone
              className="text-[#C9A227]"
              size={22}
            />

            <div>
              <p className="text-xs text-stone-500">
                الهاتف
              </p>

              <p className="font-black">
                {customer.phone || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Calendar
              className="text-[#C9A227]"
              size={22}
            />

            <div>
              <p className="text-xs text-stone-500">
                تاريخ الإنشاء
              </p>

              <p className="font-black">
                {new Date(
                  customer.created_at
                ).toLocaleDateString("ar-DZ")}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-stone-500">
              الحالة
            </p>

            <CustomerStatus
              active={customer.active}
            />
          </div>
        </div>
      </section>
    </div>
  );
}