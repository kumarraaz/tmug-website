import { z } from "zod";
import { INDIAN_STATE_NAMES, normalizeIndianMobile } from "./india";

/** Checkout input validation, shared by the checkout form (types) and the API (authoritative). */

const mobile = z
  .string()
  .trim()
  .refine((v) => normalizeIndianMobile(v) !== null, "Enter a valid 10-digit Indian mobile number")
  .transform((v) => normalizeIndianMobile(v) as string);

const state = z
  .string()
  .trim()
  .refine((v) => INDIAN_STATE_NAMES.includes(v), "Choose your state");

export const addressSchema = z.object({
  name: z.string().trim().min(2, "Enter the full name").max(80),
  phone: mobile,
  line1: z.string().trim().min(3, "Enter the address").max(120),
  line2: z.string().trim().max(120).default(""),
  city: z.string().trim().min(2, "Enter the city").max(60),
  state,
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code"),
});

export const cartLineSchema = z.object({
  variantId: z.string().trim().min(1).max(120),
  qty: z.number().int().min(1, "Quantity must be at least 1").max(50, "Maximum 50 per item"),
});

export const quoteSchema = z.object({
  lines: z.array(cartLineSchema).min(1, "Your cart is empty").max(30),
  couponCode: z.string().trim().max(40).nullish(),
  /** Delivery state — needed only to split GST into CGST+SGST vs IGST. */
  state: z.string().trim().max(60).nullish(),
});

export const checkoutSchema = z
  .object({
    lines: z.array(cartLineSchema).min(1, "Your cart is empty").max(30),
    couponCode: z.string().trim().max(40).nullish(),
    customer: z.object({
      name: z.string().trim().min(2, "Enter your name").max(80),
      email: z.string().trim().toLowerCase().max(120).pipe(z.email("Enter a valid email address")),
      phone: mobile,
    }),
    shipping: addressSchema,
    billingSameAsShipping: z.boolean().default(true),
    billing: addressSchema.optional(),
    note: z.string().trim().max(500).default(""),
    /** The total the shopper saw (paise). If prices changed meanwhile the server refuses and returns a fresh quote. */
    expectedTotalPaise: z.number().int().min(0).optional(),
  })
  .superRefine((v, ctx) => {
    if (!v.billingSameAsShipping && !v.billing) {
      ctx.addIssue({ code: "custom", path: ["billing"], message: "Enter the billing address" });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutInputRaw = z.input<typeof checkoutSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
