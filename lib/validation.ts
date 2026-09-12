import { z } from "zod";

const text = (max: number) =>
  z.string().trim().min(1).max(max);

const productImageUrl = z
  .string()
  .url()
  .max(2_000)
  .refine((value) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    return Boolean(
      baseUrl &&
        value.startsWith(
          `${baseUrl}/storage/v1/object/public/products/`,
        ),
    );
  }, "Image must be an uploaded product image");

const productImageSchema = z
  .object({
    id: z.number().int().positive().optional(),

    image: productImageUrl,

    is_primary: z.boolean().optional(),

    sort_order: z
      .number()
      .int()
      .min(0)
      .optional(),
  })
  .strict();

export const productSchema = z
  .object({
    name: text(160),

    description:
      z.string().trim().max(4_000).default(""),

    price: z
      .number()
      .finite()
      .min(0)
      .max(10_000_000),

    stock: z
      .number()
      .int()
      .min(0)
      .max(1_000_000),

    image:
      productImageUrl.or(z.literal("")),

    active: z.boolean(),
  })
  .strict();

export const productPatchSchema =
  productSchema
    .extend({
      images: z
        .array(productImageSchema)
        .max(10)
        .optional(),
    })
    .partial()
    .strict()
    .refine(
      (value) =>
        Object.keys(value).length > 0,
      "At least one field is required",
    );

export const orderSchema = z
  .object({
    productId:
      z.number().int().positive(),

    customerName:
      text(160),

    phone:
      text(32).regex(
        /^[+0-9()\-\s]+$/,
      ),

    state:
      text(120),

    commune:
      z
        .string()
        .trim()
        .max(160)
        .optional(),

    deliveryType:
      z.enum(["home", "office"]),

    address:
      z
        .string()
        .trim()
        .max(500)
        .optional(),

    officeName:
      z
        .string()
        .trim()
        .max(160)
        .optional(),

    captchaToken:
      z
        .string()
        .max(4_096)
        .optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      value.deliveryType === "home" &&
      !value.commune
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["commune"],
        message:
          "Commune is required for home delivery",
      });
    }

    if (
      value.deliveryType === "home" &&
      !value.address
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message:
          "Address is required for home delivery",
      });
    }

    if (
      value.deliveryType === "office" &&
      !value.officeName
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["officeName"],
        message:
          "Office is required for office delivery",
      });
    }
  });

export const ecotrackSchema =
  z
    .object({
      orderId:
        z.number().int().positive(),
    })
    .strict();

export const orderStatusSchema =
  z
    .object({
      status: z.enum([
        "جديد",
        "قيد المعالجة",
        "تم الشحن",
        "تم التسليم",
        "ملغي",
      ]),
    })
    .strict();

export function validationError() {
  return {
    error: "Invalid request payload",
  };
}