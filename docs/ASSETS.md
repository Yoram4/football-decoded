# ASSETS — generated runtime assets

The runtime assets are embedded as data URIs in `src/assets.gen.js` so the published `index.html` remains self-contained. The original `Football Guide/` source pack and the preprocessing script are intentionally not included; regular builds do not need them. The table below records the original asset provenance and intended use. The NFL Rulebook itself is not included.

| Source file | Key(s) | Processing | Used in |
|---|---|---|---|
| NFL logo.png | `nfl` | trim, 360 px | midfield logo, score bug shield, title card, league/glossary headers |
| new-england-patriots-logo.zip → .svg | `ne` | SVG kept | score-bug chip, title, matrix, presenter view, finale |
| New England Patriots logo main.png | `ne_png` | trim, 640 px | fallback (unused unless SVG fails) |
| …/new-england-patriots-helmet-logo.png | `ne_helmet` | 420 px | player cards (NE) |
| new england patriots logo end zone.png | `ne_endzone`, `ne_endzone_ko` | letters → white, Flying Elvis kept navy (connected-component knockout) | NE end zone paint |
| patriots logo wordmark.png | `ne_wordmark` | trim padding | available (title/finale) |
| patriots logo pat the patriot.png | `pat` | 420 px | ch01 Border War, finale banners |
| new-york-jets-2024-logo-pack.zip → .svg | `nyj` | SVG kept (white via CSS in bug) | score-bug chip, matrix |
| …/new-york-jets-helmet-logo-2024.png | `nyj_helmet` | 420 px | player cards (NYJ) |
| New York Jets Logo green.png | `nyj_wordmark`, `nyj_ko` | white knockout | NYJ end zone paint |
| buffalo-bills-logo.zip / miami-dolphins-logo.zip → .svg | `buf`, `mia` | SVG | league grid, schedule matrix |
| superbowl lombardy trophy logo.png | `lombardi` | 420 px | calendar, bracket, finale |
| CBS/FOX/NBC/SNF/ESPN/Prime logos (incl. zips) | `tv_*` | trim, ≤ 520×260, white chips | ch16 TV slots |
| Gillette Stadium photos (3) | `photo_gillette`, `photo_gillette_fw`, `photo_gillette_fw2` | JPEG q80 | cold open, TD, title, ch01, finale |
| Patriots 6 Banners at Gillette stadium.webp | `photo_banners` | JPEG q82 | ch01 "Why New England", finale |
| NFL - New England Patriots vs. Buffalo Bills … .png | `photo_broadcast` | JPEG 1920 q80 | ch17 annotated broadcast frame |
| NFL Rulebook 2026.pdf | external reference; `sig1…sig33` embedded in `src/assets.gen.js` | official signals cropped (pp. 73–78) | rules source; ch13 signal cards (+ch03/04/05) |
| referee whistle.mp3, stadium crowd roar/cheering.mp3, football-practice-huddle-pad-hits.mp3 | — | replaced | not used any more (replaced by Mixkit sounds below) |
| Mixkit free SFX (cached in `assets/sfx`): 615 police short whistle, 462 huge crowd cheering victory, 3022 stadium joy shouting crowd, 2150 impact of a blow, 2153 body punch quick hit | `sfx_whistle`, `sfx_roar`, `sfx_cheer`, `sfx_hit1`, `sfx_hit2` | trimmed, mono 64 kbps | whistles/flags, touchdowns, title/finale, snaps/tackles |
| 28 team logos + AFC/NFC logos | `tm_XXX`, `afc`, `nfc` | trim, 160 px | league grid, conference headers |
| YouTube: Butler INT / Minneapolis Miracle / Mike Jones tackle | `yt_butler`, `yt_miracle`, `yt_jones` (thumbnails) | inlined thumbnail; ▶ opens YouTube in a new tab (NFL blocks embedding) | ch14, ch04, ch15 |

Unused: `ne_png` (SVG preferred), EPS/AI originals (not browser formats), duplicate logo variants in the zips.
