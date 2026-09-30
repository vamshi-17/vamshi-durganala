import type { NextConfig } from "next";

// GitHub Pages serves project sites from /<repo>. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH automatically; locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  // Tests build into their own folder so they never collide with a running `next dev` (which owns .next/).
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
