"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig, whatsappLink } from "@/config/site";
import { IconWhatsApp, IconArrowRight } from "@/components/icons";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";

/** Contact form — composes a WhatsApp message (no fake backend). */
function ContactForm() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("A question about an order");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) {
      setError("Please write a short message so we know how to help.");
      return;
    }
    setError("");
    const text = [
      "Hello TMUG,",
      "",
      `Name: ${name.trim() || "(not given)"}`,
      `Topic: ${topic}`,
      "",
      message.trim(),
    ].join("\n");
    window.open(whatsappLink(text), "_blank", "noopener");
  };

  const inputCls =
    "w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-tea-green";

  return (
    <form onSubmit={submit} className="rounded-[1.75rem] border border-ink/8 bg-white p-6 sm:p-8" noValidate={false}>
      <h2 className="font-display text-xl font-extrabold text-tea-ink">Send us a message</h2>
      <p className="mt-1 text-sm text-ink-soft">
        This opens WhatsApp with your message ready to send — the fastest way to reach us.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-[13px] font-bold text-ink">
            Your name
          </label>
          <input
            id="cf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className={inputCls}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="cf-topic" className="mb-1.5 block text-[13px] font-bold text-ink">
            Topic
          </label>
          <select id="cf-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls}>
            <option>A question about an order</option>
            <option>Bulk / wholesale enquiry</option>
            <option>Product question</option>
            <option>Feedback</option>
            <option>Something else</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="cf-msg" className="mb-1.5 block text-[13px] font-bold text-ink">
          Message
        </label>
        <textarea
          id="cf-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us how we can help…"
          rows={4}
          required
          minLength={5}
          className={`${inputCls} resize-y`}
        />
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-[15px] font-extrabold text-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] sm:w-auto"
      >
        <IconWhatsApp className="h-5 w-5" /> Send via WhatsApp
      </button>
    </form>
  );
}

const CARDS = [
  {
    title: "WhatsApp support",
    copy: "Fastest for orders, delivery and brew help.",
    cta: siteConfig.whatsapp.display,
    href: whatsappLink(),
    accent: "#25D366",
    icon: <IconWhatsApp className="h-5 w-5" />,
  },
  {
    title: "Email",
    copy: "For detailed queries and partnerships.",
    cta: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    accent: "#4A6FD4",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Wholesale",
    copy: "Cafés, offices, gifting, resellers — bulk pricing available.",
    cta: "Enquire on WhatsApp",
    href: whatsappLink("Hello TMUG,\n\nI'd like to enquire about wholesale/bulk pricing."),
    accent: "#D8A62A",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
        <path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" strokeLinejoin="round" />
        <path d="M9 21v-6h6v6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="bg-cream-light pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 pt-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ContactForm />
          </Reveal>
          <div>
            <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" gap={0.06}>
              {CARDS.map((c) => (
                <RevealItem key={c.title}>
                  <a
                    href={c.href}
                    {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex h-full items-start gap-4 rounded-3xl border border-ink/8 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(11,61,46,0.35)]"
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
                      style={{ backgroundColor: c.accent }}
                    >
                      {c.icon}
                    </span>
                    <span>
                      <span className="block font-display text-base font-bold text-tea-ink">{c.title}</span>
                      <span className="mt-0.5 block text-[13px] text-ink-soft">{c.copy}</span>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-tea-green">
                        {c.cta} <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </a>
                </RevealItem>
              ))}
            </Stagger>
            <Reveal delay={0.15} className="mt-4">
              <div className="rounded-3xl bg-tea-deep p-6 text-cream">
                <h2 className="font-display text-lg font-extrabold">Prefer browsing first?</h2>
                <p className="mt-1 text-sm text-cream/70">
                  Common questions about ordering, brewing and delivery are answered in the FAQ.
                </p>
                <Link
                  href="/faq"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-extrabold text-tea-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
                >
                  Read the FAQ <IconArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
