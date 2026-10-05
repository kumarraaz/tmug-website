import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  children?: ReactNode;
}

/** Consistent section heading with editorial eyebrow + display title. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  children,
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex max-w-2xl flex-col gap-2.5 ${alignCls}`}
    >
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
            dark ? "bg-white/10 text-gold-soft" : "bg-tea-green/10 text-tea-green"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-section font-display font-extrabold text-balance ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-[15px] leading-relaxed ${dark ? "text-cream/70" : "text-ink-soft"}`}>
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}
