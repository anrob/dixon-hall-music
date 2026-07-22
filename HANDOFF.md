# Dixon Hall — handoff (2026-07-06)

## Status: DONE except the production deploy.

Content backend switched **Airtable → Google Sheets**. Committed + pushed to
`anrob/dixon-hall-music` `main` (commit `1afce7d`). Verified end-to-end against the live
sheet (1 song, 5 shows, clean times). The live site just needs **one production deploy**.

## Why it's stuck / how to finish
This Vercel project is **NOT git-connected**, so `git push` never deploys it — it's been
serving the original one-time deploy (still the old Airtable version). The folder is already
linked (`.vercel/project.json`). From this folder, one command:

```
vercel --prod
```

Then confirm it flipped (cover should be `assets/beautiful-life.jpg`, not an airtable URL):

```
curl -s "https://dixon-hall-music.vercel.app/api/content?cb=1" | grep -o '"cover":"[^"]*"'
```

Rollback if anything looks off: `vercel rollback` (current prod = the working Airtable build,
so there's a safe fallback).

## Optional — stop this recurring
Vercel → **dixon-hall-music → Settings → Git** → connect `anrob/dixon-hall-music`, so future
code changes auto-deploy like your other projects. (John's *content* edits never need a
deploy — they're live from the Sheet.)

## Key facts
- `site/api/content.js` — reads the PUBLIC Google Sheet **"Dixon Hall — Website"** (tabs
  **Songs**, **Shows**) via gviz JSON. No API key; sheet id hardcoded:
  `15GA2gv4DY5XhEJtmtUbAK-VL8ZVCrjv3q6XV6Ngwwts`
- Sheet shared "anyone with link → Viewer"; John added as Editor.
- `site/assets/beautiful-life.jpg` — current cover (John swaps via a URL later; GHL uploader TBD).
- Airtable fully retired (no token/env needed). Client guide: `docs/how-to-edit-your-site.html`.
- Tests: `node test/content.test.js` (all pass). `index.html` render logic unchanged.
```
