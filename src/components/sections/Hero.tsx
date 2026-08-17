"use client";

import Image from "next/image";
import { PHOTOS } from "@/lib/media";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsap, CONDITIONS, type Conditions } from "@/lib/useGsap";

const TITLE = "WILD";

/**
 * How long the reveal will wait on the webfont and the first frame before
 * playing regardless — generous enough to cover a cold connection, short
 * enough that one stalled asset can never leave the hero sitting empty.
 */
const ASSET_GRACE = 2.5;

/**
 * 01 — Cinematic hero.
 *
 * Technique: a timed intro timeline (the only un-scrubbed reveal on the page)
 * layered over a scrubbed parallax. Two nested wrappers keep the two scale
 * animations from fighting over one transform: the inner element owns the
 * 1.15 → 1 settle, the outer owns the scroll drift.
 *
 * The `from` values below are the whole truth about frame zero; CSS only keeps
 * `.hero-content` dark until this runs (see globals.css), because a server paint
 * of the finished frame followed by hydration hiding it again is the reveal
 * played twice. The copy is unhidden here, before the timelines are built.
 */
export function Hero() {
  const root = useGsap<HTMLElement>(({ mm, q, root }) => {
    mm.add(CONDITIONS, (context) => {
      const { motion } = context.conditions as Conditions;

      const chars = q(".hero-char");
      const rises = q(".hero-rise");
      const [zoom] = q(".hero-zoom");
      const [drift] = q(".hero-drift");
      const [content] = q(".hero-content");
      const [scrim] = q(".hero-scrim");
      const [cue] = q(".hero-cue");
      const [cueLine] = q(".hero-cue-line");

      // Hand the copy back its opacity. Both branches do this and neither
      // touches the copy's transform, so a reader who never gets an intro sees
      // the finished frame rather than a timeline's start state.
      gsap.set(content, { opacity: 1 });

      if (!motion) {
        gsap.set(cue, { opacity: 1 });
        gsap.set(zoom, { scale: 1 });
        return;
      }

      // — Scroll. The hero dissolves rather than scrolling away. Built first
      // and live immediately: the dissolve has to track the scrollbar even if
      // the reader starts moving before the intro has had its chance to play.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })
        .to(drift, { yPercent: 10, scale: 1.1, ease: "none" }, 0)
        .to(content, { yPercent: -18, opacity: 0, ease: "power1.in" }, 0)
        .to(scrim, { opacity: 1, ease: "none" }, 0);

      // — Intro. Plays once, on its own clock — but built paused, and released
      // by the asset gate at the bottom of this block.
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .fromTo(
          zoom,
          { scale: 1.15 },
          { scale: 1, duration: 2.8, ease: "power2.out" },
          0,
        )
        .fromTo(
          chars,
          { yPercent: 118 },
          { yPercent: 0, duration: 1.6, stagger: 0.085 },
          0.35,
        )
        .fromTo(
          rises,
          { yPercent: 130, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.14 },
          0.95,
        )
        .fromTo(cue, { opacity: 0 }, { opacity: 1, duration: 1.1 }, 1.7);

      // The cue line runs on a loop of its own — the one ambient motion here.
      const cueLoop = gsap.fromTo(
        cueLine,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.9,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 0.35,
          transformOrigin: "top center",
          delay: 2,
          paused: true,
          onRepeat() {
            gsap.set(cueLine, { transformOrigin: "top center" });
          },
        },
      );

      // A `repeat: -1` tween keeps GSAP's ticker running for the life of the
      // page, so the loop only ticks while the hero is within reach of the
      // viewport — not for the eleven sections after it.
      const inReach = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => {
          if (isActive) cueLoop.play();
          else cueLoop.pause();
        },
      });

      // — Asset gate. The reveal is the one thing here a reader watches frame
      // by frame, and three things routinely stall it: a webfont swapping
      // mid-stagger (which relays out a 24rem serif on every frame), the hero
      // frame decoding under the zoom, and the rest of the page still hydrating.
      // Wait for all of it, then play on a clear main thread.
      //
      // The gate resolves long after this function returns, so it needs `live`
      // to know the branch was reverted under it: a StrictMode remount and a
      // media-query flip both re-use the same DOM node, so the element being
      // connected proves nothing.
      let started = false;
      let live = true;
      const start = () => {
        if (started || !live || !root.isConnected) return;
        started = true;

        // One more frame of patience. ScrollSync's post-load refresh lands in
        // the same task as this gate, and a refresh across twelve pinned
        // sections is a long frame — better spent before the reveal than
        // inside its first 100ms.
        requestAnimationFrame(() => {
          if (!live || !root.isConnected) return;
          // Restored deep into the page? Land the reveal rather than play it to
          // an empty room.
          if (window.scrollY > window.innerHeight) intro.progress(1);
          else intro.play();
          if (inReach.isActive) cueLoop.play();
        });
      };

      const frame = root.querySelector<HTMLImageElement>(".hero-zoom img");
      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        // decode() covers the load as well, and resolves only once the bitmap
        // is actually ready to paint.
        frame?.decode?.() ?? Promise.resolve(),
        pageLoaded(),
      ]).then(start, start);

      // A delayedCall is a tween, so the context tears the fallback down with
      // everything else.
      gsap.delayedCall(ASSET_GRACE, start);

      return () => {
        live = false;
      };
    });
  });

  return (
    <section
      ref={root}
      id="top"
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-ink"
    >
      <div className="hero-drift absolute inset-x-0 -top-[15%] h-[130%] lift">
        <div className="hero-zoom relative h-full w-full lift">
          <Image
            src={PHOTOS.heroRidge}
            alt="Mist and low sun raking across a range of forested ridgelines"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Light shaping, not chrome: a top scrim for the wordmark, a heavier
          foot so the title has something to sit on. */}
      <div className="absolute inset-0 bg-linear-to-b from-ink/45 via-transparent to-ink/80" />
      <div className="vignette" />
      <div className="hero-scrim lift-fade absolute inset-0 bg-ink opacity-0" />

      {/* Extra foot on small screens so the copy clears the scroll cue. */}
      <div className="hero-content lift lift-fade relative z-10 flex h-full flex-col justify-end px-5 pb-[17vh] sm:px-8 sm:pb-[9vh] md:px-12">
        <div className="flex flex-col gap-[clamp(1.5rem,4vw,3rem)] md:flex-row md:items-end md:justify-between">
          <h1 className="display text-paper">
            <span className="line-mask label mb-[clamp(1rem,2.5vw,2rem)] block text-paper/60">
              <span className="hero-rise block">( 01 ) — First Light</span>
            </span>

            <span className="line-mask">
              <span className="flex text-[clamp(4.5rem,25vw,24rem)] leading-[0.8] tracking-[0.01em]">
                {TITLE.split("").map((char, i) => (
                  <span key={i} className="hero-char inline-block">
                    {char}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <div className="max-w-[34ch] md:pb-[clamp(1rem,3vw,2.5rem)]">
            <span className="line-mask">
              <span className="hero-rise block text-[clamp(0.9rem,1.05vw,1.0625rem)] leading-[1.75] font-light text-paper/75">
                Older than language, indifferent to us, and still the only place
                that has ever felt like home.
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-cue pointer-events-none absolute bottom-[3.5vh] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0">
        <span className="label text-paper/55">Scroll</span>
        <span className="block h-[5vh] max-h-16 w-px overflow-hidden bg-paper/20 sm:h-[7vh]">
          <span className="hero-cue-line block h-full w-full bg-paper/90" />
        </span>
      </div>
    </section>
  );
}

/** Resolves once the document has finished loading, or immediately if it has. */
function pageLoaded() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}
