/* Chapter 17 — How to Watch */
(function (FD) {
  const { F, R } = FD; const M = FD.MID;

  // annotation boxes on photo_broadcast.jpg (1920×1080), percent of image
  const NOTES = [
    { x: 28.9, y: 84.3, w: 42.2, h: 11.1, t: 'Score bug: teams · score · record · timeouts', side: 'up' },
    { x: 42.5, y: 84.6, w: 15, h: 10.6, t: '1st & 10 · 2nd qtr · 0:16 · play clock 10', side: 'up' },
    { x: 39, y: 38, w: 11, h: 26, t: 'Line of scrimmage (blue)' },
    { x: 74.5, y: 27, w: 10.5, h: 50, t: 'Line to gain: a TV graphic', side: 'left' },
    { x: 21, y: 11, w: 31, h: 53, t: 'Shotgun · RB beside QB · 2 WR to the far side' },
    { x: 90.5, y: 47, w: 6.5, h: 17, t: 'One deep safety = "one high"', side: 'left' },
  ];
  const frame = (n) => [{ id: 'fr', type: 'frame', pos: 'full', key: 'photo_broadcast', notes: NOTES, show: n }];

  const LOS = 45;
  const PRE = [...F.off(LOS, { pers: '11' }), ...F.def(LOS, { front: 'nickel', cov: '2' })];
  const POST = [...PRE, F.ball(40, M)];
  const postR = [
    ...R.blocks(POST, R.OL, 0.9, 0),
    R.abs(POST, 'NE-QB', [[37.5, M]], { k: 'run', move: true, delay: 100, dur: 500 }),
    R.make(POST, 'NE-Z', 'dig', { c: 'r', move: true, delay: 250, dur: 1500 }),
    R.make(POST, 'NE-X', 'go', { delay: 250, dur: 1500 }),
    R.make(POST, 'NE-H', 'seam', { delay: 250, dur: 1400 }),
    R.make(POST, 'NE-TE', 'flat', { delay: 250, dur: 900 }),
    R.abs(POST, 'NYJ-DE1', [[44.5, M - 5], [39.5, M - 2]], { k: 'run', c: 'w', move: true, delay: 150, dur: 1200, curve: true }),
    R.abs(POST, 'NYJ-DE2', [[44.5, M + 8], [39.5, M + 3]], { k: 'run', c: 'w', move: true, delay: 150, dur: 1200, curve: true }),
    { id: 'bf', p: 'BALL', k: 'pass', d: [[37.5, M], [55.5, M + 10]], move: true, delay: 1350, dur: 550 },
  ];

  FD.CH.push({
    title: 'How to Watch', sub: 'Read the TV picture like a scout',
    base: { bug: {} },
    steps: [
      {
        title: 'The score bug',
        bug: { reset: true, hide: true },
        cam: { x: 60, y: 26.67, w: 132 },
        players: [], routes: [], marks: [], zones: [], los: null, fd: null, ball: false,
        ov: frame(1), l3: null,
        notes: {
          p: ['This is a real broadcast frame: Patriots (white) at the Bills, 2nd quarter. Let\'s read it like a pro, one box at a time.',
            'Bottom center is the score bug. Each team: logo, score, and its season record in the corner (NE 1-2, BUF 3-0). Tied 14–14.',
            'The little bars under each score are timeouts left. A dark bar is a timeout already used: both teams have 2 of 3 left.',
            'Top-right is the network logo (CBS), top-left a ticker with another game\'s score.'],
          x: 'Timeout bars are the quickest way to predict the end of a half: no timeouts means the offense must use sideline throws or spikes to stop the clock.',
        },
      },
      {
        title: 'Down, distance & clocks',
        ov: frame(2),
        notes: {
          p: ['The middle block is the situation: "1st & 10" = first down, 10 yards to go for a new first down.',
            '"2ND" is the quarter; 0:16 is the game clock: 16 seconds left in the half.',
            'The small red box with 10 is the play clock: 10 seconds left to snap the ball or it\'s a delay-of-game penalty.',
            'Read it together: 16 seconds before halftime, ball in their own territory, tied. Expect a quick pass or a kneel, not a run up the middle.'],
          x: 'The play clock is 40 seconds after most plays, 25 after certain stoppages; the bug also shows "FLAG" or "TIMEOUT" banners when they happen.',
        },
      },
      {
        title: 'The line of scrimmage',
        ov: frame(3),
        notes: {
          p: ['The blue line is the line of scrimmage: where the ball is, where this play starts.',
            'It\'s drawn by the TV computer, not painted on the grass. Notice it bends with the camera angle, matching the yard lines.',
            'Offense on the left of it (white jerseys), defense on the right (blue). Nobody may cross it before the snap.'],
          x: 'Broadcasters key the virtual lines only onto green pixels, which is why players appear to run "over" them instead of under.',
        },
      },
      {
        title: 'The line to gain',
        ov: frame(4),
        notes: {
          p: ['This line marks the line to gain: reach it and you get a new first down. Most broadcasts draw it yellow; this one tints it orange.',
            'It is NOT on the real field. Players can\'t see it. It\'s a TV graphic added for viewers.',
            'The real marker is on the sideline: at the top right of the frame, the orange stick on the far sideline sits right where the graphic meets it.',
            'Instantly you can see the gap: here about 10 yards, because it\'s 1st & 10.'],
          x: 'The virtual first-down line debuted on ESPN in 1998. If the spot is close, officials still bring the real chains out to measure.',
        },
      },
      {
        title: 'Read the formation',
        ov: frame(5),
        notes: {
          p: ['Now the offense. Five linemen in the middle. The QB is in the shotgun, about 5 yards behind the center.',
            'The running back is standing right beside him: that can mean run or pass.',
            'Count the receivers: two split wide to the far side (top of screen), one more near the line on the near side.',
            'Before the snap, ask "how many receivers to each side?" The defense is doing the same count.'],
          a: 'Reading a formation is like reading a chess opening: the setup tells you what moves are likely.',
          x: 'With 3 receivers, 1 TE and 1 RB this is most likely "11 personnel", the NFL\'s most common grouping.',
        },
      },
      {
        title: 'Where are the safeties?',
        ov: frame(6),
        notes: {
          p: ['Last clue: find the safeties, the deepest defenders.',
            'Here only ONE defender is way back in the middle of the field (far right of the picture). That\'s a "one high" look.',
            'One high usually means man coverage or Cover 3. Two deep safeties ("two high") usually means Cover 2 or Cover 4.',
            'The other safety has crept down to linebacker depth: more help against the run or a short pass.'],
          a: 'Safeties are the goalkeepers: count how many are back and you know how risky a deep throw is.',
          x: 'Defenses disguise this: they show two high and rotate to one at the snap. Watch the safety right as the ball is snapped.',
        },
      },
      {
        title: 'Pre-snap checklist',
        bug: { hide: false, hs: 7, as: 3, q: '2ND', clk: '8:40', pc: 22, down: 2, dist: 7, poss: 'NE', msg: null, flag: false },
        cam: { x: 58, y: 26.67, w: 100 },
        off: 'NE', los: LOS, fd: 52, lbl: false, ball: { x: LOS, y: M },
        players: PRE, routes: [], marks: [], zones: [],
        ov: [{ id: 'pre', type: 'panel', pos: 'r', k: 'Before the snap', t: 'Pre-snap checklist', num: true, items: [
          '**Down & distance**: 2nd & 7 → run or pass?',
          '**Personnel**: how many WR, TE, RB?',
          '**Formation**: receivers to each side, RB position',
          '**Motion**: does a defender follow him? (man)',
          '**Safeties**: one high or two high?',
        ] }],
        l3: null,
        notes: {
          p: ['Here\'s the 5-second routine you can run before every snap.',
            'Down and distance first: 3rd & long means pass; 2nd & 2 means anything.',
            'Personnel and formation: count receivers and find the running back.',
            'Motion: if a defender runs across with the man in motion, it\'s probably man coverage.',
            'Safeties: one high or two high. Do this every play and you\'ll guess the play before the announcer does.'],
          a: 'It\'s a pilot\'s pre-flight checklist: same five items, every time.',
          x: 'Pre-snap motion is used on a majority of NFL snaps now, largely to reveal coverage and create leverage.',
        },
      },
      {
        title: 'Post-snap: where to look',
        cam: { x: 58, y: 26.67, w: 100 },
        ball: false,
        players: POST, routes: postR,
        ov: [{ id: 'post', type: 'panel', pos: 'r', k: 'After the snap', t: 'Where to look', num: true, items: [
          '**OL vs DL**: does the pocket hold?',
          '**QB\'s eyes**: they lead you to the target',
          '**The yellow line**: did he get there?',
          '**Ball carrier** after the catch',
        ] }],
        sfx: { n: 'hit', at: 400 },
        l3: null,
        notes: {
          p: ['After the snap, don\'t chase the ball first. Watch the line for a second: does the pocket hold or collapse?',
            'Then the quarterback\'s eyes. Where he looks is where the ball is going.',
            'When the ball is in the air, glance at the yellow line: is the catch going to be short of it or past it?',
            'After the catch, follow the ball carrier and the tacklers converging on him.'],
          a: 'Like watching a magician\'s other hand: the trick is never where everyone else is looking.',
          x: 'Average NFL time to throw is about 2.5–3 seconds; if the QB still holds the ball after 3, the protection is the story of the play.',
        },
      },
      {
        title: 'Watch-along tips',
        bug: { hide: true },
        players: [], routes: [], marks: [], zones: [], los: null, fd: null, ball: false,
        ov: [{ id: 'tips', type: 'panel', pos: 'c', k: 'Watch like a fan, think like a scout', t: 'Watch-along tips', items: [
          '**Live**: watch the line and the QB',
          '**Replay**: follow the ball, watch the other angle',
          '**Flags**: listen to the referee\'s announcement',
          'Watch the **score bug** between plays',
        ] }],
        l3: null,
        notes: {
          p: ['Live, watch the big picture: the line and the quarterback.',
            'On the replay, follow the ball. TV shows different angles: the end-zone camera explains the blocking, the sideline camera the catch.',
            'When there\'s a flag, the referee turns on his microphone and announces the foul, the team and the result. That\'s free teaching.',
            'And between plays, check the bug: down, distance, clock and timeouts tell you what should happen next.'],
          x: 'Advanced viewers watch the "All-22" coaches\' film, a wide camera that shows all 22 players on every play.',
        },
      },
    ],
  });
})(window.FD);
