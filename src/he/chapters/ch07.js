/* Chapter 7 — Anatomy of a Play */
(function (FD) {
  const { F, R } = FD;
  const M = FD.MID;

  const TLI = ['האדל', 'עמידה בקו', 'מושן', 'סנאפ', 'המהלך', 'שריקה', 'הנחת הכדור', 'שרשראות'];
  const tl = (i) => ({ id: 'tl', type: 'timeline', pos: 't', items: TLI, i });

  // huddle: `lead` faces the group from the open side (toward the LOS); others in a horseshoe
  const ring = (pl, cx, dir, lead) => {
    const others = pl.filter((p) => !p.id.endsWith('-' + lead)), n = others.length;
    return pl.map((p) => {
      if (p.id.endsWith('-' + lead)) return { ...p, x: +(cx + dir * 3.6).toFixed(2), y: +M.toFixed(2) };
      const a = (dir > 0 ? Math.PI : 0) + ((-130 + (260 * others.indexOf(p)) / (n - 1)) * Math.PI) / 180;
      return { ...p, x: +(cx + 3.6 * Math.cos(a)).toFixed(2), y: +(M + 3.6 * Math.sin(a)).toFixed(2) };
    });
  };

  // Drive: 1st & 10 at the NE 30 (LOS x 40), line to gain x 50
  const o = F.off(40, { pers: '11', wide: 13 });
  const d = F.def(40, { front: 'nickel', cov: '3', wide: 13 });
  const hud1 = [...ring(o, 32, 1, 'QB'), ...ring(d, 48, -1, 'MIKE')];

  // pre-snap motion: H (slot, off the line) runs across behind the line
  const h = F.get(o, 'H');
  const motion = R.abs(o, 'H', [[37.2, M - 6], [37.2, M + 9]], { k: 'motion', move: true, delay: 200, dur: 1500, lbl: 'מושן' });
  const nbFollow = R.abs(d, 'NB', [[44.5, M + 8.5]], { move: true, delay: 400, dur: 1300 });
  const set3 = [...o, ...d];
  const set4 = F.after(set3, [motion, nbFollow]);

  // snap: ball from center to the shotgun QB
  const qb = F.get(o, 'QB');
  const snap = { id: 'snap', p: 'BALL', k: 'pass', d: [[40, M], [qb.x, qb.y]], move: true, delay: 150, dur: 280, lift: 0, arrow: false };
  const play4 = [...set4, F.ball(40, M)];
  const play5 = F.after(play4, [snap]);

  // action: inside run for +6 (RB from the gun, handoff, through the A/B gap)
  const runPts = [[37, M + 0.5], [40, M - 0.5], [43, M - 1], [46, M - 0.8]];
  const run = R.abs(play5, 'RB', runPts, { k: 'run', move: true, curve: true, delay: 300, dur: 1300 });
  const carry = { id: 'carry', p: 'BALL', k: 'route', d: [[qb.x, qb.y], ...runPts], move: true, curve: true, delay: 300, dur: 1300, c: 'rgba(0,0,0,0)', arrow: false, glow: false };
  const tacklers = [
    R.abs(play5, 'MIKE', [[46.8, M - 0.3]], { move: true, delay: 800, dur: 800 }),
    R.abs(play5, 'WILL', [[46.9, M - 1.7]], { move: true, delay: 800, dur: 800 }),
  ];
  const routes5 = [run, carry, ...tacklers, ...R.blocks(play5, [...R.OL, 'TE'], 1.3, -0.4), ...R.blocks(play5, ['X', 'Z', 'H'], 2, 0)];
  const end6 = F.after(play5, routes5).filter((p) => p.id !== 'BALL');

  // next series of plays: huddle 8 yards behind the new LOS (x 46)
  const hud9 = [...ring(o, 38, 1, 'QB'), ...ring(d, 53, -1, 'MIKE')];

  const CAM = { x: 45, y: 29, w: 96 };

  FD.CH.push({
    title: 'האנטומיה של מהלך', sub: 'מההאדל ועד השרשראות: מחזור של 40 שניות',
    base: { cam: CAM },
    steps: [
      {
        title: 'ההאדל',
        bug: { reset: true, hs: 7, as: 3, q: '2ND', clk: '8:41', clkRun: true, down: 1, dist: 10, poss: 'NE', pc: 40, pcRun: true },
        cam: CAM, los: 40, fd: 50, lbl: true, ball: null, off: 'NE', dlbl: false,
        players: hud1, routes: [], marks: [],
        ov: [tl(0)],
        sfx: ['huddle'],
        l3: { k: 'דאון ראשון ו-10 · NE 30', t: 'ההאדל (Huddle)', s: 'הקוורטרבק מעביר את המהלך לעשרת האחרים' },
        notes: {
          p: ['לכל מהלך יש אותו מחזור חיים. בואו נאט אחד: דאון ראשון ו-10 מקו ה-30 של הפטריוטס, רבע שני, NE מובילה 7–3.',
            'שלב 1: ההאדל, בערך 8 יארדים מאחורי הכדור. הקוורטרבק שומע את המהלך מהמאמן דרך רדיו בקסדה וחוזר עליו לעשרת האחרים.',
            'שעון המהלך כבר רץ: 40 שניות מסוף המהלך הקודם (חוק 4-6-1).',
            'גם ההגנה עושה האדל, ומקבלת את ההוראה מהקווים.'],
          a: 'ההאדל הוא ישיבת הצוות לפני כל מהלך: 15 שניות להסכים על התוכנית.',
          x: 'אסור שיותר מ-11 שחקנים יהיו בהאדל של ההתקפה כששעון המהלך רץ (5-2-1). הרדיו בקסדה מתנתק כששעון המהלך מגיע ל-15 שניות או בסנאפ (5-3-3).',
        },
      },
      {
        title: 'פירוק ועמידה בקו',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: null, dlbl: true,
        players: [...o, ...d], routes: [], marks: [],
        bug: { clk: '8:30', pc: 29 },
        ov: [tl(1)],
        l3: { k: 'פרסונל', t: '11 פרסונל מול ניקל', s: '1 RB, 1 TE, 3 WR מול 5 דיפנסיב בקס' },
        notes: {
          p: ['"ברייק!" כולם רצים קלות למקום שלהם. ההתקפה חייבת להיות במערך חוקי.',
            'הפטריוטס: "11 פרסונל" = רץ אחד, טייט אנד אחד, ולכן 3 ווייד רסיברים.',
            'הג\'טס עונים עם "ניקל" (Nickel): דיפנסיב בק חמישי במקום ליינבקר שלישי, כדי לכסות את הרסיבר הנוסף.',
            'כל 11 שחקני ההתקפה חייבים לעמוד במקום ובלי תנועה לפחות שנייה שלמה לפני הסנאפ (7-4-6).'],
          x: 'שתי הספרות = מספר ה-RB ואז ה-TE (ה-WR הם מה שנשאר מתוך 5 שחקני המיומנות). ההגנות מחליפות שחקנים לפי הפרסונל שהן רואות.',
        },
      },
      {
        title: 'מושן לפני הסנאפ',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: null, dlbl: true,
        players: set3, routes: [motion, nbFollow], marks: [],
        bug: { clk: '8:20', pc: 12 },
        ov: [tl(2)],
        l3: { k: 'לפני הסנאפ', t: 'מושן (Motion)', s: 'שחקן אחד יכול לזוז בסנאפ, אף פעם לא לכיוון הקו' },
        notes: {
          p: ['רסיבר הסלוט (H) יוצא למושן לרוחב המערך.',
            'החוק: רק שחקן אחד יכול להיות בתנועה בסנאפ, ואסור שהוא ינוע לכיוון קו המגע\' (7-4-8).',
            'תסתכלו על הניקל בק: הוא רץ איתו לרוחב. זה רמז: כנראה שמירה אישית (Man).',
            'המושן הוא שאלה שההתקפה שואלת את ההגנה לפני הסנאפ.'],
          a: 'מושן הוא צעד הטעיה בריקוד: הוא מראה לכם מי עוקב אחרי מי.',
          x: 'בגלל שרסיבר שנע במקביל לקו בסנאפ הוא חוקי, "ג\'ט מושן" (Jet motion) מאפשר ל-WR לקבל מסירת יד במהירות מלאה. מגנים בשמירה אזורית (Zone) "מעבירים" אחד לשני במקום לרוץ עם המושן.',
        },
      },
      {
        title: 'הסנאפ',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: false, dlbl: true,
        players: play4, routes: [snap],
        marks: [{ id: 'live', type: 'text', x: 40, y: 15.5, t: 'הכדור חי', size: 1.5, c: 'y', delay: 300 }],
        bug: { clk: '8:12', pc: 6, pcRun: true },
        ov: [tl(3)],
        sfx: [{ n: 'hit', at: 200 }],
        l3: { k: 'שעון המהלך :06', t: 'הסנאפ (Snap)', s: 'הסנטר מוסר או זורק את הכדור אחורה: המהלך חי' },
        notes: {
          p: ['הסנטר מעביר את הכדור אחורה לקוורטרבק שעומד בשוטגאן, 5 יארדים מאחור.',
            'הכדור הופך לחי בסנאפ (7-1-1). לפני כן, כל תנועה מעבר לקו היא עבירה.',
            'שימו לב לשעון המהלך: הסנאפ בוצע עם 6 שניות לשמור.'],
          a: 'הסנאפ הוא אקדח הזינוק.',
          x: 'הקוורטרבק שולט בסנאפ עם קדנס ("Blue 80, set, hut") או ספירה שקטה/מחיאת כף באצטדיונים רועשים; שינוי הספירה גורם למגנים לעבור לאופסייד.',
        },
      },
      {
        title: 'המהלך: ריצה פנימית',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: false, dlbl: true,
        players: play5, routes: routes5, marks: [],
        bug: { clk: '8:12', pc: null, pcRun: false },
        ov: [tl(4)],
        sfx: [{ n: 'hit', at: 500 }, { n: 'hit2', at: 1500 }],
        l3: { k: 'מהלך ריצה', t: 'ריצה פנימית · +6', s: 'הנדאוף, החוסמים דוחפים, הרץ מוצא את הפרצה' },
        notes: {
          p: ['מסירת יד לרץ. הקו חוסם את המגנים שמולו; הרסיברים חוסמים בעומק המגרש.',
            'הרץ קורא את החסימות ונכנס לגאפ בין הסנטר לגארד.',
            'הליינבקרים של הג\'טס סוגרים את החור ופוגשים אותו 6 יארדים קדימה.',
            'כל זה לוקח בערך 4 שניות.'],
          x: 'אינסייד זון: הקו צועד יחד לאותו כיוון, החסימות הכפולות עולות לליינבקרים, והרץ קורא את שחקן קו ההגנה הראשון: צד קדמי, קאטבק או החוצה.',
        },
      },
      {
        title: 'השריקה',
        cam: CAM, los: 40, fd: 50, lbl: true, ball: { x: 46, y: +(M - 0.8).toFixed(2) }, dlbl: true,
        players: end6, routes: [],
        marks: [
          { id: 'down-c', type: 'circle', x: 46, y: +(M - 0.8).toFixed(2), r: 2.4, c: 'y', pulse: true },
          { id: 'down-t', type: 'text', x: 46, y: 16, t: 'נפל ממגע (DOWN BY CONTACT)', size: 1.5, c: 'y' },
        ],
        bug: { clk: '8:06' },
        ov: [tl(5)],
        sfx: ['whistle'],
        l3: { k: 'המהלך נגמר', t: 'השריקה', s: 'מגן נגע בו והוא על הקרקע = הכדור מת' },
        notes: {
          p: ['שריקה. המהלך מת.',
            'רץ נחשב "דאון" כשיריב נוגע בו והוא נוגע בקרקע בכל דבר חוץ מידיים או רגליים (7-2-1-a), או כשההתקדמות שלו קדימה נעצרת (7-2-1-b).',
            'ב-NFL, רץ שמחליק בלי שנגעו בו יכול לקום ולהמשיך לרוץ.',
            'שעון המשחק ממשיך לרוץ כי עצרו אותו בתוך המגרש.'],
          a: 'השריקה היא "קפאו": כל מה שקורה אחריה לא נחשב (חוץ מעבירות).',
          x: 'התקדמות קדימה (Forward progress): הכדור מונח איפה שההתקדמות שלו נגמרה, גם אם אחר כך דחפו אותו אחורה (3-12-1).',
        },
      },
      {
        title: 'הנחת הכדור',
        cam: CAM, los: 46, fd: 50, lbl: true, ball: { x: 46, y: +M.toFixed(2) }, dlbl: false,
        players: F.dim(end6, ['RB']), routes: [],
        marks: [
          { id: 'gain', type: 'measure', x1: 40, x2: 46, y: 44, t: '+6' },
          { id: 'spot-t', type: 'text', x: 46, y: 16, t: 'נקודה חדשה · NE 36', size: 1.5, c: 'y' },
        ],
        bug: { clk: '8:01', down: 2, dist: 4, pc: 40, pcRun: true },
        ov: [tl(6)],
        l3: { k: 'הכדור הונח', t: 'דאון שני ו-4 על ה-36 של NE', s: 'הכדור מונח איפה שההתקדמות קדימה נגמרה' },
        notes: {
          p: ['השופט מניח את הכדור איפה שההתקדמות של הרץ נגמרה: קו ה-36 של הפטריוטס.',
            'הקו הכחול זז לקו המגע החדש. הקו הצהוב (קו הפירסט דאון) נשאר במקום, על ה-40.',
            'הסקורבאג מתעדכן: דאון שני, עוד 4. שעון המהלך מתחיל מחדש מ-40.',
            'אם היו עוצרים את הרץ מחוץ להאש מארקס, הכדור היה מוזז פנימה להאש הקרוב.'],
          x: 'קו הפירסט דאון קבוע לכל הסדרה: 10 יארדים מנקודת הסנאפ שפתח אותה (3-8-3).',
        },
      },
      {
        title: 'השרשראות',
        cam: { x: 58, y: 44, w: 44 }, los: 46, fd: 50, lbl: true, ball: { x: 46, y: +M.toFixed(2) },
        players: F.dim(end6, []), routes: [],
        marks: [
          { id: 'ch-l', type: 'line', x1: 40, y1: 54.6, x2: 50, y2: 54.6, c: 'w', w: 0.18 },
          { id: 'ch-r1', type: 'rect', x: 39.8, y: 53.6, w: 0.4, h: 2.2, c: 'o', op: 1, stroke: false },
          { id: 'ch-r2', type: 'rect', x: 49.8, y: 53.6, w: 0.4, h: 2.2, c: 'o', op: 1, stroke: false },
          { id: 'ch-box', type: 'num', x: 46, y: 55, t: '2', c: 'o', r: 0.9 },
          { id: 'ch-m', type: 'measure', x1: 40, x2: 50, y: 51.6, t: '10 יארדים של שרשרת' },
          { id: 'ch-s', type: 'text', x: 39.5, y: 48.3, t: 'תחילת הסדרה (NE 30)', size: 1, anchor: 'end' },
          { id: 'ch-g', type: 'text', x: 50.5, y: 48.3, t: 'קו הפירסט דאון (NE 40)', size: 1, anchor: 'start', c: 'y' },
          { id: 'ch-d', type: 'text', x: 46, y: 48.3, t: 'דאון 2', size: 1, c: 'o' },
        ],
        bug: { clk: '7:58' },
        ov: [tl(7)],
        l3: { k: 'על הקווים', t: 'השרשראות (The Chains)', s: 'שני מוטות, 10 יארדים של שרשרת, וסמן דאון' },
        notes: {
          p: ['על הקווים, צוות השרשרת (בחולצות לבנות) מחזיק שני מוטות שמחוברים בשרשרת של בדיוק 10 יארדים (1-4).',
            'המוט האחורי = איפה שהסדרה הזו התחילה (NE 30). המוט הקדמי = קו הפירסט דאון (NE 40).',
            'המוט השלישי הוא סמן הדאון: הוא מראה "2" ועומד בנקודה הנוכחית של הכדור.',
            'כשזה צמוד, השופטים מביאים את השרשראות למגרש ומודדים. הקו הצהוב בטלוויזיה הוא רק גרפיקה; השרשראות הן הרשמיות.'],
          a: 'השרשראות הן סרגל של 10 יארדים שהשופטים סוחבים לאורך הקווים.',
          x: 'השופט יכול לעצור את השעון למדידה אפשרית (פסק זמן של השופט, 4-5-5-a). תפס על השרשרת בקו של 5 יארדים מאפשר לצוות למקם אותה מחדש במדויק.',
        },
      },
      {
        title: 'המהלך הבא: האדל או קצב מהיר',
        cam: { x: 48, y: 29, w: 96 }, los: 46, fd: 50, lbl: true, ball: { x: 46, y: +M.toFixed(2) }, dlbl: false,
        players: hud9, routes: [], marks: [],
        bug: { clk: '7:50', pc: 32, pcRun: true },
        ov: [tl(0)],
        sfx: ['huddle'],
        l3: { k: 'דאון שני ו-4 · NE 36', t: 'שוב: האדל או קצב מהיר', s: 'בערך 40 שניות אחר כך, הכל מתחיל מחדש' },
        notes: {
          p: ['והמחזור מתחיל מחדש: חוזרים להאדל, 8 יארדים מאחורי הנקודה החדשה.',
            'או מוותרים על ההאדל: התקפת "נו-האדל" (No-huddle) או קצב מהיר (Hurry-up) קוראת את המהלך על הקו, כדי לחסוך זמן או למנוע מההגנה להחליף שחקנים.',
            'משחק NFL הוא הרבה יותר ממאה מחזורים קטנים כאלה; הכדור חי רק בחלק קטן משלוש השעות.',
            'עכשיו אתם מכירים את הקצב. בפרק הבא נסתכל על הלב של המשחק: הדאונים.'],
          x: 'הקצב חשוב: לפני אזהרת שתי הדקות, אם ההתקפה מחליפה שחקנים, האמפייר עומד מעל הכדור עד שההגנה יכולה להחליף בהתאם (5-2-10). נו-האדל עם אותם 11 עוקף את זה ומשאיר מגנים עייפים על המגרש.',
        },
      },
    ],
  });
})(window.FD);
