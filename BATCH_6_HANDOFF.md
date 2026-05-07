# Migration Batch 6 — Handoff

*Read alongside `BATCH_3_HANDOFF.md`, `BATCH_4_HANDOFF.md`, `BATCH_5_HANDOFF.md`, `HANDOFF.md`, and `MIGRATION.md`.*

---

## What shipped

One modal — the largest single migration so far in terms of co-located data:

| Component | Source line | Migrated file | Bytes | Notes |
|---|---|---|---|---|
| `Compline` | ~12348 | `src/modals/Compline.jsx` | 32,894 | The Night Office. Bundles `MARIAN_ANTIPHONS` data, `todaysMarianAntiphon()` resolver, the 11-element `COMPLINE_SECTIONS` array, and the `ComplineSilence` helper. Single file because nothing else uses any of these. |

Plus the supporting infrastructure:

- `src/modals/index.js` — barrel updated; re-exports `Compline`
- `src/styles/index.css` — augmentation for night-office styling: `.night-bg` (deeper-than-ink palette with three soft purple/blue ambient highlights), `.compline-section` family (`.compline-label`, `.compline-title`, `.compline-prayer`, `.compline-prayer .versicle`, `.compline-rubric`), `.compline-silence`, `@keyframes nightBreathe`, `.night-breathe`, `.compline-progress` and `.compline-progress-dot`, `.compline-blessing`, `.marian-antiphon-card`, `.compline-examination-input`
- `src/App.jsx` — modal harness extended to 9 buttons; counter updated to "9 of 11"

Migration progress on the modal layer: **9 of 11 components.** Two remain — `TheRosary` and `DailyExamen`, the largest of the project.

## Two structural improvements made during migration

### 1. `MARIAN_ANTIPHONS` declared before `todaysMarianAntiphon()`

The source declared the constant *after* the function that uses it (line 12150 vs line 12131). This works at runtime — function declarations are hoisted; the function body only executes when called, by which time module init has populated the `const`. But it reads as fragile and confused new readers. **Reordered: data first, function second.** Behaviorally identical.

### 2. Easter date band documented as provisional

The source bands the Easter season as `(month === 4 && day >= 5) || (month === 5 && day <= 24)` — literally correct for 2026 (Easter April 5; Pentecost May 24) but silently wrong every other year. The source comment said "approximations are fine for the first build — production should use a full liturgical calendar." Migration kept the behavior but **expanded the comment to explicitly name the dependency** and point to where the proper fix belongs (`src/data/liturgical.js`, which already encodes the year's feasts). The function is also now `export`ed so the verification harness can test it directly without rendering — and so a future caller can replace it with a date-lookup version.

No theological or behavioral content changed.

## Notable design preserved

The source's `<v>...</v>` and `<em>...</em>` sentinels inside prayer strings are *not* HTML — they're parsed by an inline `renderPrayerHTML(text)` helper into typed React spans. This avoids `dangerouslySetInnerHTML` while keeping the prayer text human-readable in source. The harness now contains an explicit regression test that asserts the `<v>` literal never appears in the rendered DOM and that the `.versicle` class is correctly applied. If anyone "simplifies" the parser to a `dangerouslySetInnerHTML` shortcut, the test fails immediately.

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **23 of 23 files passed** (was 22; +1 new modal).

**Gate 2 — `render-check-deep.mjs`:** **55 of 55 tests passed** (was 50; +5 new tests). The new tests:

- `todaysMarianAntiphon` returns the correct antiphon for each of four season bands (verified at six specific dates spanning Easter, Advent, Christmas, January, February, Lent, Ordinary Time)
- Compline intro renders with Moon hero, antiphon preview, and Begin button
- Compline transitions to liturgy phase and renders all 11 sections (verified by checking each section's label appears, plus the blessing text and the final Marian antiphon footer)
- `<v>℣.</v>` versicle sentinels render as `.versicle` styled spans, not as escaped HTML or raw markup (regression guard)
- Final "Amen · Sleep in peace" button fires `onComplete` exactly once

**Gate 3 — Vite production build:** Clean. **1,520 modules transformed** (was 1,519). Bundle:

```
dist/index.html                         2.77 kB │ gzip:  0.98 kB
dist/assets/index-*.css                23.43 kB │ gzip:  5.32 kB
dist/assets/icons-*.js                 18.51 kB │ gzip:  5.45 kB
dist/assets/liturgical-*.js            62.90 kB │ gzip: 19.21 kB    ← lazy
dist/assets/index-*.js                129.86 kB │ gzip: 31.60 kB    ← App + 9 modals
dist/assets/react-vendor-*.js         133.93 kB │ gzip: 43.12 kB
```

First-paint payload (everything except liturgical chunk): **~85 KB gzipped.** Still well under the MIGRATION.md 180 KB target. Index.js grew by 19 KB raw / 5 KB gzipped — the most of any single batch so far, reflecting the large amount of liturgical text Compline carries in its `COMPLINE_SECTIONS` array.

## Remaining modal migrations

Two modal components still in the monolith:

| Component | Source line | Approx. lines | Notes |
|---|---|---|---|
| `TheRosary` | 10339 | ~477 | Five mysteries × decade tracking × suggested-mystery-by-day-of-week. Bundles `MYSTERY_SETS`, `ROSARY_PRAYERS`, `suggestedMysteryKey()`. |
| `DailyExamen` | 12735 | ~700+ | Largest. Carmelite five-movement structure with timers and journal fields. Bundles `EXAMEN_MOVEMENTS`, `GLORY_BE_TEXT`, `ExamenTimer`. |

These are the two largest remaining components. Together with this Compline batch, they form the trilogy of guided prayers — the most reverent and most stateful pieces in the modal layer.

## Run it

From `kingdom-vite-batch6/`:

```bash
npm install
npm run dev     # http://localhost:5173 — nine harness buttons
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch6/verify
npm install
node parse-check.mjs           # 23 expected
node render-check-deep.mjs     # 55 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch6/` workspace
- `BATCH_6_HANDOFF.md` (this document)

---

*Salus animarum suprema lex.*
