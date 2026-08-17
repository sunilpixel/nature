"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * 08 — Horizontal gallery.
 *
 * Technique: vertical scroll is converted into horizontal travel, and each
 * frame then parallaxes *against* that travel using `containerAnimation` —
 * ScrollTrigger's mechanism for triggering off an element's position inside a
 * horizontally-tweened track rather than off the page scroll. Distances are
 * measured in functions so a resize re-derives them instead of freezing the
 * first measurement.
 */
/**
 * Heights stay inside the track's vertical padding so no plate can ever run
 * under the section header or push its caption out of the pinned frame.
 */
const PLATES = [
  {
    src: PHOTOS.snowRange,
    index: "01",
    title: "Mountain",
    alt: "A snow-covered range under a cold blue dusk",
    className: "h-[42vh] w-[74vw] md:h-[58vh] md:w-[42vw]",
    align: "self-start",
  },
  {
    src: PHOTOS.surf,
    index: "02",
    title: "Water",
    alt: "Surf unrolling onto pale sand from above",
    className: "h-[52vh] w-[62vw] md:h-[64vh] md:w-[27vw]",
    align: "self-end",
  },
  {
    src: PHOTOS.moonMountain,
    index: "03",
    title: "Silence",
    alt: "A dark mountain at dusk beneath a thin moon",
    className: "h-[36vh] w-[80vw] md:h-[44vh] md:w-[38vw]",
    align: "self-center",
  },
  {
    src: PHOTOS.goldenRidge,
    index: "04",
    title: "Light",
    alt: "Low sun raking across a forested ridge",
    className: "h-[48vh] w-[70vw] md:h-[62vh] md:w-[34vw]",
    align: "self-start",
  },
  {
    src: PHOTOS.lion,
    index: "05",
    title: "Wild",
    alt: "A lion mid-stride through dry grass",
    className: "h-[42vh] w-[76vw] md:h-[52vh] md:w-[40vw]",
    align: "self-end",
  },
  {
    src: PHOTOS.waterfall,
    index: "06",
    title: "Depth",
    alt: "A tall waterfall dropping through a mossy gorge",
    className: "h-[54vh] w-[58vw] md:h-[66vh] md:w-[24vw]",
    align: "self-center",
  },
  {
    src: PHOTOS.poppyField,
    index: "07",
    title: "Drift",
    alt: "Poppies moving against a blown-out white sky",
    className: "h-[36vh] w-[78vw] md:h-[46vh] md:w-[36vw]",
    align: "self-start",
  },
  {
    src: PHOTOS.redRock,
    index: "08",
    title: "Stone",
    alt: "A red rock massif catching the last light",
    className: "h-[46vh] w-[72vw] md:h-[58vh] md:w-[30vw]",
    align: "self-end",
  },
] as const;

export function HorizontalGallery() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const [pin] = q(".hg-pin");
      const [track] = q(".hg-track");
      const plates = q(".hg-plate");
      if (!track || !pin) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      if (!motion) {
        // Hand the axis back to the reader: a real horizontal scrollbar,
        // no pinning, no hijack. gsap.set is used rather than a direct style
        // write so the context reverts it cleanly.
        gsap.set(pin, { overflowX: "auto", overflowY: "hidden" });
        return;
      }

      const travel = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          pin,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Each photograph drifts inside its own frame as it crosses the screen.
      plates.forEach((plate) => {
        const image = plate.querySelector<HTMLElement>(".hg-image");
        if (!image) return;

        gsap.fromTo(
          image,
          { xPercent: -9, scale: 1.22 },
          {
            xPercent: 9,
            scale: 1.22,
            ease: "none",
            scrollTrigger: {
              trigger: plate,
              containerAnimation: travel,
              start: "left right",
              end: "right left",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });
  });

  return (
    <section ref={root} className="relative bg-paper">
      <div className="hg-pin relative flex h-svh w-full items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[7vh] z-20 flex justify-between px-5 sm:px-8 md:px-12">
          <span className="label text-ash">( 08 ) — An Index of Places</span>
          <span className="label hidden text-ash md:block">
            Scroll to travel →
          </span>
        </div>

        {/* The padding is the layout: it reserves the header band at the top
            and the caption run-off at the bottom, in one declaration. */}
        <div className="hg-track flex h-full items-center gap-[8vw] px-[10vw] py-[14vh] lift md:py-[12vh]">
          {PLATES.map((plate) => (
            <figure
              key={plate.index}
              className={`hg-plate relative flex shrink-0 flex-col ${plate.className} ${plate.align}`}
            >
              {/* The image takes the slack and the caption keeps its own
                  space — otherwise a bottom-aligned plate pushes its caption
                  past the pinned container and it gets clipped away. */}
              <div className="relative min-h-0 flex-1 overflow-hidden bg-bone">
                <div className="hg-image absolute inset-0 lift">
                  <Image
                    src={plate.src}
                    alt={plate.alt}
                    fill
                    quality={78}
                    sizes="(max-width: 768px) 80vw, 42vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <figcaption className="mt-4 flex shrink-0 items-baseline gap-4">
                <span className="label text-stone">{plate.index}</span>
                <span className="h-px w-6 bg-sand" />
                <span className="display text-[clamp(1.125rem,1.9vw,1.75rem)] text-ink">
                  {plate.title}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
