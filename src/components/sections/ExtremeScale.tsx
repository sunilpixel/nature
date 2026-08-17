"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * 10 — Extreme image scale.
 *
 * Technique: a multi-stop `keyframes` tween. The plate steps 0.3 → 0.5 → 0.8 →
 * 1 → 1.5 → 2.5 rather than interpolating straight from first to last, which
 * gives the growth distinct gears — slow at reading size, then committed.
 * The refrain above it stretches its own tracking as it dissolves.
 */
const STOPS = [0.3, 0.5, 0.8, 1, 1.5, 2.5];

export function ExtremeScale() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const [pin] = q(".es-pin");
      const [plate] = q(".es-plate");
      const [frame] = q(".es-frame");
      const [refrain] = q(".es-refrain");
      const caption = q(".es-caption");

      if (!motion) {
        gsap.set(plate, { scale: 1 });
        gsap.set(frame, { borderRadius: 0 });
        gsap.set(refrain, { opacity: 1 });
        gsap.set(caption, { opacity: 1 });
        return;
      }

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=320%",
            pin,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        })
        // The refrain reads first, then tracks apart as the plate takes over.
        .fromTo(
          refrain,
          { opacity: 0, letterSpacing: "0.42em" },
          { opacity: 1, letterSpacing: "0.62em", duration: 1 },
          0,
        )
        .to(
          refrain,
          { opacity: 0, letterSpacing: "1.6em", duration: 2.4 },
          1.1,
        )
        .fromTo(
          plate,
          { scale: STOPS[0] },
          {
            keyframes: { scale: STOPS.slice(1), easeEach: "none" },
            duration: 4.2,
          },
          0.2,
        )
        .fromTo(frame, { borderRadius: 4 }, { borderRadius: 0, duration: 1 }, 3)
        .fromTo(
          caption,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          3.6,
        );
    });
  });

  return (
    <section ref={root} className="relative bg-paper">
      <div className="es-pin relative flex h-svh w-full items-center justify-center overflow-hidden bg-paper">
        <span className="es-refrain label absolute top-[16vh] left-1/2 z-20 -translate-x-1/2 text-center whitespace-nowrap text-ash">
          Look closer
        </span>

        <div className="es-plate h-[52vmax] w-[42vmax] lift">
          <div className="es-frame relative h-full w-full overflow-hidden bg-bone">
            <Image
              src={PHOTOS.rainLeaves}
              alt="Rain falling through backlit leaves, each drop caught as a point of light"
              fill
              quality={85}
              sizes="(max-width: 768px) 90vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Arrives with the caption; before the plate fills the frame this
            area is bone, and a dark wash over bone would read as a mistake. */}
        <div className="es-caption pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[38%] bg-linear-to-t from-ink/70 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-[9vh] z-20 flex justify-center px-6">
          <p className="es-caption max-w-[36ch] text-center text-[clamp(0.875rem,1vw,1rem)] leading-[1.85] font-light text-paper drop-shadow-[0_2px_18px_rgba(11,11,10,0.6)]">
            ( 10 ) — Everything that looks like scenery is, at this distance,
            weather happening to a leaf.
          </p>
        </div>
      </div>
    </section>
  );
}
