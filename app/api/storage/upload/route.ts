import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, writeAuditLog } from "@/lib/security";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const imageSignatures = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
} as const;
const extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;

function hasValidSignature(file: File, bytes: Uint8Array) {
  const signatures = imageSignatures[file.type as keyof typeof imageSignatures];
  if (!signatures || bytes.length < signatures[0].length) return false;
  if (file.type === "image/webp") {
    return signatures[0].every((value, index) => bytes[index] === value) &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return signatures[0].every((value, index) => bytes[index] === value);
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  if (!(file.type in extensions) || file.size === 0 || file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidSignature(file, bytes)) {
    return NextResponse.json({ error: "Invalid image content" }, { status: 400 });
  }

  const extension = extensions[file.type as keyof typeof extensions];
  const filePath = `products/${auth.userId}/${crypto.randomUUID()}.${extension}`;
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from("products").upload(filePath, bytes, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    return NextResponse.json({ error: "Unable to upload image" }, { status: 400 });
  }

  const { data: publicUrlData } = supabase.storage.from("products").getPublicUrl(filePath);

  await writeAuditLog({ actorId: auth.userId, action: "storage.upload", targetType: "storage_object", targetId: data?.path, request });
  return NextResponse.json({ path: data?.path, publicUrl: publicUrlData.publicUrl });
}
