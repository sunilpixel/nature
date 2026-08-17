"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, CONDITIONS, type Conditions } from "./gsap";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Setup = (api: {
  /** Media-query context. Everything built inside is auto-reverted. */
  mm: gsap.MatchMedia;
  /** The section root element the animation is scoped to. */
  root: HTMLElement;
  /** Query helper, already scoped to the section root. */
  q: (selector: string) => HTMLElement[];
}) => void;

/**
 * Scopes a section's GSAP work to its own DOM subtree and tears everything
 * down on unmount: `ctx.revert()` kills the tweens and their ScrollTriggers,
 * `mm.revert()` kills the media-query branches.
 *
 * Returns the ref to attach to the section root.
 */
export function useGsap<T extends HTMLElement = HTMLElement>(setup: Setup) {
  const root = useRef<T>(null);
  // The setup closure is re-created on every render; we deliberately only run
  // it once, so read it through a ref instead of listing it as a dependency.
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    let mm: gsap.MatchMedia | undefined;

    const ctx = gsap.context(() => {
      // Layer promotion is rented, not owned. Twelve full-screen sections all
      // declaring `will-change` for the life of the page is more compositor
      // memory than a phone has to give, and a promoted layer that is nowhere
      // near the viewport buys nothing. `data-live` turns on a screen before
      // the section arrives and off a screen after it leaves; the `lift-*`
      // classes in globals.css hang off it.
      const live = ScrollTrigger.create({
        trigger: el,
        start: "top bottom+=100%",
        end: "bottom top-=100%",
        // Refresh last. Nearly every section pins something, and a pinned
        // section is three or four screens tall once ScrollTrigger has added
        // its spacer — measure before that lands and `end` comes back short by
        // the length of the pin, which drops the hint mid-animation.
        refreshPriority: -10,
        onToggle: ({ isActive }) => {
          el.dataset.live = isActive ? "1" : "0";
        },
      });
      // onToggle only fires on a change, so seed the initial state.
      el.dataset.live = live.isActive ? "1" : "0";

      mm = gsap.matchMedia();
      setupRef.current({
        mm,
        root: el,
        q: (selector) => gsap.utils.toArray<HTMLElement>(selector, el),
      });
    }, el);

    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, []);

  return root;
}

export { CONDITIONS };
export type { Conditions };
