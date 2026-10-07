/* Chapter 9 — Pass Game */
(function (FD) {
  const { F, R } = FD; const M = FD.MID;
  const react = (pl, map, delay = 350, dur = 900) => F.patch(pl, Object.fromEntries(Object.entries(map).map(([k, [x, y]]) => [k, { x, y, delay, dur }])));
  const drop = (pl, map, dur = 700) => Object.entries(map).map(([id, pt]) => R.abs(pl, id, [pt], { id: 'pp-' + id, k: 'block', move: true, dur }));
  const rush = (pl, map, delay = 100, dur = 900) => Object.entries(map).map(([id, pts]) => R.abs(pl, id, pts, { id: 'ru-' + id, k: 'route', c: '#f87171', move: true, curve: true, delay, dur }));
  const ELIG = ['X', 'Z', 'H', 'TE', 'RB', 'QB'];

  // ---- 1: eligibility (LOS = NE 35, x 45) ----
  const o1 = F.off(45, { pers: '11', wide: 16 });
  const d1 = F.def(45, { front: 'nickel', cov: '2', wide: 16 });
  const elig = ['X', 'H', 'TE', 'RB', 'Z'].map((id, i) => { const p = F.get(o1, id); return { id: 'e' + id, type: 'num', x: p.x - 2, y: p.y - 1.4, t: String(i + 1), c: '#38BDF8' }; });

  // ---- 2: pocket ----
  const o2 = F.off(45, { pers: '11' });
  const d2 = F.def(45, { front: '43', cov: '2' });
  const r2 = [
    ...drop(o2, { LT: [42.2, 21.4], LG: [42.9, 24.2], C: [43.3, M], RG: [42.9, 29.1], RT: [42.2, 31.9] }),
    R.abs(o2, 'QB', [[37.8, M]], { id: 'q2', move: true, dur: 600, dash: true }),
    R.abs(o2, 'RB', [[40.6, 30.8]], { id: 'b-RB', k: 'block', move: true, dur: 600 }),
    ...rush(d2, { DE1: [[43.2, 19.6], [41.2, 20.4]], DT1: [[43.9, 24]], DT2: [[43.9, 29.4]], DE2: [[43.4, 34.2], [41.4, 33.2]] }),
  ];
  const pocketArea = [
    { id: 'pa1', type: 'line', x1: 44.1, y1: 21.47, x2: 30, y2: 21.47, c: '#93c5fd', w: 0.15, dash: true },
    { id: 'pa2', type: 'line', x1: 44.1, y1: 31.87, x2: 30, y2: 31.87, c: '#93c5fd', w: 0.15, dash: true },
    { id: 'pat', type: 'text', x: 33.6, y: 20.7, t: 'POCKET AREA', size: 1, c: '#93c5fd' },
  ];

  // ---- 3: route tree ----
  const o3 = F.off(45, { pers: '11', wide: 16 });
  // Common 0–9 numbering (team systems vary): even = toward the middle, odd = toward the sideline
  const TREE = [[0, 'hitch', '#FACC15'], [1, 'flat', '#e2e8f0'], [2, 'slant', '#38BDF8'], [3, 'comeback', '#22d3ee'], [4, 'curl', '#a78bfa'], [5, 'out', '#f472b6'], [6, 'dig', '#34d399'], [7, 'corner', '#fb923c'], [8, 'post', '#ef4444'], [9, 'go', '#ffffff']];
  const LBL = { hitch: { lx: -9.5, ly: 2.4 }, curl: { lx: -7, ly: 2.6 }, comeback: { lx: 0.9, ly: -0.6 } };
  const r3 = TREE.map(([num, n, c], i) => ({ ...R.make(o3, 'X', n, { id: 't-' + n, c, lbl: `${num} ${n.toUpperCase()}`, delay: 200 + i * 250, dur: 900 }), ...(LBL[n] || {}) }));

  // ---- 4–5: SMASH vs Cover 2 ----
  const o4 = F.off(45, { pers: '11', wide: 17 });
  const d4 = F.def(45, { front: 'nickel', cov: '2', wide: 17 });
  const smash = (mv) => [
    R.make(o4, 'X', 'hitch', { c: 'y', move: mv, delay: 250, dur: 900 }),
    R.make(o4, 'H', 'corner', { c: 'r', move: mv, delay: 250, dur: 1350 }),
    R.make(o4, 'Z', 'hitch', { move: mv, delay: 250, dur: 900 }),
    R.make(o4, 'RB', 'check', { move: mv, delay: 400, dur: 900 }),
    ...R.blocks(o4, [...R.OL, 'TE'], 0.4),
  ];
  const cornerEnd = smash(false)[1].d[2];
  const r5 = [...smash(true), R.abs(o4, 'QB', [[38, M]], { id: 'q5', move: true, dur: 600, dash: true }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[38, M], cornerEnd], move: true, delay: 1100, dur: 500 }];
  const d5 = F.patch(react(d4, { DE1: [43.6, 20.4], DT1: [45, 25.2], DT2: [45, 28.4], DE2: [43.6, 33.4], WILL: [53, 22], MIKE: [53, 30], NB: [52.5, 17.5] }),
    { CB1: { x: 49.4, y: 10.6, delay: 600, dur: 700 }, FS: { x: 59.2, y: 12.4, delay: 500, dur: 1100 } });
  const z4 = [
    { id: 'zdh', ell: [62, 13.5, 6, 8.5], c: '#60a5fa', lbl: 'DEEP ½' },
    { id: 'zfl', ell: [50.5, 8, 3.2, 3], c: '#60a5fa', lbl: 'FLAT' },
  ];

  // ---- 6–7: MESH vs man (LOS NYJ 50, x 60) ----
  const o6 = F.off(60, { pers: '11', wide: 16 });
  const d6 = F.def(60, { front: 'nickel', cov: '1', wide: 16 });
  const mesh = (mv) => [
    R.abs(o6, 'H', [[60.5, 15.6], [65.8, 20.5], [66.2, 33.6]], { c: 'y', move: mv, curve: true, delay: 300, dur: 1400 }),
    R.abs(o6, 'TE', [[61, 31.5], [65, 28], [65.4, 17.2]], { c: 'y', move: mv, curve: true, delay: 300, dur: 1400 }),
    R.make(o6, 'X', [[10, 0], [15, -3.5]], { c: 'r', move: mv, delay: 300, dur: 1300 }),
    R.abs(o6, 'RB', [[58.4, 29.8], [61.6, 29.6], [70, 27.2], [69.2, 27.2]], { move: mv, delay: 300, dur: 1400 }),
    R.make(o6, 'Z', 'go', { move: mv, delay: 300, dur: 1400 }),
    ...R.blocks(o6, R.OL, 0.4),
  ];
  const r7 = [...mesh(true), R.abs(o6, 'QB', [[53.5, M]], { id: 'q7', move: true, dur: 600, dash: true }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[53.5, M], [66.2, 33.6]], move: true, delay: 1100, dur: 500 }];
  const d7 = F.patch(react(d6, { DE1: [58.8, 20.6], DT1: [60, 25.2], DT2: [60, 28.4], DE2: [58.8, 33.4], WILL: [67.6, 26.2], SS: [72.5, 37.2] }),
    { NB: { x: 65.4, y: 23.6, delay: 400, dur: 1100 }, MIKE: { x: 66.8, y: 28.6, delay: 600, dur: 700 }, CB1: { x: 72.4, y: 8.6, delay: 300, dur: 1300 }, FS: { x: 72, y: 24, delay: 500, dur: 1100 } });

  // ---- 8: sack (LOS NYJ 44, x 66) ----
  const o8 = F.off(66, { pers: '11' });
  const d8 = F.def(66, { front: '43', cov: '2' });
  const r8 = [
    ...drop(o8, { LT: [63.4, 21.6], LG: [64, 24.3], C: [64.3, M], RG: [64, 29.1], RT: [63.8, 31.2] }),
    R.abs(o8, 'QB', [[59, M]], { id: 'q8', move: true, dur: 600, dash: true }),
    R.make(o8, 'RB', 'flat', { move: true, delay: 300, dur: 900 }),
    R.make(o8, 'TE', 'seam', { delay: 300, dur: 1200 }),
    ...rush(d8, { DE1: [[64.4, 20.4]], DT1: [[65, 24.6]], DT2: [[65, 28.8]] }),
    R.abs(d8, 'DE2', [[66, 34.6], [62.6, 32.6], [59.8, 27.8]], { id: 'ru-DE2', k: 'route', c: 'r', move: true, curve: true, delay: 150, dur: 1300 }),
  ];

  // ---- 9: scramble (LOS NE 49, x 59) ----
  const o9 = F.off(59, { pers: '11' });
  const d9 = F.def(59, { front: '43', cov: '1' });
  const r9 = [
    ...drop(o9, { LT: [56.4, 21.6], LG: [57, 24.3], C: [57.3, M], RG: [57, 29.1], RT: [56.8, 31.6] }),
    R.abs(o9, 'QB', [[53, M], [55.6, 28.6], [56.4, 32.6], [57.6, 35.8], [62, 37.6], [70.6, 37]], { id: 'q9', k: 'run', move: true, curve: true, delay: 200, dur: 2000 }),
    R.abs(o9, 'RB', [[55, 29.6]], { id: 'b-RB', k: 'block' }),
    R.make(o9, 'H', 'post', { move: true, delay: 250, dur: 1500 }),
    R.make(o9, 'TE', 'go', { move: true, delay: 250, dur: 1500 }),
    ...rush(d9, { DE1: [[57.6, 20], [54.6, 22.4]], DT1: [[57.8, 25.2], [55.8, 26]], DT2: [[57.6, 28], [55.6, 27.4]], DE2: [[58, 35.8], [53.4, 33.8]] }, 150, 1000),
  ];
  const d9r = F.patch(d9, { SS: { x: 76, y: 34, delay: 300, dur: 1300 }, MIKE: { x: 66.6, y: 34.6, delay: 900, dur: 1100 }, FS: { x: 72.4, y: 34, delay: 700, dur: 1500 }, WILL: { x: 66, y: 21.6, delay: 300, dur: 1100 } });
  const p10 = F.after([...o9, ...d9r], r9);

  // ---- 11–12: incomplete (LOS NYJ 39, x 71) ----
  const o11 = F.off(71, { pers: '11' });
  const d11 = F.def(71, { front: 'nickel', cov: '1' });
  const r11 = [
    R.make(o11, 'H', 'seam', { c: 'r', move: true, delay: 250, dur: 1300 }),
    R.make(o11, 'TE', 'curl', { move: true, delay: 250, dur: 1100 }),
    R.make(o11, 'RB', 'check', { move: true, delay: 400, dur: 900 }),
    R.abs(o11, 'QB', [[64.5, M]], { id: 'q11', move: true, dur: 600, dash: true }),
    ...R.blocks(o11, R.OL, 0.4),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[64.5, M], [88.4, 13.2]], move: true, delay: 1100, dur: 550 },
  ];
  const d11r = F.patch(d11, { FS: { x: 86.6, y: 15.6, delay: 500, dur: 1100 }, NB: { x: 85.4, y: 13.4, delay: 300, dur: 1300 } });
  const p12 = F.after([...o11, ...d11r], r11).filter((p) => p.id !== 'BALL');

  FD.CH.push({
    title: 'Pass Game', sub: 'Who can catch, protection, routes, concepts',
    base: {},
    steps: [
      {
        title: 'Who can catch a pass',
        bug: { reset: true, hs: 14, as: 10, q: '3RD', clk: '6:40', down: 1, dist: 10, poss: 'NE' },
        cam: { x: 46, y: M + 1, w: 92 }, los: 45, fd: 55, lbl: true, ball: { x: 45, y: M },
        players: [...F.dim(F.hl(o1, ELIG), ELIG), ...F.dim(d1, [])], routes: [], zones: [],
        marks: [...elig,
          { id: 'inel', type: 'rect', x: 43, y: 21.3, w: 2.2, h: 10.75, c: '#ef4444', op: 0.15 },
          { id: 'inelt', type: 'text', x: 41, y: 19.8, t: 'INELIGIBLE · #50–79', size: 1.3, c: '#fca5a5' }],
        l3: { k: 'Pass game', t: 'Who can catch a pass?', s: '5 eligible receivers (+ a shotgun QB) · the 5 linemen can\'t' },
        notes: {
          p: ['Not everyone can catch a forward pass. The five offensive linemen are ineligible: they wear numbers 50–79 (Rule 5-1-2).',
            'Eligible: the two players on the ends of the line and anyone at least a yard behind it, wearing 0–49 or 80–89 (8-1-5). Here: X, Y (tight end), H, Z and the running back.',
            'The offense must have at least 7 men on the line (7-5-1). Only the two on the ends can go out for a pass.',
            'Linemen also can\'t wander more than a yard downfield before the ball is thrown: "ineligible man downfield", 5 yards (8-3-1).'],
          x: 'A shotgun QB is technically an eligible back (trick-play throwbacks). A T-formation QB under center is ineligible unless he moves to a legal spot and is set 1 second (8-1-6-d). Linemen can become eligible by reporting to the referee (5-3-1).',
        },
      },
      {
        title: 'The pocket',
        cam: { x: 42, y: M + 1, w: 44 },
        players: [...F.dim(o2, [...R.OL, 'QB', 'RB']), ...F.dim(d2, ['DE1', 'DT1', 'DT2', 'DE2'])], routes: r2,
        zones: [{ id: 'pocket', d: [[42.4, 22.6], [43.1, M], [42.4, 30.7], [38.8, 31.4], [35.8, M], [38.8, 21.9]], c: '#38BDF8', lbl: 'POCKET', lx: 39.2, ly: 24.4, delay: 900 }],
        marks: pocketArea, ball: false,
        l3: { k: 'Pass protection', t: 'The pocket', s: 'Linemen drop back into a cup · rushers loop around it' },
        notes: {
          p: ['On a pass, linemen don\'t charge forward. They step back and form a cup around the quarterback: the pocket.',
            'Edge rushers try to run around the cup; tackles ride them past the QB. Inside rushers try to push straight through.',
            'The QB steps UP into the pocket to escape edge pressure. Most throws come out in under 3 seconds.',
            'The dashed lines mark the official "pocket area": between the tackles\' normal spots, all the way back (Rule 3-25).'],
          a: 'An umbrella: the linemen are the canopy, the QB stands under it, the rain comes from the edges.',
          x: 'The pocket area matters for intentional grounding: a QB outside it may throw the ball away as long as it reaches the line of scrimmage (8-2-1).',
        },
      },
      {
        title: 'The route tree',
        cam: { x: 58, y: 15.5, w: 52 }, ball: false,
        players: F.dim(o3, ['X']), routes: r3, zones: [], marks: [],
        l3: { k: 'Receivers', t: 'The route tree', s: 'Same start, ten numbered paths (0–9)' },
        notes: {
          p: ['Every receiver route is built from a few basic shapes. Here is one receiver running all ten of the classic "route tree" at once.',
            'The numbers are how many play-calls are spoken: odd numbers break toward the sideline (1 flat, 3 comeback, 5 out, 7 corner), even numbers toward the middle (2 slant, 4 curl, 6 dig, 8 post).',
            '0 is the hitch (stop and turn), 9 is the go (straight up the field).',
            'So a call like "Twins right 2-9" tells two receivers: slant and go.'],
          a: 'Like the letters of an alphabet: plays are words built from these routes.',
          x: 'Many systems number the tree 0–9 so a play call is a string of digits, but the numbering differs by team; the shapes are universal.',
        },
      },
      {
        title: 'SMASH vs Cover 2: the read',
        cam: { x: 52, y: 20, w: 62 }, ball: { x: 45, y: M },
        players: [...o4, ...F.read(d4, ['CB1'])], routes: smash(false), zones: z4,
        marks: [
          { id: 'n1', type: 'num', x: cornerEnd[0] + 1.6, y: cornerEnd[1] + 1.2, t: '1' },
          { id: 'n2', type: 'num', x: 47.4, y: 12.4, t: '2' },
          { id: 'n3', type: 'num', x: 45.2, y: 33.2, t: '3' },
        ],
        l3: { k: 'Pass concept · QB read order', t: 'SMASH vs Cover 2', s: '<bdi dir="ltr">1: corner · 2: hitch · 3: RB checkdown</bdi>' },
        notes: {
          p: ['Pass plays are "concepts": two or three routes that work together against a coverage.',
            'SMASH: the outside receiver runs a 5-yard hitch, the slot runs a corner route behind him.',
            'Against Cover 2 the cornerback owns the short flat, with a safety deep. That puts him between two receivers: a high-low.',
            'QB read: 1 the corner route, 2 the hitch, 3 the running back checking down.'],
          a: 'Two kids, one babysitter: whichever kid he follows, the other one gets the cookie.',
          x: 'Cover 2 corners are taught to sink under the corner route; the counter is to hit the hitch quickly, and the safety\'s width decides the corner throw.',
        },
      },
      {
        title: 'SMASH: corner route, +15',
        ball: false,
        players: [...o4, ...d5, { ...F.ball(38, M), delay: 500 }], routes: r5,
        bug: { clk: '6:02', down: 1, dist: 10 },
        sfx: [{ n: 'hit', at: 1700 }],
        l3: { k: 'SMASH', t: 'Corner route, +15', s: 'The corner jumps the hitch · ball goes over his head' },
        notes: {
          p: ['The cornerback squats on the hitch. That\'s read 1: throw the corner route over him.',
            'The ball arrives before the deep safety can get there: timing and placement.',
            'Fifteen yards, first down, into Jets territory.'],
          x: 'If the corner sinks instead, the hitch is open immediately; if the safety squeezes, the corner throw goes to the sideline away from him.',
        },
      },
      {
        title: 'MESH vs man: the read',
        cam: { x: 64, y: 22, w: 70 }, los: 60, fd: 70, ball: { x: 60, y: M },
        players: [...o6, ...d6], routes: mesh(false), zones: [],
        marks: [
          { id: 'mp', type: 'circle', x: 65.6, y: 27, r: 1.8, c: 'y', pulse: true },
          { id: 'n1', type: 'num', x: 75.6, y: 8.4, t: '1' },
          { id: 'n2', type: 'num', x: 63.4, y: 24.4, t: '2' },
          { id: 'n3', type: 'num', x: 70.6, y: 28.8, t: '3' },
        ],
        l3: { k: 'Pass concept · QB read order', t: 'MESH vs man', s: '<bdi dir="ltr">1: outside corner · 2: open crosser · 3: RB checkdown</bdi>' },
        notes: {
          p: ['MESH: two receivers run shallow crossing routes, one from each side, passing within a yard of each other.',
            'Against man coverage, each defender has to chase his man through that traffic. One of them usually gets picked off.',
            'Read: 1 the corner route outside, 2 whichever crosser comes free, 3 the back sitting down in the middle.'],
          a: 'Two waiters crossing a busy kitchen door: whoever follows them gets stuck behind the other.',
          x: 'A receiver who blocks a defender more than a yard downfield before the throw commits offensive pass interference (8-5-4-a). Crossers just run their paths; the officials judge whether the rub was a run or a block.',
        },
      },
      {
        title: 'MESH: crosser free, +6',
        ball: false,
        players: [...o6, ...d7, { ...F.ball(53.5, M), delay: 500 }], routes: r7, marks: [],
        bug: { clk: '5:31', down: 2, dist: 4 },
        sfx: [{ n: 'hit', at: 1700 }],
        l3: { k: 'MESH', t: 'Crosser free, +6', s: 'The defender chasing him runs into traffic' },
        notes: {
          p: ['Watch the nickel back trailing H: he runs straight into the tight end crossing the other way.',
            'H comes out clean on the other side. Easy throw, six yards.',
            '2nd and 4. Short, safe completions keep the offense ahead of the chains.'],
          x: 'Zone defenses don\'t chase, so vs zone the crossers throttle down in the holes between defenders instead.',
        },
      },
      {
        title: 'Sack',
        cam: { x: 63, y: M + 2, w: 44 }, los: 66, fd: 70, ball: false,
        players: [...o8, ...d8], routes: r8, zones: [],
        marks: [
          { id: 'sk', type: 'circle', x: 59.2, y: M, r: 2.2, c: '#ef4444', pulse: true, delay: 1500 },
          { id: 'skt', type: 'text', x: 56, y: 23.2, t: 'SACK', size: 1.8, c: '#f87171', cls: 'hd', delay: 1500 },
          { id: 'skm', type: 'measure', x1: 59, x2: 66, y: 21, t: '−7', c: '#f87171', delay: 1500 },
        ],
        bug: { clk: '4:55', down: 3, dist: 11 },
        sfx: [{ n: 'hit', at: 1450 }],
        l3: { k: 'Pass game', t: 'Sack: loss of 7', s: 'QB tackled behind the line · 2nd & 4 becomes 3rd & 11' },
        notes: {
          p: ['A sack: the quarterback is tackled behind the line of scrimmage before he can throw.',
            'The running back released into a route, so the defensive end beat the right tackle with nobody to help.',
            'The ball is spotted where the QB went down. 7-yard loss: 2nd and 4 becomes 3rd and 11.',
            '"Sack" is a stats word, not a rulebook term. A sack in the field of play isn\'t a clock stoppage (Rule 4-4), so the clock keeps running.'],
          x: 'Throwing it away to avoid the sack from inside the pocket, with no receiver nearby, is intentional grounding: loss of down + 10 yards or the spot of the pass (8-2-1).',
        },
      },
      {
        title: 'Scramble',
        cam: { x: 63, y: M + 3, w: 52 }, los: 59, fd: 70, ball: false,
        players: [...o9, ...d9r], routes: r9, zones: [],
        marks: [
          { id: 'pa1', type: 'line', x1: 58.1, y1: 21.47, x2: 46, y2: 21.47, c: '#93c5fd', w: 0.15, dash: true },
          { id: 'pa2', type: 'line', x1: 58.1, y1: 31.87, x2: 46, y2: 31.87, c: '#93c5fd', w: 0.15, dash: true },
          { id: 'oop', type: 'text', x: 55, y: 41.4, t: 'OUT OF THE POCKET', size: 1.1, c: '#93c5fd', cls: 'hd', delay: 1100 },
          { id: 'sl', type: 'text', x: 70.6, y: 35, t: 'SLIDE', size: 1.2, c: 'y', cls: 'hd', delay: 2100 },
        ],
        bug: { clk: '4:20', down: 1, dist: 10 },
        sfx: [{ n: 'cheer', at: 2100 }],
        l3: { k: 'Pass game', t: 'Scramble: QB runs, 1st down', s: 'Everyone covered · pocket collapses · he takes off' },
        notes: {
          p: ['3rd and 11. Man coverage: every defender turns his back to chase a receiver.',
            'The pocket collapses, so the QB steps up, escapes outside and runs. Nobody is watching him.',
            'He slides feet-first before contact: the ball is dead right there and defenders must treat it as down by contact (7-2-1-d).',
            'Twelve yards, first down. The scramble is the defense\'s nightmare on 3rd and long.'],
          a: 'Hide-and-seek where every seeker picked someone else to chase.',
          x: 'Once outside the pocket area, the QB may legally throw it away as long as it reaches the line of scrimmage (8-2-1 Item 1). Defenses counter with a "spy" linebacker.',
        },
      },
      {
        title: 'What counts as a catch',
        cam: { x: 82, y: M + 3, w: 58 }, ball: false,
        players: p10, routes: [], marks: [],
        ov: [{ id: 'catch', type: 'panel', pos: 'r', k: 'Rule 8-1-3', t: 'What counts as a catch', num: true,
          items: ['**Control** of the ball before it hits the ground', '**Two feet** (or any body part but hands) down **in bounds**', 'Then a **football move**, or hold it long enough to make one', 'Lose it when you hit the ground before step 3? **Incomplete**'] }],
        tags: ['COLLEGE: one foot in bounds'],
        l3: null,
        notes: {
          p: ['Three parts, in order. One: control the ball before it touches the ground.',
            'Two: two feet, or a knee, hip, elbow (anything but hands), down in bounds.',
            'Three: then do something a runner does (tuck it, turn upfield, take another step), or hold it long enough to do so.',
            'Diving catch and the ball pops out when you land before step three? Not a catch: incomplete.'],
          x: 'Ball movement alone isn\'t loss of control (8-1-3 Note 1). A receiver carried out by a defender before landing is still a catch (Note 5).',
        },
      },
      {
        title: 'Incomplete pass',
        cam: { x: 78, y: M - 3, w: 56 }, los: 71, fd: 81, ball: false,
        players: [...o11, ...d11r, { ...F.ball(64.5, M), delay: 500 }], routes: r11,
        marks: [{ id: 'inc', type: 'text', x: 88, y: 18.6, t: 'INCOMPLETE', size: 1.6, c: '#f87171', cls: 'hd', delay: 1700 }],
        bug: { clk: '3:44', down: 2, dist: 10 },
        sfx: [{ n: 'whistle', at: 1800 }],
        l3: { k: 'Pass game', t: 'Incomplete', s: 'Ball hits the ground · down is lost · no yards' },
        notes: {
          p: ['1st and 10. Deep shot down the seam, the safety arrives with the ball, and it falls to the turf.',
            'Incomplete: the down counts, but no yards. Now it\'s 2nd and 10 from the same spot.',
            'And the game clock stops.'],
          x: 'Ball returns to the previous spot (8-1-4); the clock stops on an incomplete pass (4-4-f).',
        },
      },
      {
        title: 'Incomplete stops the clock',
        cam: { x: 84, y: M - 2, w: 60 }, ball: { x: 71, y: M },
        players: p12, routes: [],
        marks: [{ id: 'back', type: 'arrow', d: [[87.6, 14], [80, 20], [72.2, 25.6]], c: 'y', curve: true, dash: true }],
        ov: [{ id: 'sig13', type: 'signal', pos: 'r', sig: 13, name: 'Incomplete pass', desc: 'Clock stops · ball back to the previous spot', k: 'Official signal' }],
        l3: { k: '2nd & 10 · 3:44', t: 'Clock stopped', s: 'Restarts on the next snap' },
        notes: {
          p: ['The referee waves his arms across his body: incomplete pass (signal 13).',
            'The game clock stops (Rule 4-4-f) and restarts on the next snap (4-3-2).',
            'That\'s why trailing teams throw at the end of halves: incomplete passes and sideline catches save time; runs in bounds burn it.'],
          x: 'Same signal is used for penalty declined, play over, and missed field goal/try.',
        },
      },
    ],
  });
})(window.FD);
