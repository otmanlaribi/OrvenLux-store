const BUCKET_NAME = "products";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Invalid image type. Only JPG, JPEG, PNG, and WEBP are allowed.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must be 5MB or less.";
  }

  return null;
}

export function getStoragePathFromUrl(imageUrl: string) {
  const publicPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`;

  if (!imageUrl.startsWith(publicPrefix)) {
    return null;
  }

  const path = imageUrl.substring(publicPrefix.length);
  return decodeURIComponent(path.split("?")[0]);
}
