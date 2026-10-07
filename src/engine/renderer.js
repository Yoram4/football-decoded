/* Renderer: state-driven, keyed, reversible. FD.render(nextResolvedState, {instant, forward}) */
(function (FD) {
  'use strict';
  const TL = FD.TL, E = FD.ease;
  const COLORS = { w: '#ffffff', r: '#ff4d4d', y: '#FACC15', b: '#60a5fa', n: '#0a3a70', g: '#34d399', s: '#B0B7BC', o: '#fb923c', p: '#c084fc', k: '#0b0f19' };
  const col = (c, d) => (c ? COLORS[c] || c : d);
  FD.COLORS = COLORS;

  FD.DEFAULTS = {
    cam: { x: 60, y: 26.67, w: 132 }, skin: null, off: 'NE',
    los: null, fd: null, ball: null, lbl: false,
    players: [], routes: [], zones: [], marks: [], ov: [],
    l3: null, tags: [], photo: null, w: null,
  };
  const NOINHERIT = ['id', 'title', 'sfx', 'notes', 'deep', 'w', 'skin', 'auto', 'ov', 'photo', 'tags'];
  FD.BUG0 = { hs: 0, as: 0, q: '1ST', clk: '15:00', pc: null, down: null, dist: null, poss: 'NE', toH: 3, toA: 3, hide: false, msg: null, flag: false, pcRun: false, clkRun: false };

  // ---------- resolve chapters -> flat step list ----------
  FD.resolve = function () {
    const out = [];
    let bug = { ...FD.BUG0 };
    FD.CH.forEach((ch, ci) => {
      let prev = { ...FD.clone(FD.DEFAULTS), ...FD.clone(ch.base || {}) };
      if (ch.intro && !ch._introAdded) {         // fix ids first so the intro doesn't shift existing step ids
        ch.steps.forEach((r, si) => { r.id = r.id || `ch${String(ci).padStart(2, '0')}-s${String(si + 1).padStart(2, '0')}`; });
        ch.steps.unshift({
          id: `ch${String(ci).padStart(2, '0')}-intro`, _intro: true, title: FD.T('Intro: {t}', { t: ch.title }), l3: null, routes: [], marks: [], zones: [],
          ov: [{ id: 'chintro', type: 'chapter', pos: 'c', n: ci, t: ch.title, s: ch.sub, items: ch.intro.items, why: ch.intro.why }],
          notes: { p: [FD.T('Quick map of this part before we dive in:'), ...ch.intro.items], a: ch.intro.why, x: FD.T('Chapter overview step: press → to start, or ↓ to skip the whole chapter.') },
        });
        ch._introAdded = true;
      }
      ch.steps.forEach((raw, si) => {
        const st = {};
        for (const k in prev) if (!NOINHERIT.includes(k)) st[k] = prev[k];
        Object.assign(st, FD.clone(raw));
        bug = { ...bug, ...(raw.bug || {}) };
        if (raw.bug && raw.bug.reset) bug = { ...FD.BUG0, ...raw.bug };
        st.bug = raw._intro ? { ...bug, hide: true } : { ...bug };
        st.id = raw.id || `ch${String(ci).padStart(2, '0')}-s${String(si + 1).padStart(2, '0')}`;
        st.deep = !!(raw.deep || ch.deep);
        st.skin = raw.skin || 'tv';
        st.notes = raw.notes || { p: [] };
        st.title = raw.title || (raw.l3 && raw.l3.t) || ch.title;
        st._c = ci; st._s = si; st._ch = ch;
        out.push(st);
        prev = st;
      });
    });
    FD.STEPS = out;
    return out;
  };

  // ---------- path helpers ----------
  const P = (FD.P = {});
  P.d = (pts, curve) => {
    if (!pts || !pts.length) return '';
    if (!curve || pts.length < 3) return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('');
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {     // Catmull-Rom -> cubic
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0]} ${p2[1]}`;
    }
    return d;
  };
  P.arc = (a, b, lift = 0.25) => {               // ball flight: quadratic arc bulging sideways
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    return `M${a[0]} ${a[1]}Q${(mx + dy * lift).toFixed(2)} ${(my - dx * lift).toFixed(2)} ${b[0]} ${b[1]}`;
  };
  P.head = (p1, p2, s) => {
    const a = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]), c = Math.cos(a), n = Math.sin(a);
    const tx = p2[0] + c * s * 0.55, ty = p2[1] + n * s * 0.55, bx = p2[0] - c * s * 0.45, by = p2[1] - n * s * 0.45;
    return `M${tx} ${ty}L${bx - n * s * 0.55} ${by + c * s * 0.55}L${bx + n * s * 0.55} ${by - c * s * 0.55}Z`;
  };

  // ---------- DOM refs ----------
  let svg, gCam, layers = {}, hud, ovLayer, wLayer, photoEl;
  FD.mountRenderer = function () {
    svg = FD.$('#field');
    FD.drawField(svg);
    const mk = (id) => { const g = FD.svg('g', { id }); svg.appendChild(g); return g; };
    layers.zones = mk('gZones'); layers.lines = mk('gLines'); layers.routes = mk('gRoutes');
    layers.marksU = mk('gMarksU'); layers.players = mk('gPlayers'); layers.marks = mk('gMarks');
    layers.lines.innerHTML = `
      <g id="los" class="ln-los"><line x1="0" y1="0" x2="0" y2="53.33"/><text class="ln-lbl" x="-.5" y="2.2" text-anchor="end">${FD.T('LINE OF SCRIMMAGE')}</text></g>
      <g id="fdl" class="ln-fd"><line x1="0" y1="0" x2="0" y2="53.33" filter="url(#fglow)"/><text class="ln-lbl" x=".5" y="2.2">${FD.T('LINE TO GAIN')}</text></g>
      <g id="ballG"><ellipse rx=".55" ry=".32" class="ball"/><path d="M-.25 0h.5" class="lace"/></g>`;
    hud = FD.$('#hud'); ovLayer = FD.$('#ov'); wLayer = FD.$('#wl'); photoEl = FD.$('#photo');
    FD._pl = new Map(); FD._rt = new Map(); FD._zn = new Map(); FD._mk = new Map(); FD._ov = new Map();
    FD.camNow = { ...FD.DEFAULTS.cam };
    setVB(FD.camNow);
    addEventListener('resize', () => {
      if (FD.cur) FD.camNow = phoneCamera(FD.cur.cam, FD.cur);
      setVB(FD.camNow);
      FD.updateTouchProgress && FD.updateTouchProgress(FD.idx);
    });
  };

  // ---------- camera ----------
  function setVB(c) {
    const r = svg.getBoundingClientRect();
    const asp = r.height / Math.max(1, r.width) || 9 / 16;
    const h = c.w * asp;
    svg.setAttribute('viewBox', `${(c.x - c.w / 2).toFixed(3)} ${(c.y - h / 2).toFixed(3)} ${c.w.toFixed(3)} ${h.toFixed(3)}`);
  }
  const PHONE_DETAILS_TYPES = new Set(['panel', 'stats', 'compare', 'signal', 'timeline', 'card']);
  FD.isPhoneFieldDiagram = (st) => matchMedia('(max-width:700px) and (orientation:portrait)').matches &&
    (st.players || []).length >= 8 &&
    (['routes', 'zones', 'marks'].some((k) => (st[k] || []).length) || (st.ov || []).some((o) => PHONE_DETAILS_TYPES.has(o.type)));

  function phoneDiagramCamera(target, st) {
    const xs = [], ys = [];
    const add = (x, y) => {
      if (Number.isFinite(x) && Number.isFinite(y)) { xs.push(x); ys.push(y); }
    };
    const addPoints = (points) => (points || []).forEach((p) => {
      if (Array.isArray(p)) add(p[0], p[1]);
    });

    (st.players || []).forEach((p) => add(p.x, p.y));
    (st.routes || []).forEach((r) => addPoints(r.d));
    if (st.ball && typeof st.ball === 'object') add(st.ball.x, st.ball.y);
    (st.zones || []).forEach((z) => {
      if (z.ell) {
        add(z.ell[0] - z.ell[2], z.ell[1] - z.ell[3]);
        add(z.ell[0] + z.ell[2], z.ell[1] + z.ell[3]);
      } else if (z.rect) {
        add(z.rect[0], z.rect[1]);
        add(z.rect[0] + z.rect[2], z.rect[1] + z.rect[3]);
      } else addPoints(z.d);
    });
    (st.marks || []).forEach((m) => {
      if (m.d) addPoints(m.d);
      if (m.x1 != null && m.y1 != null) add(m.x1, m.y1);
      if (m.x2 != null && m.y2 != null) add(m.x2, m.y2);
      if (m.x != null && m.y != null) {
        add(m.x, m.y);
        if (m.w != null && m.h != null) add(m.x + m.w, m.y + m.h);
      }
    });
    if (st.los != null) xs.push(st.los);
    if (st.fd != null) xs.push(st.fd);
    if (!xs.length || !ys.length) return { ...target, w: Math.min(target.w, 46) };

    const r = svg.getBoundingClientRect();
    const aspect = r.height / Math.max(1, r.width) || 9 / 16;
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = Math.max(28, maxX - minX + 10, (maxY - minY + 8) / aspect);
    return { ...target, x: (minX + maxX) / 2, y: (minY + maxY) / 2, w };
  }

  function camera(to, instant) {
    const from = { ...FD.camNow }, tgt = { ...FD.DEFAULTS.cam, ...to };
    const same = from.x === tgt.x && from.y === tgt.y && from.w === tgt.w;
    if (instant || same) { FD.camNow = tgt; setVB(tgt); return; }
    const dur = 600 + Math.min(300, Math.abs(from.w - tgt.w) * 4 + Math.hypot(from.x - tgt.x, from.y - tgt.y) * 3);
    TL.add(0, dur, (k) => {
      FD.camNow = { x: FD.lerp(from.x, tgt.x, k), y: FD.lerp(from.y, tgt.y, k), w: FD.lerp(from.w, tgt.w, k) };
      setVB(FD.camNow);
    });
  }
  function phoneCamera(cam, st) {
    const target = { ...FD.DEFAULTS.cam, ...cam };
    if (!matchMedia('(max-width:700px) and (orientation:portrait)').matches) return target;
    if (FD.isPhoneFieldDiagram(st)) return phoneDiagramCamera(target, st);

    const routes = (st.routes || []).filter((r) => r.move && r.d && r.d.length);
    const ball = routes.find((r) => r.p === 'BALL' && (r.k === 'pass' || r.k === 'kick'));
    const carrier = routes.find((r) => r.k === 'run' && (st.players || []).some((p) => p.id === r.p && p.t === st.off));
    const track = ball || carrier;
    let x = st.los == null ? target.x : st.los, y = target.y;
    let w = Math.min(target.w, 96);

    if (track) {
      const start = track.d[0], end = track.d[track.d.length - 1];
      const xs = [start[0], end[0]];
      if (st.los != null) xs.push(st.los);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      x = (minX + maxX) / 2;
      y = (start[1] + end[1]) / 2;
      w = Math.min(target.w, Math.min(118, Math.max(76, maxX - minX + 28)));
    } else if (st.ball && typeof st.ball === 'object') {
      x = st.ball.x; y = st.ball.y;
    } else if (st.los == null && st.players && st.players.length) {
      const xs = st.players.filter((p) => p.t !== 'BALL').map((p) => p.x);
      if (xs.length) x = (Math.min(...xs) + Math.max(...xs)) / 2;
    }
    return { ...target, x, y, w };
  }

  // ---------- lines + ball ----------
  const lineState = { los: null, fd: null, bx: null, by: null };
  function lines(st, instant) {
    const losG = FD.$('#los'), fdG = FD.$('#fdl'), ballG = FD.$('#ballG');
    const set = (g, key, x) => {
      const from = lineState[key];
      if (x == null) { g.style.opacity = 0; lineState[key] = null; return; }
      g.style.opacity = 1;
      g.classList.toggle('lbl', !!st.lbl);
      if (from == null || instant) { g.setAttribute('transform', `translate(${x} 0)`); lineState[key] = x; return; }
      TL.add(0, 650, (k) => { const v = FD.lerp(from, x, k); g.setAttribute('transform', `translate(${v} 0)`); lineState[key] = v; });
    };
    set(losG, 'los', st.los);
    set(fdG, 'fd', st.fd != null && st.fd > 10 && st.fd < 110 ? st.fd : null);
    const b = st.ball === false ? null : st.ball || (st.los != null ? { x: st.los, y: FD.MID } : null);
    if (!b) { ballG.style.opacity = 0; lineState.bx = null; return; }
    ballG.style.opacity = 1;
    const fx = lineState.bx, fy = lineState.by;
    if (fx == null || instant) { ballG.setAttribute('transform', `translate(${b.x} ${b.y})`); lineState.bx = b.x; lineState.by = b.y; return; }
    TL.add(0, 650, (k) => { const x = FD.lerp(fx, b.x, k), y = FD.lerp(fy, b.y, k); ballG.setAttribute('transform', `translate(${x} ${y})`); lineState.bx = x; lineState.by = y; });
  }

  // ---------- routes ----------
  function routeEnd(r) { return r.d[r.d.length - 1]; }
  function buildRoute(r) {
    const g = FD.svg('g', { class: `rt rt-${r.k || 'route'}`, 'data-id': r.id });
    const k = r.k || 'route';
    const def = { route: '#ffffff', block: 'rgba(255,255,255,.85)', run: '#FACC15', pass: '#fde68a', kick: '#fde68a', motion: '#93c5fd', zone: 'rgba(255,255,255,.7)' }[k];
    const c = col(r.c, def);
    const w = r.w || (k === 'block' ? 0.34 : k === 'run' ? 0.5 : 0.42);
    let d;
    if (k === 'pass' || k === 'kick') d = P.arc(r.d[0], routeEnd(r), r.lift ?? (k === 'kick' ? 0.35 : 0.12));
    else d = P.d(r.d, r.curve);
    const path = FD.svg('path', { d, stroke: c, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    if (k === 'motion' || k === 'pass' || k === 'kick' || r.dash) path.setAttribute('stroke-dasharray', '.6 .45');
    if (r.glow !== false && (k === 'run' || r.c === 'r' || r.c === 'y')) path.setAttribute('filter', 'url(#fsoft)');
    g.appendChild(path);
    let head = null;
    if (k === 'block') {
      const n = r.d.length, a = r.d[n - 2], b = r.d[n - 1];
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), px = -Math.sin(ang) * 0.65, py = Math.cos(ang) * 0.65;
      head = FD.svg('path', { d: `M${b[0] - px} ${b[1] - py}L${b[0] + px} ${b[1] + py}`, stroke: c, 'stroke-width': w, 'stroke-linecap': 'round' });
    } else if (r.arrow !== false && k !== 'zone') {
      const n = r.d.length;
      let a = r.d[n - 2];
      if (k === 'pass' || k === 'kick') {
        const A = r.d[0], B = r.d[n - 1], lift = r.lift ?? (k === 'kick' ? 0.35 : 0.12);
        const C = [(A[0] + B[0]) / 2 + (B[1] - A[1]) * lift, (A[1] + B[1]) / 2 - (B[0] - A[0]) * lift], t = 0.9, u = 1 - t;
        a = [u * u * A[0] + 2 * u * t * C[0] + t * t * B[0], u * u * A[1] + 2 * u * t * C[1] + t * t * B[1]];
      }
      head = FD.svg('path', { d: P.head(a, r.d[n - 1], r.head || 1.25), fill: c });
    }
    if (head) g.appendChild(head);
    if (r.lbl) {
      const e = routeEnd(r);
      const t = FD.svg('text', { x: e[0] + (r.lx ?? 0.9), y: e[1] + (r.ly ?? 0.4), class: 'rt-lbl', fill: c });
      t.textContent = r.lbl;
      g.appendChild(t);
    }
    return { g, path, head };
  }
  function routes(prev, st, instant) {
    const keep = new Set();
    const prevSig = new Map((prev.routes || []).map((r) => [r.id, JSON.stringify(r)]));
    st.routes.forEach((r) => {
      keep.add(r.id);
      const sig = JSON.stringify(r);
      const ex = FD._rt.get(r.id);
      if (ex && ex.sig === sig) return;
      if (ex) ex.g.remove();
      const o = buildRoute(r);
      o.sig = sig;
      layers.routes.appendChild(o.g);
      FD._rt.set(r.id, o);
      const animate = !instant && prevSig.get(r.id) !== sig;
      const L = o.path.getTotalLength ? o.path.getTotalLength() : 10;
      const dash = o.path.getAttribute('stroke-dasharray');
      if (!animate) return;
      const delay = (r.delay ?? 0) * FD.SPEED, dur = (r.dur ?? Math.max(450, Math.min(1400, L * 45))) * FD.SPEED;
      if (o.head) { o.head.style.opacity = 0; TL.add(delay + dur * 0.9, 200, (k) => (o.head.style.opacity = k), E.lin); }
      if (o.g.querySelector('.rt-lbl')) { const t = o.g.querySelector('.rt-lbl'); t.style.opacity = 0; TL.add(delay + dur, 250, (k) => (t.style.opacity = k), E.lin); }
      if (dash) { o.path.style.opacity = 0; TL.add(delay, dur, (k) => (o.path.style.opacity = Math.min(1, k * 2.5)), E.lin); return; }
      o.path.style.strokeDasharray = `${L} ${L}`;
      o.path.style.strokeDashoffset = L;
      TL.add(delay, dur, (k) => { o.path.style.strokeDashoffset = L * (1 - k); if (k >= 1) { o.path.style.strokeDasharray = ''; o.path.style.strokeDashoffset = ''; } }, r.k === 'run' || r.k === 'route' ? E.inOut : E.out);
    });
    for (const [id, o] of FD._rt) if (!keep.has(id)) { FD._rt.delete(id); fadeOut(o.g, instant); }
  }
  function fadeOut(el, instant) {
    if (instant) { el.remove(); return; }
    const o0 = +getComputedStyle(el).opacity || 1;
    TL.add(0, 250, (k) => { el.style.opacity = o0 * (1 - k); if (k >= 1) el.remove(); }, E.lin);
  }

  // ---------- players ----------
  function samplePath(r) {
    const tmp = FD.svg('path', { d: r.k === 'pass' || r.k === 'kick' ? P.arc(r.d[0], routeEnd(r)) : P.d(r.d, r.curve) });
    layers.routes.appendChild(tmp);
    const L = tmp.getTotalLength(), pts = [];
    for (let i = 0; i <= 60; i++) { const p = tmp.getPointAtLength((L * i) / 60); pts.push([p.x, p.y]); }
    tmp.remove();
    return pts;
  }
  function buildPlayer(p, st) {
    const off = p.t === st.off;
    const shape = p.shape || (off ? 'O' : 'X');
    const g = FD.svg('g', { class: `pl pl-${p.t} ${off ? 'pl-off' : 'pl-def'}`, 'data-id': p.id });
    if (shape === 'O') {
      g.appendChild(FD.svg('circle', { r: 1, class: 'pl-o' }));
    } else if (shape === 'X') {
      g.appendChild(FD.svg('path', { d: 'M-.85 -.85L.85 .85M.85 -.85L-.85 .85', class: 'pl-x-under' }));
      g.appendChild(FD.svg('path', { d: 'M-.85 -.85L.85 .85M.85 -.85L-.85 .85', class: 'pl-x' }));
    } else if (shape === 'ref') {
      g.appendChild(FD.svg('rect', { x: -0.75, y: -0.75, width: 1.5, height: 1.5, rx: 0.2, class: 'pl-ref' }));
    } else if (shape === 'ball') {
      g.innerHTML = '<ellipse rx=".6" ry=".36" class="ball"/><path d="M-.27 0h.54" class="lace"/>';
      g.classList.add('pl-ball');
    }
    g.appendChild(FD.svg('circle', { r: 1.7, class: 'pl-hl' }));
    const t = FD.svg('text', { class: shape === 'O' ? 'pl-t' : 'pl-t pl-t-out', y: shape === 'O' ? 0.05 : 1.9 });
    g.appendChild(t);
    g.addEventListener('click', (e) => FD.onPlayerClick && FD.onPlayerClick(e, g.dataset.id));
    return g;
  }
  function decorate(g, p, st) {
    const shape = p.shape || (p.t === st.off ? 'O' : 'X');
    const label = p.lbl != null ? p.lbl : shape === 'O' ? p.pos || '' : st.dlbl ? p.pos || '' : '';
    const t = g.querySelector('.pl-t');
    t.textContent = label;
    t.setAttribute('font-size', label.length > 2 ? 0.72 : 0.95);
    g.classList.toggle('hl', !!p.hl);
    g.classList.toggle('read', !!p.read);
    g.classList.toggle('dim', !!p.dim);
    g.classList.toggle('pl-off', p.t === st.off);
    g.classList.toggle('pl-def', p.t !== st.off);
  }
  function players(prev, st, instant) {
    const moves = new Map();
    st.routes.forEach((r) => r.move && r.p && moves.set(r.p, r));
    const prevRouteSig = new Map((prev.routes || []).map((r) => [r.id, JSON.stringify(r)]));
    const keep = new Set();
    st.players.forEach((p) => {
      keep.add(p.id);
      let o = FD._pl.get(p.id);
      const mv = moves.get(p.id);
      const end = mv ? routeEnd(mv) : [p.x, p.y];
      if (o && o.shapeKey !== (p.shape || (p.t === st.off ? 'O' : 'X'))) { o.g.remove(); FD._pl.delete(p.id); o = null; }
      if (!o) {
        const g = buildPlayer(p, st);
        layers.players.appendChild(g);
        o = { g, x: p.x, y: p.y, shapeKey: p.shape || (p.t === st.off ? 'O' : 'X') };
        FD._pl.set(p.id, o);
        g.setAttribute('transform', `translate(${p.x} ${p.y})`);
        if (!instant) { g.style.opacity = 0; TL.add(p.delay || 0, 300, (k) => (g.style.opacity = k), E.lin); }
      }
      decorate(o.g, p, st);
      const set = (x, y) => { o.x = x; o.y = y; o.g.setAttribute('transform', `translate(${x.toFixed(3)} ${y.toFixed(3)})`); };
      const animateMove = mv && !instant && prevRouteSig.get(mv.id) !== JSON.stringify(mv);
      if (instant) { set(end[0], end[1]); return; }
      if (animateMove) {
        const fx = o.x, fy = o.y, pts = samplePath(mv);
        const pre = Math.hypot(fx - p.x, fy - p.y) > 0.05 ? 450 : 0;
        if (pre) TL.add(0, pre, (k) => set(FD.lerp(fx, p.x, k), FD.lerp(fy, p.y, k)));
        const delay = mv.k === 'run' && p.t === st.off ? pre : Math.max(pre, (mv.delay ?? 0) * FD.SPEED);
        const L = pts.length - 1;
        const dur = (mv.dur ?? Math.max(450, Math.min(1400, mvLen(pts) * 45))) * FD.SPEED;
        TL.add(delay, dur, (k) => { const f = k * L, i = Math.min(L - 1, Math.floor(f)), r = f - i; set(FD.lerp(pts[i][0], pts[i + 1][0], r), FD.lerp(pts[i][1], pts[i + 1][1], r)); }, mv.k === 'pass' || mv.k === 'kick' ? E.lin : E.inOut);
        return;
      }
      if (Math.hypot(o.x - end[0], o.y - end[1]) > 0.01) {
        const fx = o.x, fy = o.y;
        TL.add(p.delay || 0, p.dur || 700, (k) => set(FD.lerp(fx, end[0], k), FD.lerp(fy, end[1], k)));
      }
    });
    for (const [id, o] of FD._pl) if (!keep.has(id)) { FD._pl.delete(id); fadeOut(o.g, instant); }
  }
  function mvLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }

  // ---------- zones ----------
  function zones(st, instant) {
    const keep = new Set();
    st.zones.forEach((z) => {
      keep.add(z.id);
      const sig = JSON.stringify(z);
      const ex = FD._zn.get(z.id);
      if (ex && ex.sig === sig) return;
      if (ex) ex.g.remove();
      const g = FD.svg('g', { class: 'zone' });
      const c = col(z.c, '#60a5fa');
      let el;
      if (z.ell) el = FD.svg('ellipse', { cx: z.ell[0], cy: z.ell[1], rx: z.ell[2], ry: z.ell[3] });
      else if (z.rect) el = FD.svg('rect', { x: z.rect[0], y: z.rect[1], width: z.rect[2], height: z.rect[3], rx: z.rx ?? 0.6 });
      else el = FD.svg('path', { d: P.d(z.d) + 'Z' });
      el.setAttribute('fill', c); el.setAttribute('fill-opacity', z.op ?? 0.22);
      el.setAttribute('stroke', c); el.setAttribute('stroke-width', z.sw ?? 0.15); el.setAttribute('stroke-opacity', 0.8);
      if (z.dash !== false) el.setAttribute('stroke-dasharray', '.5 .35');
      g.appendChild(el);
      if (z.lbl) {
        const t = FD.svg('text', { x: z.lx ?? (z.ell ? z.ell[0] : z.rect ? z.rect[0] + z.rect[2] / 2 : z.d[0][0]), y: z.ly ?? (z.ell ? z.ell[1] : z.rect ? z.rect[1] + z.rect[3] / 2 : z.d[0][1]), class: 'zone-lbl', fill: c });
        t.textContent = z.lbl;
        g.appendChild(t);
      }
      layers.zones.appendChild(g);
      FD._zn.set(z.id, { g, sig });
      if (!instant) { g.style.opacity = 0; TL.add(z.delay || 0, 350, (k) => (g.style.opacity = k), E.lin); }
    });
    for (const [id, o] of FD._zn) if (!keep.has(id)) { FD._zn.delete(id); fadeOut(o.g, instant); }
  }

  // ---------- marks (SVG annotations on the field) ----------
  FD.MARK = {
    text: (m) => { const t = FD.svg('text', { x: m.x, y: m.y, class: 'mk-text ' + (m.cls || ''), 'text-anchor': m.anchor || 'middle', 'font-size': m.size || 1.4, fill: col(m.c, '#fff') }); if (m.rot) t.setAttribute('transform', `rotate(${m.rot} ${m.x} ${m.y})`); t.textContent = m.t; return t; },
    line: (m) => FD.svg('line', { x1: m.x1, y1: m.y1, x2: m.x2, y2: m.y2, stroke: col(m.c, '#fff'), 'stroke-width': m.w || 0.2, 'stroke-dasharray': m.dash ? '.5 .4' : '', 'stroke-linecap': 'round' }),
    arrow: (m) => { const g = FD.svg('g'); const c = col(m.c, '#FACC15'); g.appendChild(FD.svg('path', { d: P.d(m.d, m.curve), stroke: c, 'stroke-width': m.w || 0.35, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': m.dash ? '.6 .45' : '', filter: 'url(#fsoft)' })); const n = m.d.length; g.appendChild(FD.svg('path', { d: P.head(m.d[n - 2], m.d[n - 1], m.head || 1.3), fill: c })); return g; },
    rect: (m) => { const g = FD.svg('g'); const c = col(m.c, '#FACC15'); g.appendChild(FD.svg('rect', { x: m.x, y: m.y, width: m.w, height: m.h, fill: c, 'fill-opacity': m.op ?? 0.25, stroke: m.stroke === false ? 'none' : c, 'stroke-width': 0.15, rx: m.rx ?? 0, class: m.pulse ? 'mk-pulse' : '' })); if (m.lbl) { const t = FD.svg('text', { x: m.x + m.w / 2, y: m.ly ?? m.y + m.h / 2 + 0.5, class: 'mk-text', 'text-anchor': 'middle', 'font-size': m.size || 1.5, fill: m.lc || '#fff' }); if (m.rot) t.setAttribute('transform', `rotate(${m.rot} ${m.x + m.w / 2} ${m.ly ?? m.y + m.h / 2})`); t.textContent = m.lbl; g.appendChild(t); } return g; },
    circle: (m) => FD.svg('circle', { cx: m.x, cy: m.y, r: m.r || 2, fill: m.fill || 'none', stroke: col(m.c, '#ff4d4d'), 'stroke-width': m.w || 0.3, filter: 'url(#fsoft)', class: m.pulse ? 'mk-pulse' : '' }),
    num: (m) => { const g = FD.svg('g', { transform: `translate(${m.x} ${m.y})` }); g.appendChild(FD.svg('circle', { r: m.r || 1, fill: col(m.c, '#FACC15') })); const t = FD.svg('text', { class: 'mk-num', 'font-size': (m.r || 1) * 1.25, fill: m.fc || '#111' }); t.textContent = m.t; g.appendChild(t); return g; },
    flag: (m) => { const g = FD.svg('g', { class: 'mk-flag', transform: `translate(${m.x} ${m.y})` }); g.innerHTML = '<path d="M-.15 -.9 L.9 -.75 L.75 .1 L-.15 0Z" fill="#FFD100" stroke="#a37f00" stroke-width=".06"/><circle cx="-.15" cy="0" r=".22" fill="#FFD100"/>'; return g; },
    ball: (m) => { const g = FD.svg('g', { transform: `translate(${m.x} ${m.y}) rotate(${m.rot || 0})` }); g.innerHTML = '<ellipse rx=".55" ry=".32" class="ball"/><path d="M-.25 0h.5" class="lace"/>'; return g; },
    img: (m) => FD.svg('image', { href: FD.asset(m.key), x: m.x, y: m.y, width: m.w, height: m.h, opacity: m.op ?? 1, transform: m.rot ? `rotate(${m.rot} ${m.x + m.w / 2} ${m.y + m.h / 2})` : '', preserveAspectRatio: 'xMidYMid meet' }),
    measure: (m) => {
      const g = FD.svg('g', { class: 'mk-measure' }); const c = col(m.c, '#FACC15'); const y = m.y;
      g.innerHTML = `<path d="M${m.x1} ${y}H${m.x2}M${m.x1} ${y - 0.6}V${y + 0.6}M${m.x2} ${y - 0.6}V${y + 0.6}" stroke="${c}" stroke-width=".22" fill="none"/>`;
      const t = FD.svg('text', { x: (m.x1 + m.x2) / 2, y: y - 0.7, 'text-anchor': 'middle', class: 'mk-text', 'font-size': m.size || 1.5, fill: c }); t.textContent = m.t; g.appendChild(t); return g;
    },
    post: (m) => { // side-view goal post inset drawn in field units
      const g = FD.svg('g', { transform: `translate(${m.x} ${m.y}) scale(${m.s || 1})`, class: 'mk-post' });
      g.innerHTML = '<rect x="-7" y="-7" width="14" height="13" rx=".6" fill="rgba(5,10,20,.82)" stroke="rgba(255,255,255,.3)" stroke-width=".08"/><path d="M0 5V0M-3.1 0H3.1M-3.1 0V-6M3.1 0V-6" stroke="#FACC15" stroke-width=".35" fill="none"/><path d="M-6.5 5H6.5" stroke="#3a7d3a" stroke-width=".4"/><text x="0" y="5.9" text-anchor="middle" font-size=".75" fill="#cbd5e1" class="mk-text">10 ft crossbar · 18 ft 6 in wide</text>';
      return g;
    },
  };
  function marks(st, instant) {
    const keep = new Set();
    st.marks.forEach((m) => {
      keep.add(m.id);
      const sig = JSON.stringify(m);
      const ex = FD._mk.get(m.id);
      if (ex && ex.sig === sig) return;
      if (ex) ex.el.remove();
      const el = (FD.MARK[m.type] || FD.MARK.text)(m);
      el.classList.add('mk');
      (m.under ? layers.marksU : layers.marks).appendChild(el);
      FD._mk.set(m.id, { el, sig });
      if (instant) return;
      if (m.type === 'flag') {           // thrown in from above with a spin
        const fx = m.x - 6, fy = m.y - 10;
        TL.add((m.delay || 0) * FD.SPEED, 650, (k) => el.setAttribute('transform', `translate(${FD.lerp(fx, m.x, k)} ${FD.lerp(fy, m.y, k) - Math.sin(k * Math.PI) * 4}) rotate(${(1 - k) * 540})`), E.out);
        return;
      }
      el.style.opacity = 0;
      TL.add((m.delay || 0) * FD.SPEED, 350, (k) => (el.style.opacity = k), E.lin);
    });
    for (const [id, o] of FD._mk) if (!keep.has(id)) { FD._mk.delete(id); fadeOut(o.el, instant); }
  }

  // ---------- photo backdrop ----------
  let photoKey = null;
  function photo(st, instant) {
    const p = st.photo;
    const key = p ? p.key + '|' + (p.dim ?? '') + '|' + (p.over ? 1 : 0) : null;
    if (key === photoKey) return;
    photoKey = key;
    const old = FD.$$('.ph', photoEl);
    old.forEach((e) => { e.classList.remove('on'); setTimeout(() => e.remove(), instant ? 0 : 900); });
    photoEl.classList.toggle('over', !!(p && p.over));
    if (!p) return;
    const d = FD.h('div', { class: 'ph' + (p.kb === false ? '' : ' kb') });
    d.style.backgroundImage = `url(${FD.asset(p.key)})`;
    d.style.setProperty('--dim', p.dim ?? 0.35);
    if (p.pos) d.style.backgroundPosition = p.pos;
    photoEl.appendChild(d);
    if (instant) d.classList.add('on'); else { void d.offsetWidth; setTimeout(() => d.classList.add('on'), 20); }
  }

  // ---------- full render ----------
  FD.render = function (st, opt = {}) {
    const instant = !!opt.instant || FD.isReduced;
    TL.finishAll();
    const prev = FD.cur || FD.clone(FD.DEFAULTS);
    const stage = FD.$('#stage');
    const phoneDiagram = !!FD.isPhoneFieldDiagram(st);
    stage.classList.toggle('frame-active', (st.ov || []).some((o) => o.type === 'frame'));
    stage.classList.toggle('bp', st.skin === 'bp');
    stage.classList.toggle('deep', !!st.deep);
    stage.classList.toggle('diagram-phone', phoneDiagram);
    stage.classList.toggle('diagram-animating', phoneDiagram && !instant);
    camera(phoneCamera(st.cam, st), instant);
    lines(st, instant);
    zones(st, instant);
    routes(prev, st, instant);
    players(prev, st, instant);
    marks(st, instant);
    const fieldMotionEnd = TL.items.reduce((end, item) => Math.max(end, item.t0 + item.dur), TL.now);
    photo(st, instant);
    FD.renderHUD(prev, st, instant);
    FD.renderOverlays(prev, st, instant);
    FD.mountWidget(prev, st);
    if (phoneDiagram && !instant) {
      const wait = Math.max(0, fieldMotionEnd - TL.now);
      if (wait) TL.add(wait, 1, () => { if (FD.cur === st) stage.classList.remove('diagram-animating'); }, E.lin);
      else stage.classList.remove('diagram-animating');
    } else {
      stage.classList.remove('diagram-animating');
    }
    if (opt.forward && !instant && st.sfx) (Array.isArray(st.sfx) ? st.sfx : [st.sfx]).forEach((s) => {
      const o = typeof s === 'string' ? { n: s, at: 0 } : s;
      setTimeout(() => { if (FD.cur === st) FD.sfx(o.n); }, (o.at || 0) * FD.SPEED);
    });
    FD.cur = st;
  };

  FD.signature = function () {
    const r = (v) => Math.round(v * 10) / 10;
    const c = FD.cur || {};
    return JSON.stringify({
      cam: c.cam, los: c.los, fd: c.fd,
      pl: [...FD._pl].map(([id, o]) => [id, r(o.x), r(o.y)]).sort(),
      rt: [...FD._rt.keys()].sort(), mk: [...FD._mk.keys()].sort(), zn: [...FD._zn.keys()].sort(),
      ov: [...FD._ov.keys()].sort(), bug: FD.$('#bug') ? FD.$('#bug').textContent.replace(/\s+/g, ' ').trim() : '',
      l3: c.l3 ? [c.l3.k, c.l3.t, c.l3.s].join('|') : '', w: c.w || null, photo: c.photo ? c.photo.key : null,
    });
  };
})(window.FD);
