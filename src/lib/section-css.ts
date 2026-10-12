import type { SectionStyle } from "@/types";
import { FONT_OPTIONS } from "@/config/section-keys";

const COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgba?\([0-9.,%\s]+\)|hsla?\([0-9.,%\s]+\)|[a-zA-Z]{3,20})$/;
const GRADIENT_RE = /^(linear|radial)-gradient\([#a-zA-Z0-9.,%()\s-]+\)$/;
const POS_RE = /^[a-z0-9%\s-]{1,30}$/;

const color = (v?: string) => (v && COLOR_RE.test(v.trim()) ? v.trim() : "");
const num = (v: number | undefined, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.min(max, Math.max(min, v)) : 0;
const num0 = (v: number | undefined, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : undefined;
const font = (v?: string) => (v && FONT_OPTIONS.some((f) => f.value === v) ? v : "");
const pos = (v?: string) => (v && POS_RE.test(v) ? v : "");

/** Image URLs must be site-relative or https, without characters that could break out of CSS. */
export function safeUrl(v?: string): string {
  if (!v) return "";
  const u = v.trim();
  if (!/^(\/|https:\/\/)/.test(u) || /["'()\\<>\s;{}]/.test(u)) return "";
  return u;
}

function rgba(hex: string, opacity: number): string {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
  if (!m) return "";
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${opacity})`;
}

const SHADOWS = {
  sm: "0 2px 8px rgba(0,0,0,.12)",
  md: "0 10px 30px -10px rgba(0,0,0,.25)",
  lg: "0 25px 60px -15px rgba(0,0,0,.35)",
} as const;

/** Build scoped, validated CSS for one section. Returns "" when nothing is overridden. */
export function buildSectionCss(key: string, s: SectionStyle | undefined): string {
  if (!s) return "";
  const sel = `[data-tmug-sec="${key.replace(/[^a-zA-Z0-9_-]/g, "")}"]`;
  const out: string[] = [];
  const rule = (selector: string, decls: string[], media?: string) => {
    const d = decls.filter(Boolean).join(";");
    if (!d) return;
    out.push(media ? `@media ${media}{${selector}{${d}}}` : `${selector}{${d}}`);
  };

  // ── wrapper layout ──
  const w: string[] = [];
  const maxW = num(s.maxWidth, 280, 3000);
  if (maxW) w.push(`max-width:${maxW}px`, "margin-left:auto", "margin-right:auto");
  const minH = num(s.minHeight, 40, 2400);
  if (minH) w.push(`min-height:${minH}px`);
  const maxH = num(s.maxHeight, 80, 4000);
  if (maxH) w.push(`max-height:${maxH}px`, "overflow:hidden");
  const pt = num0(s.padTop, 0, 400);
  const pb = num0(s.padBottom, 0, 400);
  const px = num0(s.padX, 0, 300);
  if (pt) w.push(`padding-top:${pt}px`);
  if (pb) w.push(`padding-bottom:${pb}px`);
  if (px) w.push(`padding-left:${px}px`, `padding-right:${px}px`);
  if (s.align) w.push(`text-align:${s.align}`);
  const flex = Boolean(s.vAlign && minH);
  if (flex) {
    w.push(
      "display:flex",
      "flex-direction:column",
      `justify-content:${s.vAlign === "top" ? "flex-start" : s.vAlign === "bottom" ? "flex-end" : "center"}`,
    );
  }
  const bw = num0(s.borderWidth, 0, 20);
  const bc = color(s.borderColor);
  if (bw && bc) w.push(`border:${bw}px solid ${bc}`);
  const r = num0(s.radius, 0, 80);
  if (r) w.push(`border-radius:${r}px`, "overflow:hidden");
  if (s.shadow && s.shadow !== "none" && SHADOWS[s.shadow]) w.push(`box-shadow:${SHADOWS[s.shadow]}`);
  rule(sel, w);
  if (flex) rule(`${sel}>*`, ["width:100%"]);

  const mt = num(s.minHeightTablet, 40, 2400);
  if (mt) rule(sel, [`min-height:${mt}px`], "(max-width:1023px)");
  const mm = num(s.minHeightMobile, 40, 2400);
  if (mm) rule(sel, [`min-height:${mm}px`], "(max-width:639px)");

  // ── background (applied to the section's own root element) ──
  const bgc = color(s.bgColor);
  const grad = s.gradient && GRADIENT_RE.test(s.gradient.trim()) ? s.gradient.trim() : "";
  const img = safeUrl(s.bgImage);
  const ov = s.overlayColor
    ? rgba(color(s.overlayColor), Math.min(100, Math.max(0, s.overlayOpacity ?? 0)) / 100)
    : "";
  const layers = [ov ? `linear-gradient(${ov},${ov})` : "", grad, img ? `url("${img}")` : ""].filter(Boolean);
  const bg: string[] = [];
  if (bgc) bg.push(`background-color:${bgc}!important`);
  if (layers.length) {
    bg.push(`background-image:${layers.join(",")}!important`);
    if (img) {
      bg.push(
        `background-size:${s.bgSize || "cover"}!important`,
        `background-position:${pos(s.bgPosition) || "center"}!important`,
        `background-repeat:${s.bgRepeat || "no-repeat"}!important`,
      );
    }
  }
  rule(`${sel}>*`, bg);

  // ── typography ──
  const H = `${sel} :is(h1,h2,h3,h4)`;
  const hd: string[] = [];
  if (font(s.headingFont)) hd.push(`font-family:${font(s.headingFont)}!important`);
  if (color(s.headingColor)) hd.push(`color:${color(s.headingColor)}!important`);
  const hs = num(s.headingSize, 12, 140);
  if (hs) hd.push(`font-size:${hs}px!important`);
  const hw = num(s.headingWeight, 100, 900);
  if (hw) hd.push(`font-weight:${hw}!important`);
  if (s.textTransform) hd.push(`text-transform:${s.textTransform}!important`);
  if (s.align) hd.push(`text-align:${s.align}!important`);
  rule(H, hd);
  const hst = num(s.headingSizeTablet, 12, 140);
  if (hst) rule(H, [`font-size:${hst}px!important`], "(max-width:1023px)");
  const hsm = num(s.headingSizeMobile, 12, 140);
  if (hsm) rule(H, [`font-size:${hsm}px!important`], "(max-width:639px)");

  const B = `${sel} :is(p,li,label)`;
  const bd: string[] = [];
  if (font(s.bodyFont)) bd.push(`font-family:${font(s.bodyFont)}!important`);
  if (color(s.bodyColor)) bd.push(`color:${color(s.bodyColor)}!important`);
  const bs = num(s.bodySize, 9, 48);
  if (bs) bd.push(`font-size:${bs}px!important`);
  const lh = num(s.lineHeight, 0.8, 3);
  if (lh) bd.push(`line-height:${lh}!important`);
  const ls = num0(s.letterSpacing, -10, 50);
  if (ls) bd.push(`letter-spacing:${ls / 100}em!important`);
  if (s.align) bd.push(`text-align:${s.align}!important`);
  rule(B, bd);
  const bsm = num(s.bodySizeMobile, 9, 48);
  if (bsm) rule(B, [`font-size:${bsm}px!important`], "(max-width:639px)");

  // ── images ──
  const im: string[] = [];
  if (s.imageFit) im.push(`object-fit:${s.imageFit}!important`);
  if (pos(s.imagePosition)) im.push(`object-position:${pos(s.imagePosition)}!important`);
  const ir = num0(s.imageRadius, 0, 200);
  if (ir) im.push(`border-radius:${ir}px!important`);
  const imh = num(s.imageMaxHeight, 40, 2400);
  if (imh) im.push(`max-height:${imh}px!important`);
  rule(`${sel} img`, im);

  // ── buttons: CTA-style links / buttons (those with both horizontal and vertical padding) ──
  const BT = `${sel} :is(a,button)[class*="px-"][class*="py-"]`;
  const bt: string[] = [];
  if (color(s.buttonBg)) bt.push(`background-color:${color(s.buttonBg)}!important`);
  if (color(s.buttonText)) bt.push(`color:${color(s.buttonText)}!important`);
  const brr = num0(s.buttonRadius, 0, 60);
  if (brr !== undefined) bt.push(`border-radius:${brr}px!important`);
  const bsz = num(s.buttonSize, 10, 32);
  if (bsz) bt.push(`font-size:${bsz}px!important`);
  rule(BT, bt);

  // ── effects (always respect reduced motion) ──
  if (s.reveal && s.reveal !== "none") {
    out.push(`@media (prefers-reduced-motion:no-preference){${sel}{animation:tmug-${s.reveal}-in .7s ease both}}`);
  }
  if (s.hoverImageZoom) {
    out.push(
      `${sel} img{transition:transform .5s ease}@media (hover:hover){${sel} [class*="group"]:hover img,${sel} img:hover{transform:scale(1.06)}}`,
    );
  }
  if (s.hoverCardLift) {
    out.push(
      `${sel} [class*="group"]{transition:transform .3s ease}@media (hover:hover){${sel} [class*="group"]:hover{transform:translateY(-6px)}}`,
    );
  }
  return out.join("\n");
}

export const REVEAL_KEYFRAMES =
  "@keyframes tmug-fade-in{from{opacity:0}to{opacity:1}}@keyframes tmug-slide-in{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}";
