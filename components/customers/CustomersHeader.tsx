import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function CustomersHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#C9A227]/25 bg-white px-6 py-7 shadow-sm sm:px-8">
      <div className="absolute inset-y-0 right-0 w-1.5 bg-[#C9A227]" />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A227]" />

            <span className="text-xs font-black tracking-[0.25em] text-[#9A7718]">
              ORVEN LUX ADMIN
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#111111] sm:text-4xl">
            إدارة العملاء
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
            إدارة جميع العملاء، متابعة نشاطهم، والاطلاع على سجل طلباتهم
            من مكان واحد.
          </p>
        </div>

        <Link
          href="/admin/customers/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#252525] hover:shadow-lg"
        >
          <UserPlus size={19} />

          إضافة عميل
        </Link>
      </div>
    </section>
  );
}