/* Short "what's coming" intro for each chapter (inserted as the chapter's first step). Keyed by chapter title. */
(function (FD) {
  const I = {
    'The League in 60 Seconds': { items: ['What the NFL is: **32 teams**', 'How they\'re grouped: **2 conferences, 8 divisions**', 'Our division and our rivalry: **Patriots vs Jets**'], why: 'Divisions decide who you play most and who makes the playoffs.' },
    'The Field': { items: ['Size of the field and the **end zones**', 'Lines, numbers and **hash marks**', 'How a spot is named: **"own 25" vs "opponent\'s 25"**'], why: 'Every announcer sentence starts with where the ball is.' },
    'Objective & Scoring': { items: ['The goal: carry or catch the ball into the **end zone**', 'The **five ways to score** and what each is worth', 'A mini-challenge: how do you get to **17**?'], why: 'Scores explain every decision a coach makes.' },
    'Time': { items: ['**4 quarters** of 15 minutes', 'The **game clock** vs the **play clock**', 'What stops the clock, timeouts and **overtime**'], why: 'The end of every close game is a fight against the clock.' },
    'Downs & Distance': { items: ['**4 tries** (downs) to gain **10 yards**', 'How to read "**3rd & 4**"', 'What happens on **4th down**, then you run a drive yourself'], why: 'This is the one rule everything else hangs on.' },
    'The Players': { items: ['**11 vs 11** on the field', 'The offensive groups: **line, backs, receivers**', 'The defensive groups and the **specialists**'], why: 'Knowing who\'s who tells you where to look.' },
    'Anatomy of a Play': { items: ['One play from start to finish', '**Huddle → snap → whistle → spot**', 'How the **chains** move the yellow line'], why: 'Every one of ~150 plays in a game follows this rhythm.' },
    'Run Game': { items: ['The **gaps** between blockers', 'Three classic runs: **inside zone, power, outside zone**', 'What to watch when the ball is handed off'], why: 'Running the ball controls the clock and sets up the pass.' },
    'Pass Game': { items: ['**Who** is allowed to catch a pass', 'Protection, the **pocket** and the **route tree**', 'Two real pass plays and how the QB **reads** them'], why: 'Passing is how modern teams move the ball fastest.' },
    'Defense': { items: ['The **three levels** of a defense', '**Man vs zone** coverage', 'Cover 1, 2, 3 and the **blitz**'], why: 'Once you can spot the coverage, the game slows down.' },
    'Film Room': { items: ['Optional **expert** chapter (press **D** to skip)', '**Play-action** and the **RPO**', 'Reading the safeties and **disguised coverages**'], why: 'How coaches and QBs out-think each other before the snap.' },
    'Special Teams': { items: ['The **kickoff** under the newest rules', '**Punts** and **fair catches**', '**Field goals** and extra points'], why: 'About one play in six, and field position swings games.' },
    'Penalties': { items: ['What the **yellow flag** means', 'The most common fouls and their **yardage**', 'The officials and **replay review**'], why: 'A single flag can keep a drive alive or kill it.' },
    'Turnovers': { items: ['**Interceptions**', '**Fumbles**', '**Turnover on downs**'], why: 'The team that wins the turnover battle usually wins the game.' },
    'Strategy': { items: ['The **4th-down** decision: punt, kick or go', '**Clock management** when ahead or behind', 'The **two-minute drill**'], why: 'This is where coaches win and lose games.' },
    'The Season': { items: ['The **football year**, from draft to Super Bowl', 'How the **17-game schedule** is built', '**TV**, standings and the **playoffs**'], why: 'So you know which games matter and when to watch.' },
    'How to Watch': { items: ['Reading a **real TV broadcast**', 'What to look at **before** the snap', 'What to look at **after** the snap'], why: 'Turn the TV picture into information.' },
    'Live Quiz': { items: ['**5 game situations**', 'You **vote**, then we reveal the answer', 'Each one tests a key rule from today'], why: 'Prove you\'re Sunday-ready.' },
  };
  FD.CH.forEach((ch) => { if (I[ch.title] && !ch.intro) ch.intro = I[ch.title]; });
})(window.FD);
