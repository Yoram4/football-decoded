# Hebrew translation guide — "Football, Decoded" (עברית)

Audience: Israeli beginners → casual fans. Presenter voice, plural "אתם", modern sports Hebrew (like ynet / ספורט 5 / ויקיפדיה). No nikud.
Rule from the client: **football concept names stay in English or in Hebrew transliteration** (e.g. טאצ'דאון). Don't invent literal Hebrew calques for core terms. On the FIRST appearance of a core term in a chapter's on-screen text you may add the English in parentheses: "טאצ'דאון (Touchdown)". Notes can use either form naturally.

## What stays exactly as-is (English)
- Team abbreviations and everything in the score bug: NE, NYJ, "1ST & 10", "4TH", clocks.
- Position abbreviations on the field: QB, RB, WR, TE, C, G, T, DE, DT, LB, CB, S, NB, K, P, X, Z, H, Y.
- Route names on the field (SLANT, POST, CORNER, GO, HITCH…), concept names (SMASH, MESH), coverage names (Cover 1/2/3, MOFO/MOFC), RPO, "AFC East" etc. division names, rule references (4-8-2-c), TV network names, NFL, Super Bowl numerals (LX).
- Code, ids, numbers, coordinates, colors, keys, asset keys — NEVER change anything except human-readable strings.

## Term sheet (use consistently)
| English | Hebrew to use |
|---|---|
| football | פוטבול |
| touchdown | טאצ'דאון |
| field goal | פילד גול (שער שדה) |
| extra point / PAT / try | אקסטרה פוינט / ניסיון הנקודה הנוספת (Try) |
| two-point conversion | ניסיון ל-2 נקודות (2-Point) |
| safety (score) | סייפטי |
| down / downs | דאון / דאונים (or "ניסיון" in plain-language explanations) |
| 1st & 10 (in sentences) | "דאון ראשון ו-10" (1st & 10) |
| first down | פירסט דאון |
| yard(s) | יארד / יארדים |
| line of scrimmage | קו הסקרימג' (קו המגע) |
| line to gain / yellow line | קו הפירסט דאון (הקו הצהוב) |
| end zone | אנד זון |
| goal line | קו הגול |
| red zone | הרד זון (האזור האדום) |
| hash marks | ההאש מארקס |
| sideline / out of bounds | קו הצד / מחוץ לגבולות |
| snap / huddle / audible | סנאפ / האדל / אודיבל |
| drive | דרייב |
| possession | החזקה בכדור |
| offense / defense / special teams | התקפה / הגנה / ספיישל טימס |
| quarterback | קוורטרבק |
| running back / fullback | ראנינג בק / פולבק |
| wide receiver / tight end | ווייד רסיבר (תופס) / טייט אנד |
| offensive line / center / guard / tackle | קו ההתקפה / סנטר / גארד / טאקל |
| defensive line / end / tackle / nose tackle | קו ההגנה / דיפנסיב אנד / דיפנסיב טאקל / נוז טאקל |
| linebacker | ליינבקר |
| cornerback / safety (player) / nickel | קורנרבק / סייפטי / ניקל |
| kicker / punter / long snapper / returner | קיקר / פאנטר / לונג סנאפר / מחזיר בעיטות |
| sack / interception / fumble | סאק / אינטרספשן (חטיפה) / פאמבל |
| turnover / turnover on downs | טרנאובר (איבוד כדור) / טרנאובר און דאונס |
| punt / kickoff / onside kick | פאנט / קיקאוף / און-סייד קיק |
| touchback / fair catch | טאצ'באק / פייר קאץ' |
| penalty / flag | עבירה (עונש) / דגל |
| holding, false start, offside, pass interference, roughing the passer, facemask, delay of game, intentional grounding | הולדינג, פולס סטארט, אופסייד, פאס אינטרפרנס, ראפינג דה פאסר, פייסמאסק, דיליי אוף גיים, אינטנשונל גראונדינג |
| unsportsmanlike conduct | התנהגות לא ספורטיבית |
| coverage / man / zone | כיסוי / שמירה אישית (Man) / שמירה אזורית (Zone) |
| blitz / play-action / pocket | בליץ / פליי-אקשן / פוקט (הכיס) |
| route / route tree | מסלול (ראוט) / עץ המסלולים (Route Tree) |
| quarter / halftime / overtime | רבע / מחצית / הארכה |
| game clock / play clock | שעון המשחק / שעון המהלך (Play Clock) |
| timeout / two-minute warning | פסק זמן / אזהרת שתי הדקות |
| conference / division | קונפרנס / דיוויז'ן |
| playoffs / wild card / bye | פלייאוף / ווילד קארד / ביי (שבוע מנוחה) |
| Super Bowl / draft / salary cap / free agency | סופרבול / דראפט / תקרת שכר / פרי אייג'נסי |
| referee / officials | רפרי (השופט הראשי) / שופטים |
| play (a single play) | מהלך |
| Patriots / Jets / Bills / Dolphins / Seahawks | פטריוטס / ג'טס / בילס / דולפינס / סיהוקס (full: ניו אינגלנד פטריוטס, ניו יורק ג'טס) |
| Gillette Stadium, Foxborough | אצטדיון ג'ילט, פוקסבורו |

## Tag prefixes (the engine colors tags by prefix)
- `NEW RULE…` → `חוק חדש…` (e.g. "חוק חדש (2025): טאצ'באק ל-35")
- `COLLEGE: …` → `מכללות: …`
- `VERIFY: …` → `לאימות: …`

## Field/SVG labels (marks `t`, route `lbl`, zone `lbl`)
Short. Hebrew is fine; keep English football words in English if they are concept names (e.g. "DEEP ½" may become "עמוק ½"; "SLANT" stays). Keep under ~28 characters.

## Lower-third limits
`l3.t` ≤ 32 chars, `l3.s` ≤ 70 chars (Hebrew is usually shorter — good).
