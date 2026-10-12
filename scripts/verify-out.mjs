// Smoke test of the built site (out/), run by CI after `npm run build`.
// Catches a build that "succeeds" but ships a broken page: missing sections,
// lost Hebrew/RTL setup, missing SEO tags, or house-rule breaks in the output.
import { existsSync, readFileSync } from 'node:fs';

const fail = [];
const need = (ok, msg) => ok || fail.push(msg);

const file = 'out/index.html';
need(existsSync(file), `${file} is missing (did the build run?)`);
const html = existsSync(file) ? readFileSync(file, 'utf8') : '';

need(/<html[^>]*lang="he"[^>]*dir="rtl"/.test(html), 'html is not lang="he" dir="rtl"');
need(/<title>[^<]+<\/title>/.test(html), 'no <title>');
for (const tag of ['name="description"', 'rel="canonical"', 'property="og:image"', 'application/ld+json']) {
  need(html.includes(tag), `head is missing ${tag}`);
}
for (const id of ['v1', 'ai', 'path', 'ed-fresh', 'ed-hot', 'ed-kan', 'ed-skills', 'ed-edu', 'ed-contact']) {
  need(html.includes(`id="${id}"`), `section #${id} is missing`);
}
for (const cls of ['hero', 'phone-feed', 'video-carousel', 'contact-modal', 'vc-lightbox', 'bg-shader']) {
  need(html.includes(cls), `${cls} is missing`);
}
need(/\.css"/.test(html), 'no stylesheet linked');
need(!html.includes('—'), 'an em-dash reached the page');
for (const f of ['out/img/og.jpg', 'out/favicon.svg', 'out/robots.txt', 'out/sitemap.xml', 'out/llms.txt']) {
  need(existsSync(f), `${f} is missing`);
}

if (fail.length) {
  console.error(`verify-out: the built page is broken:\n  ${fail.join('\n  ')}`);
  process.exit(1);
}
console.log(`verify-out: ok (${Math.round(html.length / 1024)} KB page, all sections and head tags present)`);
