/* HTML overlay types. Each FD.OV[type](props) returns inner HTML. */
(function (FD) {
  'use strict';
  const e = FD.esc, A = FD.asset, T = FD.T;
  const md = (s) => String(s ?? '').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/_(.+?)_/g, '<i>$1</i>');
  FD.md = md;

  // ---------- league data (32 teams). Logos only for AFC East (supplied files). ----------
  FD.TEAMS = [
    ['AFC', 'East', 'BUF', 'Bills', '#00338D'], ['AFC', 'East', 'MIA', 'Dolphins', '#008E97'], ['AFC', 'East', 'NE', 'Patriots', '#002244'], ['AFC', 'East', 'NYJ', 'Jets', '#125740'],
    ['AFC', 'North', 'BAL', 'Ravens', '#241773'], ['AFC', 'North', 'CIN', 'Bengals', '#FB4F14'], ['AFC', 'North', 'CLE', 'Browns', '#311D00'], ['AFC', 'North', 'PIT', 'Steelers', '#C79A00'],
    ['AFC', 'South', 'HOU', 'Texans', '#03202F'], ['AFC', 'South', 'IND', 'Colts', '#002C5F'], ['AFC', 'South', 'JAX', 'Jaguars', '#006778'], ['AFC', 'South', 'TEN', 'Titans', '#0C2340'],
    ['AFC', 'West', 'DEN', 'Broncos', '#FB4F14'], ['AFC', 'West', 'KC', 'Chiefs', '#E31837'], ['AFC', 'West', 'LV', 'Raiders', '#555b61'], ['AFC', 'West', 'LAC', 'Chargers', '#0080C6'],
    ['NFC', 'East', 'DAL', 'Cowboys', '#003594'], ['NFC', 'East', 'NYG', 'Giants', '#0B2265'], ['NFC', 'East', 'PHI', 'Eagles', '#004C54'], ['NFC', 'East', 'WAS', 'Commanders', '#5A1414'],
    ['NFC', 'North', 'CHI', 'Bears', '#0B162A'], ['NFC', 'North', 'DET', 'Lions', '#0076B6'], ['NFC', 'North', 'GB', 'Packers', '#203731'], ['NFC', 'North', 'MIN', 'Vikings', '#4F2683'],
    ['NFC', 'South', 'ATL', 'Falcons', '#A71930'], ['NFC', 'South', 'CAR', 'Panthers', '#0085CA'], ['NFC', 'South', 'NO', 'Saints', '#9f8958'], ['NFC', 'South', 'TB', 'Buccaneers', '#D50A0A'],
    ['NFC', 'West', 'ARI', 'Cardinals', '#97233F'], ['NFC', 'West', 'LAR', 'Rams', '#003594'], ['NFC', 'West', 'SF', '49ers', '#AA0000'], ['NFC', 'West', 'SEA', 'Seahawks', '#002244'],
  ].map(([conf, div, ab, name, c]) => ({ conf, div, ab, name, c }));
  const LOGO = { NE: 'ne', NYJ: 'nyj', BUF: 'buf', MIA: 'mia' };
  FD.teamLogo = (ab) => A(LOGO[ab] || 'tm_' + ab);
  FD.teamChip = (t, cls = '') => {
    const lg = FD.teamLogo(t.ab);
    return `<span class="tchip ${cls} ${t.ab === 'NE' ? 'me' : ''}" style="--tc:${t.c}">${lg ? `<img src="${lg}" alt="">` : `<i>${t.ab}</i>`}<b>${T(t.name)}</b></span>`;
  };

  const OV = FD.OV;

  OV.title = (o) => `
    ${o.logo !== false ? `<div class="t-logos"><img src="${A('nfl')}" class="t-nfl" alt="NFL"><img src="${A('ne')}" class="t-ne" alt="Patriots"></div>` : ''}
    ${o.k ? `<div class="t-k">${md(o.k)}</div>` : ''}
    <h1 class="t-t">${md(o.t)}</h1>
    ${o.s ? `<div class="t-s">${md(o.s)}</div>` : ''}
    ${o.menu ? `<div class="t-menu">${FD.CH.map((c, i) => `<button data-go="${i}"><b>${String(i).padStart(2, '0')}</b>${e(c.title)}</button>`).join('')}</div>` : ''}`;
  OV.title_after = (el) => el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', (ev) => { ev.stopPropagation(); FD.goChapter(+b.dataset.go); }));

  OV.chapter = (o) => `<div class="ci-num">${String(o.n).padStart(2, '0')}</div><div class="ci-body"><div class="ci-k">${T('Coming up')}</div><div class="ci-t">${md(o.t)}</div>${o.s ? `<div class="ci-s">${md(o.s)}</div>` : ''}
    <ul class="ci-list">${(o.items || []).map((x) => `<li>${md(x)}</li>`).join('')}</ul>${o.why ? `<div class="ci-why"><b>${T('Why it matters')}</b> ${md(o.why)}</div>` : ''}</div>`;

  OV.big = (o) => `${o.k ? `<div class="b-k">${md(o.k)}</div>` : ''}<div class="b-t" ${o.c ? `style="color:${o.c}"` : ''}>${md(o.t)}</div>${o.s ? `<div class="b-s">${md(o.s)}</div>` : ''}`;

  OV.panel = (o) => `
    ${o.img ? `<img class="p-img" src="${A(o.img)}" alt="">` : ''}
    ${o.k ? `<div class="p-k">${md(o.k)}</div>` : ''}
    ${o.t ? `<div class="p-t">${md(o.t)}</div>` : ''}
    ${o.items ? `<ul class="p-list ${o.num ? 'num' : ''}">${o.items.map((it, i) => `<li class="${o.hl === i ? 'hl' : ''} ${o.dim != null && i > o.dim ? 'dimmed' : ''}">${md(it)}</li>`).join('')}</ul>` : ''}
    ${o.html || ''}
    ${o.foot ? `<div class="p-foot">${md(o.foot)}</div>` : ''}`;

  OV.stats = (o) => o.items.map((it, i) => `<div class="stat ${o.hl === i ? 'hl' : ''}" style="${it.c ? `--sc:${it.c}` : ''}"><div class="v">${md(it.v)}</div><div class="l">${md(it.l)}</div>${it.s ? `<div class="s">${md(it.s)}</div>` : ''}</div>`).join('');

  OV.card = (o) => {
    const ne = (o.team || 'NE') === 'NE';
    return `<div class="c-hd ${ne ? 'ne' : 'nyj'}"><img class="c-helmet" src="${A(ne ? 'ne_helmet' : 'nyj_helmet')}" alt=""><div class="c-num">${o.n ?? ''}</div><div><div class="c-pos">${e(o.grp || '')}</div><div class="c-nm">${e(o.name || o.pos)}</div></div></div>
      <dl>${o.job ? `<div><dt>${T('Job')}</dt><dd>${md(o.job)}</dd></div>` : ''}${o.size ? `<div><dt>${T('Typical size')}</dt><dd>${md(o.size)}</dd></div>` : ''}${o.watch ? `<div class="w"><dt>${T('What to watch')}</dt><dd>${md(o.watch)}</dd></div>` : ''}</dl>`;
  };

  OV.league = (o) => {
    const by = (conf) => ['East', 'North', 'South', 'West'].map((d) => {
      const ts = FD.TEAMS.filter((t) => t.conf === conf && t.div === d);
      const on = !o.hl || o.hl === conf || o.hl === `${conf} ${d}` || o.hl === 'all';
      return `<div class="div ${on ? '' : 'dim'} ${o.hl === `${conf} ${d}` ? 'hl' : ''}"><div class="dn">${conf} ${d}</div>${ts.map((t) => FD.teamChip(t)).join('')}</div>`;
    }).join('');
    return `<div class="lg-head"><img src="${A('nfl')}" alt="NFL"><div>${T('<b>32 teams</b> · 2 conferences · 8 divisions of 4')}</div></div>
      <div class="lg-grid"><div class="conf afc ${o.hl && o.hl.startsWith('NFC') ? 'dim' : ''}"><div class="cn"><img src="${A('afc')}" alt="">AFC <small>${T('American Football Conference')}</small></div>${by('AFC')}</div>
      <div class="conf nfc ${o.hl && o.hl.startsWith('AFC') ? 'dim' : ''}"><div class="cn"><img src="${A('nfc')}" alt="">NFC <small>${T('National Football Conference')}</small></div>${by('NFC')}</div></div>`;
  };

  OV.calendar = (o) => {
    const segs = o.segs || [
      ['Mar', 'Free agency', 'off'], ['Apr', 'NFL Draft', 'off'], ['May–Jun', 'OTAs & minicamp', 'off'], ['Jul', 'Training camp', 'pre'], ['Aug', 'Preseason (3 games)', 'pre'],
      ['Sep–Jan', 'Regular season · 18 weeks · 17 games + 1 bye', 'reg'], ['Jan', 'Playoffs · 14 teams', 'post'], ['Feb', 'Super Bowl', 'sb'],
    ];
    return `<div class="cal">${segs.map((s, i) => `<div class="seg ${s[2]} ${o.hl === i ? 'hl' : ''} ${o.hl != null && o.hl !== i ? 'dim' : ''}"><div class="m">${T(s[0])}</div><div class="n">${md(T(s[1]))}</div>${s[2] === 'sb' ? `<img src="${A('lombardi')}" alt="">` : ''}</div>`).join('')}</div>${o.foot ? `<div class="p-foot">${md(o.foot)}</div>` : ''}`;
  };

  OV.matrix = (o) => {
    const R = [
      ['div', '6', 'Division', 'BUF · MIA · NYJ', 'Home & away vs each rival'],
      ['conf4', '4', 'Another AFC division', 'Rotates every year', '2 home · 2 away'],
      ['nfc4', '4', 'An NFC division', 'Rotates every 4 years', '2 home · 2 away'],
      ['place2', '2', 'Same-place AFC teams', 'From the 2 remaining AFC divisions', 'Based on last year\u2019s finish'],
      ['g17', '1', '17th game', 'Same-place NFC team', 'From an NFC division not already on the schedule'],
    ];
    return `<div class="mx-head"><img src="${A('ne')}" alt=""><div><b>${T('How the Patriots\' 17 opponents are picked')}</b><small>${T('The same formula applies to every team')}</small></div></div>
      <div class="mx">${R.map((r) => `<div class="row ${o.hl === r[0] || o.hl === 'all' ? 'hl' : ''} ${o.hl && o.hl !== r[0] && o.hl !== 'all' ? 'dim' : ''} ${o.show && !o.show.includes(r[0]) ? 'hidden' : ''}" data-mx-key="${r[0]}"><div class="g">${r[1]}</div><div><b>${T(r[2])}</b><span>${T(r[3])}</span></div><div class="nt">${T(r[4])}</div></div>`).join('')}
      <div class="row tot"><div class="g">17</div><div><b>${T('games')}</b><span>${T('over 18 weeks (1 bye)')}</span></div><div class="nt">${A('buf') ? `<img src="${A('buf')}"><img src="${A('mia')}"><img src="${A('nyj')}">` : ''}</div></div></div>`;
  };
  OV.matrix_update = (el, o) => el.querySelectorAll('.mx .row[data-mx-key]').forEach((row) => {
    const key = row.dataset.mxKey;
    row.classList.toggle('hl', o.hl === key || o.hl === 'all');
    row.classList.toggle('dim', !!o.hl && o.hl !== key && o.hl !== 'all');
    row.classList.toggle('hidden', !!o.show && !o.show.includes(key));
  });

  OV.bracket = (o) => {
    const st = o.stage ?? 4;
    const seed = (n, t, c, bye) => `<div class="sd ${bye ? 'bye' : ''}" style="--tc:${c}" data-bye="${T('BYE')}"><i>${n}</i>${T(t)}</div>`;
    const conf = (name, teams) => `<div class="bc"><div class="bn">${name}</div>
      <div class="col r1 ${st >= 1 ? 'on' : ''}"><div class="rn">${T('Wild Card')}</div>${seed(1, teams[0], '#FACC15', 1)}<div class="m">${seed(2, teams[1])}${seed(7, teams[6])}</div><div class="m">${seed(3, teams[2])}${seed(6, teams[5])}</div><div class="m">${seed(4, teams[3])}${seed(5, teams[4])}</div></div>
      <div class="col r2 ${st >= 2 ? 'on' : ''}"><div class="rn">${T('Divisional')}</div><div class="m">${seed('', '#1 seed')}${seed('', 'lowest left')}</div><div class="m">${seed('', 'winner')}${seed('', 'winner')}</div></div>
      <div class="col r3 ${st >= 3 ? 'on' : ''}"><div class="rn">${T('Conf. Championship')}</div><div class="m">${seed('', T('{c} champ?', { c: name }))}</div></div></div>`;
    return `<div class="br">${conf('AFC', ['Div. winner', 'Div. winner', 'Div. winner', 'Div. winner', 'Wild card', 'Wild card', 'Wild card'])}
      <div class="sb ${st >= 4 ? 'on' : ''}"><img src="${A('lombardi')}" alt=""><b>${T('Super Bowl')}</b><small>${T('AFC champ vs NFC champ<br>neutral site')}</small></div>
      ${conf('NFC', ['Div. winner', 'Div. winner', 'Div. winner', 'Div. winner', 'Wild card', 'Wild card', 'Wild card'])}</div>
      ${o.foot ? `<div class="p-foot br-foot">${md(o.foot)}</div>` : ''}`;
  };
  OV.bracket_update = (el, o) => {
    el.innerHTML = OV.bracket(o);
  };

  OV.signal = (o) => `<div class="sg-img"><img src="${A('sig' + o.sig)}" alt="Signal ${o.sig}"><span class="sg-n">#${o.sig}</span></div>
    <div class="sg-body"><div class="sg-k">${T('Official signal')} ${o.sig}${o.k ? ' · ' + md(o.k) : ''}</div><div class="sg-t">${md(o.name)}</div>${o.desc ? `<div class="sg-d">${md(o.desc)}</div>` : ''}
    <div class="sg-f">${o.yds ? `<span class="yd">${md(o.yds)}</span>` : ''}${o.af != null ? `<span class="af ${o.af ? 'yes' : 'no'}">${o.af ? T('Automatic 1st down') : T('No automatic 1st down')}</span>` : ''}${o.extra ? `<span class="ex">${md(o.extra)}</span>` : ''}</div></div>`;

  OV.signals = (o) => `<div class="sgs">${o.items.map((it, i) => `<div class="sgc ${o.hl === i ? 'hl' : ''}"><img src="${A('sig' + it.sig)}" alt=""><div><b>${md(it.name)}</b><span>${md(it.yds)}</span>${it.af ? `<em>${T('Auto 1st')}</em>` : ''}</div></div>`).join('')}</div>${o.foot ? `<div class="p-foot">${md(o.foot)}</div>` : ''}`;

  OV.photo = (o) => `<img src="${A(o.key)}" alt="">${o.cap ? `<div class="ph-cap">${md(o.cap)}</div>` : ''}`;

  OV.logos = (o) => `${o.t ? `<div class="p-t">${md(o.t)}</div>` : ''}<div class="lgs">${o.items.map((k) => `<img src="${A(k)}" alt="">`).join('')}</div>${o.cap ? `<div class="p-foot">${md(o.cap)}</div>` : ''}`;

  OV.tv = (o) => `${o.t ? `<div class="p-t">${md(o.t)}</div>` : ''}<div class="tvs">${o.items.map((it, i) => `<div class="tvc ${o.hl === i ? 'hl' : ''}"><div class="tvl">${it.logo ? (Array.isArray(it.logo) ? it.logo : [it.logo]).map((l) => `<img src="${A(l)}" alt="">`).join('') : `<span class="tvtxt">${e(it.txt)}</span>`}</div><b>${md(it.slot)}</b><span>${md(it.sub || '')}</span></div>`).join('')}</div>${o.foot ? `<div class="p-foot">${md(o.foot)}</div>` : ''}`;

  OV.frame = (o) => {
    const n = o.show ?? o.notes.length;
    return `<div class="fr-wrap"><img src="${A(o.key)}" alt="">${o.notes.map((m, i) => `<div class="fr-n ${i < n ? 'on' : ''} ${i === n - 1 ? 'cur' : ''}" style="left:${m.x}%;top:${m.y}%;width:${m.w}%;height:${m.h}%"><span class="fr-b">${i + 1}</span><span class="fr-l ${m.side || ''}">${md(m.t)}</span></div>`).join('')}</div>`;
  };

  OV.clock = (o) => `<div class="ck"><div class="ck-g"><small>${T('GAME CLOCK')}</small><b>${o.game}</b><span>${md(o.gs || T('4 × 15 minutes'))}</span></div><div class="ck-p ${o.run ? 'run' : ''}" style="--pc:${o.play}"><small>${T('PLAY CLOCK')}</small><b class="pcv">${o.play}</b><span>${md(o.ps || T('seconds to snap'))}</span></div></div>`;
  OV.clock_after = (el, o, instant) => {
    if (!o.run || instant) return;
    const b = el.querySelector('.pcv');
    let v = o.play;
    el._t = setInterval(() => { if (FD.TL.paused) return; v = v <= 0 ? o.play : v - 1; b.textContent = v; b.classList.toggle('low', v <= 5); }, 1000);
  };
  OV.clock_remove = (el) => clearInterval(el._t);

  OV.timeline = (o) => `<div class="tlx">${o.items.map((it, i) => `<div class="ti ${i < o.i ? 'done' : ''} ${i === o.i ? 'cur' : ''}"><i>${i + 1}</i><span>${md(it)}</span></div>`).join('')}</div>`;

  OV.compare = (o) => `${o.t ? `<div class="p-t">${md(o.t)}</div>` : ''}<div class="cmp">${o.cols.map((c) => `<div class="cc" style="--cc:${c.c || '#38bdf8'}"><div class="ct">${md(c.t)}</div><ul>${(c.items || []).map((x) => `<li>${md(x)}</li>`).join('')}</ul></div>`).join('')}</div>${o.foot ? `<div class="p-foot">${md(o.foot)}</div>` : ''}`;

  // ---------- YouTube replay ----------
  // The NFL blocks these clips from embedded players, so ▶ opens YouTube in a new tab.
  const YT = { butler: 'U7rPIg7ZNQ8', miracle: 'OJzpoj_NxqQ', jones: 'MqRkWAwnJik' };
  OV.video = (o) => {
    const id = YT[o.yt] || o.yt;
    const thumb = A('yt_' + o.yt);
    return `<div class="rp-wipe"><span>${T('REPLAY')}</span></div>
      <div class="rp-frame"><div class="rp-player" data-yt="${id}">
        <div class="rp-fallback" style="${thumb ? `background-image:url(${thumb})` : ''}"><button class="rp-play" title="V" aria-label="${T('Watch on YouTube')}">▶</button></div></div>
      <div class="rp-l3"><div class="k">${md(o.k || T('REPLAY'))}</div><div class="t">${md(o.t)}</div>${o.s ? `<div class="s">${md(o.s)}</div>` : ''}</div></div>`;
  };
  OV.video_after = (el, o) => {
    const id = el.querySelector('.rp-player').dataset.yt;
    el.querySelector('.rp-play').addEventListener('click', (ev) => { ev.stopPropagation(); FD.videoPlay(el, id, o); });
    el.addEventListener('click', (ev) => ev.stopPropagation());
  };
  FD.videoPlay = (el, id, o) => {
    if (!navigator.onLine) { FD.toast(T('Offline: the replay needs an internet connection')); return; }
    FD.stopSfx();
    window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}${o.start ? `&t=${+o.start}s` : ''}`, '_blank', 'noopener');
  };
})(window.FD);
