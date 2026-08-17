"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * The window: a stylised tree, drawn as a crown of overlapping ellipses over a
 * tapered trunk inside a square 100×100 box. Inline SVG rather than a file, so
 * it costs no request; black is the SVG default fill, so no `fill` attributes
 * are needed either.
 *
 * The box centre (50,50) sits deep inside the crown on purpose — that is what
 * lets the shape be scaled up later without ever tearing a hole through the
 * middle of the frame.
 */
const TREE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M45.4 46c-.6 14-1.8 26-5 40-.8 3.4-2.2 5.6-4.4 7h28c-2.2-1.4-3.6-3.6-4.4-7-3.2-14-4.4-26-5-40z'/%3E%3Cellipse cx='50' cy='32' rx='24' ry='21'/%3E%3Cellipse cx='29' cy='41' rx='17' ry='14'/%3E%3Cellipse cx='71' cy='41' rx='17' ry='14'/%3E%3Cellipse cx='38' cy='19' rx='14' ry='12'/%3E%3Cellipse cx='63' cy='20' rx='13' ry='11'/%3E%3Cellipse cx='35' cy='52' rx='13' ry='10'/%3E%3Cellipse cx='65' cy='51' rx='13' ry='10'/%3E%3Cellipse cx='50' cy='53' rx='16' ry='11'/%3E%3Cellipse cx='50' cy='95' rx='21' ry='2.4'/%3E%3C/svg%3E";

const MASK = `url("${TREE_SVG}")`;

/**
 * Resting size of the mask box. It is square and the tree keeps its own aspect
 * ratio inside it, so one number describes the whole shape — but that number
 * has to answer to both axes: sized off the height alone the crown runs off the
 * sides of a phone, sized off the width alone the tree is lost in the middle of
 * a tall screen. Whichever constraint bites first wins.
 */
const REST = { ofHeight: 0.76, ofWidth: 1.06 } as const;

/** Multiples of that resting size at each beat of the reveal. */
const GROWTH = { start: 1, open: 2, end: 2.83 } as const;

/** The CSS equivalent, for the first paint before GSAP has measured anything. */
const REST_CSS = `min(${REST.ofHeight * 100}vh, ${REST.ofWidth * 100}vw)`;

/**
 * 04 — Tree reveal.
 *
 * Technique: an SVG mask, not a clip-path. The photograph sits behind a
 * tree-shaped window that grows as you scroll while the picture counter-scales
 * 1.24 → 1 underneath, so the tree opens and the image settles together.
 *
 * The mask is grown by animating `mask-size` rather than by transforming the
 * masked layer: a transformed layer is rasterised once and stretched, which
 * would fray the silhouette, whereas re-sizing re-renders the SVG at every step
 * and keeps the edge razor-sharp.
 *
 * Growth stops at 2.8× the resting size — past that the mask raster gets
 * expensive for no visible gain — and an unmasked copy of the same plate fades
 * up underneath to carry the last of the reveal out to full bleed. Both copies
 * point at one `src`, so it is a single request and a single decode.
 */
export function LiquidReveal() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const [pin] = q(".lr-pin");
      const [tree] = q(".lr-tree");
      const [full] = q(".lr-full");
      const zooms = q(".lr-zoom");
      const caption = q(".lr-caption");

      if (!motion) {
        gsap.set(tree, { opacity: 0 });
        gsap.set(full, { opacity: 1 });
        gsap.set(zooms, { scale: 1 });
        gsap.set(caption, { opacity: 1, y: 0 });
        return;
      }

      // The box is written in pixels rather than viewport units so the two
      // constraints can be compared against each other, and re-derived on
      // refresh — a phone turned from portrait to landscape swaps which one of
      // them is doing the limiting.
      const growth = { of: GROWTH.start };
      const draw = () => {
        const edge = `${
          growth.of *
          Math.min(
            window.innerHeight * REST.ofHeight,
            window.innerWidth * REST.ofWidth,
          )
        }px`;
        gsap.set(tree, {
          maskSize: `${edge} ${edge}`,
          webkitMaskSize: `${edge} ${edge}`,
        });
      };

      draw();

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=230%",
            pin,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: draw,
          },
        })
        .to(growth, { of: GROWTH.open, duration: 1.2, onUpdate: draw }, 0)
        .fromTo(zooms, { scale: 1.24 }, { scale: 1, duration: 1.45 }, 0)
        // The crown keeps pushing outward underneath the fade, so the corners
        // fill in because the tree grew into them, not because a rectangle
        // appeared over the top of it.
        .to(growth, { of: GROWTH.end, duration: 0.6, onUpdate: draw }, 1.2)
        .fromTo(full, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.25)
        // Once the plate below is fully opaque the masked copy is redundant —
        // dropping it stops the browser re-rendering the mask every frame for
        // the rest of the section.
        .set(tree, { opacity: 0 }, 1.78)
        // Held back until the frame is essentially rectangular. Any earlier
        // and the first characters of each line sit on bone, not on the
        // photograph — which reads as clipped text rather than as a reveal.
        .fromTo(
          caption,
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          1.6,
        );
    });
  });

  return (
    <section ref={root} className="relative bg-bone">
      <div className="lr-pin relative flex h-svh w-full items-center justify-center overflow-hidden">
        {/* The tree-shaped window. */}
        <div
          className="lr-tree absolute inset-0"
          style={{
            maskImage: MASK,
            WebkitMaskImage: MASK,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskSize: `${REST_CSS} ${REST_CSS}`,
            WebkitMaskSize: `${REST_CSS} ${REST_CSS}`,
          }}
        >
          <Plate />
        </div>

        {/* The resolve. Identical pixels, no mask — so the cross-fade is
            invisible everywhere the tree already reached, and only the bone
            around it changes. */}
        <div className="lr-full lift-fade absolute inset-0 opacity-0">
          <Plate decorative />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-5 pb-[11vh] sm:px-8 md:px-12">
          <span className="lr-caption label mb-5 text-paper/60">
            ( 04 ) — Water finds its own shape
          </span>
          <p className="lr-caption display max-w-[14ch] text-[clamp(2rem,6vw,5.5rem)] text-paper">
            Nothing in it moves in straight lines.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * The photograph with its tint and foot scrim. Rendered twice — once inside the
 * mask, once behind it — and both copies must stay pixel-identical or the
 * cross-fade shows. The scrims live in here rather than over the top for the
 * same reason they always did: outside the plate they would bleed onto bone.
 */
function Plate({ decorative = false }: { decorative?: boolean }) {
  return (
    <div className="lr-zoom lift absolute inset-0">
      <Image
        src={PHOTOS.lakeEdge}
        alt={
          decorative
            ? ""
            : "Meltwater meeting the ragged edge of a forest, seen from above"
        }
        aria-hidden={decorative || undefined}
        fill
        quality={82}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/15" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-t from-ink/75 to-transparent" />
    </div>
  );
}
