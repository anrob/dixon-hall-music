# Changelog

## 2026-07-01 — Full site build (awwwards-grade) + Listen Now nav rework
- Built out the complete one-page site with real copy pulled from dixonhallmusic.com. Used the frontend-design + ui-ux-pro-max skills for direction (one hero element per section, 112px+ rhythm, restraint, contained widths, no parallax).
- **Type system:** Anton (heavy display) × Marcellus/Marcellus SC (serif labels/nav) × Barlow (body); metallic silver gradient on display headings to echo the crest.
- **Sections:** Music/Single (huge "Beautiful Life", live countdown to 7.31.26, pre-save + streaming row, cover-art card built from the crest), About (real bio narrative + both member cards — Hall / Glaze-ex-Pantera), Shows (editorial tour ledger, 5 real MD/PA dates + booking), Media (band photo + branded crest tile + follow tile), Store (5 real merch items w/ prices + placeholder note), Fan Club newsletter (real copy), footer.
- **Nav rework:** removed the pinned/fixed Listen Now. It now scrolls away with the hero nav and **docks as the last item** in the sticky top bar (gold CTA). Nav order: Home · Music · About · Shows · Media · Store · Listen Now.
- Scroll-reveals (IntersectionObserver, no parallax), marquee strip, hover micro-interactions, reduced-motion support. Verified every section + mobile stacking; no console errors.

## 2026-07-01 — Logo loading screen
- Added a cinematic preloader (`#loader`): the metallic Dixon Hall crest with a gold **light-sweep sheen** (CSS `mask-image` of logo.png over a moving gradient, so the shine follows the crest shape), a subtle gold glow, the equalizer motif pulsing below, and "No Limit Country" set in Marcellus SC.
- Reveal logic: shows for a 2s minimum (so the animation always reads), waits for `window.load`, then fades out and unlocks scroll. 6s hard-cap fallback. Respects `prefers-reduced-motion`.
- Verified: mask applies, loader auto-hides to the hero, scroll unlocks, no console errors.

## 2026-07-01 — Hero headroom fix + scroll-dock nav
- **Headroom:** biased the hero crop toward the top (`object-position: center 18%`) and softened the zoom (1.0→1.05) so the space above the crest breathes instead of the tuning pegs jamming the top edge.
- **Scroll-dock nav:** restructured the nav. The bottom split-nav (Home/Music/About · Shows/Media/Store) now crossfades into a sticky top nav bar (logo + links) as you scroll; the Listen Now button is `position:fixed`, stays pinned through the early scroll, then fades out once the top nav docks. Verified the opacity/pointer-events handoff at every scroll depth.
- Added a starter **Shows** section (real MD/PA tour dates) below the hero so the scroll behavior is demonstrable. Marked as placeholder in the footer.
- Mobile: hamburger + pinned Listen Now; top bar (logo + burger) fades in on scroll.

## 2026-07-01 — Project set up + hero built
- Carved `dixon-hall-music` into its own project (own repo, out of the FreshOS monorepo).
- Imported the Claude Design handoff bundle; preserved both hero directions (v1 + v2) in `docs/design-handoff/`.
- Built `site/index.html` from the **v2** design: converted the proprietary `.dc.html` syntax into clean, responsive production HTML — real `:hover` states, SEO/OG meta, favicon, wired social links (FB/IG/TikTok real), and a mobile hamburger menu.
- Confirmed band facts against dixonhallmusic.com (members, single "Beautiful Life" 7.31.26, shows, socials, merch).
- Not deployed — GitHub remote + Vercel staged for Fresh's approval.
