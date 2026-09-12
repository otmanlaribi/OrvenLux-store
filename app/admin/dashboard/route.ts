import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DashboardPeriod = "7D" | "30D" | "90D";

type DashboardOrder = {
  id: number;
  customer_name: string | null;
  phone: string | null;
  total_price: number | string | null;
  status: string | null;
  created_at: string;
  commune: string | null;
  wilaya: number | null;
  delivery_type: string | null;
  tracking_number: string | null;
};

type DashboardProduct = {
  id: number | string;
  name: string | null;
  price: number | string | null;
  stock: number | null;
  active: boolean | null;
  image: string | null;
  created_at: string | null;
};

function getPeriodDays(
  period: DashboardPeriod,
) {
  if (period === "7D") {
    return 7;
  }

  if (period === "90D") {
    return 90;
  }

  return 30;
}

function addDays(
  date: Date,
  days: number,
) {
  const value = new Date(date);

  value.setDate(
    value.getDate() + days,
  );

  return value;
}

function normalizeStatus(
  status: string | null,
) {
  return String(status ?? "")
    .trim()
    .toLowerCase();
}

function isDelivered(
  status: string | null,
) {
  const value =
    normalizeStatus(status);

  return [
    "delivered",
    "delivery",
    "تم التسليم",
    "مسلّم",
    "مسلم",
  ].includes(value);
}

function isCancelled(
  status: string | null,
) {
  const value =
    normalizeStatus(status);

  return [
    "cancelled",
    "canceled",
    "cancel",
    "ملغي",
    "ملغى",
  ].includes(value);
}

function isPending(
  status: string | null,
) {
  const value =
    normalizeStatus(status);

  return [
    "pending",
    "new",
    "confirmed",
    "processing",
    "جديد",
    "تم التأكيد",
    "قيد المعالجة",
  ].includes(value);
}

function isAttentionOrder(
  order: DashboardOrder,
) {
  const status =
    normalizeStatus(order.status);

  const createdAt =
    new Date(
      order.created_at,
    ).getTime();

  const ageHours =
    (Date.now() - createdAt) /
    (1000 * 60 * 60);

  const waitingStatus =
    [
      "pending",
      "new",
      "جديد",
    ].includes(status);

  const oldProcessing =
    [
      "processing",
      "قيد المعالجة",
    ].includes(status) &&
    ageHours >= 24;

  return (
    !isCancelled(order.status) &&
    (waitingStatus ||
      oldProcessing)
  );
}

function isLowStock(
  stock: number | null,
) {
  const value =
    Number(stock ?? 0);

  return value > 0 && value <= 5;
}

function isOutOfStock(
  stock: number | null,
) {
  return Number(stock ?? 0) <= 0;
}

function calculatePercentChange(
  current: number,
  previous: number,
) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return (
    ((current - previous) /
      previous) *
    100
  );
}

function buildChart(
  orders: DashboardOrder[],
  period: DashboardPeriod,
) {
  const days =
    getPeriodDays(period);

  const today = new Date();

  const end = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const start = addDays(
    end,
    -(days - 1),
  );

  const buckets = new Array(
    days,
  ).fill(0) as number[];

  for (const order of orders) {
    const createdAt =
      new Date(order.created_at);

    const orderDay = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate(),
    );

    const diff = Math.floor(
      (orderDay.getTime() -
        start.getTime()) /
        (24 * 60 * 60 * 1000),
    );

    if (
      diff < 0 ||
      diff >= days
    ) {
      continue;
    }

    buckets[diff] += Number(
      order.total_price ?? 0,
    );
  }

  if (period === "7D") {
    return {
      values: buckets,
      labels: buckets.map(
        (_, index) =>
          new Intl.DateTimeFormat(
            "en",
            {
              weekday: "short",
            },
          ).format(
            addDays(
              start,
              index,
            ),
          ),
      ),
    };
  }

  if (period === "30D") {
    return {
      values: buckets,
      labels: buckets.map(
        (_, index) =>
          String(
            addDays(
              start,
              index,
            ).getDate(),
          ).padStart(2, "0"),
      ),
    };
  }

  const values: number[] = [];
  const labels: string[] = [];

  let cursor = new Date(
    start.getFullYear(),
    start.getMonth(),
    1,
  );

  const finalMonth = new Date(
    end.getFullYear(),
    end.getMonth(),
    1,
  );

  while (
    cursor <= finalMonth
  ) {
    const year =
      cursor.getFullYear();

    const month =
      cursor.getMonth();

    let total = 0;

    for (const order of orders) {
      const createdAt =
        new Date(order.created_at);

      if (
        createdAt.getFullYear() ===
          year &&
        createdAt.getMonth() ===
          month
      ) {
        total += Number(
          order.total_price ?? 0,
        );
      }
    }

    values.push(total);

    labels.push(
      new Intl.DateTimeFormat(
        "en",
        {
          month: "short",
        },
      ).format(cursor),
    );

    cursor = new Date(
      year,
      month + 1,
      1,
    );
  }

  return {
    values,
    labels,
  };
}

export async function GET(
  request: Request,
) {
  const auth =
    await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const url =
      new URL(request.url);

    const requestedPeriod =
      url.searchParams.get(
        "period",
      );

    const period: DashboardPeriod =
      requestedPeriod === "7D" ||
      requestedPeriod === "90D"
        ? requestedPeriod
        : "30D";

    const afterIdParam =
      url.searchParams.get(
        "afterId",
      );

    const afterId =
      afterIdParam &&
      /^\d+$/.test(afterIdParam)
        ? Number(afterIdParam)
        : null;

    const admin =
      createAdminClient();

    const days =
      getPeriodDays(period);

    const now = new Date();

    const currentStart =
      addDays(
        now,
        -days,
      );

    const previousStart =
      addDays(
        now,
        -(days * 2),
      );

    const currentOrdersPromise =
      admin
        .from("orders")
        .select(
          "id, customer_name, phone, total_price, status, created_at, commune, wilaya, delivery_type, tracking_number",
        )
        .gte(
          "created_at",
          currentStart.toISOString(),
        )
        .order("created_at", {
          ascending: true,
        });

    const previousOrdersPromise =
      admin
        .from("orders")
        .select(
          "id, total_price, created_at",
        )
        .gte(
          "created_at",
          previousStart.toISOString(),
        )
        .lt(
          "created_at",
          currentStart.toISOString(),
        );

    const statusesPromise =
      admin
        .from("orders")
        .select("status");

    const productsPromise =
      admin
        .from("products")
        .select(
          "id, name, price, stock, active, image, created_at",
        )
        .order("created_at", {
          ascending: false,
        });

    const recentOrdersPromise =
      admin
        .from("orders")
        .select(
          "id, customer_name, phone, total_price, status, created_at, commune, wilaya, delivery_type, tracking_number",
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(8);

    const newOrdersPromise =
      afterId !== null
        ? admin
            .from("orders")
            .select(
              "id, customer_name, phone, total_price, status, created_at, commune, wilaya, delivery_type, tracking_number",
            )
            .gt(
              "id",
              afterId,
            )
            .order("id", {
              ascending: true,
            })
            .limit(50)
        : Promise.resolve({
            data: [],
            error: null,
          });

    const [
      currentOrdersResult,
      previousOrdersResult,
      statusesResult,
      productsResult,
      recentOrdersResult,
      newOrdersResult,
    ] = await Promise.all([
      currentOrdersPromise,
      previousOrdersPromise,
      statusesPromise,
      productsPromise,
      recentOrdersPromise,
      newOrdersPromise,
    ]);

    const firstError =
      currentOrdersResult.error ??
      previousOrdersResult.error ??
      statusesResult.error ??
      productsResult.error ??
      recentOrdersResult.error ??
      newOrdersResult.error ??
      null;

    if (firstError) {
      console.error(
        "Dashboard Supabase error:",
        firstError,
      );

      return NextResponse.json(
        {
          error:
            "تعذر تحميل بيانات لوحة التحكم من Supabase.",
        },
        {
          status: 500,
        },
      );
    }

    const currentOrders =
      (currentOrdersResult.data ??
        []) as DashboardOrder[];

    const previousOrders =
      (previousOrdersResult.data ??
        []) as Array<{
        id: number;
        total_price:
          | number
          | string
          | null;
        created_at: string;
      }>;

    const statuses =
      (statusesResult.data ??
        []) as Array<{
        status: string | null;
      }>;

    const products =
      (productsResult.data ??
        []) as DashboardProduct[];

    const recentOrders =
      (recentOrdersResult.data ??
        []) as DashboardOrder[];

    const newOrders =
      (newOrdersResult.data ??
        []) as DashboardOrder[];

    const revenue =
      currentOrders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.total_price ?? 0,
          ),
        0,
      );

    const revenuePrevious =
      previousOrders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.total_price ?? 0,
          ),
        0,
      );

    const ordersCount =
      currentOrders.length;

    const previousOrdersCount =
      previousOrders.length;

    const pendingOrders =
      statuses.filter(
        (item) =>
          isPending(item.status),
      ).length;

    const activeProducts =
      products.filter(
        (product) =>
          product.active !== false,
      );

    const lowStockProducts =
      activeProducts
        .filter(
          (product) =>
            isLowStock(
              product.stock,
            ),
        )
        .sort(
          (a, b) =>
            Number(a.stock ?? 0) -
            Number(b.stock ?? 0),
        );

    const outOfStockProducts =
      activeProducts
        .filter(
          (product) =>
            isOutOfStock(
              product.stock,
            ),
        )
        .sort(
          (a, b) =>
            Number(a.stock ?? 0) -
            Number(b.stock ?? 0),
        );

    const lowStock =
      lowStockProducts.length;

    const soldOut =
      outOfStockProducts.length;

    const totalStockUnits =
      activeProducts.reduce(
        (sum, product) =>
          sum +
          Math.max(
            0,
            Number(
              product.stock ?? 0,
            ),
          ),
        0,
      );

    const inventoryValue =
      activeProducts.reduce(
        (sum, product) =>
          sum +
          Number(
            product.price ?? 0,
          ) *
            Math.max(
              0,
              Number(
                product.stock ??
                  0,
              ),
            ),
        0,
      );

    const availableProducts =
      activeProducts.filter(
        (product) =>
          Number(
            product.stock ?? 0,
          ) > 0,
      ).length;

    const inventoryAvailability =
      activeProducts.length ===
      0
        ? 100
        : Math.round(
            (availableProducts /
              activeProducts.length) *
              100,
          );

    const deliveredCount =
      currentOrders.filter(
        (order) =>
          isDelivered(
            order.status,
          ),
      ).length;

    const nonCancelled =
      currentOrders.filter(
        (order) =>
          !isCancelled(
            order.status,
          ),
      ).length;

    const fulfillment =
      nonCancelled === 0
        ? 0
        : Math.round(
            (deliveredCount /
              nonCancelled) *
              100,
          );

    const stockHealth =
      activeProducts.length ===
      0
        ? 100
        : Math.max(
            0,
            Math.round(
              ((activeProducts.length -
                lowStock -
                soldOut) /
                activeProducts.length) *
                100,
            ),
          );

    const shippedOrDelivered =
      currentOrders.filter(
        (order) => {
          const status =
            normalizeStatus(
              order.status,
            );

          return (
            status === "shipped" ||
            status === "delivered" ||
            status === "تم الشحن" ||
            status === "تم التسليم"
          );
        },
      ).length;

    const deliverySuccess =
      shippedOrDelivered === 0
        ? 0
        : Math.round(
            (deliveredCount /
              shippedOrDelivered) *
              100,
          );

    const averageOrderValue =
      ordersCount === 0
        ? 0
        : Math.round(
            revenue /
              ordersCount,
          );

    const attentionOrders =
      currentOrders.filter(
        isAttentionOrder,
      );

    const highValueOrders =
      [...currentOrders]
        .filter(
          (order) =>
            !isCancelled(
              order.status,
            ),
        )
        .sort(
          (a, b) =>
            Number(
              b.total_price ?? 0,
            ) -
            Number(
              a.total_price ?? 0,
            ),
        )
        .slice(0, 5);

    const statusBreakdown =
      currentOrders.reduce(
        (result, order) => {
          const status =
            normalizeStatus(
              order.status,
            );

          let key:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "other" =
            "other";

          if (
            [
              "pending",
              "new",
              "جديد",
            ].includes(status)
          ) {
            key = "pending";
          } else if (
            [
              "confirmed",
              "تم التأكيد",
            ].includes(status)
          ) {
            key = "confirmed";
          } else if (
            [
              "processing",
              "قيد المعالجة",
            ].includes(status)
          ) {
            key = "processing";
          } else if (
            [
              "shipped",
              "تم الشحن",
            ].includes(status)
          ) {
            key = "shipped";
          } else if (
            [
              "delivered",
              "تم التسليم",
            ].includes(status)
          ) {
            key = "delivered";
          } else if (
            [
              "cancelled",
              "canceled",
              "ملغي",
              "ملغى",
            ].includes(status)
          ) {
            key = "cancelled";
          }

          result[key] += 1;

          return result;
        },
        {
          pending: 0,
          confirmed: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
          other: 0,
        },
      );

    const priorityOrders =
      [...attentionOrders]
        .sort(
          (a, b) => {
            const aTime =
              new Date(
                a.created_at,
              ).getTime();

            const bTime =
              new Date(
                b.created_at,
              ).getTime();

            const aValue =
              Number(
                a.total_price ?? 0,
              );

            const bValue =
              Number(
                b.total_price ?? 0,
              );

            const aPriority =
              aValue * 0.35 +
              (Date.now() -
                aTime) /
                3600000;

            const bPriority =
              bValue * 0.35 +
              (Date.now() -
                bTime) /
                3600000;

            return (
              bPriority -
              aPriority
            );
          },
        )
        .slice(0, 6);

    const chart =
      buildChart(
        currentOrders,
        period,
      );

    return NextResponse.json({
      metrics: {
        revenue,
        revenuePrevious,
        revenueChange:
          calculatePercentChange(
            revenue,
            revenuePrevious,
          ),

        orders:
          ordersCount,

        ordersPrevious:
          previousOrdersCount,

        ordersChange:
          calculatePercentChange(
            ordersCount,
            previousOrdersCount,
          ),

        pendingOrders,
        products:
          activeProducts.length,
        lowStock,
        soldOut,

        averageOrderValue,
        attentionOrders:
          attentionOrders.length,
        highValueOrders:
          highValueOrders.length,
      },

      pulse: {
        fulfillment,
        stockHealth,
        deliverySuccess,
      },

      intelligence: {
        attentionOrders:
          attentionOrders.length,

        highValueOrders:
          highValueOrders.length,

        averageOrderValue,

        priorityOrders,

        highValueList:
          highValueOrders,

        statusBreakdown,
      },

      inventory: {
        totalProducts:
          activeProducts.length,

        availableProducts,

        inventoryAvailability,

        totalStockUnits,

        inventoryValue,

        lowStockProducts:
          lowStockProducts.slice(
            0,
            6,
          ),

        outOfStockProducts:
          outOfStockProducts.slice(
            0,
            6,
          ),
      },

      chart: {
        period,
        values:
          chart.values,
        labels:
          chart.labels,
      },

      recentOrders,

      collection:
        activeProducts.slice(
          0,
          6,
        ),

      latestOrderId:
        recentOrders[0]?.id ??
        null,

      latestOrderCreatedAt:
        recentOrders[0]
          ?.created_at ??
        null,

      newOrders,
    });
  } catch (error) {
    console.error(
      "Admin dashboard route error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "حدث خطأ غير متوقع أثناء تحميل لوحة التحكم.",
      },
      {
        status: 500,
      },
    );
  }
}
