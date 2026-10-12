/** Delicate line-art botanicals for subtle, decorative backgrounds. All are aria-hidden and use currentColor. */

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Lemongrass: tall arching blades. */
export function LemongrassArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" aria-hidden="true" className={className} {...base}>
      <path d="M60 200C58 150 52 100 30 20C46 70 58 120 62 200" />
      <path d="M62 200C66 140 78 90 104 30C92 84 74 140 66 200" />
      <path d="M60 200C56 160 40 120 12 80C34 108 52 150 62 200" />
      <path d="M64 200C70 160 92 130 116 112C94 132 76 164 66 200" />
      <path d="M61 200C61 150 60 100 60 40" />
    </svg>
  );
}

/** Butterfly pea: five-petal blossom with a vine leaf. */
export function ButterflyPeaArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" aria-hidden="true" className={className} {...base}>
      <path d="M70 76C40 70 22 46 36 26C52 14 70 36 70 76Z" />
      <path d="M70 76C100 70 118 46 104 26C88 14 70 36 70 76Z" />
      <path d="M70 76C58 96 60 120 70 130C80 120 82 96 70 76Z" />
      <path d="M70 76C54 84 40 98 44 112C58 112 68 98 70 76Z" />
      <path d="M70 76C86 84 100 98 96 112C82 112 72 98 70 76Z" />
      <path d="M70 70V40" />
    </svg>
  );
}

/** Hibiscus: five broad petals, long stamen. */
export function HibiscusArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" className={className} {...base}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} transform={`rotate(${a} 80 80)`} d="M80 80C52 66 44 30 62 16C80 8 100 22 98 44C96 62 88 74 80 80Z" />
      ))}
      <path d="M80 80C92 62 104 52 120 46" />
      <circle cx="122" cy="45" r="2.5" />
      <circle cx="80" cy="80" r="4" />
    </svg>
  );
}

/** Tea leaves: a pair of serrated-feeling leaves on a twig. */
export function TeaLeafArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" aria-hidden="true" className={className} {...base}>
      <path d="M20 124C40 100 60 80 96 60" />
      <path d="M52 94C32 82 30 56 44 38C66 46 70 74 52 94Z" />
      <path d="M52 94C58 66 82 56 104 62C100 88 78 102 52 94Z" />
      <path d="M44 38C46 56 48 74 52 94" />
      <path d="M52 94C70 82 86 72 104 62" />
      <path d="M96 60C106 46 118 40 130 38C128 52 116 62 96 60Z" />
    </svg>
  );
}

/* ── Filled, full-colour botanicals (decorative, aria-hidden) ── */

export function ColorLeaf({ className = "", tone = "#4E8F3F" }: { className?: string; tone?: string }) {
  return (
    <svg viewBox="0 0 60 120" aria-hidden="true" className={className}>
      <path d="M30 2C58 30 58 86 30 118C2 86 2 30 30 2Z" fill={tone} />
      <path d="M30 14V112M30 40L44 28M30 62L46 48M30 84L44 72M30 50L16 38M30 72L14 60" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ColorButterflyPea({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <path d="M60 64C26 62 8 36 26 14C46 4 62 30 60 64Z" fill="#2E3BC9" />
      <path d="M60 64C94 62 112 36 94 14C74 4 58 30 60 64Z" fill="#3A4BDB" />
      <path d="M60 64C42 74 38 100 52 112C70 108 74 84 60 64Z" fill="#2630A8" />
      <path d="M60 64C48 56 40 44 44 30C54 34 62 48 60 64Z" fill="#6F86FF" opacity="0.8" />
      <ellipse cx="60" cy="62" rx="10" ry="8" fill="#F4F1FF" />
      <ellipse cx="60" cy="62" rx="4" ry="3" fill="#F2C94C" />
    </svg>
  );
}

export function ColorChamomile({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="60" cy="24" rx="9" ry="22" fill="#FFFFFF" stroke="#E7E2D3" strokeWidth="1" transform={`rotate(${i * 30} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="15" fill="#F2B705" />
      <circle cx="60" cy="60" r="15" fill="none" stroke="#D99A00" strokeWidth="2" />
    </svg>
  );
}

export function ColorHibiscus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" aria-hidden="true" className={className}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} transform={`rotate(${a} 70 70)`} d="M70 70C40 58 30 24 48 10C66 2 90 14 90 36C90 52 80 64 70 70Z" fill="#D8283C" />
      ))}
      <circle cx="70" cy="70" r="10" fill="#8E0F26" />
      <path d="M70 70C82 54 94 44 108 40" stroke="#F4C542" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="109" cy="40" r="4" fill="#F4C542" />
    </svg>
  );
}

export function ColorLemongrass({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" aria-hidden="true" className={className}>
      <path d="M60 200C58 150 52 100 30 14C50 70 62 120 64 200Z" fill="#8DB84A" />
      <path d="M64 200C68 140 82 90 108 26C94 84 76 140 68 200Z" fill="#6E9A32" />
      <path d="M60 200C54 160 36 118 8 78C34 108 54 150 64 200Z" fill="#A5CB62" />
      <path d="M66 200C74 162 96 130 118 112C98 134 80 166 70 200Z" fill="#7FAE3E" />
      <rect x="54" y="150" width="20" height="50" rx="4" fill="#E9E4B8" />
    </svg>
  );
}
