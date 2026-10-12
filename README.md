# itayshechter.com

Itay Shechter's portfolio: Social Media Lead. One page, Hebrew, right to left.
Live at https://itayshechter.com.

- **Itay:** to change the site with ChatGPT, Claude or any AI, read
  [`docs/editing-he.md`](docs/editing-he.md).
- **AI assistants and developers:** read [`AGENTS.md`](AGENTS.md).
- **Moving hosting or the domain:** [`HANDOFF.md`](HANDOFF.md).

## In short

- All the text, links, numbers and videos are in `src/content/site.ts`; images are in `src/assets/`.
- Next.js (static export) + React + TypeScript. `npm ci`, `npm run dev`, `npm run check`, `npm run build`.
- Every push to `main` deploys on Vercel; every pull request gets a preview link. CI
  checks types, the house rules (no em-dashes, no emoji) and the build.
