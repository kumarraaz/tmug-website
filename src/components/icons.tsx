/** Inline SVG icons — no icon library needed. */

type P = { className?: string };

const base = "fill-none stroke-current stroke-2";

export const IconSearch = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconCart = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.4 12.2A1 1 0 0 0 8.4 17H18a1 1 0 0 0 1-.8L21.5 8H6" />
    <circle cx="9.5" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </svg>
);

export const IconMenu = ({ className = "w-6 h-6" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconClose = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPlus = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round">
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13h8l1-13" />
  </svg>
);

export const IconArrowRight = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);

export const IconArrowLeft = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12H4m6-6-6 6 6 6" />
  </svg>
);

export const IconCheck = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconLeaf = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 19C5 9 13 4 20 4c0 8-5 15-15 15Z" />
    <path d="M5 19c3-6 7-10 12-12" />
  </svg>
);

export const IconTruck = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6h12v10H2zM14 10h4l4 4v2h-8" />
    <circle cx="6.5" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
);

export const IconShield = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconCup = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" />
    <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 3.5c0 1-1 1-1 2M12 3.5c0 1-1 1-1 2" />
  </svg>
);

export const IconChat = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4Z" />
  </svg>
);

export const IconWhatsApp = ({ className = "w-6 h-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.9a11.6 11.6 0 0 0 4.5 4.2c1.7.8 2.4.9 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.5-.2Z" />
  </svg>
);

export const IconStar = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
  </svg>
);
