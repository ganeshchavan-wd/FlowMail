import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  
  // Skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;