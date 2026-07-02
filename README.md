# Dixon Hall Music

Website for **Dixon Hall — No Limit Country**: John Dixon Hall Jr. × rock icon Terry Glaze. Modern country music with soul, storytelling, and southern rock energy.

- **Live site (client's current):** https://www.dixonhallmusic.com/
- **Status:** 🟢 Full one-page site built (all sections), not yet deployed
- **Repo:** [`anrob/dixon-hall-music`](https://github.com/anrob/dixon-hall-music) (private) — own repo, carved out of the FreshOS monorepo per repo-per-project rule
- **Run locally:** `npm run dev` → http://localhost:3000 (zero-dependency static server, binds `0.0.0.0` for LAN preview)

## What's here
- `site/` — deployable site. `site/index.html` is the live hero, built from the v2 Claude Design.
- `site/assets/` — logo, hero art plate, band photo, brick texture.
- `docs/design-handoff/` — original Claude Design (claude.ai/design) export bundle, both hero directions (v1 + v2) preserved untouched.
- `content/` — copy/drafts.

## Design directions
- **v2 (BUILT)** — cinematic art-plate hero: both members flanking the metallic Dixon Hall crest, "Real Country. Real Stories. No Limits.", nav + socials seated on top. Marcellus serif. This is the shipped hero.
- **v1 (alternate)** — code-built hero over the raw Parthenon band photo: Anton headline "Soul Meets Southern Rock", new-single badge, marquee. Preserved in `docs/design-handoff/`.

## Next action
1. Deploy to Vercel (`rootDirectory = site`) — staged, awaiting Fresh's go.
2. Wire real streaming / pre-save links + store links (currently `#` stubs).
3. Swap merch placeholder art for real product photos.

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
