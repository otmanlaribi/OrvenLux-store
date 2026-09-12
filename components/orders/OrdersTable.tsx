"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Printer,
  Trash2,
  Truck,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import OrderFilters from "./OrderFilters";
import StatusBadge from "@/components/shared/StatusBadge";
import type { Order } from "@/types/database";

type OrderListItem = Pick<
  Order,
  | "id"
  | "customer_name"
  | "phone"
  | "total_price"
  | "status"
  | "tracking_number"
  | "delivery_type"
  | "created_at"
  | "commune"
  | "wilaya"
>;

type Props = {
  initialOrders: OrderListItem[];
  page: number;
  pageCount: number;
};

const TABLE_MIN_WIDTH = 1150;

export default function OrdersTable({
  initialOrders,
  page,
  pageCount,
}: Props) {
  const router = useRouter();

  /*
   * We intentionally avoid copying `initialOrders` into local
   * state. The server prop is the source of truth, while this
   * set stores only optimistic deletions performed in the
   * current client session.
   *
   * This removes the need for:
   *
   * useEffect(() => {
   *   setOrders(initialOrders);
   * }, [initialOrders]);
   *
   * and therefore avoids the React `set-state-in-effect` lint
   * error while keeping router.refresh() fully compatible.
   */
  const [deletedOrderIds, setDeletedOrderIds] =
    useState<Set<number>>(
      () => new Set<number>()
    );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [wilaya, setWilaya] = useState("");

  const [
    deletingOrderId,
    setDeletingOrderId,
  ] = useState<number | null>(null);

  const topScrollRef =
    useRef<HTMLDivElement>(null);

  const tableScrollRef =
    useRef<HTMLDivElement>(null);

  const isSyncingRef =
    useRef(false);

  /*
   * Build the visible order list from the latest server
   * data plus the current optimistic deletion set.
   */
  const orders = useMemo(() => {
    if (deletedOrderIds.size === 0) {
      return initialOrders;
    }

    return initialOrders.filter(
      (order) =>
        !deletedOrderIds.has(order.id)
    );
  }, [
    initialOrders,
    deletedOrderIds,
  ]);

  // =====================================================
  // Wilaya list
  // =====================================================

  const wilayas = useMemo(() => {
    const values = new Set<number>();

    for (const order of orders) {
      if (
        typeof order.wilaya ===
        "number"
      ) {
        values.add(order.wilaya);
      }
    }

    return Array.from(values).sort(
      (a, b) => a - b
    );
  }, [orders]);

  // =====================================================
  // Local filtering
  // =====================================================

  const filteredOrders = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const rawSearch =
      search.trim();

    return orders.filter((order) => {
      const customerName =
        order.customer_name
          ?.toLowerCase() ?? "";

      const phone =
        order.phone ?? "";

      const orderId =
        String(order.id);

      const tracking =
        order.tracking_number
          ?.toLowerCase() ?? "";

      const matchesSearch =
        normalizedSearch === "" ||
        customerName.includes(
          normalizedSearch
        ) ||
        phone.includes(rawSearch) ||
        orderId.includes(rawSearch) ||
        tracking.includes(
          normalizedSearch
        );

      const matchesStatus =
        status === "" ||
        order.status === status;

      const matchesWilaya =
        wilaya === "" ||
        String(
          order.wilaya ?? ""
        ) === wilaya;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesWilaya
      );
    });
  }, [
    orders,
    search,
    status,
    wilaya,
  ]);

  // =====================================================
  // Horizontal scroll synchronization
  // =====================================================

  useEffect(() => {
    const topScroll =
      topScrollRef.current;

    const tableScroll =
      tableScrollRef.current;

    if (
      !topScroll ||
      !tableScroll
    ) {
      return;
    }

    const syncScroll = (
      source: HTMLDivElement,
      target: HTMLDivElement
    ) => {
      if (isSyncingRef.current) {
        return;
      }

      isSyncingRef.current = true;

      target.scrollLeft =
        source.scrollLeft;

      requestAnimationFrame(() => {
        isSyncingRef.current =
          false;
      });
    };

    const handleTopScroll = () => {
      syncScroll(
        topScroll,
        tableScroll
      );
    };

    const handleTableScroll = () => {
      syncScroll(
        tableScroll,
        topScroll
      );
    };

    topScroll.addEventListener(
      "scroll",
      handleTopScroll,
      {
        passive: true,
      }
    );

    tableScroll.addEventListener(
      "scroll",
      handleTableScroll,
      {
        passive: true,
      }
    );

    topScroll.scrollLeft =
      tableScroll.scrollLeft;

    return () => {
      topScroll.removeEventListener(
        "scroll",
        handleTopScroll
      );

      tableScroll.removeEventListener(
        "scroll",
        handleTableScroll
      );
    };
  }, [filteredOrders.length]);

  // =====================================================
  // Clear filters
  // =====================================================

  function clearFilters() {
    setSearch("");
    setStatus("");
    setWilaya("");
  }

  // =====================================================
  // Print order
  // =====================================================

  function printOrder(
    orderId: number
  ) {
    window.open(
      `/dashboard/print/${orderId}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  // =====================================================
  // Delete order
  // =====================================================

  async function deleteOrder(
    order: OrderListItem
  ) {
    if (
      deletingOrderId !== null
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `هل أنت متأكد من حذف الطلب #${order.id}؟\n\nهذا الإجراء لا يمكن التراجع عنه.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingOrderId(
        order.id
      );

      const response =
        await fetch(
          `/api/orders?id=${order.id}`,
          {
            method: "DELETE",
            headers: {
              Accept:
                "application/json",
            },
          }
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to delete order"
        );
      }

      /*
       * Optimistic local removal.
       * The server remains the source of truth and
       * router.refresh() will update initialOrders.
       */
      setDeletedOrderIds(
        (current) => {
          const next = new Set(
            current
          );

          next.add(order.id);

          return next;
        }
      );

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE ORDER ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "تعذر حذف الطلب. حاول مرة أخرى."
      );
    } finally {
      setDeletingOrderId(null);
    }
  }

  return (
    <div
      dir="rtl"
      className="
        w-full
        min-w-0
        space-y-5
      "
    >
      {/* =================================================
          FILTER CONSOLE
          ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[24px]
          border
          border-white/[0.07]
          bg-[#111111]
          shadow-[0_22px_60px_rgba(0,0,0,0.24)]
          sm:rounded-[28px]
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#C9A227]/45
            to-transparent
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[#C9A227]/[0.035]
            blur-[70px]
          "
        />

        <div className="relative z-10 p-2 sm:p-3">
          <OrderFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            wilaya={wilaya}
            setWilaya={setWilaya}
            wilayas={wilayas}
            totalOrders={
              filteredOrders.length
            }
            reload={() =>
              window.location.reload()
            }
            clearFilters={
              clearFilters
            }
          />
        </div>
      </section>

      {/* =================================================
          ORDER COMMAND LEDGER
          ================================================= */}

      <section
        className="
          relative
          w-full
          min-w-0
          max-w-full
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.08]
          bg-[#0D0D0D]
          shadow-[0_30px_90px_rgba(0,0,0,0.32)]
          sm:rounded-[32px]
        "
      >
        {/* Top signature line */}

        <div
          aria-hidden="true"
          className="
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-[#C9A227]/60
            to-transparent
          "
        />

        {/* =================================================
            Header
            ================================================= */}

        <header
          className="
            relative
            border-b
            border-white/[0.06]
            px-5
            py-6
            sm:px-7
            sm:py-7
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-[-100px]
              top-[-100px]
              h-72
              w-72
              rounded-full
              bg-[#C9A227]/[0.025]
              blur-[80px]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-start gap-4">
              {/* Editorial marker */}

              <div
                className="
                  mt-1
                  h-14
                  w-px
                  shrink-0
                  bg-gradient-to-b
                  from-[#C9A227]
                  via-[#C9A227]/50
                  to-transparent
                "
              />

              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="
                      h-px
                      w-8
                      bg-[#C9A227]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.32em]
                      text-[#C9A227]
                    "
                  >
                    ORVEN LUX / LEDGER
                  </span>
                </div>

                <h2
                  className="
                    mt-3
                    font-serif
                    text-2xl
                    font-medium
                    tracking-[-0.02em]
                    text-[#F7F5F0]
                    sm:text-3xl
                  "
                >
                  Order Command Ledger
                </h2>

                <p
                  className="
                    mt-2
                    max-w-xl
                    text-xs
                    leading-6
                    text-white/35
                    sm:text-sm
                  "
                >
                  سجل تشغيلي دقيق لطلبات
                  ORVEN LUX ومراحل التنفيذ
                  والتسليم.
                </p>
              </div>
            </div>

            {/* Records instrument */}

            <div
              className="
                group/records
                flex
                w-fit
                items-center
                gap-3
                rounded-[18px]
                border
                border-[#C9A227]/15
                bg-[#C9A227]/[0.035]
                px-4
                py-3
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#C9A227]/30
                hover:bg-[#C9A227]/[0.05]
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C9A227]/25
                  bg-[#0A0A0A]
                  text-[#C9A227]
                  shadow-[inset_0_0_18px_rgba(201,162,39,0.06)]
                  transition-transform
                  duration-500
                  group-hover/records:rotate-3
                "
              >
                <span className="text-[11px] font-medium">
                  {filteredOrders.length}
                </span>
              </div>

              <div>
                <p
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.22em]
                    text-white/22
                  "
                >
                  Visible Records
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-white/65
                  "
                >
                  الطلبات الحالية
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =================================================
            Top horizontal scroll rail
            ================================================= */}

        <div
          ref={topScrollRef}
          dir="rtl"
          aria-label="التمرير الأفقي العلوي للجدول"
          className="
            w-full
            max-w-full
            overflow-x-auto
            overflow-y-hidden
            border-b
            border-white/[0.05]
            bg-[#101010]
            px-3
            py-2
          "
        >
          <div
            className="
              h-px
              bg-white/[0.025]
            "
            style={{
              minWidth:
                TABLE_MIN_WIDTH,
            }}
          />
        </div>

        {/* =================================================
            Table viewport
            ================================================= */}

        <div
          ref={tableScrollRef}
          dir="rtl"
          className="
            w-full
            min-w-0
            max-w-full
            overflow-x-auto
            overflow-y-hidden
          "
        >
          <table
            className="
              w-full
              border-collapse
            "
            style={{
              minWidth:
                TABLE_MIN_WIDTH,
            }}
          >
            {/* =================================================
                Head
                ================================================= */}

            <thead className="bg-[#111111]">
              <tr>
                <th className="whitespace-nowrap border-b border-white/[0.06] px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.17em] text-[#C9A227]">
                  الطلب
                </th>

                <th className="whitespace-nowrap border-b border-white/[0.06] px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.17em] text-[#C9A227]">
                  العميل
                </th>

                <th className="whitespace-nowrap border-b border-white/[0.06] px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.17em] text-[#C9A227]">
                  الهاتف
                </th>

                <th className="whitespace-nowrap border-b border-white/[0.06] px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.17em] text-[#C9A227]">
                  الموقع
                </th>

                <th className="whitespace-nowrap border-b border-white/[0.06] px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.17em] text-[#C9A227]">
                  التوصيل
                </th>

                <th className="whitespace-nowrap border-b border-white/[0.06] px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.17em] text-[#C9A227]">
                  المبلغ
                </th>

                <th className="whitespace-nowrap border-b border-white/[0.06] px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.17em] text-[#C9A227]">
                  الحالة
                </th>

                <th className="whitespace-nowrap border-b border-white/[0.06] px-5 py-4 text-right text-[10px] font-medium uppercase tracking-[0.17em] text-[#C9A227]">
                  التتبع
                </th>

                <th
                  className="
                    sticky
                    left-0
                    z-30
                    whitespace-nowrap
                    border-b
                    border-r
                    border-white/[0.08]
                    bg-[#111111]
                    px-5
                    py-4
                    text-center
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.17em]
                    text-[#C9A227]
                    shadow-[-12px_0_20px_rgba(0,0,0,0.3)]
                  "
                >
                  الإجراءات
                </th>
              </tr>
            </thead>

            {/* =================================================
                Body
                ================================================= */}

            <tbody>
              {filteredOrders.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="
                      px-5
                      py-24
                      text-center
                    "
                  >
                    <div className="mx-auto flex max-w-md flex-col items-center">
                      <div
                        className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#C9A227]/15
                          bg-[#C9A227]/[0.035]
                          text-[#C9A227]
                          shadow-[0_0_35px_rgba(201,162,39,0.05)]
                        "
                      >
                        <Truck
                          size={24}
                          strokeWidth={1.35}
                        />
                      </div>

                      <p
                        className="
                          mt-5
                          font-serif
                          text-xl
                          text-[#F7F5F0]
                        "
                      >
                        لا توجد طلبات مطابقة
                      </p>

                      <p
                        className="
                          mt-2
                          text-sm
                          leading-6
                          text-white/30
                        "
                      >
                        جرّب تغيير معايير البحث
                        أو مسح الفلاتر لعرض
                        المزيد من الطلبات.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(
                  (order) => {
                    const isDeleting =
                      deletingOrderId ===
                      order.id;

                    return (
                      <tr
                        key={order.id}
                        className="
                          group
                          border-b
                          border-white/[0.045]
                          transition-all
                          duration-300
                          hover:bg-white/[0.018]
                        "
                      >
                        {/* Order */}

                        <td className="whitespace-nowrap px-5 py-5">
                          <div className="flex flex-col">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="
                                w-fit
                                font-serif
                                text-lg
                                text-[#C9A227]
                                transition-all
                                duration-300
                                hover:-translate-x-0.5
                                hover:text-[#E1C55A]
                              "
                            >
                              #{order.id}
                            </Link>

                            <span
                              className="
                                mt-1.5
                                text-[10px]
                                uppercase
                                tracking-[0.1em]
                                text-white/22
                              "
                            >
                              {new Date(
                                order.created_at
                              ).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Customer */}

                        <td className="whitespace-nowrap px-5 py-5">
                          <span
                            className="
                              font-medium
                              text-white/82
                              transition-colors
                              duration-300
                              group-hover:text-white
                            "
                          >
                            {order.customer_name ||
                              "غير محدد"}
                          </span>
                        </td>

                        {/* Phone */}

                        <td
                          dir="ltr"
                          className="
                            whitespace-nowrap
                            px-5
                            py-5
                            text-right
                            text-xs
                            font-medium
                            text-white/45
                          "
                        >
                          {order.phone ||
                            "—"}
                        </td>

                        {/* Location */}

                        <td className="min-w-[170px] px-5 py-5">
                          <div className="flex min-w-0 flex-col">
                            <span
                              className="
                                font-medium
                                text-white/72
                              "
                            >
                              الولاية{" "}
                              {order.wilaya ??
                                "—"}
                            </span>

                            <span
                              className="
                                mt-1
                                text-xs
                                text-white/25
                              "
                            >
                              {order.commune ??
                                "غير محددة"}
                            </span>
                          </div>
                        </td>

                        {/* Delivery */}

                        <td className="whitespace-nowrap px-5 py-5">
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              px-3
                              py-1.5
                              text-[10px]
                              font-medium
                            "
                            style={{
                              borderColor:
                                order.delivery_type ===
                                "home"
                                  ? "rgba(201,162,39,0.2)"
                                  : "rgba(255,255,255,0.08)",
                              backgroundColor:
                                order.delivery_type ===
                                "home"
                                  ? "rgba(201,162,39,0.06)"
                                  : "rgba(255,255,255,0.025)",
                              color:
                                order.delivery_type ===
                                "home"
                                  ? "#C9A227"
                                  : "rgba(255,255,255,0.42)",
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor:
                                  order.delivery_type ===
                                  "home"
                                    ? "#C9A227"
                                    : "rgba(255,255,255,0.25)",
                              }}
                            />

                            {order.delivery_type ===
                            "home"
                              ? "توصيل للمنزل"
                              : "توصيل إلى المكتب"}
                          </span>
                        </td>

                        {/* Amount */}

                        <td className="whitespace-nowrap px-5 py-5">
                          <span
                            className="
                              font-serif
                              text-lg
                              text-[#F7F5F0]
                            "
                          >
                            {Number(
                              order.total_price ??
                                0
                            ).toLocaleString(
                              "fr-FR"
                            )}

                            <span
                              className="
                                mr-1
                                text-[10px]
                                font-medium
                                text-[#C9A227]
                              "
                            >
                              دج
                            </span>
                          </span>
                        </td>

                        {/* Status */}

                        <td className="whitespace-nowrap px-5 py-5">
                          <StatusBadge
                            status={
                              order.status
                            }
                          />
                        </td>

                        {/* Tracking */}

                        <td className="whitespace-nowrap px-5 py-5">
                          {order.tracking_number ? (
                            <span
                              dir="ltr"
                              className="
                                inline-flex
                                max-w-[220px]
                                whitespace-nowrap
                                rounded-full
                                border
                                border-emerald-400/15
                                bg-emerald-400/[0.05]
                                px-3
                                py-1.5
                                text-[10px]
                                font-medium
                                text-emerald-300/75
                              "
                            >
                              {
                                order.tracking_number
                              }
                            </span>
                          ) : (
                            <span className="text-white/15">
                              —
                            </span>
                          )}
                        </td>

                        {/* Actions */}

                        <td
                          className="
                            sticky
                            left-0
                            z-20
                            whitespace-nowrap
                            border-r
                            border-white/[0.07]
                            bg-[#0D0D0D]
                            px-5
                            py-5
                            shadow-[-12px_0_20px_rgba(0,0,0,0.3)]
                            transition-colors
                            duration-300
                            group-hover:bg-[#111111]
                          "
                        >
                          <div className="flex items-center justify-center gap-2">
                            {/* View */}

                            <Link
                              href={`/admin/orders/${order.id}`}
                              title="عرض الطلب"
                              aria-label={`عرض الطلب ${order.id}`}
                              className="
                                group/view
                                inline-flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-[12px]
                                border
                                border-[#C9A227]/15
                                bg-[#C9A227]/[0.035]
                                text-[#C9A227]
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:rotate-[-2deg]
                                hover:border-[#C9A227]/40
                                hover:bg-[#C9A227]/[0.08]
                                hover:shadow-[0_12px_25px_rgba(201,162,39,0.1)]
                              "
                            >
                              <Eye
                                size={17}
                                strokeWidth={1.7}
                                className="
                                  transition-transform
                                  duration-300
                                  group-hover/view:scale-110
                                "
                              />
                            </Link>

                            {/* Print */}

                            <button
                              type="button"
                              onClick={() =>
                                printOrder(
                                  order.id
                                )
                              }
                              disabled={
                                deletingOrderId !==
                                null
                              }
                              title="طباعة الطلب"
                              aria-label={`طباعة الطلب ${order.id}`}
                              className="
                                group/print
                                inline-flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-[12px]
                                border
                                border-white/[0.08]
                                bg-white/[0.025]
                                text-white/35
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-white/[0.16]
                                hover:bg-white/[0.05]
                                hover:text-white/80
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                              "
                            >
                              <Printer
                                size={17}
                                strokeWidth={1.7}
                                className="
                                  transition-transform
                                  duration-300
                                  group-hover/print:scale-105
                                "
                              />
                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteOrder(
                                  order
                                )
                              }
                              disabled={
                                deletingOrderId !==
                                null
                              }
                              title="حذف الطلب"
                              aria-label={`حذف الطلب ${order.id}`}
                              className="
                                group/delete
                                inline-flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-[12px]
                                border
                                border-white/[0.08]
                                bg-white/[0.025]
                                text-white/30
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-red-400/25
                                hover:bg-red-400/[0.06]
                                hover:text-red-300
                                hover:shadow-[0_12px_25px_rgba(248,113,113,0.08)]
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                              "
                            >
                              {isDeleting ? (
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={17}
                                  strokeWidth={1.7}
                                  className="
                                    transition-transform
                                    duration-300
                                    group-hover/delete:scale-105
                                  "
                                />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            Pagination
            ================================================= */}

        {pageCount > 1 && (
          <footer
            className="
              flex
              flex-col
              gap-4
              border-t
              border-white/[0.06]
              px-5
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-7
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.22em]
                  text-white/22
                "
              >
                Navigation
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-white/42
                "
              >
                الصفحة{" "}
                <span className="text-[#C9A227]">
                  {page}
                </span>{" "}
                من{" "}
                <span className="text-white/65">
                  {pageCount}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={`/admin/orders?page=${page - 1}`}
                  className="
                    group/prev
                    inline-flex
                    min-h-[42px]
                    items-center
                    gap-2
                    rounded-[13px]
                    border
                    border-white/[0.08]
                    bg-white/[0.02]
                    px-4
                    text-xs
                    font-medium
                    text-white/45
                    transition-all
                    duration-300
                    hover:-translate-x-1
                    hover:border-[#C9A227]/25
                    hover:bg-[#C9A227]/[0.05]
                    hover:text-white
                  "
                >
                  <ChevronRight
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover/prev:translate-x-0.5
                    "
                  />

                  السابقة
                </Link>
              ) : (
                <span
                  className="
                    inline-flex
                    min-h-[42px]
                    cursor-not-allowed
                    items-center
                    gap-2
                    rounded-[13px]
                    border
                    border-white/[0.045]
                    bg-white/[0.01]
                    px-4
                    text-xs
                    font-medium
                    text-white/15
                  "
                >
                  <ChevronRight
                    size={16}
                  />
                  السابقة
                </span>
              )}

              {page < pageCount ? (
                <Link
                  href={`/admin/orders?page=${page + 1}`}
                  className="
                    group/next
                    inline-flex
                    min-h-[42px]
                    items-center
                    gap-2
                    rounded-[13px]
                    border
                    border-[#C9A227]/25
                    bg-[#C9A227]/[0.06]
                    px-4
                    text-xs
                    font-medium
                    text-[#C9A227]
                    transition-all
                    duration-300
                    hover:translate-x-1
                    hover:bg-[#C9A227]
                    hover:text-[#111111]
                    hover:shadow-[0_12px_28px_rgba(201,162,39,0.12)]
                  "
                >
                  التالية

                  <ChevronLeft
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover/next:-translate-x-0.5
                    "
                  />
                </Link>
              ) : (
                <span
                  className="
                    inline-flex
                    min-h-[42px]
                    cursor-not-allowed
                    items-center
                    gap-2
                    rounded-[13px]
                    border
                    border-white/[0.045]
                    bg-white/[0.01]
                    px-4
                    text-xs
                    font-medium
                    text-white/15
                  "
                >
                  التالية

                  <ChevronLeft
                    size={16}
                  />
                </span>
              )}
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}