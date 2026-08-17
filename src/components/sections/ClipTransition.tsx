"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * 11 — Clip-path transition.
 *
 * Technique: the one long section that is *not* pinned. It holds position with
 * CSS `position: sticky` and lets GSAP scrub the contents, which keeps the
 * scroll rhythm from becoming monotonous after six consecutive pins.
 *
 * A four-point polygon straightens into a rectangle while the plate
 * derotates, settles its scale and comes up from transparent — and the
 * photograph inside runs its own counter-parallax.
 */
const SKEWED =
  "polygon(16% 9%, 93% 0%, 84% 97%, 3% 86%)";
const RECT = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

export function ClipTransition() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const [clip] = q(".ct-clip");
      const [drift] = q(".ct-drift");
      const copy = q(".ct-copy");

      if (!motion) {
        gsap.set(clip, {
          clipPath: RECT,
          scale: 1,
          rotate: 0,
          opacity: 1,
        });
        gsap.set(copy, { opacity: 1, y: 0 });
        return;
      }

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          clip,
          {
            clipPath: SKEWED,
            scale: 1.25,
            rotate: -3.2,
            opacity: 0.35,
          },
          {
            clipPath: RECT,
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 1.6,
          },
          0,
        )
        // Parallax runs the whole length, past the point the frame resolves.
        .fromTo(drift, { yPercent: -8 }, { yPercent: 8, duration: 2.2 }, 0)
        .fromTo(
          copy,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          1.25,
        );
    });
  });

  return (
    <section ref={root} className="relative h-[230vh] bg-bone">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <div
          className="ct-clip lift-clip absolute inset-0"
          style={{ clipPath: SKEWED }}
        >
          <div className="ct-drift absolute inset-x-0 -top-[12%] h-[124%] lift">
            <Image
              src={PHOTOS.cliffRidge}
              alt="Cloud spilling over a green cliff edge as the sun goes down behind it"
              fill
              quality={85}
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-ink/25" />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-5 pb-[12vh] sm:px-8 md:px-12">
          <span className="ct-copy label mb-6 text-paper/60">
            ( 11 ) — The Long Edge
          </span>
          <h2 className="ct-copy display max-w-[13ch] text-[clamp(2.25rem,7.5vw,7.5rem)] text-paper">
            A place gives you its shape slowly.
          </h2>
        </div>
      </div>
    </section>
  );
}
