/**
 * Customer testimonials for the "Loved by Tea Lovers" section.
 *
 * Only add REAL, permission-granted feedback here. While this list is empty the section shows an
 * invitation to share feedback instead of reviews. (The older DEMO_REVIEWS in reviews.ts are layout
 * placeholders and are intentionally not reused.)
 *
 *   { quote: "…", name: "Customer name", product: "Chamomile Flower Tea" (optional), rating: 5 (optional, 1–5) }
 */
export interface Testimonial {
  quote: string;
  name: string;
  product?: string;
  rating?: number;
}

export const TESTIMONIALS: Testimonial[] = [];
