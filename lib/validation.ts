import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const productImageUrl = z.string().url().max(2_000).refine((value) => {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(baseUrl && value.startsWith(`${baseUrl}/storage/v1/object/public/products/products/`));
}, "Image must be an uploaded product image");

export const productSchema = z.object({
  name: text(160),
  description: z.string().trim().max(4_000).default(""),
  price: z.number().finite().min(0).max(10_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  image: productImageUrl.or(z.literal("")),
  active: z.boolean(),
}).strict();

export const productPatchSchema = productSchema.partial().strict().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required"
);

export const orderSchema = z.object({
  productId: z.number().int().positive(),
  customerName: text(160),
  phone: text(32).regex(/^[+0-9()\-\s]+$/),
  state: text(120),
  commune: text(160),
  deliveryType: z.enum(["home", "office"]),
  address: z.string().trim().max(500).optional(),
  officeName: z.string().trim().max(160).optional(),
  captchaToken: z.string().max(4_096).optional(),
}).strict().superRefine((value, ctx) => {
  if (value.deliveryType === "home" && !value.address) ctx.addIssue({ code: "custom", path: ["address"], message: "Address is required" });
  if (value.deliveryType === "office" && !value.officeName) ctx.addIssue({ code: "custom", path: ["officeName"], message: "Office is required" });
});

export const ecotrackSchema = z.object({ orderId: z.number().int().positive() }).strict();

const legacyOrderStatusSchema = z.object({
  status: z.enum(["Ø¬Ø¯ÙŠØ¯", "Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©", "ØªÙ… Ø§Ù„Ø´Ø­Ù†", "ØªÙ… Ø§Ù„ØªØ³Ù„Ù…", "Ù…Ù„ØºÙŠ", "EnvoyÃ©"]),
}).strict();

void legacyOrderStatusSchema;

export const orderStatusSchema = z.object({
  status: z.enum(["\u062c\u062f\u064a\u062f", "\u0642\u064a\u062f \u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629", "\u062a\u0645 \u0627\u0644\u0634\u062d\u0646", "\u062a\u0645 \u0627\u0644\u062a\u0633\u0644\u064a\u0645", "\u0645\u0644\u063a\u064a"]),
}).strict();

export function validationError() {
  return { error: "Invalid request payload" };
}
