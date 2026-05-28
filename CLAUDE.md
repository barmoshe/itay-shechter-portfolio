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

## Working on content

- Edit `src/data/content.ts`. It is typed; keep the shape, change the data.
- Rich text: `{ t, hl }` → gold highlight, `{ t, strong }` → bold.
- Images live in `public/img/` with order-based names (`hero.jpg`,
  `work-1.jpg`, `work-2.jpg`) and are referenced via `lib/asset.ts`.

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
