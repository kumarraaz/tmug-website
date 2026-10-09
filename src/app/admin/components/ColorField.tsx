"use client";

import { useState, useEffect } from "react";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  description?: string;
}

const DEFAULT_PRESETS = [
  "#FAA4B5", // Cherry Blossom
  "#F8B77C", // Fawn
  "#FFF183", // Maize
  "#70C1E1", // Sky Blue
  "#82BA88", // Olivine
  "#FFF7EF", // Warm Ivory
  "#FBE7DC", // Peach Cream
  "#3A3438", // Charcoal
  "#33243A", // Deep Plum
  "#FFFFFF", // White
];

export default function ColorField({
  label,
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
  description,
}: ColorFieldProps) {
  const [hexInput, setHexInput] = useState(value || "#000000");

  useEffect(() => {
    setHexInput(value || "#000000");
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setHexInput(newVal);
    // Simple validation: if starts with # and has 4 or 7 chars
    if (/^#[0-9A-Fa-f]{3,8}$/.test(newVal) || /^rgba?\(.+\)$/.test(newVal)) {
      onChange(newVal);
    }
  };

  const handleNativePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    onChange(val);
  };

  // Convert hex to picker-safe value
  const pickerValue = /^#[0-9A-Fa-f]{6}$/.test(hexInput) ? hexInput : "#3a3438";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-charcoal">{label}</label>
        <span className="font-mono text-[11px] font-semibold text-charcoal/60 uppercase">
          {value || "#000000"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Native color picker swatch */}
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-charcoal/20 shadow-xs">
          <input
            type="color"
            value={pickerValue}
            onChange={handleNativePicker}
            aria-label={`${label} color picker`}
            className="absolute -inset-2 h-14 w-14 cursor-pointer opacity-100"
          />
        </div>

        {/* Explicit HEX input */}
        <input
          type="text"
          value={hexInput}
          onChange={handleTextChange}
          placeholder="#RRGGBB"
          className="flex-1 rounded-xl border border-charcoal/20 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-charcoal focus:border-tea-gold focus:outline-none focus:ring-1 focus:ring-tea-gold"
        />
      </div>

      {description && (
        <p className="text-[11px] text-charcoal/60 leading-tight">{description}</p>
      )}

      {/* Quick brand preset chips */}
      <div className="flex flex-wrap gap-1 pt-1">
        {presetColors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setHexInput(c);
              onChange(c);
            }}
            title={c}
            style={{ backgroundColor: c }}
            aria-label={`Select color ${c}`}
            className={`h-5 w-5 rounded-full border border-charcoal/20 transition-transform hover:scale-125 focus:outline-none focus:ring-1 focus:ring-charcoal ${
              value === c ? "ring-2 ring-charcoal ring-offset-1" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
