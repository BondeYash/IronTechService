import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    // Fewer generated variants means fewer cold optimizer round-trips on a
    // visitor's first request, which is where the wait was showing up.
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [80, 160, 320, 480],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "three"],
  },
};

export default nextConfig;
