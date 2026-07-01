# Changelog

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
