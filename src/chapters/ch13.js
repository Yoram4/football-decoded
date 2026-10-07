/* Chapter 13 — Penalties */
(function (FD) {
  const { F, R } = FD; const M = FD.MID;
  const T = (los, o = {}) => [...F.off(los, o.off || {}), ...F.def(los, o.def || {})];
  const PREV = { id: 'prev', type: 'line', x1: 40, y1: 12, x2: 40, y2: 43, c: 'w', w: 0.18, dash: true };
  const MS = (x1, x2, t) => ({ id: 'ms', type: 'measure', x1, x2, y: 17.8, t, size: 1.3 });
  const FLAG = (pl, id, dx = 1, dy = -1.3) => { const p = F.get(pl, id); return { id: 'fl', type: 'flag', x: +(p.x + dx).toFixed(2), y: +(p.y + dy).toFixed(2) }; };
  const SIG = (o) => [{ id: 'sg', type: 'signal', pos: 'r', ...o }];

  // step 1: inside run, holding at the point of attack
  const P1 = T(40);
  const R1 = [
    ...R.blocks(P1, R.OL, 1.2),
    R.abs(P1, 'NE-RB', [[38.5, M + 1.2], [46, M + 1.5]], { k: 'run', move: true, delay: 250, dur: 1100 }),
    R.abs(P1, 'NYJ-MIKE', [[46.7, M + 1.6]], { move: true, delay: 900, dur: 450 }),
  ];

  // DPI: deep shot to X, corner grabs him
  const P7 = [...T(40, { off: { pers: '12', strong: -1, wide: 10 }, def: { strong: -1, wide: 10 } }), F.ball(35, M)];
  const R7 = [
    ...R.blocks(P7, R.OL, 0.6),
    R.make(P7, 'X', [[19, 0]], { move: true, delay: 200, dur: 1500 }),
    R.abs(P7, 'NYJ-CB1', [[52, 36.2], [57.4, 37.6]], { move: true, delay: 200, dur: 1500 }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[35, M], [59.5, 35.6]], move: true, delay: 1100, dur: 700 },
  ];

  // intentional grounding: QB under pressure throws it away to nobody
  const P11 = [...T(40), { ...F.ball(32.5, M - 1), delay: 850 }];
  const R11 = [
    ...R.blocks(P11, ['LT', 'LG', 'C', 'RG'], 0.4, 0, { delay: 0 }),
    R.abs(P11, 'NE-QB', [[32.5, M - 1]], { move: true, delay: 200, dur: 700 }),
    R.abs(P11, 'NYJ-DE2', [[37, 31], [33.6, M + 0.4]], { move: true, delay: 200, dur: 1000, k: 'run' }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[32.5, M - 1], [36, 18.5]], move: true, delay: 950, dur: 550 },
  ];

  // officiating crew around a NE snap at the NE 40
  const REF = (id, x, y) => ({ id: `OF-${id}`, t: 'REF', pos: id, lbl: id, shape: 'ref', hl: true, x, y });
  const CREW = [REF('R', 37, 31.5), REF('U', 38, 21.5), REF('DJ', 50, 52.6), REF('LJ', 50, 0.8), REF('FJ', 70, 11), REF('SJ', 69, 41), REF('BJ', 76, M)];

  FD.CH.push({
    title: 'Penalties', sub: 'Flags, yardage, signals, the crew, and replay',
    base: { bug: {} },
    steps: [
      {
        title: 'Flag on the play',
        sfx: { n: 'whistle', at: 1500 },
        bug: { reset: true, hs: 7, as: 3, q: '2ND', clk: '8:41', poss: 'NE', down: 1, dist: 10, flag: true },
        cam: { x: 46, y: 26.67, w: 50 }, off: 'NE', los: 40, fd: 50, ball: false, dlbl: false,
        players: P1, routes: R1, zones: [],
        marks: [{ id: 'fl', type: 'flag', x: 40.3, y: 23.2, delay: 600 }],
        l3: { k: 'Yellow flag', t: 'Flag on the play', s: 'An official saw a foul. The play still runs to the end.' },
        notes: {
          p: ['Patriots run inside for 6 yards. But look: a yellow flag flies in at the line.',
            'An official throws the flag at the spot of a foul. The play is NOT stopped; it runs to the end, then the officials sort it out.',
            'The score bug turns yellow: FLAG. The Referee will announce the foul, the player\'s number, and the result.'],
          a: 'The flag is a referee\'s bookmark: "something happened here, we\'ll come back to it."',
          x: 'Some fouls kill the play immediately (false start, encroachment: dead-ball fouls). Live-ball fouls like holding let the play finish so the offended team can choose the better outcome.',
        },
      },
      {
        title: 'Accept or decline',
        players: [], routes: [],
        bug: { flag: true, down: 1, dist: 10 },
        cam: { x: 48, y: 26.67, w: 56 },
        marks: [PREV,
          { id: 'acc-b', type: 'ball', x: 30, y: M }, { id: 'acc', type: 'text', x: 30, y: 24, t: 'ACCEPT → 1st & 20', size: 1.3, c: 'y' },
          { id: 'dec-b', type: 'ball', x: 46, y: M }, { id: 'dec', type: 'text', x: 47, y: 30.5, t: 'DECLINE → 2nd & 4', size: 1.3 },
          { id: 'ms', type: 'measure', x1: 30, x2: 40, y: 38, t: '10 yards back', size: 1.3 }],
        ov: [{ id: 'how', type: 'panel', pos: 'r', k: 'How a penalty works', t: 'The other team chooses',
          items: ['Foul by the **offense**: ball moves **back**, same down is **replayed**', 'Foul by the **defense**: ball moves **forward**, usually a fresh **1st & 10**', 'The **offended team** may **accept** or **decline**', 'Most fouls are measured from the **previous spot**'] }],
        l3: { k: 'Holding, #64 offense', t: 'Accept or decline?', s: 'The Jets pick: 1st & 20 from the NE 20, or 2nd & 4 at the NE 36' },
        notes: {
          p: ['It\'s holding on the Patriots\' left guard: 10 yards (12-1-3).',
            'The JETS choose. Accept: the 6-yard run is wiped out, ball back 10 yards from the previous spot, and the down is replayed: 1st & 20.',
            'Decline: the play stands as if there were no foul (14-1-1): 2nd & 4. Obvious choice: accept.',
            'Defensive fouls work the other way: yards forward, and in the 2026 rulebook almost every defensive foul gives a new 1st & 10 (14-1-2 Item 5). The exceptions are the pre-snap 5-yarders: offside, encroachment, neutral zone, delay of game, too many men, illegal substitution.'],
          x: 'For fouls during a run, the NFL uses the "three-and-one" method from a basic spot (Rule 14, Basic Spot / Three-and-One); offensive fouls behind the line of scrimmage go from the previous spot.',
        },
      },
      {
        title: 'False start',
        bug: { flag: true, down: 1, dist: 15 },
        cam: { x: 46, y: 26.67, w: 56 }, los: 35, fd: 50,
        players: F.hl(T(35), ['NE-RT']), routes: [],
        marks: [PREV, MS(35, 40, '5 yards'), FLAG(T(35), 'NE-RT')],
        ov: SIG({ sig: 9, name: 'False start', yds: '5 yards', af: false, desc: 'An offensive player moves before the snap. Dead ball, no play.' }),
        l3: { k: 'Offense · pre-snap', t: 'False start: 5 yards', s: '1st & 10 becomes 1st & 15' },
        notes: {
          p: ['A set offensive player flinches before the snap: false start. 5 yards (7-4-2).',
            'Whistle immediately. The play never happens; the ball moves back 5 from the line of scrimmage.',
            'Same down, longer distance: 1st & 15.',
            'Signal 9: forearms rolled over each other.'],
          a: 'A false start in a sprint race: you jumped the gun.',
          x: 'Crowd noise causes false starts: road offenses use silent counts. The QB can legally draw the defense offside with his cadence, but an obvious attempt by the QB to do so is itself a false start (7-4-2 Item 5).',
        },
      },
      {
        title: 'Offside · encroachment · neutral zone',
        bug: { flag: true, down: 1, dist: 5 },
        cam: { x: 46, y: 26.67, w: 56 }, los: 45, fd: 50,
        players: F.hl(T(45), ['NYJ-DE2']), routes: [],
        marks: [PREV, MS(40, 45, '+5 yards'), FLAG(T(45), 'NYJ-DE2', 1, 1.6)],
        ov: SIG({ sig: 21, name: 'Offside · Encroachment · Neutral zone infraction', yds: '5 yards', af: false, desc: 'A defender is across the line at the snap, touches an opponent, or draws a flinch.' }),
        l3: { k: 'Defense · at the snap', t: 'Offside: 5 yards', s: '1st & 10 becomes 1st & 5 (no automatic first down)' },
        notes: {
          p: ['Defensive version of jumping early: three names, same 5 yards, same signal (hands on hips).',
            'Offside: the defender is beyond the line when the ball is snapped (7-4-5). The play goes on: the offense gets a "free play".',
            'Encroachment: he crosses and touches an offensive player before the snap (7-4-3). Neutral zone infraction: he moves into the neutral zone and makes an offensive player flinch (7-4-4).',
            'These are the exceptions in 14-1-2 Item 5: NO automatic first down, unless the 5 yards reach the line to gain.'],
          a: 'Offside is a runner leaning over the start line; encroachment is bumping the guy next to you.',
          x: 'Free play: because offside is a live-ball foul, a QB who sees the flag throws deep: if it fails, the offense simply accepts the 5 yards.',
        },
      },
      {
        title: 'Offensive holding',
        bug: { flag: true, down: 1, dist: 20 },
        cam: { x: 42, y: 26.67, w: 56 }, los: 30, fd: 50,
        players: F.hl(T(30), ['NE-LT']), routes: [],
        marks: [PREV, MS(30, 40, '10 yards'), FLAG(T(30), 'NE-LT')],
        ov: SIG({ sig: 11, name: 'Holding (offense)', yds: '10 yards', af: false, desc: 'A blocker grabs and restricts a defender instead of blocking him.' }),
        l3: { k: 'Offense · during the play', t: 'Holding: 10 yards', s: 'The most called foul in football. Replay the down.' },
        notes: {
          p: ['Offensive holding: a blocker grabs a defender and restricts him. 10 yards (12-1-3).',
            'Usually from the previous spot, and the down is replayed: 1st & 20.',
            'Signal 11: grabbing one wrist in front of the chest.',
            'Offensive holding is the most frequently called penalty in the NFL.'],
          x: 'If the hold happens in the offense\'s own end zone, it\'s a safety (Rule 14 safety enforcement). Holds downfield on a run go from the spot of the foul (three-and-one).',
        },
      },
      {
        title: 'Defensive holding',
        bug: { flag: true, down: 1, dist: 10 },
        cam: { x: 47, y: 26.67, w: 58 }, los: 45, fd: 55,
        players: F.hl(T(45), ['NYJ-CB1']), routes: [],
        marks: [PREV, MS(40, 45, '+5 yards & 1st down'), FLAG(T(45), 'NYJ-CB1', -1.5, 1.6)],
        ov: SIG({ sig: 11, name: 'Holding (defense)', yds: '5 yards', af: true, desc: 'A defender grabs a receiver or blocker before the pass is thrown.' }),
        l3: { k: 'Defense · during the play', t: 'Defensive holding', s: 'Only 5 yards, but an automatic first down' },
        notes: {
          p: ['Same signal, different team. Defensive holding: 5 yards AND an automatic first down (12-1-6).',
            'So 1st & 10 at the NE 30 becomes 1st & 10 at the NE 35, with a new set of downs.',
            'On 3rd & 15 this is huge: 5 yards would not reach the line, but the automatic first down keeps the drive alive.'],
          x: 'Illegal contact (signal 20) is the cousin: a defender contacting a receiver more than 5 yards downfield before the ball is thrown. Also 5 yards + automatic first down (8-4-3).',
        },
      },
      {
        title: 'Defensive pass interference',
        sfx: { n: 'whistle', at: 1900 },
        bug: { flag: true, down: 1, dist: 10 },
        cam: { x: 50, y: 27, w: 64 }, los: 40, fd: 50, ball: false,
        players: P7, routes: R7,
        marks: [{ id: 'fl', type: 'flag', x: 57.6, y: 39.4, delay: 1500 },
          { id: 'ms', type: 'measure', x1: 40, x2: 58, y: 17.8, t: '+18 yards: ball at the spot of the foul', size: 1.3, delay: 2300 },
          { id: 'sp', type: 'line', x1: 58, y1: 12, x2: 58, y2: 34, c: '#60a5fa', w: 0.4, delay: 2300 }],
        ov: SIG({ sig: 17, name: 'Pass interference (defense)', yds: 'Spot of the foul', af: true, extra: 'In the end zone: ball at the 1' }),
        l3: { k: 'Defense · ball in the air', t: 'DPI: spot foul', s: 'Ball placed where the foul happened · automatic first down' },
        notes: {
          p: ['Deep ball, and the cornerback grabs the receiver before the ball arrives: defensive pass interference.',
            'No fixed yardage: it\'s a "spot foul". First down for the offense at the spot of the foul (8-5 penalty). Here, 18 yards.',
            'That can be 40+ yards, which makes DPI the most expensive foul in the game.',
            'If it happens in the end zone, the ball goes to the 1-yard line, first down.',
            'Signal 17: both hands pushed forward from the shoulders.'],
          a: 'You can\'t stop someone catching a ball by holding their arms; if you do, they get the yards as if they had made it.',
          x: 'If the previous spot was already inside the 2, end-zone DPI is enforced half the distance to the goal instead. College caps DPI at 15 yards unless intentional.',
        },
        tags: ['COLLEGE: DPI is a 15-yard maximum'],
      },
      {
        title: 'Offensive pass interference',
        bug: { flag: true, down: 1, dist: 20 },
        cam: { x: 42, y: 26.67, w: 56 }, los: 30, fd: 50, ball: false,
        players: F.hl(T(30), ['NE-X']), routes: [],
        marks: [PREV, MS(30, 40, '10 yards'), FLAG(T(30), 'NE-X', 1.2, 1.6)],
        ov: SIG({ sig: 17, name: 'Pass interference (offense)', yds: '10 yards', af: false, desc: 'A receiver pushes off or blocks downfield before the catch.' }),
        l3: { k: 'Offense · ball in the air', t: 'OPI: 10 yards', s: 'Push-off by the receiver · from the previous spot' },
        notes: {
          p: ['Same signal, other side: the receiver shoves the defender to get open. Offensive pass interference.',
            'Penalty: 10 yards from the previous spot (8-5 penalty), down replayed: 1st & 20.',
            'Also OPI: blocking more than a yard downfield before the pass is thrown (8-5-4).'],
          x: 'Screens are the classic OPI trap: linemen release downfield early. Ineligible man downfield (signal 19) is the related 5-yard foul (8-3-1).',
        },
      },
      {
        title: 'Roughing the passer',
        bug: { flag: true, down: 1, dist: 10 },
        cam: { x: 52, y: 26.67, w: 64 }, los: 55, fd: 65,
        players: F.hl(T(55), ['NYJ-DE1']), routes: [],
        marks: [PREV, MS(40, 55, '+15 yards & 1st down'), FLAG(T(55), 'NYJ-DE1', 1.2, -1.4)],
        ov: SIG({ sig: 10, name: 'Roughing the passer', yds: '15 yards', af: true, k: 'personal foul', desc: 'Late, high, or driving hit on the quarterback after the throw.' }),
        l3: { k: 'Defense · protecting the QB', t: 'Roughing the passer', s: '15 yards + automatic first down' },
        notes: {
          p: ['The pass is gone, and a defender still drives the quarterback into the ground: roughing the passer.',
            '15 yards and an automatic first down (12-2-11). Can include disqualification if flagrant.',
            'Signal: personal foul (wrists crossed over the head) plus a raised arm swinging forward.',
            'Hits to the head or neck, or landing on him with full body weight, are also roughing.'],
          x: 'If the pass was completed, enforcement is typically added to the end of the play; an incompletion goes from the previous spot. Either way it\'s a new 1st & 10.',
        },
      },
      {
        title: 'Personal foul · facemask',
        bug: { flag: true, down: 1, dist: 10 },
        cam: { x: 56, y: 26.67, w: 64 }, los: 59, fd: 69,
        players: F.hl(T(59), ['NYJ-MIKE']), routes: [],
        marks: [{ id: 'eor', type: 'line', x1: 44, y1: 12, x2: 44, y2: 43, c: 'w', w: 0.18, dash: true },
          { id: 'eor-t', type: 'text', x: 43, y: 40, t: 'run ended here', anchor: 'end', size: 1.1 },
          MS(44, 59, '+15 yards & 1st down'), FLAG(T(59), 'NYJ-MIKE', 1, 1.6)],
        ov: SIG({ sig: 10, name: 'Personal foul · unnecessary roughness', yds: '15 yards', af: true, extra: 'Facemask: signal 33, also 15', desc: 'Late hit, hit out of bounds, or a hit on a defenseless player.' }),
        l3: { k: 'Defense · after a 4-yard run', t: 'Personal foul: 15 yards', s: 'Unnecessary roughness or facemask, + 1st down vs the defense' },
        notes: {
          p: ['A 4-yard run, then a late shot after the whistle: unnecessary roughness, a personal foul. 15 yards (12-2-8).',
            'Here enforced from where the run ended, the NE 34, to the NE 49. By the defense, it\'s also an automatic first down.',
            'Grabbing and twisting the facemask is its own 15-yarder with its own signal (33), also an automatic first down vs the defense (12-2-15).',
            'By the offense, a personal foul is 15 yards back, no first-down bonus for anyone.'],
          x: 'For fouls during a run, the basic spot is the dead-ball spot; defensive fouls go from there (three-and-one). Flagrant personal fouls can also mean disqualification, and the league office can instruct the crew to eject (19-1-2).',
        },
      },
      {
        title: 'Intentional grounding',
        sfx: { n: 'whistle', at: 1700 },
        bug: { flag: true, down: 1, dist: 10 },
        cam: { x: 44, y: 26.67, w: 56 }, los: 40, fd: 50, ball: false,
        players: P11, routes: R11,
        marks: [{ id: 'nb', type: 'circle', x: 36, y: 18.5, r: 2, c: '#ef4444', delay: 1500 },
          { id: 'nb-t', type: 'text', x: 33.6, y: 18.9, t: 'no receiver', anchor: 'end', size: 1.1, c: '#fca5a5', delay: 1500 },
          { id: 'fl', type: 'flag', x: 34, y: 29.2, delay: 1300 },
          { id: 'ms', type: 'measure', x1: 30, x2: 40, y: 40.5, t: '10 yds + loss of down', size: 1.2, delay: 2200 },
          { id: 'nw-b', type: 'ball', x: 30, y: M, delay: 2400 }],
        ov: SIG({ sig: 16, name: 'Intentional grounding', yds: 'Loss of down + 10 yds (or spot of pass)', af: false, extra: 'Then signal 23: loss of down' }),
        l3: { k: 'Offense · QB under pressure', t: 'Intentional grounding', s: 'Throwing it away to nobody to dodge a sack: 2nd & 20' },
        notes: {
          p: ['The quarterback is about to be sacked and throws the ball into the ground where no receiver is: intentional grounding (8-2-1).',
            'Penalty: loss of down AND 10 yards from the previous spot, or at the spot of the pass if that is worse (more than 10 yards back).',
            'Here he threw from 7 yards back, so it\'s 10 yards: 1st & 10 becomes 2nd & 20.',
            'If he throws it from his own end zone: safety, 2 points for the defense.'],
          x: 'Not grounding if the QB is outside the pocket and the ball lands at or beyond the line of scrimmage (8-2-1 Item 1), or if he spikes it immediately to stop the clock (Item 3).',
        },
      },
      {
        title: 'Signals recap',
        bug: { flag: false, down: 1, dist: 10 },
        cam: { x: 60, y: 26.67, w: 132 }, los: null, fd: null, ball: false,
        players: [], routes: [], marks: [],
        ov: [{ id: 'sgs', type: 'signals', pos: 'c', items: [
          { sig: 9, name: 'False start', yds: '5' }, { sig: 21, name: 'Offside · encroachment', yds: '5' },
          { sig: 8, name: 'Delay of game', yds: '5' }, { sig: 32, name: 'Too many men', yds: '5' },
          { sig: 11, name: 'Holding', yds: 'O 10 · D 5', af: true }, { sig: 20, name: 'Illegal contact', yds: '5', af: true },
          { sig: 17, name: 'Pass interference', yds: 'D spot · O 10', af: true }, { sig: 16, name: 'Intentional grounding', yds: 'Loss of down + 10' },
          { sig: 10, name: 'Personal foul · roughing', yds: '15', af: true }, { sig: 33, name: 'Facemask', yds: '15', af: true },
          { sig: 26, name: 'Unsportsmanlike', yds: '15', af: true }],
          foot: '"Auto 1st" applies when the DEFENSE commits it (2026 rule 14-1-2 Item 5)' }],
        l3: { k: 'Read the Referee', t: 'The common signals', s: 'Five-yarders, ten-yarders, fifteen-yarders' },
        notes: {
          p: ['The Referee explains every foul with a signal. Here are the ones you\'ll see every game.',
            'Pre-snap 5-yarders: false start, offside, delay of game (40-second play clock runs out, 4-6), too many men on the field (5-1-1).',
            'Holding and pass interference are the big "during the play" fouls; personal fouls, facemask and unsportsmanlike conduct (taunting, excessive celebration: 12-3-1) are 15.',
            'Rule of thumb: any defensive foul except the pre-snap ones gives the offense a fresh first down.'],
          a: 'Like learning traffic signs: a dozen cover 90% of the road.',
          x: 'The rulebook lists 36 official signals. Too many men on the field and delay of game by the defense do not give an automatic first down; they are explicit exceptions in 14-1-2 Item 5.',
        },
      },
      {
        title: 'The officiating crew',
        bug: { flag: false },
        cam: { x: 68, y: 24, w: 104 }, los: 50, fd: 60, ball: { x: 50, y: M },
        players: [...F.dim(T(50), []), ...CREW], routes: [], marks: [],
        l3: { k: 'Rule 19', t: 'Seven officials', s: 'R · U · DJ · LJ · FJ · SJ · BJ' },
        notes: {
          p: ['Seven officials run every NFL game (19-1-1): Referee, Umpire, Down Judge, Line Judge, Field Judge, Side Judge, Back Judge.',
            'The Referee (R, white cap) is the crew chief behind the offense: watches the QB, announces penalties. The Umpire (U) watches the line play.',
            'Down Judge and Line Judge straddle the line of scrimmage on opposite sidelines: offside, false starts, and the chain crew.',
            'Field Judge and Side Judge are deep on each sideline; the Back Judge is deepest in the middle: pass interference and long plays.',
            'The Referee has final authority on any disagreement (19-1-3).'],
          a: 'Seven cameras at seven angles; each official owns a slice of the field.',
          x: 'Positions come from the NFL Mechanics Manual, not the rulebook (19-1-4). Since 2010 the Umpire usually lines up in the offensive backfield except late in halves. A Replay Official and league officiating staff in New York support the crew (19-2).',
        },
      },
      {
        title: 'Replay & challenges',
        players: [], routes: [], marks: [], los: null, fd: null, ball: false,
        cam: { x: 60, y: 26.67, w: 132 },
        ov: [{ id: 'rp', type: 'panel', pos: 'c', k: 'Rule 15 · Instant replay', t: 'Red flag or booth review',
          items: ['Each coach gets **2 challenges**: throw the **red flag** before the next snap', 'Win at least one → a **3rd** challenge. Never a 4th', 'A challenge costs a **timeout** if it fails', 'The **booth** reviews: every **score**, every **turnover**, failed 4th downs, and everything after the **2-minute warning** and in OT', 'Change only on **clear and obvious** video evidence'] }],
        l3: { k: 'Second look', t: 'Replay & challenges', s: 'Coaches challenge with a red flag; the booth handles the rest' },
        notes: {
          p: ['Each team gets at least two challenges per game. The head coach throws a red flag onto the field before the next snap (15-1-1).',
            'Each challenge needs an available timeout; if the challenge fails, the team is charged a timeout. Win at least one and you earn a third, never a fourth.',
            'Some plays only the Replay Official can review: everything after the two-minute warning, all of overtime, every scoring play and Try, interceptions, fumbles recovered by the opponent, failed 4th downs, and kicking-team recoveries (15-1-2).',
            'The ruling changes only with "clear and obvious" video evidence. Senior VP of Officiating in New York makes the call with the Referee (15-2).',
            'Judgment fouls like holding are generally not reviewable.'],
          a: 'The red flag is a coach\'s "objection, your honor", with a timeout as the bail.',
          x: 'Reviewable: possession, touching, goal line, boundaries, line of scrimmage, line to gain, number of players (15-3). A team with no timeouts that challenges anyway: 15-yard penalty.',
        },
      },
    ],
  });
})(window.FD);
