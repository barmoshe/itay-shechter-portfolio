#!/usr/bin/env node
// digest.mjs — the mechanical half of the digest-standalone skill.
//
// Itay edits the standalone HTML; this repo is a React mirror of it. When Itay
// sends a new standalone.html, this script does the deterministic, tedious work:
//   1. extracts the embedded base64 images to public/img/ (order-based names),
//   2. prints a structural inventory so the agent can confirm what changed,
//   3. checks the source against the project's hard constraints (no em-dashes,
//      no emoji).
// The semantic half — updating src/data/content.ts to match the new copy — is
// done by the Claude agent, guided by SKILL.md and references/mapping.md.
//
// Usage:
//   node .claude/skills/digest-standalone/scripts/digest.mjs <path-to-standalone.html>
//   npm run digest -- <path-to-standalone.html>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// scripts/ -> digest-standalone/ -> skills/ -> .claude/ -> repo root
const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
const imgDir = path.join(repoRoot, 'public', 'img');

function fail(msg) {
  console.error(`\n  digest: ${msg}\n`);
  process.exit(1);
}

const srcPath = process.argv[2];
if (!srcPath) fail('missing argument. Usage: digest <path-to-standalone.html>');
if (!fs.existsSync(srcPath)) fail(`file not found: ${srcPath}`);

const html = fs.readFileSync(srcPath, 'utf8');

// ── 1. Extract images ────────────────────────────────────────────────
// Hero photo lives in an <img src="data:..."> ; the work-sample thumbnails
// live in background-image:url('data:...'). Both are written in document order.
function extOf(mime) {
  return mime === 'jpeg' ? 'jpg' : mime;
}

fs.mkdirSync(imgDir, { recursive: true });
const written = [];

const heroMatch = html.match(/<img[^>]*src="data:image\/(\w+);base64,([^"]+)"/);
if (heroMatch) {
  const file = `hero.${extOf(heroMatch[1])}`;
  fs.writeFileSync(path.join(imgDir, file), Buffer.from(heroMatch[2], 'base64'));
  written.push(file);
} else {
  console.warn('  digest: warning — no hero <img> base64 found');
}

const bgRe = /background-image:url\('data:image\/(\w+);base64,([^']+)'\)/g;
let m;
let n = 0;
while ((m = bgRe.exec(html)) !== null) {
  n += 1;
  const file = `work-${n}.${extOf(m[1])}`;
  fs.writeFileSync(path.join(imgDir, file), Buffer.from(m[2], 'base64'));
  written.push(file);
}

// ── 2. Structural inventory ──────────────────────────────────────────
const count = (re) => (html.match(re) || []).length;
const sectionIds = [...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map((x) => x[1]);

const inventory = {
  'timeline items (.tl-item)': count(/class="tl-item[ "]/g) || count(/class="tl-item"/g),
  'sections (<section id>)': sectionIds.length,
  'hero stats (.stat)': count(/class="stat"/g),
  'work cards (.work-card )': count(/class="work-card"/g),
  'skill cards (.skill-card)': count(/class="skill-card"/g),
  'mini cards (.mini-card)': count(/class="mini-card"/g),
  'platform links (.platform-link )': count(/class="platform-link"/g),
  'contact links (.contact-link)': count(/class="contact-link"/g),
  'images extracted': written.length,
};

// ── 3. DIGEST marker audit ───────────────────────────────────────────
// Each block in the standalone is tagged `<!-- DIGEST: <key> -->`. The keys
// name the content.ts blocks they mirror (see references/mapping.md). Real
// markers use the normal comment syntax; the top-of-file note shows the syntax
// with `~~` so it doesn't register here.
const EXPECTED_MARKERS = [
  'nav', 'hero', 'timeline', 'v1', 'fresh', 'hot', 'kan',
  'skills', 'education', 'contact', 'footer',
];
const foundMarkers = [...html.matchAll(/<!--\s*DIGEST:\s*([\w-]+)\s*-->/g)].map((x) => x[1]);
const missingMarkers = EXPECTED_MARKERS.filter((k) => !foundMarkers.includes(k));
const unknownMarkers = foundMarkers.filter((k) => !EXPECTED_MARKERS.includes(k));

// ── 4. Constraint checks (project hard rules) ────────────────────────
const warnings = [];
if (html.includes('—')) {
  warnings.push('source contains an em-dash (U+2014) - the project forbids em-dashes');
}
// Real emoji: characters that default to emoji presentation, or any pictographic
// char explicitly forced to emoji style with a U+FE0F variation selector. This
// deliberately ignores text symbols like (c) (R) (TM) and math signs (infinity).
const emoji = html.match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu);
if (emoji) {
  warnings.push(`source contains ${emoji.length} emoji glyph(s) - use inline SVG icons instead`);
}

// ── Report ───────────────────────────────────────────────────────────
console.log('\n  digest-standalone report');
console.log('  ' + '-'.repeat(48));
console.log(`  source : ${path.resolve(srcPath)}`);
console.log(`  images : ${imgDir}`);
for (const f of written) console.log(`           wrote ${f}`);
console.log('  ' + '-'.repeat(48));
for (const [k, v] of Object.entries(inventory)) {
  console.log(`  ${k.padEnd(34)} ${v}`);
}
console.log(`  section ids: ${sectionIds.join(', ')}`);
console.log('  ' + '-'.repeat(48));
console.log(`  DIGEST markers found (${foundMarkers.length}): ${foundMarkers.join(', ') || 'none'}`);
if (missingMarkers.length) {
  console.log(`  ! missing markers: ${missingMarkers.join(', ')}`);
}
if (unknownMarkers.length) {
  console.log(`  ! new/unknown markers (add to content.ts + mapping.md): ${unknownMarkers.join(', ')}`);
}
if (!missingMarkers.length && !unknownMarkers.length) {
  console.log('  markers: ok (all expected blocks tagged)');
}
console.log('  ' + '-'.repeat(48));
if (warnings.length) {
  console.log('  CONSTRAINT WARNINGS:');
  for (const w of warnings) console.log(`    ! ${w}`);
} else {
  console.log('  constraints: ok (no em-dashes, no emoji)');
}
console.log('  ' + '-'.repeat(48));
console.log('  Next: update src/data/content.ts to match the source copy');
console.log('  (see references/mapping.md), then run: npm run lint && npm run build\n');
