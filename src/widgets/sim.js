/* Widget: interactive drive simulator (ch05). Renders synthetic states through FD.render, so leaving the step restores everything. */
(function (FD) {
  'use strict';
  const M = FD.MID, T = FD.T;
  const ORD = ['', '1st', '2nd', '3rd', '4th'];
  const dd = (d, g) => T('{o} & {g}', { o: T(ORD[d]), g });
  const fgPct = (d) => (d <= 33 ? 0.97 : d <= 39 ? 0.92 : d <= 44 ? 0.84 : d <= 49 ? 0.76 : d <= 54 ? 0.65 : d <= 59 ? 0.5 : d <= 64 ? 0.25 : 0.05);

  FD.W.sim = {
    mount(host, step) {
      let S, timer;
      const goalX = (dir) => (dir > 0 ? 110 : 10);
      const reset = () => { S = { poss: 'NE', dir: 1, x: 35, down: 1, fd: 45, hs: 0, as: 0, clk: 900, q: 1, log: [], msg: null, last: null }; };
      reset();
      const yardsToGoal = () => Math.abs(goalX(S.dir) - S.x);
      const spot = (x) => FD.spot(x);
      const clk = () => `${Math.floor(S.clk / 60)}:${String(S.clk % 60).padStart(2, '0')}`;
      const tick = (s) => { S.clk -= s; while (S.clk <= 0) { S.clk += 900; S.q = Math.min(4, S.q + 1); } };
      const newSeries = (team, x) => {
        S.poss = team; S.dir = team === 'NE' ? 1 : -1; S.x = x; S.down = 1;
        S.fd = S.x + S.dir * 10;
        if ((S.dir > 0 && S.fd >= 110) || (S.dir < 0 && S.fd <= 10)) S.fd = goalX(S.dir);
      };
      const other = () => (S.poss === 'NE' ? 'NYJ' : 'NE');
      const score = (team, pts) => { if (team === 'NE') S.hs += pts; else S.as += pts; };
      const after = (txt) => { S.log.unshift(txt); S.log = S.log.slice(0, 4); };

      function play(kind) {
        if (S.over) return;
        const from = S.x, team = S.poss;
        S.msg = null; S.last = { kind, from };
        let gain = { run: 4, pass: 15, sack: -7, inc: 0 }[kind];
        tick(kind === 'inc' ? 6 : 35);
        if (kind === 'punt') {
          let land = S.x + S.dir * 45, rec = other();
          const recDir = -S.dir;
          if ((recDir < 0 && land >= 110) || (recDir > 0 && land <= 10)) { land = recDir < 0 ? 90 : 30; after(T('{a} punt → touchback, {b} ball at the 20', { a: team, b: rec })); }
          else after(T('{a} punts 45 yards → {b} ball at the {s}', { a: team, b: rec, s: spot(land) }));
          S.last.to = S.x + S.dir * 45;
          newSeries(rec, land); S.msg = 'PUNT'; return render('punt');
        }
        if (kind === 'fg') {
          const dist = yardsToGoal() + 17, p = fgPct(dist), good = Math.random() < p;
          S.last.to = goalX(S.dir) + S.dir * 10;
          if (good) { score(team, 3); after(T('{d}-yd FG is GOOD ({p}% kick)', { d: dist, p: Math.round(p * 100) })); S.msg = 'FIELD GOAL'; newSeries(other(), FD.own(other(), 35)); }
          else {
            const kickSpot = S.x - S.dir * 7;
            const inside20 = yardsToGoal() <= 20;
            const x = inside20 ? goalX(S.dir) - S.dir * 20 : kickSpot;
            after(T('{d}-yd FG is NO GOOD → {b} ball at the {s}', { d: dist, b: other(), s: spot(x) })); S.msg = 'NO GOOD'; newSeries(other(), x);
          }
          return render(good ? 'fg' : 'miss');
        }
        const nx = S.x + S.dir * gain;
        S.last.to = nx;
        if ((S.dir > 0 && nx >= 110) || (S.dir < 0 && nx <= 10)) {
          score(team, 7); after(T('TOUCHDOWN {a}! (+6, extra point good +1)', { a: team })); S.msg = 'TOUCHDOWN';
          newSeries(other(), FD.own(other(), 35)); return render('td');
        }
        if ((S.dir > 0 && nx <= 10) || (S.dir < 0 && nx >= 110)) {
          score(other(), 2); after(T('SAFETY! {b} +2, {a} must free-kick', { a: team, b: other() })); S.msg = 'SAFETY';
          newSeries(other(), FD.own(other(), 35)); return render('safety');
        }
        if (kind !== 'inc') S.x = nx;
        const label = T({ run: 'Run +4', pass: 'Pass +15', sack: 'Sack −7', inc: 'Incomplete' }[kind]);
        if (kind !== 'inc' && kind !== 'sack' && S.dir * (S.x - S.fd) >= 0) {
          after(T('{l} → FIRST DOWN at the {s}', { l: label, s: spot(S.x) })); S.msg = 'FIRST DOWN';
          newSeries(team, S.x); return render(kind);
        }
        if (S.down === 4) {
          after(T('{l} on 4th down → TURNOVER ON DOWNS', { l: label })); S.msg = 'TURNOVER ON DOWNS';
          newSeries(other(), S.x); return render(kind);
        }
        S.down++;
        after(`${label} → ${dd(S.down, toGoTxt())}`);
        return render(kind);
      }
      const toGo = () => Math.abs(S.fd - S.x);
      const goalToGo = () => S.fd === goalX(S.dir);
      const toGoTxt = () => (goalToGo() ? T('Goal') : Math.round(toGo()));

      function stateFor(kind) {
        const off = F.off(S.x, { team: S.poss, dir: S.dir, pers: '11' });
        const def = F.def(S.x, { team: S.poss === 'NE' ? 'NYJ' : 'NE', dir: S.dir, front: 'nickel', cov: '3' });
        const routes = [], marks = [];
        if (S.last && S.last.to != null && kind) {
          const k = kind === 'pass' || kind === 'punt' || kind === 'fg' || kind === 'miss' ? 'pass' : 'run';
          const a = S.last.from, b = S.last.to;
          if (Math.abs(b - a) > 0.5) routes.push({ id: 'sim-' + S.log.length, k, d: [[a, M], [b, M + (k === 'pass' ? -1.5 : 0)]], c: kind === 'sack' ? 'r' : null, dur: 700 });
          marks.push({ id: 'sim-t' + S.log.length, type: 'text', x: (a + b) / 2, y: M - 4, t: S.log[0].split('→')[0].trim(), size: 1.6, c: 'y' });
        }
        const cx = Math.max(48, Math.min(72, S.x + S.dir * 10));
        return {
          ...FD.STEPS[FD.idx], off: S.poss, los: S.x, fd: goalToGo() ? null : S.fd, lbl: true, ball: null,
          players: [...off, ...def], routes, marks, zones: [],
          cam: { x: cx, y: M, w: 104 },
          bug: { ...FD.STEPS[FD.idx].bug, hide: false, hs: S.hs, as: S.as, q: ['', '1ST', '2ND', '3RD', '4TH'][S.q], clk: clk(), pc: 40, down: S.down, dist: goalToGo() ? 'GOAL' : Math.round(toGo()), poss: S.poss, msg: S.msg, flag: false },
          l3: { k: T('{a} ball · {s}', { a: S.poss, s: spot(S.x) }), t: S.msg ? T(S.msg) : dd(S.down, toGoTxt()), s: S.log[0] || T('Pick a play: keys 1–6'), team: S.poss === 'NYJ' ? 'NYJ' : undefined },
        };
      }
      const { F } = FD;
      function render(kind) {
        FD.render(stateFor(kind), { forward: true });
        if (kind === 'td') FD.sfx('roar'); else if (kind) setTimeout(() => FD.sfx('whistle'), 900 * FD.SPEED);
        paint();
      }

      host.classList.add('w-sim');
      function paint() {
        const fourth = S.down === 4;
        const dist = yardsToGoal() + 17;
        host.innerHTML = `
          <div class="sim-head"><b>${T('DRIVE SIMULATOR')}</b><span>${T('{a} ball · {d} at the {s}', { a: T(S.poss === 'NE' ? 'Patriots' : 'Jets'), d: dd(S.down, toGoTxt()), s: spot(S.x) })}</span></div>
          ${fourth ? `<div class="sim-4th">${T('4TH DOWN DECISION · go for it (1–4), punt (5) or try a {d}-yd field goal (6, ~{p}%)', { d: dist, p: Math.round(fgPct(dist) * 100) })}</div>` : ''}
          <div class="sim-btns">
            <button class="wbtn good" data-k="run"><kbd>1</kbd>${T('Run +4')}</button>
            <button class="wbtn good" data-k="pass"><kbd>2</kbd>${T('Pass +15')}</button>
            <button class="wbtn bad" data-k="sack"><kbd>3</kbd>${T('Sack −7')}</button>
            <button class="wbtn neu" data-k="inc"><kbd>4</kbd>${T('Incomplete')}</button>
            <button class="wbtn kick" data-k="punt"><kbd>5</kbd>${T('Punt')}</button>
            <button class="wbtn kick" data-k="fg"><kbd>6</kbd>${T('Field goal')}</button>
            <button class="wbtn" data-k="reset"><kbd>0</kbd>${T('Reset')}</button>
          </div>
          <ol class="sim-log">${S.log.map((l) => `<li>${FD.esc(l)}</li>`).join('')}</ol>`;
        host.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); act(b.dataset.k); }));
      }
      function act(k) { if (k === 'reset') { reset(); S.last = null; render(null); return; } play(k); }
      render(null);
      return {
        key(e) {
          const map = { 1: 'run', 2: 'pass', 3: 'sack', 4: 'inc', 5: 'punt', 6: 'fg', 0: 'reset' };
          if (map[e.key]) { act(map[e.key]); return true; }
          return false;
        },
        unmount() { clearTimeout(timer); },
      };
    },
  };
})(window.FD);
