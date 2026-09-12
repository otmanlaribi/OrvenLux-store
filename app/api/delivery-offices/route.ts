import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DeliveryOffice = {
  id: number;
  state: string;
  office_name: string;
  address: string | null;
  commune: string | null;
};

export async function GET() {
  try {
    const admin =
      createAdminClient();

    const {
      data,
      error,
    } = await admin
      .from("delivery_offices")
      .select(
        "id, state, office_name, address, commune",
      )
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "DELIVERY OFFICES ERROR:",
        {
          message:
            error.message,
          details:
            error.details,
          hint: error.hint,
          code: error.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to load delivery offices",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        offices:
          (data ??
            []) as DeliveryOffice[],
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "DELIVERY OFFICES ROUTE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}