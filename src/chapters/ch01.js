/* Chapter 1 — The League in 60 Seconds */
(function (FD) {
  FD.CH.push({
    title: 'The League in 60 Seconds', sub: '32 teams, 2 conferences, 8 divisions',
    base: { cam: { x: 60, y: 26.67, w: 190 }, bug: {} },
    steps: [
      {
        title: '32 teams',
        bug: { reset: true, hide: true },
        ov: [{ id: 'lg', type: 'league', pos: 'c' }],
        l3: { k: 'The National Football League', t: '32 teams', s: 'Two conferences, eight divisions of four' },
        notes: {
          p: ['The NFL is 32 teams. Every team belongs to one of two conferences: the AFC and the NFC.',
            'Each conference has four divisions: East, North, South, West. Four teams per division.',
            'The divisions are the most important grouping: you play your division rivals twice every year.'],
          a: 'Like a school with two buildings (conferences), each with four classrooms (divisions) of four kids.',
          x: 'Current alignment dates to 2002, when the Houston Texans joined and the league realigned into 8 four-team divisions.',
        },
      },
      {
        title: 'AFC vs NFC',
        ov: [{ id: 'lg', type: 'league', pos: 'c', hl: 'AFC' }],
        l3: { k: 'Two conferences', t: 'AFC & NFC', s: 'Each conference crowns a champion; they meet in the Super Bowl' },
        notes: {
          p: ['AFC = American Football Conference. NFC = National Football Conference.',
            'Each conference sends 7 teams to the playoffs, and its champion goes to the Super Bowl.',
            'Patriots and Jets are AFC teams, so they could only meet a team like the Giants or Eagles in the Super Bowl.'],
          a: 'Two semifinal brackets that feed one final.',
          x: 'The AFC descends largely from the old American Football League (AFL), which merged with the NFL in 1970.',
        },
      },
      {
        title: 'One AFC East division',
        ov: [{ id: 'lg', type: 'league', pos: 'c', hl: 'AFC East' }],
        l3: { k: 'One of 8 divisions', t: 'AFC East', s: 'Bills · Dolphins · Patriots · Jets' },
        notes: {
          p: ['The AFC East includes Buffalo, Miami, New England, and the New York Jets.',
            'Teams play each division rival twice a season: once at home, once away. That\'s 6 of 17 games.',
            'Win the division and you are guaranteed a playoff spot and a home playoff game.'],
          x: 'All four AFC East franchises were AFL clubs (the Dolphins joined the AFL in 1966).',
        },
      },
      {
        title: 'The teams in our examples',
        ov: [{ id: 'teams', type: 'panel', pos: 'c', w: '46vw', k: 'A quick introduction', t: 'Patriots & Jets',
          items: ['**New England Patriots (NE)**: the guide\'s home-team example; based near Boston.', '**New York Jets (NYJ)**: their division rival; based in the New York area.', 'Both play in the **AFC East**. The same rules apply to all 32 NFL teams.'] }],
        l3: { k: 'Two teams, one division', t: 'NE vs NYJ', s: 'Examples to make the rules concrete' },
        notes: {
          p: ['NE means the New England Patriots; NYJ means the New York Jets.',
            'They are the two teams used most often in the examples, so the plays are easier to follow.',
            'The focus is the NFL game itself, not either team\'s history.'],
          x: 'Team abbreviations follow the NFL scorebug: NE and NYJ are used here for readability.',
        },
      },
      {
        title: 'The playoff race',
        ov: [{ id: 'br', type: 'bracket', pos: 'c' }],
        l3: { k: 'Postseason', t: '14 teams make the playoffs', s: 'Seven from each conference compete for the Super Bowl' },
        notes: {
          p: ['Seven teams from each conference qualify: four division winners and three wild cards.',
            'The top seed in each conference skips the first playoff round.',
            'The AFC and NFC champions meet in the Super Bowl.'],
          x: 'The NFL postseason uses single-elimination games; each conference champion advances to the Super Bowl.',
        },
      },
      {
        title: 'A home stadium',
        ov: [],
        photo: { key: 'photo_gillette', dim: 0.3, over: true },
        l3: { k: 'One NFL venue', t: 'Gillette Stadium', s: 'Foxborough, Massachusetts · about 65,000 seats' },
        notes: {
          p: ['Gillette Stadium in Foxborough is one example of an NFL home venue.',
            'Every team plays 8 or 9 home games a season, so home field matters: crowd noise, weather, travel.',
            'Now let\'s step onto the field itself.'],
          a: 'Home field advantage is real: the visiting offense has to communicate over 65,000 people yelling.',
          x: 'Teams alternate between 9 and 8 regular-season home games by conference each year (the 17th game).',
        },
      },
    ],
  });
})(window.FD);
