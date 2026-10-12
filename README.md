# itayshechter.com

Itay Shechter's portfolio: Social Media Lead. One page, Hebrew, right-to-left.

## How it works

- `index.html` is the whole site in one file: copy, styles, behaviour and images
  (embedded as base64). Open it in any browser to see the site.
- On every push to `main`, Vercel runs `node build.mjs`, which publishes a faster
  copy from `dist/`: the embedded images become separate cached files and load
  lazily. No dependencies, nothing to install.
- `img/og.jpg` is the image shown when the link is shared (1200x630).
  `robots.txt` and `sitemap.xml` point at `https://itayshechter.com/`.

## Updating the site

Edit `index.html` (with Claude, see `CLAUDE.md`), check it in a browser, push to
`main`. Vercel publishes it in about a minute.

## Moving it to your own accounts

See `HANDOFF.md`: GitHub, Vercel, and pointing the GoDaddy domain.
