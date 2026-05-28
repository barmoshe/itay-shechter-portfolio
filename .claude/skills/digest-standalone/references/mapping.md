# Standalone HTML → content.ts mapping

This is the selector→field map the digest uses to keep `src/data/content.ts` in
sync with Itay's standalone HTML. Each standalone block carries a
`<!-- DIGEST: <key> -->` marker naming its `content.ts` key.

## Conventions

- Inline `<span class="hl">x</span>` → `{ t: 'x', hl: true }`
- Inline `<strong>x</strong>` (hero bio only) → `{ t: 'x', strong: true }`
- Leading `<strong>x</strong>` inside a `<li>` → that bullet's `heading: 'x'`
- A section headline `Foo <span class="gold">Bar</span>` → `pre: 'Foo '`, `gold: 'Bar'`
- Images are order-based: hero `<img>` → `img/hero.jpg`; work-card thumbnails in
  document order → `img/work-1.jpg`, `img/work-2.jpg`.

## Blocks

| DIGEST marker | HTML location | content.ts key | Notes |
|---|---|---|---|
| `nav` | `<nav>` | `content.nav` | `.nav-brand` text → `brand`; `.nav-cta` text+href → `cta` |
| `hero` | `.hero` | `content.hero` | eyebrow, `h1` name + `.role`, `.hero-bio` (rich), `.hero-cta` two links, `.hero-photo img` → `photo`, four `.stat` → `stats` (the ∞ stat keeps `ariaLabel`) |
| `timeline` | `#path` | `content.timeline` | headline pre/gold; each `.tl-item` → `{ year, role, company, detail (rich) }`; `.tl-item.open` → `open: true` |
| `v1` | `#v1` | `content.v1` | label, tag, headline, sub, `.organic-badge` → `organicBadge`; featured `.exp-item` with `.bullet-list` → `item.bullets`; `.exp-date` lines → `item.date`; `.mini-row` → `miniCards`; `.platform-list` → `platformLinks` |
| `fresh` | `#ed-fresh` | `content.fresh` | featured `.exp-item` with `.bullet-list` (each `<li>` has a `<strong>` heading) and `.work-samples` → `item.workSamples` |
| `hot` | `#ed-hot` | `content.hot` | featured `.exp-item` with `.exp-body` → `item.body` (rich) |
| `kan` | `#ed-kan` | `content.kan` | `.exp-body` → `item.body`; `.mini-row` → `miniCards` (these carry `.mini-date`) |
| `skills` | `#ed-skills` | `content.skills` | seven `.skill-card` → `cards[]` `{ icon, name, desc }`. `icon` is a key (`ai`, `strategy`, `video`, `growth`, `collab`, `writing`, `format`) resolved to SVG in `src/components/icons.tsx`. If Itay adds a card with a new icon, add a matching SVG case there. |
| `education` | `#ed-edu` | `content.education` | featured `.exp-item` with `.exp-body` |
| `contact` | `#ed-contact` | `content.contact` | `.contact-headline` (lang="en") pre/gold; `.contact-sub`; `.contact-link` rows → `links` `{ text, arrow, href }` |
| `footer` | `<footer>` | `content.footer` | plain string |

## Work sample fields (inside `fresh.item.workSamples`)

| HTML | field |
|---|---|
| `<a class="work-card" href>` | `href` |
| `.work-card-thumb` background image (order) | `image` (`img/work-N.jpg`) |
| `.work-card-brand span` | `brandHandle` |
| `.work-card-stat` (optional) | `stat` |
| `.work-card-tag` | `tag` |
| `.work-card-title` | `title` |
| `.work-card-desc` | `desc` |

## When structure changes

- New timeline item / work card / skill / contact link in the HTML → add a
  matching entry to the corresponding array in `content.ts`.
- Removed block → remove the entry.
- New section id → add a new `ExperienceSection` object and render it in
  `src/App.tsx`. Give the block a `<!-- DIGEST: <key> -->` marker in the
  standalone and add the key to `EXPECTED_MARKERS` in `scripts/digest.mjs`,
  plus a row in the Blocks table above. The digest's marker audit flags any
  marker that isn't in that list, so keep the three in sync.
- The digest script prints a marker audit (found / missing / unknown). A missing
  marker means a block lost its tag; an unknown marker means Itay introduced a
  new block that this map doesn't cover yet.
