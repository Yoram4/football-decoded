/* Chapter 4 — Time */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;

  // Step 2–3: NE ball at its own 25 (x 35)
  const o2 = F.off(35, { wide: 15 }), d2 = F.def(35, { front: '43', wide: 15 });
  const run3 = R.abs(o2, 'RB', [[33, M + 1], [36, M - 0.5], [40, M - 1]], { k: 'run', move: true, curve: true, delay: 300, dur: 1100 });
  const tackle3 = R.abs(d2, 'MIKE', [[40.8, M - 0.8]], { move: true, delay: 700, dur: 700 });

  // Step 4: 2nd & 5 at the NE 30 (x 40), overthrown go route (strong side up)
  const o4 = F.off(40, { wide: 15, strong: -1 }), d4 = F.def(40, { front: 'nickel', wide: 15, strong: -1 });
  const qb4 = F.get(o4, 'QB'), z4 = F.get(o4, 'Z');
  const go4 = R.make(o4, 'Z', [[12, 0]], { move: true, delay: 300, dur: 1100 });

  // Step 5: 3rd & 5, out route and step out of bounds at the bottom sideline
  const o5 = F.off(40, { wide: 15 }), d5 = F.def(40, { front: 'nickel', wide: 15 });
  const qb5 = F.get(o5, 'QB');
  const out5 = R.abs(o5, 'Z', [[45, 41.7], [45.5, 47.5], [46.5, 55]], { move: true, c: 'r', delay: 300, dur: 1500 });

  // Step 6: 1st & 10 at the NE 36 (x 46)
  const o6 = F.off(46, { wide: 15 }), d6 = F.def(46, { front: 'nickel', wide: 15 });
  // Step 7: NE 50
  const o7 = F.off(60, { wide: 15 }), d7 = F.def(60, { front: '43', wide: 15 });

  // Step 8: 0:03 left, Hail Mary from the NYJ 40 (x 70)
  const o8 = F.off(70, { wide: 15 }), d8 = F.def(70, { front: 'dime', cov: '4', wide: 15 });
  const qb8 = F.get(o8, 'QB');
  const hm = [
    R.abs(o8, 'X', [[92, M - 17], [106, M - 8]], { move: true, delay: 300, dur: 2000 }),
    R.abs(o8, 'Z', [[95, M + 14], [105, M + 9]], { move: true, delay: 300, dur: 2000 }),
    R.abs(o8, 'H', [[94, M - 9], [107, M - 4]], { move: true, delay: 300, dur: 2000, c: 'r' }),
    R.make(o8, 'TE', 'seam'), ...R.blocks(o8, R.OL, 0.5),
    { id: 'bf8', p: 'BALL', k: 'pass', d: [[qb8.x, qb8.y], [107.5, M - 5]], move: true, delay: 1300, dur: 1100, lift: 0.18 },
  ];
  // Step 9: untimed down after 5-yard defensive holding (x 75)
  const o9 = F.off(75, { wide: 15 }), d9 = F.def(75, { front: 'dime', cov: '4', wide: 15 });

  const stopPanel = (hl) => ({ id: 'stops', type: 'panel', pos: 'r', k: 'The game clock stops on…', t: 'Clock stoppers', num: true, hl,
    items: ['Incomplete pass', 'Runner out of bounds', 'Any score', 'Timeout', 'Penalty flag', 'Change of possession', 'Two-minute warning'] });

  FD.CH.push({
    title: 'Time', sub: 'Quarters, the two clocks, timeouts, overtime',
    base: { cam: { x: 60, y: 26.67, w: 132 } },
    steps: [
      {
        title: 'Four quarters',
        bug: { reset: true, hs: 0, as: 0, q: '1ST', clk: '15:00', poss: 'NE', pc: null, down: null, dist: null },
        cam: { x: 60, y: 26.67, w: 132 }, los: null, fd: null, ball: false, lbl: false,
        players: [], routes: [], marks: [],
        ov: [{ id: 'q4', type: 'panel', pos: 'c', k: 'Rule 4 · Game timing', t: '60 minutes', items: [
          '**4 quarters × 15:00** of game-clock time',
          '**Halftime** (13 min) after the 2nd quarter',
          'Teams **switch ends** after the 1st and 3rd quarters',
          'The clock stops a lot: a game takes about **3 hours**'] }],
        l3: { k: 'Game timing', t: '4 × 15 minutes', s: 'Two halves of two quarters each' },
        notes: {
          p: ['A game is 60 minutes of clock time: four 15-minute quarters (Rule 4-1-1).',
            'Short breaks between quarters (at least 2 minutes), and a 13-minute halftime between the 2nd and 3rd quarters (4-1-2, 4-1-3).',
            'Teams switch ends after the 1st and 3rd quarters so nobody keeps the wind advantage (4-2-3).',
            'Because the clock stops so often, 60 minutes of football takes roughly three hours on TV.'],
          a: 'Like a basketball game: the clock only counts "live" time, so the real-world time is much longer.',
          x: 'When ends switch, possession, down, distance and ball position all carry over (4-2-3). The halves are separate for timeouts (3 each).',
        },
      },
      {
        title: 'Game clock vs play clock',
        cam: { x: 42, y: 27.5, w: 90 }, los: 35, fd: 45, lbl: true, ball: null, off: 'NE',
        players: [...o2, ...d2], routes: [], marks: [],
        bug: { q: '1ST', clk: '14:20', down: 1, dist: 10, pc: 40, pcRun: true, clkRun: false },
        ov: [{ id: 'ck', type: 'clock', pos: 'r', game: '14:20', gs: 'Counts down the quarter', play: 40, ps: 'Snap before it hits 0', run: true }],
        l3: { k: 'Two clocks', t: 'Game clock vs play clock', s: '40 seconds from the end of a play to the next snap' },
        notes: {
          p: ['There are two clocks. The big one is the game clock: 15:00 per quarter.',
            'The small one is the play clock: the offense has 40 seconds from the end of the previous play to snap the ball (Rule 4-6-1).',
            'After some stoppages (timeout, penalty, change of possession, two-minute warning) it\'s set to 25 seconds instead (4-6-2).',
            'Let it hit zero and it\'s delay of game: 5-yard penalty (4-6-5 Penalty).'],
          a: 'The game clock is the length of the exam; the play clock is how long you get per question.',
          x: 'Watch the play clock on the bug: offenses that snap with :01 left are burning clock on purpose; hurry-up teams snap at :25+.',
        },
      },
      {
        title: 'Tackled in bounds: clock runs',
        cam: { x: 42, y: 27.5, w: 90 }, los: 35, fd: 45, lbl: true, ball: null,
        players: [...o2, ...d2],
        routes: [run3, tackle3, ...R.blocks(o2, R.OL, 1.2, -0.5)],
        marks: [],
        bug: { clk: '14:00', pc: null, pcRun: false, clkRun: true },
        sfx: [{ n: 'hit', at: 1400 }],
        tags: ['COLLEGE: clock briefly stops on a 1st down in the last 2:00 of each half'],
        l3: { k: 'Run play · +5', t: 'Tackled in bounds', s: 'Runner down inside the field: the game clock keeps running' },
        notes: {
          p: ['Run for 5, tackled in the middle of the field. Nothing on the "stop" list happened.',
            'So the game clock keeps running between plays, and the play clock starts its 40 seconds (4-6-1).',
            'This is the clock-killing play: teams with a lead run the ball and stay in bounds.'],
          x: 'Huddling and snapping late after an in-bounds run can burn about 40 seconds per play; that\'s the "four-minute offense".',
        },
      },
      {
        title: 'Incomplete pass: clock stops',
        cam: { x: 42, y: 27.5, w: 90 }, los: 40, fd: 45, lbl: true, ball: false,
        players: [...o4, ...d4, F.ball(qb4.x, qb4.y)],
        routes: [go4, R.make(o4, 'X', 'curl'), R.make(o4, 'H', 'out5'), R.make(o4, 'TE', 'flat'), ...R.blocks(o4, R.OL, 0.6),
          { id: 'bf4', p: 'BALL', k: 'pass', d: [[qb4.x, qb4.y], [z4.x + 15, z4.y - 1.5]], move: true, delay: 900, dur: 650 }],
        marks: [{ id: 'inc', type: 'text', x: z4.x + 15, y: z4.y + 4, t: 'INCOMPLETE', size: 1.6, c: '#fca5a5', delay: 1600 }],
        bug: { down: 2, dist: 5, clk: '13:31', clkRun: false },
        ov: [stopPanel(0)],
        l3: { k: '2nd & 5', t: 'Incomplete: clock stops', s: 'It restarts on the next snap' },
        notes: {
          p: ['Pass falls incomplete: the game clock stops (4-4-f).',
            'It doesn\'t restart until the next snap (4-3-2). That\'s why trailing teams throw a lot late in games.',
            'Here\'s the full list of clock stoppers. Each one is in Rule 4-4.'],
          a: 'Incomplete pass = pause button, and only the next snap presses play.',
          x: 'Clock stops also include the end of a down with a free kick, a ball dead on/behind a goal line, and any official\'s timeout (4-4-a, d, j).',
        },
      },
      {
        title: 'Out of bounds',
        cam: { x: 52, y: 33, w: 80 }, los: 40, fd: 45, lbl: true, ball: false,
        players: [...o5, ...d5, F.ball(qb5.x, qb5.y)],
        routes: [out5, R.make(o5, 'X', 'curl'), R.make(o5, 'H', 'slant'), R.make(o5, 'TE', 'flat'), ...R.blocks(o5, R.OL, 0.6),
          { id: 'bf5', p: 'BALL', k: 'pass', d: [[qb5.x, qb5.y], [45.5, 47.5]], move: true, delay: 1000, dur: 450 }],
        marks: [
          { id: 'oob-r', type: 'rect', x: 25, y: 53.33, w: 28, h: 1.6, c: 'r', op: 0.35, stroke: false },
          { id: 'oob-t', type: 'text', x: 38, y: 51.8, t: 'OUT OF BOUNDS = CLOCK STOPS', size: 1.2, c: '#fca5a5', delay: 1700 },
        ],
        bug: { down: 3, dist: 5, clk: '13:24', clkRun: false },
        ov: [stopPanel(1)],
        l3: { k: '3rd & 5 · catch and step out', t: 'Out of bounds', s: 'Restarts at the ready signal, except late in each half' },
        notes: {
          p: ['Catch, then get out of bounds: the clock stops (4-4-c).',
            'Most of the game it\'s only a short pause: the clock restarts when the referee spots the ball and signals ready for play.',
            'Exception: after the two-minute warning of the 1st half and inside the last 5:00 of the 2nd half, it stays stopped until the snap (4-3-2-a).',
            'That\'s why you see receivers dive for the sideline late in close games.'],
          x: 'After a change of possession the clock also waits for the snap (4-3-2-a-1). Fumbles out of bounds restart on the ready signal (4-3-2-f).',
        },
      },
      {
        title: 'Timeouts',
        cam: { x: 50, y: 27.5, w: 90 }, los: 46, fd: 56, lbl: true, ball: null,
        players: [...o6, ...d6], routes: [], marks: [],
        bug: { down: 1, dist: 10, clk: '13:17', toA: 2, pc: 25, pcRun: false },
        ov: [{ id: 'sg6', type: 'signal', pos: 'r', sig: 6, name: 'Timeout', desc: 'Either team can stop the clock', extra: '3 per half · 2 in regular-season OT' }],
        sfx: ['whistle'],
        l3: { k: 'Jets call timeout', t: '3 timeouts per half', s: 'Watch the pips on the score bug: Jets now have 2' },
        notes: {
          p: ['Each team gets 3 timeouts per half, and 2 in a regular-season overtime (4-5-1 Item 1).',
            'A timeout stops the game clock; after it, the play clock is set to 25 seconds (4-6-2-b).',
            'On the score bug the little bars under each team are the timeouts left. The Jets just used one.',
            'Coaches save them for the end of the half: every timeout is like 40 free seconds.'],
          x: 'You can\'t take two timeouts in the same dead-ball period; an "icing" second timeout before a kick is unsportsmanlike (4-5-1 Items 3–4). Unused first-half timeouts don\'t carry over.',
        },
      },
      {
        title: 'Two-minute warning',
        cam: { x: 62, y: 27.5, w: 90 }, los: 60, fd: 70, lbl: true, ball: null,
        players: [...o7, ...d7], routes: [], marks: [],
        bug: { q: '2ND', clk: '2:00', pc: null, msg: '2-MINUTE WARNING' },
        ov: [{ id: '2mw', type: 'panel', pos: 'r', k: 'Automatic timeout', t: 'Two-minute warning', items: [
          'After the last play snapped **before 2:00** of the 2nd and 4th quarters',
          'Play clock resets to **25**',
          'Out of bounds now holds the clock until the snap'] }],
        sfx: ['whistle'],
        l3: { k: '2nd quarter', t: 'Two-minute warning', s: 'A free stoppage near the end of each half' },
        notes: {
          p: ['The two-minute warning is an automatic timeout at the end of the last play snapped before 2:00 in the 2nd and 4th quarters (3-41).',
            'It\'s basically a free fourth timeout for both teams, and a TV commercial break.',
            'From here to halftime, out of bounds keeps the clock stopped until the snap (4-3-2-a). In the 4th quarter that rule starts earlier, at 5:00.',
            'Also: after the two-minute warning, a team can\'t stop the clock on purpose by committing a foul; that costs 5 yards and often a 10-second runoff (4-7-1).'],
          a: 'The two-minute warning is the bell before the last lap.',
          x: 'Injury timeouts after the 2:00 warning are charged to the team if it has timeouts left (4-5-4); otherwise an excess timeout can bring a 10-second runoff.',
        },
      },
      {
        title: 'The play beats the clock',
        cam: { x: 85, y: 27.5, w: 96 }, los: 70, fd: 80, lbl: true, ball: false,
        players: [...o8, ...d8, F.ball(qb8.x, qb8.y)],
        routes: hm,
        marks: [
          { id: 'hold', type: 'flag', x: 94, y: M + 11.5, delay: 1100 },
          { id: 'hm-inc', type: 'text', x: 104, y: M - 9, t: 'INCOMPLETE', size: 1.5, c: '#fca5a5', delay: 2500 },
        ],
        bug: { q: '4TH', clk: '0:03', clkRun: true, msg: null, hs: 20, as: 24, down: 1, dist: 10, poss: 'NE', toH: 0, toA: 1, flag: false },
        sfx: [{ n: 'whistle', at: 2600 }],
        l3: { k: '4th quarter · 0:03 · NE trails 20–24', t: 'Snap before 0:00', s: 'A play that starts in time is played to the end' },
        notes: {
          p: ['New game situation: Patriots trail 24–20, 3 seconds left, ball at the Jets 40.',
            'The snap happens with time on the clock, so the play is played to the end even after the clock hits 0:00 (4-8-1).',
            'Hail Mary: incomplete... but there\'s a yellow flag. A Jets defender held a receiver.'],
          a: 'The buzzer-beater rule: if the shot (snap) is off before the buzzer, it counts.',
          x: 'A period ends only when time expires AND the ball is dead; that\'s why final plays can have laterals that go on for 30 seconds.',
        },
      },
      {
        title: 'Untimed down',
        cam: { x: 85, y: 27.5, w: 96 }, los: 75, fd: 85, lbl: true, ball: null,
        players: [...o9, ...d9], routes: [], marks: [],
        bug: { clk: '0:00', clkRun: false, flag: true },
        ov: [{ id: 'sg11', type: 'signal', pos: 'l', sig: 11, name: 'Defensive holding', yds: '5 yards', af: true, extra: 'Accepted → one untimed down' }],
        l3: { k: '0:00 · flag on the defense', t: 'One more play: untimed down', s: 'A half can\'t end on an accepted defensive foul' },
        notes: {
          p: ['Defensive holding: 5 yards and an automatic first down (12-1-6).',
            'Time has expired, but because the foul is by the defense and accepted, the offense may extend the period with one untimed down (4-8-2-a).',
            'Patriots get one more snap from the Jets 35 with 0:00 on the clock.',
            'The reverse isn\'t true: an offensive foul on the last play doesn\'t extend the period (4-8-2-b).'],
          x: 'A double foul on the last down of a half also extends it (4-8-2-h), with exceptions such as dead-ball fouls and "clean hands" turnovers.',
        },
      },
      {
        title: 'Replay: the Minneapolis Miracle',
        cam: { x: 60, y: 26.67, w: 132 }, los: null, fd: null, ball: false,
        players: [], routes: [], marks: [],
        bug: { hide: true, flag: false },
        ov: [{ id: 'vid', type: 'video', pos: 'c', yt: 'miracle', k: 'Replay · Jan 14, 2018 · NFC Divisional', t: 'The Minneapolis Miracle', s: '0:10 left → walk-off 61-yard touchdown' }],
        l3: null,
        notes: {
          p: ['The most famous "play beats the clock" moment: Vikings vs Saints, January 2018 playoffs.',
            'Vikings trailed 24–23 with 10 seconds left. Case Keenum threw to Stefon Diggs on the sideline, the tackle attempt missed, and Diggs ran it in as time expired: 61 yards.',
            'At the time, the rules still required the try. The Saints had to come back out, and the Vikings simply took a knee.',
            'Today, if a touchdown on the final play of the 4th quarter means the try can\'t change the result, the try is skipped (4-8-2-c).'],
          x: 'This game is the reason for the rule: in March 2018, two months later, the NFL dropped the try after a game-ending touchdown unless it could still change the result. The current text is 4-8-2-c.',
        },
      },
      {
        title: 'Overtime',
        cam: { x: 60, y: 26.67, w: 132 }, los: null, fd: null, ball: false,
        players: [], routes: [], marks: [],
        bug: { hide: false, q: 'OT', clk: '10:00', hs: 24, as: 24, toH: 2, toA: 2, down: null, dist: null, flag: false, msg: null, pc: null, clkRun: false },
        ov: [{ id: 'ot', type: 'compare', pos: 'c', t: 'Tied after 60 minutes', cols: [
          { t: 'Regular season', c: '#38BDF8', items: ['One **10-minute** period', 'Both teams get a possession', 'Then next score wins', 'Still tied: **the game is a tie**', '2 timeouts each'] },
          { t: 'Playoffs', c: '#FACC15', items: ['**15-minute** periods', 'Both teams get a possession', 'Then next score wins', 'Keep going until there is a **winner**', '3 timeouts per half'] },
        ] }],
        tags: ['NEW RULE (2025): both teams possess in regular-season OT', 'COLLEGE: OT from the 25, alternating possessions', 'COLLEGE: 2-point shootout from the 3rd OT on'],
        l3: { k: 'Rule 16', t: 'Overtime', s: 'Regular season can end tied; playoffs play until a winner' },
        notes: {
          p: ['Tied after four quarters: coin toss, then overtime (16-1-2).',
            'Regular season: one 10-minute period. Both teams get a chance to possess, unless the kicking team scores a safety on the first possession. After that, next score wins. Still tied at the end: it\'s a tie (16-1-3).',
            'Playoffs: 15-minute periods, both teams possess, and they keep playing until someone wins (16-1-4).',
            'Regular-season OT gives 2 timeouts each (16-1-3-e); playoff OT treats two periods as a half with 3 timeouts (16-1-4-g).'],
          a: 'Extra innings: everyone gets a turn at bat, then sudden death.',
          x: 'College is completely different: each team gets a possession from the opponent\'s 25; from the 3rd overtime on it\'s alternating 2-point tries.',
        },
      },
    ],
  });
})(window.FD);
