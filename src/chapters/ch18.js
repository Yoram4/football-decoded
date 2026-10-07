/* Chapter 18 — Quiz: 5 game situations, pick an answer, animated reveal */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;
  const q1o = F.off(40, { pers: '12', set: 'under' }), q1d = F.def(40, { front: '43', cov: '3' });
  const q1run = R.abs(q1o, 'RB', [[39, M + 0.5], [42.5, M + 2], [44, M + 1.6]], { k: 'run', move: true, curve: true, delay: 200, dur: 1000 });
  const q2o = F.off(70, { pers: '11', set: 'under' }), q2d = F.def(70, { front: '43', cov: '1' });
  const q5o = F.off(65, { pers: '11' }), q5d = F.def(65, { front: 'nickel', cov: '1', press: true });
  const ask = (n, q, opts, ans, why, reveal) => ({ name: 'quiz', n, of: 5, q, opts, ans, why, reveal });

  FD.CH.push({
    title: 'Live Quiz', sub: '5 game situations: you make the call',
    base: { cam: { x: 50, y: M, w: 100 } },
    steps: [
      {
        title: 'Q1: down & distance',
        bug: { reset: true, hs: 14, as: 10, q: '2ND', clk: '6:30', pc: 40, down: 1, dist: 10, poss: 'NE' },
        los: 40, fd: 50, lbl: true, players: [...q1o, ...q1d], routes: [], marks: [],
        cam: { x: 46, y: M, w: 96 },
        w: ask(1, 'Patriots: **1st & 10** at their own 30. The run gains **4 yards**. What does the score bug say next?',
          ['2nd & 6', '1st & 6', '2nd & 10', '3rd & 6'], 0,
          'The down goes up by one and the distance shrinks by the gain: 10 − 4 = 6. The yellow line does not move.',
          { routes: [q1run], los: 44, bug: { ...FD.BUG0, hs: 14, as: 10, q: '2ND', clk: '6:02', pc: 40, down: 2, dist: 6, poss: 'NE' }, players: [...q1o, ...q1d] }),
        notes: { p: ['Pick A–D (tap an answer or press 1–4), then → to reveal.', 'Warm-up question: get this one and you understand downs.'], x: 'Line to gain stays fixed for the series (3-8-3).' },
      },
      {
        title: 'Q2: 4th-down call',
        los: 70, fd: 71, players: [...q2o, ...q2d], routes: [], marks: [],
        cam: { x: 70, y: M, w: 96 },
        bug: { down: 4, dist: 1, clk: '9:10', hs: 17, as: 17 },
        w: ask(2, '**4th & 1** at the **Jets 40**, tied, 2nd quarter. What do modern analytics say?',
          ['Punt', 'Kick a 57-yard field goal', 'Go for it', 'Call a timeout and punt'], 2,
          'One yard is converted most of the time, and the field position is too good to punt but too far for a reliable kick. Go for it.',
          { marks: [{ id: 'go', type: 'text', x: 70, y: 12, t: 'GO FOR IT', size: 2.4, c: '#22c55e', cls: 'hd' }], routes: [R.abs(q2o, 'QB', [[71.2, M - 0.4]], { k: 'run', move: true, delay: 200, dur: 700 })] }),
        notes: { p: ['This one splits fans. Old-school answer: punt. Analytics answer: go.', 'It\'s the same logic as the 4th-down heatmap in the Strategy chapter.'], x: '4th & 1 conversion rates sit around 70% league-wide in recent seasons; QB sneaks even higher.' },
      },
      {
        title: 'Q3: the last-play touchdown',
        los: null, fd: null, players: [], routes: [],
        cam: { x: 100, y: M, w: 60 },
        bug: { hs: 20, as: 20, q: '4TH', clk: '0:00', down: null, dist: null, msg: 'TOUCHDOWN' },
        marks: [{ id: 'ez', type: 'rect', x: 110, y: 0, w: 10, h: 53.33, c: 'y', op: 0.2, pulse: true }],
        w: ask(3, 'Patriots trailed **20–14** and just scored a touchdown **as time expired**. Now it\'s 20–20 with 0:00 on the clock. What happens?',
          ['Game over: it\'s a tie', 'The Patriots still get the try (kick) to win', 'Straight to overtime', 'The Jets get one last play'], 1,
          'A period ends only when the down is over, and the try is still played because it can change the result (Rule 4-8-2-c). Make the kick, win 21–20.',
          { routes: [{ id: 'k', k: 'kick', d: [[88, M], [120, M]], c: 'y', lift: 0.08, dur: 900 }], bug: { ...FD.BUG0, hs: 21, as: 20, q: 'FINAL', clk: '', msg: null } }),
        notes: { p: ['This one combines the Time chapter and the Scoring chapter.', 'If the try could NOT change the result (e.g., they were already winning), it\'s skipped today.'], x: '4-8-2-c: try skipped only when a TD in the final down of the 4th makes the try irrelevant (not in sudden death).' },
      },
      {
        title: 'Q4: kickoff into the end zone',
        bug: { msg: 'KICKOFF', hs: 7, as: 0, q: '1ST', clk: '11:14', poss: 'NYJ', down: null, dist: null },
        los: null, fd: null, players: [], routes: [], cam: { x: 85, y: M, w: 96 },
        marks: [{ id: 'lz', type: 'rect', x: 90, y: 0, w: 20, h: 53.33, c: 'y', op: 0.15, lbl: 'LANDING ZONE', size: 1.6 }, { id: 'kk', type: 'ball', x: 45, y: M }],
        w: ask(4, 'Patriots kick off. The ball flies **into the end zone without touching the ground** and the returner takes a knee. Where do the Jets start?',
          ['Their 20', 'Their 25', 'Their 30', 'Their 35'], 3,
          'Under the current kickoff rules, a kick into the end zone in the air is a touchback at the 35 (a kick that lands in the landing zone first and then goes in comes out to the 20).',
          { routes: [{ id: 'ko', k: 'kick', d: [[45, M], [114, M + 2]], c: 'y', lift: 0.08, dur: 900 }], marks: [{ id: 'tb', type: 'rect', x: 74.5, y: 0, w: 1, h: 53.33, c: 'b', op: 0.7, stroke: false }, { id: 'tbt', type: 'text', x: 75, y: 6, t: 'BALL ON THE NYJ 35', size: 1.8, c: 'b' }] }),
        tags: ['NEW RULE (2025): touchback to the 35'],
        notes: { p: ['This is one of the newest rules: it changed in 2025 (from the 30).', 'Designed to make kickers keep the ball in play so we get more returns.'], x: '6-1-5: 35 if the kick goes into the end zone without first touching the landing zone; 20 if it touched the landing zone first.' },
      },
      {
        title: 'Q5: flag on 3rd down',
        bug: { msg: null, poss: 'NE', hs: 21, as: 17, q: '3RD', clk: '4:44', down: 3, dist: 9, flag: false },
        los: 65, fd: 74, lbl: true, players: [...q5o, ...q5d], routes: [], cam: { x: 65, y: M, w: 96 }, marks: [],
        w: ask(5, 'Patriots **3rd & 9**. The pass falls incomplete, but there\'s a flag: **defensive holding**. What happens?',
          ['Replay 3rd down, 5 yards closer (3rd & 4)', '5 yards AND an automatic first down', '10 yards, replay the down', 'Loss of down for the defense'], 1,
          'Defensive holding is only 5 yards, but it gives an automatic first down: drive alive. That\'s why "defensive holding on 3rd down" is a big deal.',
          { marks: [{ id: 'fl', type: 'flag', x: 72, y: 12 }], los: 70, fd: 80, bug: { ...FD.BUG0, poss: 'NE', hs: 21, as: 17, q: '3RD', clk: '4:39', down: 1, dist: 10, flag: true } }),
        notes: { p: ['Last question: penalties.', 'Defensive fouls (other than offside-type and delay/too-many-men) carry an automatic first down.'], x: '12-1-6 + 14-1-2 Item 5 (2026 book): defensive fouls give a first down except listed exceptions.' },
      },
      {
        title: 'Quiz results',
        w: null, players: [], routes: [], marks: [], los: null, fd: null, cam: { x: 60, y: M, w: 132 },
        bug: { flag: false, msg: null },
        ov: [{ id: 'res', type: 'big', pos: 'c', k: 'Score yourself', t: '5 / 5 = Sunday-ready', s: '3–4: solid fan · 0–2: rewatch the downs chapter 😉' }],
        notes: { p: ['How many did you get: 5? 4? 3?', 'If you got Q1, you understand the single most important rule.'], x: 'Want more? The glossary (G) links every term back to its chapter.' },
      },
    ],
  });
})(window.FD);
