# Migration Batch 7 — Handoff

*Read alongside `BATCH_3_HANDOFF.md`, `BATCH_4_HANDOFF.md`, `BATCH_5_HANDOFF.md`, `BATCH_6_HANDOFF.md`, `HANDOFF.md`, and `MIGRATION.md`.*

---

## What shipped

`TheRosary` migrated — the largest single component shipped to date in raw line count, and the most stateful in terms of phase-machine depth.

| Component | Source line | Migrated file | Lines | Bytes | Notes |
|---|---|---|---|---|---|
| `TheRosary` | ~10339 | `src/modals/TheRosary.jsx` | 1,113 | 47,940 | Marian SEND. Bundles `ROSARY_PRAYERS` data, the four `MYSTERY_SETS` (each with 5 mysteries × scripture + fruit + scene + meditation), and the `suggestedMysteryKey()` helper. Single file because nothing else uses any of it. |

Plus the supporting infrastructure:

- `src/modals/index.js` — barrel updated; re-exports `TheRosary`
- `src/styles/index.css` — augmentation for rosary styling: `.mystery-set-card` family (with `.suggested` and `.day-tag` modifiers), `.bead`, `.bead-large`, `.bead-strip`, `.mystery-strip-dot` (with `.dot`), `.mystery-scene-card`, `.prayer-text-card` (with `.prayer-words` and `.prayer-emph`)
- `src/App.jsx` — modal harness extended to 10 buttons; counter updated to "10 of 11"

Migration progress on the modal layer: **10 of 11 components.** One remains — `DailyExamen`, the project's largest single component.

## The phase machine

The rosary modal has the deepest state of anything in the codebase. Four levels:

```
phase = intro | opening | mystery | closing
  └── opening:    openingStep 0..4   (5 cards in sequence)
  └── mystery:    mysteryIndex 0..4  (5 mysteries)
       └── subPhase = announce | ourFather | hailMarys | gloryBe | fatima
            └── hailMarys: hailMaryIndex 0..9
```

`advanceMystery()` is a small state machine: announce → ourFather → hailMarys (10 steps) → gloryBe → fatima → next mystery (or closing if the last). `retreatMystery()` walks the inverse — including the special case that going back from the announce of mystery 0 returns to the last opening card. The bead strip lets the user jump to any Hail Mary in the current decade by tapping; the Our Father and Glory Be markers are independently jumpable.

That depth is exactly why the harness now contains a full walk-to-closing test — clicking through every sub-phase of mystery 5 takes 14 advances (announce → ourFather → 10 hailMarys → gloryBe → fatima → closing). The first time I wrote that test it was off by one (got 13). Caught immediately by the harness; fixed. That's the whole reason these tests exist.

## One observation about behavior preserved

The `intention` text input on the intro phase captures who the user is praying for ("family", a name, "all souls"). It lives only as state — the modal **never displays it back during the prayer**. That's intentional design: the act of typing the intention sets it in the user's mind; the prayer is then offered for that intention without further reminder. Documented in the file's header comment so a future contributor doesn't "fix" it by surfacing the text mid-mystery and break the spiritual UX.

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **24 of 24 files passed** (was 23; +1 new modal).

**Gate 2 — `render-check-deep.mjs`:** **62 of 62 tests passed** (was 55; +7 new tests). The new tests:

- `suggestedMysteryKey` returns the correct mystery set for all seven weekdays (Sunday → Glorious, Monday → Joyful, Tuesday → Sorrowful, Wednesday → Glorious, Thursday → Luminous, Friday → Sorrowful, Saturday → Joyful). Tested by walking through a known week starting on a verified Sunday.
- Intro renders all four mystery sets, the suggested-day "Today" badge, and the intention input
- The 5-card opening sequence walks Sign of the Cross → Apostles' Creed → Our Father → 3 Hail Marys → Glory Be, with the correct progress dot count and the "First mystery" CTA on the last card
- Mystery phase renders the scene card with mystery name, scripture, fruit, scene description, and meditation prompt — *and* the bead strip contains exactly 12 button beads (1 OF + 10 hail marys + 1 GB)
- Tapping a specific bead (`aria-label="Hail Mary 7"`) jumps the sub-phase state to `hailMarys` with index 6 (displays as "Hail Mary · 7 of 10")
- Walking through mystery 5's 14 sub-phases reaches the closing phase with "Hail Holy Queen"
- Final Amen on closing fires `onComplete` exactly once

**Gate 3 — Vite production build:** Clean. **1,521 modules transformed** (was 1,520). Bundle:

```
dist/index.html                         2.77 kB │ gzip:  0.98 kB
dist/assets/index-*.css                26.55 kB │ gzip:  5.73 kB
dist/assets/icons-*.js                 18.51 kB │ gzip:  5.45 kB
dist/assets/liturgical-*.js            62.90 kB │ gzip: 19.21 kB    ← lazy
dist/assets/index-*.js                156.92 kB │ gzip: 38.54 kB    ← App + 10 modals
dist/assets/react-vendor-*.js         133.93 kB │ gzip: 43.12 kB
```

First-paint payload (everything except liturgical chunk): **~93 KB gzipped.** Still well under the MIGRATION.md 180 KB target. Index.js grew by 27 KB raw / 7 KB gzipped — the largest single-batch growth so far, reflecting the four full mystery sets with their scenes and meditations. CSS chunk grew by 3 KB gzipped (mostly the bead and mystery-card styling).

## Remaining modal migrations

One modal component still in the monolith:

| Component | Source line | Approx. lines | Notes |
|---|---|---|---|
| `DailyExamen` | 12735 | ~700+ | The Carmelite five-movement structure (Gratitude, Petition, Review, Sorrow, Resolve), each with its own color, suggested duration, scripture verse, and practice type (`gratitude-three`, `breath`, `journal`, `single-resolve`). Bundles `EXAMEN_MOVEMENTS` (5 × full data shape), `GLORY_BE_TEXT`, and `ExamenTimer` helper. |

This is the project's largest single component. Once it's migrated, the modal layer is complete (11 of 11). The remaining work after that is the three tab roots (Gospel, Course, Kingdom) per `MIGRATION.md`.

## Run it

From `kingdom-vite-batch7/`:

```bash
npm install
npm run dev     # http://localhost:5173 — ten harness buttons
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch7/verify
npm install
node parse-check.mjs           # 24 expected
node render-check-deep.mjs     # 62 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch7/` workspace
- `BATCH_7_HANDOFF.md` (this document)

---

*Salus animarum suprema lex.*
