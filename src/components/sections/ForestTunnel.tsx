"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

/**
 * 03 — Forest depth tunnel.
 *
 * Technique: differential parallax. Three photographic planes share one
 * scrubbed timeline but scale at very different rates, and the nearest plane
 * also defocuses as it passes — the depth-of-field cue is what sells travel
 * rather than zoom. Two fog planes drift on independent vectors so the
 * atmosphere never moves in lockstep with the trees.
 */
export function ForestTunnel() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion, mobile } = context.conditions as Conditions;

      const [pin] = q(".ft-pin");
      const [back] = q(".ft-back");
      const [mid] = q(".ft-mid");
      const [front] = q(".ft-front");
      const [fogA] = q(".ft-fog-a");
      const [fogB] = q(".ft-fog-b");
      const copy = q(".ft-copy");

      if (!motion) {
        gsap.set(front, { opacity: 0 });
        gsap.set(copy, { opacity: 1, y: 0 });
        return;
      }

      // Scaling a 4K photo past ~3× is expensive on a phone GPU, and a wide
      // blur radius over a full-screen plane is expensive on any GPU — the
      // cost of a blur grows with the area it covers, and this plane is
      // already the largest thing on screen.
      const near = mobile ? 2.8 : 4.2;
      const haze = mobile ? 9 : 16;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=280%",
          pin,
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(back, { scale: 1 }, { scale: 1.42 }, 0)
        .fromTo(mid, { scale: 1.04 }, { scale: 2.15 }, 0)
        .fromTo(
          front,
          { scale: 1.25, filter: "blur(3px)", opacity: 0.78 },
          { scale: near, filter: `blur(${haze}px)`, opacity: 0 },
          0,
        )
        .fromTo(
          fogA,
          { xPercent: -18, yPercent: 4, opacity: 0.24 },
          { xPercent: 26, yPercent: -8, opacity: 0.46 },
          0,
        )
        .fromTo(
          fogB,
          { xPercent: 22, yPercent: -6, opacity: 0.42, scale: 1 },
          { xPercent: -24, yPercent: 10, opacity: 0.18, scale: 1.9 },
          0,
        )
        .fromTo(
          copy,
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          0.75,
        )
        .to(copy, { opacity: 0, y: -28, duration: 0.7 }, 2.15);
    });
  });

  return (
    <section ref={root} className="relative bg-ink">
      <div className="ft-pin relative h-svh w-full overflow-hidden">
        {/* Far plane — the forest dissolving into weather. */}
        <div className="ft-back absolute inset-0 lift">
          <Image
            src={PHOTOS.forestFog}
            alt=""
            aria-hidden
            fill
            quality={80}
            sizes="100vw"
            className="object-cover opacity-70"
          />
        </div>

        {/* Mid plane — the corridor you are moving down. */}
        <div className="ft-mid absolute inset-0 lift">
          <Image
            src={PHOTOS.forestPath}
            alt="A track running away between tall trees, lit from behind"
            fill
            quality={82}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/25" />
        </div>

        {/* Near plane — canopy passing the lens, defocusing as it goes.
            Masked open in the middle so it frames the corridor like foliage
            at the edge of frame rather than fogging the whole shot. */}
        <div
          className="ft-front lift-filter absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(circle at 50% 50%, transparent 14%, black 58%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, transparent 14%, black 58%)",
          }}
        >
          {/* Never in focus for a single frame — it enters at blur(3px) and
              leaves blurred harder still — so a full-width source would be
              detail nobody can see. */}
          <Image
            src={PHOTOS.forestAerial}
            alt=""
            aria-hidden
            fill
            quality={70}
            sizes="55vw"
            className="object-cover"
          />
        </div>

        {/* Fog planes: pure gradient, so they cost nothing to move. */}
        <div
          className="ft-fog-a pointer-events-none absolute -inset-[35%] lift"
          aria-hidden
          style={{
            background:
              "radial-gradient(52% 40% at 42% 58%, rgba(238,234,226,0.55) 0%, rgba(238,234,226,0) 72%)",
          }}
        />
        <div
          className="ft-fog-b pointer-events-none absolute -inset-[35%] lift"
          aria-hidden
          style={{
            background:
              "radial-gradient(46% 34% at 62% 38%, rgba(210,214,205,0.5) 0%, rgba(210,214,205,0) 70%)",
          }}
        />

        <div className="vignette" />

        {/* Weight under the type. The fog planes are bone-coloured and lift the
            midtones exactly where the headline sits. */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(44% 32% at 50% 50%, rgba(11,11,10,0.62) 0%, rgba(11,11,10,0) 74%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <span className="ft-copy label mb-6 text-paper/55">
            ( 03 ) — Depth
          </span>
          <p className="ft-copy display max-w-[15ch] text-[clamp(2rem,6.5vw,6rem)] text-paper">
            The forest has no edges, only distances.
          </p>
        </div>
      </div>
    </section>
  );
}
