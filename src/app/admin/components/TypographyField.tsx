"use client";

interface TypographyFieldProps {
  label: string;
  fontFamily?: string;
  onFontFamilyChange?: (font: string) => void;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
  fontWeight?: string;
  onFontWeightChange?: (weight: string) => void;
  letterSpacing?: string;
  onLetterSpacingChange?: (spacing: string) => void;
  minSize?: number;
  maxSize?: number;
}

const FONTS = [
  "Bricolage Grotesque",
  "DM Sans",
  "Inter",
  "Playfair Display",
  "Outfit",
  "Plus Jakarta Sans",
  "Roboto",
  "Cinzel",
];

const WEIGHTS = [
  { label: "Normal (400)", value: "font-normal" },
  { label: "Medium (500)", value: "font-medium" },
  { label: "Semi Bold (600)", value: "font-semibold" },
  { label: "Bold (700)", value: "font-bold" },
  { label: "Extra Bold (800)", value: "font-extrabold" },
  { label: "Black (900)", value: "font-black" },
];

export default function TypographyField({
  label,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  fontWeight,
  onFontWeightChange,
  letterSpacing,
  onLetterSpacingChange,
  minSize = 12,
  maxSize = 72,
}: TypographyFieldProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-charcoal/10 bg-warm-surface/30 p-3.5">
      <div className="flex items-center justify-between border-b border-charcoal/10 pb-2">
        <span className="text-xs font-black uppercase tracking-wider text-charcoal">{label}</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {/* Font Family */}
        {onFontFamilyChange && (
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-charcoal/70">Font Family</label>
            <select
              value={fontFamily || "Bricolage Grotesque"}
              onChange={(e) => onFontFamilyChange(e.target.value)}
              className="w-full rounded-xl border border-charcoal/20 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal focus:border-tea-gold focus:outline-none"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Font Weight */}
        {onFontWeightChange && (
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-charcoal/70">Font Weight</label>
            <select
              value={fontWeight || "font-bold"}
              onChange={(e) => onFontWeightChange(e.target.value)}
              className="w-full rounded-xl border border-charcoal/20 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal focus:border-tea-gold focus:outline-none"
            >
              {WEIGHTS.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Font Size */}
        {onFontSizeChange !== undefined && fontSize !== undefined && (
          <div className="space-y-1 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-charcoal/70">Font Size</label>
              <span className="font-mono text-xs font-bold text-charcoal">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={minSize}
                max={maxSize}
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="flex-1 accent-charcoal cursor-pointer"
              />
              <input
                type="number"
                min={minSize}
                max={maxSize}
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-16 rounded-xl border border-charcoal/20 bg-white px-2 py-1 text-center font-mono text-xs font-bold text-charcoal"
              />
            </div>
          </div>
        )}

        {/* Letter Spacing */}
        {onLetterSpacingChange && (
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-charcoal/70">Letter Spacing</label>
            <div className="flex gap-2">
              {[
                { label: "Tight", value: "tracking-tight" },
                { label: "Normal", value: "tracking-normal" },
                { label: "Wide", value: "tracking-wide" },
                { label: "Wider", value: "tracking-wider" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onLetterSpacingChange(s.value)}
                  className={`flex-1 rounded-xl border py-1 text-xs font-bold transition-colors cursor-pointer ${
                    letterSpacing === s.value
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-charcoal/15 bg-white text-charcoal hover:border-tea-gold"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
