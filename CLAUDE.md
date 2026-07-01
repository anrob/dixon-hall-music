# Dixon Hall Music — Project Rules

Website for the country duo **Dixon Hall (No Limit Country)** — John Dixon Hall Jr. × Terry Glaze.

## Stack
- Single-page static site. Vanilla HTML/CSS/JS, no build tools.
- Fonts: **Marcellus** + **Marcellus SC** (Google Fonts). Icons: Font Awesome 6.
- Deploy target: Vercel (`rootDirectory = site`).

## Brand
- **Palette:** near-black `#0a0705` / `#060402`, cream text `#e7ddcb`, gold accent `#cda45f` → `#e9c17e`.
- **Voice:** "Real Country. Real Stories. No Limits." Gritty, heartfelt, no-frills. Southern rock energy.
- **Logo:** metallic guitar-headstock + flag crest (`site/assets/logo.png`).

## Conventions
- Keep the hero pixel-faithful to the v2 Claude Design. The original export lives in `docs/design-handoff/` — don't edit it, it's the source of truth for the look.
- Preview must bind to `0.0.0.0` and be shared as a LAN IP link (Fresh opens on his phone), never localhost.
- Light-theme rule is waived here — this is a client brand that is intentionally dark/cinematic.

## Not done yet
- Only the hero exists. Nav links (Music/About/Shows/Media/Store) are `#` stubs.
- No GitHub remote / Vercel deploy yet — stage and flag before pushing anything public.
