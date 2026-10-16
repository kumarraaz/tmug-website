"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShop } from "@/lib/store";

/**
 * Pending order: re-check the server every few seconds for up to ~3 minutes (the payment
 * webhook may land after the customer returns). Paid order: empty the cart that was used
 * to place THIS order (matched by the token remembered at checkout).
 */
export default function OrderStatusWatcher({ token, paid, pending }: { token: string; paid: boolean; pending: boolean }) {
  const router = useRouter();
  const { clearCart } = useShop();

  useEffect(() => {
    if (!pending) return;
    let ticks = 0;
    const id = setInterval(() => {
      ticks += 1;
      router.refresh();
      if (ticks >= 45) clearInterval(id);
    }, 4000);
    return () => clearInterval(id);
  }, [pending, router]);

  useEffect(() => {
    if (!paid) return;
    try {
      if (sessionStorage.getItem("tmug-last-order") === token) {
        clearCart();
        sessionStorage.removeItem("tmug-last-order");
      }
    } catch {
      /* storage unavailable */
    }
  }, [paid, token, clearCart]);

  return null;
}
