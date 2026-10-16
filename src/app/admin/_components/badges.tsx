import { FULFILMENT_LABEL, PAYMENT_LABEL, type FulfilmentStatus, type PaymentStatus } from "@/server/order-core";
import { Badge } from "./ui";

const PAYMENT_TONE: Record<PaymentStatus, "warn" | "good" | "info" | "neutral"> = {
  pending: "warn",
  paid: "good",
  partially_refunded: "info",
  refunded: "neutral",
};

const FULFILMENT_TONE: Record<FulfilmentStatus, "warn" | "good" | "info" | "bad" | "neutral"> = {
  new: "info",
  processing: "info",
  shipped: "warn",
  delivered: "good",
  cancelled: "bad",
};

/** Order taken with Razorpay test keys: no real money, never counted in totals or reports. */
export const TestBadge = () => (
  <span title="Placed with Razorpay test keys — no real money. Not counted in sales or reports." className="inline-flex items-center rounded-full bg-deep-plum px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
    Test
  </span>
);

export const PaymentBadge = ({ status }: { status: PaymentStatus }) => <Badge tone={PAYMENT_TONE[status]}>{PAYMENT_LABEL[status]}</Badge>;
export const FulfilmentBadge = ({ status }: { status: FulfilmentStatus }) => <Badge tone={FULFILMENT_TONE[status]}>{FULFILMENT_LABEL[status]}</Badge>;
