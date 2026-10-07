/* Chapter 20 — Finale: recap montage, Gillette, Q&A */
(function (FD) {
  const M = FD.MID;
  FD.CH.push({
    title: 'Finale', sub: 'Recap & questions',
    base: { cam: { x: 60, y: M, w: 132 } },
    steps: [
      {
        title: 'What you know now',
        bug: { reset: true, hide: false, hs: 24, as: 20, q: 'FINAL', clk: '', poss: 'NE' },
        players: [], routes: [], marks: [], los: null, fd: null,
        ov: [{ id: 'rec', type: 'panel', pos: 'c', w: '62vw', k: 'Recap', t: 'You can now follow an NFL game', num: true, items: [
          '**The field**: 100 yards, end zones, hashes, "own 25" vs "opponent\'s 25"',
          '**Scoring**: TD 6, try 1 or 2, field goal 3, safety 2',
          '**Downs**: 4 tries to gain 10 yards, the yellow line is the target',
          '**Players**: line, backs, receivers / line, linebackers, secondary',
          '**Plays**: zone & power runs, routes and reads, coverages and blitzes',
          '**Kicks, flags, turnovers**: the rules that swing games',
          '**The season**: 17 games, 14 playoff teams, one Super Bowl'] }],
        l3: null,
        notes: {
          p: ['The whole guide in one screen.', 'If you remember only one thing: 4 downs to gain 10 yards. Everything else hangs on that.'],
          x: 'Next level: watch the All-22 coaches film on NFL+ to see all 22 players on every snap.',
        },
      },
      {
        title: 'Recap: the cold-open drive',
        cam: { x: 85, y: M, w: 90 }, los: 62, fd: 72, lbl: true,
        players: [...FD.F.off(62, { pers: '11' }), ...FD.F.def(62, { front: 'nickel', cov: '1' })],
        routes: [FD.R.make(FD.F.off(62, { pers: '11' }), 'X', [[10, 0], [24, 6], [50, 11]], { move: true, c: 'r', delay: 200, dur: 1700 })],
        ov: [], bug: { hs: 17, as: 20, q: '4TH', clk: '0:38', down: 1, dist: 10, poss: 'NE' },
        l3: { k: 'Remember this?', t: 'Now you can read it', s: '1st & 10, Cover 1 look, deep post vs one high safety' },
        sfx: [{ n: 'roar', at: 1700 }],
        notes: {
          p: ['Same play as the cold open. At the start it was just circles and lines.',
            'Now: 1st & 10 at the Jets 48, 11 personnel, the defense shows one deep safety (Cover 1), the X receiver runs a post right at him… touchdown.'],
          x: 'Post vs single-high: the QB holds the safety with his eyes before throwing.',
        },
      },
      {
        title: 'The final whistle',
        photo: { key: 'photo_gillette_fw2', dim: 0.3, over: true },
        players: [], routes: [], los: null, fd: null,
        bug: { hs: 24, as: 20, q: 'FINAL', clk: '', msg: null, down: null, dist: null, pc: null },
        ov: [{ id: 'fx', type: 'big', pos: 'c', k: '32 teams · one league', t: 'You\'re ready for Sunday', s: 'Rules, strategy, and the next matchup' }],
        l3: null, sfx: ['cheer'],
        notes: {
          p: ['That\'s the game. One matchup ends; another is already on the schedule.', 'Next time you watch, look at the score bug, the yellow line, and the safeties before the snap.'],
          x: 'These are useful cues to track before and after the snap, regardless of which teams are playing.',
        },
      },
      {
        title: 'A league of matchups',
        players: [], routes: [], los: null, fd: null,
        ov: [{ id: 'league-end', type: 'big', pos: 'c', k: '32 teams · one league', t: 'Every game brings a new story', s: 'Rivalries, strategy, and a season that keeps moving' }],
        notes: {
          p: ['The teams and stadiums change; the rules and the game-reading skills stay with you.', 'Pick any matchup and follow the downs, field position, clock, and coverage.'],
          x: 'A team-independent reading routine makes it easier to follow unfamiliar matchups.',
        },
      },
      {
        title: 'Thank you',
        photo: { key: 'photo_gillette', dim: 0.6, over: true },
        ov: [{ id: 'qa', type: 'title', pos: 'c', k: 'Football Guide', t: 'Thanks for watching', s: 'M = chapters · G = glossary · ← → to revisit any play', menu: true }],
        bug: { hide: true },
        notes: {
          p: ['Want to revisit something? M jumps to any chapter, G searches any term, and ← → replay any step.', 'Draw on any play yourself with the telestrator (T).'],
          x: 'Watching a real game? Keep the glossary (G) open on your phone.',
        },
      },
    ],
  });
})(window.FD);
