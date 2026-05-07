# Migration Batch 4 — Handoff

*This document captures what was done in this conversation. Read alongside `BATCH_3_HANDOFF.md` (the previous batch), `HANDOFF.md` (the rolling project state), and `MIGRATION.md` (the long-term plan).*

---

## What shipped

Three more modal components migrated from `the_kingdom.jsx` into `src/modals/`:

| Component | Source line | Migrated file | Bytes | Behavior |
|---|---|---|---|---|
| `ReachOut` | ~11664 | `src/modals/ReachOut.jsx` | 6,580 | SEND · Today's apostolic turn. Branches on apostolic vs. relational prompt for Gospel anchor (Matt 28 vs Matt 25). |
| `AwakenToTheDay` | ~11213 | `src/modals/AwakenToTheDay.jsx` | 9,255 | SEE · The morning offering. Today's feast, papal intention, the question to carry. |
| `WorkOfMercy` | ~11349 | `src/modals/WorkOfMercy.jsx` | 17,420 | BUILD · Three circles of charity. 31-act library with two-phase commit (discern → committed). |

Plus the supporting infrastructure:

- `src/modals/index.js` — barrel updated; re-exports the three new modals
- `src/styles/index.css` — augmented with class definitions:
  - `@keyframes breathe` and `.breathe` (slow scale + opacity pulse — used on hero discs in AwakenToTheDay and WorkOfMercy)
  - `.see-section` and `.see-label` (gold-bar framed sections in AwakenToTheDay)
  - `.send-icon-disc` (twilight-purple ring for SEND)
  - `.mercy-card` and its hover/selected/`::before` variants and inner `.mercy-kind` / `.mercy-name` (used in WorkOfMercy's full library view)
- `src/App.jsx` — modal harness extended to 6 buttons; new mount blocks at the bottom; counter updated to "6 of 11"

Migration progress on the modal layer: **6 of 11 components.**

## What was corrected on migration

Two stale references in `AwakenToTheDay`, both detected and fixed during the read-through:

1. **Hardcoded H3 "For migrants and refugees"** (source line 11287). This was correct only for one historical month — the `LITURGICAL_PAPAL_INTENTIONS_2026` data rotates monthly, and each entry's `text` already starts with the recipient ("For workers...", "For families...", etc.). The hardcoded H3 went stale immediately when intentions rotated. **Replaced with `{intention.month} · The Pope's monthly intention`** — accurate every month, lets the intention text speak for itself.

2. **`{intention.issuer}` field reference** (source line 11293). The `papal-intention` data shape is `{ month, text }` — there is no `issuer` field. The reference rendered literally as `undefined · April`. **Removed.**

The deep render harness now contains regression tests for both: it asserts the rendered HTML never contains "For migrants and refugees" and never contains the literal word "undefined". If either reappears, the test fails immediately.

No other content drifted. `ReachOut` and `WorkOfMercy` migrated with full behavioral parity.

## How it was verified

All three gates green, same harness as batch 3.

**Gate 1 — `parse-check.mjs`:** **20 of 20 files passed** (was 17 in batch 3; +3 new modals).

**Gate 2 — `render-check-deep.mjs`:** **42 of 42 tests passed** (was 32 in batch 3; +10 new tests covering the batch 4 modals). The new tests:

- AwakenToTheDay renders with all four sections (feast, intention, question, morning offering)
- AwakenToTheDay does NOT contain "For migrants and refugees" (regression guard)
- AwakenToTheDay does NOT show "undefined" anywhere (regression guard)
- AwakenToTheDay's "The day is offered. Begin." button calls onComplete
- WorkOfMercy renders the discern phase with hero, today's three, and Gospel anchors
- WorkOfMercy's "Show all options" expands to all three circle sections with ≥31 mercy cards
- WorkOfMercy completes a full discern → commit → amen flow and onComplete receives the act
- ReachOut renders with one of the two Gospel anchors (Matt 28 for apostolic, Matt 25 for relational)
- ReachOut's amen button calls onComplete
- App.jsx harness lists 6 of 11 modals with all six button labels visible

**Gate 3 — Vite production build:** Clean. **1,517 modules transformed** (was 1,514 in batch 3). Bundle:

```
dist/index.html                         2.77 kB │ gzip:  0.98 kB
dist/assets/index-*.css                13.18 kB │ gzip:  3.54 kB
dist/assets/icons-*.js                 15.69 kB │ gzip:  4.97 kB
dist/assets/liturgical-*.js            62.90 kB │ gzip: 19.21 kB    ← lazy
dist/assets/index-*.js                 78.11 kB │ gzip: 20.67 kB    ← App + 6 modals
dist/assets/react-vendor-*.js         133.93 kB │ gzip: 43.12 kB
```

First-paint payload (everything except the liturgical chunk): **~86 KB gzipped.** Still well under the MIGRATION.md target of 180 KB.

## Remaining modal migrations

Five modal components still in the monolith:

| Component | Source line | Approx. lines | Notes |
|---|---|---|---|
| `LectioDivina` | 10864 | ~349 | Multi-phase guided prayer; uses `CHURCH_TODAY.readings.gospel`; has a contemplatio timer |
| `AbideLocator` | 11782 | ~349 | Three branches: Mass, Adoration, Spiritual Communion. External handoffs (MassTimes, Google Maps). |
| `Compline` | 12348 | ~346 | Marian antiphon picker by season; silence timer; the day's last prayer |
| `TheRosary` | 10339 | ~477 | Largest. Five mysteries, decade tracking, suggested-mystery-by-day-of-week |
| `DailyExamen` | 12735 | ~700+ | Largest by far. Carmelite five-movement structure with timers and journal fields. Pulls in `ExamenTimer` (12694) as a small helper. |

Plus three section-level helpers that DailyExamen depends on (`ExamenTimer`, `ContemplatioTimer`, `ComplineSilence`) — these are tiny components and will move with their parent modal.

## Other observations from this batch

- The `breathe` animation appears on multiple modals (AwakenToTheDay, WorkOfMercy, soon Compline). Now that it's defined once in `index.css`, future modals get it for free.
- The `.see-section` class is currently AwakenToTheDay-specific but the pattern (small uppercase label + bordered content block) recurs in DailyExamen. Worth checking whether DailyExamen can reuse it during the next batch.
- The harness's `act()` warning ("ReactDOMTestUtils.act is deprecated…") is a non-blocking stylistic note from React 18.3. Migration to `React.act` is a 2-line change if/when the warning becomes annoying.

## Run it

From `kingdom-vite-batch4/`:

```bash
npm install
npm run dev     # http://localhost:5173 — the modal harness, now with 6 buttons
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch4/verify
npm install
node parse-check.mjs           # 20 expected
node render-check-deep.mjs     # 42 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch4/` workspace
- `BATCH_4_HANDOFF.md` (this document)

---

*Salus animarum suprema lex.*
