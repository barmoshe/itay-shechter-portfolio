# HANDOFF: moving the site to Itay's accounts

The site runs on Vercel and builds from this GitHub repo. The domain
`itayshechter.com` is registered at GoDaddy. This file is the checklist for
moving everything to Itay's own accounts and pointing the domain at it.

Order matters: get the site live on Itay's Vercel first, then point the
domain. That way the domain never points at nothing.

## 1. GitHub: get the repo into Itay's account

Either works:

- **Transfer** (keeps history and the same repo): the current owner opens the
  repo's Settings, then "Transfer ownership", to Itay's GitHub username. Itay
  accepts the email.
- **Copy**: Itay creates a new private repo and pushes a clone of this one to it.

## 2. Vercel: import the repo on Itay's account

1. Itay signs up at vercel.com with his GitHub account (Hobby plan is free and
   enough for this site).
2. "Add New..." then "Project", pick the repo, and Import. Leave the settings as
   they are: Vercel detects Next.js (`vercel.json` also sets `framework: nextjs`)
   and runs `npm run build`.
3. After the first deploy, open the `*.vercel.app` URL and check the site:
   the carousel, a video, the "דברו איתי" popup, and a phone-width view.

## 3. Point the GoDaddy domain at Itay's Vercel project

1. In the Vercel project: Settings, then Domains, add `itayshechter.com` and
   `www.itayshechter.com`. Choose one as the main address and let Vercel
   redirect the other (the site's canonical URL is `https://itayshechter.com/`).
2. Vercel then shows the exact DNS records to create. Use the values it shows;
   usually they are:
   - type `A`, name `@`, value `76.76.21.21`
   - type `CNAME`, name `www`, value `cname.vercel-dns.com`
3. At GoDaddy: My Products, then the domain, then DNS. Add those records and
   remove anything else on `@` and `www` (GoDaddy's default "Parked" A record,
   forwarding, or old records pointing at GitHub Pages). Leave MX / email
   records alone.
4. Wait for the domains to turn green in Vercel (minutes, sometimes up to a few
   hours). Vercel issues the HTTPS certificate on its own.

## Option: GitHub Pages instead of Vercel

The site is fully static, so GitHub Pages can host it too, with one account
fewer (GitHub only). Not set up yet; Vercel is what runs today. Weigh it before
step 2:

| | Vercel (today) | GitHub Pages |
|---|---|---|
| Accounts | GitHub + Vercel | GitHub only |
| Cost | Free (Hobby) | Free for a **public** repo; a private repo needs GitHub Pro |
| Deploy | Automatic on push to `main` | Automatic on push, through the workflow below |
| Preview link per branch | Yes | No |
| `vercel.json` security headers (images get long-lived hashed URLs either way) | Applied | Not available; GitHub uses its own short cache |
| Custom domain + HTTPS | Yes | Yes |

To switch to Pages:

1. Add `.github/workflows/pages.yml` with:

   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
     workflow_dispatch:
   permissions:
     contents: read
     pages: write
     id-token: write
   concurrency:
     group: pages
     cancel-in-progress: false
   jobs:
     deploy:
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - uses: actions/checkout@v6
         - uses: actions/setup-node@v6
           with:
             node-version-file: .nvmrc
             cache: npm
         - run: npm ci
         - run: npm run build
         - uses: actions/configure-pages@v5
         - uses: actions/upload-pages-artifact@v4
           with:
             path: out
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

2. Repo Settings, then Pages: Source "GitHub Actions". Push to `main` and the
   site appears at `https://<username>.github.io/<repo>/`. The page uses
   root-relative `/_next/...` links, so it only looks right on the custom domain,
   where the site sits at the root (or set `basePath` in `next.config.ts` for the
   github.io address).
3. Custom domain: Settings, then Pages, then Custom domain: `itayshechter.com`,
   and tick "Enforce HTTPS" once it is offered. At GoDaddy, set:
   - four `A` records on `@`: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - a `CNAME` on `www` pointing to `<username>.github.io`
   Remove other `@` / `www` records (Parked, forwarding, Vercel's). Leave MX
   alone. GitHub recommends verifying the domain in the account's Pages
   settings first, so no one else can claim it.
4. If Vercel was set up before, remove the domain from the Vercel project.

## 4. Clean up the old copies

- If the site was deployed on another Vercel account first, remove the domain
  from that project (or delete the project) once Itay's is live, so the domain
  belongs to exactly one project.
- The old GitHub Pages copy at `barmoshe.github.io/itay-shechter-portfolio/`
  can be turned off in the old repo's Settings, then Pages.

## After the move

Day to day: Itay edits through an AI (see `docs/editing-he.md`; assistants read
`AGENTS.md`), changes land on `main`, and the host (Vercel, or GitHub Pages if you
switch) publishes in about a minute.

Optional, once the repo is in Itay's account: GitHub Settings, then Branches (or
Rules), add a rule for `main` that requires the `CI / check` status to pass. The
trade-off: every change then has to go through a pull request (the GitHub web
editor offers "Create a new branch and start a pull request"), so the quick
"edit and commit to main" route in `docs/editing-he.md` stops working. Without the
rule a broken change can reach `main`, but Vercel still refuses to publish a
failed build, so the live site stays up.
