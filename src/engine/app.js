/* App: navigation, router, keys, menu, telestrator, presenter view, preview & explore modes */
(function (FD) {
  'use strict';
  const BC = 'BroadcastChannel' in window ? new BroadcastChannel('fd-sync') : null;
  FD.skipDeep = FD.store.get('fd-deep') === 'off';
  FD.idx = 0;

  const vis = (i) => FD.STEPS[i] && !(FD.skipDeep && FD.STEPS[i].deep);
  FD.goto = function (i, opt = {}) {
    if (i < 0 || i >= FD.STEPS.length) return;
    const forward = opt.forward ?? i > FD.idx;
    FD.idx = i;
    closeTransient();
    clearTimeout(FD._auto);
    FD.render(FD.STEPS[i], { instant: opt.instant || !forward, forward });
    FD.updateTouchProgress && FD.updateTouchProgress(i);
    const st = FD.STEPS[i];
    if (st.auto && forward && !opt.instant && FD.mode === 'live') FD._auto = setTimeout(function tick() { if (FD.TL.paused) { FD._auto = setTimeout(tick, 300); return; } if (FD.STEPS[FD.idx] === st) FD.next(); }, st.auto * FD.SPEED);
    if (FD.mode === 'live') history.replaceState(null, '', `#c=${st._c}&s=${st._s}`);
    FD.tele && FD.tele.load(st.id);
    post();
  };
  FD.next = () => { for (let i = FD.idx + 1; i < FD.STEPS.length; i++) if (vis(i)) return FD.goto(i, { forward: true }); };
  FD.prev = () => { for (let i = FD.idx - 1; i >= 0; i--) if (vis(i)) return FD.goto(i, { forward: false }); };
  FD.goChapter = (c) => {
    const i = FD.STEPS.findIndex((s, k) => s._c === c && vis(k));
    if (i >= 0) FD.goto(i, { forward: i > FD.idx });
  };
  FD.chapterStep = (dir) => {
    const c = FD.STEPS[FD.idx]._c + dir;
    if (c >= 0 && c < FD.CH.length) FD.goChapter(c);
  };
  FD.findStep = (id) => FD.STEPS.findIndex((s) => s.id === id);
  FD.replay = () => {
    let p = FD.idx - 1;
    while (p >= 0 && !vis(p)) p--;
    if (p >= 0) FD.render(FD.STEPS[p], { instant: true });
    else { FD.cur = null; }
    FD.render(FD.STEPS[FD.idx], { forward: true });
  };
  FD.toggleDeep = () => {
    FD.skipDeep = !FD.skipDeep;
    FD.store.set('fd-deep', FD.skipDeep ? 'off' : 'on');
    FD.toast(FD.skipDeep ? FD.T('Film Room steps: SKIPPED') : FD.T('Film Room steps: ON'));
    if (FD.skipDeep && FD.STEPS[FD.idx].deep) FD.next();
  };
  function fromHash() {
    const m = /c=(\d+)&s=(\d+)/.exec(location.hash);
    if (!m) return 0;
    const i = FD.STEPS.findIndex((s) => s._c === +m[1] && s._s === +m[2]);
    return i < 0 ? 0 : i;
  }

  // ---------- presenter sync ----------
  function post() {
    if (!BC || FD.mode !== 'live') return;
    BC.postMessage({ type: 'state', i: FD.idx, skipDeep: FD.skipDeep, lang: FD.BILINGUAL ? FD.LANG : undefined });
  }
  if (BC) BC.onmessage = (ev) => {
    const m = ev.data;
    if (FD.mode === 'live' && m.type === 'cmd') runCmd(m.cmd);
    if (FD.mode === 'live' && m.type === 'hello') post();
    if (FD.mode === 'presenter' && m.type === 'state') {
      if (FD.BILINGUAL && m.lang && m.lang !== FD.LANG) { FD.applyLanguage(m.lang); FD.resolve(); }
      FD.presenterShow(m.i, m.skipDeep);
    }
  };
  function runCmd(c) {
    ({ next: FD.next, prev: FD.prev, chUp: () => FD.chapterStep(-1), chDown: () => FD.chapterStep(1), deep: FD.toggleDeep, replay: FD.replay, pause: togglePause })[c]?.();
  }

  // ---------- overlays: menu ----------
  function closeTransient() { FD.$('#menu').classList.remove('on'); }
  function openMenu() {
    const m = FD.$('#menu');
    if (m.classList.contains('on')) { m.classList.remove('on'); return; }
    const cur = FD.STEPS[FD.idx]._c;
    m.innerHTML = `<div class="mn-head"><img src="${FD.asset('nfl')}" alt=""><b>${FD.T('Football Guide')}</b><span>${FD.T('Chapters · press a tile or Esc')}</span>
      <button class="mn-deep">${FD.skipDeep ? FD.T('Film Room: OFF (D)') : FD.T('Film Room: ON (D)')}</button></div>
      <div class="mn-grid">${FD.CH.map((c, i) => `<button class="${i === cur ? 'cur' : ''} ${c.deep ? 'deep' : ''}" data-go="${i}"><b>${String(i).padStart(2, '0')}</b><span>${FD.esc(c.title)}</span><small>${FD.esc(c.sub || '')}</small></button>`).join('')}</div>`;
    m.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); m.classList.remove('on'); if (+b.dataset.go !== cur) FD.goChapter(+b.dataset.go); }));
    m.querySelector('.mn-deep').addEventListener('click', (e) => { e.stopPropagation(); FD.toggleDeep(); m.classList.remove('on'); });
    m.classList.add('on');
  }

  FD.toggleMute = () => {
    FD.audio.on = !FD.audio.on;
    FD.store.set('fd-audio', FD.audio.on ? 'on' : 'off');
    if (!FD.audio.on) FD.stopSfx();
    FD.toast(FD.audio.on ? FD.T('Sound ON') : FD.T('Sound OFF'));
    FD.renderChrome();
  };
  const muteLabel = () => FD.T(FD.audio.on ? 'Mute sound' : 'Unmute sound');
  const muteIcon = () => (FD.audio.on ? '🔊' : '🔇');
  const btn = (action, label, html) => `<button type="button" data-action="${action}" aria-label="${FD.esc(label)}" title="${FD.esc(label)}">${html}</button>`;
  const ACTIONS = {
    prev: () => FD.prev(), next: () => FD.next(), menu: () => openMenu(),
    mute: () => FD.toggleMute(), lang: () => FD.switchLanguage(),
  };
  function bindActions(root) {
    root.querySelectorAll('[data-action]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); ACTIONS[b.dataset.action]?.(); }));
  }

  // Phone dock + desktop tools/key hints; rebuilt on language switch so labels stay translated.
  FD.renderChrome = function () {
    const hud = FD.$('#hud');
    ['#touchNav', '#deskTools', '#keyHints'].forEach((s) => FD.$(s)?.remove());
    const langBtn = FD.BILINGUAL ? btn('lang', FD.T('Switch language'), FD.LANG === 'he' ? 'EN' : 'HE') : '';

    const nav = FD.h('nav', { id: 'touchNav', class: 'touch-nav', dir: 'ltr', 'aria-label': FD.T('Touch navigation') });
    nav.innerHTML = `<div class="touch-progress" role="progressbar" aria-label="${FD.T('Progress')}" aria-valuemin="1" aria-valuemax="${FD.STEPS.length}"><i></i></div>
      <div class="touch-actions">${btn('prev', FD.T('Previous slide'), '<span aria-hidden="true">‹</span>')}${btn('menu', FD.T('Open menu'), '<span aria-hidden="true">☰</span>')}<span class="touch-count"></span>${btn('mute', muteLabel(), muteIcon())}${langBtn}${btn('next', FD.T('Next slide'), '<span aria-hidden="true">›</span>')}</div>`;
    bindActions(nav);

    const tools = FD.h('div', { id: 'deskTools', class: 'desk-tools', dir: 'ltr' });
    tools.innerHTML = `${btn('mute', muteLabel(), muteIcon())}${FD.BILINGUAL ? btn('lang', FD.T('Switch language'), FD.LANG === 'he' ? 'English' : 'עברית') : ''}`;
    bindActions(tools);

    const hints = FD.h('div', { id: 'keyHints', class: 'key-hints', dir: 'ltr', 'aria-hidden': 'true' });
    const k = (key, label) => `<span><kbd>${key}</kbd>${FD.esc(FD.T(label))}</span>`;
    hints.innerHTML = k('← →', 'navigate') + k('↑ ↓', 'chapter') + k('M', 'menu') + k('D', 'film room') + k('I', 'more info') + k('A', 'sound') + k('?', 'all keys');

    hud.append(nav, tools, hints);
    FD.updateTouchProgress(FD.idx);
  };
  FD.updateTouchProgress = (i) => {
    const st = FD.STEPS[i], bar = FD.$('#touchNav .touch-progress');
    if (!st || !bar) return;
    const stage = FD.$('#stage');
    const diagram = !!FD.isPhoneFieldDiagram?.(st);
    stage.classList.toggle('diagram-phone', diagram);
    bar.firstElementChild.style.width = `${((i + 1) / FD.STEPS.length) * 100}%`;
    bar.setAttribute('aria-valuenow', i + 1);
    bar.setAttribute('aria-valuetext', `${st._ch.title}, ${FD.T('step {a}/{b}', { a: st._s + 1, b: st._ch.steps.length })}`);
    FD.$('#touchNav .touch-count').textContent = `${String(st._c).padStart(2, '0')} · ${st._s + 1}/${st._ch.steps.length}`;
  };

  function togglePause() {
    FD.TL.paused = !FD.TL.paused;
    FD.$('#stage').classList.toggle('paused', FD.TL.paused);
    FD.toast(FD.TL.paused ? FD.T('Paused (P)') : FD.T('Playing'));
  }
  function fullscreen() { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }

  // ---------- telestrator ----------
  function initTele() {
    const cv = FD.$('#tele'), ctx = cv.getContext('2d');
    const store = {};
    let on = false, color = '#FACC15', cur = null, stepId = null;
    const size = () => { const r = cv.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio; redraw(); };
    const redraw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      (store[stepId] || []).forEach((s) => {
        ctx.strokeStyle = s.c; ctx.lineWidth = 6 * devicePixelRatio; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.shadowColor = s.c; ctx.shadowBlur = 8 * devicePixelRatio;
        ctx.beginPath(); s.p.forEach(([x, y], i) => (i ? ctx.lineTo(x * cv.width, y * cv.height) : ctx.moveTo(x * cv.width, y * cv.height))); ctx.stroke();
      });
    };
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    cv.addEventListener('pointerdown', (e) => { if (!on) return; e.stopPropagation(); cur = { c: color, p: [pt(e)] }; (store[stepId] = store[stepId] || []).push(cur); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', (e) => { if (!cur) return; cur.p.push(pt(e)); redraw(); });
    cv.addEventListener('pointerup', (e) => { e.stopPropagation(); cur = null; });
    cv.addEventListener('click', (e) => on && e.stopPropagation());
    addEventListener('resize', size);
    FD.tele = {
      toggle() { on = !on; cv.classList.toggle('on', on); FD.toast(on ? FD.T('Telestrator ON · 1 yellow · 2 red · C clear · T off') : FD.T('Telestrator OFF')); },
      get on() { return on; },
      color(c) { color = c; },
      clear() { store[stepId] = []; redraw(); },
      load(id) { stepId = id; redraw(); },
    };
    size();
  }

  // ---------- keys / pointer ----------
  function initInput() {
    addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input, textarea')) { if (e.key === 'Escape') { FD.closeGlossary && FD.closeGlossary(); } return; }
      if (FD._wid && FD._wid.api && FD._wid.api.key && FD._wid.api.key(e)) { e.preventDefault(); return; }
      const k = e.key;
      if ((k === 'Enter' || k === ' ') && e.target.closest && e.target.closest('button, a')) return;
      if (FD.tele.on && (k === '1' || k === '2')) { FD.tele.color(k === '1' ? '#FACC15' : '#ff3b3b'); return; }
      switch (k) {
        case 'ArrowRight': case ' ': case 'PageDown': case 'Enter': e.preventDefault(); FD.next(); break;
        case 'ArrowLeft': case 'Backspace': case 'PageUp': e.preventDefault(); FD.prev(); break;
        case 'ArrowUp': e.preventDefault(); FD.chapterStep(-1); break;
        case 'ArrowDown': e.preventDefault(); FD.chapterStep(1); break;
        case 'Home': FD.goto(0); break;
        case 'End': FD.goto(FD.STEPS.length - 1); break;
        case 'm': case 'M': openMenu(); break;
        case 'd': case 'D': FD.toggleDeep(); break;
        case 't': case 'T': FD.tele.toggle(); break;
        case 'c': case 'C': FD.tele.clear(); break;
        case 'p': case 'P': togglePause(); break;
        case 'i': case 'I': e.preventDefault(); FD.toggleExplanations && FD.toggleExplanations(); break;
        case 'r': case 'R': FD.replay(); break;
        case 'f': case 'F': fullscreen(); break;
        case 'n': case 'N': window.open(location.pathname + `?mode=presenter${FD.BILINGUAL ? `&lang=${FD.LANG}` : ''}` + location.hash, 'fd-presenter', 'width=1280,height=760'); break;
        case 'g': case 'G': e.preventDefault(); FD.openGlossary && FD.openGlossary(); break;
        case 'a': case 'A': FD.toggleMute(); break;
        case 'v': case 'V': { const v = FD.$('.ov-video'); if (v) FD.videoPlay(v, v.querySelector('.rp-player').dataset.yt, JSON.parse(FD._ov.get(v.dataset.id).sig)); break; }
        case 'Escape': FD.$('#menu').classList.remove('on'); FD.closeGlossary && FD.closeGlossary(); FD.closeCard && FD.closeCard(); FD.closeExplanations && FD.closeExplanations(); if (FD.tele.on) FD.tele.toggle(); break;
        case '?': FD.toast(FD.T('→ next · ← back · ↑↓ chapter · M menu · D film room · T draw · P pause · I more info · R replay · N presenter · G glossary · A sound · F full')); break;
        default: return;
      }
    });
    const stage = FD.$('#stage');
    let down = null;
    let suppressPlayerClick = false;
    stage.addEventListener('click', (e) => {
      if (!suppressPlayerClick) return;
      e.preventDefault(); e.stopImmediatePropagation(); suppressPlayerClick = false;
    }, true);
    stage.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: Date.now() }; });
    stage.addEventListener('pointerup', (e) => {
      if (!down) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      const d0 = down; down = null;
      const player = e.target.closest('.pl');
      if (e.target.closest('button, a, input, .widget, .ov-video, .ov-title .t-menu, #menu, #gloss, #explainPanel, #touchNav, .ov.interactive') || FD.tele.on) return;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (player && stage.classList.contains('cards-on')) { suppressPlayerClick = true; setTimeout(() => { suppressPlayerClick = false; }, 500); }
        e.preventDefault();
        dx < 0 ? FD.next() : FD.prev(); return;
      }
      if (player) return;
      if (Math.hypot(dx, dy) < 8 && Date.now() - d0.t < 600 && e.button === 0) FD.next();
    });
    stage.addEventListener('pointercancel', () => { down = null; });
  }

  // ---------- presenter page ----------
  function bootPresenter() {
    document.body.classList.add('presenter');
    document.body.innerHTML = `<div id="pv">
      <header><img src="${FD.asset('nfl')}" alt=""><b>${FD.T('Presenter view')}</b><span id="pvTimer">00:00</span><span id="pvClock"></span><button id="pvReset">${FD.T('reset timer')}</button></header>
      <main><section id="pvNow"></section><aside><div class="pv-lbl">${FD.T('NEXT')}</div><div id="pvNextT"></div><iframe id="pvPrev" title="next step preview"></iframe>
      <div class="pv-ctl"><button data-c="prev">${FD.T('◀ Back')}</button><button data-c="next">${FD.T('Next ▶')}</button><button data-c="chUp">${FD.T('▲ Chapter')}</button><button data-c="chDown">${FD.T('▼ Chapter')}</button><button data-c="deep">${FD.T('D Film Room')}</button><button data-c="replay">${FD.T('R Replay')}</button></div></aside></main></div>`;
    let t0 = Date.now();
    FD.$('#pvReset').onclick = () => (t0 = Date.now());
    setInterval(() => {
      const s = Math.floor((Date.now() - t0) / 1000);
      FD.$('#pvTimer').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
      FD.$('#pvClock').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 500);
    FD.$$('.pv-ctl button').forEach((b) => (b.onclick = () => BC && BC.postMessage({ type: 'cmd', cmd: b.dataset.c })));
    addEventListener('keydown', (e) => {
      const map = { ArrowRight: 'next', ' ': 'next', ArrowLeft: 'prev', ArrowUp: 'chUp', ArrowDown: 'chDown', d: 'deep', r: 'replay', p: 'pause' };
      if (map[e.key]) { e.preventDefault(); BC && BC.postMessage({ type: 'cmd', cmd: map[e.key] }); }
    });
    FD.presenterShow = (i, skipDeep) => {
      FD.idx = i;
      const st = FD.STEPS[i];
      let j = i + 1; while (j < FD.STEPS.length && skipDeep && FD.STEPS[j].deep) j++;
      const nx = FD.STEPS[j];
      const n = st.notes || {};
      FD.$('#pvNow').innerHTML = `<div class="pv-ch">${String(st._c).padStart(2, '0')} · ${FD.esc(st._ch.title)} <span>${FD.T('step {a}/{b}', { a: st._s + 1, b: st._ch.steps.length })}</span>${st.deep ? `<em>${FD.T('FILM ROOM')}</em>` : ''}</div>
        <h2>${FD.esc(st.title)}</h2>${st.l3 && st.l3.s ? `<div class="pv-cap">${FD.T('On screen:')} “${FD.md(st.l3.s)}”</div>` : ''}
        <ul>${(n.p || []).map((p) => `<li>${FD.md(p)}</li>`).join('')}</ul>
        ${n.x ? `<div class="pv-ex"><b>${FD.T('If an expert asks…')}</b> ${FD.md(n.x)}</div>` : ''}${st.w ? `<div class="pv-w">${FD.T('Interactive:')} <b>${typeof st.w === 'string' ? st.w : st.w.name}</b> ${FD.T('(keys shown on screen)')}</div>` : ''}`;
      FD.$('#pvNextT').innerHTML = nx ? `<b>${FD.esc(nx.title)}</b> <span>${FD.esc(nx._ch.title)}</span>` : `<b>${FD.T('End')}</b>`;
      if (nx) FD.$('#pvPrev').src = location.pathname + `?mode=preview${FD.BILINGUAL ? `&lang=${FD.LANG}` : ''}#c=${nx._c}&s=${nx._s}`;
    };
    BC && BC.postMessage({ type: 'hello' });
  }

  // ---------- explore (scrollytelling) ----------
  function bootExplore() {
    document.body.classList.add('explore');
    const col = FD.h('div', { id: 'xcol' });
    col.innerHTML = `<div class="x-intro"><img src="${FD.asset('nfl')}" alt=""><h1>${FD.T('Football Guide')}</h1><p>${FD.T('The rules, strategy, and stories behind every NFL game.')}</p></div>` +
      FD.STEPS.map((s, i) => `<article class="x-card ${s.deep ? 'deep' : ''}" data-i="${i}">${s._s === 0 ? `<div class="x-ch">${String(s._c).padStart(2, '0')} · ${FD.esc(s._ch.title)}</div>` : ''}
        <h3>${FD.esc(s.title)}</h3>${s.l3 && s.l3.s ? `<p class="x-cap">${FD.md(s.l3.s)}</p>` : ''}<ul>${(s.notes.p || []).slice(0, 4).map((p) => `<li>${FD.md(p)}</li>`).join('')}</ul></article>`).join('');
    document.body.appendChild(col);
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { const i = +en.target.dataset.i; if (i !== FD.idx) FD.goto(i, { forward: i > FD.idx }); FD.$$('.x-card.on').forEach((c) => c.classList.remove('on')); en.target.classList.add('on'); } });
    }, { rootMargin: '-45% 0px -45% 0px' });
    FD.$$('.x-card').forEach((c) => io.observe(c));
  }

  // ---------- boot ----------
  FD.boot = function () {
    FD.resolve();
    if (FD.mode === 'presenter') { bootPresenter(); return; }
    FD.mountRenderer();
    initTele();
    if (FD.mode === 'preview') {
      document.body.classList.add('preview');
      const show = () => FD.goto(fromHash(), { instant: true });
      addEventListener('hashchange', show);
      show();
      return;
    }
    if (FD.mode === 'explore') { bootExplore(); FD.goto(0, { instant: true }); return; }
    initInput();
    FD.renderChrome();
    FD.goto(fromHash(), { instant: true });
    if (!FD.store.get('fd-seen-help')) { setTimeout(() => FD.toast(FD.T('Press → to start · M menu · ? all keys')), 600); FD.store.set('fd-seen-help', '1'); }
  };
  addEventListener('DOMContentLoaded', () => FD.boot());
})(window.FD);
