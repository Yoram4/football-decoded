const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const FD = { MID: 26.665 };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/lib/plays.js'), 'utf8'), { window: { FD } });
const offense = FD.F.off(42), defense = FD.F.def(42);
const blocks = FD.R.blocks(offense, FD.R.OL);
const runner = FD.R.abs(offense, 'RB', [[47, 28]], { k: 'run', move: true, delay: 250, dur: 1400 });
const setup = { off: 'NE', players: [...offense, ...defense], routes: blocks };
assert.equal(FD.playRoutes(setup).length, 0, 'assignment-only diagrams stay static');
const play = { ...setup, routes: [...blocks, runner], players: [...offense, ...FD.F.patch(defense, { MIKE: { x: 46, y: 28, delay: 350, dur: 900 } })] };
const moves = FD.playRoutes(play, setup);
assert.equal(moves.filter((r) => r.k === 'block').length, 5, 'all five linemen move');
assert.equal(moves.find((r) => r.p === 'NE-RB').delay, 250, 'handoff delay survives');
for (const route of moves.filter((r) => r.k === 'block')) {
  const player = offense.find((p) => p.id === route.p);
  assert.equal(route.d[0][0], player.x);
  assert.equal(route.d[0][1], player.y);
}
const reaction = moves.find((r) => r.p === 'NYJ-MIKE');
assert.equal(reaction.d[0][0], FD.F.get(defense, 'MIKE').x);
assert.equal(reaction.d.at(-1)[0], 46);
assert.equal(reaction.delay, 350);
assert.equal(blocks.some((r) => r.move), false, 'authored routes are not mutated');
const opening = FD.playRoutes({ ...setup, routes: [...blocks, runner] });
assert.equal(opening.filter((r) => r.p.startsWith('NYJ-')).length, 11, 'opening run gets engagement and pursuit');
assert.equal(opening.find((r) => r.p === 'NYJ-DT1').delay, 0, 'front engages at the snap');
assert.ok(opening.find((r) => r.p === 'NYJ-MIKE').delay < runner.delay + runner.dur, 'pursuit begins while the runner moves');
assert.equal(moves.filter((r) => r.p === 'NYJ-MIKE').length, 1, 'authored reactions override fallback pursuit');
const newFormation = { ...setup, players: [...offense, ...FD.F.shift(defense, 5)], routes: [...blocks, { ...runner, k: 'route' }] };
assert.equal(FD.playRoutes(newFormation, setup).some((r) => r.p.startsWith('NYJ-')), false, 'formation changes are not defensive reactions');
const diagram = FD.playRoutes({ ...play, motion: 'diagram' }, setup);
assert.equal(diagram.length, 1, 'diagrams do not infer blocking or pursuit');
assert.equal(diagram[0].p, 'NE-RB', 'only the explicitly animated runner moves');
const scoringMoves = { 1: ['NE-RB'], 2: ['BALL'], 3: ['BALL', 'NE-QB', 'NE-X'], 4: ['BALL'], 5: ['NE-RB', 'NYJ-DE2'], 6: ['BALL'] };
for (const language of ['chapters', 'he/chapters']) {
  FD.CH = [];
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src', language, 'ch03.js'), 'utf8'), { window: { FD } });
  const chapter = FD.CH[0];
  assert.equal(chapter.base.motion, 'diagram', 'scoring uses demonstration mode');
  let previous = { ...chapter.base, off: 'NE', players: [], routes: [] };
  chapter.steps.forEach((step, index) => {
    const state = { ...previous, ...step };
    const planned = FD.playRoutes(state, previous);
    assert.equal(planned.map((route) => route.p).sort().join(), (scoringMoves[index] || []).join(), `${language} scoring step ${index + 1} only animates the intended subjects`);
    previous = state;
  });
}
console.log('OK: live blocks, defensive reactions, handoff timing, static setups, scoring demonstrations');