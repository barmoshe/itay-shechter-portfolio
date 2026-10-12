// Build step for Vercel (no dependencies). index.html stays a single self-contained
// file that Itay edits; this writes a faster copy to dist/ for hosting:
//   - every embedded base64 image becomes its own cached file under /assets/
//   - images below the fold load lazily; the hero photo loads first
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const out = 'dist';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });

const EXT = { jpeg: 'jpg', 'svg+xml': 'svg' };
let html = fs.readFileSync('index.html', 'utf8');

// House rules: no em-dashes, no emoji. Warn (don't fail) so a deploy still goes out.
const dashes = html.split('\u2014').length - 1;
const emoji = (html.match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/gu) || []).length;
if (dashes) console.warn(`build: warning, ${dashes} em-dash(es) in index.html`);
if (emoji) console.warn(`build: warning, ${emoji} emoji in index.html`);
let count = 0;
html = html.replace(/data:image\/([a-z+]+);base64,([A-Za-z0-9+/=]+)/g, (_, type, b64) => {
  const buf = Buffer.from(b64, 'base64');
  const name = `${crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12)}.${EXT[type] ?? type}`;
  fs.writeFileSync(path.join(out, 'assets', name), buf);
  count += 1;
  return `/assets/${name}`;
});

// Only real <img> tags after </head> (the top-of-file comment mentions "<img>" too).
const bodyAt = html.indexOf('</head>');
html = html.slice(0, bodyAt) + html.slice(bodyAt).replace(/<img\b(?![^>]*\bloading=)/g, (tag, at, rest) =>
  rest.lastIndexOf('<div class="hero-photo">', at) > rest.lastIndexOf('</div>', at)
    ? '<img fetchpriority="high"'
    : '<img loading="lazy" decoding="async"',
);

fs.writeFileSync(path.join(out, 'index.html'), html);
for (const f of ['robots.txt', 'sitemap.xml']) fs.copyFileSync(f, path.join(out, f));
fs.cpSync('img', path.join(out, 'img'), { recursive: true });
console.log(`build: ${count} images extracted, index.html ${(html.length / 1024).toFixed(0)} KB`);
