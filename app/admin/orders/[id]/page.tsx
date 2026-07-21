import { notFound } from "next/navigation";
import StatusBadge from "@/components/shared/StatusBadge";
import OrderActions from "@/components/orders/OrderActions";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Order #{order.id}
          </h1>

          <p className="text-slate-500">
            Created at {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <StatusBadge status={order.status} />

      </div>

      <OrderActions orderId={order.id} status={order.status} sentToEcotrack={order.sent_to_ecotrack} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="rounded-xl border bg-white p-6">

          <h2 className="text-lg font-semibold mb-4">
            Customer
          </h2>

          <div className="space-y-3">

            <p><strong>Name:</strong> {order.customer_name}</p>

            <p><strong>Phone:</strong> {order.phone}</p>

            <p><strong>Wilaya:</strong> {order.wilaya}</p>

            <p><strong>Commune:</strong> {order.commune}</p>

            <p><strong>Address:</strong> {order.address}</p>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <h2 className="text-lg font-semibold mb-4">
            Shipping
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Delivery:</strong> {order.delivery_type}
            </p>

            <p>
              <strong>Tracking:</strong>{" "}
              {order.tracking_number ?? "-"}
            </p>

            <p>
              <strong>Total:</strong>{" "}
              {order.total_price} DA
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
