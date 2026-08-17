"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * 09 — Fog reveal.
 *
 * Technique: a scrubbed `filter: blur()` resolve. Three gradient fog banks sit
 * over the photograph, each on its own vector and rate, so the weather appears
 * to have its own wind rather than sliding as one sheet with the scroll.
 */
export function FogReveal() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion, mobile } = context.conditions as Conditions;

      const [pin] = q(".fr-pin");
      const [plate] = q(".fr-plate");
      const [fogA] = q(".fr-fog-a");
      const [fogB] = q(".fr-fog-b");
      const [fogC] = q(".fr-fog-c");
      const reveal = q(".fr-reveal");

      if (!motion) {
        gsap.set(plate, { filter: "blur(0px)", opacity: 1, scale: 1 });
        gsap.set([fogA, fogB, fogC], { opacity: 0 });
        gsap.set(reveal, { opacity: 1, y: 0 });
        return;
      }

      // A 20px blur over a full-screen photo is the heaviest filter here;
      // phones get a shallower start.
      const startBlur = mobile ? 14 : 20;

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=250%",
            pin,
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          plate,
          { filter: `blur(${startBlur}px)`, opacity: 0.3, scale: 1.14 },
          { filter: "blur(0px)", opacity: 1, scale: 1, duration: 1.6 },
          0,
        )
        .fromTo(
          fogA,
          { xPercent: -22, yPercent: 6, opacity: 0.85 },
          { xPercent: 34, yPercent: -4, opacity: 0, duration: 2 },
          0,
        )
        .fromTo(
          fogB,
          { xPercent: 28, yPercent: -10, opacity: 0.7, scale: 1 },
          { xPercent: -30, yPercent: 8, opacity: 0, scale: 1.55, duration: 2 },
          0,
        )
        .fromTo(
          fogC,
          { yPercent: 26, opacity: 0.6 },
          { yPercent: -22, opacity: 0, duration: 2 },
          0,
        )
        .fromTo(
          reveal,
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          1.35,
        );
    });
  });

  return (
    <section ref={root} className="relative bg-charcoal">
      <div className="fr-pin relative h-svh w-full overflow-hidden bg-charcoal">
        <div className="fr-plate lift-filter absolute inset-0">
          <Image
            src={PHOTOS.cloudSea}
            alt="Snow peaks standing above a sea of cloud at first light"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Fog banks — gradients, so they cost nothing but a composite. */}
        <div
          className="fr-fog-a pointer-events-none absolute -inset-[40%] lift"
          aria-hidden
          style={{
            background:
              "radial-gradient(58% 40% at 40% 62%, rgba(238,234,226,0.85) 0%, rgba(238,234,226,0) 70%)",
          }}
        />
        <div
          className="fr-fog-b pointer-events-none absolute -inset-[40%] lift"
          aria-hidden
          style={{
            background:
              "radial-gradient(50% 36% at 64% 40%, rgba(221,214,200,0.8) 0%, rgba(221,214,200,0) 68%)",
          }}
        />
        <div
          className="fr-fog-c pointer-events-none absolute -inset-[40%] lift"
          aria-hidden
          style={{
            background:
              "linear-gradient(to top, rgba(247,245,240,0.9) 0%, rgba(247,245,240,0.35) 42%, rgba(247,245,240,0) 78%)",
          }}
        />

        <div className="vignette" />

        {/* A soft weight under the type — the cloud sea is bright enough that
            paper-coloured text would otherwise disappear into it. */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(46% 34% at 50% 50%, rgba(11,11,10,0.5) 0%, rgba(11,11,10,0) 72%)",
          }}
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <span className="fr-reveal label mb-6 text-paper/60">
            ( 09 ) — Visibility
          </span>
          <h2 className="fr-reveal display text-[clamp(2.5rem,9vw,9rem)] text-paper">
            Look closer.
          </h2>
          <p className="fr-reveal mt-7 max-w-[40ch] text-[clamp(0.875rem,1vw,1rem)] leading-[1.85] font-light text-paper/65">
            The weather is not in the way. It is the thing being photographed.
          </p>
        </div>
      </div>
    </section>
  );
}
