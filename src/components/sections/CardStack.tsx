"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * 05 — Luxury card stack.
 *
 * Technique: one master timeline drives five overlapping plates. Each arrives
 * from a different edge, settles at its own resting angle, and pushes the
 * previous plate back — scale down, shift up, darken. `zIndex` is stepped by
 * `tl.set()` inside the timeline rather than by CSS, so the stacking order
 * unwinds correctly when the scroll reverses.
 */
const CARDS = [
  {
    src: PHOTOS.mirrorLake,
    index: "01",
    title: "Still Water",
    place: "Lake Louise",
    alt: "A glacial lake holding a perfect mirror image of the peaks above it",
    // Where the plate comes from, and the angle it settles at.
    from: { yPercent: 130, xPercent: 0, rotate: 6 },
    rest: -3.5,
  },
  {
    src: PHOTOS.waterfall,
    index: "02",
    title: "Long Fall",
    place: "Columbia Gorge",
    alt: "A waterfall dropping in two stages through a mossy basalt gorge",
    from: { yPercent: 0, xPercent: -145, rotate: -9 },
    rest: 3,
  },
  {
    src: PHOTOS.elkValley,
    index: "03",
    title: "The Resident",
    place: "Yosemite Valley",
    alt: "An elk grazing in a meadow beneath a granite dome",
    from: { yPercent: -135, xPercent: 0, rotate: 8 },
    rest: -2,
  },
  {
    src: PHOTOS.surf,
    index: "04",
    title: "White Noise",
    place: "North Atlantic",
    alt: "Surf breaking onto pale sand, photographed from directly above",
    from: { yPercent: 0, xPercent: 148, rotate: 10 },
    rest: 4.5,
  },
  {
    src: PHOTOS.ridgeLayers,
    index: "05",
    title: "Distance",
    place: "Blue Ridge",
    alt: "Successive mountain ridges fading into pale haze",
    from: { yPercent: 128, xPercent: -60, rotate: -7 },
    rest: -1.5,
  },
] as const;

export function CardStack() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const cards = q(".cs-card");
      const shades = q(".cs-shade");
      const [pin] = q(".cs-pin");

      if (!motion) {
        cards.forEach((card, i) => {
          gsap.set(card, {
            xPercent: 0,
            yPercent: 0,
            rotate: CARDS[i].rest,
            scale: 1,
            zIndex: 10 + i,
          });
        });
        gsap.set(shades, { opacity: 0 });
        return;
      }

      // First plate is already resting; the rest wait off-screen.
      gsap.set(cards[0], { rotate: CARDS[0].rest, zIndex: 10 });
      cards.slice(1).forEach((card, i) => {
        gsap.set(card, { ...CARDS[i + 1].from, scale: 1.04, zIndex: 1 });
      });
      gsap.set(shades, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 1 },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=420%",
          pin,
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
      });

      cards.slice(1).forEach((card, i) => {
        const at = i;
        const prev = cards[i];

        tl.set(card, { zIndex: 10 + i + 1 }, at)
          .to(
            card,
            {
              xPercent: 0,
              yPercent: 0,
              rotate: CARDS[i + 1].rest,
              scale: 1,
            },
            at,
          )
          // The plate underneath recedes instead of simply being covered.
          .to(
            prev,
            { scale: 0.9, yPercent: -7, rotate: CARDS[i].rest - 2.5 },
            at,
          )
          .to(shades[i], { opacity: 0.5 }, at);
      });
    });
  });

  return (
    <section ref={root} className="relative bg-bone">
      <div className="cs-pin relative flex h-svh w-full items-center justify-center overflow-hidden">
        {/* Plates pass under this row on their way in — same reasoning as the
            gallery header. */}
        <div className="pointer-events-none absolute inset-x-0 top-[12vh] z-30 flex justify-between px-5 mix-blend-difference sm:px-8 md:px-12">
          <span className="label text-paper">( 05 ) — Five Places</span>
          <span className="label hidden text-paper sm:block">
            Held, then let go
          </span>
        </div>

        {CARDS.map((card) => (
          <figure
            key={card.index}
            className="cs-card absolute aspect-3/4 w-[min(76vw,21rem)] lift md:w-[min(38vw,26rem)]"
          >
            <div className="relative h-full w-full overflow-hidden bg-charcoal shadow-[0_40px_120px_-40px_rgba(11,11,10,0.55)]">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                quality={80}
                sizes="(max-width: 768px) 74vw, 34vw"
                className="object-cover"
              />
              <div className="cs-shade absolute inset-0 bg-ink" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                <span className="display text-[clamp(1.25rem,2.2vw,1.875rem)] text-paper">
                  {card.title}
                </span>
                <span className="label pb-1 text-paper/60">{card.place}</span>
              </figcaption>
              <span className="label absolute top-5 left-5 text-paper/70 md:top-6 md:left-6">
                {card.index}
              </span>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
