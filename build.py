"""Bundle src/ into a self-contained English, Hebrew, or bilingual presentation."""
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
LANG_ARG = sys.argv[sys.argv.index("--lang") + 1] if "--lang" in sys.argv else "en"
HE = LANG_ARG == "he"
BILINGUAL = LANG_ARG == "both"
OUT = ROOT / "index.html" if BILINGUAL else ROOT / "dist" / ("football-presentation-he.html" if HE else "football-presentation.html")

if "--assets" in sys.argv:
    raise SystemExit("The original asset source pack is not included. Update the generated data in src/assets.gen.js from approved source assets.")
if not (SRC / "assets.gen.js").exists():
    raise SystemExit("Missing src/assets.gen.js, the checked-in self-contained asset bundle.")

ORDER = [
    "assets.gen.js",
    "engine/core.js", "engine/field.js", "engine/renderer.js", "engine/hud.js", "engine/overlays.js", "engine/app.js",
    "lib/plays.js",
]
COMMON_FILES = [SRC / p for p in ORDER] + sorted((SRC / "widgets").glob("*.js"))
EN_FILES = sorted((SRC / "chapters").glob("ch*.js")) + [SRC / "intros.js", SRC / "glossary-data.js"]
HE_FILES = [SRC / "he/i18n.js"] + sorted((SRC / "he/chapters").glob("ch*.js")) + [SRC / "he/intros.js", SRC / "he/glossary-data.js"]

def source_parts(files):
    parts = []
    for f in files:
        if not f.exists():
            print("MISSING", f); continue
        code = f.read_text(encoding="utf-8")
        if "</script" in code.lower():
            raise SystemExit(f"{f} contains </script>")
        parts.append(f"/* ==== {f.relative_to(SRC).as_posix()} ==== */\n{code}")
    return parts

if BILINGUAL:
    js_files = COMMON_FILES + EN_FILES + HE_FILES
    parts = source_parts(COMMON_FILES) + source_parts(EN_FILES) + ["""
FD.BILINGUAL_DATA = { en: { chapters: FD.clone(FD.CH), glossary: FD.clone(FD.GLOSSARY), i18n: FD.clone(FD.I18N), pos: FD.clone(FD.POS) } };
FD.CH = []; FD.GLOSSARY = []; FD.I18N = {};
"""] + source_parts(HE_FILES) + ["""
FD.BILINGUAL_DATA.he = { chapters: FD.clone(FD.CH), glossary: FD.clone(FD.GLOSSARY), i18n: FD.clone(FD.I18N), pos: FD.clone(FD.POS) };
FD.BILINGUAL = true;
FD.applyLanguage = (lang) => {
  lang = lang === 'he' ? 'he' : 'en';
  const data = FD.BILINGUAL_DATA[lang];
  FD.CH = FD.clone(data.chapters);
  FD.GLOSSARY = FD.clone(data.glossary);
  FD.I18N = FD.clone(data.i18n);
  FD.POS = FD.clone(data.pos);
  FD.LANG = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  document.title = lang === 'he' ? 'מדריך פוטבול — החוקים, האסטרטגיה והסיפורים שמאחורי משחקי ה-NFL' : 'Football Guide — The rules, strategy, and stories behind every NFL game';
  const rtl = document.getElementById('heRtlStyles');
  if (rtl) rtl.media = lang === 'he' ? 'all' : 'not all';
  const badge = FD.$('#badge');
  if (badge) badge.textContent = lang === 'he' ? 'חדר הווידאו · למתקדמים' : 'FILM ROOM · DEEP DIVE';
    if (FD.$('#touchNav')) FD.renderChrome();
    if (document.body.classList.contains('presenter')) {
        const header = FD.$('#pv header b'), reset = FD.$('#pvReset'), next = FD.$('.pv-lbl');
        if (header) header.textContent = FD.T('Presenter view');
        if (reset) reset.textContent = FD.T('reset timer');
        if (next) next.textContent = FD.T('NEXT');
        const labels = { prev: '◀ Back', next: 'Next ▶', chUp: '▲ Chapter', chDown: '▼ Chapter', deep: 'D Film Room', replay: 'R Replay' };
        FD.$$('.pv-ctl button').forEach((button) => { button.textContent = FD.T(labels[button.dataset.c] || ''); });
    }
};
FD.setLanguage = (lang) => {
    lang = lang === 'he' ? 'he' : 'en';
    if (lang === FD.LANG) return;
    const current = FD.cur || FD.STEPS[FD.idx];
    const chapter = current ? current._c : 0, step = current ? current._s : 0;
    if (FD.mode === 'live') {
        FD.$('#menu')?.classList.remove('on');
        FD.closeGlossary && FD.closeGlossary();
        FD.closeCard && FD.closeCard();
        if (FD._wid) {
            try { FD._wid.api && FD._wid.api.unmount(); } catch (e) { console.error(e); }
            FD.$('#wl').innerHTML = ''; FD._wid = null; FD.$('#stage').classList.remove('cards-on');
        }
    }
    FD.applyLanguage(lang);
    FD.store.set('fd-bilingual-lang', lang);
    try { const url = new URL(location.href); url.searchParams.set('lang', lang); history.replaceState(null, '', url.href); } catch (e) {}
    FD.resolve();
    const index = FD.STEPS.findIndex((s) => s._c === chapter && s._s === step);
    if (FD.mode === 'presenter') { FD.idx = index >= 0 ? index : 0; FD.presenterShow && FD.presenterShow(FD.idx, FD.skipDeep); return; }
    FD.goto(index >= 0 ? index : 0, { instant: true, forward: false });
};
FD.switchLanguage = () => FD.setLanguage(FD.LANG === 'he' ? 'en' : 'he');
let savedLanguage = FD.store.get('fd-bilingual-lang');
const requestedLanguage = new URLSearchParams(location.search).get('lang');
FD.applyLanguage(requestedLanguage || savedLanguage || 'en');
"""]
elif HE:
    js_files = COMMON_FILES + HE_FILES
    parts = source_parts(js_files)
else:
    js_files = COMMON_FILES + EN_FILES
    parts = source_parts(js_files)

css = (SRC / "styles.css").read_text(encoding="utf-8")
if HE:
    css += "\n" + (SRC / "he/rtl.css").read_text(encoding="utf-8")
RTL_STYLE = ""
if BILINGUAL:
    rtl_css = (SRC / "he/rtl.css").read_text(encoding="utf-8")
    RTL_STYLE = f'<style id="heRtlStyles" media="not all">\n{rtl_css}\n</style>'

LANG_ATTR = 'lang="he" dir="rtl"' if HE else 'lang="en"'
TITLE = "מדריך פוטבול — החוקים, האסטרטגיה והסיפורים שמאחורי משחקי ה-NFL" if HE else "Football Guide / מדריך פוטבול" if BILINGUAL else "Football Guide — The rules, strategy, and stories behind every NFL game"
FONTS = "&family=Heebo:wght@400;500;600;700;800;900&family=Secular+One" if HE or BILINGUAL else ""
BADGE = "חדר הווידאו · למתקדמים" if HE else "FILM ROOM · DEEP DIVE"

html = f"""<!DOCTYPE html>
<html {LANG_ATTR}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{TITLE}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&family=Oswald:wght@500;600;700{FONTS}&display=swap" rel="stylesheet">
<style>
{css}
</style>
{RTL_STYLE}
</head>
<body>
<div id="stage">
  <div id="photo"></div>
  <svg id="field" xmlns="http://www.w3.org/2000/svg" aria-label="Football field"></svg>
  <div id="ov"></div>
  <div id="wl"></div>
  <div id="hud">
    <div id="bug"></div>
    <div id="l3" class="l3"></div>
    <div id="tags"></div>
    <div id="badge">{BADGE}</div>
    <div id="counter"></div>
  </div>
  <canvas id="tele"></canvas>
</div>
<div id="menu"></div>
<div id="gloss"></div>
<div id="toast"></div>
<script>
{chr(10).join(parts)}
</script>
</body>
</html>
"""
OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open("w", encoding="utf-8", newline="\n") as output:
    output.write(html)
print(f"wrote {OUT} ({OUT.stat().st_size / 1024 / 1024:.2f} MB, {len(js_files)} js files)")
