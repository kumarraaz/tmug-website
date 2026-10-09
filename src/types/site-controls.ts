/**
 * Comprehensive Site Controls Type Definitions
 * Complete visual, typography, layout, component, and animation control schemas for TMUG.
 */

export interface GlobalColors {
  brandPrimary: string;    // Cherry Blossom Pink (e.g. #FAA4B5)
  brandSecondary: string;  // Fawn (e.g. #F8B77C)
  brandGold: string;       // Maize / Tea Gold (e.g. #FFF183)
  brandSkyBlue: string;    // Aparajita Sky Blue (e.g. #70C1E1)
  brandOlivine: string;    // Light supporting accent (e.g. #82BA88)
  canvas: string;          // Primary canvas (e.g. #FFF7EF)
  surface: string;         // Cards/Containers (e.g. #FBE7DC)
  charcoal: string;        // Warm Charcoal (e.g. #3A3438)
  deepPlum: string;        // Deep Plum (e.g. #33243A)
  textPrimary: string;     // Headings & high-contrast (e.g. #33243A)
  textSecondary: string;   // Body & descriptions (e.g. #3A3438)
  textMuted: string;       // Secondary hints (e.g. #6B6368)
  borderDefault: string;   // Borders (e.g. rgba(58,52,56,0.12))
}

export interface GlobalTypography {
  fontDisplay: string;     // e.g. "Bricolage Grotesque", "DM Sans", "Inter", "Playfair Display", "Outfit"
  fontBody: string;        // e.g. "DM Sans", "Inter", "Plus Jakarta Sans", "Roboto"
  baseFontSize: number;    // Base size in px (e.g. 16)
  headingScale: number;    // Multiplier for headings (e.g. 1.0)
  headingWeight: string;   // "font-bold" | "font-extrabold" | "font-black"
  bodyWeight: string;      // "font-normal" | "font-medium"
  letterSpacing: string;   // "tracking-tight" | "tracking-normal" | "tracking-wide"
}

export interface GlobalSpacing {
  containerMaxWidth: string;       // "max-w-7xl" | "max-w-6xl" | "max-w-[1440px]" | "max-w-full"
  sectionPaddingY: string;         // "py-8 sm:py-12" | "py-10 sm:py-16" | "py-6 sm:py-8"
  pagePaddingX: string;            // "px-4 sm:px-6 lg:px-10" | "px-6 sm:px-10 lg:px-14"
}

export interface GlobalButtons {
  primaryBg: string;               // e.g. #3A3438
  primaryText: string;             // e.g. #FFFFFF
  primaryHoverBg: string;          // e.g. #FFF183
  primaryHoverText: string;        // e.g. #3A3438
  secondaryBg: string;             // e.g. #FAA4B5
  secondaryText: string;           // e.g. #FFFFFF
  secondaryHoverBg: string;        // e.g. #D94F7D
  secondaryHoverText: string;      // e.g. #FFFFFF
  radius: string;                  // "rounded-full" | "rounded-2xl" | "rounded-xl" | "rounded-lg"
  hoverEffect: string;             // "lift" | "scale" | "glow" | "none"
}

export interface GlobalAnimations {
  enabled: boolean;
  transitionDuration: number;      // in ms, e.g. 300
  cardHoverEffect: string;         // "lift" | "scale" | "glow" | "none"
  buttonHoverEffect: string;       // "lift" | "scale" | "glow" | "none"
  reducedMotion: boolean;
}

export interface GlobalDesignSettings {
  colors: GlobalColors;
  typography: GlobalTypography;
  spacing: GlobalSpacing;
  buttons: GlobalButtons;
  animations: GlobalAnimations;
}

export interface HeaderSettings {
  layout: "balanced-three-zone" | "left-aligned" | "split";
  background: string;              // e.g. #3A3438
  textColor: string;               // e.g. #FFF7EF
  sticky: boolean;
  heightDesktop: number;           // e.g. 72 px
  heightMobile: number;            // e.g. 60 px
  paddingX: number;                // e.g. 40 px
  navFontSize: number;             // e.g. 17 px
  navFontWeight: string;           // "font-medium" | "font-semibold" | "font-bold"
  navGap: number;                  // e.g. 32 px
  navHoverColor: string;           // e.g. #FFF183
  navActiveColor: string;          // e.g. #FFF183
  logoHeight: number;              // e.g. 44 px
  logoWidth: number;               // e.g. 88 px
  logoAlignment: "left" | "center";
  showAnnouncement: boolean;
  announcementText: string;
  announcementBg: string;          // e.g. #3A3438
  announcementTextColor: string;   // e.g. #FFF7EF
  cartBadgeBg: string;             // e.g. #FFF183
  cartBadgeText: string;           // e.g. #3A3438
  dropdownBg: string;              // e.g. #FFFFFF
  dropdownTextColor: string;       // e.g. #3A3438
  borderBottom: boolean;
  borderColor: string;
}

export interface SectionVisualItem {
  enabled: boolean;
  heading: string;
  subheading: string;
  ctaText?: string;
  ctaLink?: string;
  bgColor?: string;
  headingColor?: string;
  textColor?: string;
  paddingTop?: number;             // px
  paddingBottom?: number;          // px
  custom?: Record<string, any>;
}

export interface SectionsVisualSettings {
  hero: SectionVisualItem & {
    autoplay: boolean;
    interval: number;              // ms
    transitionSpeed: number;       // ms
    heightDesktop: number;         // vh or px
    showArrows: boolean;
    showDots: boolean;
  };
  trustStrip: SectionVisualItem & {
    speed: number;                 // seconds per loop
  };
  collections: SectionVisualItem & {
    cardBg: string;
    cardRadius: string;
    showArrows: boolean;
  };
  bestSellers: SectionVisualItem & {
    cardHoverEffect: string;
  };
  openReveal: SectionVisualItem & {
    boxHeightDesktop: number;      // vh
    petalShower: boolean;
  };
  whyTmug: SectionVisualItem & {
    cardBg: string;
  };
  madeWithRealTea: SectionVisualItem;
  teaStory: SectionVisualItem;
  ritualsRecipes: SectionVisualItem;
  lifestyleGallery: SectionVisualItem & {
    showStickers: boolean;
  };
  brandProof: SectionVisualItem;
  customerLove: SectionVisualItem;
  availableInStores: SectionVisualItem & {
    amazonUrl: string;
    showWhatsApp: boolean;
  };
  finalCta: SectionVisualItem & {
    buttonBg: string;
    buttonText: string;
  };
  footer: SectionVisualItem & {
    logoHeight: number;
    showSocials: boolean;
    showFSSAI: boolean;
    tagline: string;
  };
}

export interface ProductCardSettings {
  cardBg: string;
  borderRadius: string;            // "rounded-2xl" | "rounded-3xl" | "rounded-xl"
  borderWidth: number;             // px
  borderColor: string;
  shadow: string;                  // "shadow-none" | "shadow-xs" | "shadow-sm" | "shadow-md"
  imageHeightDesktop: number;      // px
  imageFit: "contain" | "cover";
  hoverEffect: "lift" | "scale" | "glow" | "none";
  titleColor: string;
  priceColor: string;
  badgeBg: string;
  badgeText: string;
  showBadge?: boolean;
  buttonBg?: string;
  buttonTextColor?: string;
}

export interface CartDrawerSettings {
  widthDesktop: number;            // px (e.g. 420)
  bgColor: string;
  textColor: string;
  checkoutBtnBg: string;
  checkoutBtnText: string;
  position: "right" | "left";
}

export interface QuickViewModalSettings {
  maxWidth: number;                // px (e.g. 640)
  bgColor: string;
  textColor: string;
  overlayOpacity: number;          // %
  borderRadius: string;
}

export interface SearchOverlaySettings {
  bgColor: string;
  textColor: string;
  inputBorderColor: string;
}

export interface PromoModalSettings {
  enabled: boolean;
  code: string;
  discountPercent: number;
  bgColor: string;
  textColor: string;
}

export interface FloatingWhatsAppSettings {
  enabled: boolean;
  position: "bottom-right" | "bottom-left";
  bgColor: string;
  textColor: string;
  phoneNumber: string;
}

export interface ComponentSettings {
  productCard: ProductCardSettings;
  cartDrawer: CartDrawerSettings;
  quickViewModal: QuickViewModalSettings;
  searchOverlay: SearchOverlaySettings;
  promoModal: PromoModalSettings;
  floatingWhatsApp: FloatingWhatsAppSettings;
}

export interface HeroBannerControl {
  id: string;
  headline?: string;
  subheadline?: string;
  campaign?: string;
  category?: string;
  cta?: string;
  destination?: string;
  image?: string;
  mobileImage?: string;
  accent?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  desktopSrc?: string;
  mobileSrc?: string;
  enabled?: boolean;
  order?: number;
}

export interface ProductControl {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  frontImage: string;
  backImage?: string;
  thumbnail?: string;
  heroImage?: string;
  lifestyleImage?: string;
  isBestSeller: boolean;
  isPopularPick: boolean;
  enabled: boolean;
  order: number;
}

export interface CollectionControl {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  order: number;
}

export interface SectionControl {
  id: string;
  label: string;
  heading: string;
  subheading: string;
  ctaText?: string;
  ctaLink?: string;
  enabled: boolean;
  order: number;
}

export interface SiteControls {
  // Global design system
  global: GlobalDesignSettings;
  // Header and navigation
  header: HeaderSettings;
  // Section-by-section visuals
  sectionsVisual: SectionsVisualSettings;
  // Component styling
  components: ComponentSettings;
  productCard?: ProductCardSettings;
  // Existing dynamic catalog and layout controls (preserved for full backward compatibility)
  banners: HeroBannerControl[];
  products: ProductControl[];
  collections: CollectionControl[];
  sections: SectionControl[];
}

export interface SiteControlsHistoryItem {
  id: string;
  timestamp: string;
  label: string;
  controls: SiteControls;
}

export interface SiteControlsStoreState {
  published: SiteControls;
  draft: SiteControls;
  history: SiteControlsHistoryItem[];
}
