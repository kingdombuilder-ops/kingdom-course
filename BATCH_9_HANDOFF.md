# Migration Batch 9 — Handoff

*Read alongside `BATCH_3_HANDOFF.md` through `BATCH_8_HANDOFF.md`, `HANDOFF.md`, and `MIGRATION.md`.*

---

## What shipped

The Hub-body components for the Kingdom tab. Modal layer complete in batch 8; tab roots begin here. Three batches will cover Kingdom: this one (Hub body), batch 10 ("More" grid + modal wiring), batch 11 (Field Guide views).

| Component | Source line | File | Lines | Notes |
|---|---|---|---|---|
| `CopyButton` | ~8986 | `src/shared/CopyButton.jsx` | 60 | Used by GO essential's "Copy Gospel" / "Copy invitation". Lives in @shared because the Course tab will need it too. |
| `HubHero` | ~8551 | `src/components/HubHero.jsx` | 87 | Brand strip + house ribbon. The visual greeting on every Hub load. |
| `PracticeRow` | ~8778 | `src/components/PracticeRow.jsx` | 145 | Single-line tappable practice row. Not used in batch 9 yet — pre-staged for FieldGuideHub in batch 11. |
| `EssentialBlock` | ~9019 | `src/components/EssentialBlock.jsx` | 165 | Wraps each of the seven essentials with consistent header + CTA. |
| `SevenEssentials` | ~9115 | `src/components/SevenEssentials.jsx` | 1,096 | Hub body. MiniPath strip + 7 EssentialBlocks (each with its own inline content sub-component) + architectural tagline + Compline footer. |
| `KingdomHubView` | (composed) | `src/components/KingdomHubView.jsx` | 47 | Thin wrapper composing HubHero + SevenEssentials. |
| `components/index.js` | n/a | `src/components/index.js` | barrel | Re-exports the new layer. |

Plus infrastructure:
- `@components` alias added to `vite.config.js`, `verify/render-check.mjs`, `verify/render-check-deep.mjs`
- `App.jsx` refactored to extract harness body into a `HarnessShell` sub-component, with toggle button for "Live Hub preview" mode that mounts `KingdomHubView` directly
- Modal mounts hoisted to `App` level (single mount, not duplicated between App and HarnessShell)
- App's `CloudOfWitnesses` mount now uses the correct wrap-with-close pattern (component takes no props, must wrap with chrome)

Total batch 9: ~1,750 lines of carefully-migrated component code across 7 new files.

## Implementation notes

### Why split Kingdom into three batches

Kingdom tab in source covers ~1,200 lines: HubHero (31), PracticeCardHorizontal (43), PracticeRow (77), EssentialBlock (96), SevenEssentials (493), the inline "More" grid in TheKingdom (~210), FieldGuideHub (100), PracticeGuide (127). One batch each would have made batch 9 alone larger than DailyExamen + TheRosary combined. The three-batch split keeps each unit reviewable.

### Architecture

```
KingdomHubView                   ← thin composition (batch 9)
├── HubHero                      ← brand strip + house ribbon (batch 9)
├── SevenEssentials              ← Hub body (batch 9)
│   ├── MiniPath                 ← inline; 7 medallions, 3-1-3 rhythm
│   ├── EssentialBlock × 7       ← (batch 9; reused below)
│   │   ├── SeeContent           ← inline (today's saint + Gospel + papal intention)
│   │   ├── KnowContent          ← inline (Gospel text + 4 lectio prompts)
│   │   ├── HealContent          ← inline (5 Carmelite movements)
│   │   ├── AbideContent         ← inline (Franciscan altar + Spiritual Communion)
│   │   ├── GoContent            ← inline (today's act + 2 CopyButtons)
│   │   ├── BuildContent         ← inline (3 modes preview)
│   │   └── SendContent          ← inline (Mary/Rosary universal)
│   └── Compline footer          ← evening-only (>= 8pm or < 4am)
└── (KingdomMoreGrid)            ← stub; lands batch 10
```

### Why HubHero's house ribbon button has no onClick

Source defines the ribbon as a `<button>` element with a click target but no `onClick`. It's a visual badge. When the Houses-detail screen lands (post-tab-roots), this is where its onClick will hang. Preserved as-is — comment in `HubHero.jsx` flags it.

### CopyButton in @shared, not @components

`CopyButton` is a generic UI primitive (not a Hub-specific composition). Course-tab "Sending" views and any future share-sheet surfaces will want it too. So it lives in `@shared` alongside `utils.js` and `storage.js`, not `@components`.

### App.jsx refactor — what changed and why

Before this batch, `App.jsx` was a single big return that interleaved harness body + modal mounts. Adding the Hub preview meant we needed two top-level shells (harness + hub) that share the same modal mounts. The clean shape:

```jsx
function App() {
  // ... state, including showHubPreview ...
  return (
    <>
      <ToggleButton />
      {showHubPreview ? <KingdomHubView ... /> : <HarnessShell ... />}
      {/* All 11 modal mounts, hoisted here, accessible from both views */}
    </>
  );
}
function HarnessShell({ ...props }) { /* original harness body, no modal mounts */ }
```

This ensures modals never double-mount, the harness still works for verifying individual modals, and the Hub view actually renders the migrated components for visual inspection.

### KingdomMoreGrid intentionally deferred to batch 10

The "More" grid (Your House · Field Guide · Intentions · Cloud of Witnesses · Academy) is ~200 lines of inline JSX in source. It needs modal wiring (HousesQuiz, AddIntentionModal, CloudOfWitnesses), navigation hooks (Field Guide → batch 11), and intention count logic. Cleaner to do as a single focused migration in batch 10 rather than half-migrating it in batch 9 alongside SevenEssentials. The `KingdomHubView` wrapper has a comment placeholder where the grid will hang.

### What's NOT in batch 9 — explicit list

- "More" grid (Your House / Field Guide / Intentions / Cloud of Witnesses / Academy cards) — batch 10
- Modal wiring from the Hub UI — batch 10
- `KingdomTabNav` (the tab bar at the top) — needs Course/Gospel tabs first
- `Footer` component — comes when tab navigation lands
- `Companion` AI chat — separate concern, post-tab-roots
- `goToFieldGuide`, `goToPractice`, `goToHub` navigation handlers — batch 11
- `FieldGuideHub`, `PracticeGuide`, `PracticeCardHorizontal` — batch 11

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **32 of 32 files passed** (was 25; +7 new files).

**Gate 2 — `render-check-deep.mjs`:** **81 of 81 tests passed** (was 69; +12 new tests).

The new batch 9 tests:
- `CopyButton` renders with default label
- `HubHero` without houseKey renders no ribbon
- `HubHero` with houseKey renders the ribbon with the right House name, patron, and tradition
- `PracticeRow` renders verb/practice/duration and fires `onStart` on click
- `PracticeRow` with `isComplete=true` shows "Done" instead of duration
- `EssentialBlock` renders with practice info and the "Begin" CTA fires `onStart` on click
- `EssentialBlock` with `isAltar=true` shows "fons et culmen" tag and "Find Mass" CTA wording
- `SevenEssentials` renders all 7 verbs (SEE/KNOW/HEAL/ABIDE/GO/BUILD/SEND) with their unique content sections (Carmelite five movements, Franciscan altar, Ignatian going forth, three BUILD modes, Mary universal)
- `SevenEssentials` with `completedToday=[1,4]` produces ≥2 "Done" labels
- `SevenEssentials` `onPracticeStart` fires with the correct essential number when ABIDE's CTA (the 4th) is clicked
- `KingdomHubView` composition renders both HubHero title and SevenEssentials MiniPath
- `App` includes the new "Live Hub preview" toggle button

**Gate 3 — Vite production build:** Clean. **1,529 modules transformed** (was 1,522). Bundle:

```
dist/index.html                         2.77 kB │ gzip:  0.98 kB
dist/assets/index-*.css                27.91 kB │ gzip:  5.92 kB
dist/assets/icons-*.js                 20.03 kB │ gzip:  5.83 kB    ← +0.93 KB (new icons)
dist/assets/liturgical-*.js            62.90 kB │ gzip: 19.21 kB    ← lazy
dist/assets/react-vendor-*.js         133.93 kB │ gzip: 43.13 kB
dist/assets/index-*.js                197.42 kB │ gzip: 46.29 kB    ← +22.6 KB raw / +4.5 KB gzip
```

First-paint payload (everything except liturgical chunk): **~101 KB gzipped.** Still well under the MIGRATION.md 180 KB target. The +4.5 KB gzip increase reflects the seven new content sub-components and the MiniPath inside SevenEssentials.

## What it looks like to use

1. `cd kingdom-vite-batch9/ && npm install && npm run dev`
2. http://localhost:5173 opens the existing modal harness
3. **Top-right corner:** "Live Hub preview ▶" button — click to toggle
4. The page becomes the actual Kingdom Hub: HubHero brand strip + all seven essentials with their inline content
5. Each essential's "Begin" button opens the corresponding modal
6. ABIDE's "Find Mass · Adoration" CTA opens AbideLocator
7. The MiniPath dots at the top scroll-jump to each EssentialBlock below
8. After 8pm, a Compline footer appears at the bottom of the seven
9. "◀ Back to harness" returns to the modal-test shell

## Recommended next step

Visual inspection in the dev server is the natural checkpoint here. The unit harness verifies content is in the DOM; the dev server is what tells you whether the typography reads right, whether the MiniPath rhythm feels balanced, whether the Franciscan altar quote sits well, whether the CopyButton looks right next to the Gospel verse. **This is the first batch where you can actually see the app's main page.** Worth the click-through.

If anything looks off, batch 10 is the place to fix it — the "More" grid migration will require touching `KingdomHubView` again anyway. After batch 10 the Hub is functionally complete; batch 11 finishes the Field Guide; then Course tab; then Gospel.

## Run it

From `kingdom-vite-batch9/`:

```bash
npm install
npm run dev     # http://localhost:5173 — toggle "Live Hub preview" top-right
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch9/verify
npm install
node parse-check.mjs           # 32 expected
node render-check-deep.mjs     # 81 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch9/` workspace
- `BATCH_9_HANDOFF.md` (this document)

---

*Salus animarum suprema lex. The Hub body lives.*
