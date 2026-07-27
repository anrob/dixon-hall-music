# Dixon Hall — handoff (updated 2026-07-27)

## Status: LIVE at https://www.dixonhallmusic.com/ — deploys are automatic.

## Deploying
Vercel is **git-connected** to `anrob/dixon-hall-music` @ `main`, with
**Root Directory = `site`**. Push to `main` and it deploys to production. No CLI step.

> Superseded: this doc previously said the project was NOT git-connected and told you to run
> `vercel --prod`. That is no longer true — doing it now can push stale local state over a good
> git build.

**Root Directory is load-bearing.** The repo root has no `index.html`, so if it's ever unset the
entire site 404s. Vercel reports that build as `● Ready` anyway — the upload succeeds, only the
served content is wrong. Never trust the green check alone:

```
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://www.dixonhallmusic.com/
```

`200` + ~129000 bytes = serving. `404` + 79 bytes = Root Directory is wrong.

Recovery if a deploy breaks the site: `cd site && vercel --prod` — deploys the local tree from the
correct root and restored it in ~30s when this happened on 2026-07-27. Then fix the setting.
(`vercel rollback` needs an explicit deployment URL and the right `--scope`; the bare command only
reports status.)

John's *content* edits never need a deploy — they're live from the Sheet.

## Key facts
- `site/api/content.js` — reads the PUBLIC Google Sheet **"Dixon Hall — Website"** (tabs
  **Songs**, **Shows**) via gviz JSON. No API key; sheet id hardcoded:
  `15GA2gv4DY5XhEJtmtUbAK-VL8ZVCrjv3q6XV6Ngwwts`
- Sheet shared "anyone with link → Viewer"; John added as Editor.
- `site/assets/beautiful-life.jpg` — current cover (John swaps via a URL later; GHL uploader TBD).
- Airtable fully retired (no token/env needed). Client guide: `docs/how-to-edit-your-site.html`.
- Tests: `node test/content.test.js` (all pass).
