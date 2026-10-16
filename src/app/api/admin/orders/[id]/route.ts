import type { NextRequest } from "next/server";
import { z } from "zod";
import { rupeesToPaise } from "@/lib/money";
import { adminGuard } from "@/server/auth";
import { revalidateCatalog } from "@/server/catalog";
import { errorResponse, json, jsonError, parseBody } from "@/server/http";
import { cancelOrder, recordRefund, updateFulfilmentStatus, updateOrderMeta } from "@/server/order-actions";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), "Invalid date");

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("status"),
    status: z.enum(["new", "processing", "shipped", "delivered"]),
    trackingReference: z.string().trim().max(120).nullish(),
  }),
  z.object({ action: z.literal("cancel"), reason: z.string().trim().max(300).default("") }),
  z.object({
    action: z.literal("meta"),
    invoiceNumber: z.string().trim().max(40).regex(/^[A-Za-z0-9][A-Za-z0-9/\-_. ]*$/, "Use letters, numbers and / - _ .").or(z.literal("")).nullish(),
    invoiceDate: dateString.or(z.literal("")).nullish(),
    adminNote: z.string().trim().max(2000).optional(),
  }),
  z.object({
    action: z.literal("refund"),
    amount: z.number().positive("Enter an amount").max(10_000_000).refine((n) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6, "At most 2 decimal places"),
    reason: z.string().trim().min(2, "Give a short reason").max(300),
    reference: z.string().trim().max(80).nullish(),
    refundedOn: dateString.or(z.literal("")).nullish(),
  }),
]);

/** Admin actions on one order (status, cancel, invoice / notes, record refund). */
export async function POST(req: NextRequest, ctx: RouteContext<"/api/admin/orders/[id]">) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const parsed = await parseBody(req, bodySchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    const { id } = await ctx.params;
    switch (body.action) {
      case "status":
        await updateFulfilmentStatus(id, body.status, body.trackingReference === undefined ? undefined : body.trackingReference);
        return json({ ok: true });
      case "cancel": {
        const result = await cancelOrder(id, body.reason);
        if (result.stockChanged) revalidateCatalog();
        return json({ ok: true, refundRequired: result.refundRequired });
      }
      case "meta":
        await updateOrderMeta(id, {
          invoiceNumber: body.invoiceNumber === undefined ? undefined : body.invoiceNumber || null,
          invoiceDate: body.invoiceDate === undefined ? undefined : body.invoiceDate || null,
          adminNote: body.adminNote,
        });
        return json({ ok: true });
      case "refund":
        await recordRefund(id, {
          amountPaise: rupeesToPaise(body.amount),
          reason: body.reason,
          reference: body.reference || null,
          refundedOn: body.refundedOn || null,
        });
        return json({ ok: true });
      default:
        return jsonError("Unknown action.", 400);
    }
  } catch (err) {
    return errorResponse(err);
  }
}
