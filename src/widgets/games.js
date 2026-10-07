/* Widgets: c17 (ways to reach 17, ch03) and heat (4th-down decision heatmap, ch15) */
(function (FD) {
  'use strict';
  const T = FD.T;

  FD.W.c17 = {
    mount(host) {
      host.classList.add('w-c17');
      const PLAYS = [['td7', 'Touchdown + kick', 7, '1'], ['td6', 'Touchdown, try fails', 6, '2'], ['td8', 'Touchdown + 2-pt', 8, '3'], ['fg', 'Field goal', 3, '4'], ['sf', 'Safety', 2, '5']];
      let seq = [];
      const total = () => seq.reduce((a, k) => a + PLAYS.find((p) => p[0] === k)[2], 0);
      const paint = () => {
        const t = total();
        host.innerHTML = `<div class="c17-head"><span>${T('Mini-challenge')}</span><b>${T('Ways to reach 17')}</b></div>
          <div class="c17-total ${t === 17 ? 'hit' : t > 17 ? 'over' : ''}"><b>${t}</b><small>${t === 17 ? T('SEVENTEEN!') : t > 17 ? T('too many: undo (9)') : T('{n} to go', { n: 17 - t })}</small></div>
          <div class="c17-seq">${seq.map((k) => `<span>+${PLAYS.find((p) => p[0] === k)[2]}</span>`).join('') || `<em>${T('Pick scoring plays…')}</em>`}</div>
          <div class="c17-btns">${PLAYS.map((p) => `<button class="wbtn" data-k="${p[0]}"><kbd>${p[3]}</kbd>${T(p[1])} <b>+${p[2]}</b></button>`).join('')}
          <button class="wbtn" data-k="undo"><kbd>9</kbd>${T('Undo')}</button><button class="wbtn" data-k="reset"><kbd>0</kbd>${T('Reset')}</button></div>
          <div class="c17-ex">${T('Classic answers:')} <b>7+7+3</b> · <b>7+3+3+2+2</b> · <b>8+6+3</b> · <b>3+3+3+3+3+2</b></div>`;
        host.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); act(b.dataset.k); }));
      };
      const act = (k) => {
        if (k === 'undo') seq.pop(); else if (k === 'reset') seq = []; else seq.push(k);
        if (total() === 17) FD.sfx('roar');
        paint();
      };
      paint();
      return { key(e) { const m = { 1: 'td7', 2: 'td6', 3: 'td8', 4: 'fg', 5: 'sf', 9: 'undo', 0: 'reset' }; if (m[e.key]) { act(m[e.key]); return true; } return false; }, unmount() {} };
    },
  };

  // Illustrative 4th-down guide (league-average teams, neutral score/time). Columns = distance from own goal line.
  const COLS = [['Own 1–9', 5], ['Own 10–19', 15], ['Own 20–29', 25], ['Own 30–39', 35], ['Own 40–49', 45], ['Opp 50–41', 55], ['Opp 40–31', 65], ['Opp 30–21', 75], ['Opp 20–11', 85], ['Opp 10–1', 95]];
  FD.fourthDown = (toGo, fp) => {
    const opp = 100 - fp;
    if (opp <= 38) {                       // in field-goal range (≈ 55-yard kick or shorter)
      if (toGo <= 2) return 'GO';
      if (toGo <= 4 && opp >= 28) return 'GO';
      if (opp <= 3 && toGo <= 3) return 'GO';
      return 'FG';
    }
    if (fp >= 50) return toGo <= 4 ? 'GO' : 'PUNT';
    if (fp >= 40) return toGo <= 3 ? 'GO' : 'PUNT';
    if (fp >= 28) return toGo <= 1 ? 'GO' : 'PUNT';
    return 'PUNT';
  };
  FD.W.heat = {
    mount(host, st, opt) {
      host.classList.add('w-heat');
      const mark = opt.mark || { toGo: 2, fp: 62 };
      let sel = null;
      const why = { GO: 'Short distance + good field position: the expected points from keeping the ball beat the alternatives.', FG: 'In range for a kick and too far to convert reliably: take the 3 points.', PUNT: 'Too far, too deep in your own territory: flip the field and make them drive.' };
      const paint = () => {
        host.innerHTML = `<div class="ht-head"><div><span>${T('4th-down decision guide')}</span><b>${T('Go for it, kick, or punt?')}</b></div><div class="ht-leg"><i class="GO"></i>${T('Go for it')} <i class="FG"></i>${T('Field goal')} <i class="PUNT"></i>${T('Punt')}</div></div>
          <div class="ht-grid"><div class="ht-corner">${T('Yards to go ↓ · Field position →')}</div>${COLS.map((c) => `<div class="ht-col">${T(c[0])}</div>`).join('')}
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tg) => `<div class="ht-row">${tg === 10 ? '10+' : tg}</div>${COLS.map((c) => { const r = FD.fourthDown(tg, c[1]); const m = mark && tg === mark.toGo && Math.abs(c[1] - mark.fp) <= 5; return `<button class="ht-c ${r} ${m ? 'mark' : ''} ${sel && sel[0] === tg && sel[1] === c[1] ? 'sel' : ''}" data-t="${tg}" data-f="${c[1]}">${r === 'PUNT' ? 'P' : r}</button>`; }).join('')}`).join('')}</div>
          <div class="ht-foot">${sel ? `<b>${T('4th & {n}, {c}: {r}', { n: sel[0] === 10 ? '10+' : sel[0], c: T(COLS.find((c) => c[1] === sel[1])[0]), r: T(FD.fourthDown(sel[0], sel[1])) })}</b> · ${T(why[FD.fourthDown(sel[0], sel[1])])}` : T('Click any square. ★ = our situation: 4th & 2 at the NYJ 38.')}<br><small>${T('Illustrative guide in the spirit of modern analytics models (average teams, tied game, mid-game). Score, clock, weather and your kicker change the answer.')}</small></div>`;
        host.querySelectorAll('.ht-c').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); sel = [+b.dataset.t, +b.dataset.f]; paint(); }));
      };
      paint();
      return { unmount() {} };
    },
  };
})(window.FD);
