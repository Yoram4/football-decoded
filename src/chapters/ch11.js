/* Chapter 11 — Film Room (expert blueprint skin for the whole chapter) */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;

  // ---------- Play-action: NE ball on own 35 (x=45), attacking right ----------
  const PL = 45;
  const oPA = F.off(PL, { pers: '12', set: 'under', strong: -1, wide: 16 });
  const dPA = F.def(PL, { team: 'NYJ', front: '43', cov: '2', strong: -1, wide: 16 });
  const CAM_PA = { x: 60, y: 25.5, w: 80 };
  const fake = [
    R.abs(oPA, 'RB', [[41.2, 25.2], [44, 22.8]], { id: 'fake', k: 'run', move: true, delay: 150, dur: 700 }),
    R.abs(oPA, 'QB', [[41.8, 25.5], [40.6, 26], [38.8, 26.4]], { id: 'qb-pa', k: 'route', dash: true, move: true, delay: 100, dur: 1000, curve: true }),
    R.abs(dPA, 'WILL', [[47.6, 30.2]], { id: 'lb-W', k: 'route', c: 'b', move: true, delay: 350, dur: 550 }),
    R.abs(dPA, 'MIKE', [[47.5, 25.4]], { id: 'lb-M', k: 'route', c: 'b', move: true, delay: 350, dur: 550 }),
    R.abs(dPA, 'SAM', [[47.2, 21.6]], { id: 'lb-S', k: 'route', c: 'b', move: true, delay: 350, dur: 550 }),
    ...R.blocks(oPA, [...R.OL, 'TE', 'TE2'], 1.0, -0.4),
  ];
  const dig = R.make(oPA, 'Z', [[11, 0], [12, 14]], { move: true, c: 'r', delay: 100, dur: 1300 });
  const digEnd = dig.d[dig.d.length - 1];
  const shot = [
    dig,
    R.make(oPA, 'X', [[16, 0]], { move: true, delay: 100, dur: 1400 }),
    R.abs(dPA, 'CB1', [[59, 43.4]], { id: 'cb1-run', k: 'route', c: 'b', move: true, delay: 200, dur: 1400 }),
    R.abs(dPA, 'CB2', [[52.5, 8.6]], { id: 'cb2-sink', k: 'route', c: 'b', move: true, delay: 200, dur: 800 }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[38.8, 26.4], digEnd], move: true, delay: 950, dur: 550 },
  ];

  // ---------- RPO: NE ball on own 45 (x=55) ----------
  const RL = 55;
  const oR = F.off(RL, { pers: '11', wide: 16 });
  const dR = F.patch(F.def(RL, { team: 'NYJ', front: 'nickel', cov: '3', wide: 16 }), { NB: { x: 60.5, y: 18.2 } });
  const CAM_R = { x: 68, y: 25.5, w: 80 };
  const rpoBase = [...R.blocks(oR, R.OL, 1.0, -0.6), ...R.blocks(oR, ['X'], 1.5, 0)];
  const lbFlow = [
    R.abs(dR, 'WILL', [[57.8, 23.6]], { id: 'lb-W', k: 'route', c: 'b', move: true, delay: 250, dur: 500 }),
    R.abs(dR, 'MIKE', [[58.2, 27.2]], { id: 'lb-M', k: 'route', c: 'b', move: true, delay: 250, dur: 500 }),
  ];
  const slantA = R.make(oR, 'H', [[1.5, 0], [8, 6]], { move: true, c: 'r', delay: 150, dur: 800 });
  const slantB = R.make(oR, 'H', [[1.5, 0], [8, 6]], { move: true, delay: 160, dur: 800 });
  const rpoA = [...rpoBase, ...lbFlow, slantA,
    R.abs(oR, 'RB', [[51.2, 26.9], [53.8, 23.8]], { id: 'mesh', k: 'run', move: true, delay: 150, dur: 700 }),
    R.abs(dR, 'NB', [[57.6, 21]], { id: 'nb', k: 'route', c: 'b', move: true, delay: 250, dur: 500 }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[50, M], slantA.d[2]], move: true, delay: 650, dur: 350 }];
  const rpoB = [...rpoBase, ...lbFlow, slantB,
    R.abs(oR, 'RB', [[51.2, 26.9], [54.5, 23.6], [59, 22.4], [64, 22]], { id: 'mesh', k: 'run', move: true, curve: true, delay: 150, dur: 1400 }),
    R.abs(dR, 'NB', [[61.2, 15.6]], { id: 'nb', k: 'route', c: 'b', move: true, delay: 250, dur: 500 })];
  const readMk = [{ id: 'rd', type: 'text', x: 62.6, y: 18.6, t: 'READ HIM', c: 'y', size: 1.1, anchor: 'start' }];

  // ---------- Jets ball, Patriots defense (x=70, Jets attack left) ----------
  const LOS = 70, W = 16;
  const CAM = { x: 71, y: 25.5, w: 84 };
  const CAMP = { x: 86, y: 25.5, w: 84 };
  const o11 = F.off(LOS, { team: 'NYJ', pers: '11', wide: W });
  const dN3 = F.def(LOS, { team: 'NE', front: 'nickel', cov: '3', wide: W });
  const dN2 = F.def(LOS, { team: 'NE', front: 'nickel', cov: '2', wide: W });
  const dN1 = F.def(LOS, { team: 'NE', front: 'nickel', cov: '1', press: true, wide: W });
  const zn = (id, cx, cy, rx, ry, c, lbl, delay = 1000) => ({ id, ell: [cx, cy, rx, ry], c, lbl, ly: +(cy - ry * 0.55).toFixed(2), op: 0.16, delay });
  const drops = (def, map, delay = 150, dur = 1200) => Object.entries(map).map(([id, [x, y]]) =>
    R.abs(def, id, [[x, y]], { id: 'd-' + id, k: 'route', c: 'b', move: true, delay, dur }));
  const ROT = { FS: [47, M], SS: [63.5, 40.5], CB1: [49, 9.5], CB2: [49, 43.5], NB: [62.5, 12.5], WILL: [61.5, 21.5], MIKE: [61.5, 31.5] };
  const c3Zones = [
    zn('z-d1', 48, 9.4, 7.5, 8.4, '#38bdf8', 'DEEP 1/3'), zn('z-d2', 46, M, 7.5, 8.4, '#38bdf8', 'DEEP 1/3'), zn('z-d3', 48, 44, 7.5, 8.4, '#38bdf8', 'DEEP 1/3'),
    zn('z-u1', 62.5, 12.5, 3.4, 4.4, '#facc15', 'CURL/FLAT'), zn('z-u2', 61.5, 21.5, 3.2, 4.2, '#facc15', 'HOOK'),
    zn('z-u3', 61.5, 31.5, 3.2, 4.2, '#facc15', 'HOOK'), zn('z-u4', 63.5, 40.5, 3.4, 4.4, '#facc15', 'CURL/FLAT'),
  ];
  const mof = (c, lbl) => ({ id: 'mof', type: 'rect', x: 46, y: 20.6, w: 14, h: 12.1, c, op: 0.16, lbl, ly: 22.2, size: 1.2, lc: c, pulse: true });

  // QB answers: double-A-gap mug, hot slant
  const dMug = F.patch(dN1, { WILL: { x: 67.6, y: 25.6 }, MIKE: { x: 67.6, y: 27.8, lbl: '52' }, DT1: { y: 23.2 }, DT2: { y: 30.3 } });
  const hot = R.make(o11, 'H', 'slant', { move: true, c: 'r', delay: 250, dur: 600 });
  const hotPlay = [hot,
    R.abs(dMug, 'WILL', [[71.2, 25.6], [73, 26]], { id: 'bz-W', k: 'route', c: 'r', move: true, delay: 0, dur: 1100 }),
    R.abs(dMug, 'MIKE', [[71.2, 27.9], [73, 27.4]], { id: 'bz-M', k: 'route', c: 'r', move: true, delay: 0, dur: 1100 }),
    ...R.blocks(o11, R.OL, 0.5), ...R.blocks(o11, ['RB'], 1.6, -0.5),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[75, M], hot.d[2]], move: true, delay: 600, dur: 350 }];

  FD.CH.push({
    title: 'Film Room', sub: 'Play-action, RPOs, pre-snap reads, disguise', deep: true,
    base: { bug: {} },
    steps: [
      {
        title: 'Play-action: sell the run',
        bug: { reset: true, hs: 21, as: 17, q: '3RD', clk: '4:05', down: 1, dist: 10, poss: 'NE' },
        off: 'NE', dlbl: true, los: PL, fd: PL + 10, lbl: false, ball: false,
        cam: CAM_PA,
        players: [...oPA, ...F.hl(dPA, ['WILL', 'MIKE', 'SAM'])],
        routes: fake, zones: [], marks: [],
        l3: { k: 'Film Room · Play-action', t: 'Sell the run', s: 'Fake handoff, run-block look: linebackers trigger downhill' },
        notes: {
          p: ['Patriots ball again, 1st & 10 on their own 35. Heavy personnel (12: two tight ends), quarterback under center: everything screams run.',
            'QB opens, fakes the handoff, the line fires off like a run block. Linebackers are coached to read the backfield and the guards; they see run and step downhill.',
            'Each step forward by a linebacker is a step out of his pass drop. That is the whole point.',
            'Legal note: the faking back can be tackled as if he had the ball until he leaves the pocket area (Rule 8-4-6).'],
          a: 'A magician\'s misdirection: everyone watches the hand that seems to hold the coin.',
          x: 'PA works best off your actual run game: same OL footwork, same backfield action. "Gap" fakes (pull a guard) are especially strong because LBs key the pulling guard; the LB "run-pass conflict" is the target.',
        },
      },
      {
        title: 'Play-action: throw behind them',
        players: [...F.hl(oPA, ['Z']), ...dPA, F.ball(38.8, 26.4)],
        routes: [...fake, ...shot],
        sfx: [{ n: 'cheer', at: 1550 }],
        l3: { k: 'Film Room · Play-action', t: 'The dig behind the LBs', s: 'The window opens where the linebackers just were' },
        notes: {
          p: ['Z runs a deep dig: 11–12 yards upfield, then flat across the middle, into the space the linebackers vacated.',
            'X runs vertical to keep the corner and safety on that side busy. Against two-high, the dig settles in front of the safeties and behind the linebackers.',
            'QB finishes the fake, sets, throws on time. The linebackers are now two steps too shallow.',
            'That\'s the "conflict": a run fit and a pass drop can\'t both be honored by the same defender.'],
          a: 'Like a fake knock at the front door while your friend walks in the back.',
          x: 'Common PA tags: dig/post ("Yankee" style two-deep shots), deep over, boot with a flood. Offenses play-action more on early downs because the run threat is real there.',
        },
      },
      {
        title: 'RPO: he crashes → throw',
        bug: { down: 1, dist: 10, clk: '3:38' },
        los: RL, fd: RL + 10, cam: CAM_R,
        players: [...oR, ...F.read(dR, ['NB']), F.ball(50, M)],
        routes: rpoA, marks: readMk,
        sfx: [{ n: 'hit', at: 1050 }],
        l3: { k: 'Film Room · RPO', t: 'Run-pass option: throw', s: 'The overhang defender crashes on the run, the slant opens behind him' },
        notes: {
          p: ['RPO = run-pass option. The line blocks a run (inside zone). The QB doesn\'t read who to block, he reads one unblocked "conflict" defender.',
            'Here: the nickel back, aligned in the apex between the tackle box and the slot receiver.',
            'If he crashes to stop the run, he\'s left the slot. QB pulls the ball from the back\'s belly and throws the slant into the space he left.',
            'It must be fast: linemen are run-blocking, and an ineligible lineman more than 1 yard downfield before the pass is a 5-yard foul (Rule 8-3-1).'],
          a: 'A 2-on-1 fast break: the defender has to pick one, and the QB gives it to whichever one he didn\'t pick.',
          x: 'Post-snap RPO: QB reads the overhang\'s first step; the throw is quick so OL aren\'t illegally downfield. Defenses answer by "spill/fit" games, having the safety replace the crasher, or pre-snap disguise of who the conflict defender is.',
        },
      },
      {
        title: 'RPO: he stays → hand off',
        players: [...oR, ...F.read(dR, ['NB'])],
        routes: rpoB, marks: readMk,
        sfx: [{ n: 'hit', at: 1500 }],
        l3: { k: 'Film Room · RPO', t: 'Run-pass option: give', s: 'He stays with the slot, so the box is light: hand it off' },
        notes: {
          p: ['Same play, same read. This time the nickel back stays wide with the slot receiver.',
            'Now he\'s not in the run fit. The box is one defender short, so the QB hands off.',
            'The slant is still run as a decoy, so every RPO looks identical at the snap.',
            'Either way the defender is wrong: that\'s why RPOs "put a defender in conflict".'],
          a: 'Rock-paper-scissors where you get to see his hand before you throw yours.',
          x: 'Box count math: if the defense has more box defenders than the offense has blockers + the QB read, throw; if not, run. RPOs turn that count into a post-snap, one-defender decision.',
        },
      },
      {
        title: 'Pre-snap read: MOFC',
        bug: { poss: 'NYJ', down: 1, dist: 10, clk: '1:55' },
        off: 'NYJ', los: LOS, fd: LOS - 10, ball: { x: LOS, y: M }, cam: CAMP,
        players: [...o11, ...F.hl(dN3, ['FS'])],
        routes: [], zones: [],
        marks: [mof('#f87171', 'MIDDLE CLOSED')],
        ov: [{ id: 'mof', type: 'panel', pos: 'r', k: 'The QB\'s first look', t: 'MOFC: one high safety',
          items: ['Middle Of Field **Closed**: a safety sits in the deep middle', 'Suggests **Cover 1** (man) or **Cover 3** (zone)', 'Vs Cover 1: win 1-on-1 outside, crossers', 'Vs Cover 3: seams, curl/flat, four verticals'] }],
        l3: { k: 'Patriots on defense · Pre-snap', t: 'MOFC: middle closed', s: 'One deep safety: think Cover 1 or Cover 3' },
        notes: {
          p: ['Back on defense. Now we sit in the Jets quarterback\'s helmet before the snap.',
            'First look: the safeties. One safety deep in the middle = "middle of field closed" (MOFC).',
            'One-high usually means Cover 1 or Cover 3. Both protect the deep middle, so the post route is the hard throw.',
            'Then the QB narrows it: corners in press with eyes on receivers = man (1); corners soft with eyes on the QB = zone (3).'],
          a: 'Reading the safety is like checking the goalkeeper\'s position before taking a penalty.',
          x: 'Also read the alignment details: a single-high safety that\'s off-center is often tipping a rotation, and the "rolled" strong safety\'s depth hints at Cover 3 sky vs. a robber.',
        },
      },
      {
        title: 'Pre-snap read: MOFO',
        players: [...o11, ...F.hl(dN2, ['FS', 'SS'])],
        marks: [mof('#4ade80', 'MIDDLE OPEN')],
        ov: [{ id: 'mof', type: 'panel', pos: 'r', k: 'The QB\'s first look', t: 'MOFO: two high safeties',
          items: ['Middle Of Field **Open**: two safeties split the deep field', 'Suggests **Cover 2** or **Cover 4** (quarters), or 2-man', 'Box is lighter (6): the run is attractive', 'Vs 2: seams, hole shots · vs 4: underneath, flood the flats'] }],
        l3: { k: 'Patriots on defense · Pre-snap', t: 'MOFO: middle open', s: 'Two deep safeties: think Cover 2 or Cover 4' },
        notes: {
          p: ['Two safeties deep, splitting the field: "middle of field open" (MOFO).',
            'Two-high usually means Cover 2, Cover 4 (quarters), or 2-man under.',
            'With two safeties deep, fewer defenders are near the line: a light box. Offenses love to run against that.',
            'Through the air: the middle seam between the safeties is the target vs Cover 2. Vs quarters, attack underneath.'],
          a: 'One goalkeeper in the middle vs two keepers at the posts: you aim at a different spot.',
          x: 'Two-high shells (quarters especially) became the league\'s answer to explosive passing; the trade-off is the light box, which is why run-heavy offenses with good OL see a lot of it and then see it rotate late.',
        },
      },
      {
        title: 'Disguise: show 2, play 3',
        cam: CAM, ov: [],
        players: [...o11, ...F.hl(dN2, ['FS', 'SS'])],
        routes: [...drops(dN2, ROT), R.make(o11, 'TE', 'seam', { move: true, delay: 200, dur: 1500 })],
        zones: c3Zones, marks: [],
        sfx: [{ n: 'hit2', at: 1400 }],
        l3: { k: 'Disguise', t: 'Show 2-high, rotate to 3', s: 'At the snap one safety drops down, the other spins to the middle' },
        notes: {
          p: ['The Patriots show the exact two-high look the QB just learned to read.',
            'At the snap the safety on the right rotates DOWN to a curl/flat spot; the other spins to the deep middle. The corners bail to deep thirds.',
            'Result: Cover 3. The QB who read "middle open" throws the seam right into the safety now sitting there.',
            'The defense shows one thing and plays another: post-snap rotation is how modern defenses steal a read.'],
          a: 'A goalkeeper who leans left until the kicker commits, then dives right.',
          x: 'Rotations are timed to the snap so the QB can\'t check; QBs answer by testing with motion and a hard count, and by reading the rotation after the snap ("eyes on the middle safety at the top of the drop").',
        },
      },
      {
        title: 'QB answers: Mike ID & hot routes',
        cam: CAMP, ball: false,
        players: [...F.hl(o11, ['H']), ...F.hl(dMug, ['WILL', 'MIKE']), F.ball(75, M)],
        routes: hotPlay, zones: [],
        marks: [{ id: 'mk-c', type: 'circle', x: 67.6, y: 27.8, r: 1.8, c: 'y', pulse: true }, { id: 'mk-t', type: 'text', x: 65.4, y: 28.2, t: '"52 IS THE MIKE"', c: 'y', size: 1.1, anchor: 'end' }],
        ov: [{ id: 'qa', type: 'panel', pos: 'r', k: 'Before & after the snap', t: 'How the QB answers', num: true,
          items: ['**Mike ID**: name the protection\'s key LB so all 6 blockers agree who\'s theirs', '**Check / audible**: change the play when the look is wrong for it', '**Hot route**: blitz comes, throw to where the rusher left', '**Cadence & motion**: make the defense show its hand early'] }],
        l3: { k: 'The answer', t: 'Mike ID & hot routes', s: 'Set the protection, then throw hot if they send more than you block' },
        notes: {
          p: ['Pre-snap the QB (or center) identifies "the Mike": the linebacker the protection is built around. "52 is the Mike!" tells all five linemen and the back who they block.',
            'If the look is bad for the call, he checks to another play at the line, within the 40-second play clock.',
            'If more rushers come than blockers, someone is unblocked by design. The answer is a "hot" route: here the slot turns his route into a quick slant, right where the blitzing linebacker left.',
            'Motion and hard counts make the defense move first so the QB can see man vs zone and who\'s coming.'],
          a: 'Calling out "I\'ve got the guy in red!" before the play so nobody double-covers or leaves someone free.',
          x: '"Mike" in protection is a reference point, not necessarily the real middle linebacker: the QB can declare any defender to slide the protection. Defenses counter by walking up late or rotating after the ID.',
        },
      },
    ],
  });
})(window.FD);
