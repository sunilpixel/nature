"use client";

import { useRef } from "react";
import { VIDEO } from "@/lib/media";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

const LINES = ["The earth", "doesn't rush."];

/**
 * 06 — Cinematic video expansion.
 *
 * Technique: the only box-model animation on the page. A floating 75% × 70%
 * plate with a 32px radius grows to fill the viewport while its corner radius
 * resolves to zero — an effect `transform: scale` cannot produce, because
 * scaling would stretch the video and round the corners along with it.
 *
 * The video itself is only allowed to decode while the section is on screen.
 */
export function VideoExpand() {
  const video = useRef<HTMLVideoElement>(null);

  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const [pin] = q(".ve-pin");
      const [frame] = q(".ve-frame");
      const [overlay] = q(".ve-overlay");
      const lines = q(".ve-line");
      const [meta] = q(".ve-meta");

      // Decode only while the section is on screen. A looping 1080p decode
      // running behind ten other sections is the most expensive thing a page
      // like this can do to a laptop battery.
      const setPlayback = (playing: boolean) => {
        const el = video.current;
        if (!el) return;
        if (playing) void el.play().catch(() => {});
        else el.pause();
      };

      const visibility = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => setPlayback(isActive),
      });

      // onToggle only fires on a *change*, so seed the initial state.
      setPlayback(visibility.isActive);

      if (!motion) {
        gsap.set(frame, {
          width: "100%",
          height: "100%",
          borderRadius: 0,
          scale: 1,
        });
        gsap.set(lines, { opacity: 1, yPercent: 0 });
        gsap.set(overlay, { opacity: 0.5 });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=230%",
            pin,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          frame,
          { width: "75%", height: "70%", borderRadius: 32, scale: 0.9 },
          {
            width: "100%",
            height: "100%",
            borderRadius: 0,
            scale: 1,
            ease: "power2.inOut",
            duration: 1.5,
          },
          0,
        )
        .fromTo(
          overlay,
          { opacity: 0.2 },
          { opacity: 0.55, ease: "none", duration: 1.5 },
          0,
        )
        .fromTo(
          lines,
          { yPercent: 115 },
          { yPercent: 0, ease: "power3.out", duration: 0.8, stagger: 0.14 },
          1,
        )
        .fromTo(
          meta,
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.5 },
          1.6,
        );
    });
  });

  return (
    <section ref={root} className="relative bg-ink">
      <div className="ve-pin relative flex h-svh w-full items-center justify-center overflow-hidden">
        <div
          className="ve-frame lift-box relative overflow-hidden bg-charcoal"
          style={{ width: "75%", height: "70%", borderRadius: 32 }}
        >
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO.src}
            poster={VIDEO.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Two waterfalls falling steadily into a green pool"
          />

          <div className="ve-overlay absolute inset-0 bg-ink opacity-20" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="display text-[clamp(2.25rem,8vw,8rem)] text-paper">
              {LINES.map((line) => (
                <span key={line} className="line-mask">
                  <span className="ve-line block">{line}</span>
                </span>
              ))}
            </h2>
            <span className="ve-meta label mt-[clamp(1.5rem,4vh,3rem)] text-paper/55 opacity-0">
              ( 06 ) — Four billion years, no hurry
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
