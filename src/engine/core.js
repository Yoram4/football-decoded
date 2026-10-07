/* Football, Decoded — core: namespace, utils, timeline, audio, chapter registry */
window.FD = window.FD || {};
(function (FD) {
  'use strict';
  FD.CH = FD.CH || [];          // chapters pushed by src/chapters/*.js
  FD.OV = FD.OV || {};          // HTML overlay renderers
  FD.W = FD.W || {};            // interactive widgets
  FD.isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const Q = new URLSearchParams(location.search);
  FD.mode = Q.get('mode') || 'live';   // live | presenter | preview | explore
  FD.SPEED = +(Q.get('speed') || 1.7);  // play-animation slow-down factor (1 = original pace)
  FD.LANG = document.documentElement.lang || 'en';
  FD.I18N = FD.I18N || {};
  // UI string lookup: English text is the key; {name} placeholders are filled from vars
  FD.T = (s, vars) => {
    let out = FD.I18N[s] ?? s;
    if (vars) for (const k in vars) out = out.split(`{${k}}`).join(vars[k]);
    return out;
  };

  // ---------- small utils ----------
  FD.$ = (s, r = document) => r.querySelector(s);
  FD.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  FD.h = (tag, attrs = {}, html = '') => {
    const e = document.createElement(tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html) e.innerHTML = html;
    return e;
  };
  FD.svg = (tag, attrs = {}) => {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  FD.clone = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));
  FD.lerp = (a, b, k) => a + (b - a) * k;
  FD.esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  FD.asset = (k) => (FD.ASSETS && FD.ASSETS[k]) || '';
  FD.ease = {
    lin: (k) => k,
    out: (k) => 1 - Math.pow(1 - k, 3),
    inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  };

  // Field position helpers. NE end zone is x 0–10, NYJ end zone x 110–120.
  // own(team, n): x of "team's own n-yard line". opp(team, n): x of opponent's n.
  FD.own = (team, n) => (team === 'NE' ? 10 + n : 110 - n);
  FD.opp = (team, n) => (team === 'NE' ? 110 - n : 10 + n);
  FD.spot = (x) => {                     // x -> "NE 35" / "NYJ 20" / "50"
    const yl = Math.round(x - 10);
    if (yl === 50) return '50';
    return yl < 50 ? `NE ${yl}` : `NYJ ${100 - yl}`;
  };
  FD.MID = 26.665;

  // ---------- timeline (pausable, finishable) ----------
  const TL = (FD.TL = { items: [], paused: false, now: 0, last: performance.now() });
  TL.add = (delay, dur, fn, ease = FD.ease.inOut) => {
    if (FD.isReduced || FD.mode === 'preview') { fn(1); return; }
    const it = { t0: TL.now + delay, dur: Math.max(1, dur), fn, ease, done: false };
    TL.items.push(it);
    if (delay <= 0) fn(0);
    return it;
  };
  TL.finishAll = () => {
    for (const it of TL.items) if (!it.done) { it.done = true; it.fn(1); }
    TL.items = [];
  };
  TL.tick = (ts) => {
    const dt = ts - TL.last; TL.last = ts;
    if (!TL.paused) TL.now += dt;
    for (const it of TL.items) {
      if (it.done || TL.now < it.t0) continue;
      const k = Math.min(1, (TL.now - it.t0) / it.dur);
      it.fn(it.ease(k));
      if (k >= 1) it.done = true;
    }
    TL.items = TL.items.filter((i) => !i.done);
    requestAnimationFrame(TL.tick);
  };
  requestAnimationFrame(TL.tick);

  // Storage can throw for file:// pages and private modes on some mobile browsers.
  FD.store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* preference not persisted */ } },
  };

  // ---------- audio (Web-Audio-free: HTMLAudio pool, unlocked on first gesture) ----------
  const SFX = { whistle: 'sfx_whistle', roar: 'sfx_roar', cheer: 'sfx_cheer' };
  FD.audio = { on: FD.store.get('fd-audio') !== 'off', unlocked: false, vol: 0.5, playing: [] };
  FD.sfx = (name) => {
    if (!FD.audio.on || !FD.audio.unlocked || FD.mode !== 'live') return;
    const src = SFX[name] && FD.asset(SFX[name]);
    if (!src) return;
    const a = new Audio(src);
    a.volume = FD.audio.vol;
    a.play().catch(() => {});
    FD.audio.playing.push(a);
    a.onended = () => (FD.audio.playing = FD.audio.playing.filter((x) => x !== a));
  };
  FD.stopSfx = () => { FD.audio.playing.forEach((a) => a.pause()); FD.audio.playing = []; };
  const unlock = () => { FD.audio.unlocked = true; };
  addEventListener('keydown', unlock, { once: true });
  addEventListener('pointerdown', unlock, { once: true });

  // ---------- toast ----------
  FD.toast = (msg) => {
    let t = FD.$('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(FD._toastT);
    FD._toastT = setTimeout(() => t.classList.remove('on'), 1600);
  };
})(window.FD);
