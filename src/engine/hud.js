/* HUD (score bug, lower-third, tags, badge, counter) + HTML overlays + widget mounting */
(function (FD) {
  'use strict';
  const ORD = ['', '1ST', '2ND', '3RD', '4TH'];
  let pcTimer = null, clkTimer = null;

  function bugHTML(b) {
    const team = (t, sc, to, poss) => {
      const logo = t === 'NE' ? FD.asset('ne') : FD.asset('nyj');
      const pips = [0, 1, 2].map((i) => `<i class="${i < to ? '' : 'u'}"></i>`).join('');
      return `<div class="team ${t.toLowerCase()} ${poss ? 'has' : ''}"><img class="em" src="${logo}" alt="${t}"><span class="ab">${t}</span><span class="to">${pips}</span><span class="sc" data-sc="${t}">${sc}</span><span class="poss"></span></div>`;
    };
    let dd = '';
    if (b.flag) dd = '<span class="flagtxt">FLAG</span>';
    else if (b.msg) dd = FD.esc(b.msg);
    else if (b.down) dd = `${ORD[b.down]} &amp; ${b.dist === 0 || b.dist === 'GOAL' ? 'GOAL' : b.dist}`;
    return `${team('NE', b.hs, b.toH, b.poss === 'NE')}${team('NYJ', b.as, b.toA, b.poss === 'NYJ')}
      <div class="meta"><span class="q">${b.q}</span><span class="clk">${b.clk}</span>${b.pc != null ? `<span class="pc ${b.pc <= 5 ? 'low' : ''}">:${String(b.pc).padStart(2, '0')}</span>` : ''}</div>
      ${dd ? `<div class="dd ${b.flag ? 'flag' : ''} ${b.msg ? 'msg' : ''}">${dd}</div>` : ''}
      <img class="shield" src="${FD.asset('nfl')}" alt="NFL">`;
  }

  function renderExplanations(st) {
    let toggle = FD.$('#explainToggle'), panel = FD.$('#explainPanel');
    if (!toggle) {
      toggle = FD.h('button', { id: 'explainToggle', type: 'button', 'aria-controls': 'explainPanel', 'aria-expanded': 'false', 'aria-label': FD.T('Good to know: more about this slide'), title: FD.T('Good to know: more about this slide'), 'aria-keyshortcuts': 'I' }, '?');
      panel = FD.h('aside', { id: 'explainPanel', class: 'explain-panel', role: 'region', 'aria-labelledby': 'explainTitle', hidden: 'hidden' });
      FD.$('#hud').append(toggle, panel);
      toggle.addEventListener('click', (e) => { e.stopPropagation(); FD.toggleExplanations(); });
      panel.addEventListener('pointerdown', (e) => e.stopPropagation());
      panel.addEventListener('pointerup', (e) => e.stopPropagation());
      panel.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target.closest('[data-explain-close]')) { FD.closeExplanations(); toggle.focus(); }
      });
      FD.closeExplanations = () => { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
      FD.toggleExplanations = () => {
        panel.hidden = !panel.hidden;
        toggle.setAttribute('aria-expanded', String(!panel.hidden));
        if (!panel.hidden) panel.querySelector('.explain-close').focus();
      };
    }

    const notes = st.notes || {};
    const points = notes.p || [];
    const available = points.length || notes.a || notes.x;
    const open = !panel.hidden;
    toggle.hidden = !available;
    toggle.setAttribute('aria-expanded', String(!!available && open));
    panel.innerHTML = `<div class="explain-head"><h2 id="explainTitle">${FD.T('Good to know')}</h2><button class="explain-close" type="button" data-explain-close aria-label="${FD.T('Close')}" title="${FD.T('Close')}">×</button></div>
      ${points.length ? `<ol>${points.map((p) => `<li>${FD.md(p)}</li>`).join('')}</ol>` : ''}
      ${notes.a ? `<section class="explain-section"><h3>${FD.T('Analogy')}</h3><p>${FD.md(notes.a)}</p></section>` : ''}
      ${notes.x ? `<section class="explain-section"><h3>${FD.T('Going deeper')}</h3><p>${FD.md(notes.x)}</p></section>` : ''}`;
    panel.hidden = !available || !open;
    if (!available) toggle.setAttribute('aria-expanded', 'false');
  }

  FD.renderHUD = function (prev, st, instant) {
    const bug = FD.$('#bug');
    const b = st.bug, pb = prev.bug || {};
    bug.classList.toggle('hide', !!b.hide);
    bug.innerHTML = bugHTML(b);
    if (!instant) {
      if (pb.hs != null && pb.hs !== b.hs) flash(bug.querySelector('[data-sc="NE"]'));
      if (pb.as != null && pb.as !== b.as) flash(bug.querySelector('[data-sc="NYJ"]'));
    }
    clearInterval(pcTimer); clearInterval(clkTimer);
    if (b.pcRun && b.pc != null && !instant) {
      let v = b.pc;
      pcTimer = setInterval(() => {
        if (FD.TL.paused) return;
        v = v <= 0 ? b.pc : v - 1;
        const el = bug.querySelector('.pc');
        if (el) { el.textContent = ':' + String(v).padStart(2, '0'); el.classList.toggle('low', v <= 5); }
      }, 1000);
    }
    if (b.clkRun && !instant) {
      let [m, s] = b.clk.split(':').map(Number), t = m * 60 + s;
      clkTimer = setInterval(() => {
        if (FD.TL.paused || t <= 0) return;
        t--;
        const el = bug.querySelector('.clk');
        if (el) el.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
      }, 1000);
    }

    // lower third
    const l3 = FD.$('#l3');
    const sig = JSON.stringify(st.l3 || null);
    if (l3.dataset.sig !== sig) {
      l3.dataset.sig = sig;
      const L = st.l3;
      const fill = () => {
        if (!L) { l3.className = 'l3 off'; l3.innerHTML = ''; return; }
        l3.innerHTML = `${L.k ? `<div class="k">${L.k}</div>` : ''}<div class="t">${L.t || ''}</div>${L.s ? `<div class="s">${L.s}</div>` : ''}`;
        l3.className = 'l3' + (L.team === 'NYJ' ? ' nyj' : '') + (instant ? ' on' : '');
        if (!instant) { void l3.offsetWidth; setTimeout(() => l3.classList.add('on'), 20); }
      };
      if (!instant && l3.classList.contains('on')) { l3.classList.remove('on'); setTimeout(() => { if (l3.dataset.sig === sig) fill(); }, 220); }
      else fill();
    }

    // tags
    const tags = FD.$('#tags');
    tags.innerHTML = (st.tags || []).map((t) => {
      const cls = /^(NEW RULE|חוק חדש)/i.test(t) ? 'new' : /^(COLLEGE|מכללות)/i.test(t) ? 'col' : /^(VERIFY|לאימות)/i.test(t) ? 'ver' : 'gen';
      return `<span class="tag ${cls}">${FD.esc(t)}</span>`;
    }).join('');

    FD.$('#badge').classList.toggle('on', !!st.deep);
    const ch = st._ch, n = ch.steps.length;
    FD.$('#counter').innerHTML = `<b>${String(st._c).padStart(2, '0')}</b> ${FD.esc(ch.title)} <span>${st._s + 1}/${n}</span>`;
    renderExplanations(st);
  };
  function flash(el) { if (!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }

  // ---------- overlays ----------
  FD.renderOverlays = function (prev, st, instant) {
    const layer = FD.$('#ov');
    const keep = new Set();
    (st.ov || []).forEach((o) => {
      keep.add(o.id);
      const sig = JSON.stringify(o);
      const ex = FD._ov.get(o.id);
      if (ex && ex.sig === sig) return;
      const fn = FD.OV[o.type];
      if (!fn) { console.warn('no overlay type', o.type); return; }
      if (ex && ex.el.dataset.type === o.type) {
        const el = ex.el;
        el.className = `ov ov-${o.type} pos-${o.pos || 'c'} ${o.cls || ''} in`;
        el.style.cssText = '';
        if (o.w) el.style.width = o.w;
        if (o.style) el.setAttribute('style', (el.getAttribute('style') || '') + ';' + o.style);
        const update = FD.OV[o.type + '_update'];
        if (update) update(el, o, instant);
        else {
          if (FD.OV[o.type + '_remove']) FD.OV[o.type + '_remove'](el);
          el.innerHTML = fn(o);
          if (FD.OV[o.type + '_after']) FD.OV[o.type + '_after'](el, o, instant);
        }
        ex.sig = sig;
        return;
      }
      if (ex) {
        if (FD.OV[ex.el.dataset.type + '_remove']) FD.OV[ex.el.dataset.type + '_remove'](ex.el);
        ex.el.remove();
      }
      const el = FD.h('div', { class: `ov ov-${o.type} pos-${o.pos || 'c'} ${o.cls || ''}`, 'data-type': o.type, 'data-id': o.id });
      if (o.w) el.style.width = o.w;
      if (o.style) el.setAttribute('style', (el.getAttribute('style') || '') + ';' + o.style);
      el.innerHTML = fn(o);
      layer.appendChild(el);
      FD._ov.set(o.id, { el, sig });
      if (FD.OV[o.type + '_after']) FD.OV[o.type + '_after'](el, o, instant);
      if (instant) el.classList.add('in');
      else { void el.offsetWidth; setTimeout(() => el.classList.add('in'), 20); }
    });
    for (const [id, o] of FD._ov) if (!keep.has(id)) {
      FD._ov.delete(id);
      if (FD.OV[o.el.dataset.type + '_remove']) FD.OV[o.el.dataset.type + '_remove'](o.el);
      if (instant) o.el.remove();
      else { o.el.classList.remove('in'); o.el.classList.add('out'); setTimeout(() => o.el.remove(), 380); }
    }
  };

  // ---------- widgets ----------
  FD.mountWidget = function (prev, st) {
    const name = st.w ? (typeof st.w === 'string' ? st.w : st.w.name) : null;
    if (FD._wid && FD._wid.step === st.id && FD._wid.name === name) return;
    if (FD._wid) { try { FD._wid.api && FD._wid.api.unmount(); } catch (e) { console.error(e); } FD.$('#wl').innerHTML = ''; FD._wid = null; FD.$('#stage').classList.remove('cards-on'); }
    if (!name || !FD.W[name]) return;
    const host = FD.h('div', { class: 'widget w-' + name });
    FD.$('#wl').appendChild(host);
    FD._wid = { step: st.id, name, api: null };   // set first: widgets may call FD.render during mount
    FD._wid.api = FD.W[name].mount(host, st, typeof st.w === 'object' ? st.w : {}) || { unmount() {} };
  };
})(window.FD);
