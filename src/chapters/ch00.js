/* Chapter 0 — Cold Open: Gillette at night → 4th-quarter Patriots drive → TD → title card */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;

  // Drive: NE trails 17–20, ball on NE 25 (x=35), 2:00 left in the 4th.
  const o1 = F.off(35, { pers: '11' });
  const d1 = F.def(35, { front: 'nickel', cov: '3' });
  const p1 = [R.make(o1, 'Z', [[12, 0], [14, -3]], { move: true, delay: 300, dur: 1100, c: 'r' }), R.make(o1, 'X', 'slant'), R.make(o1, 'H', 'seam'), R.make(o1, 'TE', 'flat'), ...R.blocks(o1, R.OL, 0.8)];
  const z1 = F.get(o1, 'Z');
  const pass1 = { id: 'pass1', k: 'pass', d: [[F.get(o1, 'QB').x, M], [z1.x + 14, z1.y - 3]], delay: 1100, dur: 450 };

  const o2 = F.off(50, { pers: '12', set: 'under' });
  const d2 = F.def(50, { front: '43', cov: '3' });
  const run2 = R.abs(o2, 'RB', [[47, M + 1], [51, M + 3.5], [57, M + 5], [62, M + 4]], { k: 'run', move: true, curve: true, delay: 350, dur: 1500 });

  const o3 = F.off(62, { pers: '11' });
  const d3 = F.def(62, { front: 'nickel', cov: '1' });
  const post = R.make(o3, 'X', [[10, 0], [24, 6], [50, 11]], { move: true, delay: 300, dur: 1900, c: 'r' });
  const pass3 = { id: 'pass3', k: 'pass', d: [[F.get(o3, 'QB').x, M], [post.d[3][0], post.d[3][1]]], delay: 1250, dur: 900, lift: 0.18 };

  FD.CH.push({
    title: 'Cold Open', sub: 'Foxborough, 4th quarter, 2:00 to go',
    base: { cam: { x: 60, y: 26.67, w: 132 } },
    steps: [
      {
        title: 'Gillette Stadium, Foxborough',
        photo: { key: 'photo_gillette', dim: 0.15, over: true },
        bug: { reset: true, hide: true },
        ov: [{ id: 'open', type: 'big', pos: 'c', k: 'Foxborough, Massachusetts', t: 'Sunday Night', s: 'Patriots vs Jets · 4th quarter · 2:00 to go' }],
        sfx: ['cheer'],
        notes: {
          p: ['Welcome. Tonight you are going to learn football the way TV explains it: on the field, one play at a time.',
            'This is Gillette Stadium, home of the New England Patriots since 2002.',
            'Our story game: Patriots vs. Jets, the AFC East "Border War". Patriots trail 20–17 with two minutes left.',
            'Don\'t worry about understanding everything in the next 30 seconds. Just watch. We will decode all of it.'],
          a: 'Think of the next minute as the movie trailer. The rest of the talk is the movie.',
          x: 'Gillette opened in 2002, replacing Foxboro Stadium; the Patriots have played in Foxborough since 1971.',
        },
      },
      {
        title: 'Two-minute drill begins',
        photo: null,
        bug: { hide: false, hs: 17, as: 20, q: '4TH', clk: '2:00', pc: 40, down: 1, dist: 10, poss: 'NE', toH: 2, toA: 1 },
        cam: { x: 52, y: 26.67, w: 84 }, los: 35, fd: 45, lbl: true,
        players: [...o1, ...d1],
        l3: { k: '4th quarter · 2:00 · NE 25', t: 'Patriots need a touchdown', s: 'Down by 3 · 75 yards to go · 2 timeouts left' },
        auto: 2600,
        notes: {
          p: ['Navy circles are the Patriots on offense. White X\'s are the Jets defense.',
            'Blue line = where the play starts. Yellow line = where the Patriots need to get for a new set of downs.',
            'Top of the screen: the score bug. NE 17, NYJ 20, 2:00 left, 1st down and 10.'],
          a: 'The two-minute drill is the sport\'s version of a last-lap sprint.',
          x: 'With 2 timeouts and the two-minute warning already used, NE can stop the clock twice; sideline throws stop it too.',
        },
      },
      {
        title: 'Play 1: out route, +15',
        routes: [...p1, pass1],
        players: [...o1, ...d1],
        bug: { clk: '1:52', pc: null },
        l3: { k: '1st & 10 · NE 25', t: 'Out route: +15', s: 'Catch and step out of bounds: the clock stops' },
        sfx: [{ n: 'hit', at: 1600 }],
        auto: 2900,
        notes: { p: ['Quarterback drops back, receiver (Z) runs 14 yards and breaks toward the sideline.', 'Catch, then step out of bounds: the clock stops. Smart football.'], a: 'Running out of bounds is like hitting pause on the game clock.', x: 'Out of bounds stops the game clock. Normally it restarts on the referee\'s ready-for-play signal, but in the last 2:00 of the 1st half and the last 5:00 of the 2nd half it stays stopped until the snap (Rule 4-3).' },
      },
      {
        title: 'Play 2: run, +12',
        cam: { x: 62, y: 26.67, w: 84 }, los: 50, fd: 60,
        players: [...o2, ...d2], routes: [run2, ...R.blocks(o2, [...R.OL, 'TE', 'TE2'], 1.5, 1)],
        bug: { clk: '1:31', down: 1, dist: 10 },
        l3: { k: '1st & 10 · NE 40', t: 'Run: +12', s: 'Clock keeps running: hurry to the line' },
        sfx: [{ n: 'hit', at: 900 }, { n: 'hit2', at: 1700 }],
        auto: 2900,
        notes: { p: ['Running back takes the handoff and follows his blockers. 12 more yards.', 'He stays in bounds, so the clock keeps running. The Patriots hurry to the line.'], a: 'The blockers are the snowplow; the running back is the car right behind it.', x: 'Outside zone action: the line steps to the right in unison and the back reads the end-man for his cut.' },
      },
      {
        title: 'Play 3: deep post…',
        cam: { x: 85, y: 26.67, w: 90 }, los: 62, fd: 72,
        players: [...o3, ...d3], routes: [post, pass3, R.make(o3, 'Z', 'curl'), R.make(o3, 'H', 'out5'), R.make(o3, 'TE', 'seam'), ...R.blocks(o3, R.OL, 0.7)],
        bug: { clk: '0:38', down: 1, dist: 10, toH: 1 },
        l3: { k: '1st & 10 · NYJ 48', t: 'Deep post…', s: 'One deep safety. The receiver runs right at him' },
        notes: { p: ['First down at the Jets 48. The X receiver runs a deep post: straight up the field, then breaks toward the goal posts.', 'The quarterback throws it before the receiver even makes his break: timing.'], a: 'A post route is aimed like a dart at the goal posts.', x: 'Cover 1 look: single-high safety; post vs. the middle-of-field safety relies on leverage and ball placement.' },
      },
      {
        title: 'TOUCHDOWN',
        photo: { key: 'photo_gillette_fw', dim: 0.25, over: true, kb: false },
        bug: { hs: 23, msg: 'TOUCHDOWN', down: null, clk: '0:31' },
        ov: [{ id: 'td', type: 'big', pos: 'c', k: 'Patriots 23 · Jets 20', t: 'TOUCHDOWN!', c: '#fff' }],
        l3: null, sfx: ['roar'],
        notes: { p: ['Touchdown Patriots! Six points. Patriots lead 23–20.', 'In the next hour, every single thing you just saw will make sense: the lines, the numbers, the routes, the clock.'], a: 'You just watched your first drive. Now we learn the rules of the road.', x: 'They still have a try (extra point or 2-point conversion) to add.' },
      },
      {
        title: 'Football, Decoded',
        photo: { key: 'photo_gillette_fw2', dim: 0.62, over: true },
        players: [], routes: [], los: null, fd: null, cam: { x: 60, y: 26.67, w: 132 },
        bug: { hs: 24, msg: null, down: null, clk: '', pc: null, q: 'FINAL' },
        ov: [{ id: 'title', type: 'title', pos: 'c', k: 'A New England field guide to the NFL', t: 'Football, Decoded', s: 'From total beginner to Sunday-ready fan', menu: true }],
        sfx: ['cheer'],
        notes: {
          p: ['Patriots win 24–20 after the extra point. That\'s our title card.',
            'Here\'s the menu. We go from the field, to scoring, time, downs (the heart of it), players, plays, defense, special teams, penalties, strategy, the season, and how to watch.',
            'Shortcut keys for me: M opens this menu any time, D skips the expert "Film Room" parts.'],
          a: 'Like learning a board game: board first, then how you win, then the moves.',
          x: 'Everything here follows the 2026 NFL rulebook; college differences are tagged as we go.',
        },
      },
    ],
  });
})(window.FD);
