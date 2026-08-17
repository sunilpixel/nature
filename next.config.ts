import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Cinematic full-bleed art direction needs the large end of the ladder,
    // but it stops at 2560: the widest source any section requests is 3200px,
    // so a 3840 entry only ever re-encodes an upscale — more bytes, no detail.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048, 2560],
    // Quality is tuned per section: hero and full-bleed reveals get 85, the
    // planes buried behind fog and blur get 70–78. Every value here is one the
    // page actually asks for — a spare entry is just another cache variant.
    qualities: [70, 78, 80, 82, 85],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
