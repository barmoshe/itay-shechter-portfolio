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
| `fresh` | `#ed-fresh` | `content.fresh` | featured `.exp-item` with `.bullet-list` (each `<li>` has a `<strong>` heading) and a `.video-carousel` (coverflow) → `item.workSamples`. See the work-sample table below. |
| `hot` | `#ed-hot` | `content.hot` | featured `.exp-item` with `.exp-body` → `item.body` (rich) |
| `kan` | `#ed-kan` | `content.kan` | `.exp-body` → `item.body`; `.mini-row` → `miniCards` (these carry `.mini-date`) |
| `skills` | `#ed-skills` | `content.skills` | seven `.skill-card` → `cards[]` `{ icon, name, desc }`. `icon` is a key (`ai`, `strategy`, `video`, `growth`, `collab`, `writing`, `format`) resolved to SVG in `src/components/icons.tsx`. If Itay adds a card with a new icon, add a matching SVG case there. |
| `education` | `#ed-edu` | `content.education` | featured `.exp-item` with `.exp-body` |
| `contact` | `#ed-contact` | `content.contact` | `.contact-headline` (lang="en") pre/gold; `.contact-sub`; `.contact-link` rows → `links` `{ text, arrow, href }` |
| `footer` | `<footer>` | `content.footer` | plain string |
| `contact-modal` | `<dialog class="contact-modal">` | `content.contactModal` | title, sub, two `.contact-option` rows (email + WhatsApp) → `options`. The "דברו איתי" CTAs in nav + hero open it. |

## Work sample fields (inside `fresh.item.workSamples`)

The fresh videos render as a **coverflow carousel with an in-page TikTok
lightbox** (`src/components/VideoCarousel.tsx`; mirrored in the standalone by a
vanilla `<script>` plus a `.vc-lightbox` `<dialog>`). Each sample is split
between a slide (the thumbnail) and a caption, paired by document order:

| HTML | field |
|---|---|
| `<a class="work-card vc-slide" href>` | `href` |
| `data-video-id` on the slide | `videoId` (numeric TikTok id, for the lightbox player) |
| `.work-card-thumb` background image (order) | `image` (`img/work-N.jpg`) |
| `.work-card-brand span` | `brandHandle` |
| `.work-card-stat` (optional) | `stat` |
| `.vc-cap .work-card-tag` (caption, paired by order) | `tag` |
| `.vc-cap .work-card-title` | `title` |
| `.vc-cap .work-card-desc` | `desc` |

- The i-th `.vc-slide` pairs with the i-th `.vc-cap`. `.vc-dots` and `.vc-arrow`
  are presentational (no content).
- `videoId`: resolve a `vt.tiktok.com/<short>` link to its numeric id by
  following the redirect (`curl -sIL`) or via TikTok oEmbed
  (`https://www.tiktok.com/oembed?url=<link>`) — oEmbed also returns the poster
  image and the author handle.
- Add/remove a video: add/remove a `.vc-slide` **and** its paired `.vc-cap`
  (and one `.vc-dot`); the thumbnail stays an order-based `img/work-N.jpg`.

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
