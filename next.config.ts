import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,

  // TypeScript and ESLint errors are now enforced during build (fixes issue #2).
  // Previously both were silenced with ignoreBuildErrors / ignoreDuringBuilds.
};

export default nextConfig;
