# HANDOFF - swap to Itay's custom GoDaddy domain

For the next agent (or future-Bar). Itay bought a domain at GoDaddy. This file
prepares the swap from the current GitHub Pages subpath URL
(`https://barmoshe.github.io/itay-shechter-portfolio/`) to the custom domain.
Nothing here has been applied yet, because the domain string is not in the repo
and the DNS + Pages settings live outside it.

Standing rules: no em-dash character anywhere; no emoji. Deploy is Bar's step
(don't `git push` to ship). Workshop pointer for this repo:
`bar_builds/lab/itay/itay-shechter-portfolio/`.

---

## Inputs needed from Bar / Itay before starting

- [ ] **The domain string.** Apex (`itayshechter.com`) or subdomain
  (`www.itayshechter.com`)? Both shapes work; pick one canonical and treat the
  other as a redirect. Below I write the canonical as `<DOMAIN>` and the apex as
  `<APEX>` (they may be the same if you go apex-only).
- [ ] **GoDaddy access** to edit DNS records on `<APEX>`.
- [ ] **Confirmation** that the GitHub repo is `barmoshe/itay-shechter-portfolio`
  and Pages is publishing from GitHub Actions on `main` (it is, today).

---

## What changes, end to end

Three surfaces have to move together. Doing one without the others leaves the
site broken or insecure.

### 1. DNS at GoDaddy

Point `<DOMAIN>` at GitHub Pages.

- **Apex** (`itayshechter.com`): add four `A` records on `@` to GitHub Pages'
  anycast IPs:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
  - (Optionally also four `AAAA` records on `@` to
    `2606:50c0:8000::153`, `:8001::153`, `:8002::153`, `:8003::153` for IPv6.)
- **Subdomain** (e.g. `www.itayshechter.com`): add one `CNAME` record on `www`
  pointing to `barmoshe.github.io.` (note the trailing dot in DNS UIs that need
  it; GoDaddy normalises this).
- If you want both apex and `www` working, add **both** sets and pick one as
  canonical; GitHub Pages will redirect the other to it once the custom domain
  is set in repo settings.
- **Verify DNS** before touching the repo:
  ```bash
  dig +short <APEX>           # expect the four A records
  dig +short www.<APEX> CNAME # expect barmoshe.github.io.
  ```
  Propagation is usually minutes at GoDaddy but can take up to a few hours.

### 2. The repo (one commit, no push yet)

Make these edits on `main` and commit. Do **not** push - that is Bar's step,
because the push triggers the live deploy.

#### 2a. Add `public/CNAME`

A single-line file with the canonical domain. Vite copies `public/` verbatim,
so `dist/CNAME` lands at the site root, which is what GitHub Pages reads to
bind the custom domain.

```
<DOMAIN>
```

(No trailing whitespace; one line; no scheme, no path.)

#### 2b. Drop the Vite subpath base

[vite.config.ts:8](vite.config.ts) currently has:

```ts
base: '/itay-shechter-portfolio/',
```

Change to:

```ts
base: '/',
```

The asset helper [src/lib/asset.ts](src/lib/asset.ts) uses
`import.meta.env.BASE_URL`, so it follows automatically - no edit there.

#### 2c. Update the absolute URLs in `index.html`

Five lines in [index.html](index.html) reference the current Pages URL or the
subpath. Replace each:

| Line | Now | After |
|---|---|---|
| canonical | `https://barmoshe.github.io/itay-shechter-portfolio/` | `https://<DOMAIN>/` |
| `<link rel="icon">` href | `/itay-shechter-portfolio/favicon.svg` | `/favicon.svg` |
| `og:url` | `https://barmoshe.github.io/itay-shechter-portfolio/` | `https://<DOMAIN>/` |
| `og:image` | `https://barmoshe.github.io/itay-shechter-portfolio/img/og.jpg` | `https://<DOMAIN>/img/og.jpg` |
| `twitter:image` | `https://barmoshe.github.io/itay-shechter-portfolio/img/og.jpg` | `https://<DOMAIN>/img/og.jpg` |

#### 2d. Re-render the OG card with the new footer

[scripts/og-card.html:62](scripts/og-card.html) has a footer string
`barmoshe.github.io/itay-shechter-portfolio` baked into the rendered share
image at `public/img/og.jpg`. Update the footer text to `<DOMAIN>` (no scheme),
then re-render:

```bash
node scripts/render-og.mjs
```

That overwrites `public/img/og.jpg` (1200x630). Commit the new image with the
other edits.

#### 2e. Update the docs

- [README.md:60](README.md): "Live at" URL.
- [README.md:62](README.md): the "Vite `base` is `/itay-shechter-portfolio/`"
  paragraph - update to `/` and explain the custom domain takes care of it.
- [CLAUDE.md:56](CLAUDE.md): "Live at" URL.

Suggested commit message:
```
chore(domain): switch to <DOMAIN> custom domain

Add public/CNAME, drop Vite subpath base to /, update absolute URLs in
index.html (canonical, icon, og:url, og:image, twitter:image), re-render
the OG share image with the new footer, and refresh README/CLAUDE.
```

### 3. GitHub Pages settings

After the commit is pushed and Actions has redeployed:

1. Repo → **Settings → Pages**.
2. **Custom domain**: enter `<DOMAIN>`, save. GitHub does a DNS check; the green
   check appears once DNS resolves to the Pages IPs.
3. Wait for the cert (Let's Encrypt, automatic, a few minutes once DNS is
   green). Then tick **Enforce HTTPS**.
4. (If you added both apex and `www`, GitHub now redirects the non-canonical
   one to the canonical.)

---

## Verify

Local:

```bash
npm install
npm run lint
npm run build
```

Both must stay green. `dist/CNAME` should exist and contain `<DOMAIN>`.
`dist/index.html` should reference `https://<DOMAIN>/...` in canonical + OG +
Twitter tags, and the icon href should be `/favicon.svg` (no subpath).

Live (after push + Pages redeploy + DNS green + HTTPS enforced):

- `https://<DOMAIN>/` returns 200, RTL Hebrew renders, assets load.
- `https://<DOMAIN>/img/og.jpg` returns 200 with the updated footer.
- `https://barmoshe.github.io/itay-shechter-portfolio/` either 404s or
  redirects (Pages handles this automatically when a custom domain is bound).
- Social card debuggers see the new image:
  - Facebook: https://developers.facebook.com/tools/debug/
  - X / Twitter: https://cards-dev.twitter.com/validator
  - LinkedIn: https://www.linkedin.com/post-inspector/

---

## Rollback

If something is wrong after the switch:

1. In repo Settings → Pages, **remove** the custom domain. GitHub Pages goes
   back to serving at `https://barmoshe.github.io/itay-shechter-portfolio/`.
2. Revert the commit (`git revert <sha> && git push`) to put `base` back to
   `/itay-shechter-portfolio/` and restore the old absolute URLs.
3. Delete the GoDaddy DNS records if you want a clean undo, or leave them
   pointing at GitHub Pages for a later retry.

DNS changes do **not** need to be undone to recover the site - removing the
custom domain in Pages settings is enough.

---

## Notes / gotchas

- **`public/CNAME` is the source of truth.** Setting the custom domain in
  Settings → Pages writes a `CNAME` file to the deploy branch; we put one in
  `public/` so the source-controlled value wins on every deploy. Don't edit
  the domain through the UI without also updating `public/CNAME`, or the next
  deploy will overwrite it.
- **HTTPS first deploy lag.** The Let's Encrypt cert is provisioned after DNS
  resolves and the domain is saved in Pages. Until then "Enforce HTTPS" is
  disabled. Don't share the URL until HTTPS is on.
- **No mixed-content risk** here (no third-party scripts, no `http://` assets
  in `content.ts`), but if Itay's standalone HTML grows a remote image later,
  check that it's `https://`.
- **The digest skill is unaffected** - it only touches `src/data/content.ts`
  and `public/img/*`. A future content sync after the domain swap just lands
  on top.
