/* Authoring helpers: formations (FD.F), routes (FD.R). All coordinates in yards. */
(function (FD) {
  'use strict';
  const M = FD.MID;
  const F = (FD.F = {});
  const R = (FD.R = {});

  // ---------- offense ----------
  // los: x of line of scrimmage; dir: +1 attacks right (toward NYJ end zone), -1 attacks left; s: strong side +1 (down) / -1 (up)
  F.off = function (los, o = {}) {
    const t = o.team || 'NE', d = o.dir ?? (t === 'NE' ? 1 : -1), s = o.strong ?? 1, set = o.set || 'gun', pers = o.pers || '11';
    const P = (id, pos, back, lat, extra = {}) => ({ id: `${t}-${id}`, t, pos, x: +(los - d * back).toFixed(2), y: +(M + lat).toFixed(2), ...extra });
    const pl = [P('LT', 'T', 0.9, -4.2 * s), P('LG', 'G', 0.9, -2.1 * s), P('C', 'C', 0.9, 0), P('RG', 'G', 0.9, 2.1 * s), P('RT', 'T', 0.9, 4.2 * s)];
    const qbBack = set === 'gun' ? 5 : set === 'pistol' ? 4 : 1.7;
    pl.push(P('QB', 'QB', qbBack, 0));
    const W = o.wide ?? 19;
    if (pers === '11' || pers === '10') {
      pl.push(P('X', 'WR', 0.9, -W * s, { lbl: 'X' }));
      pl.push(P('Z', 'WR', 1.9, W * s, { lbl: 'Z' }));
      pl.push(P('H', 'WR', 1.9, -12.5 * s, { lbl: 'H' }));
    }
    if (pers === '11') pl.push(P('TE', 'TE', 0.9, 6.4 * s, { lbl: 'Y' }));
    if (pers === '10') pl.push(P('S', 'WR', 1.9, 12.5 * s, { lbl: 'S' }));
    if (pers === '12' || pers === '21') {
      pl.push(P('X', 'WR', 0.9, -W * s, { lbl: 'X' }));
      pl.push(P('Z', 'WR', 1.9, W * s, { lbl: 'Z' }));
      pl.push(P('TE', 'TE', 0.9, 6.4 * s, { lbl: 'Y' }));
      if (pers === '12') pl.push(P('TE2', 'TE', 0.9, -6.4 * s, { lbl: 'U' }));
      else pl.push(P('FB', 'FB', 4.3, 0, { lbl: 'FB' }));
    }
    if (set === 'gun') pl.push(P('RB', 'RB', 5, 2.3 * s));
    else pl.push(P('RB', 'RB', set === 'pistol' ? 7 : 7.2, 0));
    return pl;
  };

  // ---------- defense ----------
  F.def = function (los, o = {}) {
    const t = o.team || 'NYJ', d = o.dir ?? (t === 'NYJ' ? 1 : -1), s = o.strong ?? 1, front = o.front || '43', cov = o.cov || '3';
    const P = (id, pos, depth, lat, extra = {}) => ({ id: `${t}-${id}`, t, pos, x: +(los + d * depth).toFixed(2), y: +(M + lat).toFixed(2), ...extra });
    const W = o.wide ?? 19;
    const pl = [];
    if (front === '34') {
      pl.push(P('DE1', 'DE', 1.2, -3.4 * s), P('NT', 'NT', 1.2, 0), P('DE2', 'DE', 1.2, 3.4 * s));
      pl.push(P('OLB1', 'OLB', 1.3, -7 * s), P('OLB2', 'OLB', 1.3, 8 * s), P('ILB1', 'ILB', 4.6, -2.4 * s), P('ILB2', 'ILB', 4.6, 2.4 * s));
    } else {
      pl.push(P('DE1', 'DE', 1.2, -5.6 * s), P('DT1', 'DT', 1.2, -1.6 * s), P('DT2', 'DT', 1.2, 1.9 * s), P('DE2', 'DE', 1.2, 7.4 * s));
      if (front === '43') pl.push(P('WILL', 'LB', 4.6, -4.6 * s), P('MIKE', 'LB', 4.8, 0.3 * s), P('SAM', 'LB', 4.3, 6.4 * s));
      else if (front === 'nickel') pl.push(P('WILL', 'LB', 4.8, -2.6 * s), P('MIKE', 'LB', 4.8, 2.6 * s), P('NB', 'CB', 5, -12.5 * s, { pos: 'NB' }));
      else if (front === 'dime') pl.push(P('MIKE', 'LB', 5, 0), P('NB', 'CB', 5, -12.5 * s, { pos: 'NB' }), P('DB', 'CB', 6, 12.5 * s, { pos: 'DB' }));
    }
    const press = o.press ? 1.4 : cov === '2' ? 4 : 6.5;
    pl.push(P('CB1', 'CB', press, -W * s), P('CB2', 'CB', press, W * s));
    if (cov === '2' || cov === '4') pl.push(P('FS', 'S', 13, -9.5 * s), P('SS', 'S', 13, 9.5 * s));
    else if (cov === '0') pl.push(P('FS', 'S', 6, -3 * s), P('SS', 'S', 6, 4.5 * s));
    else pl.push(P('FS', 'S', 14, 0), P('SS', 'S', 7.5, 8.5 * s));
    if (front === '34' || front === '43') return pl;
    return pl.slice(0, 11);
  };

  F.patch = (pl, map) => pl.map((p) => (map[p.id] || map[p.id.split('-')[1]] ? { ...p, ...(map[p.id] || map[p.id.split('-')[1]]) } : p));
  F.get = (pl, id) => pl.find((p) => p.id === id || p.id.endsWith('-' + id));
  F.only = (pl, ids) => pl.filter((p) => ids.some((i) => p.id === i || p.id.endsWith('-' + i)));
  F.hl = (pl, ids) => pl.map((p) => ({ ...p, hl: ids.some((i) => p.id === i || p.id.endsWith('-' + i)) }));
  F.dim = (pl, keepIds) => pl.map((p) => ({ ...p, dim: !keepIds.some((i) => p.id === i || p.id.endsWith('-' + i)) }));
  F.read = (pl, ids) => pl.map((p) => (ids.some((i) => p.id === i || p.id.endsWith('-' + i)) ? { ...p, read: true } : p));
  F.shift = (pl, dx, dy = 0) => pl.map((p) => ({ ...p, x: +(p.x + dx).toFixed(2), y: +(p.y + dy).toFixed(2) }));
  // positions after all move-routes in `routes` complete
  F.after = (pl, routes) => pl.map((p) => {
    const r = routes.find((q) => q.move && q.p === p.id);
    return r ? { ...p, x: r.d[r.d.length - 1][0], y: r.d[r.d.length - 1][1] } : p;
  });

  // ---------- routes ----------
  // Relative points: [forward yards, lateral yards toward the middle of the field]
  R.TREE = {
    hitch: [[5, 0], [4.2, 0.6]], flat: [[1.5, 0], [3, -6]], slant: [[1.5, 0], [7, 5]], comeback: [[14, 0], [12, -2.5]],
    curl: [[10, 0], [8.5, 1.8]], out: [[10, 0], [10, -6]], dig: [[12, 0], [12, 9]], corner: [[10, 0], [17, -6]],
    post: [[10, 0], [20, 6]], go: [[22, 0]], seam: [[18, 0]], whip: [[4, 2.5], [3.5, -2]],
    drag: [[2, 1.5], [3, 14]], wheel: [[1, -3], [4, -6.5], [16, -6.5]], swing: [[0, -2.5], [1.5, -6]], check: [[2, 0], [3.5, -3]],
    'arrow': [[1, -1], [4, -7]], 'out5': [[5, 0], [5, -6]], 'in5': [[5, 0], [5, 6]], 'corner-sit': [[12, 0], [15, -4]],
  };
  // name or array; opts: {dir, k, c, move, delay, dur, lbl, curve, id}
  R.make = function (pl, pid, shape, o = {}) {
    const p = F.get(pl, pid);
    if (!p) throw new Error('no player ' + pid);
    const d = o.dir ?? (p.t === 'NE' ? 1 : -1);
    const m = p.y < M ? 1 : -1;            // +lateral = toward the middle
    const rel = Array.isArray(shape) ? shape : R.TREE[shape];
    const pts = [[p.x, p.y], ...rel.map(([f, l]) => [+(p.x + d * f).toFixed(2), +(p.y + m * l).toFixed(2)])];
    return { id: o.id || `r-${p.id}`, p: p.id, k: o.k || 'route', d: pts, ...(o.c ? { c: o.c } : {}), ...(o.move ? { move: true } : {}), ...(o.delay != null ? { delay: o.delay } : {}), ...(o.dur ? { dur: o.dur } : {}), ...(o.lbl ? { lbl: o.lbl } : {}), ...(o.curve ? { curve: true } : {}) };
  };
  // absolute path for a player (first point = player position)
  R.abs = (pl, pid, pts, o = {}) => {
    const p = F.get(pl, pid);
    return { id: o.id || `r-${p.id}`, p: p.id, k: o.k || 'route', d: [[p.x, p.y], ...pts], ...o, id: o.id || `r-${p.id}` };
  };
  // short blocks for ids: forward fwd yards, lateral lat (toward +y)
  R.blocks = (pl, ids, fwd = 1.4, lat = 0, o = {}) => ids.map((id) => {
    const p = F.get(pl, id);
    const d = o.dir ?? (p.t === 'NE' ? 1 : -1);
    const l = typeof lat === 'function' ? lat(p) : lat;
    return { id: `b-${p.id}`, p: p.id, k: 'block', d: [[p.x + d * 0.9, p.y], [+(p.x + d * (0.9 + fwd)).toFixed(2), +(p.y + l).toFixed(2)]], ...(o.delay != null ? { delay: o.delay } : {}) };
  });
  R.OL = ['LT', 'LG', 'C', 'RG', 'RT'];
  // pass: ball flight from QB to a point
  R.pass = (from, to, o = {}) => ({ id: o.id || 'pass', k: 'pass', d: [from, to], delay: o.delay ?? 900, dur: o.dur ?? 550, ...o });
  // the ball as a moving "player" so it can travel along a pass/kick path
  F.ball = (x, y, id = 'BALL') => ({ id, t: 'BALL', pos: '', x, y, shape: 'ball', lbl: '' });
})(window.FD);
