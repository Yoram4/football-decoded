# Chapter authoring contract — "Football Guide"

You write ONE OR MORE chapter files `src/chapters/chNN.js`. Do not edit any other file.
Validate each with: `node tests/check_chapter.js src/chapters/chNN.js` (must print OK).
Do NOT run build.py (other agents run in parallel). Reference implementations: `src/chapters/ch00.js`, `ch01.js`, `ch02.js` — read them first and copy their style.

## File shape
```js
/* Chapter N — Title */
(function (FD) {
  const { F, R } = FD; const M = FD.MID;          // helpers (see below)
  FD.CH.push({
    title: 'Run Game', sub: 'one-line subtitle for the menu', deep: false /* true = whole chapter is Film Room */,
    base: { /* default keys for the first step */ },
    steps: [ { ...step }, ... ],                     // 5–10 steps typical
  });
})(window.FD);
```
Chapters are loaded in file-name order; ch numbers are fixed (see master plan).

## Coordinates (yards)
- Field x 0–120: **NE end zone x 0–10 (left)**, goal lines x=10 and x=110, NYJ end zone x 110–120, midfield x=60.
- y 0–53.33 (y=0 = top sideline on screen). Middle `M = FD.MID = 26.665`. Hashes at y≈23.2 and y≈30.1.
- `FD.own('NE', 25)` = 35 (NE's own 25), `FD.opp('NE', 25)` = 85... careful: `FD.opp(team,n)` = the OPPONENT'S n-yard line from `team`'s perspective, e.g. `FD.opp('NE',20)` = 90 (NYJ 20).
- NE offense attacks RIGHT (+x) by default. Jets offense attacks LEFT.
- Camera `cam: {x, y, w}` = center + width in yards. Visible height ≈ 0.5625·w (16:9). Whole field: `{x:60,y:26.67,w:132}`. Full formation incl. both sidelines needs w ≥ 96. Close-up of the line: w 30–45.
- Keep important things away from the top ~12% of the screen (score bug) and the bottom-right corner (lower-third, ~48% wide × 18% tall).

## Step keys (all optional)
Inheritance: keys you omit are inherited from the previous step **in the same chapter**, EXCEPT these which never inherit: `id title sfx notes deep w skin auto ov photo tags`. So repeat `ov`/`tags` if you want them to stay (identical overlays don't re-animate).
| key | meaning |
|---|---|
| `title` | short step title (menu/presenter). REQUIRED. |
| `cam` | camera `{x,y,w}` (tweens) |
| `los`, `fd` | x of blue line of scrimmage / yellow line to gain (`null` hides). `lbl:true` shows their text labels |
| `ball` | `{x,y}` football glyph (default: on the LOS at mid). `ball:false` hides |
| `off` | which team is on offense: `'NE'` (default) or `'NYJ'` — offense draws as O circles, defense as X |
| `dlbl` | `true` = print position labels under defenders |
| `players` | array of `{id, t:'NE'|'NYJ', pos, x, y, lbl?, hl?, dim?, shape?:'O'|'X'|'ref'|'ball'}` — use `F.off`/`F.def` |
| `routes` | array of route objects — use `R.make`/`R.abs`/`R.blocks`/`R.pass`. Route `{id, p?, k, d:[[x,y]...], c?, move?, delay?, dur?, lbl?, curve?, dash?, lift?}`. `k`: `route` (white), `run` (yellow), `block` (T-end), `pass`/`kick` (dashed arc), `motion` (dashed blue), `zone`. `c`: `'r'` red key route, `'y'`,`'b'`,`'g'`,`'w'`,`'o'` or hex. `move:true` + `p` = that player runs along the path (its final position = path end). |
| `zones` | coverage zones `{id, ell:[cx,cy,rx,ry] | rect:[x,y,w,h] | d:[[x,y]..], c, lbl, op}` |
| `marks` | field annotations (SVG, in yards): `{id, type, ...}` types: `text {x,y,t,size,c,anchor,rot,cls:'hd'}`, `line {x1,y1,x2,y2,c,w,dash}`, `arrow {d:[[x,y]..],c,w,curve,dash}`, `rect {x,y,w,h,c,op,lbl,size,pulse,stroke:false}`, `circle {x,y,r,c,pulse}`, `num {x,y,t,c}` (numbered badge), `flag {x,y}` (thrown penalty flag animation), `ball {x,y,rot}`, `img {key,x,y,w,h}`, `measure {x1,x2,y,t}` (dimension line), `post {x,y,s}` (side-view goal post inset) |
| `bug` | score bug PARTIAL update (inherits across the WHOLE deck): `{hs, as, q:'1ST'..'4TH'|'OT'|'FINAL', clk:'2:00', pc:40|null, down:1-4|null, dist:10|'GOAL', poss:'NE'|'NYJ', toH, toA, msg:'TOUCHDOWN'|null, flag:true|false, hide:true|false, pcRun:true (play clock counts down), clkRun:true, reset:true}`. Start each chapter with `bug:{reset:true, ...}` or `hide:true` as appropriate, and clear `msg`/`flag` when done. |
| `l3` | lower-third `{k:'kicker small caps', t:'TITLE (≤ 32 chars)', s:'caption ≤ 70 chars', team:'NYJ'?}` or `null` |
| `tags` | `['NEW RULE 2026: …', 'COLLEGE: …']` (top-left chips) |
| `ov` | HTML overlays `[{id, type, pos, w?, ...props}]` — `pos`: `c` center, `r` right panel, `l` left panel, `tl`,`tr`,`bl`,`br`,`b`,`t`,`full`. Types below. |
| `photo` | full-bleed photo `{key, dim:0..1, over:true (above field), kb:false}` or `null` |
| `w` | interactive widget name (only these exist): `'c17'` (ch03 ways-to-17), `'heat'` (ch15 4th-down heatmap) |
| `sfx` | sounds on forward entry: `'whistle'|'roar'|'cheer'|'hit'|'hit2'|'huddle'` or `{n:'hit', at:ms}` |
| `auto` | ms → auto-advance (use sparingly) |
| `deep` | `true` = Film Room step (blueprint skin, skippable with D) |
| `notes` | `{p:[talking points], a?:'analogy only when it makes the concept clearer', aTitle?:'optional analogy heading', x?:'expert detail'}` |

### Overlay types (`ov`)
- `big {k,t,s,c}` hero text center. `title` (used once in ch00).
- `panel {k,t,items:[..],num:true,hl:i,dim:i,html,img:assetKey,foot}` bullet panel. Text supports `**bold**`.
- `stats {items:[{v:'6',l:'Touchdown',s:'sub',c:'#hex'}], hl:i}` row of big numbers.
- `card {team:'NE'|'NYJ', n:12, grp:'Offense · Backfield', name:'Quarterback', job, size, watch}` player card.
- `compare {t, cols:[{t, c:'#hex', items:[..]}], foot}` side-by-side columns.
- `timeline {items:['Huddle','Snap',...], i:currentIndex}` step strip (use pos `t` or `b`).
- `clock {game:'15:00', gs, play:40, ps, run:true}` game clock vs play clock.
- `signal {sig:N, name, desc, yds:'10 yards', af:true|false, extra, k}` one official referee signal (image cropped from the 2026 rulebook). Available `sig` numbers ONLY (official numbering): 1 touchdown/field goal/successful try, 2 safety, 3 first down, 4 dead ball (fist = fourth down), 6 timeout, 7 no timeout/time in, 8 delay of game/excess timeout, 9 false start/illegal formation/kickoff out of bounds or short of landing zone, 10 personal foul, 11 holding, 12 illegal use of hands, 13 penalty refused/incomplete pass/play over/missed goal, 16 intentional grounding, 17 pass interference (or fair-catch interference), 19 ineligible receiver downfield, 20 illegal contact, 21 offside/encroachment/neutral zone infraction, 22 illegal motion at snap, 23 loss of down, 26 unsportsmanlike conduct, 32 illegal substitution/too many men on the field, 33 facemask.
- `signals {items:[{sig, name, yds, af}], hl:i, foot}` grid of signals.
- `league {hl:'AFC'|'NFC'|'AFC East'|...}`, `calendar {hl:i, foot}`, `matrix {hl:'div'|'conf4'|'nfc4'|'place2'|'g17'|'all', show:[...]}`, `bracket {stage:0..4, foot}` — season graphics.
- `photo {key, cap}` framed photo. `logos {t, items:[assetKeys], cap}`. `tv {t, items:[{logo:'tv_cbs'|[keys], txt?, slot, sub}], hl, foot}`.
- `frame {key:'photo_broadcast', notes:[{x,y,w,h (percent of image), t, side:'up'|'left'}], show:n}` annotated screenshot (pos `full`).
- `video {yt:'butler'|'miracle'|'jones', start, end, k, t, s}` YouTube replay (pos `c`). Use exactly one per video step, with `bug:{hide:true}` optional.

Asset keys (images): `nfl ne ne_png ne_helmet ne_endzone ne_wordmark pat nyj nyj_helmet nyj_wordmark buf mia lombardi tv_cbs tv_cbs_eye tv_fox_sunday tv_nfl_fox tv_nbc tv_snf tv_espn tv_prime photo_gillette photo_gillette_fw photo_gillette_fw2 photo_banners photo_broadcast`.

## Helpers (`src/lib/plays.js` — read it)
- `F.off(los, {team:'NE', dir, set:'gun'|'under'|'pistol', pers:'11'|'12'|'21'|'10', strong:1|-1, wide:19})` → 11 offense players with ids `NE-LT NE-LG NE-C NE-RG NE-RT NE-QB NE-RB NE-X NE-Z NE-H NE-TE (NE-TE2 | NE-FB | NE-S)`.
- `F.def(los, {team:'NYJ', front:'43'|'34'|'nickel'|'dime', cov:'1'|'2'|'3'|'0'|'4', press, strong})` → ids `NYJ-DE1 NYJ-DT1 NYJ-DT2 NYJ-DE2 NYJ-WILL NYJ-MIKE NYJ-SAM NYJ-CB1 NYJ-CB2 NYJ-FS NYJ-SS` (3-4: `NYJ-DE1 NYJ-NT NYJ-DE2 NYJ-OLB1 NYJ-OLB2 NYJ-ILB1 NYJ-ILB2`; nickel adds `NYJ-NB`).
- For the Jets on offense: `F.off(x, {team:'NYJ'})` (attacks left), defense `F.def(x, {team:'NE'})`; set step `off:'NYJ'`.
- `F.get/only/hl/dim/shift/patch/after(players, routes)`.
- `R.make(players, 'X', 'slant'|[[fwd,lat],...], {move, c:'r', delay, dur, lbl, curve})` — lat positive = toward the middle of the field. Tree names: hitch flat slant comeback curl out dig corner post go seam whip drag wheel swing check arrow out5 in5.
- `R.abs(players, 'RB', [[x,y],...], {k:'run', move:true, curve:true})` absolute path.
- `R.blocks(players, R.OL, fwd, lat)` blocking T's. `R.pass([x,y],[x,y],{delay,dur})` ball flight arc.
- Animate the ball on a pass: add `F.ball(qbX, qbY)` to players (id 'BALL') plus a route `{id:'bf', p:'BALL', k:'pass', d:[[from],[to]], move:true, delay, dur}`; set step `ball:false`.
- Timing: routes draw over `dur` ms after `delay`. Typical play: blocks 0–600ms, routes 300–1500, pass at ~1100.

## Content rules
- NFL 2026 rules are the baseline. Verify claims against the official NFL Rulebook; its full text is not bundled in this repository. Verified facts you can rely on:
  - Kickoff from K's 35; kicking team lines up at receiving team's 40; receivers' setup zone between their 35 and 30 (at least 9 players); landing zone = receiving 20 to goal line. Touchback → 35 if the kick lands in the end zone in the air (or goes out the back / hits the posts without touching the landing zone); → 20 if it lands in the landing zone first and then goes into the end zone. Kick lands short of the landing zone or out of bounds → receiving team ball 25 yards from the kick spot (their 40). 2026 change: onside kick may be declared ANY time (6-1-6); touchback spot after kickoff from the 50 is the 20 (6-1-5).
  - Try: kick from the 15 (1 pt), or run/pass from the 2 (2 pts); defense scoring on a try gets 2 (11-3).
  - OT regular season: one 10-min period, both teams get a possession (unless first kicking team scores a safety), can end tied; playoffs: 15-min periods, both possess, continue until winner (16-1).
  - 3 timeouts per half; 2 in regular-season OT. Play clock 40 s (25 after certain stoppages). Two-minute warning in each half.
  - Final-play TD in the 4th: Try skipped if it can't affect the outcome (4-8-2-c). A period can't end on an accepted defensive foul (untimed down).
  - Out of bounds stops the game clock; inside last 2:00 of 1st half / last 5:00 of 2nd half it stays stopped until the snap (4-3-2).
  - Schedule: 17 games, 18 weeks, 1 bye; formula 6 div + 4 same-conf division + 4 other-conf division + 2 same-place conf + 1 same-place other-conf. 14-team playoffs (7 per conf: 4 division winners + 3 wild cards; #1 seed bye). 2026: 9 international regular-season games.
  - NE: 6 Super Bowl titles (2001, 2003, 2004, 2014, 2016, 2018 seasons); lost Super Bowl LX 29–13 to Seattle (Feb 8 2026) as 2025 AFC champions.
- Mark rules changed in the last ~3 seasons with a tag `'NEW RULE: …'` (dynamic kickoff 2024; touchback-to-35 2025; regular-season OT both-possess 2025; 2026 onside anytime). NCAA differences as `'COLLEGE: …'`.
- If unsure, phrase conservatively and add `'VERIFY: …'` to `tags` (it renders as a dashed chip) — never invent.
- Fictional players only: positions + jersey numbers, no real current player names (historic plays in videos are fine to name, e.g. Malcolm Butler).
- Keep on-screen text minimal and broadcast-style. Notes carry the explanation in presenter voice. Use an analogy only when it makes an otherwise unclear concept easier to understand; don't force one. Expert detail is optional.
- Every step must make sense going backward too: always define the FULL set of `players` and `routes` you want visible (they inherit, so set `routes: []` when a play ends).
