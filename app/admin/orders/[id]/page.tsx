import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  House,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";

import StatusBadge from "@/components/shared/StatusBadge";
import OrderActions from "@/components/orders/OrderActions";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/security";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function InfoRow({
  icon,
  label,
  value,
  dir,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-[#FDFCF9] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-[#C9A227]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-stone-400">
          {label}
        </p>

        <div
          dir={dir}
          className="mt-1 break-words text-sm font-black text-[#111111]"
        >
          {value || "غير متوفر"}
        </div>
      </div>
    </div>
  );
}

function parseOrderId(value: string) {
  const id = Number(value);

  if (
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    return null;
  }

  return id;
}

export default async function OrderDetailsPage({
  params,
}: Props) {
  /* =========================================================
     AUTH
  ========================================================= */

  const adminUser =
    await getAdminUser();

  if (!adminUser) {
    notFound();
  }

  /* =========================================================
     ORDER ID
  ========================================================= */

  const { id: rawId } =
    await params;

  const orderId =
    parseOrderId(rawId);

  if (orderId === null) {
    console.error(
      "INVALID ORDER ID:",
      rawId,
    );

    notFound();
  }

  /* =========================================================
     DATABASE
  =========================================================
     نستخدم العميل الإداري هنا حتى لا تمنع
     RLS صفحة تفاصيل الطلب من قراءة الطلب.
  ========================================================= */

  const supabase =
    createAdminClient();

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) {
    console.error(
      "ORDER DETAILS DATABASE ERROR:",
      {
        orderId,
        message:
          orderError.message,
        details:
          orderError.details,
        hint: orderError.hint,
        code: orderError.code,
      },
    );

    notFound();
  }

  if (!order) {
    console.error(
      "ORDER DETAILS NOT FOUND:",
      {
        orderId,
        rawId,
      },
    );

    notFound();
  }

  /* =========================================================
     FORMAT
  ========================================================= */

  const createdAt =
    new Date(
      order.created_at,
    ).toLocaleString(
      "fr-FR",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    );

  const totalPrice =
    Number(
      order.total_price ?? 0,
    ).toLocaleString(
      "fr-FR",
    );

  const deliveryPrice =
    Number(
      order.delivery_price ?? 0,
    ).toLocaleString(
      "fr-FR",
    );

  const isOfficeDelivery =
    order.delivery_type ===
    "office";

  return (
    <div
      dir="rtl"
      className="space-y-7"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-[#C9A227]/25 bg-[#111111] px-5 py-7 text-white shadow-lg sm:px-7">
        <div className="absolute left-0 top-0 h-full w-1 bg-[#C9A227]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#C9A227] transition hover:text-white"
            >
              <ArrowRight size={16} />

              العودة إلى جميع الطلبات
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-px w-7 bg-[#C9A227]" />

                  <span className="text-[10px] font-black tracking-[0.22em] text-[#C9A227]">
                    ORVEN LUX
                  </span>
                </div>

                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  تفاصيل الطلب #{order.id}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-sm text-stone-300">
                  <CalendarDays
                    size={16}
                    className="text-[#C9A227]"
                  />

                  تم إنشاء الطلب في{" "}
                  {createdAt}
                </div>
              </div>
            </div>
          </div>

          <div className="w-fit rounded-2xl border border-[#C9A227]/30 bg-white/5 p-4">
            <p className="mb-2 text-xs font-bold text-stone-400">
              حالة الطلب
            </p>

            <StatusBadge
              status={order.status}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <section className="rounded-3xl border border-[#C9A227]/25 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-[#C9A227]">
            <ClipboardList size={20} />
          </div>

          <div>
            <p className="text-[10px] font-black tracking-[0.18em] text-[#9A7718]">
              ORDER CONTROL
            </p>

            <h2 className="mt-1 text-lg font-black text-[#111111]">
              إدارة الطلب
            </h2>
          </div>
        </div>

        <OrderActions
          orderId={order.id}
          status={order.status}
          sentToEcotrack={
            Boolean(
              order.sent_to_ecotrack,
            )
          }
        />
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#C9A227]/25 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <CreditCard
              size={24}
              className="text-[#9A7718]"
            />

            <span className="text-2xl font-black text-[#111111]">
              {totalPrice}
            </span>
          </div>

          <p className="mt-4 text-sm text-stone-500">
            إجمالي الطلب
          </p>

          <p className="mt-1 text-xs font-bold text-[#9A7718]">
            دج
          </p>
        </div>

        <div className="rounded-2xl border border-[#C9A227]/25 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Truck
              size={24}
              className="text-[#9A7718]"
            />

            <span className="text-2xl font-black text-[#111111]">
              {deliveryPrice}
            </span>
          </div>

          <p className="mt-4 text-sm text-stone-500">
            سعر التوصيل
          </p>

          <p className="mt-1 text-xs font-bold text-[#9A7718]">
            دج
          </p>
        </div>

        <div className="rounded-2xl border border-[#C9A227]/25 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Package
              size={24}
              className="text-[#9A7718]"
            />

            <span className="text-2xl font-black text-[#111111]">
              {order.quantity ?? 1}
            </span>
          </div>

          <p className="mt-4 text-sm text-stone-500">
            الكمية
          </p>

          <p className="mt-1 text-xs font-bold text-[#9A7718]">
            قطعة
          </p>
        </div>

        <div className="rounded-2xl border border-[#C9A227]/25 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <CheckCircle2
              size={24}
              className={
                order.sent_to_ecotrack
                  ? "text-emerald-600"
                  : "text-stone-400"
              }
            />

            <span className="text-sm font-black text-[#111111]">
              {order.sent_to_ecotrack
                ? "تم الإرسال"
                : "قيد الانتظار"}
            </span>
          </div>

          <p className="mt-4 text-sm text-stone-500">
            حالة Ecotrack
          </p>

          <p className="mt-1 text-xs font-bold text-[#9A7718]">
            الشحن
          </p>
        </div>
      </section>

      {/* =====================================================
          CUSTOMER + SHIPPING
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-2">
        {/* CUSTOMER */}

        <div className="overflow-hidden rounded-3xl border border-[#C9A227]/25 bg-white shadow-sm">
          <div className="border-b border-stone-100 bg-[#F7F5F0] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-[#C9A227]">
                <User size={20} />
              </div>

              <div>
                <p className="text-[10px] font-black tracking-[0.18em] text-[#9A7718]">
                  CUSTOMER
                </p>

                <h2 className="mt-1 text-lg font-black text-[#111111]">
                  معلومات العميل
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <InfoRow
              icon={<User size={18} />}
              label="اسم العميل"
              value={
                order.customer_name
              }
            />

            <InfoRow
              icon={<Phone size={18} />}
              label="رقم الهاتف"
              value={order.phone}
              dir="ltr"
            />

            <InfoRow
              icon={<Phone size={18} />}
              label="رقم الهاتف الثاني"
              value={order.phone2}
              dir="ltr"
            />

            <InfoRow
              icon={<MapPin size={18} />}
              label="العنوان"
              value={order.address}
            />
          </div>
        </div>

        {/* SHIPPING */}

        <div className="overflow-hidden rounded-3xl border border-[#C9A227]/25 bg-white shadow-sm">
          <div className="border-b border-stone-100 bg-[#F7F5F0] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-[#C9A227]">
                <Truck size={20} />
              </div>

              <div>
                <p className="text-[10px] font-black tracking-[0.18em] text-[#9A7718]">
                  SHIPPING
                </p>

                <h2 className="mt-1 text-lg font-black text-[#111111]">
                  معلومات الشحن
                </h2>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <InfoRow
              icon={<MapPin size={18} />}
              label="رقم الولاية"
              value={order.wilaya}
            />

            <InfoRow
              icon={<MapPin size={18} />}
              label="البلدية"
              value={order.commune}
            />

            {isOfficeDelivery && (
              <InfoRow
                icon={<Package size={18} />}
                label="مكتب التوصيل"
                value={
                  order.office_name
                }
              />
            )}

            <InfoRow
              icon={
                isOfficeDelivery ? (
                  <Package size={18} />
                ) : (
                  <House size={18} />
                )
              }
              label="نوع التوصيل"
              value={
                isOfficeDelivery
                  ? "إلى مكتب DHD"
                  : "توصيل إلى المنزل"
              }
            />

            <InfoRow
              icon={<Truck size={18} />}
              label="رقم التتبع"
              value={
                order.tracking_number ??
                "لم يتم إنشاؤه بعد"
              }
              dir="ltr"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          ECOTRACK
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-[#C9A227]/25 bg-white shadow-sm">
        <div className="border-b border-stone-100 bg-[#111111] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A227] text-[#111111]">
              <Truck size={20} />
            </div>

            <div>
              <p className="text-[10px] font-black tracking-[0.18em] text-[#C9A227]">
                ECOTRACK
              </p>

              <h2 className="mt-1 text-lg font-black">
                معلومات الإرسال
              </h2>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-3">
          <InfoRow
            icon={
              <CheckCircle2 size={18} />
            }
            label="تم الإرسال"
            value={
              order.sent_to_ecotrack
                ? "نعم"
                : "لا"
            }
          />

          <InfoRow
            icon={
              <Truck size={18} />
            }
            label="مرجع Ecotrack"
            value={
              order.ecotrack_reference ??
              "غير متوفر"
            }
            dir="ltr"
          />

          <InfoRow
            icon={
              <ClipboardList
                size={18}
              />
            }
            label="حالة الإرسال"
            value={
              order.ecotrack_dispatch_state ??
              "pending"
            }
          />
        </div>

        {order.ecotrack_error && (
          <div className="mx-5 mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-black text-red-700">
              آخر خطأ من DHD
            </p>

            <p
              dir="ltr"
              className="mt-2 break-words text-xs leading-6 text-red-600"
            >
              {
                order.ecotrack_error
              }
            </p>
          </div>
        )}

        {order.tracking_number && (
          <div className="mx-5 mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-black text-emerald-700">
              رقم التتبع
            </p>

            <p
              dir="ltr"
              className="mt-2 font-mono text-sm font-bold text-emerald-800"
            >
              {
                order.tracking_number
              }
            </p>
          </div>
        )}
      </section>

      {/* =====================================================
          NOTE
      ===================================================== */}

      {order.note && (
        <section className="rounded-3xl border border-[#C9A227]/25 bg-[#F7F5F0] p-5">
          <h2 className="text-base font-black text-[#111111]">
            ملاحظة العميل
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-600">
            {order.note}
          </p>
        </section>
      )}
    </div>
  );
}