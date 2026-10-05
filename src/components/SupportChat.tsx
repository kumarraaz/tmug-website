"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig, whatsappLink } from "@/config/site";
import { PRODUCTS } from "@/data/products";
import { formatINR } from "@/lib/format";
import { IconChat, IconClose, IconWhatsApp } from "./icons";

interface Message {
  from: "bot" | "user";
  text: string;
}

const QUICK_REPLIES = ["Our teas", "How to brew", "Help me choose", "Track my order"];

const WHATSAPP_ESCALATION =
  "I can’t answer that one — but our team replies fast on WhatsApp. Tap below to continue there.";

/** Lightweight FAQ support bot (rule-based, no AI API). Honest about what it is. */
export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi! I’m the TMUG helper 👋 Ask me about our teas, brewing, or your order. (I’m a simple FAQ bot, not AI.)",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const reply = (text: string): string => {
    const q = text.toLowerCase();

    if (/(butterfly|blue)/.test(q))
      return "Butterfly Pea Flower Tea brews a natural blue (add lemon and it turns violet!). Caffeine-free, in a 50g jar or 100g pouch.";
    if (/chamomile/.test(q))
      return "Chamomile Flower Tea is whole dried babune ke phool — soft, floral, caffeine-free. Lovely for slow evenings. 50g jar or 100g pouch.";
    if (/hibiscus/.test(q))
      return "Hibiscus Flower Tea is tangy and ruby-red — amazing iced. Caffeine-free. 50g jar or 100g pouch.";
    if (/(lemongrass|nimbu)/.test(q))
      return "Lemongrass Tea is bright and citrusy — a light everyday caffeine-free cup. 50g jar or 100g pouch.";
    if (/(darjeeling|green)/.test(q))
      return "Our Darjeeling Green Tea is long loose-leaf in a 100g jar — delicate and floral. Brew at 80–85°C for 2–3 minutes.";
    if (/(premium|gold|ctc|chai|kadak)/.test(q))
      return "For kadak chai: TMUG Premium Tea is the everyday CTC workhorse, and TMUG Gold Tea is the bolder Assam-style blend. Both in 250g & 500g pouches.";
    if (/(tea|product|flavour|flavor|range|menu)/.test(q))
      return "We have 7 teas: Butterfly Pea, Chamomile, Hibiscus, Lemongrass (all caffeine-free herbals), Darjeeling Green Tea, plus Premium & Gold CTC chai. Scroll to “Shop All Teas” to see every pack.";
    if (/(brew|how.*(make|prepare)|steep|brewing)/.test(q))
      return "Easy rule: 1 tsp per 200ml cup. Herbals — 85–90°C, 3–5 min. Darjeeling green — 80–85°C, 2–3 min. CTC chai — boil with water, add milk, simmer 2–3 min.";
    if (/(choose|which|suggest|recommend|best)/.test(q))
      return "Quick guide: want colourful & fun? Butterfly Pea. Tangy iced? Hibiscus. Calm evenings? Chamomile. Fresh daily? Lemongrass or Darjeeling Green. Strong doodh chai? Premium or Gold.";
    if (/(order|cart|buy|payment|checkout)/.test(q))
      return "Add teas to your cart, then tap “Order on WhatsApp” — your order details go straight to our team. Online checkout is coming soon.";
    if (/(ship|deliver|dispatch)/.test(q))
      return "We ship across India. Shipping is calculated when you confirm your order on WhatsApp.";
    if (/(price|cost|kitna|discount|offer|promo|coupon)/.test(q)) {
      const lines = PRODUCTS.map(
        (p) => `${p.name}: from ${formatINR(Math.min(...p.variants.map((v) => v.price)))}`,
      );
      return (
        `Our prices: ${lines.join(" • ")}. ` +
        `Festive offer: ${siteConfig.promo.discountPercent}% off with code ${siteConfig.promo.code} — apply it in your cart.`
      );
    }
    if (/(caffeine)/.test(q))
      return "Butterfly pea, chamomile, hibiscus and lemongrass are caffeine-free herbals. Darjeeling green tea and our CTC chai contain natural caffeine.";
    if (/(hi|hello|hey|namaste)/.test(q))
      return "Hello! 😊 What can I help with — our teas, brewing, or an order?";
    if (/(thank|shukriya)/.test(q)) return "Anytime! Happy sipping. 🍵";
    return "";
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const answer = reply(text);
    setMessages((m) => [
      ...m,
      { from: "user", text },
      answer
        ? { from: "bot", text: answer }
        : { from: "bot", text: WHATSAPP_ESCALATION },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        aria-expanded={open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-4 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-tea-green text-cream shadow-[0_12px_30px_-8px_rgba(28,68,23,0.7)] sm:right-6"
      >
        {open ? <IconClose className="h-6 w-6" /> : <IconChat className="h-6 w-6" />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-[88px] right-4 z-40 flex h-[440px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:right-6"
            role="dialog"
            aria-label="TMUG support chat"
          >
            <div className="bg-tea-green px-5 py-4 text-cream">
              <p className="font-display text-lg font-extrabold">TMUG Support</p>
              <p className="text-xs text-cream/70">FAQ helper • typically replies instantly</p>
            </div>

            <div className="nice-scroll flex-1 space-y-3 overflow-y-auto bg-cream/60 px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-md bg-tea-green text-cream"
                        : "rounded-bl-md bg-white text-ink shadow-sm"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-ink/10 bg-white px-3 pb-2 pt-2">
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="whitespace-nowrap rounded-full border border-tea-green/25 px-3.5 py-1.5 text-xs font-bold text-tea-green transition-colors hover:bg-tea-green/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 pb-1"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  aria-label="Type your question"
                  className="min-w-0 flex-1 rounded-full border border-ink/15 bg-cream px-4 py-2.5 text-sm outline-none focus:border-tea-green"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="shrink-0 rounded-full bg-tea-green px-4 py-2.5 text-sm font-extrabold text-cream transition-transform active:scale-95"
                >
                  Send
                </button>
              </form>
              <a
                href={whatsappLink("Hi TMUG! I need help with my order.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-[#1d9e52]"
              >
                <IconWhatsApp className="h-3.5 w-3.5" /> Need more help? Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
