# GHL Ask AI — Hero Background Image Fix Prompt

Paste everything below the line into Ask AI to fix the hero background fitting on mobile.

---

Fix the hero section's background image so it fills correctly on every screen size.

Image URL: https://dixon-hall-music.vercel.app/assets/hero-mock.png
(Wide 3:2 image — a metallic crest logo in the CENTER, one band member on each EDGE.)

REQUIRED BEHAVIOR
- The hero section is full viewport height: height 100vh, use 100svh on mobile so iOS
  browser chrome doesn't cause jumping. min-height 560px on desktop, none on mobile.
- The image must FILL the section with NO letterboxing, NO tiling, NO stretching,
  and NO empty bars above or below — crop instead of shrink, always.

If it's a CSS background:
  background-image: url('https://dixon-hall-music.vercel.app/assets/hero-mock.png');
  background-size: cover;
  background-position: center 18%;
  background-repeat: no-repeat;
  background-color: #0a0705;           /* invisible fallback while loading */
  background-attachment: scroll;        /* NEVER fixed — it breaks on iOS */

If it's an <img> tag:
  width:100%; height:100%; object-fit: cover; object-position: center 18%;

MOBILE (max-width 820px):
  Same cover behavior, background-position: center 20%.
  IMPORTANT: on portrait phones the image crops the sides — that is CORRECT and intended.
  The metallic crest must stay centered and fully visible; the two band members on the
  edges are ALLOWED to crop out of frame. Do not zoom out, do not use background-size:
  contain, do not shrink the image to show the whole thing — a letterboxed hero is wrong.

VERTICAL FRAMING RULE: the 18–20% vertical position keeps breathing room above the crest —
the top of the crest (guitar tuning pegs) must never touch the top edge of the screen.

Also keep a dark gradient overlay at the bottom of the hero (transparent → #060402) so the
nav sitting at the bottom stays readable over the image.

Test at 390×844 (iPhone), 768×1024 (tablet), and 1440×900 (desktop): image fills all three,
crest centered with headroom, no bars, no distortion.

---

Note: if GHL still fights the portrait crop, the fallback option is a dedicated 4:5 mobile
crop of the art centered on the crest, hosted at a second URL — ask Claude to generate one
if this prompt alone doesn't hold on mobile.
