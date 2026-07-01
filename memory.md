# Dixon Hall Music — Project Memory

## What it is
Website for **Dixon Hall — No Limit Country**, a Maryland-based country duo:
- **John Dixon Hall Jr.** — vocals, songwriter (Maryland native)
- **Terry Glaze** — guitar, vocals (rock guitarist, ex-Pantera/Lord Tracy era)

Genre: modern country with soul, storytelling, southern rock energy.

## Origin
- Fresh mocked the hero in Claude Design (claude.ai/design) and exported a handoff bundle into `projects/dixon-hall-music/project/` (now reorganized).
- Two hero directions were exported. **v2** (cinematic art-plate, Marcellus serif) is the chosen/primary one — it's the finished direction and the file Fresh had open at handoff. **v1** (Anton "Soul Meets Southern Rock" over the raw band photo) is kept as an alternate.

## Key facts
- New single **"Beautiful Life"** — out Fri **7.31.26**.
- Debut EP recorded in Nashville (band photo is shot at the Parthenon replica, Nashville).
- Booking: **john@johndixonhalljr.com**
- Socials: IG/FB **@dixonhallband**, TikTok **@johndixonhalljr**. (No confirmed Spotify/YouTube yet — pre-release.)
- Current live site: dixonhallmusic.com (looks like a hosted builder — we're rebuilding custom).

## Decisions
- **Own repo**, not monorepo (deployable client site → repo-per-project rule). Gitignored from FreshOS.
- Dark/cinematic brand — the usual light-theme default is intentionally waived here.
- Hero uses the baked `hero-mock.png` art plate (crest + tagline are in the image). A future option is rebuilding v2 with live text for crisper mobile/SEO — noted, not done.

## Status
Hero built + responsive, not deployed. Rest of site (Music/About/Shows/Media/Store) still to build.
