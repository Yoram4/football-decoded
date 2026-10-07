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
          p: ['Thirty seconds to recap the whole thing.', 'If you remember only one thing: 4 downs to gain 10 yards. Everything else hangs on that.'],
          a: 'You learned the board, the pieces and the moves.',
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
          p: ['Same play as the cold open. An hour ago it was circles and lines.',
            'Now: 1st & 10 at the Jets 48, 11 personnel, the defense shows one deep safety (Cover 1), the X receiver runs a post right at him… touchdown.'],
          a: 'Rereading the first page of a book after you finished it.',
          x: 'Post vs single-high: the QB holds the safety with his eyes before throwing.',
        },
      },
      {
        title: 'Foxborough',
        photo: { key: 'photo_gillette_fw2', dim: 0.3, over: true },
        players: [], routes: [], los: null, fd: null,
        bug: { hs: 24, as: 20, q: 'FINAL', clk: '', msg: null, down: null, dist: null, pc: null },
        ov: [{ id: 'fx', type: 'big', pos: 'c', k: 'Patriots 24 · Jets 20', t: 'You\'re ready for Sunday', s: 'Gillette Stadium · Foxborough, MA' }],
        l3: null, sfx: ['cheer'],
        notes: {
          p: ['That\'s the game. Patriots win our story game 24–20.', 'Next time you watch, look at the bug, the yellow line, and the safeties before the snap.'],
          a: 'You went from tourist to local.',
          x: 'The 2026 Patriots open the season as defending AFC champions.',
        },
      },
      {
        title: 'Six banners',
        photo: { key: 'photo_banners', dim: 0.35, over: true },
        ov: [{ id: 'bn', type: 'logos', pos: 'b', items: ['lombardi', 'ne', 'pat'], cap: '2001 · 2003 · 2004 · 2014 · 2016 · 2018' }],
        notes: {
          p: ['Six championship banners hang at Gillette.', 'And last February the Patriots were back in the Super Bowl. The next banner is what Foxborough is playing for.'],
          a: 'Every fan base has a trophy case; ours is a little crowded.',
          x: '12 Super Bowl appearances is the most of any franchise.',
        },
      },
      {
        title: 'Questions?',
        photo: { key: 'photo_gillette', dim: 0.6, over: true },
        ov: [{ id: 'qa', type: 'title', pos: 'c', k: 'Thank you', t: 'Questions?', s: 'M = chapters · G = glossary · ← → to revisit any play', menu: true }],
        bug: { hide: true },
        notes: {
          p: ['Open the floor. Use M to jump to any chapter and G to search a term while answering.', 'Telestrator (T) is handy for drawing on a play during Q&A.'],
          a: 'Office hours.',
          x: 'Presenter view (N) shows notes, timer and the next step.',
        },
      },
    ],
  });
})(window.FD);
