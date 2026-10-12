# AGENTS.md: itayshechter.com

Instructions for any AI assistant working on this repo (ChatGPT, Codex, Claude,
Copilot, Cursor, Gemini, others). Humans: start with `README.md`; Itay, read
`docs/editing-he.md`.

## What this is

Itay Shechter's portfolio: one page in Hebrew, right to left, live at
https://itayshechter.com. Itay does not code. He asks an AI for changes, and the
AI edits this repo. Every push to `main` deploys on its own.

- **Stack:** Next.js 16 (App Router, static export to `out/`), React 19, TypeScript, plain global CSS. Node 22.
- **Deploy:** Vercel builds every push and every pull request.
  - A pull request gets a preview link.
  - `main` is the live site.
  - A build that fails never replaces the live site.

## Where things live

| You want to change | Edit this |
|---|---|
| Any text, number, link, video, skill, contact detail | `src/content/site.ts` (only this file, almost always) |
| A photo or video thumbnail | the file in `src/assets/` + its `import` at the top of `site.ts` |
| Share image for WhatsApp/Facebook links | `public/img/og.jpg` (1200x630) |
| The shape of the content (a new field) | `src/content/types.ts`, then the component in `src/components/` |
| Layout or look | `src/styles/` (only when Itay or Bar asks for a design change, see "Design tweaks") |
| The V1 phone mockup (frame, edges, shadow, island, status bar) | `src/styles/sections/v1.css`, block `/* the phone */`; phone sizes for tablets and phones are at the end of the file (`max-width: 820px` / `480px`) |
| Animations, smoke background | `src/effects/` (don't, unless that is the task) |

The order of sections on the page is in `src/app/page.tsx`. Page title, description and
social preview text come from `seo` in `site.ts`.

## Rich text in site.ts

Some fields are lists of pieces instead of one string:

```ts
['plain text ', { b: 'bold' }, ' more text ', { hl: 'brighter highlight' }, '.']
```

- `{ b }` bold, `{ hl }` highlighted (brighter), `{ gold }` gold, `{ ltr }` a Latin
  word or number inside a Hebrew line (keeps "V1", "TikTok", "13.1M" the right way round).
- Spaces live inside the strings. Check both sides of every `{ ... }` piece.
- Headlines are `{ pre: 'plain part ', gold: ['gold part'] }`; the gold part animates
  letter by letter on its own.

## Recipes (the common asks)

**Change text.** Find the sentence in `site.ts` and replace it. Keep the quotes and
commas around it. Strings with a `'` inside (like `ג'ונס`) use double quotes.

**Change a follower count.** In `v1.assets.items`, edit `value` (for example
`'157K'`). The total above the cards, `v1.assets.total` (`'300K+'`), is typed by
hand, not computed: if the new numbers change it, ask Itay whether to update it too.

**Timeline: add or remove a row.** Edit `timeline.items`, newest first. One row
looks like `{ year: '2026', role: '...', company: '...', detail: ['text.'] }`
(`detail` is rich text, so a list, even for one plain sentence). Exactly one row may have `open: true`
(it starts expanded).

**Add a TikTok video** to the carousel in `fresh.videos`:
1. Get the numeric video id. It is the long number in the full link
   (`tiktok.com/@user/video/7215933593686756609`). For a short `vt.tiktok.com` link,
   open it to get the full one, or read it from
   `https://www.tiktok.com/oembed?url=<link>`.
2. Make a thumbnail: a frame from the video, portrait, about **600px wide**, JPG,
   under 120 KB. Save as `src/assets/work-4.jpg` (next free number).
3. At the top of `site.ts` add `import work4 from '@/assets/work-4.jpg';`.
4. Add an entry to `fresh.videos` shaped like the others: `href`, `videoId`, `image`, `brandHandle`,
   `tag`, `title`, `desc`, and optionally `stat`. The carousel, captions, dots
   and player all follow from the list. The middle video starts in front.

**Remove a video.** Delete its entry, its `import`, and its file in `src/assets/`.

**Replace a photo.** Keep the size close to the old one: hero 640x640, video
thumbnails 600 wide, AI-tool screenshot about 600 wide. Overwrite the file with the same name
(nothing else changes), or add a new file and update the `import`.

**Add a skill.** Add `{ icon, name, desc }` to `skills.cards`. The `icon` must be one
of the names in `src/components/ui/Icon.tsx` (`sparkles`, `send`, `video`, `sprout`,
`handshake`, `pen`, `bulb`, ...). TypeScript rejects anything else.

**Change contact details.** `email` and `phone` are defined once near the top of
`site.ts` and reused by the contact section and the popup. WhatsApp is the
`wa.me/972...` link in `contactModal.options`.

**Design tweaks (only when asked).** Small visual polish, such as "make the phone frame more
elegant", is fine when Itay or Bar asks for it. Do it like this:
- One small step per commit, a few CSS properties at most, starting from the current values (the
  current look is good; aim for "slightly better", not a redesign).
- Use the colours in `src/styles/tokens.css` (`--gold`, `--gold-glow`, ...). Keep everything subtle.
- Don't rename classes or change components; don't touch `src/effects/`.
- The phone: keep `transition` and the resting `transform` on `.phone-frame`. On desktop the
  phone sits turned a little (`rotateY(-6deg) rotateX(2deg)`) and flattens on hover; pressing it
  tilts it (the script sets `transform` inline). Check both a desktop width and a 390px phone.
- Prefer a branch + pull request, so the change gets a Vercel preview link before it goes live.

## House rules

- **No em-dashes** (the long dash). Use a comma, a period or parentheses. The short
  dash in year ranges (`2022–23`) is fine.
- **No emoji.** Icons are inline SVG (`src/components/ui/Icon.tsx`).
- **Hebrew, right to left.** Write copy in Hebrew unless it is a name or brand. In CSS
  prefer logical properties (`margin-inline`, `inset-inline-start`).
- **Keep the design.** The look took many rounds with Itay and Bar. That covers the dark background,
  gold, Heebo, the gold smoke, the breathing letters, the card light and the carousel.
  Content changes never need CSS or effects changes. If a request would change the
  look, say so and ask before doing it.
- Don't add dependencies, analytics, trackers or third-party scripts.

## Check before you finish

```bash
npm ci          # once
npm run check   # types + house rules (fails on an em-dash or emoji)
npm run build   # the real build; output in out/
npm run verify  # smoke test of the built page (all sections, head tags)
npm run dev     # optional: http://localhost:3000
```

CI (`.github/workflows/ci.yml`) runs `check`, `build` and `verify` on every push and
pull request. Vercel skips the deploy when a commit only touches docs (`*.md`,
`docs/`, `.github/`). If you can't run commands (a plain chat assistant), be extra careful with
quotes, commas and brackets in `site.ts`, and change only what was asked.

## How changes go live

- **Pull request (preferred for anything beyond a small text fix):** branch, commit,
  open a PR to `main`. Vercel comments a preview link; Itay checks it on his phone
  and merges.
- **Direct commit to `main`:** fine for a small text fix. It is live in about a minute.
  If the build fails, the previous version stays live.
- **Undo:** revert the commit on GitHub, or in Vercel promote the previous deployment.

Commit messages: short, in English or Hebrew, saying what changed ("Update TikTok
follower count").

## For assistants that can only read (chat with a GitHub connector)

If you can read the repo but not write to it:
1. Find the exact lines to change: `src/content/site.ts` for content, the CSS file
   named above for a design tweak.
2. Give the old text and the new text, in a code block, with the file path and line
   numbers. If that's simpler, give the whole updated block (for CSS, the whole rule).
3. Tell them to open that file on github.com, press the pencil, make the change, and
   press "Commit changes". For anything beyond a text fix, choose "Create a new branch
   for this commit and start a pull request": Vercel then posts a preview link on the
   pull request, and "Merge" publishes it.
4. Keep it to one file and one step at a time. Images need the GitHub "Add file"
   upload, so explain that step by step.

If your connector can write, commit or open a pull request yourself, as above.
