"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * 12 — Final cinematic reveal.
 *
 * Technique: the page opened with a played timeline and it closes with one.
 * After eleven scrubbed sections, an entrance that runs at its own speed —
 * triggered once, `toggleActions` set so it replays if you come back up —
 * lands with far more weight than another scrub would. Each line arrives from
 * a different edge inside its own mask.
 */
export function FinalReveal() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const [drift] = q(".fn-drift");
      const [lineA] = q(".fn-line-a");
      const [lineB] = q(".fn-line-b");
      const [lineC] = q(".fn-line-c");
      const [cta] = q(".fn-cta");
      const [rule] = q(".fn-rule");
      const [meta] = q(".fn-meta");

      if (!motion) {
        gsap.set([lineA, lineB, lineC], { xPercent: 0, yPercent: 0 });
        gsap.set([cta, meta], { opacity: 1, y: 0 });
        gsap.set(rule, { scaleX: 1 });
        return;
      }

      // Slow drift across the whole approach, so the picture is already
      // breathing before the words arrive.
      gsap.fromTo(
        drift,
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 4,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap
        .timeline({
          defaults: { ease: "power3.out", duration: 1.5 },
          scrollTrigger: {
            trigger: root,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(lineA, { xPercent: -115 }, { xPercent: 0 }, 0)
        .fromTo(lineB, { yPercent: 115 }, { yPercent: 0 }, 0.18)
        .fromTo(lineC, { xPercent: 115 }, { xPercent: 0 }, 0.36)
        .fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.3, ease: "power2.inOut" },
          0.9,
        )
        .fromTo(
          [cta, meta],
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 },
          1.15,
        );
    });
  });

  return (
    <section ref={root} className="relative h-svh min-h-[620px] w-full overflow-hidden bg-ink">
      <div className="fn-drift absolute inset-x-0 -top-[10%] h-[122%] lift">
        <Image
          src={PHOTOS.sunriseMeadow}
          alt="Sunrise burning the mist off a meadow at the foot of the mountains"
          fill
          quality={85}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-ink/50 via-ink/20 to-ink/75" />
      <div className="vignette" />

      <div className="relative z-10 flex h-full flex-col justify-center px-5 sm:px-8 md:px-12">
        <h2 className="display text-[clamp(3.25rem,15vw,15rem)] text-paper">
          <span className="line-mask">
            <span className="fn-line-a block">Return</span>
          </span>
          <span className="line-mask">
            <span className="fn-line-b block pl-[8vw]">to</span>
          </span>
          <span className="line-mask">
            <span className="fn-line-c block">Nature.</span>
          </span>
        </h2>

        <div className="fn-rule mt-[clamp(2rem,6vh,4rem)] h-px w-full origin-left scale-x-0 bg-paper/25" />

        <div className="mt-[clamp(1.75rem,4vh,3rem)] flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <a
            href="#top"
            className="fn-cta group inline-flex items-center gap-5 text-paper"
          >
            <span className="label">Explore the wild</span>
            <span className="relative block h-px w-[clamp(3rem,8vw,7rem)] bg-paper/50">
              <span className="absolute top-1/2 right-0 block h-px w-3 origin-right -translate-y-[3px] rotate-45 bg-paper transition-transform duration-700 ease-cinematic group-hover:translate-x-2" />
              <span className="absolute inset-0 block origin-left scale-x-0 bg-paper transition-transform duration-700 ease-cinematic group-hover:scale-x-100" />
            </span>
          </a>

          <p className="fn-meta max-w-[34ch] text-[clamp(0.8125rem,0.95vw,0.9375rem)] leading-[1.8] font-light text-paper/60">
            It was never somewhere else. Close this, go outside, and it is
            already happening without you.
          </p>
        </div>
      </div>

      <footer className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-5 pb-[3.5vh] sm:px-8 md:px-12">
        <span className="label text-paper/40">
          Wild<span className="hidden sm:inline"> — Nature Beyond Time</span>
        </span>
        <span className="label text-paper/40">Photography — Unsplash</span>
      </footer>
    </section>
  );
}
