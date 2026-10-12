"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { SiteControls, SectionStyle, ImageOverride } from "@/types";
import { BUILDER_SECTIONS, FONT_OPTIONS } from "@/config/section-keys";

type Found = { section: string; orig: string; alt: string };

const inputCls =
  "w-full rounded-xl border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal focus:border-charcoal focus:outline-none";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-[11px] font-black uppercase tracking-wide text-charcoal/70">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-charcoal/50">{hint}</span>}
    </label>
  );
}

function NumField({
  label, value, onChange, min = 0, max = 4000, unit = "px", hint,
}: {
  label: string; value: number | undefined; onChange: (v: number | undefined) => void;
  min?: number; max?: number; unit?: string; hint?: string;
}) {
  return (
    <Field label={`${label} (${unit})`} hint={hint}>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        placeholder="auto"
        value={value ?? ""}
        onChange={(e) => {
          if (e.target.value === "") return onChange(undefined);
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className={inputCls}
      />
    </Field>
  );
}

function ColorF({ label, value, onChange }: { label: string; value?: string; onChange: (v?: string) => void }) {
  const isHex = /^#[0-9a-fA-F]{6}$/.test(value || "");
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isHex ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-charcoal/15 bg-white p-0.5"
        />
        <input
          type="text"
          placeholder="default"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value.trim() || undefined)}
          className={inputCls}
        />
        {value && (
          <button type="button" onClick={() => onChange(undefined)} className="text-[11px] font-black text-coral cursor-pointer">
            ✕
          </button>
        )}
      </div>
    </Field>
  );
}

function SelectF<T extends string>({
  label, value, onChange, options,
}: {
  label: string; value: T | undefined; onChange: (v: T | undefined) => void;
  options: { label: string; value: T | "" }[];
}) {
  return (
    <Field label={label}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}
        className={inputCls}
      >
        {options.map((o) => (
          <option key={o.label} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-charcoal">
      <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      {label}
    </label>
  );
}

function Group({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-charcoal/10 bg-white">
      <summary className="cursor-pointer select-none list-none px-4 py-3 text-sm font-black text-charcoal">
        {title}
      </summary>
      <div className="grid grid-cols-1 gap-3 border-t border-charcoal/10 p-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </details>
  );
}

const FIT = [
  { label: "Section default", value: "" as const },
  { label: "Contain (never crop)", value: "contain" as const },
  { label: "Cover (fill, may crop)", value: "cover" as const },
  { label: "Fill (stretch)", value: "fill" as const },
];
const POSITIONS = [
  { label: "Default", value: "" },
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Top left", value: "top left" },
  { label: "Top right", value: "top right" },
];

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("slotType", "general");
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

/** URL box + upload + choose-from-library, for one image slot. */
function ImagePicker({
  label, value, onChange, library, onError,
}: {
  label: string; value?: string; onChange: (url?: string) => void;
  library: { url: string; name: string }[]; onError: (m: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-1.5">
      <span className="block text-[11px] font-black uppercase tracking-wide text-charcoal/70">{label}</span>
      <div className="flex items-center gap-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-charcoal/10 bg-warm-surface object-contain" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-charcoal/20 text-[10px] text-charcoal/40">none</div>
        )}
        <input
          type="text"
          placeholder="/uploads/… or https://…"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value.trim() || undefined)}
          className={inputCls}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            setBusy(true);
            try {
              onChange(await uploadFile(f));
            } catch (err) {
              onError(err instanceof Error ? err.message : "Upload failed");
            } finally {
              setBusy(false);
            }
          }}
        />
        <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="rounded-lg bg-charcoal px-3 py-1 text-[11px] font-black text-white cursor-pointer disabled:opacity-50">
          {busy ? "Uploading…" : value ? "Replace / Upload" : "Upload"}
        </button>
        {library.length > 0 && (
          <select
            value=""
            onChange={(e) => e.target.value && onChange(e.target.value)}
            className="max-w-[170px] rounded-lg border border-charcoal/15 bg-white px-2 py-1 text-[11px] font-bold"
          >
            <option value="">Media library…</option>
            {library.map((m) => (
              <option key={m.url} value={m.url}>{m.name}</option>
            ))}
          </select>
        )}
        {value && (
          <button type="button" onClick={() => onChange(undefined)} className="text-[11px] font-black text-coral cursor-pointer">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default function PageBuilder({
  controls,
  setControls,
  onMessage,
}: {
  controls: SiteControls;
  setControls: (updater: (c: SiteControls) => SiteControls) => void;
  onMessage: (msg: string, kind: "ok" | "error") => void;
}) {
  const [sectionKey, setSectionKey] = useState(BUILDER_SECTIONS[0].key);
  const [found, setFound] = useState<Found[]>([]);
  const [library, setLibrary] = useState<{ url: string; name: string }[]>([]);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const style: SectionStyle = controls.sectionStyles?.[sectionKey] ?? {};
  const overrides = controls.imageOverrides ?? {};

  const patch = (p: Partial<SectionStyle>) =>
    setControls((c) => {
      const next = { ...(c.sectionStyles?.[sectionKey] ?? {}), ...p };
      (Object.keys(next) as (keyof SectionStyle)[]).forEach((k) => next[k] === undefined && delete next[k]);
      return { ...c, sectionStyles: { ...(c.sectionStyles ?? {}), [sectionKey]: next } };
    });

  const patchImage = (orig: string, p: Partial<ImageOverride>) =>
    setControls((c) => {
      const next = { ...(c.imageOverrides?.[orig] ?? {}), ...p };
      (Object.keys(next) as (keyof ImageOverride)[]).forEach((k) => (next[k] === undefined || next[k] === "") && delete next[k]);
      const all = { ...(c.imageOverrides ?? {}) };
      if (Object.keys(next).length) all[orig] = next;
      else delete all[orig];
      return { ...c, imageOverrides: all };
    });

  const resetSection = () => {
    if (!confirm(`Reset all custom styling for "${BUILDER_SECTIONS.find((s) => s.key === sectionKey)?.label}" back to its original design?`)) return;
    setControls((c) => {
      const all = { ...(c.sectionStyles ?? {}) };
      delete all[sectionKey];
      return { ...c, sectionStyles: all };
    });
  };

  // Images reported by the preview iframe (what is actually rendered on the page)
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "TMUG_SECTION_IMAGES") setFound(e.data.images);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    fetch("/api/admin/upload")
      .then((r) => (r.ok ? r.json() : { files: [] }))
      .then((d) => setLibrary(d.files || []))
      .catch(() => undefined);
  }, []);

  // Push draft controls to the preview and scroll it to the selected section
  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage({ type: "TMUG_PREVIEW_CONTROLS", controls }, window.location.origin);
  }, [controls]);
  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage({ type: "TMUG_SCROLL_TO", section: sectionKey }, window.location.origin);
  }, [sectionKey]);

  const sectionImages = useMemo(() => {
    const seen = new Set<string>();
    return found.filter((f) => f.section === sectionKey && !seen.has(f.orig) && seen.add(f.orig));
  }, [found, sectionKey]);

  const customised = (k: string) => Object.keys(controls.sectionStyles?.[k] ?? {}).length > 0;
  const err = (m: string) => onMessage(m, "error");

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-charcoal/10 bg-white p-5 shadow-xs">
        <h2 className="font-display text-2xl font-black text-charcoal">Page Builder</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Pick a section, then change its size, spacing, background, typography, buttons and images. Empty fields keep the
          original design. Changes show in the preview below instantly; use <b>Save Draft</b> then <b>Publish Live</b> to go live.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {BUILDER_SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSectionKey(s.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                sectionKey === s.key ? "border-charcoal bg-charcoal text-white" : "border-charcoal/15 bg-white text-charcoal hover:bg-warm-surface"
              }`}
            >
              {s.label}
              {customised(s.key) && <span className="ml-1 text-tea-gold">●</span>}
            </button>
          ))}
        </div>
      </div>

      <Group title="Layout & Dimensions" defaultOpen>
        <NumField label="Max width" value={style.maxWidth} onChange={(v) => patch({ maxWidth: v })} min={280} max={3000} hint="Centers the section" />
        <NumField label="Min height (desktop)" value={style.minHeight} onChange={(v) => patch({ minHeight: v })} min={40} max={2400} />
        <NumField label="Min height (tablet)" value={style.minHeightTablet} onChange={(v) => patch({ minHeightTablet: v })} min={40} max={2400} />
        <NumField label="Min height (mobile)" value={style.minHeightMobile} onChange={(v) => patch({ minHeightMobile: v })} min={40} max={2400} />
        <NumField label="Max height" value={style.maxHeight} onChange={(v) => patch({ maxHeight: v })} min={80} max={4000} hint="Clips overflowing content" />
        <NumField label="Extra top padding" value={style.padTop} onChange={(v) => patch({ padTop: v })} max={400} />
        <NumField label="Extra bottom padding" value={style.padBottom} onChange={(v) => patch({ padBottom: v })} max={400} />
        <NumField label="Extra side padding" value={style.padX} onChange={(v) => patch({ padX: v })} max={300} />
        <SelectF label="Text alignment" value={style.align} onChange={(v) => patch({ align: v })} options={[{ label: "Section default", value: "" }, { label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }]} />
        <SelectF label="Vertical alignment (needs min height)" value={style.vAlign} onChange={(v) => patch({ vAlign: v })} options={[{ label: "Section default", value: "" }, { label: "Top", value: "top" }, { label: "Center", value: "center" }, { label: "Bottom", value: "bottom" }]} />
      </Group>

      <Group title="Background">
        <ColorF label="Background color" value={style.bgColor} onChange={(v) => patch({ bgColor: v })} />
        <Field label="Gradient (CSS)" hint='e.g. linear-gradient(180deg, #FFF7EF, #FBE7DC)'>
          <input type="text" value={style.gradient ?? ""} onChange={(e) => patch({ gradient: e.target.value || undefined })} className={inputCls} placeholder="none" />
        </Field>
        <div className="sm:col-span-2 lg:col-span-1">
          <ImagePicker label="Background image" value={style.bgImage} onChange={(u) => patch({ bgImage: u })} library={library} onError={err} />
        </div>
        <SelectF label="Image sizing" value={style.bgSize} onChange={(v) => patch({ bgSize: v })} options={[{ label: "Cover (default)", value: "" }, { label: "Cover", value: "cover" }, { label: "Contain", value: "contain" }, { label: "Auto", value: "auto" }]} />
        <SelectF label="Image position" value={style.bgPosition} onChange={(v) => patch({ bgPosition: v })} options={POSITIONS} />
        <SelectF label="Repeat" value={style.bgRepeat} onChange={(v) => patch({ bgRepeat: v })} options={[{ label: "No repeat", value: "" }, { label: "Repeat", value: "repeat" }]} />
        <ColorF label="Overlay color" value={style.overlayColor} onChange={(v) => patch({ overlayColor: v })} />
        <NumField label="Overlay opacity" unit="%" value={style.overlayOpacity} onChange={(v) => patch({ overlayOpacity: v })} max={100} />
      </Group>

      <Group title="Border, Radius & Shadow">
        <ColorF label="Border color" value={style.borderColor} onChange={(v) => patch({ borderColor: v })} />
        <NumField label="Border width" value={style.borderWidth} onChange={(v) => patch({ borderWidth: v })} max={20} />
        <NumField label="Corner radius" value={style.radius} onChange={(v) => patch({ radius: v })} max={80} />
        <SelectF label="Shadow" value={style.shadow} onChange={(v) => patch({ shadow: v })} options={[{ label: "None", value: "" }, { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" }]} />
      </Group>

      <Group title="Typography (headings & body text in this section)">
        <SelectF label="Heading font" value={style.headingFont} onChange={(v) => patch({ headingFont: v })} options={FONT_OPTIONS} />
        <ColorF label="Heading color" value={style.headingColor} onChange={(v) => patch({ headingColor: v })} />
        <NumField label="Heading size – desktop" value={style.headingSize} onChange={(v) => patch({ headingSize: v })} min={12} max={140} />
        <NumField label="Heading size – tablet" value={style.headingSizeTablet} onChange={(v) => patch({ headingSizeTablet: v })} min={12} max={140} />
        <NumField label="Heading size – mobile" value={style.headingSizeMobile} onChange={(v) => patch({ headingSizeMobile: v })} min={12} max={140} />
        <NumField label="Heading weight" unit="100–900" value={style.headingWeight} onChange={(v) => patch({ headingWeight: v })} min={100} max={900} />
        <SelectF label="Heading case" value={style.textTransform} onChange={(v) => patch({ textTransform: v })} options={[{ label: "Default", value: "" }, { label: "UPPERCASE", value: "uppercase" }, { label: "Capitalize", value: "capitalize" }, { label: "As typed", value: "none" }]} />
        <SelectF label="Body font" value={style.bodyFont} onChange={(v) => patch({ bodyFont: v })} options={FONT_OPTIONS} />
        <ColorF label="Body color" value={style.bodyColor} onChange={(v) => patch({ bodyColor: v })} />
        <NumField label="Body size – desktop" value={style.bodySize} onChange={(v) => patch({ bodySize: v })} min={9} max={48} />
        <NumField label="Body size – mobile" value={style.bodySizeMobile} onChange={(v) => patch({ bodySizeMobile: v })} min={9} max={48} />
        <NumField label="Line height ×" unit="e.g. 1.5" value={style.lineHeight} onChange={(v) => patch({ lineHeight: v })} min={0.8} max={3} />
        <NumField label="Letter spacing" unit="% em" value={style.letterSpacing} onChange={(v) => patch({ letterSpacing: v })} min={-10} max={50} />
      </Group>

      <Group title="Buttons (CTA buttons & links in this section)">
        <ColorF label="Button background" value={style.buttonBg} onChange={(v) => patch({ buttonBg: v })} />
        <ColorF label="Button text" value={style.buttonText} onChange={(v) => patch({ buttonText: v })} />
        <NumField label="Button radius" value={style.buttonRadius} onChange={(v) => patch({ buttonRadius: v })} max={60} />
        <NumField label="Button font size" value={style.buttonSize} onChange={(v) => patch({ buttonSize: v })} min={10} max={32} />
      </Group>

      <Group title="Image display (all images in this section)">
        <SelectF label="Fit" value={style.imageFit} onChange={(v) => patch({ imageFit: v })} options={FIT} />
        <SelectF label="Position" value={style.imagePosition} onChange={(v) => patch({ imagePosition: v })} options={POSITIONS} />
        <NumField label="Corner radius" value={style.imageRadius} onChange={(v) => patch({ imageRadius: v })} max={200} />
        <NumField label="Max height" value={style.imageMaxHeight} onChange={(v) => patch({ imageMaxHeight: v })} min={40} max={2400} />
      </Group>

      <Group title="Animation & Hover (respects reduced-motion)">
        <SelectF label="Entrance" value={style.reveal} onChange={(v) => patch({ reveal: v })} options={[{ label: "None", value: "" }, { label: "Fade in", value: "fade" }, { label: "Slide up", value: "slide" }]} />
        <Toggle label="Zoom images on hover" value={style.hoverImageZoom} onChange={(v) => patch({ hoverImageZoom: v || undefined })} />
        <Toggle label="Lift cards on hover" value={style.hoverCardLift} onChange={(v) => patch({ hoverCardLift: v || undefined })} />
      </Group>

      <details open className="rounded-2xl border border-charcoal/10 bg-white">
        <summary className="cursor-pointer select-none list-none px-4 py-3 text-sm font-black text-charcoal">
          Change Images in this section ({sectionImages.length} found on the page)
        </summary>
        <div className="space-y-4 border-t border-charcoal/10 p-4">
          {sectionImages.length === 0 && (
            <p className="text-xs text-charcoal/60">
              No images detected yet. They are read from the preview below once it loads (sections with only background
              art or no images list nothing).
            </p>
          )}
          {sectionImages.map((img) => {
            const ov = overrides[img.orig] ?? {};
            return (
              <div key={img.orig} className="grid gap-4 rounded-2xl border border-charcoal/10 bg-warm-surface/20 p-3 lg:grid-cols-[110px_1fr]">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ov.src || img.orig} alt="" className="h-24 w-24 rounded-xl border border-charcoal/10 bg-white object-contain" />
                  <p className="mt-1 break-all text-[9px] text-charcoal/50">{img.orig.split("/").pop()}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <ImagePicker label="Desktop image" value={ov.src} onChange={(u) => patchImage(img.orig, { src: u })} library={library} onError={err} />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <ImagePicker label="Mobile image (optional)" value={ov.mobileSrc} onChange={(u) => patchImage(img.orig, { mobileSrc: u })} library={library} onError={err} />
                  </div>
                  <Field label="Alt text">
                    <input type="text" value={ov.alt ?? ""} placeholder={img.alt} onChange={(e) => patchImage(img.orig, { alt: e.target.value })} className={inputCls} />
                  </Field>
                  <SelectF label="Fit" value={ov.fit} onChange={(v) => patchImage(img.orig, { fit: v })} options={FIT} />
                  <SelectF label="Position" value={ov.position as string | undefined} onChange={(v) => patchImage(img.orig, { position: v })} options={POSITIONS} />
                  <NumField label="Radius" value={ov.radius} onChange={(v) => patchImage(img.orig, { radius: v })} max={300} />
                  <NumField label="Max width" value={ov.maxWidth} onChange={(v) => patchImage(img.orig, { maxWidth: v })} max={3000} />
                  <NumField label="Max height" value={ov.maxHeight} onChange={(v) => patchImage(img.orig, { maxHeight: v })} max={3000} />
                  <div className="flex items-end gap-4">
                    <Toggle label="Hide image" value={ov.hidden} onChange={(v) => patchImage(img.orig, { hidden: v || undefined })} />
                    {Object.keys(ov).length > 0 && (
                      <button
                        type="button"
                        onClick={() => confirm("Restore this image to its original?") && setControls((c) => {
                          const all = { ...(c.imageOverrides ?? {}) };
                          delete all[img.orig];
                          return { ...c, imageOverrides: all };
                        })}
                        className="text-[11px] font-black text-coral cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </details>

      <div className="flex justify-end">
        <button type="button" onClick={resetSection} className="rounded-xl border border-coral/40 bg-white px-4 py-2 text-xs font-black text-coral hover:bg-coral/10 cursor-pointer">
          Reset this section to original design
        </button>
      </div>

      <div className="rounded-3xl border border-charcoal/15 bg-charcoal/5 p-3">
        <p className="mb-2 px-1 text-[11px] font-black uppercase tracking-wider text-charcoal/70">
          Draft preview (auto-scrolls to the selected section)
        </p>
        <iframe
          ref={frameRef}
          src="/?preview=draft"
          title="Draft preview"
          onLoad={() => {
            frameRef.current?.contentWindow?.postMessage({ type: "TMUG_PREVIEW_CONTROLS", controls }, window.location.origin);
            frameRef.current?.contentWindow?.postMessage({ type: "TMUG_REQUEST_IMAGES" }, window.location.origin);
          }}
          className="h-[600px] w-full rounded-2xl border-0 bg-white"
        />
      </div>
    </div>
  );
}
