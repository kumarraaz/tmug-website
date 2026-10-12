/**
 * Customer testimonials for the "What Our Tea Lovers Say" section.
 *
 * Add REAL, permission-granted feedback to TESTIMONIALS (it replaces the samples automatically):
 *   { quote: "…", name: "Customer name", photo: "/uploads/portrait.jpg" (optional), rating: 5 (optional, only if verified) }
 *
 * While TESTIMONIALS is empty, the section shows the sample entries from reviews.ts (DEMO_REVIEWS), each tagged
 * "Sample" on the card with initials instead of a portrait and no star rating, so they are never presented as
 * verified customer reviews.
 */
export interface Testimonial {
  quote: string;
  name: string;
  /** Portrait image path (real customers only). Initials are shown when omitted. */
  photo?: string;
  /** 1–5, only for verified ratings. */
  rating?: number;
  /** True for layout samples — renders a visible "Sample" tag. */
  placeholder?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [];
