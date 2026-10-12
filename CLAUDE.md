# CLAUDE.md: itayshechter.com

Itay Shechter's portfolio. One page, Hebrew, right-to-left. Itay doesn't code;
he edits the site with Claude. Read this before changing anything.

## The one thing to understand

`index.html` **is the site**: copy, styles, behaviour and images (embedded as
base64) all live in that one file. Open it in a browser to preview. There is no
framework, no `npm install`, nothing to run.

On every push to `main`, Vercel runs `node build.mjs`, which writes a faster copy
to `dist/` (embedded images become separate cached files, below-the-fold images
load lazily). You never edit `dist/` and almost never edit `build.mjs`.

## Editing the content

- Each block in `<body>` starts with a marker comment `<!-- DIGEST: name -->`
  (nav, hero, v1, ai-tools, timeline, fresh, hot, kan, skills, education,
  contact, footer, contact-modal). Use them to find things; keep them.
- Gold highlight: `<span class="hl">text</span>`. Bold: `<strong>text</strong>`.
- Headlines: the part inside `<span class="gold">` is gold. Text inside
  `<span class="kinetic-name">` animates letter by letter on its own; edit it as
  plain text. Latin words inside Hebrew lines (V1, TikTok, AI) get `dir="ltr"`.
- Videos (block `fresh`): one `<a class="work-card vc-slide">` per video, with a
  matching `<div class="vc-cap">` caption and one `<button class="vc-dot">`, all
  in the same order. `data-video-id` is the numeric TikTok id (get it from the
  share link via `https://www.tiktok.com/oembed?url=<link>`).
- New images: embed as base64 (`data:image/...`). Size them for how big they
  show on screen, at 2x: video thumbnails about 600px wide, the hero 640px.
  Large photos make the page slow on phones.

## Hard rules

- **No em-dashes** anywhere. Use commas, periods or parentheses.
- **No emoji.** Icons are inline SVG.
- Keep the look: dark background, gold accents, Heebo font. The gold smoke WebGL
  background (`#bg-shader-frag`, smoke in a soft spotlight), the breathing headline letters, the card edge
  light, the video carousel and the TikTok lightbox are driven by the scripts at
  the end of `index.html`; they read the HTML, so content edits never need a
  script change. Keep the background calm: no particles or dots.
- Mobile first: check 320px and 390px widths. Mobile fixes live in the
  "Mobile polish" block at the end of `<style>`; grid columns use
  `minmax(0,1fr)` so nothing pushes the page wider than the screen.
- RTL: prefer logical CSS (`margin-inline`, `inset-inline-start`).

## Before you push

1. Open `index.html` in a browser, desktop and phone width; click the
   carousel, a video, the "דברו איתי" button and the timeline.
2. Run `node build.mjs`. It warns if it finds an em-dash or emoji. To see
   exactly what Vercel will publish, serve `dist/` (for example `npx serve dist`).

## Hosting

Vercel, building from this repo's `main` branch (settings in `vercel.json`).
GitHub Pages is a documented alternative (static site, one account fewer): see
"Option: GitHub Pages" in `HANDOFF.md`. Domain `itayshechter.com` is registered
at GoDaddy. Moving the site or domain between accounts: see `HANDOFF.md`.
