# itay-shechter-portfolio

A React mirror of Itay Shechter's portfolio. Vite + React 19 + TypeScript,
deployed to GitHub Pages.

## The model: standalone HTML is the source of truth

Itay maintains his portfolio as a **single standalone HTML file** and edits it
with Claude (no coding required). This repo is a **mirror** of that file: the
same look and copy, rebuilt as a modern React app so it deploys cleanly and
stays maintainable.

```
Itay edits standalone.html  ─▶  he sends an update  ─▶  npm run digest -- <path>
                                                            │
                        ┌────────────────────────────────────┴───────────────┐
                        ▼                                                      ▼
              public/img/*  (automatic)                       src/data/content.ts  (Claude updates)
                                                                      │
                                                              React renders the site
                                                                      │
                                                       git push ─▶ GitHub Actions ─▶ Pages
```

The standalone HTML is **not** committed here. When Itay sends a new version,
save it anywhere and run the digest (below).

## Develop

```bash
npm install
npm run dev        # local dev server
npm run lint       # eslint (a11y + hooks) — also gates deploy
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Syncing from Itay's HTML

When Itay sends an updated `itay-shechter-portfolio-standalone.html`:

```bash
npm run digest -- /path/to/itay-shechter-portfolio-standalone.html
```

This extracts the images and prints a structural inventory. Then ask Claude to
**run the `digest-standalone` skill** (in `.claude/skills/`) to update
`src/data/content.ts` to match the new copy, and verify with `npm run build`.

The site content lives entirely in `src/data/content.ts`. Components render from
it; they rarely need to change.

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which lints, builds,
and publishes `dist/` to Pages.

One-time setup on the GitHub repo: **Settings → Pages → Source → GitHub
Actions**. After that, every push to `main` deploys automatically (about 1-2
minutes). Live at: `https://itayshechter.com/` (custom domain; see
[HANDOFF.md](HANDOFF.md) for the swap procedure).

The Vite `base` is `/` because the site is served from the apex of a custom
domain. `public/.nojekyll` keeps Pages from stripping build asset folders.

## Project rules

- No em-dashes (`—`) and no emoji anywhere — use inline SVG icons. The digest
  script checks the source HTML for both.
- CSS is ported 1:1 from the standalone as design tokens
  (`src/styles/tokens.css`) plus component styles (`src/styles/global.css`).
- The site is RTL Hebrew (`<html lang="he" dir="rtl">`).

## Layout

```
src/
  data/content.ts        all copy + links (the thing the digest updates)
  styles/tokens.css      :root design tokens + base reset (1:1 from standalone)
  styles/global.css      component styles (1:1 from standalone)
  components/            Nav, Hero, TimelineAccordion, ExperienceSection, Skills, Contact, Footer, icons, RichText
  hooks/                 useScrollProgress, useReveal
  lib/asset.ts           base-path-aware asset URLs
.claude/skills/digest-standalone/   the sync skill (SKILL.md, scripts/digest.mjs, references/mapping.md)
.github/workflows/deploy.yml        CI/CD to GitHub Pages
```
