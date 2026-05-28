# HANDOFF - swap to Itay's custom GoDaddy domain

For the next agent (or future-Bar). Itay bought a domain at GoDaddy. This file
prepares the swap from the current GitHub Pages subpath URL
(`https://barmoshe.github.io/itay-shechter-portfolio/`) to the custom domain.
Nothing here has been applied yet, because the domain string is not in the repo
and the DNS + Pages settings live outside it.

This playbook follows GitHub's official Pages docs on
[Configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
Read the [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
and [Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
pages alongside this one - this file is the project-specific recipe, those are
canonical.

Standing rules: no em-dash character anywhere; no emoji. Deploy is Bar's step
(don't `git push` to ship). Workshop pointer for this repo:
`bar_builds/lab/itay/itay-shechter-portfolio/`. The deploy is Actions-based
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) - that matters
in step 4 below.

---

## Inputs needed from Bar / Itay before starting

- [ ] **The domain string.** Apex (`itayshechter.com`) or subdomain
  (`www.itayshechter.com`)? Both shapes work. GitHub recommends the combined
  pattern (apex + `www`); pick one as canonical and let GitHub redirect the
  other. Below I write the canonical as `<DOMAIN>` and the apex as `<APEX>`
  (they may be the same if you go apex-only).
- [ ] **GoDaddy access** to edit DNS records on `<APEX>`.
- [ ] **Confirmation** that the GitHub repo is `barmoshe/itay-shechter-portfolio`
  and Pages is publishing from GitHub Actions on `main` (it is, today).
- [ ] **Punycode**, if `<DOMAIN>` is non-ASCII. GitHub requires
  "the Punycode encoded version" in the custom-domain field for
  internationalized domain names. Convert with `idn2 <unicode-domain>` or any
  online IDN converter before pasting into the UI.

---

## Order matters (GitHub-recommended sequence)

GitHub explicitly warns:

> Make sure you add your custom domain to your GitHub Pages site before
> configuring your custom domain with your DNS provider. Configuring your
> custom domain with your DNS provider without adding your custom domain to
> GitHub could result in someone else being able to host a site on one of
> your subdomains.

So the order is: **GitHub UI → verify domain → DNS records → wait for green
check → land the repo edits + push → enforce HTTPS.** Do not jump ahead.

---

## Phase 1: Add the custom domain in Settings -> Pages

1. Repo -> **Settings** -> **Pages** (under "Code and automation").
2. Under **Custom domain**, type `<DOMAIN>` and click **Save**.
3. GitHub immediately tries a DNS check. It will fail (red) because DNS isn't
   set up yet - that's fine. The domain is now bound to this repo, which is
   the point: nobody else can claim it.

Note: because this site deploys via GitHub Actions, **no `CNAME` file is
created** and no source-tree `CNAME` is required. From GitHub's docs:

> For Actions-based workflows: no `CNAME` file is created, and any existing
> `CNAME` file is ignored and is not required.

The Pages settings UI is the source of truth here, not a file in the repo.
Do **not** add `public/CNAME` - it would be a redundant no-op for this
deploy method and would mislead the next maintainer about how the binding
works.

---

## Phase 2: Verify the domain (TXT record)

Verification is optional but strongly recommended. It guarantees that even if
this repo is later deleted, renamed, or has Pages disabled, nobody else can
publish a site to `<DOMAIN>` or its immediate subdomains under a different
account.

1. Profile photo -> **Settings** -> **Pages** -> **Add a domain**.
2. Enter `<APEX>` (verify at the apex, not the subdomain - that covers
   immediate subdomains like `www.<APEX>` too).
3. GitHub shows a TXT record to add:
   - **Type:** `TXT`
   - **Host / Name:** `_github-pages-challenge-barmoshe` (GoDaddy auto-appends
     the apex, so the full FQDN becomes
     `_github-pages-challenge-barmoshe.<APEX>`)
   - **Value:** the verification token GitHub displays - **copy it exactly**;
     do not regenerate.
4. Add the TXT record at GoDaddy (see Phase 3 for the GoDaddy UI flow; same
   DNS tab, just select Type = TXT).
5. Wait for propagation (typically minutes; GitHub says "may be immediate or
   take up to 24 hours"). Confirm with:
   ```bash
   dig _github-pages-challenge-barmoshe.<APEX> +noall +answer -t TXT
   ```
   You want to see the token string in the answer.
6. Back in **Settings -> Pages -> Pending domain verification**, click the
   kebab menu -> **Continue verifying** -> **Verify**.
7. Keep the TXT record in DNS forever after verification. Removing it later
   un-verifies the domain.

---

## Phase 3: DNS records at GoDaddy

GoDaddy UI: Sign in at `dcc.godaddy.com/control/portfolio` -> select
`<APEX>` -> **Domain Settings** -> **DNS** tab. Field labels you'll see:
**Type**, **Name**, **Value**, **TTL** (default 1 hour - leave it).

Before adding new records, **remove any default Parked / Forwarding record**
on `@` that GoDaddy may have created, or your A records will fight it.

### If `<DOMAIN>` is the apex (`itayshechter.com`)

Add **one A record on `@` with four values** (GoDaddy supports multi-value
records via "**Add another value**", which is cleaner than four separate
rows):

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |

GitHub also "highly recommends" adding IPv6 alongside IPv4:

| Type | Name | Value |
|---|---|---|
| `AAAA` | `@` | `2606:50c0:8000::153` |
| `AAAA` | `@` | `2606:50c0:8001::153` |
| `AAAA` | `@` | `2606:50c0:8002::153` |
| `AAAA` | `@` | `2606:50c0:8003::153` |

### If `<DOMAIN>` is `www.<APEX>`

Add one CNAME on `www` pointing at the **user**'s github.io domain (not the
repo URL):

| Type | Name | Value |
|---|---|---|
| `CNAME` | `www` | `barmoshe.github.io` |

The trailing-dot syntax (`barmoshe.github.io.`) is the strict DNS form;
GoDaddy normalises either way. Critical: the target is `barmoshe.github.io`,
**never** `barmoshe.github.io/itay-shechter-portfolio` - DNS targets are
hostnames, not URLs.

### Recommended: apex + `www` together

Add **both** the A records on `@` (Phase 3a) **and** the CNAME on `www`
(Phase 3b). Then `<DOMAIN>` in **Settings -> Pages** picks one as canonical;
GitHub will redirect the other automatically. Per GitHub:

> Setting up a `www` subdomain alongside an apex domain is recommended for
> HTTPS secured websites.

**Do not** do the inverse (a CNAME from `www` to the apex, or any apex
configured via CNAME alone). GitHub: "If you point your custom subdomain to
your apex domain, you will encounter issues with enforcing HTTPS."

### Verify DNS propagation

DNS can take "up to 24 hours" to propagate (usually minutes at GoDaddy).
Confirm with the exact commands from GitHub's docs:

```bash
dig <APEX>     +noall +answer -t A
dig www.<APEX> +noall +answer -t CNAME
```

Expected A output (one row per IP):
```
<APEX>.    3600    IN    A    185.199.108.153
<APEX>.    3600    IN    A    185.199.109.153
<APEX>.    3600    IN    A    185.199.110.153
<APEX>.    3600    IN    A    185.199.111.153
```

Expected CNAME output:
```
www.<APEX>.    3600    IN    CNAME    barmoshe.github.io.
```

When DNS is good, **Settings -> Pages** turns the red check into a green
check. Wait for that before moving on.

---

## Phase 4: Repo edits (one commit, do not push yet)

Make these edits on `main` and commit. Do **not** push - that is Bar's step,
because the push triggers the live deploy. Once pushed and Actions has
finished, the site at `<DOMAIN>` will load with the correct asset paths.

### 4a. Drop the Vite subpath base

[vite.config.ts:8](vite.config.ts) currently has:

```ts
base: '/itay-shechter-portfolio/',
```

Change to:

```ts
base: '/',
```

The asset helper [src/lib/asset.ts](src/lib/asset.ts) reads
`import.meta.env.BASE_URL`, so it follows automatically - no edit there.

### 4b. Update the absolute URLs in `index.html`

Five lines in [index.html](index.html) reference the current Pages URL or the
subpath. Replace each:

| Line | Now | After |
|---|---|---|
| canonical | `https://barmoshe.github.io/itay-shechter-portfolio/` | `https://<DOMAIN>/` |
| `<link rel="icon">` href | `/itay-shechter-portfolio/favicon.svg` | `/favicon.svg` |
| `og:url` | `https://barmoshe.github.io/itay-shechter-portfolio/` | `https://<DOMAIN>/` |
| `og:image` | `https://barmoshe.github.io/itay-shechter-portfolio/img/og.jpg` | `https://<DOMAIN>/img/og.jpg` |
| `twitter:image` | `https://barmoshe.github.io/itay-shechter-portfolio/img/og.jpg` | `https://<DOMAIN>/img/og.jpg` |

### 4c. Re-render the OG card with the new footer

[scripts/og-card.html:62](scripts/og-card.html) has a footer string
`barmoshe.github.io/itay-shechter-portfolio` baked into the rendered share
image at `public/img/og.jpg`. Update the footer text to `<DOMAIN>` (no
scheme), then re-render:

```bash
node scripts/render-og.mjs
```

That overwrites `public/img/og.jpg` (1200x630). Commit the new image with
the other edits.

### 4d. Update the docs

- [README.md:60](README.md): "Live at" URL.
- [README.md:62](README.md): the "Vite `base` is `/itay-shechter-portfolio/`"
  paragraph - update to `/` and explain the custom domain takes care of it.
- [CLAUDE.md:56](CLAUDE.md): "Live at" URL.

Suggested commit message:
```
chore(domain): switch to <DOMAIN> custom domain

Drop Vite subpath base to /, update absolute URLs in index.html (canonical,
icon, og:url, og:image, twitter:image), re-render the OG share image with
the new footer, and refresh README/CLAUDE. Custom domain itself is bound
via Settings -> Pages (Actions-based deploy ignores any source-tree
CNAME, per GitHub's docs).
```

---

## Phase 5: Push + Pages redeploy

Bar pushes `main`; GitHub Actions runs lint + build and publishes the new
`dist/` to Pages. The site at `<DOMAIN>` should now load correctly with
the new asset paths.

---

## Phase 6: Enforce HTTPS

1. **Settings -> Pages -> Enforce HTTPS.** GitHub provisions a Let's Encrypt
   cert automatically once the custom domain is bound and DNS resolves.
2. The checkbox **can take up to 24 hours** to become available
   (troubleshooting page says HTTPS itself "can take up to an hour" once the
   cert lands, but the checkbox appearing is the gating step).
3. Tick the box once it's enabled. Don't share `<DOMAIN>` publicly until
   this is on - serving an Itay-branded site over plain HTTP is a bad look.

If Enforce HTTPS stays greyed out for more than a day with green DNS, the
usual fixes are: remove and re-add the custom domain in **Settings ->
Pages** to retrigger cert issuance; or check that a CAA record at the apex
isn't blocking Let's Encrypt (see Notes below).

---

## Verify

Local (before pushing):

```bash
npm install
npm run lint
npm run build
```

Both must stay green. `dist/index.html` should reference `https://<DOMAIN>/`
in canonical + OG + Twitter tags, and the icon href should be
`/favicon.svg` (no subpath). There should be **no** `dist/CNAME` and **no**
`public/CNAME` (the binding lives in Pages settings, not in the artifact).

Live (after push + Pages redeploy + green DNS check + HTTPS enforced):

- `https://<DOMAIN>/` returns 200, RTL Hebrew renders, assets load (open
  DevTools Network and confirm nothing 404s).
- `https://<DOMAIN>/img/og.jpg` returns 200 with the updated footer.
- `https://barmoshe.github.io/itay-shechter-portfolio/` redirects to
  `https://<DOMAIN>/` (Pages does this automatically when a custom domain
  is bound and `<user>.github.io` traffic for this project arrives).
- Social card debuggers see the new image:
  - Facebook: https://developers.facebook.com/tools/debug/
  - X / Twitter: https://cards-dev.twitter.com/validator
  - LinkedIn: https://www.linkedin.com/post-inspector/

---

## Rollback

If something is wrong after the switch:

1. **Settings -> Pages -> Remove** the custom domain. GitHub Pages goes back
   to serving at `https://barmoshe.github.io/itay-shechter-portfolio/`.
2. Revert the commit (`git revert <sha> && git push`) to put `base` back to
   `/itay-shechter-portfolio/` and restore the old absolute URLs.
3. Optional: delete the GoDaddy A/AAAA/CNAME records. Leaving them pointing
   at GitHub is harmless for a later retry.
4. **Keep the verification TXT record** in DNS regardless. It costs nothing
   and keeps the takeover protection alive for the next attempt.

DNS changes do **not** need to be undone to recover the site - removing the
custom domain in Pages settings is enough.

---

## Notes / gotchas

- **CNAME filename must be uppercase.** From GitHub's troubleshooting docs:
  "The CNAME filename must be all uppercase." Only relevant if a future
  agent switches off Actions deploys and goes back to branch publishing -
  but worth flagging if it ever recurs.
- **No `public/CNAME` for Actions deploys.** Reiterating because most
  Vite + GitHub Pages blog posts get this wrong: with `actions/deploy-pages`,
  a CNAME file in the artifact is ignored. The Pages settings UI is the
  source of truth. Don't add one.
- **Don't point a `www` CNAME to the apex.** GitHub: "If you point your
  custom subdomain to your apex domain, you will encounter issues with
  enforcing HTTPS to your website" and the subdomain may not reach the
  Pages site at all. Always CNAME `www` to `barmoshe.github.io`, never to
  `<APEX>`.
- **Wildcards are dangerous.** GitHub: "We strongly recommend that you do
  not use wildcard DNS records, such as `*.example.com`. These records put
  you at an immediate risk of domain takeovers, even if you verify the
  domain." Don't add a `*` CNAME at GoDaddy.
- **CAA records can block Let's Encrypt.** If `<APEX>` already has CAA
  records (it almost certainly doesn't on a fresh GoDaddy registration),
  at least one must list `letsencrypt.org` or HTTPS provisioning silently
  fails. Check with:
  ```bash
  dig <APEX> +noall +answer -t CAA
  ```
  Empty answer = fine (no restrictions). If non-empty without
  `letsencrypt.org`, add `0 issue "letsencrypt.org"`.
- **HTTPS first-deploy lag.** Up to an hour after DNS turns green before
  HTTPS works; up to 24 hours before the **Enforce HTTPS** checkbox
  becomes available. Don't share `<DOMAIN>` until both are done.
- **No mixed-content risk** today (no third-party scripts, no `http://`
  assets in `content.ts`). If a future digest brings in a remote image
  from Itay's standalone, check that it's `https://`.
- **The `<user>.github.io` custom domain caveat.** If `barmoshe.github.io`
  itself ever gets its own custom domain set, that domain would also become
  the default for this repo unless this repo overrides with its own. Not
  relevant today; flagging in case.
- **The digest skill is unaffected.** It only touches `src/data/content.ts`
  and `public/img/*`. A future content sync after the domain swap just
  lands on top.

---

## References

- [GitHub Pages: Configuring a custom domain (overview)](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) - DNS recipes, UI steps, IPs.
- [Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) - TXT record format and the takeover-protection rationale.
- [Troubleshooting custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages) - CNAME errors, HTTPS lag, CAA record requirement.
- [GoDaddy: Add an A record](https://www.godaddy.com/help/add-an-a-record-19238) - GoDaddy's DNS UI labels.
- [actions/deploy-pages](https://github.com/actions/deploy-pages) - the action this repo uses to publish.
