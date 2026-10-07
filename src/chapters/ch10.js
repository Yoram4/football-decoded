/* Chapter 10 — Defense (Patriots on defense, Jets driving left) */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;

  // Jets ball on their own 40 (x=70), attacking LEFT; 2nd & 7 → line to gain x=63.
  const LOS = 70, W = 16;
  const CAM = { x: 71, y: 25.5, w: 84 };   // field only
  const CAMP = { x: 86, y: 25.5, w: 84 };  // formation left, right panel free

  const o12 = F.off(LOS, { team: 'NYJ', pers: '12', wide: W });
  const o11 = F.off(LOS, { team: 'NYJ', pers: '11', wide: W });
  const d43 = F.def(LOS, { team: 'NE', front: '43', cov: '3', wide: W });
  const d34 = F.def(LOS, { team: 'NE', front: '34', cov: '3', wide: W });
  const dN3 = F.def(LOS, { team: 'NE', front: 'nickel', cov: '3', wide: W });
  const dN1 = F.def(LOS, { team: 'NE', front: 'nickel', cov: '1', press: true, wide: W });
  const dN2 = F.def(LOS, { team: 'NE', front: 'nickel', cov: '2', wide: W });

  // ---------- helpers ----------
  const oRoutes = (delay) => [
    R.make(o11, 'X', 'go', { move: true, delay, dur: 1500 }),
    R.make(o11, 'H', [[8, 0], [9, 20]], { move: true, delay, dur: 1500 }),
    R.make(o11, 'TE', 'seam', { move: true, delay, dur: 1500 }),
    R.make(o11, 'Z', 'curl', { move: true, delay, dur: 1300 }),
    R.make(o11, 'RB', 'flat', { move: true, delay: delay + 150, dur: 1000 }),
  ];
  // defender mirrors a receiver's route, offset [dx,dy]
  const shadow = (def, id, rt, [dx, dy]) => R.abs(def, id, rt.d.slice(1).map(([x, y]) => [+(x + dx).toFixed(2), +(y + dy).toFixed(2)]),
    { id: 's-' + id, k: 'route', c: 'b', move: true, delay: (rt.delay || 0) + 120, dur: rt.dur });
  const tether = (def, dId, oId) => {
    const a = F.get(def, dId), b = F.get(o11, oId);
    return { id: 't-' + dId, k: 'motion', arrow: false, d: [[a.x, a.y], [b.x, b.y]] };
  };
  const drops = (def, map, delay = 150, dur = 1100) => Object.entries(map).map(([id, [x, y]]) =>
    R.abs(def, id, [[x, y]], { id: 'd-' + id, k: 'route', c: 'b', move: true, delay, dur }));
  const rush4 = (def) => ['DE1', 'DT1', 'DT2', 'DE2'].map((id) => {
    const p = F.get(def, id);
    return R.abs(def, id, [[+(p.x + 1.6).toFixed(2), +(p.y + (p.y < M ? 0.5 : -0.5)).toFixed(2)]], { id: 'rush-' + id, k: 'route', c: 'r', move: true, delay: 100, dur: 600 });
  });
  const zn = (id, cx, cy, rx, ry, c, lbl, delay = 900) => ({ id, ell: [cx, cy, rx, ry], c, lbl, ly: +(cy - ry * 0.55).toFixed(2), op: 0.16, delay });
  const lvl = (id, x, w, c, lbl) => ({ id, type: 'rect', x, y: 8.5, w, h: 39.5, c, op: 0.1, lbl, ly: 47.4, size: 1.2, lc: c });

  // man assignments (Cover 1 family)
  const manPairs = [['CB1', 'X'], ['NB', 'H'], ['SS', 'TE'], ['CB2', 'Z'], ['WILL', 'RB']];
  const manOff = { CB1: [0.8, 0.9], NB: [-1.0, -0.6], SS: [-0.6, -1.0], CB2: [-1.2, 0.4], WILL: [-1.0, 0] };
  const manRoutes = (delay) => {
    const rts = oRoutes(delay);
    const byId = (oid) => rts.find((r) => r.p === 'NYJ-' + oid);
    return [...rts, ...manPairs.map(([d, o]) => shadow(dN1, d, byId(o), manOff[d])), ...manPairs.map(([d, o]) => tether(dN1, d, o))];
  };

  const C3 = { CB1: [49, 9.5], FS: [47, M], CB2: [49, 43.5], NB: [62.5, 12.5], WILL: [61.5, 21.5], MIKE: [61.5, 31.5], SS: [63, 40.5] };
  const C2 = { FS: [50, 13.3], SS: [50, 40], CB1: [64.5, 9.5], NB: [61.5, 16], WILL: [61, 23.5], MIKE: [61, 30.5], CB2: [64.5, 43.5] };
  const c3Zones = (labels) => [
    zn('z-d1', 48, 9.4, 7.5, 8.4, '#38bdf8', labels ? 'DEEP 1/3' : 'DEEP'),
    zn('z-d2', 46, M, 7.5, 8.4, '#38bdf8', labels ? 'DEEP 1/3' : 'DEEP'),
    zn('z-d3', 48, 44, 7.5, 8.4, '#38bdf8', labels ? 'DEEP 1/3' : 'DEEP'),
    zn('z-u1', 62.5, 12.5, 3.4, 4.4, '#facc15', labels ? 'CURL/FLAT' : 'AREA'),
    zn('z-u2', 61.5, 21.5, 3.2, 4.2, '#facc15', labels ? 'HOOK' : 'AREA'),
    zn('z-u3', 61.5, 31.5, 3.2, 4.2, '#facc15', labels ? 'HOOK' : 'AREA'),
    zn('z-u4', 63, 40.5, 3.4, 4.4, '#facc15', labels ? 'CURL/FLAT' : 'AREA'),
  ];

  // blitz: double-A-gap mug, 6 rushers, Cover 1 behind
  const dBz = F.patch(dN1, { WILL: { x: 67.6, y: 25.6 }, MIKE: { x: 67.6, y: 27.8 }, DT1: { y: 23.2 }, DT2: { y: 30.3 } });
  const RUSH = { DE1: [[71.5, 19.6], [74.2, 24.6]], DT1: [[71.4, 22.8], [73.6, 24.6]], WILL: [[71.2, 25.6], [73.8, 26.2]], MIKE: [[71.2, 27.9], [73.8, 27.2]], DT2: [[71.4, 30.6], [73.6, 28.8]], DE2: [[72, 35.2], [74.4, 28.8]] };
  const blitz = Object.entries(RUSH).map(([id, pts]) => R.abs(dBz, id, pts, { id: 'bz-' + id, k: 'route', c: 'r', move: true, delay: 0, dur: 900, curve: true }));
  const blitzTethers = [['CB1', 'X'], ['NB', 'H'], ['SS', 'TE'], ['CB2', 'Z']].map(([d, o]) => tether(dBz, d, o));

  // pattern-match Cover 3 vs four verticals
  const verts = [
    R.make(o11, 'X', 'go', { move: true, delay: 250, dur: 1700 }),
    R.make(o11, 'H', 'seam', { move: true, delay: 250, dur: 1700 }),
    R.make(o11, 'TE', 'seam', { move: true, delay: 250, dur: 1700 }),
    R.make(o11, 'Z', 'go', { move: true, delay: 250, dur: 1700 }),
  ];
  const MATCH = { CB1: [48, 10], FS: [46, M], CB2: [49, 43.4], NB: [54.6, 15.3], SS: [53.6, 32.1], WILL: [62, 21.5], MIKE: [62, 31.5] };

  const DL43 = ['DE1', 'DT1', 'DT2', 'DE2', 'WILL', 'MIKE', 'SAM'];
  const DL34 = ['DE1', 'NT', 'DE2', 'OLB1', 'OLB2', 'ILB1', 'ILB2'];

  FD.CH.push({
    title: 'Defense', sub: 'Fronts, nickel, man vs zone, Cover 1-2-3, the blitz',
    base: { bug: {} },
    steps: [
      {
        title: 'Three levels of defense',
        bug: { reset: true, hs: 21, as: 17, q: '3RD', clk: '6:40', down: 2, dist: 7, poss: 'NYJ' },
        off: 'NYJ', dlbl: true, los: LOS, fd: 63, lbl: true, ball: { x: LOS, y: M },
        cam: CAMP,
        players: [...o12, ...d43], routes: [], zones: [],
        marks: [lvl('lv-dl', 67.4, 2.8, '#f87171', 'LINE'), lvl('lv-lb', 63.9, 3.1, '#facc15', 'LBs'), lvl('lv-db', 53.5, 10.2, '#38bdf8', 'SECONDARY')],
        ov: [{ id: 'lv', type: 'panel', pos: 'r', k: 'Patriots on defense', t: 'Three levels', num: true,
          items: ['**Defensive line**: win at the snap, plug run gaps, rush the QB',
            '**Linebackers**: read run or pass, tackle, cover the short middle, blitz',
            '**Secondary** (corners + safeties): cover receivers, stop the deep ball, last line'] }],
        l3: { k: 'NYJ ball · 2nd & 7', t: 'Three levels of defense', s: 'Line · linebackers · secondary: 11 players, 3 jobs' },
        notes: {
          p: ['Now the Patriots are on defense. Jets have the ball on their own 40, driving toward the Patriots\' end zone on the left.',
            'Eleven defenders, always (Rule 5-1-1: two teams of 11). They stack in three levels, front to back.',
            'Defensive line: the big guys in a stance right on the ball. Their job is to control gaps and get to the quarterback.',
            'Linebackers: a few yards off the ball. They read the play, tackle runners, cover short passes, and sometimes blitz.',
            'Secondary: cornerbacks on the outside receivers, safeties deep. They stop the big play.'],
          a: 'Like a castle: a wall (line), soldiers behind the wall (linebackers), and archers on the towers (secondary).',
          x: 'Modern coordinators think in "fronts" (the line + linebacker alignment that fits the run) and "coverages" (the back seven\'s pass plan), and call them as two separate pieces.',
        },
      },
      {
        title: 'Front #1: the 4-3',
        players: [...o12, ...F.hl(d43, DL43)],
        marks: [{ id: 'f-dl', type: 'text', x: 68.8, y: 38.6, t: '4 DOWN LINEMEN', c: 'y', size: 1.2 }, { id: 'f-lb', type: 'text', x: 65.2, y: 19.3, t: '3 LBs', c: 'y', size: 1.2 }],
        ov: [{ id: 'fr', type: 'panel', pos: 'r', k: 'Base front', t: 'The 4-3',
          items: ['**4** down linemen: 2 ends + 2 tackles', '**3** linebackers: Will (weak side), Mike (middle), Sam (strong side)', '**4** DBs: 2 corners + 2 safeties', 'Linemen own gaps, linebackers flow and tackle'] }],
        l3: { k: 'Front', t: 'The 4-3', s: 'Four linemen, three linebackers' },
        notes: {
          p: ['"4-3" just counts people: 4 down linemen, 3 linebackers. Four defensive backs make 11.',
            'The ends (DE) are the edge rushers. The tackles (DT) clog the middle.',
            'Linebackers are named by side: Sam lines up on the strong side (where the tight end is), Mike in the middle, Will on the weak side.',
            'Here the Jets show two tight ends, a run-heavy look, so a big "base" defense makes sense.'],
          a: 'Four big guys up front to win the shoving match, three athletes behind them to clean up.',
          x: 'Most 4-3 teams are "one-gap" fronts: each lineman attacks a single gap and the linebackers fit the remaining gaps.',
        },
      },
      {
        title: 'Front #2: the 3-4',
        players: [...o12, ...F.hl(d34, DL34)],
        marks: [{ id: 'f-dl', type: 'text', x: 68.8, y: 38.6, t: '3 DOWN LINEMEN', c: 'y', size: 1.2 }, { id: 'f-lb', type: 'text', x: 65.4, y: 20.6, t: '4 LBs', c: 'y', size: 1.2 }],
        ov: [{ id: 'fr', type: 'panel', pos: 'r', k: 'Base front', t: 'The 3-4',
          items: ['**3** down linemen: a nose tackle over the center + 2 ends', '**4** linebackers: 2 outside (edge rushers) + 2 inside', 'Same 11 players, different shape', 'The 4th rusher can come from **either** outside LB: harder to predict'] }],
        l3: { k: 'Front', t: 'The 3-4', s: 'Three linemen, four linebackers' },
        notes: {
          p: ['Swap one lineman for one linebacker and you have a 3-4.',
            'The nose tackle sits right over the center and eats double-teams. The outside linebackers stand up on the edges.',
            'Why do it? The offense doesn\'t know which of the four linebackers will rush. Pressure from anywhere.',
            'Patriots fans saw a lot of multiple fronts over the years: the label matters less than who rushes and who drops.'],
          a: '4-3 vs 3-4 is like 4 forwards + 3 midfielders vs 3 forwards + 4 midfielders. Same team size, different priorities.',
          x: 'Classic 3-4 linemen play "two-gap" (control the blocker, play both gaps); many modern 3-4 teams actually play one-gap with the OLBs as stand-up DEs, so it\'s often a 4-3 "under" by another name.',
        },
      },
      {
        title: 'Nickel: 5 DBs vs 3 receivers',
        players: [...F.hl(o11, ['H']), ...F.hl(dN3, ['NB'])],
        marks: [{ id: 'nb-l', type: 'line', x1: 65, y1: 14.17, x2: 71.9, y2: 14.17, c: 'y', dash: true }],
        ov: [{ id: 'nk', type: 'stats', pos: 'r', items: [{ v: '3', l: 'Wide receivers', s: '11 personnel: the NFL\'s default offense' }, { v: '5', l: 'Defensive backs', s: 'nickel: a 5th DB for the 3rd WR', c: '#38bdf8' }], hl: 1 }],
        l3: { k: 'Sub package', t: 'Nickel: 5 defensive backs', s: 'A linebacker comes off, a nickel back covers the slot' },
        notes: {
          p: ['The Jets switch to 3 wide receivers ("11 personnel": 1 back, 1 tight end). A linebacker can\'t run with a slot receiver.',
            'So the Patriots take a linebacker off and bring in a 5th defensive back: the nickel back (5 cents, 5 DBs). Six DBs = dime.',
            'Because offenses live in 3-receiver sets, defenses live in nickel: it\'s the most-used package in today\'s NFL, more than the "base" 4-3 or 3-4.',
            'The trade-off: smaller, faster players. Good vs the pass, a bit lighter vs the run.'],
          a: 'You dress for the opponent: if they bring three sprinters, you bring another sprinter, not another lineman.',
          x: '"Base" is now a misnomer: nickel is the true base for most teams. The nickel back has to cover like a corner and tackle like a linebacker; it\'s one of the most valuable defensive spots.',
        },
      },
      {
        title: 'Man coverage',
        cam: CAM,
        players: [...o11, ...F.dim(dN1, ['CB1', 'CB2', 'NB', 'SS', 'WILL'])],
        routes: manRoutes(250),
        marks: [],
        l3: { k: 'Coverage family #1', t: 'Man-to-man', s: 'Each defender is tied to one receiver and follows him everywhere' },
        notes: {
          p: ['Two coverage families. First: man-to-man. Each defender gets one receiver and goes wherever he goes (dashed lines = assignments).',
            'Corners press at the line: within 5 yards they may jam the receiver (Rule 8-4-1). Past 5 yards, no more contact (8-4-3), or it\'s illegal contact: 5 yards and an automatic first down.',
            'Watch the slot receiver run across the field: his defender travels all the way with him.',
            'Strength: tight coverage, quick throws are hard. Weakness: defenders have their back to the QB, so a scramble or one lost race = big play.'],
          a: 'Man coverage is a dance where everyone has a partner. Lose your partner and the room notices.',
          x: 'Defensive pass interference is a spot foul: first down at the spot (8-5). That\'s why deep man coverage is high-risk: a 40-yard DPI is a 40-yard gain.',
        },
      },
      {
        title: 'Zone coverage',
        players: [...o11, ...dN3],
        routes: [...oRoutes(300), ...drops(dN3, C3, 150, 1100)],
        zones: c3Zones(false),
        marks: [{ id: 'ho1', type: 'num', x: 59.6, y: 13.5, t: '1' }, { id: 'ho2', type: 'num', x: 58.8, y: 22, t: '2' }, { id: 'ho3', type: 'num', x: 58.8, y: 31.5, t: '3' }],
        l3: { k: 'Coverage family #2', t: 'Zone', s: 'Defenders guard areas, eyes on the QB, and pass receivers along' },
        notes: {
          p: ['Second family: zone. At the snap each defender runs to an AREA of the field, not to a man.',
            'Same routes as before. Now the slot crossing the field is handed from defender 1 to 2 to 3, like a relay.',
            'Defenders face the quarterback, so they see the throw and break on the ball: more interceptions, fewer busted big plays.',
            'Weakness: there are seams between areas, and good quarterbacks throw into them.'],
          a: 'Man = guard a person. Zone = guard a room. Whoever walks into your room is yours.',
          x: 'Pure "spot-drop" zone is rare now; most NFL zone is pattern-matched (we\'ll see that in the Film Room step).',
        },
      },
      {
        title: 'Cover 1: man + one free safety',
        players: [...o11, ...F.hl(dN1, ['FS'])],
        routes: [...manRoutes(280), ...rush4(dN1), ...drops(dN1, { FS: [50, M], MIKE: [61.5, M] }, 200, 900)],
        zones: [zn('z-fs', 49, M, 8.5, 12, '#38bdf8', 'FREE SAFETY', 700), zn('z-rb', 61.5, M, 3, 3.8, '#facc15', 'ROBBER', 700)],
        marks: [],
        l3: { k: 'Man + 1 deep', t: 'Cover 1', s: 'Man underneath, one free safety guarding the deep middle' },
        notes: {
          p: ['The number in "Cover 1, 2, 3" = how many defenders split the deep part of the field.',
            'Cover 1: everybody plays man, except one free safety who stays deep in the middle as insurance.',
            'Here the Mike linebacker isn\'t needed in man, so he becomes a "robber" sitting in the short middle, waiting for a crossing route.',
            'It lets corners play aggressive, knowing help is over the top.'],
          a: 'Everyone has a partner, plus one lifeguard watching the whole deep end of the pool.',
          x: 'Cover 1 "robber"/"rat" puts the extra defender in the hole at 8–12 yards; vs crossers that\'s where the money throw goes, so offenses use levels and rubs to beat him.',
        },
      },
      {
        title: 'Cover 2: two deep halves',
        players: [...o11, ...F.hl(dN2, ['FS', 'SS'])],
        routes: [...rush4(dN2), ...drops(dN2, C2, 150, 1100)],
        zones: [
          zn('z-h1', 50, 13.3, 7.5, 12.2, '#38bdf8', 'DEEP 1/2'), zn('z-h2', 50, 40, 7.5, 12.2, '#38bdf8', 'DEEP 1/2'),
          zn('z-f1', 64.5, 9.6, 3, 3.6, '#facc15', 'FLAT'), zn('z-c1', 61.5, 16, 3, 3.6, '#facc15', 'CURL'),
          zn('z-k1', 61, 23.4, 3, 3.6, '#facc15', 'HOOK'), zn('z-k2', 61, 30.6, 3, 3.6, '#facc15', 'HOOK'),
          zn('z-f2', 64.5, 43.4, 3, 3.6, '#facc15', 'FLAT'),
        ],
        l3: { k: 'Two-deep zone', t: 'Cover 2', s: 'Two safeties split the deep field; five defenders underneath' },
        notes: {
          p: ['Two safeties each take half of the deep field. Five defenders spread out underneath.',
            'The corners squat in the flats: they jam the outside receiver, then sit, ready to hit anything short to the sideline.',
            'Great against short passes and outside throws. Lots of eyes underneath.',
            'Weak spots: the deep middle between the two safeties, and the sideline hole between the corner and the safety.'],
          a: 'Two goalkeepers splitting a very wide goal, each covering half.',
          x: 'Tampa 2 sends the Mike linebacker running down the deep middle to plug the seam between the safeties; Cover 4 (quarters) also shows two-high but puts four defenders deep.',
        },
      },
      {
        title: 'Cover 3: three deep thirds',
        players: [...o11, ...F.hl(dN3, ['CB1', 'FS', 'CB2'])],
        routes: [...rush4(dN3), ...drops(dN3, C3, 150, 1100)],
        zones: c3Zones(true),
        marks: [],
        l3: { k: 'Three-deep zone', t: 'Cover 3', s: 'Three deep thirds, four defenders underneath' },
        notes: {
          p: ['The two corners and the free safety each take a deep third of the field.',
            'Four underneath: two "curl/flat" defenders outside, two "hook" defenders in the middle.',
            'It\'s a single-high safety look, the same picture as Cover 1 before the snap. That\'s on purpose: the quarterback can\'t tell which one until the snap.',
            'Weak spots: the seams between deep thirds, and the flats once the curl/flat defender gets stretched.'],
          a: 'Three outfielders deep, four infielders shallow.',
          x: 'Cover 3 lets the strong safety drop into the box (8 near the line vs the run) while still keeping three deep: that\'s why it\'s a classic early-down call.',
        },
      },
      {
        title: 'The blitz: 6 rushers',
        players: [...o11, ...F.hl(dBz, Object.keys(RUSH))],
        routes: [...blitz, ...blitzTethers, ...drops(dBz, { FS: [50, M] }, 150, 900), ...R.blocks(o11, R.OL, 0.5), ...R.blocks(o11, ['RB'], 1.6, -0.5)],
        zones: [zn('z-fs', 50, M, 8, 11, '#38bdf8', 'FREE SAFETY', 600)],
        marks: [{ id: 'bz-t', type: 'text', x: 79, y: 20.5, t: '6 RUSH vs 6 BLOCK', c: 'r', size: 1.3, anchor: 'start' }],
        sfx: [{ n: 'hit', at: 950 }],
        l3: { k: 'Pressure', t: 'The blitz', s: 'Send more rushers than they can block, man coverage behind' },
        notes: {
          p: ['A blitz = rushing more than the usual four. Here six: four linemen plus both linebackers, who showed it by walking up into the "A gaps" next to the center.',
            'The Jets have 5 linemen + the running back to block: 6 vs 6. One missed block and it\'s a sack.',
            'The price: fewer defenders in coverage. Here it\'s Cover 1 behind: four man defenders and one deep safety.',
            'The answer for the offense is the "hot" throw: get the ball out right now to wherever a blitzer came from.'],
          a: 'Going all-in at poker: great when it works, very expensive when they call your bluff.',
          x: 'Send 6+ with zero deep safeties and it\'s Cover 0: every DB in man, no help. Modern "simulated pressures" show 6 and send only 4 while dropping a lineman into coverage.',
        },
      },
      {
        title: 'How offenses attack each coverage',
        players: [...F.dim(o11, []), ...F.dim(dN3, [])],
        routes: [], zones: [], marks: [],
        ov: [{ id: 'atk', type: 'compare', pos: 'c', t: 'Every coverage has a hole',
          cols: [
            { t: 'vs COVER 1', c: '#f87171', items: ['**Crossers**: run away from your man', '**Rub routes**: receivers cross so defenders collide', 'Win **1-on-1** outside: fades, back-shoulder'] },
            { t: 'vs COVER 2', c: '#38bdf8', items: ['**Hole shot**: sideline between corner and safety', '**Seams**: split the two safeties', '**Smash**: hitch under the corner, corner route over him'] },
            { t: 'vs COVER 3', c: '#a78bfa', items: ['**Curl/flat**: high-low one underneath defender', '**Four verticals**: 4 deep vs 3 deep defenders', '**Seams** between the deep thirds'] },
          ],
          foot: 'The QB\'s job: find the hole before the pass rush finds him.' }],
        l3: null,
        notes: {
          p: ['Man coverage (Cover 1): make receivers cross. Defenders chasing a man get tangled in traffic, and crossers run away from them.',
            'Rubs are legal only if the receiver doesn\'t actually block: blocking more than 1 yard downfield before the pass is offensive pass interference, 10 yards (Rule 8-5-4).',
            'Cover 2: attack the deep middle with seams, or the sideline hole behind the corner. "Smash" puts one receiver short under the corner and one on a corner route over him.',
            'Cover 3: four verticals puts 4 receivers deep against 3 deep defenders, and curl/flat puts one underneath defender in a 2-on-1.'],
          a: 'Rock-paper-scissors: each coverage beats some routes and loses to others. The chess match is guessing the other guy\'s hand.',
          x: 'That\'s why defenses disguise and rotate post-snap, and offenses answer with motion and "coverage-beater" concepts that have a built-in answer for both man and zone.',
        },
      },
      {
        title: 'Film Room: pattern-match Cover 3',
        deep: true,
        players: [...o11, ...F.hl(dN3, ['NB', 'SS'])],
        routes: [...verts, ...drops(dN3, MATCH, 300, 1600), ...rush4(dN3)],
        zones: [zn('z-d1', 48, 9.4, 7.5, 8.4, '#38bdf8', '', 0), zn('z-d2', 46, M, 7.5, 8.4, '#38bdf8', '', 0), zn('z-d3', 48, 44, 7.5, 8.4, '#38bdf8', '', 0)],
        marks: [{ id: 'cr1', type: 'text', x: 56, y: 18.6, t: 'CARRY #2', c: 'y', size: 1.1 }, { id: 'cr2', type: 'text', x: 55.4, y: 36.2, t: 'CARRY #2', c: 'y', size: 1.1 }],
        l3: { k: 'Film Room', t: 'Pattern-match Cover 3', s: 'Zone at the snap, man once the routes declare' },
        notes: {
          p: ['Four verticals is the textbook Cover 3 killer: 4 deep routes vs 3 deep defenders.',
            'Pattern matching fixes it. The curl/flat defenders read the #2 receivers (slot, tight end): if #2 goes vertical, they "carry" him up the seam like man coverage.',
            'The corners match #1 vertical, the free safety stays in the middle and helps on whichever seam the QB looks at.',
            'Result: it looks like zone at the snap, plays like man once routes declare. The QB\'s pre-snap read is only half the answer.'],
          a: 'A zone with a rulebook: "guard your room, but if that guy runs past it, follow him."',
          x: 'Match rules are keyed off receiver numbering (#1, #2, #3 from the outside in). The curl/flat defender carries #2 vertical until the deep player can take him; vs 3x1 sets most teams have a check so the backside corner can play the lone receiver man-to-man.',
        },
      },
    ],
  });
})(window.FD);
