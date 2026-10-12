// House rules for the site's text: no em-dashes, no emoji (icons are inline SVG).
// Scans src/ and the text files in public/. Prints every hit with file:line.
// `node scripts/check-copy.mjs` warns (the build still goes out);
// `--strict` exits 1 (used by `npm run check` and CI).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src', 'public'];
const TEXT = /\.(tsx?|css|txt|xml|svg|md)$/;
const RULES = [
  ['em-dash', /—/g],
  ['emoji', /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu],
];

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : TEXT.test(name) ? [p] : [];
  });

const hits = [];
for (const file of ROOTS.flatMap(files)) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const [rule, re] of RULES) {
        if (line.match(re)) hits.push(`${relative('.', file)}:${i + 1}: ${rule}: ${line.trim().slice(0, 100)}`);
      }
    });
}

if (hits.length) {
  console.warn(`check-copy: ${hits.length} house-rule problem(s) (no em-dashes, no emoji):\n  ${hits.join('\n  ')}`);
  if (process.argv.includes('--strict')) process.exit(1);
} else {
  console.log('check-copy: ok (no em-dashes, no emoji)');
}
