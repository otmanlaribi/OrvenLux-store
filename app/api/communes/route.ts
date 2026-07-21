import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { isRateLimited } from "@/lib/security";

export async function GET(req: Request) {
  if (await isRateLimited("communes", req, 120, 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const { searchParams } = new URL(req.url);

  const wilaya = z.coerce.number().int().min(1).max(58).safeParse(searchParams.get("wilaya"));

  if (!wilaya.success) {
    return NextResponse.json([]);
  }

  const { data, error } = await createAdminClient()
    .from("algeria_cities")
    .select("commune_name, commune_name_ascii")
    .eq("wilaya_code", wilaya.data)
    .order("commune_name_ascii");

  if (error) {
    return NextResponse.json(
      { error: "Unable to load communes" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
