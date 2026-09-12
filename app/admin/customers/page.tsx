import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import CustomersHeader from "@/components/customers/CustomersHeader";
import CustomersStats from "@/components/customers/CustomersStats";
import CustomersTable from "@/components/customers/CustomersTable";
import CustomersToolbar from "@/components/customers/CustomersToolbar";

import { getCustomersPaginated } from "@/lib/services/customers";

type Props = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    sort?: string;
  }>;
};

export default async function CustomersPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const rawPage = Number(params.page ?? "1");

  const page =
    Number.isSafeInteger(rawPage) &&
    rawPage > 0
      ? rawPage
      : 1;

  const rawPageSize = Number(
    params.pageSize ?? "50"
  );

  const pageSize =
    Number.isSafeInteger(rawPageSize) &&
    rawPageSize > 0
      ? Math.min(rawPageSize, 100)
      : 50;

  const {
    customers,
    hasMore,
  } = await getCustomersPaginated({
    page: page - 1,
    pageSize,
    search: params.search,
    sort: params.sort,
  });

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) => customer.active
    ).length;

  const inactiveCustomers =
    totalCustomers -
    activeCustomers;

  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  const newCustomers =
    customers.filter((customer) => {
      return (
        new Date(customer.created_at) >=
        thirtyDaysAgo
      );
    }).length;

  const previousPageHref =
    page > 1
      ? `/admin/customers?page=${
          page - 1
        }&pageSize=${pageSize}`
      : null;

  const nextPageHref = hasMore
    ? `/admin/customers?page=${
        page + 1
      }&pageSize=${pageSize}`
    : null;

  return (
    <div
      dir="rtl"
      className="min-h-screen space-y-8 bg-[#F7F5F0] px-4 py-6 text-[#111111] sm:px-6 lg:px-8"
    >
      <CustomersHeader />

      <CustomersStats
        totalCustomers={totalCustomers}
        newCustomers={newCustomers}
        activeCustomers={activeCustomers}
        inactiveCustomers={inactiveCustomers}
      />

      <CustomersToolbar
        totalCustomers={totalCustomers}
      />

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-[#9A7718]">
              CUSTOMER LIST
            </p>

            <h2 className="mt-1 text-xl font-black">
              قائمة العملاء
            </h2>
          </div>

          <p className="text-sm text-stone-500">
            {inactiveCustomers > 0
              ? `${inactiveCustomers} عميل غير نشط`
              : "جميع العملاء نشطون"}
          </p>
        </div>

        <CustomersTable
          customers={customers}
        />
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-[#C9A227]/25 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black">
            الصفحة {page}
          </p>

          <p className="mt-1 text-xs text-stone-500">
            يتم عرض حتى {pageSize} عميلًا في كل صفحة
          </p>
        </div>

        <div className="flex items-center gap-3">
          {previousPageHref ? (
            <Link
              href={previousPageHref}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-black transition hover:border-[#C9A227]"
            >
              <ChevronRight size={18} />
              السابق
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-5 py-3 text-sm font-black text-stone-400">
              <ChevronRight size={18} />
              السابق
            </span>
          )}

          <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-[#111111] px-4 text-sm font-black text-[#C9A227]">
            {page}
          </div>

          {nextPageHref ? (
            <Link
              href={nextPageHref}
              className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-black text-white transition hover:bg-[#252525]"
            >
              التالي

              <ChevronLeft size={18} />
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-stone-200 px-5 py-3 text-sm font-black text-stone-400">
              التالي

              <ChevronLeft size={18} />
            </span>
          )}
        </div>
      </section>
    </div>
  );
}