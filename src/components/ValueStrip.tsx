import { IconCup, IconLeaf, IconShield, IconTruck } from "./icons";

const ITEMS = [
  { icon: IconLeaf, text: "Whole dried flowers & leaves" },
  { icon: IconCup, text: "Caffeine-free herbal options" },
  { icon: IconShield, text: "FSSAI-registered packaging" },
  { icon: IconTruck, text: "Ships across India" },
];

/** Horizontal trust/value strip with a gentle marquee on all screens. */
export default function ValueStrip() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section aria-label="Why shop with TMUG" className="overflow-hidden border-y border-tea-green/10 bg-white/60 py-4">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-10 pr-10 motion-reduce:animate-none">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap" aria-hidden={i >= ITEMS.length}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tea-green/10 text-tea-green">
              <item.icon className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-bold text-ink">{item.text}</span>
            <span className="ml-6 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
}
