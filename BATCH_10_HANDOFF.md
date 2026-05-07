# Migration Batch 10 — Handoff

*Read alongside `BATCH_3_HANDOFF.md` through `BATCH_9_HANDOFF.md`, `HANDOFF.md`, and `MIGRATION.md`.*

---

## What shipped

The "More" grid — the five secondary cards beneath the Seven Essentials on the Kingdom Hub — plus the modal wiring from the Hub UI itself. With this batch, the Hub view is **functionally complete**: every card and CTA you can see opens its corresponding modal correctly.

| Component | Source line | File | Lines | Notes |
|---|---|---|---|---|
| `KingdomMoreGrid` | ~13345 | `src/components/KingdomMoreGrid.jsx` | 384 | Five cards: Your House (full-width when discerned, with daily saint quote) · Field Guide · Intentions (count + preview) · Cloud of Witnesses · Academy (locked). |
| `KingdomHubView` (rewritten) | (composed) | `src/components/KingdomHubView.jsx` | 67 | Now composes the full page: HubHero + SevenEssentials + KingdomMoreGrid. Receives + threads the new MoreGrid props. |

Plus infrastructure:
- `App.jsx` — `KingdomHubView` mount block extended to pass through `intentions`, `onOpenHouseQuiz`, `onOpenIntention`, `onOpenWitnesses`, `onGoToFieldGuide`. Each maps cleanly to the existing `setActiveModal(...)` pattern; the field-guide handler is a logged stub that ships in batch 11.
- `src/components/index.js` — barrel exports `KingdomMoreGrid`.

Total batch 10: **451 lines** of new component code + handler wiring.

## Implementation notes

### Why the Your House card has a dynamic gridColumn span

When `houseKey` is null, the card sits in the auto-fitting grid alongside the other four. When the user has discerned a House, the card grows to span both columns (`gridColumn: '1 / -1'`) — because at that point it carries today's rotating saint quote, and the saint quote earns the visual weight. Source's idea, preserved verbatim. The harness verifies both states.

### Daily saint quote rotation

`HOUSE_QUOTES[houseKey]` is an array of 7 quotes per House. `TODAY_HOUSE_QUOTE_INDEX` is `(new Date()).getDate() % 7` — so quotes rotate weekly within the month. The component falls back to `[0]` if the index is out of range (defensive; shouldn't happen with well-formed data, but the fallback is in source). Tested: with a known house slug, the harness asserts that today's quote text + saint attribution both render.

### Intentions preview shape — defensive

The Intentions card preview joins the first two intentions with `·` and adds `+N more` for the rest. The original source path was `it.text || it` — which assumes intentions are either strings (legacy) or objects with `.text`. But our `AddIntentionModal` actually emits `{ id, who, what }`. To handle both shapes without breaking either, the component now uses:

```js
intentions.slice(0, 2)
  .map((it) => typeof it === 'string' ? it : (it.who || it.what || it.text || ''))
  .filter(Boolean)
  .join(' · ')
```

This tries `who` first (the most distinguishing field), falls back to `what`, then `text`, then drops empty strings. The harness test seeds intentions with the canonical `{id, who, what}` shape and verifies "Maria · Daniel · +2 more" renders correctly.

### Academy is intentionally not a `<button>`

The four interactive cards are `<button>` elements. The Academy card is a plain `<div>` — locked, visible, no click handler. The harness's "Academy card is visually present but not a button" test fails if anyone accidentally upgrades it to a button (which would imply navigability that isn't there yet).

### App.jsx: how the modal wiring connects

Every MoreGrid card maps to the same `setActiveModal('...')` pattern that the modal-test harness uses. The modal mounts (already hoisted to App level in batch 9) catch the same activeModal slug and render. So clicking "Your House" in the live Hub preview opens the same `HousesQuiz` instance that the harness button at the top opens — one mount, two entry points.

Field Guide is a stub for now: `console.log('[batch 11 stub] Field Guide navigation will land in batch 11')`. The card is clickable so QA can confirm the wiring path; it just doesn't navigate anywhere yet.

### What's NOT in batch 10

- `kingdomView` routing state (`hub` | `practices` | `practice`) — batch 11
- `goToFieldGuide` / `goToPractice` / `goToHub` navigation handlers — batch 11
- `FieldGuideHub`, `PracticeGuide`, `PracticeCardHorizontal` — batch 11
- Course tab and Gospel tab roots — later batches

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **33 of 33 files passed** (was 32; +1 new file).

**Gate 2 — `render-check-deep.mjs`:** **87 of 87 tests passed** (was 81; +6 new + 1 expanded).

The new batch 10 tests:
- `KingdomMoreGrid` with no houseKey shows the "Take the discernment" prompt, the post-rename `Light · Fire · Earth · Joy · Glory` litany, and does *not* leak any "House of …" copy
- `KingdomMoreGrid` with a houseKey renders the right "House of {Name}" header, today's actual rotating quote text, and its saint attribution — verified against the data layer's own `HOUSE_QUOTES[slug][TODAY_HOUSE_QUOTE_INDEX]`
- `KingdomMoreGrid` Intentions card with empty list shows "Carry someone in prayer" and "Add your first" CTA
- `KingdomMoreGrid` Intentions card with 4 intentions of canonical `{id, who, what}` shape shows "4 held in prayer", previews "Maria" and "Daniel" (the first two `who`s), shows "+2 more" overflow indicator, and CTA flips to "Add another"
- `KingdomMoreGrid` card click handlers fire each on the right card — four separate counters verify that clicking Your House fires only `onOpenHouseQuiz`, Field Guide fires only `onGoToFieldGuide`, etc. No cross-firing
- `KingdomMoreGrid` Academy card is visually present (text + "After the fifty days" copy) but is *not* a `<button>` element — guards against accidental interactivity upgrade
- `KingdomHubView` composition test expanded: now also asserts the More grid section renders all five card headers (Your House, The Field Guide, Intentions, Cloud of Witnesses, The Academy)

**Gate 3 — Vite production build:** Clean. **1,530 modules transformed** (was 1,529). Bundle:

```
dist/index.html                         2.77 kB │ gzip:  0.98 kB
dist/assets/index-*.css                27.91 kB │ gzip:  5.92 kB
dist/assets/icons-*.js                 20.36 kB │ gzip:  5.89 kB
dist/assets/liturgical-*.js            62.90 kB │ gzip: 19.21 kB    ← lazy
dist/assets/react-vendor-*.js         133.93 kB │ gzip: 43.13 kB
dist/assets/index-*.js                205.23 kB │ gzip: 47.49 kB    ← +7.81 KB raw / +1.20 KB gzip
```

First-paint payload (everything except liturgical chunk): **~103 KB gzipped.** Still well under the MIGRATION.md 180 KB target.

## What's now visible end-to-end

In the dev server with "Live Hub preview ▶" toggled on, every entry point on the page now works:

1. **HubHero** — date strip, "The Kingdom." title, season + liturgical date, gold rule, House ribbon (when discerned)
2. **MiniPath** — seven medallions in 3-1-3 rhythm, clicking jumps to the corresponding EssentialBlock below
3. **The Seven Essentials** — each EssentialBlock with its inline content; "Begin" or "Find Mass · Adoration" CTAs each open the corresponding migrated modal
4. **Architectural tagline** — "Three preparing. One at the altar. Three sent forth."
5. **Compline footer** — appears in the evening, opens the Compline modal
6. **The "More" grid:**
   - **Your House** — opens `HousesQuiz`. Once a House is chosen, the card grows full-width and shows today's rotating saint quote.
   - **The Field Guide** — fires the batch-11 stub handler (logged to console; navigates in batch 11)
   - **Intentions** — opens `AddIntentionModal`. Submitting an intention updates the count and preview live.
   - **Cloud of Witnesses** — opens the saints scroll modal with the wrap-with-close pattern
   - **The Academy** — visible, locked, intentionally inert

This is the **first batch where the Kingdom Hub is functionally complete** in the migrated scaffold. The only remaining piece for the Kingdom tab is the Field Guide views (batch 11) — which sit *behind* the Field Guide card, not on the Hub itself.

## Recommended next step

Same as last batch — visual inspection in the dev server. This is the second checkpoint. The unit harness now verifies all five MoreGrid cards by content + click-handler routing, but only your eyes can tell you whether the dynamic full-width-when-discerned layout actually breathes correctly, whether the Intentions count + preview reads cleanly with both 0 and 4 entries, whether the locked Academy card sits at the right opacity. Worth the click-through.

If everything looks right, **batch 11** finishes the Kingdom tab: `FieldGuideHub` (~100 lines), `PracticeGuide` (~127 lines), `PracticeCardHorizontal` (~43 lines), plus the routing state (`kingdomView: hub | practices | practice`) and navigation handlers (`goToFieldGuide`, `goToPractice`, `goToHub`). After that, Kingdom is done; Course tab is next; then Gospel tab.

## Run it

From `kingdom-vite-batch10/`:

```bash
npm install
npm run dev     # http://localhost:5173 — toggle "Live Hub preview" top-right
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch10/verify
npm install
node parse-check.mjs           # 33 expected
node render-check-deep.mjs     # 87 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch10/` workspace
- `BATCH_10_HANDOFF.md` (this document)

---

*Salus animarum suprema lex. The Hub is complete.*
