/* Widget: clickable players → broadcast player card (ch06). Also FD.POS data used by chapters. */
(function (FD) {
  'use strict';
  FD.POS = {
    QB: { grp: 'Offense · Backfield', name: 'Quarterback', job: 'Runs the offense: calls the play in the huddle, takes the snap, hands off or throws.', size: '6\'3" · 225 lb', watch: 'His eyes after the snap: they tell you where the ball is going.' },
    RB: { grp: 'Offense · Backfield', name: 'Running Back', job: 'Carries the ball on runs, catches short passes, blocks blitzers.', size: '5\'11" · 215 lb', watch: 'Patience: does he wait for the hole to open, then burst?' },
    FB: { grp: 'Offense · Backfield', name: 'Fullback', job: 'A lead blocker who runs ahead of the RB and clears the way.', size: '6\'0" · 245 lb', watch: 'The collision with the first linebacker in the hole.' },
    WR: { grp: 'Offense · Receivers', name: 'Wide Receiver', job: 'Lines up wide, runs precise routes, catches passes.', size: '6\'1" · 200 lb', watch: 'The first three steps against the cornerback\'s hands.' },
    TE: { grp: 'Offense · Hybrid', name: 'Tight End', job: 'Half blocker, half receiver: lines up next to the tackle.', size: '6\'5" · 250 lb', watch: 'Does he block or release? It hints run or pass.' },
    T: { grp: 'Offense · Line', name: 'Tackle', job: 'Protects the edge. The left tackle guards the right-handed QB\'s blind side.', size: '6\'6" · 315 lb', watch: 'His kick-slide against the speed rusher.' },
    G: { grp: 'Offense · Line', name: 'Guard', job: 'Blocks next to the center; often pulls across on power runs.', size: '6\'4" · 315 lb', watch: 'Pulling guards on runs: follow him, he leads you to the hole.' },
    C: { grp: 'Offense · Line', name: 'Center', job: 'Snaps the ball every play and calls the blocking assignments.', size: '6\'3" · 305 lb', watch: 'Before the snap he points at a linebacker: the "Mike" call.' },
    DE: { grp: 'Defense · Line', name: 'Defensive End', job: 'Rushes the passer off the edge and sets the edge against runs.', size: '6\'4" · 270 lb', watch: 'The duel with the offensive tackle: speed vs power.' },
    DT: { grp: 'Defense · Line', name: 'Defensive Tackle', job: 'Plugs the middle against runs and pushes the pocket.', size: '6\'3" · 305 lb', watch: 'Does he get double-teamed? That frees a linebacker.' },
    NT: { grp: 'Defense · Line', name: 'Nose Tackle', job: 'Lines up over the center in a 3-4; eats double teams.', size: '6\'3" · 330 lb', watch: 'If he holds his ground, the linebackers make tackles.' },
    LB: { grp: 'Defense · Second level', name: 'Linebacker', job: 'Stops runs, covers backs and tight ends, sometimes blitzes.', size: '6\'2" · 240 lb', watch: 'First step: forward (run) or backward (pass)?' },
    OLB: { grp: 'Defense · Second level', name: 'Outside Linebacker', job: 'In a 3-4, the main edge rusher; also drops into coverage.', size: '6\'4" · 255 lb', watch: 'Will he rush or drop? Offenses guess wrong a lot.' },
    ILB: { grp: 'Defense · Second level', name: 'Inside Linebacker', job: 'Middle of the defense: run fits, short zones, calls the defense.', size: '6\'1" · 240 lb', watch: 'The green dot on his helmet: he has the coach\'s radio.' },
    CB: { grp: 'Defense · Secondary', name: 'Cornerback', job: 'Covers the wide receivers, man-to-man or in a zone.', size: '6\'0" · 195 lb', watch: 'Press (in his face) or off (giving cushion)?' },
    NB: { grp: 'Defense · Secondary', name: 'Nickel Back', job: 'The 5th defensive back: covers the slot receiver.', size: '5\'11" · 195 lb', watch: 'Shuffling over the slot is a sign of man coverage.' },
    S: { grp: 'Defense · Secondary', name: 'Safety', job: 'The last line: deep help in coverage and run support.', size: '6\'1" · 205 lb', watch: 'How many safeties are deep before the snap? 1 or 2 changes everything.' },
    K: { grp: 'Special teams', name: 'Kicker', job: 'Kickoffs, field goals, extra points.', size: '6\'0" · 200 lb', watch: 'His steps and plant foot; NFL kickers make most kicks under 50 yards.' },
    P: { grp: 'Special teams', name: 'Punter', job: 'Punts on 4th down to flip field position; often the holder on kicks.', size: '6\'2" · 215 lb', watch: 'Hang time: the longer it floats, the less return.' },
    LS: { grp: 'Special teams', name: 'Long Snapper', job: 'Snaps the ball 7 yards (kicks) or 15 yards (punts), perfectly, every time.', size: '6\'2" · 240 lb', watch: 'You only notice him when it goes wrong.' },
    KR: { grp: 'Special teams', name: 'Returner', job: 'Catches kicks and punts and tries to return them.', size: '5\'10" · 190 lb', watch: 'Fair catch signal: one arm waved above the head.' },
  };
  // Current Patriots jersey numbers by position (2026 depth chart).
  const PATRIOTS = {
    QB: 10, RB: 38, FB: 44, WR: 13, TE: 85, T: 66, G: 75, C: 55, DE: 5, DT: 90, NT: 90,
    LB: 14, OLB: 5, ILB: 14, CB: 7, NB: 25, S: 4, K: 8, P: 19, LS: 47, KR: 18,
  };
  FD.cardFor = (pos, team) => {
    const key = { OLB: 'OLB', ILB: 'ILB', DB: 'CB', FS: 'S', SS: 'S' }[pos] || pos;
    const P = FD.POS[key] || null;
    if (!P) return null;
    return { type: 'card', team, ...P, n: team === 'NE' ? PATRIOTS[key] ?? null : null };
  };

  FD.W.cards = {
    mount(host, st) {
      const stage = FD.$('#stage');
      stage.classList.add('cards-on');
      host.classList.add('w-cards');
      host.innerHTML = `<div class="cards-hint">${FD.T('Click any player for his card · Esc closes')}</div>`;
      let open = null;
      const close = () => { if (open) { open.remove(); open = null; } FD.$$('.pl.sel').forEach((g) => g.classList.remove('sel')); };
      FD.closeCard = close;
      FD.onPlayerClick = (e, id) => {
        if (!stage.classList.contains('cards-on')) return;
        e.stopPropagation();
        const p = (FD.cur.players || []).find((q) => q.id === id);
        if (!p) return;
        const card = FD.cardFor(p.pos, p.t);
        if (!card) return;
        close();
        e.currentTarget && e.currentTarget.classList.add('sel');
        open = FD.h('div', { class: 'ov ov-card in pos-r' });
        open.innerHTML = FD.OV.card(card);
        open.addEventListener('pointerup', (ev) => ev.stopPropagation());
        host.appendChild(open);
      };
      return { unmount() { close(); stage.classList.remove('cards-on'); FD.onPlayerClick = null; FD.closeCard = null; } };
    },
  };
})(window.FD);
