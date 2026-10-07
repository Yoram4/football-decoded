/* Chapter 14 — Turnovers */
(function (FD) {
  const { F, R } = FD; const M = FD.MID;

  // ---------- interception: Jets attack left from their 40 (x 70), NE CB jumps the slant ----------
  const P1 = [...F.off(70, { team: 'NYJ', pers: '12', strong: -1, wide: 14 }), ...F.def(70, { team: 'NE', strong: -1, wide: 14 }), F.ball(75, M)];
  const PICK = [68.2, 17.9];
  const R1 = [
    ...R.blocks(P1, R.OL, 0.8),
    R.make(P1, 'Z', [[1.5, 0], [5, 3.6]], { move: true, delay: 200, dur: 1000, c: 'r' }),
    R.abs(P1, 'NE-CB2', [PICK], { move: true, delay: 500, dur: 900 }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[75, M], PICK], move: true, delay: 1000, dur: 420 },
  ];
  const P2 = F.after(P1, R1).filter((p) => p.id !== 'BALL');
  const R2 = [
    R.abs(P2, 'NE-CB2', [[74, 18.5], [80, 15.5], [86, 15]], { k: 'run', move: true, delay: 100, dur: 1500 }),
    R.abs(P2, 'NYJ-Z', [[78, 17], [85.4, 15.8]], { move: true, delay: 300, dur: 1300 }),
    R.abs(P2, 'NYJ-QB', [[80, 21]], { move: true, delay: 300, dur: 1200 }),
  ];

  // ---------- fumble: Jets run from midfield, NE linebacker strips it ----------
  const P4 = [...F.off(60, { team: 'NYJ', set: 'under', pers: '21' }), ...F.def(60, { team: 'NE' }), { ...F.ball(56.3, M + 2.4), delay: 1050 }];
  const LOOSE = [52.6, M + 6.5];
  const R4 = [
    ...R.blocks(P4, R.OL, 1),
    R.abs(P4, 'NYJ-RB', [[62, M + 1.2], [56.6, M + 2.4]], { k: 'run', move: true, delay: 150, dur: 950 }),
    R.abs(P4, 'NE-MIKE', [[55.7, M + 2.4]], { move: true, delay: 450, dur: 650 }),
    { id: 'fum', p: 'BALL', k: 'pass', d: [[56.3, M + 2.4], LOOSE], move: true, delay: 1150, dur: 450, lift: 0.08 },
  ];
  const P5 = F.after(P4, R4).map((p) => (p.id === 'BALL' ? { id: p.id, t: p.t, pos: '', x: p.x, y: p.y, shape: 'ball', lbl: '' } : p));
  const R5 = [
    R.abs(P5, 'NE-SAM', [[52.7, 33.3]], { move: true, delay: 0, dur: 550, c: 'y' }),
    R.abs(P5, 'NE-DT2', [[53.8, 31.6]], { move: true, delay: 0, dur: 750 }),
    R.abs(P5, 'NYJ-RB', [[53.6, 31.2]], { move: true, delay: 100, dur: 650 }),
    R.abs(P5, 'NYJ-FB', [[54.2, 34.8]], { move: true, delay: 100, dur: 900 }),
  ];

  // ---------- turnover on downs: NE 4th & 2 at the NYJ 25 ----------
  const P7 = [...F.off(85, { set: 'under', pers: '12' }), ...F.def(85, { front: '43' })];
  const R7 = [
    ...R.blocks(P7, R.OL, 0.6),
    R.abs(P7, 'NE-RB', [[83, M + 0.6], [85.6, M + 0.8]], { k: 'run', move: true, delay: 300, dur: 900 }),
    R.abs(P7, 'NYJ-MIKE', [[86.3, M + 0.8]], { move: true, delay: 500, dur: 650 }),
    R.abs(P7, 'NYJ-DT1', [[85.4, M - 0.9]], { move: true, delay: 400, dur: 600 }),
  ];

  // ---------- end-zone interception: Jets at the NE 15 (x 25) ----------
  const P8 = [...F.off(25, { team: 'NYJ', strong: -1 }), ...F.def(25, { team: 'NE', cov: '2', strong: -1 }), F.ball(30, M)];
  const R8 = [
    ...R.blocks(P8, R.OL, 0.8),
    R.make(P8, 'H', 'post', { move: true, delay: 200, dur: 1300, c: 'r' }),
    R.abs(P8, 'NE-FS', [[8.2, 34.3]], { move: true, delay: 500, dur: 1000 }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[30, M], [8, 34.2]], move: true, delay: 1000, dur: 650 },
  ];

  FD.CH.push({
    title: 'Turnovers', sub: 'Interceptions, fumbles, turnover on downs',
    base: { bug: {} },
    steps: [
      {
        title: 'Interception!',
        sfx: { n: 'roar', at: 1450 },
        bug: { reset: true, hs: 14, as: 10, q: '3RD', clk: '6:12', poss: 'NE', down: null, dist: null, msg: 'INTERCEPTION' },
        cam: { x: 62, y: 24, w: 56 }, off: 'NYJ', los: 70, fd: 63, ball: false, dlbl: false,
        players: P1, routes: R1, zones: [],
        marks: [{ id: 'int', type: 'text', x: 66, y: 21.6, t: 'PICKED!', size: 1.6, c: 'y', delay: 1500 }],
        l3: { k: 'Jets 2nd & 7 at their 40', t: 'Interception', s: 'The corner reads the slant and jumps in front of it' },
        notes: {
          p: ['Now the Patriots are on DEFENSE. The Jets have the ball, going left, 2nd & 7 at their own 40.',
            'The receiver runs a quick slant (red). The Patriots cornerback reads it and breaks on the ball BEFORE the receiver gets there.',
            'He catches it: interception. Possession flips to New England instantly, mid-play.',
            'The ball is still live, so he can run with it.'],
          a: 'An interception is a pass delivered to the wrong address.',
          x: 'Interceptions are booth-reviewed automatically (15-1-2-e-1), so coaches never need to challenge them.',
        },
      },
      {
        title: 'The return',
        sfx: { n: 'hit2', at: 1550 },
        bug: { msg: null, poss: 'NE', down: 1, dist: 10 },
        cam: { x: 72, y: 24, w: 60 }, los: null, fd: null,
        players: P2, routes: R2,
        marks: [{ id: 'dn', type: 'ball', x: 86, y: 15, delay: 1600 },
          { id: 'dn-t', type: 'text', x: 86, y: 19.4, t: 'NE BALL AT THE NYJ 24', size: 1.3, c: 'y', delay: 1700 }],
        l3: { k: 'Pick and return', t: 'Return to the NYJ 24', s: 'Patriots offense starts 24 yards from a touchdown' },
        notes: {
          p: ['The cornerback turns upfield and returns it 18 yards before the receiver drags him down.',
            'Now the Patriots offense takes the field at the Jets 24, already in field goal range.',
            'Count the swing: the Jets were driving from their 40; now New England is 24 yards from scoring.'],
          x: 'A pick-six (returned for a touchdown) is the ultimate swing; the defensive team then kicks the Try like any offense.',
        },
      },
      {
        title: 'Replay: a goal-line interception',
        bug: { hide: true },
        players: [], routes: [], marks: [],
        ov: [{ id: 'vid', type: 'video', pos: 'c', yt: 'butler', k: 'Replay · Super Bowl XLIX', t: 'Malcolm Butler, goal-line INT', s: 'Patriots 28, Seahawks 24 · 0:26 left at the NE 1' }],
        l3: null,
        notes: {
          p: ['This replay is a useful example of a goal-line interception.',
            'Seattle had 2nd & goal at the New England 1 with 26 seconds left, trailing 28–24.',
            'The quick slant gives the cornerback a chance to read the route, break toward the ball, and intercept it.',
            'Watch the defender\'s first step and how he takes the receiver\'s path to the ball.'],
          x: 'Russell Wilson to Ricardo Lockette on the slant from the 1; Malcolm Butler undercut the route.',
        },
      },
      {
        title: 'Fumble!',
        sfx: { n: 'hit2', at: 1100 },
        bug: { hide: false, q: '3RD', clk: '2:47', poss: 'NYJ', down: 1, dist: 10, msg: null },
        cam: { x: 58, y: 27, w: 50 }, off: 'NYJ', los: 60, fd: 50, ball: false,
        players: P4, routes: R4,
        marks: [{ id: 'lb', type: 'text', x: 52.6, y: 36.4, t: 'LOOSE BALL!', size: 1.4, c: 'y', delay: 1600 }],
        l3: { k: 'Jets 1st & 10 at midfield', t: 'Strip and fumble', s: 'The linebacker punches the ball out: it\'s anyone\'s ball' },
        notes: {
          p: ['Jets run between the tackles. The Patriots linebacker doesn\'t just tackle: he punches at the ball.',
            'The ball pops out. That\'s a fumble: any loss of possession other than a pass or kick (8-7-3).',
            'The play is NOT over. A fumbled ball is live until someone recovers it or it goes out of bounds.'],
          a: 'A fumble is a dropped wallet in a crowd: it belongs to whoever picks it up.',
          x: 'Down by contact: if the runner\'s knee touched the ground before the ball came out, he was down and there is no fumble. Replay checks exactly that.',
        },
      },
      {
        title: 'Recovery',
        sfx: { n: 'roar', at: 600 },
        bug: { poss: 'NE', msg: 'TURNOVER' },
        players: P5, routes: R5,
        marks: [{ id: 'pile', type: 'circle', x: 52.8, y: 33.2, r: 3, c: 'y', pulse: true, delay: 600 },
          { id: 'rec', type: 'text', x: 52.8, y: 38, t: 'PATRIOTS RECOVER', size: 1.4, c: 'y', delay: 700 }],
        l3: { k: 'Live ball until recovered', t: 'Patriots recover', s: 'Whoever ends up with clear possession gets the ball' },
        notes: {
          p: ['Everybody dives. A Patriots linebacker falls on it first: fumble recovered, Patriots ball.',
            'Either team may recover a fumble and even advance it (8-7-3 Item 1).',
            'Exception: on 4th down, after the two-minute warning, or on a Try, only the player who fumbled may advance it if his own team recovers.',
            'When the pile is a mess, officials dig in and award the ball to whoever has clear possession.'],
          x: 'Bouncing ball physics make recoveries close to a coin flip, which is why analysts treat fumble RECOVERIES as luck and forced fumbles as skill.',
        },
      },
      {
        title: 'Fumbles out of bounds',
        bug: { msg: null },
        cam: { x: 60, y: 26.67, w: 124 }, off: 'NE', los: null, fd: null, ball: false,
        players: [], routes: [],
        marks: [
          { id: 'n1', type: 'num', x: 30, y: 38, t: '1', r: 1.4 },
          { id: 'a1', type: 'arrow', d: [[30, 38], [38, 53.6]], c: 'w', dash: true },
          { id: 't1', type: 'text', x: 41, y: 44, t: 'Forward out of bounds: fumbling team, spot of fumble', anchor: 'start', size: 1.7 },
          { id: 'n2', type: 'num', x: 30, y: 14, t: '2', r: 1.4 },
          { id: 'a2', type: 'arrow', d: [[30, 14], [22, -0.2]], c: 'w', dash: true },
          { id: 't2', type: 'text', x: 33, y: 11, t: 'Backward out of bounds: fumbling team, out-of-bounds spot', anchor: 'start', size: 1.7 },
          { id: 'n3', type: 'num', x: 100, y: 22, t: '3', r: 1.4, c: '#ef4444' },
          { id: 'a3', type: 'arrow', d: [[100, 22], [120.3, 27]], c: '#ef4444', dash: true },
          { id: 'ez', type: 'rect', x: 110, y: 0, w: 10, h: 53.33, c: '#ef4444', op: 0.18 },
          { id: 't3', type: 'text', x: 98, y: 18, t: 'Out through the opponent\'s end zone: TOUCHBACK', anchor: 'end', size: 1.7, c: '#fca5a5' },
          { id: 'tb', type: 'line', x1: 90, y1: 30, x2: 90, y2: 40, c: '#60a5fa', w: 0.5, delay: 600 },
          { id: 'tb-t', type: 'text', x: 88, y: 36, t: 'defense\'s ball at its 20', anchor: 'end', size: 1.6, c: '#93c5fd', delay: 600 },
        ],
        l3: { k: 'Loose-ball rules', t: 'Fumble out of bounds', s: 'Out of bounds: fumbling team keeps it, except out of the end zone' },
        notes: {
          p: ['If a fumble rolls out of bounds, nobody recovered it, so the team that fumbled keeps it (8-7-3 Item 3).',
            'Forward and out: ball at the spot of the fumble (no gaining yards by fumbling forward). Backward and out: ball at the out-of-bounds spot.',
            'The brutal exception: fumble forward into the opponent\'s end zone and out of bounds = touchback. The DEFENSE gets the ball at its own 20 (8-7-3 Item 4-a, 11-6-3).',
            'So a runner reaching for the pylon who loses the ball can turn a touchdown into a turnover.'],
          a: 'The end zone is the one place where "out of bounds" switches sides.',
          x: 'Exception in Item 3-d: on 4th down, if the ball goes out short of the line to gain, Team B gets it at the dead-ball spot. A fumble out of your OWN end zone with your own impetus is a safety (Item 4-b).',
        },
      },
      {
        title: 'Turnover on downs',
        sfx: { n: 'hit2', at: 1100 },
        bug: { poss: 'NE', down: 4, dist: 2, msg: null, q: '4TH', clk: '9:05' },
        cam: { x: 80, y: 27, w: 56 }, off: 'NE', los: 85, fd: 87, ball: false,
        players: P7, routes: R7,
        marks: [
          { id: 'ms', type: 'measure', x1: 85.6, x2: 87, y: 19, t: 'short', size: 1.1, delay: 1400 },
          { id: 'fl', type: 'arrow', d: [[80, 39], [62, 39]], c: '#22c55e', delay: 1700 },
          { id: 'fl-t', type: 'text', x: 71, y: 37.4, t: 'JETS BALL: now going this way', size: 1.3, c: '#86efac', delay: 1700 },
        ],
        l3: { k: '4th & 2 at the NYJ 25', t: 'Turnover on downs', s: 'Stopped short: the Jets take over right at that spot' },
        notes: {
          p: ['Patriots go for it on 4th & 2 instead of kicking. The run gets stuffed short of the yellow line.',
            'Four downs, no first down: the other team gets the ball at the dead-ball spot (7-3-2-a). That\'s a turnover on downs.',
            'The field flips: the Jets offense now goes LEFT, starting about their own 24, 1st & 10.',
            'Riskier than punting or kicking a field goal, but no kick means no free yards if it fails.'],
          a: 'You bet the ball and lost the bet: the other team collects it where you stopped.',
          x: 'Failed 4th downs are booth-reviewable (15-1-2-e-3). Turnovers on downs usually don\'t count in the official "giveaways" stat, which is just interceptions plus fumbles lost.',
        },
      },
      {
        title: 'End-zone interception: touchback',
        sfx: { n: 'roar', at: 1700 },
        bug: { q: '4TH', clk: '3:30', poss: 'NE', down: 1, dist: 10, msg: 'TOUCHBACK' },
        cam: { x: 30, y: 27, w: 56 }, off: 'NYJ', los: 25, fd: 15, ball: false,
        players: P8, routes: R8,
        marks: [
          { id: 'ez', type: 'rect', x: 0, y: 0, w: 10, h: 53.33, c: 'y', op: 0.14 },
          { id: 'kn', type: 'text', x: 8.2, y: 30.6, t: 'PICKED · KNEELS', size: 1.2, c: 'y', delay: 1700 },
          { id: 'tb', type: 'line', x1: 30, y1: 12, x2: 30, y2: 42, c: '#60a5fa', w: 0.45, delay: 2400 },
          { id: 'tb-t', type: 'text', x: 31.2, y: 16, t: 'NE BALL AT ITS 20', anchor: 'start', size: 1.3, c: '#93c5fd', delay: 2400 },
        ],
        l3: { k: 'Jets in the red zone', t: 'INT in the end zone', s: 'Defender downs it in his end zone: touchback, ball at the 20' },
        notes: {
          p: ['Jets at the Patriots 15, throwing into the end zone. The Patriots safety jumps the post route and intercepts it in his own end zone.',
            'If he kneels there, it is a touchback: the ball is dead behind his goal line, but the Jets provided the impetus (11-6-1, 11-6-2-a).',
            'The Patriots get the ball at their own 20 (11-6-3). He could also try to return it, at the risk of being tackled short of the 20.'],
          x: 'Momentum exception (11-5-1, Exc. 2): if he intercepts in the field of play and his momentum carries him into the end zone where he\'s downed, it\'s not a safety: ball at the spot of the catch, or a touchback if that spot was in the end zone.',
        },
      },
      {
        title: 'Why turnovers decide games',
        bug: { msg: null },
        cam: { x: 60, y: 26.67, w: 132 }, los: null, fd: null, ball: false,
        players: [], routes: [], marks: [],
        ov: [{ id: 'sum', type: 'panel', pos: 'c', k: 'Turnovers', t: 'The swing play',
          items: ['**Turnover** = the defense takes the ball: interception or fumble recovery', 'The drive ends **and** field position flips: often a short field for the other offense', '**Turnover on downs** also hands over the ball, at the spot', '**Turnover margin** = takeaways − giveaways: one of the strongest predictors of who wins'] }],
        l3: { k: 'Takeaways vs giveaways', t: 'Turnover margin', s: 'Win the turnover battle, usually win the game' },
        notes: {
          p: ['A turnover is any time the defense takes the ball away: interception or fumble recovery.',
            'It costs twice: you lose your scoring chance AND the other offense starts with better field position.',
            'Broadcasts track "turnover margin": takeaways minus giveaways. Teams that win the turnover battle win most of their games.',
            'Strong defenses protect the ball and create chances to take it away.'],
          x: 'Interceptions are partly skill (QB decisions, coverage), but fumble recoveries are close to 50/50, so turnover margin tends to regress toward zero year to year.',
        },
      },
    ],
  });
})(window.FD);
