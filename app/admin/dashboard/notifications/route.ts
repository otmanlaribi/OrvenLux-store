import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type NotificationOrder = {
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

    /*
     * Initial baseline.
     *
     * We only return the latest order ID.
     * Existing orders are NOT notifications.
     */
    if (afterId === null) {
      const { data, error } =
        await admin
          .from("orders")
          .select(
            "id, customer_name, phone, total_price, status, created_at, commune, wilaya, delivery_type, tracking_number",
          )
          .order("id", {
            ascending: false,
          })
          .limit(1);

      if (error) {
        console.error(
          "Notification baseline error:",
          error,
        );

        return NextResponse.json(
          {
            error:
              "تعذر تحديد آخر طلب.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json({
        latestOrderId:
          data?.[0]?.id ?? null,
        newOrders: [],
      });
    }

    /*
     * Only return orders created after the
     * last known order ID.
     */
    const { data, error } =
      await admin
        .from("orders")
        .select(
          "id, customer_name, phone, total_price, status, created_at, commune, wilaya, delivery_type, tracking_number",
        )
        .gt("id", afterId)
        .order("id", {
          ascending: true,
        })
        .limit(50);

    if (error) {
      console.error(
        "Notification polling error:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "تعذر فحص الطلبات الجديدة.",
        },
        {
          status: 500,
        },
      );
    }

    const newOrders =
      (data ??
        []) as NotificationOrder[];

    const latestOrderId =
      newOrders.length > 0
        ? newOrders[
            newOrders.length - 1
          ].id
        : afterId;

    return NextResponse.json({
      latestOrderId,
      newOrders,
    });
  } catch (error) {
    console.error(
      "Notification route error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء فحص الإشعارات.",
      },
      {
        status: 500,
      },
    );
  }
}