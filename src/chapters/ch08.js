/* Chapter 8 — Run Game */
(function (FD) {
  const { F, R } = FD; const M = FD.MID;
  // defenders reacting during a play: reposition with a delay
  const react = (pl, map, delay = 350, dur = 900) => F.patch(pl, Object.fromEntries(Object.entries(map).map(([k, [x, y]]) => [k, { x, y, delay, dur }])));
  const blk = (pid, pts, o = {}) => ({ id: 'b-' + pid, p: 'NE-' + pid, k: 'block', d: pts, delay: o.delay ?? 0, dur: o.dur ?? 600 });
  const arw = (id, d, c = 'w', o = {}) => ({ id, type: 'arrow', d, c, w: 0.25, dash: true, ...o });

  // ---- 1–2: handoff + gaps (LOS = NE 32, x 42) ----
  const o1 = F.off(42, { set: 'under', pers: '12' });
  const d1 = F.def(42, { front: '43' });
  const r1 = [
    R.abs(o1, 'QB', [[39.2, M + 1.2]], { id: 'q1', move: true, dur: 450, dash: true }),
    R.abs(o1, 'RB', [[38.6, M + 1.8], [41.6, 29.8], [45, 30.2]], { id: 'rb1', k: 'run', move: true, curve: true, delay: 250, dur: 1200 }),
    ...R.blocks(o1, [...R.OL, 'TE', 'TE2'], 1.2, 0.6),
  ];
  const gap = (id, y, t) => [
    { id: 'g' + id, type: 'rect', x: 40.1, y: y - 0.6, w: 2, h: 1.2, c: 'y', op: 0.4, stroke: false, pulse: true },
    { id: 'gt' + id, type: 'text', x: 38.4, y: y + 0.45, t, size: 1.3, c: 'y', cls: 'hd' },
  ];
  const gapMarks = [
    ...gap('A1', 27.72, 'A'), ...gap('B1', 29.82, 'B'), ...gap('C1', 31.97, 'C'), ...gap('D1', 34.6, 'D'),
    ...gap('A2', 25.62, 'A'), ...gap('B2', 23.52, 'B'), ...gap('C2', 21.37, 'C'), ...gap('D2', 18.9, 'D'),
  ];

  // ---- 3–4: inside zone (pistol, 12 personnel) ----
  const o3 = F.off(42, { set: 'pistol', pers: '12' });
  const d3 = F.def(42, { front: '43' });
  const r4 = [
    R.abs(o3, 'QB', [[37.6, 25.2]], { id: 'q4', move: true, delay: 450, dur: 600, dash: true }),
    R.abs(o3, 'RB', [[38.5, 27.6], [40.8, 28.6], [42.6, 27.2], [45, 26.2], [47, 25.8]], { id: 'rb4', k: 'run', move: true, curve: true, delay: 250, dur: 1400 }),
    blk('TE2', [[42, 20.6], [42.8, 21.6]]),
    blk('LT', [[42, 22.9], [43, 24.2], [45.6, 23.4]], { dur: 900 }),
    blk('LG', [[42, 25], [42.8, 25]]),
    blk('C', [[42, 27.4], [42.9, 28.3]]),
    blk('RG', [[42, 29.2], [43, 29.3], [45.6, 28.6]], { dur: 900 }),
    blk('RT', [[42, 31.3], [44.2, 32.3], [45.6, 32.8]], { dur: 800 }),
    blk('TE', [[42, 33.5], [42.9, 34.4]]),
  ];
  const d4 = react(d3, { DE1: [43.4, 21.8], DT1: [43.4, 24], DT2: [43.8, 29.8], DE2: [43.6, 35], WILL: [46.4, 23.3], MIKE: [46.2, 28.7], SAM: [46.2, 32.9], SS: [48.8, 33.6] });
  const d4b = F.patch(d4, { FS: { x: 48.3, y: 25.4, delay: 400, dur: 1200 } });

  // ---- 5–6: power (under center, 21 personnel), LOS NE 37 (x 47) ----
  const o5 = F.off(47, { set: 'under', pers: '21' });
  const d5 = F.patch(F.def(47, { front: '43' }), { DE2: { y: 35.4 } });
  const r6 = [
    R.abs(o5, 'QB', [[44.6, 27.6]], { id: 'q6', move: true, dur: 400, dash: true }),
    R.abs(o5, 'LG', [[45.3, 25.6], [45, 28.4], [45.8, 31.6], [48.2, 31.9], [51, 28.8]], { id: 'b-LG', k: 'block', move: true, curve: true, delay: 50, dur: 1250 }),
    R.abs(o5, 'FB', [[44.6, 29.8], [47.2, 34.2]], { id: 'b-FB', k: 'block', move: true, delay: 100, dur: 800 }),
    R.abs(o5, 'RB', [[43.4, 28.2], [46, 30.4], [48, 31.8], [51.2, 31.4], [54, 30.8]], { id: 'rb6', k: 'run', move: true, curve: true, delay: 400, dur: 1500 }),
    blk('LT', [[47, 22.2], [47.7, 21.4]]),
    blk('C', [[47, 26.2], [47.8, 25.4]]),
    blk('RG', [[47, 28.4], [48, 27.6], [50.6, 23.6]], { dur: 900 }),
    blk('RT', [[47, 30.4], [47.9, 29.2]]),
    blk('TE', [[47, 33.2], [50.4, 33.6]], { dur: 800 }),
  ];
  const d6 = F.patch(react(d5, { DE1: [48, 21], DT1: [48.6, 25.6], DT2: [48.4, 28.4], DE2: [47.8, 35.7], WILL: [51.1, 23.4], MIKE: [51.6, 28.4], SAM: [51, 33.8] }),
    { SS: { x: 54.8, y: 32.2, delay: 500, dur: 1300 }, FS: { x: 57.5, y: 29, delay: 500, dur: 1300 } });

  // ---- 7–8: outside zone (under center, 12 personnel), LOS NE 44 (x 54) ----
  const o7 = F.off(54, { set: 'under', pers: '12' });
  const d7 = F.def(54, { front: '43' });
  const reach = ['TE2', 'LT', 'LG', 'C', 'RG', 'RT', 'TE'].map((id) => { const p = F.get(o7, id); return arw('rc' + id, [[54, p.y], [55.2, p.y + 2.2]], 'w'); });
  const r8 = [
    R.abs(o7, 'QB', [[51.2, 28.4]], { id: 'q8', move: true, dur: 450, dash: true }),
    R.abs(o7, 'RB', [[50.2, 29.2], [53.4, 33.6], [55.8, 38.2], [58.8, 39.2], [63, 38.8]], { id: 'rb8', k: 'run', move: true, curve: true, delay: 300, dur: 1500 }),
    blk('TE2', [[54, 20.6], [55, 22.6]]),
    blk('LT', [[54, 22.8], [55.6, 24.4], [57.8, 24.8]], { dur: 900 }),
    blk('LG', [[54, 24.9], [55, 26.4]]),
    blk('C', [[54, 27], [55.1, 29.4]]),
    blk('RG', [[54, 29.1], [56, 30.6], [58, 30]], { dur: 900 }),
    blk('RT', [[54, 31.2], [56, 33.6], [57.6, 35.2]], { dur: 900 }),
    blk('TE', [[54, 33.4], [55.4, 35.8]]),
    blk('Z', [[53, 45.4], [57.4, 44.6]], { dur: 900 }),
  ];
  const d8 = F.patch(react(d7, { DE1: [55.6, 22.8], DT1: [55.9, 26.6], DT2: [55.8, 29.8], DE2: [56, 35.2], WILL: [58.4, 25.4], MIKE: [58.6, 30.4], SAM: [58.2, 35.8], CB2: [58.2, 44.4] }),
    { SS: { x: 62.8, y: 40.2, delay: 450, dur: 1400 }, FS: { x: 66, y: 33, delay: 450, dur: 1400 } });

  // ---- 10: film room — the cutback (pistol, 12), LOS NE 47 (x 63) ----
  const o10 = F.off(63, { set: 'pistol', pers: '12' });
  const d10 = F.def(63, { front: '43' });
  const r10 = [
    R.abs(o10, 'QB', [[58.6, 25]], { id: 'q10', move: true, delay: 450, dur: 600, dash: true }),
    R.abs(o10, 'RB', [[59.5, 27.6], [61.6, 28.6], [63.6, 26.6], [66.6, 24.4], [69, 23.8]], { id: 'rb10', k: 'run', move: true, curve: true, delay: 250, dur: 1500 }),
    blk('TE2', [[63, 20.6], [63.9, 21.2]]),
    blk('LT', [[63, 22.9], [64.6, 24.4], [67, 25.6]], { dur: 900 }),
    blk('LG', [[63, 25], [64.1, 26.6]]),
    blk('C', [[63, 27.4], [64.3, 29]]),
    blk('RG', [[63, 29.2], [64.1, 29.6], [66.2, 29.6]], { dur: 900 }),
    blk('RT', [[63, 31.3], [65, 32.6], [66.4, 33.6]], { dur: 800 }),
    blk('TE', [[63, 33.5], [64, 34.8]]),
  ];
  const d10r = F.patch(react(d10, { DE1: [64.6, 21.4], DT1: [64.8, 27.4], DT2: [64.8, 30.4], DE2: [64.6, 35.4], WILL: [68, 26.6], MIKE: [66.9, 29.9], SAM: [66.8, 34.4], SS: [68.6, 34.2] }),
    { FS: { x: 70, y: 24.6, delay: 450, dur: 1300 } });

  FD.CH.push({
    title: 'Run Game', sub: 'Handoffs, gaps, and three run schemes',
    base: {},
    steps: [
      {
        title: 'The handoff',
        bug: { reset: true, hs: 7, as: 7, q: '2ND', clk: '8:12', down: 1, dist: 10, poss: 'NE' },
        cam: { x: 44, y: M + 2, w: 50 }, los: 42, fd: 52, lbl: true, ball: false,
        players: [...o1, ...d1], routes: r1, marks: [{ id: 'ho', type: 'text', x: 37.6, y: M + 4, t: 'HANDOFF', size: 1.1, c: 'y', delay: 500 }], zones: [],
        sfx: [{ n: 'hit', at: 1400 }],
        l3: { k: 'Run game', t: 'The handoff', s: 'QB gives it to the running back, who follows his blockers' },
        tags: ['COLLEGE: runner is down when a knee touches, even untouched'],
        notes: {
          p: ['A run play starts like every play: the snap. The quarterback turns and hands the ball to the running back.',
            'The five offensive linemen and the tight ends fire forward and push defenders out of the way. That\'s the "hole".',
            'The running back\'s job: follow the blockers, find the crease, and fall forward.',
            'In the NFL the play ends when the runner is touched and a knee (or anything but hands/feet) hits the ground: "down by contact" (Rule 7-2-1-a).'],
          a: 'The blockers are the snowplow; the running back is the car right behind it.',
          x: 'Handing the ball forward is only legal to an eligible receiver behind the line (8-7-4); that\'s why the mesh happens in the backfield.',
        },
      },
      {
        title: 'Gaps: A, B, C, D',
        cam: { x: 42.5, y: M + 0.3, w: 42 }, ball: { x: 42, y: M },
        players: [...o1, ...F.dim(d1, [])], routes: [], marks: gapMarks,
        l3: { k: 'The language of the line', t: 'Gaps: A · B · C · D', s: 'A next to the center, then B, C, D moving outward' },
        notes: {
          p: ['The spaces between offensive linemen are called gaps, lettered from the middle out.',
            'A gap: between center and guard. B gap: between guard and tackle. C gap: outside the tackle. D gap: outside the tight end.',
            'There\'s one of each on both sides, so there are two A gaps, two B gaps, and so on.',
            'Defenses talk the same way: "who has the A gap?" Every gap needs a defender, or a running back will find it.'],
          a: 'Like doors in a hallway: A is the door right next to the middle, D is the last one at the end.',
          x: 'Many offenses also number the holes (often odd to the left, even to the right), but numbering varies by team; the A–D letters are near-universal.',
        },
      },
      {
        title: 'Inside zone: the setup',
        cam: { x: 45, y: M + 1, w: 48 }, ball: { x: 42, y: M },
        players: [...o3, ...d3], routes: [],
        marks: [
          ...['TE2', 'LT', 'LG', 'C', 'RG', 'RT', 'TE'].map((id) => { const p = F.get(o3, id); return arw('iz' + id, [[42.2, p.y], [43.4, p.y + 1.5]]); }),
          { id: 'rd', type: 'circle', x: 43.2, y: 28.57, r: 1.7, c: 'y', pulse: true },
          { id: 'rdt', type: 'text', x: 43.4, y: 31.4, t: 'READ', size: 1.1, c: 'y' },
          arw('cl1', [[43.2, 29.4], [45.6, 28.2]], 'b'), arw('cl2', [[43.2, 23.6], [45.4, 23.2]], 'b'),
          arw('aim', [[35.6, M + 0.4], [40.6, 29]], 'y'),
        ],
        l3: { k: 'Scheme 1', t: 'Inside zone', s: 'Whole line steps the same way · double-teams climb to linebackers' },
        notes: {
          p: ['Inside zone is the most common run in the NFL. Shotgun or pistol, almost every team has it.',
            'At the snap, every lineman steps to the play side together, here toward the bottom of the screen.',
            'Two linemen double-team a defensive tackle, then one of them "climbs" to block a linebacker (blue arrows).',
            'The running back aims at the guard and reads the first down lineman (circled). He goes wherever that man isn\'t.'],
          a: 'A zone run is a wave: the line moves as one and the back surfs on the gap that opens.',
          x: 'Double teams must stay high: a high-low combo on the same defender is a chop block, and all chop blocks are illegal (12-2-5).',
        },
      },
      {
        title: 'Inside zone: cutback, +5',
        ball: false,
        players: [...o3, ...d4b], routes: r4, marks: [],
        bug: { down: 2, dist: 5 },
        sfx: [{ n: 'hit', at: 1550 }],
        l3: { k: 'Inside zone', t: 'Cutback for 5', s: 'Defense flows to the play side, the back cuts behind it' },
        notes: {
          p: ['Watch the line move together and the double-teams climb to the second level.',
            'The defense chases the flow toward the bottom, so the back plants his foot and cuts back up the middle.',
            'Five yards. Now it\'s 2nd and 5: the offense is ahead of schedule.'],
          a: 'Like a crowd all running toward one exit: the smart one turns around and walks out the other door.',
          x: 'The back\'s aiming point is the play-side guard; his read goes front-side gap ("bang"), cutback ("bend"), or bounce. More in the Film Room.',
        },
      },
      {
        title: 'Power: the setup',
        cam: { x: 49, y: M + 2, w: 50 }, los: 47, fd: 52, ball: { x: 47, y: M },
        players: [...F.hl(o5, ['LG', 'FB']), ...d5], routes: [],
        marks: [
          arw('pull', [[45.2, 25.4], [44.9, 28.4], [45.6, 31.6], [48.4, 32]], 'b', { curve: true }),
          { id: 'pullt', type: 'text', x: 43.2, y: 23.4, t: 'PULL', size: 1.2, c: 'b', cls: 'hd' },
          arw('kick', [[43.6, M + 1.2], [46.6, 33.4], [47.4, 34.6]], 'o'),
          { id: 'kickt', type: 'text', x: 44.2, y: 36.4, t: 'KICK OUT', size: 1.1, c: 'o', cls: 'hd' },
          arw('dn1', [[47, 30.4], [47.9, 29.3]]), arw('dn2', [[47, 26.4], [47.8, 25.5]]),
          { id: 'hole', type: 'rect', x: 47.2, y: 31, w: 1.6, h: 1.8, c: 'y', op: 0.35, pulse: true },
        ],
        l3: { k: 'Scheme 2', t: 'Power', s: 'Block down, kick out the end, pull a guard through the hole' },
        notes: {
          p: ['Power is the old-school, downhill run. 21 personnel here: a fullback in front of the running back.',
            'The play-side linemen block DOWN, toward the middle, sealing defenders inside.',
            'The fullback KICKS OUT the end man on the line, pushing him toward the sideline.',
            'And the backside guard PULLS: he runs behind the line and leads through the hole to block a linebacker.'],
          a: 'Open a door (kick-out), hold it open (down blocks), and send a bodyguard through first (the puller).',
          x: 'Gap scheme vs zone: blockers have specific men/gaps, so the hole is designed at the snap. The backside tackle must "hinge" to cover the pulling guard\'s vacated space.',
        },
      },
      {
        title: 'Power: through the hole, +7',
        ball: false,
        players: [...o5, ...d6], routes: r6, marks: [],
        bug: { down: 1, dist: 10 },
        sfx: [{ n: 'hit', at: 1250 }, { n: 'hit2', at: 1850 }],
        l3: { k: 'Power', t: 'Downhill for 7', s: 'Guard leads on the linebacker · first down' },
        notes: {
          p: ['Watch the pulling guard: he travels behind the line and arrives at the hole just before the back.',
            'Fullback kicks out the end, down blocks seal the inside: a lane opens between them.',
            'Seven yards: from 2nd and 5 to a fresh 1st and 10.'],
          x: 'If a lineman grabs and restricts a defender to keep that lane open, it\'s offensive holding: 10 yards (12-1-3-c).',
        },
      },
      {
        title: 'Outside zone: the setup',
        cam: { x: 57, y: M + 5, w: 56 }, los: 54, fd: 64, ball: { x: 54, y: M },
        players: [...o7, ...d7], routes: [],
        marks: [...reach,
          { id: 'rct', type: 'text', x: 48, y: 21.6, t: 'EVERYONE REACHES', size: 1.2, c: 'w', cls: 'hd' },
          arw('aim8', [[47.6, M + 0.6], [51.4, 31], [55.2, 37.4]], 'y', { curve: true }),
          { id: 'edge', type: 'text', x: 52.2, y: 39.6, t: 'AIM: THE EDGE', size: 1.1, c: 'y', cls: 'hd' }],
        l3: { k: 'Scheme 3', t: 'Outside zone', s: 'Line reaches toward the sideline · back aims for the edge' },
        notes: {
          p: ['Outside zone, or "stretch": the whole line steps hard toward the sideline, trying to get outside their defender.',
            'This is the run we saw in the cold open.',
            'The back aims for the edge, outside the tight end. If the edge is sealed he keeps going; if not, he cuts up into the first crease.',
            'It stretches the defense horizontally: linebackers have to run sideways to keep up.'],
          x: 'A reach block means stepping to the defender\'s outside shoulder; when it fails, the blocker just runs him past the play and the back cuts behind.',
        },
      },
      {
        title: 'Outside zone: edge, +9',
        ball: false,
        players: [...o7, ...d8], routes: r8, marks: [],
        bug: { down: 2, dist: 1 },
        sfx: [{ n: 'hit', at: 1800 }],
        l3: { k: 'Outside zone', t: 'Around the edge for 9', s: 'Tight end seals the end man inside · back cuts upfield' },
        notes: {
          p: ['The tight end seals the defensive end inside, the receiver blocks the cornerback outside: a lane down the sideline.',
            'The back gets to the edge and turns upfield. Nine yards.',
            '2nd and 1: the offense can now do almost anything.'],
          x: 'On the edge, a block in the back is a 10-yard foul (12-1-3-b); receivers must stay in front of the corner.',
        },
      },
      {
        title: 'What to watch on a run',
        cam: { x: 74, y: M + 1, w: 58 }, los: 63, fd: 64, ball: { x: 63, y: M },
        players: F.hl([...o10, ...d10], ['RB', 'MIKE', 'WILL', 'SAM']), routes: [], marks: [],
        ov: [{ id: 'watch', type: 'panel', pos: 'r', k: 'Run game', t: 'What to watch',
          items: ['**The running back\'s patience**: he waits for blocks to form, then explodes', '**The hole**: where the line moves and where it opens up', '**The linebackers**: who fills the gap, who gets blocked, who overruns the play', '**The yards after contact**: good backs fall forward'] }],
        l3: null,
        notes: {
          p: ['2nd and 1 at the Jets 47, same pistol look as our inside zone. Next time you watch a run, don\'t follow the ball: watch the line first, then the back.',
            'Patience: great backs look slow for a split second, then accelerate when the hole opens.',
            'Linebackers decide most runs. Watch who fills the gap and who gets swallowed by a climbing lineman.',
            'And watch the last yard: falling forward turns 3rd and 2 into 3rd and 1.'],
          x: 'Analysts track "yards before contact" (blocking) vs "yards after contact" (the back) to split credit.',
        },
      },
      {
        title: 'Film Room: the cutback read',
        deep: true,
        cam: { x: 66, y: M + 1, w: 46 }, ball: false,
        players: [...o10, ...F.read(d10r, ['DT2'])], routes: r10,
        marks: [
          { id: 'key', type: 'circle', x: 64.2, y: 28.57, r: 1.7, c: 'y', pulse: true },
          arw('bang', [[61.6, 28.6], [65.6, 29.6]], 'w'), { id: 'n1', type: 'num', x: 66.6, y: 30.4, t: '1' },
          arw('bend', [[61.6, 28.6], [64, 26.4], [66.4, 24.2]], 'w'), { id: 'n2', type: 'num', x: 67.2, y: 22.8, t: '2' },
          arw('bounce', [[61.6, 28.6], [63.4, 33.2], [65.4, 35.4]], 'w'), { id: 'n3', type: 'num', x: 64.4, y: 36.6, t: '3' },
        ],
        bug: { down: 1, dist: 10 },
        sfx: [{ n: 'hit', at: 1700 }],
        l3: { k: 'Film Room', t: 'Bang · bend · bounce', s: 'The back reads the first down lineman, then picks a lane' },
        notes: {
          p: ['Inside zone gives the back three options, read on the fly: 1 bang (play-side gap), 2 bend (cutback), 3 bounce (outside).',
            'His key is the first down lineman on the play side (circled). If that man gets reached, bang. If he widens, the cutback opens.',
            'Here the whole defense overflows to the play side, so the back bends it back behind them. Six yards, first down.',
            'The cutback works because zone blocking moves everyone sideways: backside defenders get washed down, leaving a lane.'],
          a: 'Like a driver reading traffic lights in sequence: green on lane 1? Go. Red? Check lane 2.',
          x: 'Add a zone read: the QB leaves the backside end unblocked and reads him. End crashes on the back? QB keeps it. That "blocks" the cutback defender without a blocker.',
        },
      },
    ],
  });
})(window.FD);
