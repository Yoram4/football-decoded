/* Chapter 19 — Glossary (also available any time with G) */
(function (FD) {
  FD.CH.push({
    title: 'Glossary', sub: 'Every term, linked to where we explained it',
    base: { cam: { x: 60, y: 26.67, w: 160 } },
    steps: [
      {
        title: 'Glossary',
        bug: { hide: true }, players: [], routes: [], marks: [], los: null, fd: null,
        w: 'gloss', l3: null,
        notes: {
          p: ['Searchable glossary. Type a word (e.g. "blitz", "touchback", "red zone").',
            'Each term has a button that jumps back to the step where we explained it.',
            'Press G anywhere to open it as an overlay.'],
          a: 'The index at the back of the book.',
          x: 'About 50 terms; the rulebook has its own Definitions section (Rule 3) for the official wording.',
        },
      },
    ],
  });
})(window.FD);
