# Dixon Hall Music — Content Backend (Airtable)

**Why Airtable:** free tier never pauses (unlike Supabase's 2-active-project cap),
and the editing UI is already built — John updates songs/shows from the Airtable
app on his phone. "I give you a backend to do it" = this.

## How it flows

```
John edits Airtable  →  /api/content (Vercel function, token hidden in env var)
                     →  site JS renders Music + Shows sections
                     →  fetch fails? baked-in fallback content stays. Never looks broken.
```

- Responses are CDN-cached 5 min (`s-maxage=300`) — fast, and Airtable rate limits never matter.
- Locally, `npm run dev` serves the same function at `/api/content` (token from `.env`).

## The base: "Dixon Hall Music"

- **Base ID:** `appvsNrgM1dbEPgFZ` (created + seeded 2026-07-02)
- Seeded with: "Beautiful Life" (Upcoming · 7.31.26 · Featured ⭐) and all 5 July shows.

### Table: Songs
| Field | Type | Notes |
|---|---|---|
| Title | Single line text | primary |
| Status | Single select | `Upcoming` / `Released` / `Hidden` |
| Release Date | Date (ISO) | drives countdown + weekday line |
| Cover Art | Attachment | John drops an image; replaces the crest placeholder |
| Blurb | Long text | the paragraph under the title |
| Spotify / Apple Music / YouTube / Amazon | URL | buttons hide automatically if empty |
| Pre-Save Link | URL | CTA target while Upcoming |
| Featured | Checkbox | featured song wins; else newest by date |

### Table: Shows
| Field | Type | Notes |
|---|---|---|
| Venue | Single line text | primary |
| Date | Date (ISO) | past shows auto-hide |
| City | Single line text | e.g. `Baltimore, MD` |
| Time | Single line text | e.g. `7:00 PM` |
| Ticket Link | URL | "Details" button target |

### Display logic
- **Song:** `Featured` checked wins (else newest). `Upcoming` → countdown + Pre-Save. `Released` (or date passed) → "Available Now" + Listen buttons. `Hidden` → skipped.
- **Shows:** only today/future, soonest first. Empty → "No upcoming shows."

## Setup checklist
1. ✅ Base created + seeded (`appvsNrgM1dbEPgFZ`) — 2026-07-02.
2. ☐ Create a PAT at https://airtable.com/create/tokens — scope `data.records:read`, access to this base only.
3. ☐ Local: copy `.env.example` → `.env`, fill in token (base ID below).
4. ☐ Vercel: set `AIRTABLE_TOKEN` + `AIRTABLE_BASE_ID` env vars at deploy.
5. ☐ Share the base with John's email (editor role) — his phone app is the admin panel.

## John's workflow (what Fresh tells him)
> Open the Airtable app → "Dixon Hall Music" → Songs → hit + → type the title,
> pick the date, drop in the cover, paste your links → done. Site updates itself.
