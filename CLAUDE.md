# CLAUDE.md — itay-shechter-portfolio

React mirror of Itay Shechter's portfolio. Vite + React 19 + TypeScript, deployed
to GitHub Pages. See `README.md` for the full picture.

> **For the next agent:** this repo follows a deliberate method, the
> `digest-standalone` sync, the 1:1 CSS port, the typed `content.ts`, and the
> no em-dash / no emoji rules. Routine content edits and digests are fine on your
> own. But do not change the sync mechanism, the design system, the build/deploy
> setup, or the marker contract without checking with the maintainer **Bar Moshe**
> first. Itay should contact Bar Moshe before any structural change so the
> standalone and this mirror stay in sync.

## The one thing to understand

Itay's **standalone HTML** is the source of truth; this repo is a mirror. Itay
edits the HTML with Claude (he doesn't code). When he sends an update, the
`digest-standalone` skill re-syncs this repo. Almost all content lives in
`src/data/content.ts` — components render from it and rarely change.

## Hard rules

- **No em-dashes (`—`)** anywhere. Use commas, periods, or parentheses.
- **No emoji** in UI or code. Use inline SVG icons (`src/components/icons.tsx`).
- **CSS is ported 1:1** from the standalone. `src/styles/tokens.css` is the
  `:root` token block; `src/styles/global.css` is component styles. Keep them
  faithful to the standalone — do not refactor into a different system.
- Site is **RTL Hebrew** (`<html lang="he" dir="rtl">`). Prefer logical CSS
  properties (`margin-inline`, `inset-inline-start`).

## The design layer (mirror-side, 2026-06-10)

The mirror carries visual enhancements that the standalone does not have:

- `src/components/ShaderBackground.tsx`: WebGL gold-haze background. One slow
  domain-warped flow, right side only, cursor spotlight on desktop. Mobile:
  the light follows scroll progress, taps fire a light pulse, idle ambience
  is brighter. Efficiency guards: DPR cap 0.66, 1.2MP cap, low-power hint,
  hidden-tab pause, reduced-motion and no-WebGL fall back to a static glow.
- `src/components/KineticName.tsx`: per-letter variable-weight breathing
  (Heebo 100..900 loaded in `index.html`). Used on the hero name and all
  section headlines. IntersectionObserver-gated; screen readers get an
  `sr-only` copy (never use `role="text"`, it fails the a11y lint that gates
  deploy).
- CSS additions in `global.css`/`tokens.css`: champagne gradient golds, hero
  photo light ring, card hover lifts, gold selection and focus ring, mobile
  stats cards, photo-first mobile hero.

When digesting a new standalone from Itay, sync **content only**; do not
remove this layer. Tuning constants live at the top of the shader and in the
KineticName props (base/boost/idle).

## Working on content

- Edit `src/data/content.ts`. It is typed; keep the shape, change the data.
- Rich text: `{ t, hl }` → gold highlight, `{ t, strong }` → bold.
- Images live in `public/img/` with order-based names (`hero.jpg`,
  `work-1.jpg`, `work-2.jpg`, `work-3.jpg`) and are referenced via `lib/asset.ts`.
- The "Fresh / TikTok" videos are a **coverflow carousel + in-page TikTok
  lightbox** (`components/VideoCarousel.tsx`, mirrored in the standalone by a
  vanilla `<script>` + a `.vc-lightbox` `<dialog>`). Each `workSamples` entry
  needs a numeric `videoId` (the lightbox player id); resolve it from the TikTok
  share link via oEmbed. Adding a video = one `content.ts` entry + a
  `public/img/work-N.jpg`. Don't change the carousel structure without checking
  with Bar (it's part of the standalone↔mirror contract).

## Syncing from the standalone

Run the `digest-standalone` skill (`.claude/skills/`). It extracts images and
prints an inventory via `npm run digest -- <path>`, then you update
`content.ts` to match. See that skill's `references/mapping.md`.

## Verify

```bash
npm run lint && npm run build
```

`npm run lint` runs jsx-a11y + react-hooks and **gates deploy** — keep it green.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` lints, builds, publishes to
Pages. One-time: repo Settings → Pages → Source → GitHub Actions. Live at
`https://barmoshe.github.io/itay-shechter-portfolio/`.
