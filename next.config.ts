import type { NextConfig } from 'next';

// Static export: `next build` writes plain HTML/CSS/JS to out/, which Vercel serves.
// Images are already sized for their display, so they ship as-is (no optimizer).
const config: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;
