"use client";

import { gsap } from "@/lib/gsap";
import { COLORS } from "@/lib/theme";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

const WORDS = ["WE", "ARE", "PART", "OF", "NATURE."];

/**
 * 02 — Pinned word colour.
 *
 * Technique: a pinned, scrubbed colour tween with a large `stagger`, so scroll
 * progress walks the ink across the sentence one word at a time. Because it is
 * scrubbed rather than played, scrolling back up drains the colour again with
 * no extra code.
 */
export function WordColor() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;
      const words = q(".wc-word");
      const [pin] = q(".wc-pin");
      const tail = q(".wc-tail");

      if (!motion) {
        gsap.set(words, { color: COLORS.ink });
        gsap.set(tail, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(words, { color: COLORS.sand });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=200%",
            pin,
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        })
        .to(
          words,
          {
            color: COLORS.ink,
            ease: "none",
            duration: 1,
            stagger: { each: 0.9 },
          },
          0,
        )
        .fromTo(
          tail,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, ease: "none", duration: 1.1 },
          "-=0.6",
        );
    });
  });

  return (
    <section ref={root} className="relative bg-paper text-ink">
      <div className="wc-pin flex h-svh flex-col items-center justify-center px-5 sm:px-8">
        <span className="label mb-[clamp(2.5rem,7vh,5rem)] text-stone">
          ( 02 ) — Belonging
        </span>

        <h2 className="display max-w-[13ch] text-center text-[clamp(2.75rem,10.5vw,10.5rem)]">
          {WORDS.map((word) => (
            <span key={word} className="wc-word mx-[0.1em] inline-block">
              {word}
            </span>
          ))}
        </h2>

        <p className="wc-tail mt-[clamp(2.5rem,8vh,6rem)] max-w-[46ch] text-center text-[clamp(0.875rem,1vw,1rem)] leading-[1.85] font-light text-ash">
          Not visitors, not caretakers. The same carbon, arranged differently
          and briefly, walking through a room it never built.
        </p>
      </div>
    </section>
  );
}
