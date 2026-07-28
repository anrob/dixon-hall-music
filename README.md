# Dixon Hall Music

Website for **Dixon Hall — No Limit Country**: John Dixon Hall Jr. × rock icon Terry Glaze. Modern country music with soul, storytelling, and southern rock energy.

- **Live site:** https://www.dixonhallmusic.com/ — custom domain IS pointed (Cloudflare → Vercel)
- **Status:** 🟢 LIVE
- **Repo:** [`anrob/dixon-hall-music`](https://github.com/anrob/dixon-hall-music) (private) — own repo, carved out of the FreshOS monorepo per repo-per-project rule
- **Deploy:** push to `main` → Vercel auto-deploys to production. See [Deploying](#deploying).
- **Run locally:** `npm run dev` → http://localhost:3000 (zero-dependency static server, binds `0.0.0.0` for LAN preview)

## Deploying
Vercel is **git-connected** (`anrob/dixon-hall-music` @ `main`) with **Root Directory = `site`**.
Push to `main` and it deploys. No CLI step.

That Root Directory setting is load-bearing: the repo root has no `index.html`, so if it's ever
unset the whole site 404s. Vercel still reports such a build as `● Ready` — the upload succeeds,
only the served content is wrong. So don't trust the green check; verify:

```
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://www.dixonhallmusic.com/
```

`200` + ~129000 bytes = serving. `404` + 79 bytes = Root Directory is wrong.

Recovery if a deploy breaks the site: `cd site && vercel --prod` (deploys the local tree from the
correct root, ~30s), then fix the setting.

## What's here
- `site/` — deployable site. `site/index.html` is the live hero, built from the v2 Claude Design.
- `site/assets/` — logo, hero art plate, band photo, brick texture.
- `docs/design-handoff/` — original Claude Design (claude.ai/design) export bundle, both hero directions (v1 + v2) preserved untouched.
- `content/` — copy/drafts.

## Design directions
- **v2 (BUILT)** — cinematic art-plate hero: both members flanking the metallic Dixon Hall crest, "Real Country. Real Stories. No Limits.", nav + socials seated on top. Marcellus serif. This is the shipped hero.
- **v1 (alternate)** — code-built hero over the raw Parthenon band photo: Anton headline "Soul Meets Southern Rock", new-single badge, marquee. Preserved in `docs/design-handoff/`.

## Next action
1. Wire real streaming links + store links (currently `#` stubs).
2. Swap merch placeholder art for real product photos.
3. Add `Product` schema once the store opens with real buy URLs (deliberately omitted while
   it's "Opening Soon" — Product markup without a valid offer is a liability).

## Cloudflare (settled 2026-07-27 — don't re-enable)
Two settings under **AI Crawl Control** were blocking AI answer engines. Both are now off:
- **Managed robots.txt** (Overview) — was prepending `Content-Signal: ai-train=no` plus a
  `Disallow: /` list ahead of `site/robots.txt`. It also failed Lighthouse's robots.txt
  validation, capping SEO at 92.
- **Per-crawler blocks** (Security) — the real enforcement. GPTBot, CCBot, Bytespider and
  Amazonbot were being served a block response regardless of what robots.txt said.

Verified by user-agent, not just by reading the file:
```
for UA in GPTBot CCBot Bytespider Amazonbot ClaudeBot; do
  curl -sS -A "$UA" -o /dev/null -w "$UA %{http_code}\n" https://www.dixonhallmusic.com/
done
```
All 200. Lighthouse SEO is 100/100 with zero failing audits.

## Known: mobile Performance reads low in Lighthouse
Default Lighthouse (and PageSpeed Insights lab data) uses *simulated* throttling, which
intermittently attributes LCP to `a.hero-listen` with ~93% "render delay" and 0ms load time —
scoring 58–65. Re-run the same URL with `--throttling-method=devtools` and it's **Performance
100, LCP ~1.3s**. The page really does paint in ~1.3s; the low number is a modelling artifact.
Trust CrUX field data over the lab score. Ruled out by experiment: the `.eq` animation and the
scroll-driven nav fade each moved LCP by 0.0s.

Remaining Best Practices 78/79 is `__cf_bm` cookies set by the `filesafe.space` and
`printful.com` CDNs serving cover art and product images — their infrastructure, not ours.

## Band facts (from dixonhallmusic.com)
- **Members:** John Dixon Hall Jr. (vocals/songwriter), Terry Glaze (guitar/vocals)
- **New single:** "Beautiful Life" — out Fri 7.31.26
- **Debut EP:** recorded in Nashville
- **Booking:** john@johndixonhalljr.com
- **Socials:** IG/FB @dixonhallband, TikTok @johndixonhalljr
- **Merch:** tank ($35), beanie ($30), trucker cap ($30), crop hoodie ($36.50), tee ($23.50)

### Upcoming shows (MD/PA)
- Jul 8 — Admirals Cup, Baltimore MD
- Jul 11 — Twains Tavern, Pasadena MD
- Jul 17 — Tolchester, Chestertown MD
- Jul 24 — Natalie's, Fallston MD
- Jul 25 — Smoke on the Rail BBQ Fest, New Freedom PA
