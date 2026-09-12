import {
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";

type CustomersStatsProps = {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
};

export default function CustomersStats({
  totalCustomers,
  newCustomers,
  activeCustomers,
  inactiveCustomers,
}: CustomersStatsProps) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {/* إجمالي العملاء */}
      <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]/50 hover:shadow-lg">
        <div className="absolute right-0 top-0 h-1 w-full bg-[#111111]" />

        <div className="flex items-center justify-between">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#111111] text-[#C9A227]">
            <Users size={27} />
          </div>

          <span className="text-4xl font-black tracking-tight">
            {totalCustomers}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold">
            إجمالي العملاء
          </p>

          <p className="mt-1 text-xs text-stone-400">
            جميع العملاء المسجلين
          </p>
        </div>
      </div>

      {/* عملاء جدد */}
      <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-400 hover:shadow-lg">
        <div className="absolute right-0 top-0 h-1 w-full bg-green-600" />

        <div className="flex items-center justify-between">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <UserPlus size={27} />
          </div>

          <span className="text-4xl font-black tracking-tight">
            {newCustomers}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold">
            عملاء جدد
          </p>

          <p className="mt-1 text-xs text-stone-400">
            تمت إضافتهم مؤخراً
          </p>
        </div>
      </div>

      {/* العملاء النشطون */}
      <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]/50 hover:shadow-lg">
        <div className="absolute right-0 top-0 h-1 w-full bg-[#C9A227]" />

        <div className="flex items-center justify-between">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#C9A227]/15 text-[#9A7718]">
            <UserCheck size={27} />
          </div>

          <span className="text-4xl font-black tracking-tight">
            {activeCustomers}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold">
            عملاء نشطون
          </p>

          <p className="mt-1 text-xs text-stone-400">
            لديهم طلبات أو نشاط
          </p>
        </div>
      </div>

      {/* العملاء غير النشطين */}
      <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-lg">
        <div className="absolute right-0 top-0 h-1 w-full bg-red-500" />

        <div className="flex items-center justify-between">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <UserX size={27} />
          </div>

          <span className="text-4xl font-black tracking-tight">
            {inactiveCustomers}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold">
            عملاء غير نشطين
          </p>

          <p className="mt-1 text-xs text-stone-400">
            بدون نشاط حديث
          </p>
        </div>
      </div>
    </section>
  );
}