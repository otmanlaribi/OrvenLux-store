import { supabase } from "./supabase";

export async function uploadProductImage(file: File) {
  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    throw error;
  }

  const { data: publicData } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return publicData.publicUrl;
}