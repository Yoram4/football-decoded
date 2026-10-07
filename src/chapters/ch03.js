/* Chapter 3 — Objective & Scoring */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;

  // place-kick unit (NE kicking right) and Jets block unit; holder 7 yards behind the LOS
  const kickUnit = (los) => {
    const P = (id, pos, x, y, ex = {}) => ({ id: `NE-${id}`, t: 'NE', pos, x: +x.toFixed(2), y: +y.toFixed(2), ...ex });
    const l = los - 0.9;
    return [P('LS', 'LS', l, M), P('LG', 'G', l, M - 2), P('LT', 'T', l, M - 4), P('LE', 'TE', l, M - 6), P('RG', 'G', l, M + 2), P('RT', 'T', l, M + 4), P('RE', 'TE', l, M + 6),
      P('LW', 'W', los - 1.9, M - 7.3, { lbl: 'W' }), P('RW', 'W', los - 1.9, M + 7.3, { lbl: 'W' }), P('H', 'H', los - 7, M, { lbl: 'H' }), P('K', 'K', los - 9.4, M - 2, { lbl: 'K' })];
  };
  const blockUnit = (los) => [-8, -6, -4, -2, 0, 2, 4, 6, 8].map((dy, i) => ({ id: `NYJ-R${i + 1}`, t: 'NYJ', pos: 'DL', x: los + 1.2, y: +(M + dy).toFixed(2) }))
    .concat([{ id: 'NYJ-B1', t: 'NYJ', pos: 'DB', x: los + 7, y: +(M - 9).toFixed(2) }, { id: 'NYJ-B2', t: 'NYJ', pos: 'DB', x: los + 7, y: +(M + 9).toFixed(2) }]);
  const kickPlay = (los) => {
    const ku = kickUnit(los);
    return {
      players: [...ku, ...blockUnit(los), F.ball(los - 7, M)],
      routes: [
        { id: 'snap', k: 'pass', d: [[los, M], [los - 7, M]], delay: 0, dur: 280, lift: 0, arrow: false },
        R.abs(ku, 'K', [[los - 7.6, M - 0.6]], { move: true, delay: 300, dur: 350 }),
        { id: 'kick', p: 'BALL', k: 'kick', d: [[los - 7, M], [120, M]], move: true, delay: 650, dur: 1100, lift: 0.08 },
      ],
    };
  };

  // Step 1: NE ball on its own 25
  const o1 = F.off(35, { wide: 15 }), d1 = F.def(35, { front: '43', wide: 15 });

  // Step 2: goal-to-go at the NYJ 8, inside run for the TD
  const o2 = F.off(102, { pers: '12', set: 'under', wide: 11 }), d2 = F.def(102, { front: '43', cov: '0', wide: 11 });
  const run2 = R.abs(o2, 'RB', [[98.5, M + 1.5], [102.5, M + 3.2], [106, M + 3.5], [113, M + 2.5]], { k: 'run', move: true, curve: true, delay: 350, dur: 1500 });

  // Step 3: try kick from the 15 (snap at x 95)
  const k3 = kickPlay(95);

  // Step 4: 2-point try from the 2 (snap at x 108)
  const o4 = F.off(108, { wide: 11 }), d4 = F.def(108, { front: 'nickel', cov: '0', wide: 11 });
  const slant4 = R.make(o4, 'X', 'slant', { move: true, c: 'r', delay: 300, dur: 900 });
  const qb4 = F.get(o4, 'QB'), end4 = slant4.d[slant4.d.length - 1];

  // Step 5: field goal, LOS at the NYJ 20 (x 90), hold at x 83
  const k5 = kickPlay(90);

  // Step 6: NE backed up at its own 3, RB tackled in the end zone
  const o6 = F.off(13, { pers: '12', set: 'under', wide: 11 }), d6 = F.def(13, { front: '43', cov: '0', wide: 11 });

  // Step 7: safety kick from the NE 20 (x 30), dynamic-kickoff alignment
  const neKick = [{ id: 'NE-K', t: 'NE', pos: 'K', x: 29, y: M, lbl: 'K' },
    ...[4, 9, 14, 19, 24, 29.5, 34.5, 39.5, 44, 48.5].map((y, i) => ({ id: `NE-C${i + 1}`, t: 'NE', pos: '', x: 69.5, y }))];
  const nyjRet = [...[6, 14, 22, 31, 39, 47].map((y, i) => ({ id: `NYJ-F${i + 1}`, t: 'NYJ', pos: '', x: 75.5, y })),
    ...[12, M, 41].map((y, i) => ({ id: `NYJ-S${i + 1}`, t: 'NYJ', pos: '', x: 79, y: +y.toFixed(2) })),
    { id: 'NYJ-KR1', t: 'NYJ', pos: 'KR', x: 103, y: +(M - 6).toFixed(2), lbl: 'KR' }, { id: 'NYJ-KR2', t: 'NYJ', pos: 'KR', x: 103, y: +(M + 6).toFixed(2), lbl: 'KR' }];

  const CAM_RZ = { x: 100, y: 27.5, w: 64 };

  FD.CH.push({
    title: 'Objective & Scoring', sub: 'Touchdown, try, field goal, safety',
    base: { cam: { x: 60, y: 26.67, w: 132 } },
    steps: [
      {
        title: 'The objective',
        bug: { reset: true, hs: 0, as: 0, q: '1ST', clk: '15:00', poss: 'NE', down: 1, dist: 10, pc: null, msg: null },
        cam: { x: 60, y: 26.67, w: 132 },
        los: 35, fd: null, lbl: false, ball: null, off: 'NE',
        players: [...o1, ...d1], routes: [],
        marks: [
          { id: 'obj-ar', type: 'arrow', d: [[42, 47], [106, 47]], c: 'b', w: 0.5 },
          { id: 'obj-t', type: 'text', x: 74, y: 45.4, t: 'PATRIOTS ATTACK THIS WAY', size: 1.6, c: 'b', cls: 'hd' },
          { id: 'obj-ez', type: 'rect', x: 110, y: 0, w: 10, h: 53.33, c: 'y', op: 0.18, pulse: true, lbl: 'SCORE HERE', rot: 90, size: 2 },
        ],
        l3: { k: 'The objective', t: 'Reach the end zone', s: 'One team has the ball, the other defends. Then they swap.' },
        notes: {
          p: ['The whole game in one sentence: carry or catch the ball into the other team\'s end zone, and stop them from doing it to you.',
            'Only one team has the ball at a time. The Patriots attack right, toward the Jets\' end zone.',
            'Possessions alternate: after a score, the team that scored kicks the ball to the other team (Rule 11-3-4, 11-4-6). A turnover or a punt also flips possession.',
            'Highest score after 60 minutes wins (Rule 11-1-1). Let\'s see every way to put points on the board.'],
          a: 'Like a relay race where the other team is allowed to tackle the runner.',
          x: 'Rule 11-1-2 lists every scoring play: touchdown 6, field goal 3, safety 2, try 1 or 2. A forfeit is recorded 2–0 (11-1-1).',
        },
      },
      {
        title: 'Touchdown: 6 points',
        cam: CAM_RZ, los: 102, fd: null, lbl: false, ball: false,
        players: [...o2, ...d2],
        routes: [run2, ...R.blocks(o2, [...R.OL, 'TE', 'TE2'], 1.4, 1)],
        marks: [{ id: 'gl', type: 'line', x1: 110, y1: 10, x2: 110, y2: 43, c: 'y', w: 0.45 }],
        bug: { q: '1ST', clk: '9:47', down: 1, dist: 'GOAL', hs: 6, msg: 'TOUCHDOWN' },
        ov: [{ id: 'sg1', type: 'signal', pos: 'l', sig: 1, name: 'Touchdown', desc: 'Ball breaks the plane of the goal line in a player\'s possession', extra: '6 points' }],
        sfx: [{ n: 'hit', at: 900 }, { n: 'roar', at: 1800 }],
        l3: { k: '1st & goal · NYJ 8', t: 'Touchdown · 6 points', s: 'Any part of the ball over the goal line, with possession' },
        notes: {
          p: ['First and goal from the Jets 8. Handoff, follow the blockers, into the end zone.',
            'A touchdown is worth 6 (Rule 11-1-2-a). The ball only has to touch or cross the plane of the goal line while the runner holds it (11-2-1).',
            'The referee\'s signal: both arms straight up. Same signal for a field goal and a successful try.',
            'Watch the score bug: NE 6, NYJ 0.'],
          a: 'The goal line is a laser beam: the ball just has to break it.',
          x: 'Touching the pylon with the ball in possession also counts (11-2-1-c); an airborne runner needs the ball to pass over or inside the pylon (11-2-1-b).',
        },
      },
      {
        title: 'The try: kick for 1',
        cam: CAM_RZ, los: 95, fd: null, lbl: false, ball: false,
        players: k3.players, routes: k3.routes,
        marks: [
          { id: 'xp-m', type: 'measure', x1: 88, x2: 120, y: 15.5, t: 'snap at the 15 → about a 33-yard kick' },
          { id: 'xp-post', type: 'post', x: 76, y: 36, s: 0.8 },
        ],
        bug: { down: null, dist: null, hs: 7, msg: 'EXTRA POINT GOOD' },
        sfx: [{ n: 'cheer', at: 1700 }],
        l3: { k: 'After every touchdown', t: 'The try: 1 point', s: 'Kick it through the uprights from the 15-yard line' },
        notes: {
          p: ['After a touchdown, the scoring team gets one bonus play called the try (or "extra point"). The game clock doesn\'t run (11-3-1).',
            'Option 1: kick it. The ball is snapped from the 15-yard line (11-3-1-b); the holder sets it about 7 yards back, so it\'s roughly a 33-yard kick.',
            'Through the uprights, above the crossbar = 1 point (11-3-2-a). NFL kickers make the vast majority of these, but not all of them.',
            'Score: NE 7, NYJ 0. That\'s why "7" is the number everyone thinks of for a touchdown.'],
          a: 'The try is the free throw after a basket: a bonus attempt with nobody running the clock.',
          x: 'The kick moved back to the 15 in 2015 to make it less automatic. No tee is allowed on a try kick (11-3-2-a, 11-4-4).',
        },
      },
      {
        title: 'Or go for 2',
        cam: CAM_RZ, los: 108, fd: null, lbl: false, ball: false,
        players: [...o4, ...d4, F.ball(qb4.x, qb4.y)],
        routes: [slant4, R.make(o4, 'Z', 'out5'), R.make(o4, 'H', 'in5'), R.make(o4, 'TE', 'flat'), ...R.blocks(o4, R.OL, 0.6),
          { id: 'bf4', p: 'BALL', k: 'pass', d: [[qb4.x, qb4.y], end4], move: true, delay: 900, dur: 450 }],
        marks: [{ id: 'two-t', type: 'text', x: 106, y: 13.6, t: 'SNAP AT THE 2', size: 1.4, c: 'y', anchor: 'end' }],
        bug: { q: '2ND', clk: '11:20', hs: 15, msg: '2-POINT TRY GOOD' },
        tags: ['COLLEGE: 2-point try snapped from the 3'],
        l3: { k: 'Next drive: touchdown (NE 13)', t: 'The try: 2 points', s: 'Run or pass it in from the 2-yard line' },
        notes: {
          p: ['Fast-forward: the Patriots score another touchdown (13–0). This time they go for two.',
            'Option 2: snap from the 2-yard line (11-3-1-c) and run or pass it into the end zone. Success = 2 points (11-3-2-b).',
            'Quick slant to the X receiver: good! NE 15, NYJ 0.',
            'Coaches choose: about-certain 1 point, or a riskier 2. Late in games the math (and the scoreboard) often decides.'],
          a: 'Take the guaranteed $1, or flip a coin for $2.',
          x: 'If the defense takes the ball back to the other end zone on a try, it scores 2 (11-3-2-b); a "safety" on a try is worth 1 point to the opponent (11-3-2-c).',
        },
      },
      {
        title: 'Field goal: 3 points',
        cam: { x: 96, y: 27.5, w: 70 }, los: 90, fd: null, lbl: false, ball: false,
        players: k5.players, routes: k5.routes,
        marks: [
          { id: 'fg-m', type: 'measure', x1: 83, x2: 120, y: 15.5, t: 'LOS at the 20 + 17 = 37-yard field goal' },
          { id: 'fg-post', type: 'post', x: 72, y: 36, s: 0.8 },
        ],
        bug: { q: '2ND', clk: '0:03', down: 4, dist: 6, hs: 18, msg: 'FIELD GOAL' },
        sfx: [{ n: 'cheer', at: 1700 }],
        l3: { k: 'Stalled at the NYJ 20', t: 'Field goal · 3 points', s: 'Kick distance ≈ line of scrimmage + 17 yards' },
        notes: {
          p: ['When a drive stalls in range, the offense can kick a field goal from scrimmage: 3 points (11-1-2-b).',
            'The ball must go between the uprights and above the crossbar without touching the ground or a teammate (11-4-1).',
            'Kick distance = line of scrimmage + about 17 yards: 10 yards of end zone (posts sit on the end line) plus about 7 yards back to the holder. From the NYJ 20: a 37-yarder.',
            'NE 18, NYJ 0 at the half. After a field goal, the kicking team kicks off to the other team (11-4-6).'],
          a: 'A field goal is the consolation prize: you got close but couldn\'t finish.',
          x: 'Miss from beyond the 20 and the opponent takes over at the spot of the kick; from inside the 20, at their 20 (11-4-2).',
        },
      },
      {
        title: 'Safety: 2 points',
        cam: { x: 24, y: 27.5, w: 64 }, los: 13, fd: 23, lbl: false, ball: false, off: 'NE',
        players: [...o6, ...d6],
        routes: [
          R.abs(o6, 'RB', [[7, M + 2.5], [8.6, M + 4.8]], { k: 'run', move: true, curve: true, delay: 350, dur: 900 }),
          R.abs(d6, 'DE2', [[11.5, M + 6.4], [9.4, M + 5.2]], { move: true, c: 'r', delay: 300, dur: 1000 }),
          ...R.blocks(o6, R.OL, 0.8, 0.5),
        ],
        marks: [
          { id: 'sf-ez', type: 'rect', x: 0, y: 0, w: 10, h: 53.33, c: 'r', op: 0.14, stroke: false },
          { id: 'sf-c', type: 'circle', x: 8.6, y: M + 4.8, r: 2, c: 'r', pulse: true, delay: 1300 },
          { id: 'sf-t', type: 'text', x: 9, y: 41.5, t: 'Tackled in his OWN end zone', size: 1.3, c: '#fca5a5', delay: 1400 },
        ],
        bug: { q: '3RD', clk: '9:12', down: 1, dist: 10, poss: 'NE', as: 2, msg: 'SAFETY' },
        ov: [{ id: 'sg2', type: 'signal', pos: 'r', sig: 2, name: 'Safety', desc: 'Ball carrier downed in his own end zone', extra: '2 points to the defense' }],
        sfx: [{ n: 'hit', at: 1350 }, { n: 'whistle', at: 1750 }],
        l3: { k: 'NE backed up at its own 3', t: 'Safety · 2 points', s: 'Jets tackle the runner behind the Patriots\' goal line' },
        notes: {
          p: ['The rarest score. The Patriots are pinned at their own 3; the Jets defensive end beats his block.',
            'Running back tackled in his own end zone: safety. 2 points for the DEFENSE (11-1-2-c, 11-5-1).',
            'Also a safety: the ball goes out of the back of your own end zone, or a holding foul in your own end zone (11-5-1-a).',
            'Score: NE 18, NYJ 2.'],
          a: 'An own goal, football style.',
          x: 'Momentum exception: a defender who intercepts in the field of play and is carried into his end zone by momentum is not charged with a safety (11-5-1 Exc. 2).',
        },
      },
      {
        title: 'After a safety: free kick from the 20',
        cam: { x: 60, y: 26.67, w: 132 }, los: null, fd: null, lbl: false, ball: false, off: 'NE',
        players: [...neKick, ...nyjRet, F.ball(29.6, M)],
        routes: [{ id: 'skick', p: 'BALL', k: 'kick', d: [[29.6, M], [101, M - 5.5]], move: true, delay: 300, dur: 1500, lift: 0.06 }],
        marks: [
          { id: 'sk-lz', type: 'rect', x: 90, y: 0, w: 20, h: 53.33, c: 'y', op: 0.1, lbl: 'LANDING ZONE', size: 2 },
          { id: 'sk-t', type: 'text', x: 30, y: 14, t: 'Kick from the NE 20', size: 1.6, c: 'y' },
          { id: 'sk-a', type: 'arrow', d: [[30, 15.5], [30, 23.5]], c: 'y' },
        ],
        bug: { msg: null, poss: 'NYJ', clk: '9:05', down: null, dist: null },
        l3: { k: 'Safety kick', t: 'They give the ball away too', s: 'NE kicks from its own 20: Jets get 2 points AND the ball' },
        notes: {
          p: ['A safety is a double punishment: the defense gets 2 points, and the team that gave it up must kick the ball away.',
            'The free kick comes from the kicking team\'s own 20 (11-5-2), not the 35 like a normal kickoff (6-1-2-a).',
            'It uses the same modern kickoff setup: coverage team lined up on the receiving team\'s 40, receivers in the setup zone (6-1-3).',
            'The kicker may punt, drop-kick or place-kick it, and a tee is allowed (6-1-1-b).'],
          a: 'You knocked the ball over, so you pay a fine and hand over the ball.',
          x: 'Because the kick comes from 15 yards further back, the receivers usually get great field position. A safety kick out of bounds or short of the landing zone gives them the ball 30 yards from the kick spot (25 on a normal kickoff) (6-2-4).',
        },
      },
      {
        title: 'Challenge: ways to reach 17',
        cam: { x: 60, y: 26.67, w: 132 }, los: null, fd: null, ball: false,
        players: [], routes: [], marks: [],
        bug: { msg: null },
        w: 'c17',
        l3: { k: 'Your turn', t: 'Ways to reach 17?', s: 'Combine 6, 1, 2 and 3' },
        notes: {
          p: ['Quick audience challenge: how can a team end up with exactly 17 points?',
            'Let people shout answers, then build them in the widget: 7 + 7 + 3 (two TDs with kicks + a field goal) is the classic.',
            'Others: 6 + 6 + 2 + 3 (two TDs, one 2-point try, one FG); 3 + 3 + 3 + 3 + 3 + 2 (five FGs + a safety); 8 + 6 + 3.',
            'Point out the trap: you can\'t score a "1" on its own. A 1-point try only exists right after a touchdown.'],
          a: 'Like making change with coins of 6, 3 and 2, plus a 1 or 2 bonus coin that only comes with a 6.',
          x: 'Any total of 2 or more is reachable (2 = safety, 3 = FG, 4 = two safeties...). A team total of 1 would need the freak 1-point safety on the opponent\'s try (11-3-2-c). Rare combos are why fans track "scorigami" (never-before-seen final scores).',
        },
      },
      {
        title: 'Every way to score',
        cam: { x: 60, y: 26.67, w: 132 }, los: null, fd: null, ball: false,
        players: [], routes: [], marks: [],
        bug: { msg: null },
        ov: [{ id: 'sum', type: 'stats', pos: 'c', items: [
          { v: '6', l: 'Touchdown', s: 'offense or defense', c: '#38BDF8' },
          { v: '1', l: 'Try: kick', s: 'snap at the 15' },
          { v: '2', l: 'Try: run/pass', s: 'snap at the 2' },
          { v: '3', l: 'Field goal', s: 'LOS + 17 yards', c: '#FACC15' },
          { v: '2', l: 'Safety', s: 'scored by the defense', c: '#f87171' },
        ] }],
        l3: { k: 'Defense can score too', t: 'Five ways to score', s: 'Interception returned for a TD = "pick-six"' },
        notes: {
          p: ['The full menu: touchdown 6, try 1 or 2, field goal 3, safety 2 (Rule 11-1-2).',
            'Defenses score too: intercept a pass or recover a fumble and run it back into the end zone, and it\'s a touchdown. An interception return TD is a "pick-six".',
            'After a defensive touchdown the same try follows, and the team that scored kicks off.',
            'Even on a try, the defense can score: return it all the way and it\'s worth 2 (11-3-2-b).'],
          a: 'The ball is the ball: whoever carries it into the end zone gets the 6.',
          x: 'Rarest score in the book: the 1-point safety on a try (11-3-2-c), awarded to the opponent of the team that "safetied" during the try.',
        },
      },
    ],
  });
})(window.FD);
