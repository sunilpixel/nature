import { Chrome, ScrollSync } from "@/components/Chrome";
import { Hero } from "@/components/sections/Hero";
import { WordColor } from "@/components/sections/WordColor";
import { ForestTunnel } from "@/components/sections/ForestTunnel";
import { LiquidReveal } from "@/components/sections/LiquidReveal";
import { CardStack } from "@/components/sections/CardStack";
import { VideoExpand } from "@/components/sections/VideoExpand";
import { Portal } from "@/components/sections/Portal";
import { HorizontalGallery } from "@/components/sections/HorizontalGallery";
import { FogReveal } from "@/components/sections/FogReveal";
import { ExtremeScale } from "@/components/sections/ExtremeScale";
import { ClipTransition } from "@/components/sections/ClipTransition";
import { FinalReveal } from "@/components/sections/FinalReveal";

/**
 * WILD — Nature Beyond Time.
 *
 * Twelve movements, each built on a different GSAP technique, ordered so the
 * scroll rhythm keeps changing: played timeline → scrubbed colour → parallax
 * planes → clip morph → stacked timeline → box-model growth → aperture mask →
 * horizontal travel → blur resolve → keyframed scale → sticky scrub → played
 * timeline again.
 *
 * The tonal sequence alternates deliberately — bone, ink, bone, ink — so no
 * two dark sections sit next to each other and the whitespace has somewhere
 * to breathe.
 */
export default function Page() {
  return (
    <>
      <Chrome />
      <ScrollSync />

      <main>
        <Hero />
        <WordColor />
        <ForestTunnel />
        <LiquidReveal />
        <CardStack />
        <VideoExpand />
        <Portal />
        <HorizontalGallery />
        <FogReveal />
        <ExtremeScale />
        <ClipTransition />
        <FinalReveal />
      </main>
    </>
  );
}
