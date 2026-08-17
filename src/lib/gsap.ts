"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered on the client only, and only once — this module is evaluated a
// single time however many sections import it. Every section pulls GSAP from
// here so the plugin is guaranteed to exist before a trigger is created.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Mobile browsers resize the viewport when the URL bar hides/shows. Without
  // this, every pinned section re-measures mid-scroll and visibly jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

/**
 * Breakpoint + motion conditions shared by every section, so one component can
 * never disagree with another about what "desktop" or "reduced motion" means.
 */
export const CONDITIONS = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 768px) and (max-width: 1023.98px)",
  mobile: "(max-width: 767.98px)",
} as const;

export type Conditions = Record<keyof typeof CONDITIONS, boolean>;
