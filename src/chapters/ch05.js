/* Chapter 5 — Downs & Distance (the heart of it) + interactive drive simulator */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;

  // Drive starts NE 25 (x=35). 1st & 10 → run +4 → 2nd & 6 → pass +7 → 1st & 10 at NE 36.
  const o1 = F.off(35, { pers: '12', set: 'under' }), d1 = F.def(35, { front: '43', cov: '3' });
  const run1 = R.abs(o1, 'RB', [[34, M + 0.6], [37.5, M + 1.8], [39, M + 1.5]], { k: 'run', move: true, curve: true, delay: 300, dur: 1100 });
  const o2 = F.off(39, { pers: '11' }), d2 = F.def(39, { front: 'nickel', cov: '3' });
  const slant = R.make(o2, 'X', [[1.5, 0], [7, 5]], { move: true, c: 'r', delay: 250, dur: 1000 });
  const ballFrom = [F.get(o2, 'QB').x, M], ballTo = slant.d[2];
  const o3 = F.off(46, { pers: '11' }), d3 = F.def(46, { front: 'nickel', cov: '1' });
  // 4th & 1 failure at NYJ 45 (x=65) → turnover on downs
  const o4 = F.off(75, { pers: '21', set: 'under' }), d4 = F.def(75, { front: '43', cov: '0' });
  const sneak = R.abs(o4, 'RB', [[73, M - 1], [74.6, M - 1.6]], { k: 'run', move: true, delay: 300, dur: 900 });
  const stuffed = F.patch(d4, { 'NYJ-MIKE': { x: 74.8, y: M - 1.4, hl: true } });

  FD.CH.push({
    title: 'Downs & Distance', sub: 'Four tries to gain ten yards: the heart of the game',
    base: { cam: { x: 50, y: M, w: 100 } },
    steps: [
      {
        title: '4 downs to gain 10 yards',
        bug: { reset: true, hs: 0, as: 0, q: '1ST', clk: '12:10', pc: 40, down: 1, dist: 10, poss: 'NE' },
        los: 35, fd: 45, lbl: true, players: [...o1, ...d1], routes: [],
        marks: [{ id: 'm10', type: 'measure', x1: 35, x2: 45, y: 49, t: '10 YARDS TO GO' }],
        ov: [{ id: 'st', type: 'stats', pos: 'bl', items: [{ v: '4', l: 'downs (tries)' }, { v: '10', l: 'yards to gain' }, { v: '1', l: 'new set if you make it', c: '#FACC15' }] }],
        l3: { k: 'The core rule', t: '4 downs to go 10 yards', s: 'Make it: new set of downs. Miss it: the other team gets the ball' },
        notes: {
          p: ['This is THE rule that makes football football. The offense gets 4 tries, called downs, to move the ball 10 yards.',
            'Gain 10 yards (reach the yellow line) and you earn a fresh set: "first down" again.',
            'Fail after 4 downs and the ball goes to the other team right there. That\'s why teams usually kick on 4th down.',
            'Every play starts at the blue line, the line of scrimmage. The yellow line is the target.'],
          a: 'A video game with 4 lives per level: reach the checkpoint (10 yards) and your lives refill.',
          x: 'The line to gain is set 10 yards from the spot of the snap that starts a series (3-8-3); it stays fixed until the series ends.',
        },
      },
      {
        title: '1st & 10: run for 4',
        players: [...o1, ...d1], routes: [run1, ...R.blocks(o1, [...R.OL, 'TE', 'TE2'], 1.3, 0.4)],
        marks: [{ id: 'g4', type: 'measure', x1: 35, x2: 39, y: 46.5, t: '+4', delay: 1400 }],
        sfx: [{ n: 'hit', at: 1200 }],
        l3: { k: '1st & 10 at the NE 25', t: 'Run: gain of 4', s: 'Now 2nd down. They need 6 more yards' },
        notes: {
          p: ['First down, run play. The back gets 4 yards.',
            'The ball is spotted where he was tackled. The NEXT play starts there: the blue line moves up. The yellow line stays put.'],
          a: 'The yellow line is the finish line; each play you start from wherever you got to.',
          x: 'Average NFL run gains about 4.3 yards; a 4-yard 1st-down run keeps the offense "on schedule".',
        },
      },
      {
        title: '2nd & 6',
        bug: { down: 2, dist: 6, clk: '11:31' },
        los: 39, players: [...o2, ...d2], routes: [], marks: [{ id: 'm6', type: 'measure', x1: 39, x2: 45, y: 49, t: '6 TO GO' }],
        ov: [{ id: 'dd', type: 'big', pos: 't', k: 'How you say it', t: '2nd & 6', s: '"second and six": 2nd try, 6 yards to the line' }],
        l3: { k: 'Reading the bug', t: '2nd & 6', s: 'Down number & yards still needed' },
        notes: {
          p: ['The score bug now says 2ND & 6. Down number first, then how many yards to the yellow line.',
            'You will hear announcers say "second and six", "third and long", "third and short".',
            '3rd & short (1–2 yards) favors the offense. 3rd & long (7+) favors the defense.'],
          a: 'Like a countdown: 2nd try, 6 to go.',
          x: 'Down & distance is the biggest single input in play-calling tendencies (run/pass ratios swing hard by it).',
        },
      },
      {
        title: '2nd & 6: pass for 7 → FIRST DOWN',
        players: [...o2, ...d2, F.ball(ballFrom[0], ballFrom[1])], ball: false,
        routes: [slant, R.make(o2, 'Z', 'hitch'), R.make(o2, 'H', 'out5'), R.make(o2, 'TE', 'flat'), ...R.blocks(o2, R.OL, 0.7), { id: 'bf', p: 'BALL', k: 'pass', d: [ballFrom, ballTo], move: true, delay: 900, dur: 420 }],
        marks: [{ id: 'fdtxt', type: 'text', x: 47, y: 10.5, t: 'FIRST DOWN!', size: 2, c: 'y', cls: 'hd', delay: 1500 }],
        sfx: [{ n: 'hit', at: 1450 }],
        l3: { k: '2nd & 6', t: 'Slant: gain of 7', s: 'He crossed the yellow line: brand-new set of downs' },
        notes: {
          p: ['Quick slant to the receiver, caught past the yellow line.',
            'That\'s a FIRST DOWN. The officials reset the count: 1st & 10 from the new spot.',
            'The referee signals it by pointing toward the defense\'s goal (official signal 3).'],
          a: 'You reached the checkpoint: lives refilled.',
          x: 'Here the catch point is past the line to gain; forward progress, not where the ball lands, determines the spot.',
        },
      },
      {
        title: 'New set: 1st & 10',
        bug: { down: 1, dist: 10, clk: '10:58' },
        los: 46, fd: 56, players: [...o3, ...d3], routes: [], marks: [{ id: 'm10b', type: 'measure', x1: 46, x2: 56, y: 49, t: 'NEW 10 YARDS' }],
        ov: [{ id: 'sg3', type: 'signal', pos: 'r', sig: 3, name: 'First down', desc: 'The referee points toward the defending team\'s goal.' }],
        cam: { x: 46, y: M, w: 100 },
        l3: { k: 'Moving the chains', t: '1st & 10 at the NE 36', s: 'The yellow line jumps 10 yards ahead' },
        notes: {
          p: ['New first down at the NE 36. Watch the yellow line jump to the NE 46.',
            'This loop (gain 10, reset, gain 10, reset) is how a team marches down the field. That\'s called a drive.',
            'On the sideline, the "chain crew" physically moves the 10-yard chain. On TV the yellow line is the chain.'],
          a: 'Inchworm: stretch 10, reset, stretch 10 again.',
          x: 'When it\'s close, officials bring the chains onto the field for a measurement; the ball\'s nose must reach the front stake.',
        },
      },
      {
        title: '& Goal',
        los: 102, fd: null, lbl: true,
        cam: { x: 96, y: M, w: 70 },
        players: [...F.off(102, { pers: '12', set: 'under' }), ...F.def(102, { front: '43', cov: '0' })],
        bug: { down: 1, dist: 'GOAL', clk: '7:02' },
        marks: [{ id: 'gl', type: 'rect', x: 110, y: 0, w: 10, h: 53.33, c: 'y', op: 0.2, pulse: true, lbl: 'THE LINE TO GAIN IS THE GOAL LINE', size: 1.2, rot: 90 }],
        l3: { k: 'Inside the 10', t: '1st & Goal', s: 'When the goal line is closer than 10 yards, it\'s "& Goal"' },
        notes: {
          p: ['When the offense gets a first down inside the opponent\'s 10, there\'s no room for 10 yards.',
            'So the bug says "1st & GOAL": the only way to get a new set of downs is to score.',
            'No yellow line now; the goal line is the target.'],
          a: 'The finish line moved in front of the checkpoint.',
          x: 'A defensive penalty can still give the offense a new "1st & Goal" (automatic first downs reset the series).',
        },
      },
      {
        title: '4th & 1: go for it…',
        los: 75, fd: 76, lbl: true,
        cam: { x: 74, y: M, w: 70 },
        bug: { down: 4, dist: 1, clk: '4:20', hs: 7 },
        players: [...o4, ...d4], routes: [],
        ov: [{ id: 'opt', type: 'panel', pos: 'tl', w: '28vw', k: '4th down: three choices', items: ['**Punt**: kick it away, make them start far back', '**Field goal**: if close enough, take 3 points', '**Go for it**: one more try; fail and they get the ball HERE'], num: true }],
        l3: { k: '4th & 1 at the NYJ 35', t: 'Decision time', s: 'Punt, field goal, or go for it?' },
        notes: {
          p: ['4th down is special. Teams usually punt or kick a field goal, because failing means handing over the ball right here.',
            'But on 4th & 1 near midfield, many coaches now go for it. We will dig into that math in the Strategy chapter.',
            'Let\'s go for it…'],
          a: 'Last life: do you risk it or bank what you have?',
          x: 'League-wide 4th-down attempts have roughly doubled since the analytics shift of the late 2010s.',
        },
      },
      {
        title: '…stuffed: turnover on downs',
        players: [...o4, ...stuffed], routes: [sneak, ...R.blocks(o4, R.OL, 0.6)],
        marks: [{ id: 'x', type: 'text', x: 74, y: 20, t: 'SHORT!', size: 2, c: 'r', cls: 'hd', delay: 1100 }],
        sfx: [{ n: 'hit', at: 1000 }, { n: 'whistle', at: 1500 }],
        bug: { msg: 'TURNOVER ON DOWNS' },
        l3: { k: '4th & 1', t: 'Stopped short', s: 'Turnover on downs: the Jets take over right here' },
        notes: {
          p: ['Stuffed! Short of the yellow line on 4th down.',
            'Result: turnover on downs. No kick, no return: the Jets get the ball at this exact spot.',
            'That\'s the risk of going for it.'],
          a: 'You used your last life without reaching the checkpoint: game over for this drive.',
          x: 'Failed 4th-down conversions are automatically reviewed by the replay booth (15-1-2).',
        },
      },
      {
        title: 'Possession flips',
        off: 'NYJ', los: 75, fd: 65,
        bug: { msg: null, poss: 'NYJ', down: 1, dist: 10 },
        players: [...F.off(75, { team: 'NYJ', pers: '11' }), ...F.def(75, { team: 'NE', front: 'nickel', cov: '3' })],
        routes: [], marks: [{ id: 'dir', type: 'arrow', d: [[70, 10], [54, 10]], c: 'g', w: 0.5 }, { id: 'dirt', type: 'text', x: 62, y: 8, t: 'Jets now attack this way ←', size: 1.4, c: 'g' }],
        cam: { x: 66, y: M, w: 100 },
        l3: { k: 'Change of possession', t: 'Jets ball, 1st & 10', s: 'Same spot, other direction. Now the Jets have 4 downs' },
        notes: {
          p: ['Now the Jets are on offense (circles) and the Patriots on defense (X\'s).',
            'They attack the other way, toward the Patriots\' end zone, and get a new 1st & 10.',
            'Every change of possession flips the picture like this.'],
          a: 'Serve switches sides.',
          x: 'Change of possession also resets the play clock to 40 and changes when the game clock restarts (4-3-2).',
        },
      },
      {
        title: 'Your turn: drive simulator',
        w: 'sim', ov: [], l3: null,
        notes: {
          p: ['Interactive time. Keys: 1 run +4, 2 pass +15, 3 sack −7, 4 incomplete, 5 punt, 6 field goal, 0 reset.',
            'Ask the audience to call the plays. Watch the blue line, the yellow line and the score bug update.',
            'On 4th down a red banner asks: go for it, punt or kick? Try failing a 4th down to show the turnover on downs, and a long field goal to show the miss rule.',
            'Touchdowns count 7 here (assuming the extra point), field goals use realistic make rates by distance.'],
          a: 'You are the offensive coordinator now.',
          x: 'Missed FG: ball to the defense at the spot of the kick, or the 20 if kicked from inside the 20 (11-4-2). Punts into the end zone come out to the 20.',
        },
      },
    ],
  });
})(window.FD);
