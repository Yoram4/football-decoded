/* Chapter 7 — Anatomy of a Play */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;

  const TLI = ['Huddle', 'Line up', 'Motion', 'Snap', 'Action', 'Whistle', 'Spot', 'Chains'];
  const tl = (i) => ({ id: 'tl', type: 'timeline', pos: 't', items: TLI, i });

  // huddle: `lead` faces the group from the open side (toward the LOS); others in a horseshoe
  const ring = (pl, cx, dir, lead) => {
    const others = pl.filter((p) => !p.id.endsWith('-' + lead)), n = others.length;
    return pl.map((p) => {
      if (p.id.endsWith('-' + lead)) return { ...p, x: +(cx + dir * 3.6).toFixed(2), y: +M.toFixed(2) };
      const a = (dir > 0 ? Math.PI : 0) + ((-130 + (260 * others.indexOf(p)) / (n - 1)) * Math.PI) / 180;
      return { ...p, x: +(cx + 3.6 * Math.cos(a)).toFixed(2), y: +(M + 3.6 * Math.sin(a)).toFixed(2) };
    });
  };

  // Drive: 1st & 10 at the NE 30 (LOS x 40), line to gain x 50
  const o = F.off(40, { pers: '11', wide: 13 });
  const d = F.def(40, { front: 'nickel', cov: '3', wide: 13 });
  const hud1 = [...ring(o, 32, 1, 'QB'), ...ring(d, 48, -1, 'MIKE')];

  // pre-snap motion: H (slot, off the line) runs across behind the line
  const h = F.get(o, 'H');
  const motion = R.abs(o, 'H', [[37.2, M - 6], [37.2, M + 9]], { k: 'motion', move: true, delay: 200, dur: 1500, lbl: 'motion' });
  const nbFollow = R.abs(d, 'NB', [[44.5, M + 8.5]], { move: true, delay: 400, dur: 1300 });
  const set3 = [...o, ...d];
  const set4 = F.after(set3, [motion, nbFollow]);

  // snap: ball from center to the shotgun QB
  const qb = F.get(o, 'QB');
  const snap = { id: 'snap', p: 'BALL', k: 'pass', d: [[40, M], [qb.x, qb.y]], move: true, delay: 150, dur: 280, lift: 0, arrow: false };
  const play4 = [...set4, F.ball(40, M)];
  const play5 = F.after(play4, [snap]);

  // action: inside run for +6 (RB from the gun, handoff, through the A/B gap)
  const runPts = [[37, M + 0.5], [40, M - 0.5], [43, M - 1], [46, M - 0.8]];
  const run = R.abs(play5, 'RB', runPts, { k: 'run', move: true, curve: true, delay: 300, dur: 1300 });
  const carry = { id: 'carry', p: 'BALL', k: 'route', d: [[qb.x, qb.y], ...runPts], move: true, curve: true, delay: 300, dur: 1300, c: 'rgba(0,0,0,0)', arrow: false, glow: false };
  const tacklers = [
    R.abs(play5, 'MIKE', [[46.8, M - 0.3]], { move: true, delay: 800, dur: 800 }),
    R.abs(play5, 'WILL', [[46.9, M - 1.7]], { move: true, delay: 800, dur: 800 }),
  ];
  const routes5 = [run, carry, ...tacklers, ...R.blocks(play5, [...R.OL, 'TE'], 1.3, -0.4), ...R.blocks(play5, ['X', 'Z', 'H'], 2, 0)];
  const end6 = F.after(play5, routes5).filter((p) => p.id !== 'BALL');

  // next series of plays: huddle 8 yards behind the new LOS (x 46)
  const hud9 = [...ring(o, 38, 1, 'QB'), ...ring(d, 53, -1, 'MIKE')];

  const CAM = { x: 45, y: 29, w: 96 };

  FD.CH.push({
    title: 'Anatomy of a Play', sub: 'Huddle to chains: the 40-second cycle',
    base: { cam: CAM },
    steps: [
      {
        title: 'The huddle',
        bug: { reset: true, hs: 7, as: 3, q: '2ND', clk: '8:41', clkRun: true, down: 1, dist: 10, poss: 'NE', pc: 40, pcRun: true },
        cam: CAM, los: 40, fd: 50, lbl: true, ball: null, off: 'NE', dlbl: false,
        players: hud1, routes: [], marks: [],
        ov: [tl(0)],
        sfx: ['huddle'],
        l3: { k: '1st & 10 · NE 30', t: 'The huddle', s: 'The QB relays the play call to the other 10' },
        notes: {
          p: ['Every play has the same life cycle. Let\'s slow one down: 1st and 10 from the Patriots 30, 2nd quarter, NE leads 7–3.',
            'Step 1: the huddle, about 8 yards behind the ball. The quarterback hears the play from the coach through a radio in his helmet and repeats it to the other 10.',
            'The play clock is already running: 40 seconds from the end of the last play (Rule 4-6-1).',
            'The defense huddles too, getting its call from the sideline.'],
          a: 'The huddle is the team meeting before each play: 15 seconds to agree on the plan.',
          x: 'No more than 11 players may be in the offensive huddle while the play clock runs (5-2-1). The helmet radio cuts off when the play clock reaches 15 seconds or at the snap (5-3-3).',
        },
      },
      {
        title: 'Break and line up',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: null, dlbl: true,
        players: [...o, ...d], routes: [], marks: [],
        bug: { clk: '8:30', pc: 29 },
        ov: [tl(1)],
        l3: { k: 'Personnel', t: '11 personnel vs nickel', s: '1 RB, 1 TE, 3 WR against 5 defensive backs' },
        notes: {
          p: ['"Break!" Everyone jogs to their spot. The offense must be set in a legal formation.',
            'Patriots: "11 personnel" = 1 running back, 1 tight end, so 3 wide receivers.',
            'Jets answer with "nickel": a 5th defensive back instead of a 3rd linebacker, to cover the extra receiver.',
            'All 11 offensive players must be set and still for at least a full second before the snap (7-4-6).'],
          x: 'The two digits = number of RBs then TEs (WRs are whatever is left out of 5 skill players). Defenses substitute based on the personnel they see.',
        },
      },
      {
        title: 'Pre-snap motion',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: null, dlbl: true,
        players: set3, routes: [motion, nbFollow], marks: [],
        bug: { clk: '8:20', pc: 12 },
        ov: [tl(2)],
        l3: { k: 'Before the snap', t: 'Motion', s: 'One player may be moving at the snap, never toward the line' },
        notes: {
          p: ['The slot receiver (H) goes in motion across the formation.',
            'Rule: only one player may be in motion at the snap, and he can\'t be moving toward the line of scrimmage (7-4-8).',
            'Watch the nickel back: he runs across with him. That\'s a tell: probably man-to-man coverage.',
            'Motion is a question the offense asks the defense before the snap.'],
          a: 'Motion is a fake step in a dance: it shows you who is following whom.',
          x: 'Since a receiver moving parallel to the line is legal at the snap, "jet motion" lets a WR take a handoff at full speed. Zone defenders "bump" rather than travel with motion.',
        },
      },
      {
        title: 'The snap',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: false, dlbl: true,
        players: play4, routes: [snap],
        marks: [{ id: 'live', type: 'text', x: 40, y: 15.5, t: 'BALL IS LIVE', size: 1.5, c: 'y', delay: 300 }],
        bug: { clk: '8:12', pc: 6, pcRun: true },
        ov: [tl(3)],
        sfx: [{ n: 'hit', at: 200 }],
        l3: { k: 'Play clock :06', t: 'The snap', s: 'The center hands or tosses the ball back: the play is live' },
        notes: {
          p: ['The center snaps the ball back to the quarterback in the shotgun, 5 yards deep.',
            'The ball becomes live at the snap (7-1-1). Before that, any movement across the line is a penalty.',
            'Notice the play clock: snapped with 6 seconds to spare.'],
          a: 'The snap is the starter\'s pistol.',
          x: 'The QB controls the snap with a cadence ("Blue 80, set, hut") or a silent count/clap in loud stadiums; changing the count draws defenders offside.',
        },
      },
      {
        title: 'The action: inside run',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: false, dlbl: true,
        players: play5, routes: routes5, marks: [],
        bug: { clk: '8:12', pc: null, pcRun: false },
        ov: [tl(4)],
        sfx: [{ n: 'hit', at: 500 }, { n: 'hit2', at: 1500 }],
        l3: { k: 'Run play', t: 'Inside run · +6', s: 'Handoff, blockers push, back finds the crease' },
        notes: {
          p: ['Handoff to the running back. The line blocks the defenders in front of them; receivers block downfield.',
            'The back reads the blocks and hits the gap between center and guard.',
            'The Jets linebackers fill the hole and meet him 6 yards downfield.',
            'All of this takes about 4 seconds.'],
          x: 'Inside zone: the line steps the same way together, double-teams climb to linebackers, and the back reads the first down lineman for front side, cutback or bounce.',
        },
      },
      {
        title: 'The whistle',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: { x: 46, y: +(M - 0.8).toFixed(2) }, dlbl: true,
        players: end6, routes: [],
        marks: [
          { id: 'down-c', type: 'circle', x: 46, y: +(M - 0.8).toFixed(2), r: 2.4, c: 'y', pulse: true },
          { id: 'down-t', type: 'text', x: 46, y: 16, t: 'DOWN BY CONTACT', size: 1.5, c: 'y' },
        ],
        bug: { clk: '8:06' },
        ov: [tl(5)],
        sfx: ['whistle'],
        l3: { k: 'Play over', t: 'The whistle', s: 'Touched by a defender and down = the ball is dead' },
        notes: {
          p: ['Whistle. The play is dead.',
            'A runner is down when he is contacted by an opponent and touches the ground with anything other than hands or feet (7-2-1-a), or when his forward progress is stopped (7-2-1-b).',
            'In the NFL a runner who slips without being touched can get up and keep going.',
            'The game clock keeps running because he was tackled in bounds.'],
          a: 'The whistle is "freeze": everything after it doesn\'t count (except fouls).',
          x: 'Forward progress: the ball is spotted where his advance ended even if he\'s then driven backward (3-12-1).',
        },
      },
      {
        title: 'The spot',
        cam: CAM, los: 46, fd: 50, lbl: true, ball: { x: 46, y: +M.toFixed(2) }, dlbl: false,
        players: F.dim(end6, ['RB']), routes: [],
        marks: [
          { id: 'gain', type: 'measure', x1: 40, x2: 46, y: 44, t: '+6' },
          { id: 'spot-t', type: 'text', x: 46, y: 16, t: 'NEW SPOT · NE 36', size: 1.5, c: 'y' },
        ],
        bug: { clk: '8:01', down: 2, dist: 4, pc: 40, pcRun: true },
        ov: [tl(6)],
        l3: { k: 'Ball spotted', t: '2nd & 4 at the NE 36', s: 'The ball goes where forward progress ended' },
        notes: {
          p: ['The official spots the ball where the runner\'s forward progress ended: the Patriots 36.',
            'Blue line moves up to the new line of scrimmage. The yellow line (line to gain) stays put at the 40.',
            'The bug updates: 2nd down, 4 to go. The play clock restarts at 40.',
            'If the runner had been tackled outside the hash marks, the ball would be moved in to the nearest hash.'],
          x: 'The line to gain is fixed for the whole series: 10 yards from the spot of the snap that started it (3-8-3).',
        },
      },
      {
        title: 'The chains',
        cam: { x: 58, y: 44, w: 44 }, los: 46, fd: 50, lbl: true, ball: { x: 46, y: +M.toFixed(2) },
        players: F.dim(end6, []), routes: [],
        marks: [
          { id: 'ch-l', type: 'line', x1: 40, y1: 54.6, x2: 50, y2: 54.6, c: 'w', w: 0.18 },
          { id: 'ch-r1', type: 'rect', x: 39.8, y: 53.6, w: 0.4, h: 2.2, c: 'o', op: 1, stroke: false },
          { id: 'ch-r2', type: 'rect', x: 49.8, y: 53.6, w: 0.4, h: 2.2, c: 'o', op: 1, stroke: false },
          { id: 'ch-box', type: 'num', x: 46, y: 55, t: '2', c: 'o', r: 0.9 },
          { id: 'ch-m', type: 'measure', x1: 40, x2: 50, y: 51.6, t: '10 yards of chain' },
          { id: 'ch-s', type: 'text', x: 39.5, y: 48.3, t: 'Series start (NE 30)', size: 1, anchor: 'end' },
          { id: 'ch-g', type: 'text', x: 50.5, y: 48.3, t: 'Line to gain (NE 40)', size: 1, anchor: 'start', c: 'y' },
          { id: 'ch-d', type: 'text', x: 46, y: 48.3, t: 'DOWN 2', size: 1, c: 'o' },
        ],
        bug: { clk: '7:58' },
        ov: [tl(7)],
        l3: { k: 'On the sideline', t: 'The chains', s: 'Two rods, 10 yards of chain, and a down marker' },
        notes: {
          p: ['On the sideline, the chain crew (in white shirts) holds two rods joined by exactly 10 yards of chain (1-4).',
            'Back rod = where this series started (NE 30). Front rod = the line to gain (NE 40).',
            'The third pole is the down marker: it shows "2" and stands at the current spot of the ball.',
            'When it\'s close, the officials bring the chains onto the field and measure. The yellow line on TV is only a graphic; the chains are official.'],
          a: 'The chains are a 10-yard ruler the officials carry along the sideline.',
          x: 'The referee can stop the clock for a possible measurement (Referee\'s timeout, 4-5-5-a). A clip on the chain at a 5-yard line lets the crew reset it precisely.',
        },
      },
      {
        title: 'Next play: huddle or hurry-up',
        cam: { x: 48, y: 29, w: 96 }, los: 46, fd: 50, lbl: true, ball: { x: 46, y: +M.toFixed(2) }, dlbl: false,
        players: hud9, routes: [], marks: [],
        bug: { clk: '7:50', pc: 32, pcRun: true },
        ov: [tl(0)],
        sfx: ['huddle'],
        l3: { k: '2nd & 4 · NE 36', t: 'Repeat: huddle or hurry-up', s: 'About 40 seconds later, it all starts again' },
        notes: {
          p: ['And the cycle starts over: back to the huddle, 8 yards behind the new spot.',
            'Or skip the huddle: a "no-huddle" or hurry-up offense calls the play at the line, to save time or to stop the defense from substituting.',
            'An NFL game is well over a hundred of these little cycles; the ball is live for only a small slice of the three hours.',
            'Now you know the rhythm. Next we look at the heart of the game: downs.'],
          x: 'Tempo matters: before the two-minute warning, if the offense substitutes, the umpire stands over the ball until the defense can match (5-2-10). No-huddle with the same 11 avoids that and keeps tired defenders on the field.',
        },
      },
    ],
  });
})(window.FD);
