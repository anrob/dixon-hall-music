# GHL AI Studio (Vibe Coder) — Clone Prompt for dixonhallmusic

Paste everything below the line into Vibe Coder as one prompt.

---

Build a single-page band website for **Dixon Hall — No Limit Country**, a pixel-faithful clone of https://dixon-hall-music.vercel.app — study that live site as the visual reference. Vanilla HTML/CSS/JS in one page. Dark, cinematic, editorial — NOT a generic SaaS look. Sharp corners everywhere (2px max radius).

## 1. DESIGN SYSTEM

**Colors (CSS variables):**
- `--bg: #0a0705` (page) · `--bg2: #060402` (darker bands) · `--bg3: #0d0a07`
- `--cream: #e7ddcb` (text) · `--cream-dim: #c3bbb0` · `--muted: #8f8676`
- `--gold: #cda45f` · `--gold2: #e9c17e` (accents, CTAs, hovers)
- `--line: rgba(231,221,203,.12)` (hairline borders)

**Fonts (Google Fonts + Font Awesome 6 icons):**
- **Anton** — huge display headings, uppercase, line-height .92
- **Marcellus** — nav links, buttons, venue names (letter-spacing .2em, uppercase for nav/buttons)
- **Marcellus SC** — small-caps eyebrows/labels (letter-spacing .28–.42em)
- **Barlow** — body text

**Metallic heading treatment** (all big section headings): text filled with `linear-gradient(180deg,#ffffff 0%,#eceef0 38%,#c2c6cc 66%,#9a9ea4 100%)` via `background-clip:text; color:transparent` + subtle drop-shadow. Looks like brushed chrome.

**Rhythm:** section padding `clamp(88px,13vh,150px)` vertical; content container max-width 1180px centered. Section eyebrows: small-caps gold label with a number ("01") and a short gold gradient bar.

**Assets (download/use these exact files):**
- Logo (chrome crest, transparent PNG): https://dixon-hall-music.vercel.app/assets/logo.png
- Hero art plate (both members + crest, baked image): https://dixon-hall-music.vercel.app/assets/hero-mock.png
- Band photo (Nashville Parthenon): https://dixon-hall-music.vercel.app/assets/band.png
- Brick texture: https://dixon-hall-music.vercel.app/assets/brick.avif

## 2. LOADING SCREEN
Full-screen preloader, near-black radial background. Centered: the crest logo (~260px) with a **gold light-sweep** passing across it every 2.6s (a moving gradient masked to the logo's alpha via CSS `mask-image`), soft pulsing gold radial glow behind it, five thin gold equalizer bars bouncing below (staggered delays), and "NO LIMIT COUNTRY" in Marcellus SC letter-spaced small caps. Shows minimum 2 seconds, waits for window load, then fades out (.7s) and unlocks scroll. Hard cap 6s. Respect prefers-reduced-motion.

## 3. HERO (100vh)
The hero art plate image fills the viewport (`object-fit:cover; object-position:center 18%`), with a very slow zoom 1.0 → 1.05 over 30s. Dark gradient masks: radial top-right (behind socials) and a bottom gradient to seat the nav.

- **Top-right:** "FOLLOW US" (Marcellus SC) + icons → Facebook https://www.facebook.com/dixonhallband · Instagram https://www.instagram.com/dixonhallband/ · TikTok https://www.tiktok.com/@johndixonhalljr · Spotify `#`. Icons lift 2px + turn gold on hover.
- **Bottom nav (centered, split):** HOME MUSIC ABOUT — [LISTEN NOW] — SHOWS MEDIA STORE. Links: Marcellus, uppercase, .2em spacing, cream; hover = white + 2px gold underline; HOME active (gold underline). LISTEN NOW = gold-outlined box button, gold text, 5 animated equalizer bars inside; hover fills gold with dark text.

## 4. SCROLL NAV BEHAVIOR (important)
As the user scrolls past the hero (crossfade between 42% and 82% of viewport height):
- The hero bottom nav fades out.
- A **fixed top bar** fades in (blurred near-black, thin gold bottom border, 72px): crest logo left (44px), links right: HOME MUSIC ABOUT SHOWS MEDIA STORE, and **LISTEN NOW as the LAST nav item** — a solid gold-gradient pill CTA with mini equalizer bars.
- Opacity/pointer-events crossfade both directions. Mobile (≤820px): hamburger button (fixed top-left) opens a full-screen dark menu; hero shows only the LISTEN NOW button.

## 5. MARQUEE
Thin strip under the hero (bg2, gold hairline borders): infinitely scrolling small-caps text, 34s loop, items separated by gold ◆ diamonds:
"No Limit Country ◆ New Single "Beautiful Life" Out 7.31.26 ◆ Debut EP Recorded In Nashville ◆ John Dixon Hall Jr. × Terry Glaze" (duplicated for seamless loop).

## 6. SECTION 01 — MUSIC (id="music")
Two-column grid (55/45), gap ~80px.

**Left:** eyebrow "01 — NEW SINGLE" → huge Anton metallic "BEAUTIFUL LIFE" (two lines) → gold small-caps line "Out Friday · July 31, 2026" → **live countdown** (DAYS : HRS : MIN : SEC — Anton numbers ~48px, tiny small-caps labels, gold colons) ticking to 2026-07-31T00:00:00 local → body blurb (below) → button row: gold gradient "PRE-SAVE" button with equalizer bars + icon row (Spotify, Apple, YouTube, Amazon — cream, gold on hover).

Blurb: "The first cut from Dixon Hall's debut EP — recorded in Nashville. Classic country storytelling with a modern edge, built on the raw chemistry between Hall's soulful voice and Glaze's unmistakable guitar."

**Right:** square cover-art card (1px gold-tint border, deep shadow): brick texture background at 50% luminosity blend + radial gold glow, "SINGLE" tag chip top-left (gold small-caps, outlined), centered crest logo (~44%), metallic "BEAUTIFUL LIFE", "DIXON HALL · 2026" small-caps below.

## 7. SECTION 02 — ABOUT (id="about")
Eyebrow "02 — THE BAND". Two-column header: left, Anton metallic "AN UNLIKELY HARMONY" (two lines); right, Marcellus lead (~24px, #efe9e0): "When a soulful country singer and a legendary rock vocalist discover they harmonize like they've sung together their whole lives, something special happens."

Full-width band photo (the Parthenon shot, ~52vh, object-position 50% 40%, hairline border) with caption "NASHVILLE, TN" over a bottom gradient.

Bio paragraph (max-width 760px): "Dixon Hall is a modern country band built on the unlikely but powerful partnership between vocalist and songwriter John Dixon Hall Jr. and legendary rock guitarist Terry Glaze. Their musical backgrounds could hardly be more different — but it's their vocal blend and natural harmony that truly sets the band apart. Hall's soulful country tone paired with Glaze's gritty rock edge creates a powerful dynamic on stage, and what started as a collaboration quickly evolved into a full band with a fast-growing regional following."

Two member cards (equal grid, hairline borders, 2px gold top border, hover = faint gold wash):
- Card 1 — role "VOCALS · SONGWRITER" (gold small-caps), Anton name "JOHN DIXON HALL JR.", text: "A Maryland native with deep roots in soul and country, Hall built his reputation performing across the Mid-Atlantic — with a voice that blends heartfelt storytelling and powerful delivery." Tag: "MARYLAND, USA"
- Card 2 — role "GUITAR · VOCALS", Anton name "TERRY GLAZE", text: "Decades on the world's stages — the original vocalist for Pantera and frontman of Lord Tracy. Glaze brings a gritty rock edge that meets Hall's soul head-on." Tag: "ROCK ICON"

## 8. SECTION 03 — SHOWS (id="shows")
Eyebrow "03 — ON THE ROAD", Anton metallic "LIVE", right-aligned intro: "High-energy nights of today's country favorites and originals that reflect real life — and the little moments that matter most."

Ledger list (hairline row dividers; hover = faint gold wash + slight left pad): each row = big Anton day number + gold month abbr | venue (Marcellus ~24px) + city/time small-caps muted | outlined "DETAILS" button (hover fills gold). Fallback rows:
- 08 JUL — Admiral's Cup — Baltimore, MD · 7:00 PM
- 11 JUL — Twains Tavern — Pasadena, MD · 8:30 PM
- 17 JUL — Tolchester — Chestertown, MD · 7:00 PM
- 24 JUL — Natalie's — Fallston, MD · 7:00 PM
- 25 JUL — Smoke on the Rail BBQ Fest — New Freedom, PA · 5:30 PM

Below: "Booking & private events — john@johndixonhalljr.com" (email is a gold link).

## 9. SECTION 04 — MEDIA (id="media")
Eyebrow "04 — GALLERY", Anton metallic "IN THE FRAME". Grid 2fr/1fr: big band-photo tile (spans 2 rows, badge "THE DUO · NASHVILLE", image scales 1.05 on hover) + crest tile (logo centered on dark radial + brick texture, badge "NO LIMIT COUNTRY") + a "Follow for more" tile (Instagram icon in gold, links to the IG).

## 10. SECTION 05 — STORE (id="store")
Eyebrow "05 — MERCH", Anton metallic "GEAR UP", intro right: "Official Dixon Hall apparel, accessories, and future exclusive releases — made for the fans."

3-column grid of product cards (dark card, hairline border; hover: gold border + lift 4px): 4:3 image area (crest logo on brick-textured dark radial as placeholder) + name/price row (name Marcellus, price gold small-caps):
- Women's Cotton Tank — $35.00 · Pom-Pom Beanie — $30.00 · Trucker Cap — $30.00 · Crop Hoodie — $36.50 · Short Sleeve Tee — $23.50 · 6th card = "SHOP ALL MERCH" (bag icon, centered).

Italic muted note: "Product photos are placeholders — live store images drop in here."

## 11. FAN CLUB + FOOTER
Centered section (soft radial glow): eyebrow "FAN CLUB", Anton metallic "NEVER MISS A DROP", text: "Get early access to new music, upcoming shows, merch drops, and exclusive behind-the-scenes updates delivered straight to your inbox." Email input (dark, hairline border, gold focus) + gold "JOIN" button.

Footer (bg2, top hairline): crest logo (76px) + gold small-caps "REAL COUNTRY. REAL STORIES. NO LIMITS." | EXPLORE column (Music About Shows Media Store anchors) | CONNECT column (Booking mailto, Facebook, Instagram, TikTok + icon row). Bottom bar: "© 2026 Dixon Hall · No Limit Country" | "Modern Country Music with Soul, Storytelling & Southern Rock Energy".

## 12. MOTION
Scroll-reveal all section content: fade + 28px rise, ~.8s ease-out, small stagger (IntersectionObserver, threshold .12, once). No parallax. Reduced-motion: disable all animation.

## 13. AIRTABLE-CONNECTED CONTENT (critical)
The Music and Shows sections are DATA-DRIVEN. On page load, fetch:

```
GET https://dixon-hall-music.vercel.app/api/content
```

(Read-only public JSON, CORS enabled, no auth. NEVER call Airtable directly from the browser and NEVER embed any Airtable token in client code — this endpoint is the only data source.)

Response shape:
```json
{
  "songs": [{
    "title": "Beautiful Life", "status": "Upcoming", "releaseDate": "2026-07-31",
    "cover": "https://…jpg or null", "blurb": "…", "featured": true,
    "links": { "spotify": null, "apple": null, "youtube": null, "amazon": null, "presave": null }
  }],
  "shows": [{ "venue": "Admiral's Cup", "date": "2026-07-08", "city": "Baltimore, MD", "time": "7:00 PM", "ticketUrl": null }]
}
```

**Display logic:**
- Pick the song: skip `status:"Hidden"`; prefer `featured:true`; else newest `releaseDate`.
- `Upcoming` (release date in future): eyebrow "NEW SINGLE", date line "Out {Weekday} · {Month D, YYYY}", show countdown to releaseDate, main button "PRE-SAVE" → `links.presave`.
- `Released` (or date passed): eyebrow "LATEST SINGLE", date line "Available Now", HIDE countdown, main button "LISTEN NOW" → first available of spotify/apple/youtube/amazon.
- Streaming icons: only render icons whose link exists.
- If `cover` URL present: it fills the cover card (object-fit cover) replacing the crest composition; else keep the crest + metallic title version.
- Shows: render only `date >= today`, sorted soonest first; hide past shows. If none: single row "No upcoming shows — Follow us for announcements."
- **FALLBACK RULE: if the fetch fails or returns empty, silently keep the hardcoded content above. The page must never look broken or blank. Wrap everything in try/catch.**

## 14. ACCEPTANCE CHECKLIST
- Side-by-side with https://dixon-hall-music.vercel.app it reads as the same site (fonts, colors, spacing, hover states).
- Loader plays once, min 2s, fades to hero.
- Scrolling docks the nav; LISTEN NOW ends up as the last top-nav item; reverse works.
- Countdown ticks live to July 31, 2026.
- /api/content data renders Music + Shows; with network blocked, the page still shows full fallback content.
- Fully responsive (390px, 768px, 1440px). No console errors.
