#!/usr/bin/env node
// Render scripts/og-card.html to public/img/og.jpg at 1200x630 (the social
// share image referenced by the Open Graph / Twitter meta tags in index.html).
//
// Needs Playwright's Chromium. This repo doesn't ship Playwright as a dep, so
// run it from the creative-stack host (which has it):
//
//   node itay-shechter-portfolio/scripts/render-og.mjs
//
// Edit scripts/og-card.html to change the design, then re-run.

import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const cardUrl = 'file://' + path.join(here, 'og-card.html');
const out = path.join(repoRoot, 'public', 'img', 'og.jpg');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto(cardUrl, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);
await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
await browser.close();
console.log(`wrote ${out} (1200x630)`);
