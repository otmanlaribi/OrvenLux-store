import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { requireAdmin, writeAuditLog } from "@/lib/security";

const deleteSchema = z.object({ paths: z.array(z.string().min(1).max(512)).min(1).max(10) }).strict();
const validPath = /^products\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/;

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const parsed = deleteSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid image paths" }, { status: 400 });
    const paths = parsed.data.paths;

    if (!paths.every((path) => validPath.test(path))) {
      return NextResponse.json({ error: "Invalid image paths" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.storage.from("products").remove(paths);

    if (error) {
      return NextResponse.json({ error: "Unable to delete image" }, { status: 400 });
    }

    await writeAuditLog({ actorId: auth.userId, action: "storage.delete", targetType: "storage_object", request, metadata: { count: paths.length } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
