// Usage: node tests/check_chapter.js src/chapters/chNN.js [more...]
// Loads lib/plays.js + a chapter in a stub FD and validates the schema.
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = path.join(__dirname, '..', 'src');
const OV = ['title', 'big', 'panel', 'stats', 'card', 'league', 'calendar', 'matrix', 'bracket', 'signal', 'signals', 'photo', 'logos', 'tv', 'frame', 'clock', 'timeline', 'compare', 'video'];
const MK = ['text', 'line', 'arrow', 'rect', 'circle', 'num', 'flag', 'ball', 'img', 'measure', 'post'];
const W = ['c17', 'heat', 'sim', 'cards', 'quiz', 'gloss'];
const SIGS = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17, 19, 20, 21, 22, 23, 26, 32, 33];
const ASSETS = 'nfl ne ne_png ne_helmet ne_endzone ne_endzone_ko ne_wordmark pat nyj nyj_helmet nyj_wordmark nyj_ko buf mia lombardi tv_cbs tv_cbs_eye tv_fox_sunday tv_nfl_fox tv_nbc tv_snf tv_espn tv_prime photo_gillette photo_gillette_fw photo_gillette_fw2 photo_banners photo_broadcast'.split(' ');
const SFX = ['whistle', 'roar', 'cheer', 'hit', 'hit2', 'huddle'];
const KEYS = 'id title cam los fd ball lbl off dlbl players routes zones marks bug l3 tags ov photo w sfx auto deep notes skin'.split(' ');

let bad = 0;
const err = (f, s, m) => { bad++; console.log(`  ✗ ${f} step ${s}: ${m}`); };
for (const file of process.argv.slice(2)) {
  const FD = { CH: [], W: {}, MID: 26.665, own: (t, n) => (t === 'NE' ? 10 + n : 110 - n), opp: (t, n) => (t === 'NE' ? 110 - n : 10 + n) };
  const ctx = { window: { FD }, FD, console };
  vm.createContext(ctx);
  try {
    vm.runInContext(fs.readFileSync(path.join(SRC, 'lib', 'plays.js'), 'utf8'), ctx);
    vm.runInContext(fs.readFileSync(path.join(SRC, 'widgets', 'cards.js'), 'utf8'), ctx);
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  } catch (e) { console.log(`✗ ${file}: ${e.stack.split('\n').slice(0, 3).join(' | ')}`); bad++; continue; }
  const f = path.basename(file);
  if (FD.CH.length !== 1) { err(f, '-', `expected exactly 1 FD.CH.push, got ${FD.CH.length}`); continue; }
  const ch = FD.CH[0];
  if (!ch.title || !Array.isArray(ch.steps) || !ch.steps.length) err(f, '-', 'missing title/steps');
  let n = 0;
  ch.steps.forEach((s, i) => {
    const S = i + 1;
    Object.keys(s).forEach((k) => KEYS.includes(k) || err(f, S, `unknown key "${k}"`));
    if (!s.title) err(f, S, 'missing title');
    if (!s.notes || !Array.isArray(s.notes.p) || s.notes.p.length < 2) err(f, S, 'notes.p needs 2+ points');
    else { if (!s.notes.a && !s.notes.x) err(f, S, 'notes need analogy (a) and/or expert (x)'); n += s.notes.p.length; }
    if (s.cam && !(isFinite(s.cam.x) && isFinite(s.cam.y) && s.cam.w > 5)) err(f, S, 'bad cam');
    const ids = new Set();
    (s.players || []).forEach((p) => {
      if (ids.has(p.id)) err(f, S, `duplicate player id ${p.id}`); ids.add(p.id);
      if (!isFinite(p.x) || !isFinite(p.y)) err(f, S, `player ${p.id} bad coords`);
      if (p.x < -5 || p.x > 125 || p.y < -3 || p.y > 57) err(f, S, `player ${p.id} off field (${p.x},${p.y})`);
    });
    const rids = new Set();
    (s.routes || []).forEach((r) => {
      if (rids.has(r.id)) err(f, S, `duplicate route id ${r.id}`); rids.add(r.id);
      if (!Array.isArray(r.d) || r.d.length < 2 || r.d.some((p) => !isFinite(p[0]) || !isFinite(p[1]))) err(f, S, `route ${r.id} bad d`);
      if (r.move && !(s.players || []).some((p) => p.id === r.p)) err(f, S, `route ${r.id} moves missing player ${r.p}`);
    });
    const mids = new Set();
    (s.marks || []).forEach((m) => { if (mids.has(m.id)) err(f, S, `dup mark ${m.id}`); mids.add(m.id); if (!MK.includes(m.type)) err(f, S, `mark type ${m.type}`); if (m.type === 'img' && !ASSETS.includes(m.key)) err(f, S, `asset ${m.key}`); });
    const oids = new Set();
    (s.ov || []).forEach((o) => {
      if (!o.id) err(f, S, 'overlay without id'); if (oids.has(o.id)) err(f, S, `dup ov ${o.id}`); oids.add(o.id);
      if (!OV.includes(o.type)) err(f, S, `overlay type ${o.type}`);
      if (o.type === 'signal' && !SIGS.includes(o.sig)) err(f, S, `signal ${o.sig} not available`);
      if (o.type === 'signals') o.items.forEach((it) => SIGS.includes(it.sig) || err(f, S, `signal ${it.sig} not available`));
      ['img', 'key'].forEach((k) => o[k] && !ASSETS.includes(o[k]) && err(f, S, `asset ${o[k]}`));
      if (o.type === 'logos') o.items.forEach((k) => ASSETS.includes(k) || err(f, S, `asset ${k}`));
      if (o.type === 'tv') o.items.forEach((it) => [].concat(it.logo || []).forEach((k) => ASSETS.includes(k) || err(f, S, `asset ${k}`)));
      if (o.type === 'video' && !['butler', 'miracle', 'jones'].includes(o.yt)) err(f, S, `video ${o.yt}`);
    });
    (s.zones || []).forEach((z) => { if (!z.id) err(f, S, 'zone without id'); });
    if (s.w && !W.includes(typeof s.w === 'string' ? s.w : s.w.name)) err(f, S, `widget ${s.w}`);
    if (s.photo && !ASSETS.includes(s.photo.key)) err(f, S, `photo ${s.photo.key}`);
    [].concat(s.sfx || []).forEach((x) => SFX.includes(typeof x === 'string' ? x : x.n) || err(f, S, `sfx ${JSON.stringify(x)}`));
    if (s.l3 && s.l3.t && s.l3.t.length > 40) err(f, S, `l3.t too long (${s.l3.t.length})`);
    if (s.l3 && s.l3.s && s.l3.s.length > 90) err(f, S, `l3.s too long (${s.l3.s.length})`);
  });
  console.log(`${bad ? '✗' : '✓'} ${f}: "${ch.title}" ${ch.steps.length} steps, ${n} note points`);
}
console.log(bad ? `FAIL (${bad} problems)` : 'OK');
process.exit(bad ? 1 : 0);
