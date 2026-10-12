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
