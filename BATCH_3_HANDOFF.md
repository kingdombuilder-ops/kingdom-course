# Migration Batch 3 — Handoff

*This document captures what was done in this conversation. It complements `HANDOFF.md` (the master rolling state) and `MIGRATION.md` (the long-term plan).*

---

## What shipped

Three components migrated from `the_kingdom.jsx` (the 13,631-line monolith) into the Vite scaffold under `src/modals/`:

| Component | Source line | Migrated file | Bytes | Status |
|---|---|---|---|---|
| `AddIntentionModal` | ~9856 | `src/modals/AddIntentionModal.jsx` | 4,678 | ✓ Verified |
| `CloudOfWitnesses` | ~9688 | `src/modals/CloudOfWitnesses.jsx` | 6,119 | ✓ Verified |
| `HousesQuiz` | ~9966 | `src/modals/HousesQuiz.jsx` | 25,969 | ✓ Verified |

Plus the supporting infrastructure:

- `src/modals/index.js` — modals barrel (re-exports for `import { ... } from '@modals'`)
- `src/styles/index.css` — augmented with the missing class definitions and CSS variables (`.ornament`, `.btn-gold`, `.btn-ghost`, `.btn-ghost-dark`, `.saint-card`, `.answer-card`, `.answer-check`, `.progress-dot`, `.result-card`, `.result-icon-disc`, `.score-bar` keyframe; `--paper-3`, `--line-soft`)
- `src/App.jsx` — extended the working demo into a modal harness with state for `houseKey`, `intentions`, and `activeModal`. The original demo is preserved at `src/App.original-demo.jsx` for reference.

Migration progress on the modal layer: **3 of 11 components.**

## What was corrected on migration

One stale string in `the_kingdom.jsx`:

- **Line 10024** of the source reads "Light · Fire · Peace · Glory." That predates two architectural decisions: Earth becoming a co-equal fifth House, and the Franciscan re-label from Peace to Joy. The canonical post-rename litany per `HANDOFF.md` is "Light · Fire · Earth · Joy · Glory." Corrected in the migrated `HousesQuiz.jsx`.
- **Line 9709-10** of the source — the `CloudOfWitnesses` filter chip set used label "Earth" with slug "benedict" (correct), but the filter for slug "peace" was labeled "Joy" already. So that one was right. Verified during migration.

No other content drifted. Behavioral parity with the source is maintained — the same backdrop-click-to-close, same field semantics, same disabled-until-name-present submit logic.

## How it was verified

Two test passes, both green. The harness lives at `/home/claude/verify/`:

**Pass 1 — `parse-check.mjs`:** Every `.js` and `.jsx` file under `kingdom-vite/src` is parsed with `@babel/parser` and JSX plugin. **17 of 17 passed.**

**Pass 2 — `render-check-deep.mjs`:** Mounts each component in jsdom with React 18 and asserts:

- All 22 expected exports are present in the `@data` barrel
- The post-rename House labels are correct (`HOUSES.peace.name === 'Joy'`, `HOUSES.benedict.name === 'Earth'`, both echoed in `HOUSES_HUB`)
- All five Houses present in `HOUSES_HUB`
- `HousesQuiz` intro phase shows the corrected litany
- `HousesQuiz` intro shows all five House preview cards
- `HousesQuiz` transitions intro → questions on Begin click
- `HousesQuiz` reaches result phase after simulating 6 question click-throughs (shows "Your House appears to be", "Save House of …", and "The Full Picture" bar chart)
- Full `App.jsx` mounts without throwing and renders all sections

**32 of 32 tests passed.**

**Pass 3 — Vite production build:** `npx vite build` succeeds. 1,514 modules transformed. Bundle splits as expected:

```
dist/assets/index-*.css            11.42 kB │ gzip:  3.23 kB
dist/assets/icons-*.js             15.64 kB │ gzip:  4.96 kB
dist/assets/index-*.js             52.71 kB │ gzip: 15.86 kB     ← App + 3 modals
dist/assets/liturgical-*.js        62.90 kB │ gzip: 19.21 kB     ← data dictionary
dist/assets/react-vendor-*.js     133.93 kB │ gzip: 43.12 kB
```

First-paint payload (everything except the liturgical chunk, which can be lazy-loaded): **~87 KB gzipped.** The MIGRATION.md target was "under 180 KB gzipped" — comfortably under.

## Remaining modal migrations

Eight modal components still in the monolith. In ascending size order (rough estimate):

| Component | Source line | Approx. lines |
|---|---|---|
| `WorkOfMercy` | 11349 | ~315 |
| `ReachOut` | 11664 | ~108 |
| `AwakenToTheDay` | 11213 | ~136 |
| `DailyExamen` | 12735 | ~700+ |
| `LectioDivina` | 10864 | ~349 |
| `AbideLocator` | 11782 | ~349 |
| `Compline` | 12348 | ~346 |
| `TheRosary` | 10339 | ~477 |

The pattern established here scales: each modal imports its data from `@data`, uses CSS classes from `src/styles/index.css` (any new classes get added there), and exposes `onComplete` / `onClose` props. The modal harness in `App.jsx` adds one more case to the `activeModal` switch.

## Run it

From `kingdom-vite/`:

```bash
npm install     # one-time
npm run dev     # http://localhost:5173 — the modal harness
npm run build   # produces dist/ — Vercel-ready
```

The harness shows three primary buttons at the top of the page; each opens its modal. Persisted via localStorage:
- The discerned house from `HousesQuiz` writes to `kingdom:houseKey`
- Names added through `AddIntentionModal` write to `kingdom:intentions`
- Reload the page to verify they survive

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite/` workspace, ready to install and run
- `BATCH_3_HANDOFF.md` (this document)
- `RENDER_HARNESS.md` — documentation of the verification approach so the next conversation can re-run it

---

*Salus animarum suprema lex.*
