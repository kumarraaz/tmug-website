/**
 * DEMO reviews — layout placeholders ONLY.
 *
 * These are NOT real customer feedback. Do NOT present them as verified
 * reviews, do NOT show fake review counts. When real testimonials are
 * available, replace the entries below (same shape) and remove this notice.
 */
export interface DemoReview {
  quote: string;
  name: string;
}

export const DEMO_REVIEWS: DemoReview[] = [
  {
    quote:
      "Honestly loved the Butterfly Pea Tea. The colour is beautiful and the taste is so refreshing.",
    name: "Priya S.",
  },
  {
    quote:
      "The Premium Tea has become my everyday chai. Simple, kadak and really enjoyable.",
    name: "Rahul M.",
  },
  {
    quote:
      "Chamomile Tea is now my favourite evening cup. Packaging also looks really premium.",
    name: "Ananya M.",
  },
];

/** Prefilled WhatsApp message for the "share your feedback" CTA. */
export const FEEDBACK_MESSAGE = "Hi TMUG, I'd like to share my feedback about my tea.";
