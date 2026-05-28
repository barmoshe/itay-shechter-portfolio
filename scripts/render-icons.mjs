#!/usr/bin/env node
// Rasterize public/favicon.svg into the PNG icons referenced by index.html and
// public/manifest.webmanifest: apple-touch-icon.png (180), icon-192.png,
// icon-512.png. Uses Playwright's Chromium (same as scripts/render-og.mjs);
// this repo doesn't ship Playwright as a dep, so run from a host that has it:
//
//   NODE_PATH=~/claude-creative-stack/node_modules \
//     node ~/itay-shechter-portfolio/scripts/render-icons.mjs
//
// Edit public/favicon.svg to change the design, then re-run.

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const svgPath = path.join(repoRoot, 'public', 'favicon.svg');
const outDir = path.join(repoRoot, 'public');

const svg = await fs.readFile(svgPath, 'utf8');

const targets = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png',          size: 192 },
  { name: 'icon-512.png',          size: 512 },
];

const browser = await chromium.launch();
for (const { name, size } of targets) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  // Inline the SVG centered in a transparent viewport at the target size.
  const html = `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:transparent;}
    svg{display:block;width:${size}px;height:${size}px;}
  </style></head><body>${svg}</body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({
    path: path.join(outDir, name),
    type: 'png',
    omitBackground: false, // keep the SVG's dark rounded-rect background
    clip: { x: 0, y: 0, width: size, height: size },
  });
  await page.close();
  console.log(`wrote public/${name} (${size}x${size})`);
}
await browser.close();
