/* Chapter 12 — Special Teams */
(function (FD) {
  const { F, R } = FD; const M = FD.MID;

  // ---------- kickoff alignment: NE kicks from its 35 (x 45), attacking right ----------
  const COV_Y = [3, 5.5, 12, 18, 25, 28.3, 35.3, 41.3, 47.8, 50.3];   // 2 outside the numbers, 2 between numbers and hash, 1 inside, each side
  const RL_Y = [4, 14, M, 39, 49.3];                                  // receivers with front foot on their 35
  const RB_Y = [10, 20, 33, 43];                                       // rest of the setup zone (max 2 per area)
  const KO = [
    { id: 'NE-K', t: 'NE', pos: 'K', x: 44.3, y: M },
    ...COV_Y.map((y, i) => ({ id: `NE-K${i + 1}`, t: 'NE', pos: '', lbl: '', x: 69.3, y })),
    ...RL_Y.map((y, i) => ({ id: `NYJ-R${i + 1}`, t: 'NYJ', pos: '', lbl: '', x: 75.7, y: +y.toFixed(2) })),
    ...RB_Y.map((y, i) => ({ id: `NYJ-R${i + 6}`, t: 'NYJ', pos: '', lbl: '', x: 79.3, y })),
    { id: 'NYJ-KR1', t: 'NYJ', pos: 'KR', lbl: 'KR', x: 104, y: 21 },
    { id: 'NYJ-KR2', t: 'NYJ', pos: 'KR', lbl: 'KR', x: 104, y: 32 },
  ];
  const KO_MK = [
    { id: 'lz', type: 'rect', x: 90, y: 0, w: 20, h: 53.33, c: 'y', op: 0.16, lbl: 'LANDING ZONE', size: 1.9, ly: 9 },
    { id: 'sz', type: 'rect', x: 75, y: 0, w: 5, h: 53.33, c: '#60a5fa', op: 0.16, stroke: false },
    { id: 'sz-t', type: 'text', x: 77.5, y: 30, t: 'SETUP ZONE (R 35–30)', rot: 90, size: 1.1, c: '#93c5fd' },
    { id: 'kl', type: 'line', x1: 70, y1: 0, x2: 70, y2: 53.33, c: 'w', w: 0.22, dash: true },
    { id: 'kl-t', type: 'text', x: 71.3, y: 9, t: 'COVERAGE LINE (R 40)', rot: 90, size: 1.1 },
    { id: 'kk', type: 'line', x1: 45, y1: 0, x2: 45, y2: 53.33, c: 'y', w: 0.22, dash: true },
    { id: 'kk-t', type: 'text', x: 46.4, y: 14, t: 'KICKER (K 35)', rot: 90, size: 1.1, c: 'y' },
  ];
  const KO_CAM = { x: 72, y: 22, w: 110 };
  const T24 = 'NEW RULE (2024): dynamic kickoff';

  // live-ball kick: lands in the landing zone, then both units may move
  const LAND = [101, 21.5];
  const S2R = [
    { id: 'ko', p: 'BALL', k: 'kick', d: [[45, M], LAND], move: true, delay: 300, dur: 1600 },
    R.abs(KO, 'NYJ-KR1', [LAND], { move: true, delay: 500, dur: 1300 }),
    R.abs(KO, 'NYJ-KR2', [[98, 26]], { move: true, delay: 1300, dur: 700 }),
    ...KO.filter((p) => /^NE-K\d/.test(p.id)).map((p) => R.abs(KO, p.id, [[84, +(M + (p.y - M) * 0.8).toFixed(2)]], { move: true, delay: 1900, dur: 900 })),
    ...KO.filter((p) => /^NYJ-R\d/.test(p.id)).map((p) => R.abs(KO, p.id, [[87.5, +(M + (p.y - M) * 0.8 + 1).toFixed(2)]], { move: true, delay: 1900, dur: 900, dash: true, c: 'g' })),
  ];
  const P3 = F.after([...KO, F.ball(45, M)], S2R).filter((p) => p.id !== 'BALL');

  // ---------- onside kick: NE line on its 35, Jets restraining line 10 yds ahead (x 55) ----------
  const ONS = [
    { id: 'NE-K', t: 'NE', pos: 'K', x: 43.2, y: M },
    ...[3, 5.5, 12, 18, 22.5, 30.8, 35.3, 41.3, 47.8, 50.3].map((y, i) => ({ id: `NE-K${i + 1}`, t: 'NE', pos: '', lbl: '', x: 44.3, y })),
    ...[8, 16, 23.5, 30, 37.5, 45.5].map((y, i) => ({ id: `NYJ-R${i + 1}`, t: 'NYJ', pos: '', lbl: '', x: 55.7, y })),
    { id: 'NYJ-R7', t: 'NYJ', pos: '', lbl: '', x: 61, y: 19 },
    { id: 'NYJ-R8', t: 'NYJ', pos: '', lbl: '', x: 61, y: 34.5 },
    { id: 'NYJ-R9', t: 'NYJ', pos: '', lbl: '', x: 65, y: M },
    { id: 'NYJ-KR1', t: 'NYJ', pos: 'KR', lbl: 'KR', x: 84, y: 20 },
    { id: 'NYJ-KR2', t: 'NYJ', pos: 'KR', lbl: 'KR', x: 84, y: 33 },
  ];

  // ---------- punt formation (NE punting, attacking right) ----------
  const PUNT = (los) => {
    const L = +(los - 0.9).toFixed(2), W = 16;
    const ne = (id, pos, x, y, lbl) => ({ id: `NE-${id}`, t: 'NE', pos, x: +x.toFixed(2), y: +y.toFixed(2), ...(lbl != null ? { lbl } : {}) });
    const nyj = (id, x, y, lbl = '') => ({ id: `NYJ-${id}`, t: 'NYJ', pos: '', lbl, x: +x.toFixed(2), y: +y.toFixed(2) });
    return [
      ne('LS', 'LS', L, M), ne('LG', 'G', L, M - 2.1), ne('RG', 'G', L, M + 2.1), ne('LT', 'T', L, M - 4.2), ne('RT', 'T', L, M + 4.2),
      ne('W1', 'W', los - 1.9, M - 5.8), ne('W2', 'W', los - 1.9, M + 5.8), ne('PP', 'PP', los - 5.5, M), ne('P', 'P', los - 15, M),
      ne('G1', 'GN', L, M - W, 'G'), ne('G2', 'GN', L, M + W, 'G'),
      nyj('D1', los + 1.2, M - 1.4), nyj('D2', los + 1.2, M + 1.4), nyj('D3', los + 1.2, M - 3.6), nyj('D4', los + 1.2, M + 3.6),
      nyj('D5', los + 1.2, M - 6.2), nyj('D6', los + 1.2, M + 6.2),
      nyj('V1', los + 1.5, M - W - 1.2, 'V'), nyj('V2', los + 1.5, M - W + 1.6, 'V'), nyj('V3', los + 1.5, M + W - 1.6, 'V'), nyj('V4', los + 1.5, M + W + 1.2, 'V'),
      nyj('PR', los + 45, M, 'PR'),
    ];
  };
  const PROT = ['LS', 'LG', 'RG', 'LT', 'RT', 'W1', 'W2'];
  const PU40 = [...PUNT(40), F.ball(25.8, M)];
  const PU70 = F.patch([...PUNT(70), F.ball(55.8, M)], { 'NYJ-PR': { x: 101, y: M } });

  // ---------- field goal / PAT unit: LOS at the NYJ 15 (x 95) ----------
  const FG = (los) => {
    const L = +(los - 0.9).toFixed(2);
    const ne = [['LS', 'LS', 0], ['LG', 'G', -2], ['RG', 'G', 2], ['LT', 'T', -4], ['RT', 'T', 4], ['LE', 'TE', -6], ['RE', 'TE', 6]]
      .map(([id, pos, dy]) => ({ id: `NE-${id}`, t: 'NE', pos, x: L, y: +(M + dy).toFixed(2) }));
    ne.push({ id: 'NE-W1', t: 'NE', pos: 'W', x: los - 1.9, y: +(M - 7.4).toFixed(2) }, { id: 'NE-W2', t: 'NE', pos: 'W', x: los - 1.9, y: +(M + 7.4).toFixed(2) },
      { id: 'NE-H', t: 'NE', pos: 'H', x: los - 7, y: M }, { id: 'NE-K', t: 'NE', pos: 'K', x: los - 9.3, y: +(M - 1.6).toFixed(2) });
    const nyj = [-7.8, -5, -3, -1, 1, 3, 5, 7.8].map((dy, i) => ({ id: `NYJ-B${i + 1}`, t: 'NYJ', pos: '', lbl: '', x: los + 1.2, y: +(M + dy).toFixed(2) }))
      .concat([{ id: 'NYJ-B9', t: 'NYJ', pos: '', lbl: '', x: los + 5, y: +(M - 3.5).toFixed(2) }, { id: 'NYJ-B10', t: 'NYJ', pos: '', lbl: '', x: los + 5, y: +(M + 3.5).toFixed(2) },
        { id: 'NYJ-B11', t: 'NYJ', pos: '', lbl: '', x: los + 9, y: M }]);
    return [...ne, ...nyj];
  };

  FD.CH.push({
    title: 'Special Teams', sub: 'Kickoffs, onside kicks, punts, fair catches, field goals',
    base: { bug: {} },
    steps: [
      {
        title: 'Kickoff: the alignment',
        bug: { reset: true, hs: 0, as: 0, q: '1ST', clk: '15:00', msg: 'KICKOFF' },
        cam: KO_CAM, off: 'NE', los: null, fd: null, ball: false, dlbl: false,
        players: KO, routes: [], zones: [], marks: KO_MK,
        tags: [T24],
        l3: { k: 'Starts each half & follows every score', t: 'Kickoff alignment', s: 'Kicker at his 35 · coverage at the Jets 40 · receivers 30–35' },
        notes: {
          p: ['Kickoffs start each half and follow every touchdown and field goal. Since 2024 the NFL uses the "dynamic kickoff" (Rule 6-1-2/6-1-3).',
            'The kicker is alone at his own 35. The other 10 Patriots line up on the JETS\' 40, only 5 yards from the receivers.',
            'At least 9 Jets must stand in the setup zone, between their own 35 and 30. Up to 2 returners wait deep.',
            'Nobody except the kicker may move until the ball hits the ground or a player in the landing zone. No more 40-yard sprints into a wall of blockers.',
            'The yellow area, from the Jets 20 to the goal line, is the landing zone where the kick has to come down.'],
          a: 'In a freeze game, everyone holds still until the ball lands, then it\'s a short sprint instead of a car crash.',
          x: 'The format came from the XFL and was adopted in 2024 to cut high-speed collisions while bringing returns back. Formation rules even specify how many players stand outside the numbers, between the numbers and hashes, and inside the hashes (6-1-3).',
        },
      },
      {
        title: 'Lands in the zone: live ball',
        sfx: { n: 'hit', at: 300 },
        players: [...KO, F.ball(45, M)],
        routes: S2R,
        marks: KO_MK,
        tags: [T24],
        l3: { k: 'The kick comes down in the landing zone', t: 'Live ball: return it', s: 'Coverage and blockers release only when the ball lands' },
        notes: {
          p: ['The ball lands inside the landing zone, so it is a live ball and the returner can run it back (6-1-4-a).',
            'Watch the timing: both lines stay frozen during the flight and only move once the ball touches the ground or a player in the zone.',
            'Blockers (green dashes) turn to block, coverage players (white) sprint only about 15 yards before contact.'],
          x: 'Until the ball is touched or lands in the zone, receiving-team players outside the setup zone must stay behind their 30, and no receiver may initiate a block (6-1-3-b-4, 6-2-1).',
        },
      },
      {
        title: 'The return',
        sfx: { n: 'hit2', at: 1600 },
        bug: { msg: null, poss: 'NYJ', down: 1, dist: 10 },
        players: P3,
        routes: [
          R.abs(P3, 'NYJ-KR1', [[95, 24], [88, 27.5], [81, 27.5]], { k: 'run', move: true, delay: 100, dur: 1500 }),
          R.abs(P3, 'NE-K5', [[81.6, 26.6]], { move: true, delay: 900, dur: 700 }),
          R.abs(P3, 'NE-K6', [[81.8, 28.6]], { move: true, delay: 1000, dur: 650 }),
          ...R.blocks(P3, ['NYJ-R2', 'NYJ-R3', 'NYJ-R4', 'NYJ-R7', 'NYJ-R8', 'NYJ-KR2'], 1.2),
        ],
        marks: [...KO_MK, { id: 'tk', type: 'text', x: 81, y: 33, t: 'DOWN AT THE NYJ 29', size: 1.5, c: 'y', delay: 1700 }],
        tags: [T24],
        l3: { k: 'Kickoff return', t: 'Return to the NYJ 29', s: 'Wherever he is tackled, the Jets start their drive' },
        notes: {
          p: ['The returner finds a seam and is tackled around his own 29.',
            'That\'s where the Jets offense will start: first and ten.',
            'Notice that a return to the 29 is actually WORSE than a touchback, which we\'ll see next puts the ball on the 35.',
            'So the kicking team\'s goal is a high, short kick into the landing zone that forces a return and pins the returner deep.'],
          a: 'Field position is real estate: each yard the returner gains is a yard the offense doesn\'t have to earn.',
          x: 'Since the dynamic kickoff, return rates jumped from the low 20%s (2023) to well over half of kickoffs, and kickers now aim for the corners of the landing zone to limit return lanes.',
        },
      },
      {
        title: 'Into the end zone on the fly → 35',
        sfx: { n: 'hit', at: 300 },
        bug: { msg: 'TOUCHBACK', poss: 'NYJ' },
        players: [...KO, F.ball(45, M)],
        routes: [
          { id: 'ko', p: 'BALL', k: 'kick', d: [[45, M], [114, 24]], move: true, delay: 300, dur: 1700, lift: 0.4 },
          R.abs(KO, 'NYJ-KR1', [[113.5, 23.4]], { move: true, delay: 500, dur: 1400 }),
        ],
        marks: [...KO_MK,
          { id: 'ez', type: 'rect', x: 110, y: 0, w: 10, h: 53.33, c: '#ef4444', op: 0.2, delay: 2000 },
          { id: 'tb', type: 'line', x1: 75, y1: 0, x2: 75, y2: 53.33, c: '#60a5fa', w: 0.45, delay: 2300 },
          { id: 'tb-b', type: 'ball', x: 75, y: M, delay: 2300 },
          { id: 'tb-t', type: 'text', x: 73.5, y: 22, t: 'TOUCHBACK: NYJ BALL AT THE 35', rot: 90, size: 1.3, c: '#93c5fd', delay: 2300 }],
        tags: ['NEW RULE (2025): touchback to the 35'],
        l3: { k: 'Lands in the end zone in the air', t: 'Touchback → the 35', s: 'Downed in the end zone or out the back: ball at the receivers\' 35' },
        notes: {
          p: ['If the kick flies all the way into the end zone without touching the landing zone, and the returner downs it, it\'s a touchback at the 35 (6-1-5).',
            'Same result if it goes out the back of the end zone or hits the goal post.',
            'That\'s a big penalty for kicking it too deep: the offense gets a free 35 yards.',
            'The returner may still bring it out if he wants; a kickoff into the end zone that stays in bounds is a live ball.'],
          x: 'Touchback spot was the 30 in the 2024 version; it moved to the 35 in 2025 to discourage kicking through the end zone. New for 2026: after a kickoff from the 50 (moved up by a penalty), every touchback goes to the 20 (6-1-5).',
        },
      },
      {
        title: 'Lands in the zone, rolls in → 20',
        sfx: { n: 'hit', at: 300 },
        bug: { msg: 'TOUCHBACK', poss: 'NYJ' },
        players: [...KO, F.ball(45, M)],
        routes: [
          { id: 'ko', p: 'BALL', k: 'kick', d: [[45, M], [104, 30]], move: true, delay: 300, dur: 1600 },
          R.abs(KO, 'NYJ-KR2', [[113.5, 31]], { move: true, delay: 2000, dur: 700 }),
        ],
        marks: [...KO_MK,
          { id: 'roll', type: 'arrow', d: [[104, 30], [113.5, 31]], c: 'w', dash: true, delay: 1900 },
          { id: 'tb', type: 'line', x1: 90, y1: 0, x2: 90, y2: 53.33, c: '#60a5fa', w: 0.45, delay: 2800 },
          { id: 'tb-b', type: 'ball', x: 90, y: M, delay: 2800 },
          { id: 'tb-t', type: 'text', x: 88.5, y: 22, t: 'TOUCHBACK: NYJ BALL AT THE 20', rot: 90, size: 1.3, c: '#93c5fd', delay: 2800 }],
        tags: [T24],
        l3: { k: 'Bounces in the zone, then into the end zone', t: 'Touchback → the 20', s: 'Lands in the landing zone first, then downed in the end zone' },
        notes: {
          p: ['This one lands IN the landing zone, then bounces into the end zone, where the returner downs it.',
            'That is also a touchback, but only to the 20 (6-1-5-a).',
            'So the rule rewards the kicker for landing it in the zone: either a return or a worse touchback.',
            'Same if it lands in the zone and then rolls out of bounds behind the goal line.'],
          x: 'Key distinction in 6-1-5: "without first touching the ground or a player in the landing zone" → 35; touched the landing zone first → 20.',
        },
      },
      {
        title: 'Short or out of bounds → the 40',
        sfx: { n: 'whistle', at: 1900 },
        bug: { msg: null, poss: 'NYJ' },
        players: [...KO, F.ball(45, M)],
        routes: [{ id: 'ko', p: 'BALL', k: 'kick', d: [[45, M], [84, 18]], move: true, delay: 300, dur: 1300, lift: 0.3 }],
        marks: [...KO_MK,
          { id: 'sh', type: 'circle', x: 84, y: 18, r: 2, c: '#ef4444', pulse: true, delay: 1600 },
          { id: 'sh-t', type: 'text', x: 84, y: 14.5, t: 'SHORT OF THE ZONE', size: 1.2, c: '#fca5a5', delay: 1600 },
          { id: 'ms', type: 'measure', x1: 45, x2: 70, y: 9, t: '25 yards from the kick spot', delay: 2100 },
          { id: 'tb', type: 'line', x1: 70, y1: 0, x2: 70, y2: 53.33, c: '#60a5fa', w: 0.45, delay: 2100 },
          { id: 'tb-b', type: 'ball', x: 70, y: M, delay: 2100 }],
        ov: [{ id: 'sg', type: 'signal', pos: 'r', sig: 9, name: 'Kickoff short of the landing zone or out of bounds', yds: 'Receivers\' ball at their 40', desc: 'Dead where it lands short. Out of bounds: same choice.' }],
        tags: [T24],
        l3: { k: 'Illegal kick', t: 'Short or out → R 40', s: 'Receiving team takes the ball 25 yards from the kick spot' },
        notes: {
          p: ['If the kick lands short of the landing zone, the ball is dead right there (6-1-4-d-3).',
            'Penalty-style result: the Jets may take the ball 25 yards from the kick spot, which is their own 40 (6-2-4).',
            'Same for a kick out of bounds: the receivers get the 40, or the out-of-bounds spot if that\'s better.',
            'Same signal as a false start: forearms rolling (signal 9).'],
          x: '6-2-4 lets the receivers choose: 25 yards from the spot of the kick, the out-of-bounds spot, or the spot it landed short if that is less than 25 yards. Safety kicks use 30 yards.',
        },
      },
      {
        title: 'Onside kick',
        sfx: { n: 'hit', at: 400 },
        bug: { msg: 'ONSIDE', poss: 'NE' },
        cam: { x: 62, y: 24, w: 80 },
        players: [...ONS, F.ball(45, M)],
        routes: [
          { id: 'ko', p: 'BALL', k: 'kick', d: [[45, M], [56.5, 21]], move: true, delay: 400, dur: 900, lift: 0.25 },
          R.abs(ONS, 'NE-K5', [[56.8, 21.5]], { move: true, delay: 1300, dur: 600 }),
          R.abs(ONS, 'NYJ-R3', [[57.4, 22.4]], { move: true, delay: 1300, dur: 600 }),
        ],
        marks: [
          { id: 'osz', type: 'rect', x: 55, y: 0, w: 15, h: 53.33, c: '#60a5fa', op: 0.14, stroke: false },
          { id: 'osz-t', type: 'text', x: 62.8, y: 12, t: 'ONSIDE SETUP ZONE', size: 1.2, c: '#93c5fd' },
          { id: 'kk', type: 'line', x1: 45, y1: 0, x2: 45, y2: 53.33, c: 'y', w: 0.22, dash: true },
          { id: 'rl', type: 'line', x1: 55, y1: 0, x2: 55, y2: 53.33, c: 'w', w: 0.22, dash: true },
          { id: 'ms', type: 'measure', x1: 45, x2: 55, y: 39.5, t: '10 yards' },
        ],
        tags: ['NEW RULE 2026: onside kick may be declared at any time'],
        l3: { k: 'Kicking team wants it back', t: 'Onside kick', s: 'Must travel 10 yards, then whoever recovers it keeps it' },
        notes: {
          p: ['An onside kick is a short kick the kicking team tries to recover itself. It must be declared to the Referee first (6-1-6).',
            'New in 2026: a team may declare it at any time in the game, not only when trailing late.',
            'All 10 Patriots line up on their 35, max 5 on each side of the ball. The Jets\' line is 10 yards away, with 8 or 9 players in the 15-yard onside setup zone.',
            'The Patriots may touch it only after it goes 10 yards (reaches the Jets\' line) or a Jet touches it first.',
            'If it goes untouched beyond the setup zone: 15-yard unsportsmanlike penalty from the kicking team\'s line, Jets ball.'],
          a: 'An onside kick is a coin flip you can lose badly: miss, and the other team starts near midfield.',
          x: 'The 2025 rule allowed onside kicks only for a team trailing in the 4th quarter; the 2026 text of 6-1-6 says "at any time during the game", making surprise onsides legal again.',
        },
      },
      {
        title: 'Punt formation',
        bug: { msg: null, poss: 'NE', down: 4, dist: 8 },
        cam: { x: 60, y: 27, w: 80 },
        los: 40, fd: 48, ball: { x: 40, y: M },
        players: PUNT(40), routes: [],
        marks: [
          { id: 'pd', type: 'measure', x1: 25, x2: 40, y: 34.5, t: '~15 yards deep' },
          { id: 'gn', type: 'text', x: 41, y: 14.7, t: 'GUNNER', anchor: 'start', size: 1.1, c: 'y' },
          { id: 'gn2', type: 'text', x: 41, y: 40.5, t: 'GUNNER', anchor: 'start', size: 1.1, c: 'y' },
        ],
        l3: { k: '4th & 8 at the NE 30', t: 'The punt unit', s: 'Long snapper · protection · punter 15 yards deep · 2 gunners' },
        notes: {
          p: ['Fourth down and too far to go for it: the Patriots punt. A punt is a "scrimmage kick" (Rule 9), started by a snap.',
            'The long snapper (LS) fires the ball 15 yards back to the punter. A wall of linemen, two wings and a personal protector (PP) give him time.',
            'The two gunners split wide. As the end men on the line, they are the only ones allowed to sprint downfield before the kick (9-1-2).',
            'The Jets put two "vise" players on each gunner to slow them down, and one punt returner deep.'],
          x: 'Anyone else on the kicking team who goes more than one yard downfield before the kick is "ineligible downfield on a kick": 5 yards (9-1-2).',
        },
      },
      {
        title: 'Punt & fair catch',
        sfx: { n: 'hit', at: 500 },
        bug: { msg: null, poss: 'NE', down: 4, dist: 8 },
        cam: { x: 58, y: 27, w: 80 },
        los: 40, fd: 48, ball: false,
        players: PU40,
        routes: [
          { id: 'snap', k: 'pass', d: [[39.4, M], [26, M]], delay: 0, dur: 300, lift: 0.02 },
          { id: 'pk', p: 'BALL', k: 'kick', d: [[25.8, M], [83, 24]], move: true, delay: 500, dur: 2000, lift: 0.45 },
          ...R.blocks(PU40, PROT, 0.8),
          R.abs(PU40, 'NE-G1', [[60, 12], [80.5, 21]], { move: true, delay: 400, dur: 2000, curve: true }),
          R.abs(PU40, 'NE-G2', [[60, 41], [80.5, 27.8]], { move: true, delay: 400, dur: 2000, curve: true }),
          R.abs(PU40, 'NYJ-V2', [[60, 13], [79, 19.5]], { move: true, delay: 450, dur: 2000, curve: true, dash: true, c: 'g' }),
          R.abs(PU40, 'NYJ-V3', [[60, 40], [79, 29.5]], { move: true, delay: 450, dur: 2000, curve: true, dash: true, c: 'g' }),
          R.abs(PU40, 'NYJ-PR', [[83, 24]], { move: true, delay: 600, dur: 1200 }),
        ],
        marks: [
          { id: 'fc-c', type: 'circle', x: 83, y: 24, r: 2.4, c: 'y', pulse: true, delay: 1400 },
          { id: 'fc-t', type: 'text', x: 83, y: 19.6, t: 'FAIR CATCH: arm waved overhead', size: 1.15, c: 'y', delay: 1400 },
          { id: 'fc-d', type: 'text', x: 83, y: 31.8, t: 'Dead where caught · no return · no hits', size: 1.15, delay: 2600 },
        ],
        l3: { k: 'Scrimmage kick', t: 'Punt & fair catch', s: 'Wave one arm above the helmet while the ball is in the air' },
        notes: {
          p: ['The punter booms it about 45 yards. The gunners race down to hit the returner the moment he catches it.',
            'The returner has an escape hatch: the fair catch. He fully extends one arm above his helmet and waves it side to side while the ball is in the air (10-2-2).',
            'If he catches it, the ball is dead right there: no return, and nobody may hit him (10-2-3). The Jets start at their own 27.',
            'Contact with him after a fair catch: 15 yards. Interfering with his chance to catch it: 15 yards and a fair catch is awarded (10-1-1).'],
          a: 'The fair catch is calling "safe!" in tag: you give up the chance to run, and in exchange nobody can touch you.',
          x: 'After a fair catch the receivers may snap it, or try a free "fair catch kick" (a field goal attempt with no rush, no tee) from that spot (10-2-4, 11-4-3).',
        },
      },
      {
        title: 'Punt into the end zone → 20',
        sfx: { n: 'hit', at: 500 },
        bug: { msg: 'TOUCHBACK', poss: 'NYJ', down: 1, dist: 10 },
        cam: { x: 84, y: 27, w: 80 },
        los: 70, fd: null, ball: false,
        players: PU70,
        routes: [
          { id: 'snap', k: 'pass', d: [[69.4, M], [56, M]], delay: 0, dur: 300, lift: 0.02 },
          { id: 'pk', p: 'BALL', k: 'kick', d: [[55.8, M], [114, 29]], move: true, delay: 500, dur: 2000, lift: 0.45 },
          ...R.blocks(PU70, PROT, 0.8),
          R.abs(PU70, 'NE-G1', [[88, 13], [107, 22]], { move: true, delay: 400, dur: 2000, curve: true }),
          R.abs(PU70, 'NE-G2', [[88, 41], [107, 31.5]], { move: true, delay: 400, dur: 2000, curve: true }),
          R.abs(PU70, 'NYJ-PR', [[104, 35]], { move: true, delay: 1300, dur: 900 }),
        ],
        marks: [
          { id: 'ez', type: 'rect', x: 110, y: 0, w: 10, h: 53.33, c: '#ef4444', op: 0.2, delay: 2400 },
          { id: 'tb', type: 'line', x1: 90, y1: 0, x2: 90, y2: 53.33, c: '#60a5fa', w: 0.45, delay: 2700 },
          { id: 'tb-b', type: 'ball', x: 90, y: M, delay: 2700 },
          { id: 'tb-t', type: 'text', x: 90, y: 16, t: 'TOUCHBACK: NYJ BALL AT THE 20', size: 1.4, c: '#93c5fd', delay: 2700 },
        ],
        l3: { k: 'Punt bounces into the end zone', t: 'Punt touchback → the 20', s: 'Scrimmage-kick touchbacks still go to the 20' },
        notes: {
          p: ['From the Jets 40, the punt carries into the end zone. The returner lets it go.',
            'A scrimmage kick that touches the ground in the receivers\' end zone is a touchback (11-6-2-c), and the receivers snap at their own 20 (11-6-3).',
            'That\'s 20 yards the punter gave away, so from midfield punters aim to land it inside the 10 and have the gunners down it before it rolls in.',
            'Note the difference: kickoff touchbacks go to the 35 (or 20), punt touchbacks always to the 20.'],
          x: 'The rulebook note for Rule 9 says it directly: "The dead ball spot for scrimmage kicks that result in a touchback is the 20-yard line." Only the kickoff touchback moved to the 35.',
        },
      },
      {
        title: 'Field goal & PAT unit',
        sfx: { n: 'hit', at: 700 },
        bug: { msg: null, poss: 'NE', down: 4, dist: 5 },
        cam: { x: 96, y: 27, w: 56 },
        los: 95, fd: 100, ball: false,
        players: [...FG(95), F.ball(88.3, M)],
        routes: [
          { id: 'snap', k: 'pass', d: [[94.1, M], [88.5, M]], delay: 0, dur: 300, lift: 0.02 },
          { id: 'fg', p: 'BALL', k: 'kick', d: [[88.3, M], [120, 26.3]], move: true, delay: 700, dur: 1100, lift: 0.3 },
          ...R.blocks(FG(95), ['LS', 'LG', 'RG', 'LT', 'RT', 'LE', 'RE'], 0.4),
        ],
        marks: [
          { id: 'up', type: 'line', x1: 120, y1: 23.58, x2: 120, y2: 29.75, c: 'y', w: 0.55 },
          { id: 'ms', type: 'measure', x1: 88.3, x2: 120, y: 17, t: '32-yd try: LOS 15 + 7 hold + 10 end zone' },
          { id: 'post', type: 'post', x: 76, y: 21, s: 0.75 },
          { id: 'ht', type: 'text', x: 88.3, y: 31.5, t: 'HOLDER 7 YDS BACK', size: 1, c: 'y' },
        ],
        l3: { k: 'Field goal = 3 · extra point = 1', t: 'The kicking unit', s: 'Snapper → holder 7 yards back → kicker · distance = LOS + 17' },
        notes: {
          p: ['Same personnel idea, shorter snap: the long snapper fires it 7 yards back to the holder, who spins the laces out; the kicker strikes it in about 1.3 seconds.',
            'Kick distance = line of scrimmage + 7 (the hold) + 10 (the end zone, because the posts stand on the end line). From the NYJ 15 that\'s a 32-yarder.',
            'Through the uprights and over the 10-ft crossbar: 3 points. A kicked try (extra point) is snapped from the 15, so it\'s the same ~32–33-yard kick for 1 point.',
            'Missed field goal: the defense takes over at the spot of the kick, or at the 20 if the kick was from inside the 20.'],
          a: 'Snapper, holder, kicker are a relay team with a 1.3-second baton pass.',
          x: 'Distance on the broadcast = LOS + 17 by convention. The defense can\'t line up over the snapper\'s shoulder pads within a yard of the line, and may have no more than 6 on the line on either side of him (9-1-3-2).',
        },
      },
    ],
  });
})(window.FD);
