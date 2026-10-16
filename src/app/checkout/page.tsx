import type { Metadata } from "next";
import CheckoutClient from "@/components/CheckoutClient";
import PageShell from "@/components/PageShell";
import { isDatabaseConfigured } from "@/server/db";
import { isPaymentConfigured } from "@/server/razorpay";

export const dynamic = "force-dynamic"; // read the payment configuration on every request

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  // Online checkout is offered only when BOTH the database and the payment gateway are configured.
  const enabled = isDatabaseConfigured() && isPaymentConfigured();
  return (
    <PageShell>
      <CheckoutClient enabled={enabled} />
    </PageShell>
  );
}
