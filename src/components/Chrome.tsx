"use client";

import { useEffect } from "react";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Fixed page furniture: wordmark, a hairline scroll meter and the film grain.
 *
 * Everything here sits in `mix-blend-difference` so a single light-coloured
 * mark stays legible over both the bone sections and the near-black ones —
 * no per-section theme switching, no boxes, no borders.
 */
export function Chrome() {
  const root = useGsap<HTMLDivElement>(({ mm, q }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;
      const [meter] = q(".chrome-meter");
      if (!meter) return;

      if (!motion) {
        gsap.set(meter, { scaleX: 1 });
        return;
      }

      gsap.fromTo(
        meter,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );

      // The wordmark row arrives after the hero title has landed.
      gsap.from(q(".chrome-fade"), {
        opacity: 0,
        y: -12,
        duration: 1.2,
        delay: 1.2,
        ease: "power2.out",
        stagger: 0.12,
      });
    });
  });

  return (
    <div ref={root}>
      <div className="grain" aria-hidden />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-100 mix-blend-difference">
        <div className="flex items-baseline justify-between px-5 pt-5 text-paper sm:px-8 sm:pt-7 md:px-12">
          <a
            href="#top"
            className="chrome-fade label pointer-events-auto tracking-[0.5em] transition-opacity duration-500 hover:opacity-60"
          >
            Wild
          </a>
          <span className="chrome-fade label hidden opacity-70 sm:block">
            Nature Beyond Time
          </span>
          <span className="chrome-fade label opacity-70">MMXXVI</span>
        </div>
      </header>

      {/* Scroll meter — one hairline along the bottom of the viewport. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-100 mix-blend-difference">
        <div className="h-px w-full bg-paper/15">
          <div className="chrome-meter h-full w-full origin-left scale-x-0 bg-paper" />
        </div>
      </div>
    </div>
  );
}

/**
 * Images decode after first paint, which changes document height and leaves
 * every pinned trigger measuring against stale numbers. Refresh once the page
 * and its webfonts have actually settled.
 */
export function ScrollSync() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (document.readyState === "complete") {
      requestAnimationFrame(refresh);
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    document.fonts?.ready.then(refresh).catch(() => {});

    return () => window.removeEventListener("load", refresh);
  }, []);

  return null;
}
