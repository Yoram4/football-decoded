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
        title: 'The AFC East',
        ov: [{ id: 'lg', type: 'league', pos: 'c', hl: 'AFC East' }],
        l3: { k: 'Our division', t: 'AFC East', s: 'Bills · Dolphins · Patriots · Jets' },
        notes: {
          p: ['Our division: Buffalo Bills, Miami Dolphins, New England Patriots, New York Jets.',
            'You play each division rival twice a season: once at home, once away. That\'s 6 of your 17 games.',
            'Win the division and you are guaranteed a playoff spot and a home playoff game.'],
          a: 'Division rivals are the neighbors you see every year at the block party, whether you like them or not.',
          x: 'All four AFC East franchises were AFL clubs (the Dolphins joined the AFL in 1966).',
        },
      },
      {
        title: 'The Border War: Patriots vs Jets',
        ov: [{ id: 'lg', type: 'league', pos: 'c', hl: 'AFC East', cls: 'faded' },
          { id: 'bw', type: 'panel', pos: 'c', w: '46vw', img: 'pat', k: 'A rivalry since 1960', t: 'Patriots vs Jets',
            items: ['Both were **founding members of the AFL** in 1960 (Boston Patriots and New York Titans).', 'The Titans became the **Jets** in 1963; the Patriots moved to **Foxborough** in 1971 and became **New England**.', 'Boston vs New York in every sport: the "Border War".'] }],
        l3: { k: 'Our story game', t: 'NE vs NYJ', s: 'Navy circles vs Jets X\'s, all talk long' },
        notes: {
          p: ['Why the Jets? Because Boston vs New York is the oldest rivalry in American sports, and football is no exception.',
            'Both teams were born in 1960 in the American Football League. Pat Patriot here was the original logo.',
            'For the rest of the talk, whenever you see a navy circle, that\'s a Patriot. A white X with green edges is a Jet.'],
          a: 'Red Sox vs Yankees, in shoulder pads.',
          x: 'Notable chapters: the 2010 AFC Divisional (Jets won in Foxborough) and the "Butt Fumble" game on Thanksgiving 2012.',
        },
      },
      {
        title: 'Why New England',
        ov: [{ id: 'ban', type: 'photo', pos: 'c', key: 'photo_banners', cap: 'Six Super Bowl banners at Gillette: 2001, 2003, 2004, 2014, 2016, 2018 seasons' }],
        l3: { k: 'Six Lombardi Trophies', t: 'Why New England', s: '6 titles (tied for most) · 12 Super Bowl trips (most ever) · 2025 AFC champions' },
        notes: {
          p: ['Six Super Bowl championships: seasons 2001, 2003, 2004, 2014, 2016, 2018.',
            'That\'s tied with the Pittsburgh Steelers for the most in NFL history, and 12 Super Bowl appearances is the most of any team.',
            'Last season (2025) the Patriots won the AFC and reached Super Bowl LX, losing 29–13 to Seattle in February 2026.',
            'Note the "season" naming: the 2025 season\'s Super Bowl was played in February 2026. We will see why when we get to the calendar.'],
          a: 'A season is named after the year it starts, like a school year.',
          x: 'Super Bowls XXXVI, XXXVIII, XXXIX, XLIX, LI and LIII. The Jets\' only title is Super Bowl III (1968 season).',
        },
      },
      {
        title: 'Home: Gillette Stadium',
        ov: [],
        photo: { key: 'photo_gillette', dim: 0.3, over: true },
        l3: { k: 'Foxborough, MA', t: 'Gillette Stadium', s: 'Home of the Patriots since 2002 · about 65,000 seats' },
        notes: {
          p: ['Gillette Stadium in Foxborough, between Boston and Providence.',
            'Every team plays 8 or 9 home games a season, so home field matters: crowd noise, weather, travel.',
            'Now let\'s step onto the field itself.'],
          a: 'Home field advantage is real: the visiting offense has to communicate over 65,000 people yelling.',
          x: 'Teams alternate between 9 and 8 regular-season home games by conference each year (the 17th game).',
        },
      },
    ],
  });
})(window.FD);
