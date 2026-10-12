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
   they are: `vercel.json` already sets the build (`node build.mjs`, output
   `dist`, no framework).
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

## 4. Clean up the old copies

- If the site was deployed on another Vercel account first, remove the domain
  from that project (or delete the project) once Itay's is live, so the domain
  belongs to exactly one project.
- The old GitHub Pages copy at `barmoshe.github.io/itay-shechter-portfolio/`
  can be turned off in the old repo's Settings, then Pages.

## After the move

Day to day: edit `index.html` with Claude (see `CLAUDE.md`), push to `main`,
Vercel publishes in about a minute.
