"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * 07 — Portal transition.
 *
 * Technique: the aperture is scaled 0.05 → 15 (a 300× growth), but it is the
 * *mask* that scales, not the picture. Driving `clip-path: circle()` from that
 * scale factor keeps the photograph pinned at its native size and pixel-sharp
 * the whole way through — scaling a real element by 15 would hand the
 * compositor a 1500vmax layer to rasterise, and it would tear or blur.
 *
 * Growth is exponential (0.05 · 300^p) so the aperture appears to open at a
 * constant rate rather than sitting still and then lunging at the end.
 */
const START_SCALE = 0.05;
const END_SCALE = 15;
/** Aperture radius in vmax at scale = 1. 15 × 4.8vmax clears any viewport. */
const RADIUS_AT_UNIT_SCALE = 4.8;

export function Portal() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const [pin] = q(".pt-pin");
      const [portal] = q(".pt-portal");
      const [zoom] = q(".pt-zoom");
      const before = q(".pt-before");
      const after = q(".pt-after");

      const apply = (scale: number) => {
        const vmax = Math.max(window.innerWidth, window.innerHeight) / 100;
        gsap.set(portal, {
          clipPath: `circle(${scale * RADIUS_AT_UNIT_SCALE * vmax}px at 50% 50%)`,
        });
      };

      if (!motion) {
        apply(END_SCALE);
        gsap.set(before, { opacity: 0 });
        gsap.set(after, { opacity: 1, y: 0 });
        gsap.set(zoom, { scale: 1 });
        return;
      }

      const aperture = { progress: 0 };
      const ratio = END_SCALE / START_SCALE;

      apply(START_SCALE);

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=260%",
            pin,
            scrub: 1.2,
            invalidateOnRefresh: true,
            // Viewport rotation changes vmax; re-derive from current progress.
            onRefresh: () => apply(START_SCALE * ratio ** aperture.progress),
          },
        })
        .to(
          aperture,
          {
            progress: 1,
            duration: 1,
            onUpdate: () => apply(START_SCALE * ratio ** aperture.progress),
          },
          0,
        )
        .fromTo(zoom, { scale: 1.28 }, { scale: 1, duration: 1.25 }, 0)
        .to(before, { opacity: 0, duration: 0.35 }, 0)
        .fromTo(
          after,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 },
          0.82,
        );
    });
  });

  return (
    <section ref={root} className="relative bg-ink">
      <div className="pt-pin relative h-svh w-full overflow-hidden bg-ink">
        {/* What the aperture opens out of. */}
        {/* Sits above centre so the aperture opens into clear space rather
            than through the middle of a sentence. */}
        <div className="pt-before absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 pb-[32vh] text-center">
          <span className="label text-paper/45">( 07 ) — Passage</span>
          <p className="display max-w-[18ch] text-[clamp(1.5rem,3.4vw,2.75rem)] text-paper/70">
            Every landscape begins as a point of light.
          </p>
        </div>

        {/* What it opens into. */}
        <div
          className="pt-portal lift-clip absolute inset-0"
          style={{ clipPath: "circle(0px at 50% 50%)" }}
        >
          <div className="pt-zoom relative h-full w-full lift">
            <Image
              src={PHOTOS.alpenglow}
              alt="First light turning a ring of peaks pink above a still lake"
              fill
              quality={85}
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-ink/20" />
          <div className="vignette" />
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(44% 32% at 50% 50%, rgba(11,11,10,0.55) 0%, rgba(11,11,10,0) 74%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="pt-after label mb-5 text-paper/60">
              Moraine — 51.3°N
            </span>
            <p className="pt-after display max-w-[14ch] text-[clamp(2.25rem,7vw,7rem)] text-paper">
              And opens all at once.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
