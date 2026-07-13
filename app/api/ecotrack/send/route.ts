import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        products (
          name
        )
      `
      )
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    // البحث عن اسم البلدية بالفرنسية
    const { data: city } = await supabase
      .from("algeria_cities")
      .select("commune_name_ascii")
      .eq("commune_name", order.commune)
      .single();

    const communeAscii =
      city?.commune_name_ascii ?? order.commune;

    const params = {
      reference: String(order.id),
      nom_client: order.customer_name ?? "",
      telephone: order.phone ?? "",
      adresse: order.address ?? "",
      commune: communeAscii,
      code_wilaya: String(order.wilaya ?? ""),
      montant: String(order.total_price ?? 0),
      remarque: "",
      produit: order.products?.name ?? "",
      stock: "0",
      quantite: String(order.quantity ?? 1),
      boutique: "Orven Lux",
      type: "1",
      stop_desk: order.delivery_type === "office" ? "1" : "0",
      weight: "1",
      fragile: "0",
    };

    console.log("PARAMS:", params);

    const url =
      "https://platform.dhd-dz.com/api/v1/create/order?" +
      new URLSearchParams(params).toString();

    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ECOTRACK_API_TOKEN}`,
        Accept: "application/json",
      },
    });

    const text = await response.text();

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", text);

    let result: any = {};

    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    if (response.ok) {
      await supabase
        .from("orders")
        .update({
          sent_to_ecotrack: true,
          tracking_number:
            result.tracking ??
            result.tracking_number ??
            null,
          ecotrack_reference:
            result.reference ??
            result.id ??
            null,
          status: "Envoyé",
          ecotrack_response: result,
          ecotrack_error: null,
        })
        .eq("id", order.id);
    } else {
      await supabase
        .from("orders")
        .update({
          ecotrack_error: text,
        })
        .eq("id", order.id);
    }

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "خطأ داخلي",
      },
      {
        status: 500,
      }
    );
  }
}