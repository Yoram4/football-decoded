/* Chapter 2 — The Field */
(function (FD) {
  const M = FD.MID;
  FD.CH.push({
    title: 'The Field', sub: 'End zones, yard lines, hashes, field position',
    base: { bug: {} },
    steps: [
      {
        title: '120 yards × 53⅓',
        bug: { reset: true, hide: true },
        cam: { x: 60, y: 26.67, w: 132 },
        marks: [
          { id: 'm-len', type: 'measure', x1: 0, x2: 120, y: -1.6, t: '120 YARDS (100 + two 10-yard end zones)', size: 1.7 },
          { id: 'm-wid', type: 'text', x: 122.2, y: M, t: '53⅓ YARDS WIDE (160 ft)', rot: 90, size: 1.5, c: 'y' },
        ],
        l3: { k: 'The field', t: '100 yards + 2 end zones', s: 'Two teams, two end zones, one ball' },
        notes: {
          p: ['The playing field is 100 yards long, plus a 10-yard end zone at each end: 120 yards total.',
            'It\'s 53⅓ yards wide, which is exactly 160 feet. (Rule 1, Section 1.)',
            'Left end zone: Patriots (navy). Right end zone: Jets (green). In a real game each team defends one end and they switch every quarter.'],
          a: 'A bit longer than a soccer pitch and a lot narrower.',
          x: 'The whole field, including end zones, is 360 × 160 ft. The NFL requires a league-approved shade of green (1-1-1).',
        },
      },
      {
        title: 'The end zone',
        cam: { x: 14, y: 26.67, w: 44 },
        marks: [
          { id: 'ez', type: 'rect', x: 0, y: 0, w: 10, h: 53.33, c: 'y', op: 0.18, pulse: true },
          { id: 'gl', type: 'line', x1: 10, y1: -0.5, x2: 10, y2: 53.8, c: 'y', w: 0.45 },
          { id: 'gl-t', type: 'text', x: 10.8, y: 3.5, t: 'GOAL LINE', anchor: 'start', size: 1.4, c: 'y' },
          { id: 'ez-t', type: 'text', x: 13, y: 49, t: 'Get the ball across this line = TOUCHDOWN', anchor: 'start', size: 1.3 },
          { id: 'post', type: 'post', x: 24, y: 12, s: 0.9 },
        ],
        l3: { k: 'Where you score', t: 'The end zone', s: 'Carry or catch the ball across the goal line' },
        notes: {
          p: ['This is the Patriots\' end zone. The Patriots defend it; the Jets attack it.',
            'Touchdown = the ball crosses the plane of the goal line while a player has possession. The line itself counts as the end zone.',
            'Goal posts sit on the back line (end line): 18 ft 6 in wide, crossbar 10 ft high. Kicks must go between the uprights, above the crossbar.'],
          a: 'The goal line is like an invisible wall: the ball only has to break the plane, not the whole player.',
          x: 'College uprights are the same 18\'6" width; high-school posts are wider (23\'4").',
        },
      },
      {
        title: 'Yard lines & numbers',
        cam: { x: 35, y: 26.67, w: 46 },
        marks: [
          { id: 'm5', type: 'measure', x1: 25, x2: 30, y: 4.5, t: '5 yards' },
          { id: 'm10', type: 'measure', x1: 30, x2: 40, y: 48.5, t: '10 yards' },
          { id: 'arr', type: 'circle', x: 37.7, y: 43.5, r: 1.6, c: 'y' },
          { id: 'arr-t', type: 'text', x: 37.7, y: 40.8, t: 'arrow points to the nearer goal', size: 1.1, c: 'y' },
        ],
        l3: { k: 'Reading the field', t: 'Lines every 5 · numbers every 10', s: 'Numbers count UP to 50, then back DOWN' },
        notes: {
          p: ['A line every 5 yards, a number every 10. Small ticks mark every single yard.',
            'The numbers go 10, 20, 30, 40, 50… and then back down 40, 30, 20, 10. The 50 is midfield.',
            'The little arrow next to each number points toward the nearer goal line, so you always know which half you\'re in.'],
          a: 'Like a ruler that counts from both ends toward the middle.',
          x: 'Numbers are 6 ft tall with their tops 9 yards from the sideline, which is why receivers use them as landmarks.',
        },
      },
      {
        title: 'Hash marks',
        cam: { x: 45, y: 26.67, w: 40 },
        marks: [
          { id: 'h1', type: 'rect', x: 30, y: 22.9, w: 30, h: 0.67, c: 'y', op: 0.55, stroke: false },
          { id: 'h2', type: 'rect', x: 30, y: 29.76, w: 30, h: 0.67, c: 'y', op: 0.55, stroke: false },
          { id: 'ht', type: 'text', x: 31, y: 26.9, t: 'HASH MARKS', anchor: 'start', size: 1.3, c: 'y' },
          { id: 'hd', type: 'arrow', d: [[50, 12], [50, 22.6]], c: 'y' },
          { id: 'hdt', type: 'text', x: 50, y: 11, t: '70 ft 9 in from the sideline', size: 1.2, c: 'y' },
          { id: 'b1', type: 'ball', x: 46, y: 23.3 },
        ],
        tags: ['COLLEGE: hashes are 60 ft from each sideline (wider apart)'],
        l3: { k: 'Where the ball is placed', t: 'Hash marks', s: 'If a play ends outside them, the ball is moved back to the nearest hash' },
        notes: {
          p: ['The two rows of short lines in the middle are the hash marks.',
            'Every play starts with the ball on or between the hashes. If a runner is tackled near the sideline, the officials move the ball in to the nearest hash.',
            'NFL hashes are close together (18½ ft apart), so the field is almost the same width to both sides.'],
          a: 'Hashes are the "lanes" the ball has to restart in, like a bowling lane gutter guard.',
          x: 'Narrow NFL hashes make the wide and short sides of the field similar; in college the wide-side/boundary distinction matters much more.',
        },
      },
      {
        title: 'Field position: "own 25"',
        cam: { x: 50, y: 26.67, w: 80 },
        los: 35, lbl: false,
        marks: [
          { id: 'fp1', type: 'arrow', d: [[35, 8], [35, 23]], c: 'y' },
          { id: 'fp1t', type: 'text', x: 35, y: 6.3, t: 'NE 25 = the Patriots\' OWN 25', size: 1.6, c: 'y' },
          { id: 'fp1g', type: 'measure', x1: 35, x2: 110, y: 3.2, t: '75 yards to the Jets\' end zone' },
        ],
        l3: { k: 'How announcers name a spot', t: '"Own" side vs "opponent\'s" side', s: 'Ball on the NE 25: Patriots are on their own side' },
        notes: {
          p: ['Every spot has a name: whose half it\'s in, plus the yard number.',
            'Patriots with the ball here: "first and ten from their own 25". The bug would say NE 25.',
            'They need to go 75 yards to score.'],
          a: 'Like a street address: side of town + house number.',
          x: 'Drive-start field position is one of the strongest predictors of scoring; the average NFL drive starts around the own 30.',
        },
      },
      {
        title: 'Field position: "opponent\'s 25"',
        los: 95,
        marks: [
          { id: 'fp2', type: 'arrow', d: [[95, 8], [95, 23]], c: 'y' },
          { id: 'fp2t', type: 'text', x: 95, y: 6.3, t: 'NYJ 25 = the opponent\'s 25', size: 1.6, c: 'y' },
          { id: 'fp2g', type: 'measure', x1: 95, x2: 110, y: 3.2, t: 'only 25 yards to go' },
        ],
        cam: { x: 80, y: 26.67, w: 80 },
        l3: { k: 'Same number, very different spot', t: 'The NYJ 25', s: 'Now the Patriots are in Jets territory' },
        notes: {
          p: ['Same number "25", but now it\'s the Jets\' 25. Only 25 yards from a touchdown.',
            'This is why you always need the team name with the number. "The 25" alone is ambiguous.'],
          a: 'Two houses with the same number on different streets.',
          x: 'Inside the opponent\'s 35 or so, a field goal becomes realistic; the kick travels from about 7 yards behind the line plus 10 yards of end zone.',
        },
      },
      {
        title: 'The red zone',
        cam: { x: 92, y: 26.67, w: 60 },
        los: null,
        marks: [
          { id: 'rz', type: 'rect', x: 90, y: 0, w: 20, h: 53.33, c: '#ef4444', op: 0.22, lbl: 'RED ZONE', size: 3, rot: 0, pulse: true },
          { id: 'rzm', type: 'measure', x1: 90, x2: 110, y: 50.5, t: 'inside the opponent\'s 20' },
        ],
        l3: { k: 'Scoring territory', t: 'The red zone', s: 'Inside the opponent\'s 20-yard line' },
        notes: {
          p: ['The last 20 yards before the goal line is called the red zone.',
            'It\'s not a rule, it\'s TV vocabulary. Teams are measured by how often they score touchdowns once they get here.',
            'The field gets cramped: less room for receivers to run, so defense gets easier.'],
          a: 'The red zone is the penalty box of football: you got close, now finish.',
          x: '"Red-zone TD %" is the stat; good offenses convert around 60%+, settling for field goals the rest of the time.',
        },
      },
      {
        title: 'Out of bounds',
        cam: { x: 60, y: 46, w: 60 },
        marks: [
          { id: 'sl', type: 'rect', x: 0, y: 53.33, w: 120, h: 1.8, c: '#ef4444', op: 0.35, stroke: false },
          { id: 'slt', type: 'text', x: 60, y: 56.6, t: 'SIDELINE: touching it = out of bounds', size: 1.6, c: '#fca5a5' },
          { id: 'oob', type: 'arrow', d: [[48, 40], [56, 50], [62, 55.2]], c: 'y', curve: true },
        ],
        l3: { k: 'Boundaries', t: 'Out of bounds', s: 'Step on the white line and the play is over' },
        notes: {
          p: ['The sidelines and end lines are OUT of bounds. Touch them and the play ends where the ball crossed.',
            'Receivers must get both feet (or a knee, etc.) down in bounds for a catch to count.',
            'Running out of bounds also stops the clock, which becomes a big deal at the end of halves.'],
          a: 'The white line is lava.',
          x: 'NFL catch rule: two feet or another body part (not hands) in bounds with control. College needs only one foot.',
        },
        tags: ['COLLEGE: only ONE foot in bounds for a catch'],
      },
    ],
  });
})(window.FD);
