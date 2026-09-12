import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersStats from "@/components/orders/OrdersStats";
import OrdersTable from "@/components/orders/OrdersTable";
import OrdersToolbar from "@/components/orders/OrdersToolbar";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 50;

type Props = {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};

export default async function OrdersPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";

  const rawPage = Number(
    params.page ?? "1"
  );

  const page =
    Number.isSafeInteger(rawPage) &&
    rawPage > 0
      ? rawPage
      : 1;

  const from =
    (page - 1) * PAGE_SIZE;

  const supabase =
    await createClient();

  let ordersQuery = supabase
    .from("orders")
    .select(
      `
        id,
        customer_name,
        phone,
        total_price,
        status,
        tracking_number,
        created_at,
        delivery_type,
        wilaya,
        commune
      `,
      {
        count: "exact",
      }
    );

  // =====================================================
  // Search
  // =====================================================

  if (query) {
    const numericId =
      Number(query);

    if (
      Number.isInteger(
        numericId
      )
    ) {
      ordersQuery =
        ordersQuery.or(
          `id.eq.${numericId},customer_name.ilike.%${query}%,phone.ilike.%${query}%`
        );
    } else {
      ordersQuery =
        ordersQuery.or(
          `customer_name.ilike.%${query}%,phone.ilike.%${query}%`
        );
    }
  }

  // =====================================================
  // Orders + Health metrics
  // =====================================================

  const [
    {
      data: orders,
      count,
      error,
    },
    {
      count: totalOrders,
    },
    {
      count: deliveredOrders,
    },
    {
      count: shippedOrders,
    },
    {
      count: pendingOrders,
    },
  ] = await Promise.all([
    ordersQuery
      .order("created_at", {
        ascending: false,
      })
      .range(
        from,
        from + PAGE_SIZE - 1
      ),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "تم التسليم"
      ),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "تم الشحن"
      ),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "جديد"
      ),
  ]);

  if (error) {
    throw new Error(
      "Unable to load orders"
    );
  }

  const pageCount =
    Math.max(
      1,
      Math.ceil(
        (count ?? 0) /
          PAGE_SIZE
      )
    );

  return (
    <main
      dir="rtl"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#0A0A0A]
        text-[#F7F5F0]
      "
    >
      {/* =================================================
          Ambient Luxury Atmosphere
          ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-[-180px]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.018]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-[-140px]
            top-[320px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#C9A227]/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-180px]
            left-[-140px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-white/[0.012]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.16]
            [background-image:linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)]
            [background-size:80px_80px]
          "
        />
      </div>

      {/* =================================================
          Main Content
          ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1700px]
          px-4
          py-5
          sm:px-6
          sm:py-7
          lg:px-8
          lg:py-8
          xl:px-10
        "
      >
        {/* =================================================
            Command Hero
            ================================================= */}

        <section
          aria-labelledby="orders-command-title"
          className="
            relative
            mb-8
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.08]
            bg-[#111111]
            shadow-[0_24px_70px_rgba(0,0,0,0.28)]
            sm:rounded-[32px]
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                -left-16
                top-1/2
                h-72
                w-72
                -translate-y-1/2
                rounded-full
                bg-white/[0.025]
                blur-3xl
              "
            />

            <div
              className="
                absolute
                right-[-90px]
                top-[-100px]
                h-80
                w-80
                rounded-full
                bg-[#C9A227]/[0.07]
                blur-3xl
              "
            />

            <div
              className="
                absolute
                inset-y-0
                right-1/3
                w-px
                bg-gradient-to-b
                from-transparent
                via-white/[0.08]
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[#C9A227]/30
                to-transparent
              "
            />
          </div>

          <div className="relative z-10">
            <OrdersHeader />
          </div>
        </section>

        {/* =================================================
            Order Health
            ================================================= */}

        <section
          aria-labelledby="orders-health-title"
          className="mb-8"
        >
          <div
            className="
              mb-3
              flex
              items-end
              justify-between
              gap-4
              px-1
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.28em]
                  text-white/40
                "
              >
                Operational Intelligence
              </p>

              <h2
                id="orders-health-title"
                className="
                  mt-1
                  font-serif
                  text-xl
                  text-[#F7F5F0]
                  sm:text-2xl
                "
              >
                Order Health
              </h2>
            </div>

            <div
              aria-hidden="true"
              className="
                hidden
                h-px
                flex-1
                bg-gradient-to-l
                from-transparent
                via-white/10
                to-transparent
                sm:block
              "
            />
          </div>

          <div
            className="
              relative
              rounded-[24px]
              border
              border-white/[0.08]
              bg-[#111111]
              p-2
              shadow-[0_18px_50px_rgba(0,0,0,0.22)]
              sm:rounded-[28px]
              sm:p-3
            "
          >
            <OrdersStats
              totalOrders={
                totalOrders ?? 0
              }
              pendingOrders={
                pendingOrders ?? 0
              }
              shippedOrders={
                shippedOrders ?? 0
              }
              deliveredOrders={
                deliveredOrders ?? 0
              }
            />
          </div>
        </section>

        {/* =================================================
            Command Controls
            ================================================= */}

        <section
          aria-labelledby="orders-control-title"
          className="mb-8"
        >
          <div
            className="
              mb-3
              flex
              items-end
              justify-between
              gap-4
              px-1
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.28em]
                  text-white/40
                "
              >
                Precision Controls
              </p>

              <h2
                id="orders-control-title"
                className="
                  mt-1
                  font-serif
                  text-xl
                  text-[#F7F5F0]
                  sm:text-2xl
                "
              >
                Order Control
              </h2>
            </div>

            <span
              className="
                hidden
                rounded-full
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-3
                py-1.5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-white/50
                sm:inline-flex
              "
            >
              Command Layer
            </span>
          </div>

          <div
            className="
              rounded-[24px]
              border
              border-white/[0.08]
              bg-[#111111]
              p-2
              shadow-[0_18px_50px_rgba(0,0,0,0.24)]
              sm:rounded-[28px]
              sm:p-3
            "
          >
            <OrdersToolbar
              totalOrders={
                totalOrders ?? 0
              }
            />
          </div>
        </section>

        {/* =================================================
            Order Command Ledger
            ================================================= */}

        <section
          aria-labelledby="orders-ledger-title"
          className="pb-8"
        >
          <div
            className="
              mb-3
              flex
              flex-col
              gap-3
              px-1
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.28em]
                  text-white/40
                "
              >
                Transaction Registry
              </p>

              <h2
                id="orders-ledger-title"
                className="
                  mt-1
                  font-serif
                  text-2xl
                  text-[#F7F5F0]
                  sm:text-3xl
                "
              >
                Order Command Ledger
              </h2>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                text-[11px]
                text-white/40
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#C9A227]
                  shadow-[0_0_12px_rgba(201,162,39,0.35)]
                "
              />

              <span>
                {totalOrders ?? 0} total orders
              </span>
            </div>
          </div>

          <div
            className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-white/[0.08]
              bg-[#0F0F0F]
              shadow-[0_28px_80px_rgba(0,0,0,0.32)]
              sm:rounded-[30px]
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-20
                bg-gradient-to-b
                from-[#C9A227]/[0.045]
                to-transparent
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                bottom-0
                left-1/4
                h-40
                w-40
                rounded-full
                bg-white/[0.018]
                blur-3xl
              "
            />

            <div className="relative z-10">
              <OrdersTable
                initialOrders={
                  orders ?? []
                }
                page={page}
                pageCount={
                  pageCount
                }
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}