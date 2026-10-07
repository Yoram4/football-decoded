/* Chapter 6 — The Players: 11 vs 11, position groups, clickable player cards */
(function (FD) {
  const { F } = FD;
  const M = FD.MID;
  const off = F.off(42, { pers: '11', set: 'gun', wide: 17 });
  const def = F.def(42, { front: '43', cov: '3', wide: 17 });
  const ALL = [...off, ...def];
  const card = (pos, team = 'NE', extra = {}) => ({ id: 'card', ...FD.cardFor(pos, team), pos: 'r', ...extra });
  const keep = (ids) => F.dim(F.hl(ALL, ids), ids);
  const cam = { x: 45, y: M, w: 100 };

  FD.CH.push({
    title: 'The Players', sub: '11 vs 11: who does what',
    base: { cam, los: 42, fd: 52, dlbl: true },
    steps: [
      {
        title: '11 vs 11',
        bug: { reset: true, hide: false, down: 1, dist: 10, q: '2ND', clk: '9:41', hs: 10, as: 7 },
        players: ALL, routes: [], marks: [],
        ov: [{ id: 'cnt', type: 'stats', pos: 'tl', items: [{ v: '11', l: 'on offense', c: '#7fb2ff' }, { v: '11', l: 'on defense', c: '#86efac' }, { v: '53', l: 'on the roster' }] }],
        l3: { k: 'Who\'s on the field', t: '11 vs 11', s: 'Offense (circles) vs defense (X\'s), plus special teams' },
        notes: {
          p: ['Each team has 11 players on the field at a time. Substitutions are unlimited between plays.',
            'A team really has three units: offense, defense and special teams (kicking plays).',
            'Rosters are 53 players; on game day roughly 47–48 dress. So most players play only one side of the ball.'],
          a: 'Less like soccer, more like a theater company: different casts for different scenes.',
          x: 'Roster: 53-man active list plus a practice squad (16, with an extra international-pathway spot). Game-day actives are 47, or 48 with 8 offensive linemen.',
        },
        tags: ['VERIFY: game-day active count / practice squad size'],
      },
      {
        title: 'Offensive line',
        players: keep(['NE-LT', 'NE-LG', 'NE-C', 'NE-RG', 'NE-RT']),
        ov: [card('C')],
        l3: { k: 'Offense · the big guys', t: 'Offensive line (5)', s: 'Tackle · Guard · Center · Guard · Tackle' },
        notes: {
          p: ['Five offensive linemen: center in the middle, guards next to him, tackles on the outside.',
            'They protect the quarterback and open holes for runs. They almost never touch the ball, and they are NOT allowed to catch forward passes.',
            'Biggest players on the field: 300+ pounds. Watch them first on any play: whoever wins up front usually wins the play.'],
          a: 'The bodyguards and the bulldozers.',
          x: 'Linemen wear 50–79 so officials can tell they are ineligible (5-1-2); one can report eligible to the referee.',
        },
      },
      {
        title: 'Quarterback & running back',
        players: keep(['NE-QB', 'NE-RB']),
        ov: [card('QB')],
        l3: { k: 'Offense · the backfield', t: 'QB & RB', s: 'The QB runs the show; the RB carries the ball' },
        notes: {
          p: ['The quarterback touches the ball on almost every play: he hands it off, throws it or runs it.',
            'He calls the play in the huddle and can change it at the line ("audible").',
            'The running back lines up behind or next to the QB: takes handoffs, catches short passes, blocks.'],
          a: 'QB = point guard + coach on the field.',
          x: 'Shotgun (5–7 yds deep) vs under center: shotgun buys vision for passing; under center helps the run game and play-action.',
        },
      },
      {
        title: 'Receivers & tight end',
        players: keep(['NE-X', 'NE-Z', 'NE-H', 'NE-TE']),
        ov: [card('WR')],
        l3: { k: 'Offense · pass catchers', t: 'WR & TE', s: 'Wide receivers spread out; the tight end does both jobs' },
        notes: {
          p: ['Wide receivers line up near the sidelines (X, Z) or in the "slot" between the line and the outside receiver (H).',
            'The tight end lines up next to the tackle: a blocker on runs, a receiver on passes.',
            'This lineup (1 RB, 1 TE, 3 WR) is called "11 personnel", the most common in the NFL.'],
          a: 'Receivers are the strikers; the tight end is the midfielder who also defends.',
          x: 'Personnel digits = # of RBs then # of TEs (11, 12, 21, 13…); WR count is the remainder of 5 skill players.',
        },
      },
      {
        title: 'Defensive line',
        players: keep(['NYJ-DE1', 'NYJ-DT1', 'NYJ-DT2', 'NYJ-DE2']),
        ov: [card('DE', 'NYJ')],
        l3: { k: 'Defense · first level', t: 'Defensive line', s: 'Ends & tackles: stop the run, chase the quarterback' },
        notes: {
          p: ['Across from the offensive line: the defensive line. Usually 3 or 4 players.',
            'Tackles in the middle (big, strong), ends on the outside (fast pass rushers).',
            'Their goal: get into the backfield. Tackle the QB before he throws = a SACK.'],
          a: 'The wave crashing against the offensive line\'s seawall.',
          x: 'Techniques are numbered by alignment on the blocker (0 head-up center, 3 outside shade of guard, 5 outside shade of tackle, 9 wide).',
        },
      },
      {
        title: 'Linebackers',
        players: keep(['NYJ-WILL', 'NYJ-MIKE', 'NYJ-SAM']),
        ov: [card('LB', 'NYJ')],
        l3: { k: 'Defense · second level', t: 'Linebackers', s: 'Stop runs, cover short passes, blitz' },
        notes: {
          p: ['Linebackers stand a few yards behind the line. Do-it-all players.',
            'On a run they fill the hole; on a pass they drop into coverage; sometimes they rush the passer (a blitz).',
            'The middle one ("Mike") often has the radio in his helmet and calls the defense.'],
          a: 'The goalkeeper and the defender in one.',
          x: 'Mike / Sam / Will = middle / strong-side / weak-side; one defender per side wears the green-dot helmet radio.',
        },
      },
      {
        title: 'Cornerbacks & safeties',
        players: keep(['NYJ-CB1', 'NYJ-CB2', 'NYJ-FS', 'NYJ-SS']),
        ov: [card('S', 'NYJ')],
        l3: { k: 'Defense · the secondary', t: 'Corners & safeties', s: 'The last line against the pass' },
        notes: {
          p: ['Cornerbacks cover the wide receivers. Safeties play deeper, in the middle.',
            'Together they are the "secondary" or "defensive backs" (DBs).',
            'Watch how many safeties are deep before the snap: one or two. It tells you a lot about the coverage (Defense chapter).'],
          a: 'The goalkeepers of football: if they get beat, it\'s a touchdown.',
          x: 'Modern defenses play a 5th DB (the nickel back) on most snaps instead of a 3rd linebacker.',
        },
      },
      {
        title: 'Specialists',
        players: ALL.map((p) => ({ ...p, dim: true, hl: false })),
        ov: [{ id: 'sp', type: 'panel', pos: 'l', w: '34vw', k: 'Special teams', t: 'The specialists', items: ['**Kicker (K)**: kickoffs, field goals, extra points', '**Punter (P)**: punts on 4th down, often holds for kicks', '**Long snapper (LS)**: snaps on punts & kicks', '**Returners (KR/PR)**: catch kicks and punts and run them back'] }, card('K', 'NE', { id: 'card' })],
        l3: { k: 'The third unit', t: 'Special teams', s: 'Kicking plays: about 1 in 6 snaps' },
        notes: {
          p: ['Special teams take the field for kicking plays: kickoffs, punts, field goals and extra points.',
            'Kickers and punters are specialists: often they play only a handful of snaps a game, but those snaps can decide it.',
            'We will see their plays in the Special Teams chapter.'],
          a: 'The relief pitchers of football: rarely on the field, enormous impact.',
          x: 'Kickers and punters are protected by "roughing/running into the kicker" rules (12-2-10).',
        },
      },
      {
        title: 'Click any player',
        players: ALL, w: 'cards', ov: [],
        l3: { k: 'Interactive', t: 'Click a player', s: 'Each one gets a broadcast player card' },
        notes: {
          p: ['Tap or click any circle or X to open that position\'s player card. Esc (or tapping elsewhere) closes it.',
            'Which one would you be? Find him and open his card.',
            'Worth a look: the center (he snaps AND calls protections), the nickel back, the safety.'],
          a: 'Pick your character.',
          x: 'Card sizes are typical modern averages; the range within each position is wide.',
        },
      },
    ],
  });
})(window.FD);
