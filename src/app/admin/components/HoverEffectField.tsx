"use client";

interface HoverEffectFieldProps {
  label: string;
  value: string;
  onChange: (effect: string) => void;
  duration?: number;
  onDurationChange?: (ms: number) => void;
}

const EFFECTS = [
  { id: "none", label: "No Animation", desc: "Completely static hover state" },
  { id: "lift", label: "Subtle Lift", desc: "Gentle vertical lift (-4px) with shadow" },
  { id: "scale", label: "Subtle Scale", desc: "Smooth zoom (1.04x) with spring" },
  { id: "glow", label: "Gen-Z Glow", desc: "Soft pastel radial glow aura" },
  { id: "fade", label: "Soft Fade", desc: "Subtle opacity transition" },
  { id: "slide", label: "Slide Accent", desc: "Horizontal nudge / chevron reveal" },
];

export default function HoverEffectField({
  label,
  value,
  onChange,
  duration,
  onDurationChange,
}: HoverEffectFieldProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-charcoal/10 bg-warm-surface/30 p-3.5">
      <div className="flex items-center justify-between border-b border-charcoal/10 pb-2">
        <span className="text-xs font-black uppercase tracking-wider text-charcoal">{label}</span>
        <span className="rounded-full bg-charcoal px-2 py-0.5 text-[10px] font-bold text-white uppercase">
          {value || "none"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {EFFECTS.map((eff) => (
          <button
            key={eff.id}
            type="button"
            onClick={() => onChange(eff.id)}
            className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
              value === eff.id
                ? "border-charcoal bg-white shadow-xs ring-2 ring-charcoal"
                : "border-charcoal/15 bg-white/70 hover:border-tea-gold hover:bg-white"
            }`}
          >
            <span className="text-xs font-bold text-charcoal">{eff.label}</span>
            <span className="mt-0.5 text-[10px] text-charcoal/60 leading-tight">{eff.desc}</span>
          </button>
        ))}
      </div>

      {onDurationChange !== undefined && duration !== undefined && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-charcoal/70">Animation Duration</label>
            <span className="font-mono text-xs font-bold text-charcoal">{duration}ms</span>
          </div>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full accent-charcoal cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
