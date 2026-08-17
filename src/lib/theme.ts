/**
 * The palette, duplicated as plain hex for GSAP.
 *
 * Tailwind reads the same values from the `@theme` block in globals.css;
 * GSAP cannot tween a `var()` reference, so colour tweens use these.
 * Keep the two in sync.
 */
export const COLORS = {
  paper: "#f7f5f0",
  bone: "#eeeae2",
  sand: "#ddd6c8",
  stone: "#a29b8f",
  ash: "#6a655d",
  charcoal: "#1e1d1b",
  ink: "#0b0b0a",
  moss: "#3c463a",
} as const;
