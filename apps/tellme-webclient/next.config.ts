import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: false, // désactive lightningcss
  },
};

export default nextConfig;