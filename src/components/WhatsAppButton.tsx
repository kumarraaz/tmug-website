"use client";

import { motion } from "framer-motion";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconWhatsApp } from "./icons";

/** Floating WhatsApp button — sits above the support chat button. */
export default function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with TMUG on WhatsApp (${siteConfig.whatsapp.display})`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-24 right-4 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] sm:right-6"
    >
      <IconWhatsApp className="h-7 w-7" />
      <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#25D366]" />
      </span>
    </motion.a>
  );
}
