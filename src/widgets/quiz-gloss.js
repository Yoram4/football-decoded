/* Widgets: quiz (ch18) and glossary (G overlay + ch19) */
(function (FD) {
  'use strict';
  const T = FD.T;

  FD.W.quiz = {
    mount(host, st, w) {
      host.classList.add('w-quiz');
      let pick = null, shown = false;
      const L = ['A', 'B', 'C', 'D'].map((x) => T(x));
      const paint = () => {
        host.innerHTML = `<div class="qz-k">${T('Live quiz · question {n} of {of}', { n: w.n, of: w.of || 5 })}</div><div class="qz-q">${FD.md(w.q)}</div>
          <div class="qz-opts">${w.opts.map((o, i) => `<button class="qz-o ${pick === i ? 'pick' : ''} ${shown && i === w.ans ? 'right' : ''} ${shown && pick === i && i !== w.ans ? 'wrong' : ''}" data-i="${i}"><kbd>${i + 1}</kbd><b>${L[i]}</b><span>${FD.md(o)}</span></button>`).join('')}</div>
          ${shown ? `<div class="qz-why"><b>${L[w.ans]} — </b>${FD.md(w.why)}</div>` : `<div class="qz-hint">${T('Tap an answer or press 1–4 · → or Enter to reveal')}</div>`}`;
        host.querySelectorAll('.qz-o').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); if (!shown) { pick = +b.dataset.i; paint(); } }));
      };
      const reveal = () => {
        shown = true; paint();
        if (pick === w.ans || pick == null) FD.sfx('roar');
        if (w.reveal) FD.render({ ...FD.STEPS[FD.idx], ...w.reveal }, { forward: true });
      };
      paint();
      return {
        key(e) {
          if (!shown && /^[1-4]$/.test(e.key)) { pick = +e.key - 1; paint(); return true; }
          if (!shown && ['Enter', 'ArrowRight', ' ', 'PageDown'].includes(e.key)) { reveal(); return true; }
          return false;
        },
        unmount() {},
      };
    },
  };

  // ---------- glossary ----------
  function glossHTML(q) {
    const s = (q || '').trim().toLowerCase();
    const items = (FD.GLOSSARY || []).filter(([t, d]) => !s || t.toLowerCase().includes(s) || d.toLowerCase().includes(s));
    return items.map(([t, d, id]) => {
      const i = id ? FD.findStep(id) : -1;
      const st = i >= 0 ? FD.STEPS[i] : null;
      return `<div class="gl-i"><b>${FD.esc(t)}</b><span>${FD.md(d)}</span>${st ? `<button data-go="${i}">${T('Ch')} ${String(st._c).padStart(2, '0')} · ${FD.esc(st._ch.title)} ${FD.LANG === 'he' ? '←' : '→'}</button>` : ''}</div>`;
    }).join('') || `<div class="gl-none">${T('No match')}</div>`;
  }
  function wire(root, onGo) {
    const inp = root.querySelector('input'), list = root.querySelector('.gl-list');
    const upd = () => { list.innerHTML = glossHTML(inp.value); list.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); onGo(+b.dataset.go); })); };
    inp.addEventListener('input', upd);
    inp.addEventListener('pointerup', (e) => e.stopPropagation());
    upd();
    return inp;
  }
  const shell = (title) => `<div class="gl-head"><img src="${FD.asset('nfl')}" alt=""><div><b>${T(title)}</b><span>${T('{n} terms · type to search · click a chapter to jump there', { n: (FD.GLOSSARY || []).length })}</span></div></div><input type="search" placeholder="${T('Search: e.g. blitz, touchback, red zone…')}" aria-label="${T('Search glossary')}"><div class="gl-list"></div>`;
  FD.openGlossary = () => {
    const g = FD.$('#gloss');
    if (g.classList.contains('on')) { FD.closeGlossary(); return; }
    g.innerHTML = `<div class="gl-box">${shell('Glossary')}<button class="gl-x" title="Esc">✕</button></div>`;
    g.classList.add('on');
    g.querySelector('.gl-x').onclick = FD.closeGlossary;
    g.onclick = (e) => { if (e.target === g) FD.closeGlossary(); };
    const inp = wire(g, (i) => { FD.closeGlossary(); FD.goto(i); });
    setTimeout(() => inp.focus(), 50);
  };
  FD.closeGlossary = () => { const g = FD.$('#gloss'); g.classList.remove('on'); g.innerHTML = ''; };

  FD.W.gloss = {
    mount(host) {
      host.classList.add('w-gloss');
      host.innerHTML = `<div class="gl-box inline">${shell('Glossary')}</div>`;
      host.addEventListener('pointerup', (e) => e.stopPropagation());
      wire(host, (i) => FD.goto(i));
      return { unmount() {} };
    },
  };
})(window.FD);
