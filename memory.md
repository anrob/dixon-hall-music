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

## Design system (full build, 2026-07-01)
- Type: **Anton** (heavy condensed display) × **Marcellus / Marcellus SC** (serif labels + nav) × **Barlow** (body). Metallic silver gradient on display headings echoes the crest.
- Palette: `--bg #0a0705`, `--bg2 #060402`, cream `#e7ddcb`, gold `#cda45f`→`#e9c17e`.
- Rules followed (frontend-design + ui-ux-pro-max skills): one hero element per section, 112px+ section rhythm, contained centered width (~1180px), no parallax, sharp corners, restraint. Scroll-reveals via IntersectionObserver.
- Sections (single page, anchors = nav): Hero → Music/Single (Beautiful Life + live countdown to 7.31.26 + cover-art card) → About (bio + Hall/Glaze member cards) → Shows (tour ledger) → Media (photo + crest tile + follow) → Store (5 merch cards, placeholder note) → Fan Club newsletter → footer.
- **Listen Now** is NOT pinned — it scrolls with the hero nav and docks as the **last item** in the sticky top bar (gold CTA). Order: Home·Music·About·Shows·Media·Store·Listen Now.

## Stubs / to wire later
- Streaming links (Spotify/Apple/YouTube/Amazon) + Pre-Save = `#` (no real links exist yet, pre-release).
- Merch cards + "Details" show links = `#`; merch uses crest placeholder art (real product photos slot in).
- Newsletter form is non-submitting.

## Preview quirk
The Claude preview screenshot tool renders **black** whenever a `position:fixed` element (the sticky topnav) is visible, and only captures reliably at scroll 0. To screenshot sections, hide siblings + bring target to top (a `__showOnly` helper injected via eval). Not a page bug — renders fine in real browsers.

## Status
Full site built + responsive + verified, not deployed. GitHub remote + Vercel still staged for Fresh's go.
