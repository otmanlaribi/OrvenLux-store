import { createClient } from "@/lib/supabase/server";
import PrintButton from "@/components/orders/PrintButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(value: number | string | null) {
  return Number(value ?? 0).toLocaleString("fr-FR");
}

export default async function PrintPage({
  params,
}: Props) {
  const supabase = await createClient();

  const { id } = await params;

  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-stone-100 p-6"
      >
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-red-700">
            رقم الطلب غير صالح
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            تأكد من رابط صفحة الطباعة ثم حاول مرة أخرى.
          </p>
        </div>
      </main>
    );
  }

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
        *,
        products (
          name,
          price
        )
      `
    )
    .eq("id", orderId)
    .single();

  if (!order) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-stone-100 p-6"
      >
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-red-700">
            الطلب غير موجود
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            لم نتمكن من العثور على هذا الطلب.
          </p>
        </div>
      </main>
    );
  }

  const createdAt = new Date(
    order.created_at
  ).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const isOfficeDelivery =
    order.delivery_type === "office";

  const deliveryAddress = isOfficeDelivery
    ? order.office_name || order.commune || "غير محدد"
    : order.address || "غير محدد";

  const totalPrice = formatPrice(
    order.total_price
  );

  const deliveryPrice = formatPrice(
    order.delivery_price
  );

  const productPrice = formatPrice(
    order.products?.price
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#EDEAE2] px-4 py-8 text-[#111111] sm:px-6"
    >
      {/* زر الطباعة - لا يظهر عند الطباعة */}
      <div className="print:hidden mx-auto mb-6 flex w-full max-w-[105mm] justify-center">
        <PrintButton />
      </div>

      {/* بطاقة الطباعة */}
      <article className="print-sheet mx-auto w-full max-w-[105mm] overflow-hidden rounded-[18px] border-2 border-[#111111] bg-white shadow-xl">
        {/* رأس البطاقة */}
        <header className="bg-[#111111] px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-[#C9A227]">
                ORVEN LUX
              </p>

              <h1 className="mt-2 text-2xl font-black">
                بطاقة الطلب
              </h1>

              <p className="mt-2 text-xs text-stone-300">
                متجر الساعات الرجالية الفاخرة
              </p>
            </div>

            <div className="rounded-xl border border-[#C9A227]/50 bg-white/5 px-4 py-3 text-center">
              <p className="text-[9px] font-bold text-stone-400">
                رقم الطلب
              </p>

              <p
                dir="ltr"
                className="mt-1 text-xl font-black text-[#C9A227]"
              >
                #{order.id}
              </p>
            </div>
          </div>
        </header>

        <div className="p-5">
          {/* معلومات سريعة */}
          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-stone-200 bg-[#F8F6F1] p-3">
              <p className="text-[9px] font-bold text-stone-400">
                تاريخ الطلب
              </p>

              <p className="mt-1 text-xs font-black text-[#111111]">
                {createdAt}
              </p>
            </div>

            <div className="rounded-xl border border-[#C9A227]/30 bg-[#FFFDF5] p-3">
              <p className="text-[9px] font-bold text-[#9A7718]">
                حالة الطلب
              </p>

              <p className="mt-1 text-xs font-black text-[#111111]">
                {order.status || "جديد"}
              </p>
            </div>
          </section>

          {/* العميل */}
          <section className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#C9A227]" />

              <h2 className="text-sm font-black">
                معلومات العميل
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border border-stone-200">
              <div className="grid grid-cols-[95px_1fr] border-b border-stone-200 text-sm">
                <div className="bg-[#F8F6F1] p-3 font-bold">
                  الاسم
                </div>

                <div className="p-3 font-black">
                  {order.customer_name || "غير متوفر"}
                </div>
              </div>

              <div className="grid grid-cols-[95px_1fr] border-b border-stone-200 text-sm">
                <div className="bg-[#F8F6F1] p-3 font-bold">
                  الهاتف
                </div>

                <div
                  dir="ltr"
                  className="p-3 text-right font-black"
                >
                  {order.phone || "غير متوفر"}
                </div>
              </div>

              {order.phone2 && (
                <div className="grid grid-cols-[95px_1fr] text-sm">
                  <div className="bg-[#F8F6F1] p-3 font-bold">
                    هاتف إضافي
                  </div>

                  <div
                    dir="ltr"
                    className="p-3 text-right font-black"
                  >
                    {order.phone2}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* المنتج */}
          <section className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#C9A227]" />

              <h2 className="text-sm font-black">
                معلومات المنتج
              </h2>
            </div>

            <div className="rounded-xl border border-stone-200 bg-[#F8F6F1] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold text-stone-400">
                    المنتج
                  </p>

                  <p className="mt-1 text-sm font-black">
                    {order.products?.name ||
                      "المنتج غير متوفر"}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-[9px] font-bold text-stone-400">
                    الكمية
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {order.quantity ?? 1}
                  </p>
                </div>
              </div>

              <div className="mt-3 border-t border-stone-200 pt-3">
                <p className="text-[9px] font-bold text-stone-400">
                  سعر المنتج
                </p>

                <p className="mt-1 text-sm font-black">
                  {productPrice} دج
                </p>
              </div>
            </div>
          </section>

          {/* الشحن */}
          <section className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#C9A227]" />

              <h2 className="text-sm font-black">
                معلومات التوصيل
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border border-stone-200">
              <div className="grid grid-cols-[95px_1fr] border-b border-stone-200 text-sm">
                <div className="bg-[#F8F6F1] p-3 font-bold">
                  الولاية
                </div>

                <div className="p-3 font-black">
                  {order.state ||
                    `الولاية رقم ${order.wilaya ?? "-"}`}
                </div>
              </div>

              <div className="grid grid-cols-[95px_1fr] border-b border-stone-200 text-sm">
                <div className="bg-[#F8F6F1] p-3 font-bold">
                  البلدية
                </div>

                <div className="p-3 font-black">
                  {order.commune || "غير محددة"}
                </div>
              </div>

              <div className="grid grid-cols-[95px_1fr] border-b border-stone-200 text-sm">
                <div className="bg-[#F8F6F1] p-3 font-bold">
                  النوع
                </div>

                <div className="p-3 font-black">
                  {isOfficeDelivery
                    ? "التوصيل إلى مكتب Ecotrack"
                    : "التوصيل إلى المنزل"}
                </div>
              </div>

              <div className="grid grid-cols-[95px_1fr] text-sm">
                <div className="bg-[#F8F6F1] p-3 font-bold">
                  العنوان
                </div>

                <div className="p-3 font-black leading-6">
                  {deliveryAddress}
                </div>
              </div>
            </div>
          </section>

          {/* الأسعار */}
          <section className="mt-5 overflow-hidden rounded-xl border-2 border-[#111111]">
            <div className="grid grid-cols-2 border-b border-stone-200">
              <div className="bg-[#F8F6F1] p-4">
                <p className="text-[9px] font-bold text-stone-400">
                  سعر التوصيل
                </p>

                <p className="mt-1 text-base font-black">
                  {deliveryPrice} دج
                </p>
              </div>

              <div className="p-4">
                <p className="text-[9px] font-bold text-stone-400">
                  الإجمالي
                </p>

                <p className="mt-1 text-lg font-black text-[#9A7718]">
                  {totalPrice} دج
                </p>
              </div>
            </div>

            <div className="bg-[#111111] px-4 py-3 text-center">
              <p className="text-xs font-black text-[#C9A227]">
                المبلغ المطلوب تحصيله: {totalPrice} دج
              </p>
            </div>
          </section>

          {/* التتبع */}
          {order.tracking_number && (
            <section className="mt-5 rounded-xl border border-dashed border-[#C9A227]/60 bg-[#FFFDF5] p-4 text-center">
              <p className="text-[9px] font-bold text-[#9A7718]">
                رقم تتبع Ecotrack
              </p>

              <p
                dir="ltr"
                className="mt-2 break-all text-sm font-black tracking-wide text-[#111111]"
              >
                {order.tracking_number}
              </p>
            </section>
          )}

          {/* الملاحظة */}
          {order.note && (
            <section className="mt-5 rounded-xl border border-stone-200 bg-[#F8F6F1] p-4">
              <p className="text-xs font-black">
                ملاحظة العميل
              </p>

              <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-stone-600">
                {order.note}
              </p>
            </section>
          )}

          {/* التذييل */}
          <footer className="mt-6 border-t border-stone-200 pt-4 text-center">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#9A7718]">
              ORVEN LUX
            </p>

            <p className="mt-1 text-[9px] text-stone-400">
              شكراً لاختياركم ORVEN LUX
            </p>
          </footer>
        </div>
      </article>

      <style>{`
        @page {
          size: A6 portrait;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 105mm;
            min-height: 148mm;
            margin: 0;
            padding: 0;
            background: #ffffff !important;
          }

          .print-sheet {
            width: 105mm !important;
            min-height: 148mm !important;
            max-width: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: 2px solid #111111 !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </main>
  );
}
