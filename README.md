# Football, Decoded

A single-file, bilingual NFL field guide for New England Patriots fans. The checked-in `index.html` is the self-contained GitHub Pages and offline-sharing build; editable source lives in `src/`.

## Build

Requires Python 3.10+ and Node.js 18+ for validation. No package installation is needed.

```sh
python build.py --lang both
```

This regenerates the root `index.html`. `python build.py --lang en` and `python build.py --lang he` create single-language builds under `dist/`.

## Validate

```sh
node tests/check_chapter.js src/chapters/ch*.js src/he/chapters/ch*.js
```

The GitHub Actions workflow runs the chapter checks and verifies that the generated `index.html` is up to date.

## Source layout

- `src/engine/`: rendering, navigation, HUD, and overlays
- `src/chapters/` and `src/he/chapters/`: English and Hebrew slide data
- `src/widgets/`, `src/lib/`: interactive widgets and play-building helpers
- `src/assets.gen.js`: checked-in, generated data-URI assets used to keep the final deck self-contained
- `tests/`: chapter schema validation
- `docs/`: authoring contract, content plan, rules ledger, terminology, and asset notes

The original asset source pack is not included. Normal builds use the committed `src/assets.gen.js`; see `docs/ASSETS.md` before replacing or regenerating embedded assets.