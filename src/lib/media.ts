/**
 * Every photograph is a verified Unsplash asset, addressed by its permanent
 * photo id. `img()` requests a large, well-compressed source; next/image then
 * re-encodes it to AVIF/WebP at the width each layout actually needs.
 */
export const img = (id: string, w = 2400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PHOTOS = {
  /** Misty ridgelines pierced by god-rays — a lone figure for scale. */
  heroRidge: img("1469474968028-56623f02e42e", 3200),
  /** Sunlit forest path, deep green. */
  forestPath: img("1441974231531-c6227db76b6e"),
  /** Pines dissolving into fog. */
  forestFog: img("1418065460487-3e41a6c84dc5"),
  /** Aerial of a dark forest split by a single road. */
  forestAerial: img("1476231682828-37e571bc172f"),
  /** Turquoise water meeting a forest edge, shot from above. */
  lakeEdge: img("1497436072909-60f360e1d4b1"),
  /** Snow peaks over a sea of cloud at first light. */
  cloudSea: img("1506905925346-21bda4d32df4", 3200),
  /** Moraine Lake, pink alpenglow on the peaks. */
  alpenglow: img("1493246507139-91e8fad9978e", 3200),
  /** Lake Louise, near-perfect mirror symmetry. */
  mirrorLake: img("1439853949127-fa647821eba0"),
  /** Multnomah Falls, a long vertical drop. */
  waterfall: img("1433086966358-54859d0ed716"),
  /** Half Dome above a meadow, an elk in the foreground. */
  elkValley: img("1472396961693-142e6e269027"),
  /** Surf breaking on sand, straight down. */
  surf: img("1505144808419-1957a94ca61e"),
  /** Blue ridges receding into haze. */
  ridgeLayers: img("1500534314209-a25ddb2bd429"),
  /** Cold teal dusk on a snow range. */
  snowRange: img("1483728642387-6c3bdd6c93e5"),
  /** Warm sunset over a forested ridge. */
  goldenRidge: img("1511497584788-876760111969"),
  /** A lion mid-stride. */
  lion: img("1546182990-dffeafbe841d"),
  /** Red rock massif at last light. */
  redRock: img("1508739773434-c26b3d09e071"),
  /** Poppies against a blown-out white sky. */
  poppyField: img("1465146344425-f00d5f5c8f07"),
  /** Sunrise burning off ground mist over a meadow. */
  sunriseMeadow: img("1470252649378-9c29740c9fa8", 3200),
  /** Cliff edge, cloud spilling over a green ridge at sunset. */
  cliffRidge: img("1470071459604-3b5ec3a7fe05", 3200),
  /** Rain falling through backlit leaves. */
  rainLeaves: img("1518173946687-a4c8892bbd9f"),
  /** Dusk over a dark mountain, a sliver of moon. */
  moonMountain: img("1485470733090-0aae1788d5af"),
} as const;

/**
 * Self-hosted so the poster is a real frame of the clip — a remote still would
 * cross-fade into something slightly different the moment playback starts.
 */
export const VIDEO = {
  src: "/media/wild-loop.mp4",
  poster: "/media/wild-poster.jpg",
} as const;
