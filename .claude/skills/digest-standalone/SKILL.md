---
name: digest-standalone
description: Sync this React site to Itay's standalone HTML. Use when the user has a new or updated itay-shechter-portfolio-standalone.html to import, says "digest the standalone", "sync from Itay", "Itay sent a new version", or wants the React mirror to match the HTML source of truth.
---

# digest-standalone

## What this is

Itay maintains his portfolio as a **single standalone HTML file** and edits it
with Claude (he has no coding background). This repo is a **React mirror** of
that file: same look, same copy, but built with Vite + React + TypeScript and
deployed to GitHub Pages.

The standalone HTML is the **source of truth**. This skill re-syncs the React
site whenever Itay sends an updated HTML. The standalone is never committed here;
it is supplied as a path at digest time.

```
Itay edits standalone.html  ─▶  you receive the file  ─▶  /digest-standalone <path>
                                                              │
                          ┌───────────────────────────────────┴──────────────┐
                          ▼                                                    ▼
              public/img/*  (script, automatic)             src/data/content.ts  (you, by hand)
```

## When to use

- The user provides a path to a new/updated `*-standalone.html`.
- The user says the React site is out of date with Itay's HTML.

## Steps

1. **Run the script** to extract images and get a structural inventory:
   ```
   npm run digest -- /absolute/path/to/itay-shechter-portfolio-standalone.html
   ```
   It writes `public/img/hero.jpg`, `public/img/work-1.jpg`,
   `public/img/work-2.jpg` (document order) and prints: counts of timeline items,
   sections, cards, links; a DIGEST-marker audit; and constraint warnings. Note
   the inventory, it tells you how many of each thing the new HTML has.
   - **Marker audit:** if it reports a *missing* marker, a block lost its
     `<!-- DIGEST: key -->` tag, realign it. If it reports a *new/unknown*
     marker, Itay added a block, add a matching entry to `content.ts` and a row
     to `references/mapping.md`.

2. **Read the standalone HTML.** It is large because of the embedded base64
   images; skip those long lines. Read the `<body>` markup (nav, hero, timeline,
   the experience `<section>`s, skills, contact, footer).

3. **Update `src/data/content.ts`** so every field matches the HTML copy. This is
   the core of the job. Use `references/mapping.md` for the selector→field map.
   - Preserve the typed shape in `content.ts`; only change the data.
   - Inline `<span class="hl">` becomes `{ t: '...', hl: true }`;
     `<strong>` in the hero bio becomes `{ t: '...', strong: true }`;
     a leading `<strong>` inside a bullet becomes that bullet's `heading`.
   - If the inventory shows a different count (e.g. a new timeline item or work
     card), add/remove entries in `content.ts` to match.
   - Image fields stay order-based: `img/work-1.jpg`, `img/work-2.jpg`.

4. **Honor the hard constraints.** No em-dashes (`—`) and no emoji anywhere —
   use inline SVG icons. If the script reported a constraint warning, the source
   HTML violates a rule; flag it to the user rather than copying it in.

5. **Verify**:
   ```
   npm run lint && npm run build
   ```
   Then run the dev server and compare against the standalone if the change is
   visual.

6. **Report** a short diff summary: what copy/structure changed, which images
   were rewritten, and any constraint warnings.

## What the script does vs. what you do

- **Script (deterministic):** decode base64 images, count structure, check
  constraints. Never touches `content.ts`.
- **You (semantic):** map the HTML copy into the typed `content.ts`, handle
  rich-text segments, add/remove entries when structure changes, verify.

## Notes

- The standalone carries `DIGEST:` marker comments that name each block's
  `content.ts` key (e.g. `<!-- DIGEST: hero -->`). Use them to align HTML
  blocks with `content.ts` fields, and keep the section `id`s and class names
  intact, the script's inventory keys off them.
- The top of the standalone has a maintainer note for Itay's Claude agent
  describing the sync method and a "contact Bar Moshe before structural changes"
  rule. If Itay's HTML arrives with that note removed or a structural change made
  without warning, surface it to the user before digesting.

## Best practices

- **Re-run the script after editing `content.ts`**, not just before. A clean
  marker audit plus `npm run lint && npm run build` is the done signal.
- **Don't refactor while digesting.** The CSS is a 1:1 port and `content.ts` has
  a fixed typed shape. A digest changes *data*, not structure or styling. If a
  structural change is genuinely needed, do it as its own change, separately.
- **Trust the inventory over your eyeballing.** If counts differ from the last
  run, something was added or removed, reconcile every delta before building.
- **Keep this skill and `mapping.md` in lockstep with reality.** If you change
  what the script extracts or add a marker key, update both docs in the same
  pass so the next agent isn't misled.
