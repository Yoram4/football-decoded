/* Chapter 15 — Strategy */
(function (FD) {
  const { F, R } = FD; const M = FD.MID;

  // 4th & 2 at the NYJ 38 (x = 72)
  const LOS = 72;
  const D4 = F.def(LOS, { front: '43', cov: '1' });
  const O4 = F.off(LOS, { pers: '11' });

  // punt unit: punter 15 yards deep, personal protector, gunners split wide
  const PUNT = [
    ...F.patch(F.off(LOS, { set: 'under', pers: '12' }), {
      QB: { x: 57, y: M, pos: 'P', lbl: 'P' },
      RB: { x: 66, y: M, pos: 'PP', lbl: 'PP' },
      X: { x: 71.1, y: M - 22, lbl: 'G' },
      Z: { x: 71.1, y: M + 22, lbl: 'G' },
    }),
    ...F.patch(D4, { FS: { x: 106, y: M - 2, lbl: 'PR' }, CB1: { x: 74, y: M - 22 }, CB2: { x: 74, y: M + 22 } }),
    F.ball(57, M),
  ];
  const puntR = [
    { id: 'bf', p: 'BALL', k: 'kick', d: [[57, M], [104.5, M - 4]], move: true, delay: 400, dur: 1500 },
    R.abs(PUNT, 'NE-X', [[85, M - 18], [102, M - 7]], { k: 'run', move: true, delay: 350, dur: 1600, curve: true }),
    R.abs(PUNT, 'NE-Z', [[85, M + 18], [102, M + 2]], { k: 'run', move: true, delay: 350, dur: 1600, curve: true }),
    R.abs(PUNT, 'NYJ-FS', [[104.5, M - 4]], { k: 'run', move: true, delay: 900, dur: 900 }),
  ];

  // field-goal unit: holder 7 yards deep, kicker behind him
  const FG = [
    ...F.patch(F.off(LOS, { set: 'under', pers: '12' }), {
      QB: { x: 65, y: M, pos: 'H', lbl: 'H' },
      RB: { x: 62.3, y: M - 2.2, pos: 'K', lbl: 'K' },
      X: { x: 70.4, y: M - 7.8, lbl: 'W' },
      Z: { x: 70.4, y: M + 7.8, lbl: 'W' },
    }),
    ...F.patch(D4, { CB1: { x: 73.4, y: M - 9 }, CB2: { x: 73.4, y: M + 9 }, FS: { x: 84, y: M }, SS: { x: 80, y: M + 4 } }),
    F.ball(65, M),
  ];
  const fgR = [{ id: 'bf', p: 'BALL', k: 'kick', d: [[65, M], [120, M]], move: true, delay: 700, dur: 1300 }];

  // go for it: quick slant to Z vs press man
  const GO = [...O4, ...F.def(LOS, { front: '43', cov: '1', press: true }), F.ball(67, M)];
  const goR = [
    ...R.blocks(GO, R.OL, 1.2, 0),
    R.make(GO, 'NE-Z', 'slant', { c: 'r', move: true, delay: 250, dur: 1000 }),
    R.make(GO, 'NE-X', 'go', { delay: 250, dur: 1400 }),
    R.make(GO, 'NE-H', 'hitch', { delay: 250, dur: 900 }),
    R.make(GO, 'NE-TE', 'flat', { delay: 250, dur: 900 }),
    R.abs(GO, 'NYJ-CB2', [[78.2, M + 14.8]], { k: 'run', move: true, delay: 300, dur: 1150 }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[67, M], [77.1, M + 14]], move: true, delay: 950, dur: 450 },
  ];

  // leading late: inside run, stay in bounds
  const RUN = [...F.off(80, { set: 'under', pers: '12' }), ...F.def(80, { front: '43', cov: '1' })];
  const runR = [
    ...R.blocks(RUN, R.OL, 1.6, 0.6),
    R.abs(RUN, 'NE-RB', [[79, M + 1], [81.5, M + 1.6], [84.5, M + 2]], { k: 'run', c: 'y', move: true, delay: 300, dur: 1300, curve: true }),
  ];

  // victory formation at the NYJ 27 (x = 83)
  const VIC = [
    ...F.patch(F.off(83, { set: 'under', pers: '12' }), {
      X: { x: 80.6, y: M - 2.3, lbl: '' },
      Z: { x: 80.6, y: M + 2.3, lbl: '' },
      RB: { x: 75.5, y: M, lbl: 'S' },
      TE: { x: 81.4, y: M + 5.2, lbl: '' },
      TE2: { x: 81.4, y: M - 5.2, lbl: '' },
    }),
    ...F.def(83, { front: '43', cov: '0' }),
  ];
  const vicR = [R.abs(VIC, 'NE-QB', [[80.3, M]], { k: 'run', move: true, delay: 500, dur: 700, lbl: 'KNEEL' })];

  // trailing: Jets two-minute drill from their own 30 (x = 80), out route to the sideline
  const TWO = [...F.off(80, { team: 'NYJ' }), ...F.def(80, { team: 'NE', front: 'nickel', cov: '2' }), F.ball(85, M)];
  const twoR = [
    ...R.blocks(TWO, ['NYJ-LT', 'NYJ-LG', 'NYJ-C', 'NYJ-RG', 'NYJ-RT'], 1.2, 0),
    R.make(TWO, 'NYJ-Z', [[10, 0], [10, -6], [11.5, -9.5]], { c: 'r', move: true, delay: 250, dur: 1500 }),
    R.make(TWO, 'NYJ-X', 'out', { delay: 250, dur: 1300 }),
    R.make(TWO, 'NYJ-H', 'seam', { delay: 250, dur: 1300 }),
    R.make(TWO, 'NYJ-TE', 'out5', { delay: 250, dur: 1000 }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[85, M], [71.6, M + 24.7]], move: true, delay: 1050, dur: 550 },
  ];

  FD.CH.push({
    title: 'Strategy', sub: '4th-down decisions and clock management',
    base: { bug: {} },
    steps: [
      {
        title: '4th & 2 at the NYJ 38',
        bug: { reset: true, hide: false, hs: 20, as: 17, q: '4TH', clk: '6:12', pc: 40, down: 4, dist: 2, poss: 'NE', msg: null, flag: false },
        cam: { x: 72, y: 26.67, w: 70 },
        off: 'NE', los: LOS, fd: 74, lbl: true, ball: { x: LOS, y: M },
        players: [...O4, ...D4], routes: [], zones: [], marks: [
          { id: 's-meas', type: 'measure', x1: 72, x2: 74, y: 50.5, t: '2 yards' },
        ],
        l3: { k: 'The big decision', t: 'Punt, kick, or go?', s: 'NE leads 20–17 · 4th & 2 at the NYJ 38 · 6:12 left' },
        notes: {
          p: ['Here is the moment every coach is judged on. Fourth down, two yards to go, ball on the Jets\' 38.',
            'Three choices: punt it away, try a field goal, or go for it and try to gain the two yards.',
            'Nothing in the rulebook forces a kick: on 4th down you can run a normal play. If you fail, the other team gets the ball right there.',
            'We\'re up by 3 with six minutes left. Every option changes the math of the rest of the game.'],
          a: 'It\'s the last turn of a board game: bank the points you have, or risk them for a bigger move.',
          x: 'Field position here is the "dead zone" (roughly opponent\'s 35–40): too far for a sure field goal, too close for a punt to gain much. That\'s exactly where analytics say "go" most often.',
        },
      },
      {
        title: 'Option 1: punt',
        cam: { x: 84, y: 26.67, w: 80 },
        los: LOS, fd: null, ball: false,
        players: PUNT, routes: puntR, zones: [],
        marks: [
          { id: 'pin', type: 'rect', x: 100, y: 0, w: 10, h: 53.33, c: 'y', op: 0.14, lbl: 'INSIDE THE 10', size: 1.5 },
          { id: 'tb', type: 'text', x: 115, y: 50, t: 'end zone = touchback → 20', size: 1.1, c: 'y' },
        ],
        l3: { k: 'Option 1', t: 'Punt: pin them deep', s: 'Give the ball away, but make the Jets start near their own goal line' },
        notes: {
          p: ['The punter stands about 15 yards back and kicks the ball away. The Jets get the ball, but far from our end zone.',
            'From the 38 the punter can\'t kick it hard: if it goes into the end zone it\'s a touchback and the Jets start at their 20. That would net only 18 yards.',
            'So this is a soft, high "pooch" punt aimed to die or be fair-caught inside the 10. The gunners sprint down to down it.',
            'Safe, but it gives up the ball with a 3-point lead and six minutes left.'],
          x: 'From midfield-ish spots the net gain of a punt is small; the touchback (to the 20 on a scrimmage kick) caps the upside. Teams measure punters by "inside-20" rate, not raw distance, in these spots.',
        },
      },
      {
        title: 'Option 2: field goal',
        cam: { x: 90, y: 26.67, w: 76 },
        los: LOS, fd: null, ball: false,
        players: FG, routes: fgR, zones: [],
        marks: [
          { id: 'fgm', type: 'measure', x1: 65, x2: 120, y: 50, t: '≈ 55-yard attempt (38 + 10 end zone + 7 hold)' },
        ],
        l3: { k: 'Option 2', t: 'Field goal: ~55 yards', s: 'Make it: lead by 6. Miss it: Jets ball at the spot of the kick' },
        notes: {
          p: ['Field-goal distance = line of scrimmage + 10 yards of end zone + about 7 yards for the snap and hold. 38 + 17 = a 55-yarder.',
            'Make it and we lead 23–17. But 6 points is still a one-score game: a Jets touchdown plus the extra point wins it for them.',
            'Miss it and the Jets take over at the spot of the kick, around their 45. That\'s great field position for them.',
            'A 55-yarder is makeable for a strong leg, but far from automatic.'],
          a: 'Like a long three-pointer in basketball: worth it if your shooter is hot, costly if it clanks.',
          x: 'Missed FG from beyond the receivers\' 20: ball goes to the receivers at the spot of the kick, not the line of scrimmage (Rule 11-4-2-b). That 7-yard difference is part of the cost.',
        },
      },
      {
        title: 'Option 3: go for it',
        cam: { x: 74, y: 26.67, w: 70 },
        los: LOS, fd: 74, ball: false,
        players: GO, routes: goR, zones: [],
        marks: [{ id: 's-meas', type: 'measure', x1: 72, x2: 74, y: 50.5, t: '2 yards' }],
        sfx: { n: 'hit', at: 1500 },
        l3: { k: 'Option 3', t: 'Go for it', s: 'Convert: drive continues. Fail: Jets ball at their own 38' },
        notes: {
          p: ['Keep the offense on the field and run a real play. Here: a quick slant to the outside receiver, ball out in under a second.',
            'Gain 2 yards and it\'s a new set of downs. We keep the ball, keep the clock running and can still score more.',
            'Fail, and it\'s a "turnover on downs": the Jets get the ball right here at their 38.',
            'Short-yardage plays are designed to be quick and safe: slants, QB sneaks, power runs.'],
          a: 'Going for it is doubling down at blackjack: you only do it when the odds are on your side.',
          x: 'Historically, 4th-and-2 conversions land somewhere around a coin flip or better, and keeping possession has a large win-probability value. Models compare expected points / win probability for all three options.',
        },
      },
      {
        title: 'The 4th-down chart',
        w: 'heat',
        bug: { hide: true },
        players: [], routes: [], marks: [], zones: [], los: null, fd: null, ball: false,
        l3: { k: 'Analytics', t: 'When to go for it', s: 'Rows: yards to go · columns: field position · color: GO / FG / PUNT' },
        notes: {
          p: ['This chart is how modern coaching staffs think about 4th down. Each square is one situation.',
            'Rows are yards to go: 4th & 1 at the top, longer distances lower down. Columns are field position, from your own end zone on the left to the opponent\'s goal line on the right.',
            'The color is the recommended call: GO for it, kick a FIELD GOAL, or PUNT.',
            'Notice how much of the chart says GO on short yardage, even in your own half. Ten years ago almost every team punted there.',
            'Analytics have pushed teams to go for it far more often. The coach still adjusts for score, time, weather and his own kicker.'],
          x: 'These charts come from win-probability models built on decades of play-by-play. The cutoffs move with game state: trailing late, the GO region grows; leading late, coaches lean toward the safe option.',
        },
      },
      {
        title: 'Leading late: run the clock',
        bug: { hide: false, clk: '1:58', clkRun: true, pc: 40, pcRun: true, down: 1, dist: 10, poss: 'NE', toA: 1 },
        cam: { x: 82, y: 26.67, w: 66 },
        off: 'NE', los: 80, fd: 90, ball: false,
        players: RUN, routes: runR, zones: [],
        marks: [
          { id: 'ib', type: 'text', x: 84, y: 49.5, t: 'Stay IN bounds · the clock keeps running', size: 1.3, c: 'y' },
        ],
        l3: { k: 'Clock management', t: 'Leading? Burn the clock', s: 'Run the ball, stay in bounds, snap with the play clock near 0' },
        notes: {
          p: ['Now we\'re ahead late. The game clock is our friend: every second that runs off is one the Jets can\'t use.',
            'So we run the ball. A tackle in the field of play keeps the clock running. Incomplete passes and stepping out of bounds stop it.',
            'Between plays the offense waits until the play clock is almost at zero before snapping: up to 40 seconds burned per play.',
            'The defense\'s only weapon is its timeouts, which stop the clock and save time.'],
          a: 'Like holding the ball near the corner flag in soccer, except here it\'s fully legal and expected.',
          x: 'After the 2:00 warning of the 2nd half (and inside the last 5:00) the clock does not restart on the ready signal after a runner goes out of bounds; it waits for the snap (Rule 4-3-2-a). Hence "stay in bounds".',
        },
      },
      {
        title: 'Victory formation',
        bug: { clk: '1:25', clkRun: true, pc: 40, pcRun: true, down: 1, dist: 10, toA: 0 },
        cam: { x: 82, y: 26.67, w: 56 },
        off: 'NE', los: 83, fd: 93, ball: false,
        players: VIC, routes: vicR, zones: [],
        marks: [{ id: 'kn', type: 'circle', x: 80.3, y: M, r: 1.8, c: 'y', pulse: true }],
        l3: { k: 'Game over', t: 'Take a knee', s: 'Jets out of timeouts: three kneel-downs end the game' },
        notes: {
          p: ['This is the victory formation. The QB takes the snap and immediately drops to a knee: the play is dead right there.',
            'Everyone else packs in tight to protect him, with one player deep as a safety in case of a fumble.',
            'Each kneel uses a down and lets the clock run. With the Jets out of timeouts, three kneels and ~40-second play clocks between them burn about two minutes.',
            'It\'s the most boring play in football, and the happiest one if you\'re winning.'],
          a: 'It\'s running out the clock in chess when you\'re up a queen: no need to make another move than necessary.',
          x: 'Rule 7-2-1-c: the ball is dead when the QB immediately drops (or simulates dropping) to his knee. The defense is expected not to charge hard into a kneel.',
        },
      },
      {
        title: 'Trailing: the two-minute drill',
        bug: { hs: 20, as: 17, clk: '1:12', clkRun: false, pc: 40, pcRun: false, down: 1, dist: 10, poss: 'NYJ', toA: 2 },
        cam: { x: 70, y: 26.67, w: 72 },
        off: 'NYJ', los: 80, fd: 70, ball: false,
        players: TWO, routes: twoR, zones: [],
        marks: [
          { id: 'oob', type: 'text', x: 70, y: 56.4, t: 'OUT OF BOUNDS = CLOCK STOPS', size: 1.3, c: '#fca5a5' },
        ],
        l3: { k: 'Flip it: Jets trail by 3', t: 'The two-minute drill', s: 'Sideline throws · no huddle · spikes · timeouts', team: 'NYJ' },
        notes: {
          p: ['Flip the situation: now the Jets trail by 3 with 1:12 left and the ball at their own 30. Everything reverses.',
            'Throw toward the sideline and get out of bounds: the clock stops. Catches in the middle keep it running.',
            'No huddle: the QB calls the play at the line so they can snap fast. That\'s the "hurry-up" or two-minute drill.',
            'Out of timeouts? The QB can "spike" the ball into the ground right after the snap. It costs a down but stops the clock.',
            'They only need a field goal to tie and force overtime, so the goal is to reach kicker range with time left.'],
          a: 'It\'s the last-minute dash through the airport: no stopping, take the fastest lanes, and use your few "skip the line" passes (timeouts) wisely.',
          x: 'Spiking is legal intentional grounding only if the QB throws it down immediately after the snap (Rule 8-2-1 Item 3); a delayed spike is a foul.',
        },
      },
      {
        title: 'Replay: "The Tackle"',
        bug: { hide: true },
        players: [], routes: [], marks: [], zones: [], los: null, fd: null, ball: false,
        l3: null,
        ov: [{ id: 'vid', type: 'video', pos: 'c', yt: 'jones', k: 'Replay · Super Bowl XXXIV · Jan 30, 2000', t: '"The Tackle"', s: 'Rams 23, Titans 16 · last play · one yard short' }],
        notes: {
          p: ['The most famous last play in Super Bowl history. Rams lead 23–16, Titans have the ball at the Rams\' 10 with 6 seconds left.',
            'Titans receiver Kevin Dyson catches a slant and races toward the goal line.',
            'Rams linebacker Mike Jones wraps him up at the 1. Dyson stretches the ball out, but he\'s down. Time expires.',
            'One yard and zero seconds. That\'s why every timeout, every step out of bounds and every snap of the clock matters.'],
          x: 'Super Bowl XXXIV, January 30, 2000, Georgia Dome. The Titans needed a TD and the extra point just to force overtime.',
        },
      },
    ],
  });
})(window.FD);
