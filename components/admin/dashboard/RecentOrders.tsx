import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ReceiptText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import StatusBadge from "@/components/shared/StatusBadge";

type Order = {
  id: number | string;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
};

type RecentOrdersProps = {
  orders: Order[];
};

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <Card
      dir="rtl"
      className="
        group relative overflow-hidden
        rounded-3xl
        border-[#E8DDC7]
        bg-[#FCFBF8]
        shadow-sm
        transition-all duration-300
        hover:border-[#C9A227]/40
        hover:shadow-xl
      "
    >
      {/* Luxury accent */}
      <div
        aria-hidden="true"
        className="
          absolute inset-x-0 top-0
          h-1
          bg-[#C9A227]
        "
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-16 -top-16
          h-40 w-40
          rounded-full
          bg-[#C9A227]/10
          blur-3xl
        "
      />

      {/* Header */}
      <CardHeader className="relative p-5 pb-0 sm:p-7 sm:pb-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[#C9A227]"
              />

              <span className="text-xs font-black tracking-[0.25em] text-[#9A7718]">
                RECENT ORDERS
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
              آخر الطلبات
            </h2>

            <p className="mt-3 text-sm leading-7 text-stone-500">
              متابعة أحدث الطلبات الواردة إلى المتجر.
            </p>
          </div>

          {/* View all orders */}
          <Link
            href="/admin/orders"
            className="
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-2
              rounded-xl
              border border-[#E8DDC7]
              bg-white
              px-4 py-2.5
              text-sm
              font-black
              text-[#111111]
              shadow-sm
              outline-none
              transition-all duration-200
              hover:-translate-y-0.5
              hover:border-[#C9A227]
              hover:bg-[#F7F5F0]
              hover:shadow-md
              focus-visible:ring-2
              focus-visible:ring-[#C9A227]
              focus-visible:ring-offset-2
              sm:px-5 sm:py-3
            "
          >
            جميع الطلبات

            <ArrowLeft
              size={17}
              strokeWidth={2.5}
            />
          </Link>
        </div>
      </CardHeader>

      {/* Orders */}
      <CardContent className="relative p-5 pt-6 sm:p-7 sm:pt-7">
        {orders.length === 0 ? (
          <div
            className="
              rounded-3xl
              border border-dashed
              border-[#D8CCB7]
              bg-[#F9F7F2]
              px-5 py-16
              text-center
              sm:py-20
            "
          >
            <div
              className="
                mx-auto flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-[#111111]
                text-[#C9A227]
                shadow-md
              "
            >
              <ReceiptText
                size={30}
                strokeWidth={2}
              />
            </div>

            <h3 className="mt-5 text-xl font-black text-[#111111]">
              لا توجد طلبات بعد
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-stone-500">
              ستظهر الطلبات الجديدة هنا بمجرد أن يبدأ العملاء
              بالشراء.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="
                  group/order
                  flex flex-col gap-4
                  rounded-2xl
                  border border-[#ECE3D3]
                  bg-white
                  p-4
                  outline-none
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-[#C9A227]/60
                  hover:shadow-lg
                  focus-visible:ring-2
                  focus-visible:ring-[#C9A227]
                  focus-visible:ring-offset-2
                  sm:p-5
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                {/* Customer */}
                <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
                  <div
                    className="
                      flex h-12 w-12
                      shrink-0
                      items-center justify-center
                      rounded-2xl
                      bg-[#111111]
                      text-[#C9A227]
                      shadow-md
                      transition-transform duration-300
                      group-hover/order:scale-105
                      sm:h-14 sm:w-14
                    "
                  >
                    <ReceiptText
                      size={24}
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-black text-[#111111] sm:text-lg">
                      {order.customer_name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-500">
                      <span>
                        الطلب #{order.id}
                      </span>

                      <span className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          strokeWidth={2}
                        />

                        {new Date(
                          order.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order details */}
                <div
                  className="
                    flex items-center
                    justify-between
                    gap-3
                    border-t
                    border-[#F0E9DE]
                    pt-4
                    md:justify-end
                    md:border-t-0
                    md:pt-0
                  "
                >
                  {/* Total */}
                  <div className="text-right">
                    <p className="text-lg font-black text-[#111111] sm:text-xl">
                      {order.total_price.toLocaleString()} DA
                    </p>

                    <p className="mt-1 text-xs font-medium text-stone-500">
                      قيمة الطلب
                    </p>
                  </div>

                  {/* Status */}
                  <StatusBadge
                    status={order.status}
                  />

                  {/* Arrow */}
                  <ArrowLeft
                    size={18}
                    strokeWidth={2}
                    className="
                      hidden
                      text-stone-400
                      transition-all duration-300
                      group-hover/order:-translate-x-1
                      group-hover/order:text-[#C9A227]
                      sm:block
                    "
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}