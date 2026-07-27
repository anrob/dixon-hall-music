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
1. **Turn off Cloudflare's managed robots.txt** — it overrides `site/robots.txt` at the edge and
   Disallows ClaudeBot, GPTBot, CCBot, Google-Extended, Bytespider, Applebot-Extended,
   meta-externalagent and Amazonbot. Blocks the site from AI answer engines. Dashboard-only fix.
2. **Fix the loader's LCP stall** — the animated gold sheen (`.loader-shine`) repaints
   continuously and holds Largest Contentful Paint open for ~48s (98% render delay). Reproducible
   on localhost, so it's not network. Dominates mobile performance.
3. Trim page weight: `band.png` is 3.8MB (1920×852 PNG), total page ~12MB.
4. Wire real streaming links + store links (currently `#` stubs).
5. Swap merch placeholder art for real product photos.
6. Add `Product` schema once the store opens with real buy URLs (deliberately omitted while
   it's "Opening Soon" — Product markup without a valid offer is a liability).

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
