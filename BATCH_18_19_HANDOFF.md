# Migration Batches 18-19 — Chrome Layer + Companion

*Read alongside `BATCH_3_HANDOFF.md` through `BATCH_16_17_HANDOFF.md`. Two batches shipped together: the production chrome (KingdomTabNav + Footer + PassItOn share modal) and the Companion AI chat panel + FloatingCompanion FAB. The migration is now functionally complete except for the auth-blocked SignupModal.*

---

## What shipped

**Batch 18 — Chrome layer.** `KingdomTabNav` (sticky header with 3 tabs + share + companion + sign in/out), `Footer` (4-column with brand, walk links, reference column, copyright + motto), `PassItOn` (centered share modal with copy-link). Wired into App.jsx as a new 5th preview mode `"Live"` — the production chrome wrapping all three tabs end-to-end. The 4-way Harness/Gate/Hub/Course toggle stays for granular dev access.

**Batch 19 — Companion.** `Companion` (slide-in right panel with message history + textarea input + body-scroll lock + Enter-to-send keyboard handler) and `FloatingCompanion` (bottom-right FAB). Companion has two operating modes: API mode (POSTs to a configured endpoint with Anthropic-shaped messages) or stub mode (returns a friendly placeholder). App.jsx mounts both inside Live mode without an `apiEndpoint`, so the panel is fully functional UI-wise but the actual chat is stubbed pending a backend decision.

| Batch | What | Status |
|---|---|---|
| 18 | KingdomTabNav + Footer + PassItOn + Live preview mode wiring | ✅ |
| 19 | Companion (API/stub modes) + FloatingCompanion + Live mode wiring | ✅ |

## Components added (5 new)

| Component | File | Role |
|---|---|---|
| `KingdomTabNav` | component | Sticky header with brand mark, 3-tab navigation (gate/course/kingdom), Pass it on, Ask, Sign in/out |
| `Footer` | component | 4-column footer: brand + tagline (2 cols), Walk (3 tab links), Reference (Field Guide + locked Academy), copyright + Latin motto |
| `PassItOn` | modal | Centered share modal with "Copy link" button (transitions to "Copied" with check icon for 2s) |
| `Companion` | component | Slide-in right panel chat. Tab-aware system prompt, API/stub modes, Enter-to-send (Shift+Enter newline), body-scroll lock, "Listening…" pulsing indicator |
| `FloatingCompanion` | component | Bottom-right FAB with "Ask" label |

Plus infrastructure:
- `src/components/index.js` — added all 4 chrome component exports
- `src/modals/index.js` — added PassItOn (now 12 modals total)
- `src/styles/index.css` — added `@keyframes pulse` for Companion's listening indicator
- **App.jsx** — added 5th preview mode "Live" with full chrome assembly:
  - `KingdomTabNav` at top with `tab` and `onTab` wired to a `productionTab` state (persisted to localStorage)
  - Tab content area: GospelTabView (lazy), CourseTabView (lazy), or KingdomHubView/FieldGuideHub/PracticeGuide based on `productionTab`
  - `Footer` at bottom with all links wired (including "The Field Guide" link routes to Kingdom tab + practices view)
  - `PassItOn` modal mounts when `passItOnOpen` is true
  - `Companion` panel mounts when `companionOpen` is true (currently in stub mode — no `apiEndpoint`)
  - `FloatingCompanion` FAB always visible in Live mode

## Implementation notes

### KingdomTabNav design

Three tabs use `role="tab"` + `aria-selected` for accessibility. The active tab gets a thin gold underline (positioned absolutely, `bottom: -1px` to overlap the header's `border-bottom`). The brand mark on the left has a 0.7s rotation transition on hover (purely decorative). The right action cluster has Pass it on / Ask / Sign in (or Sign out if `currentUser`). The "Sign in" button just routes to the Course tab as a placeholder for the auth flow that lands later.

Source used `hidden md:flex`-style responsive utilities for some buttons (Pass it on hidden on narrow screens, Sign out hidden on narrow). Per project convention I dropped those — all buttons stay visible on mobile. Acceptable: the action cluster stays compact and modern phones are wide enough. If a redesign brings them back, swap the inline display values for media-queried CSS classes.

### Footer's Reference column

The "Academy" link is intentionally muted with a Lock icon — it's a future feature. Source had this in the Footer; keeping it preserves the editorial signal that more is coming. The Field Guide link routes to Kingdom tab in `practices` view, which is the natural reentry point.

### PassItOn share modal

Uses `navigator.clipboard.writeText` to copy `window.location.href`. Falls back gracefully if clipboard API isn't available (button stays in "Copy link" state — graceful degradation). Modal auto-dismisses backdrop click, has X close, and the button label flips between "Copy link" and "Copied" with a 2-second timeout.

### Companion two-mode design

The original source called Anthropic's API directly from the browser:

```js
fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ... }),
})
```

This works only inside Anthropic's artifact runtime where a key is injected by the host. In production, calling Anthropic's public API from a browser without a key will return 401, and putting a real key in the bundle is a security violation. The migration handles this with two modes:

```js
// Stub mode (no apiEndpoint) — friendly placeholder
if (!apiEndpoint) {
  setTimeout(() => {
    setMessages([...next, { role: 'assistant', content: STUB_REPLY }]);
    setLoading(false);
  }, 450);
  return;
}

// API mode — POSTs to configured endpoint with Anthropic-shaped payload
const res = await fetch(apiEndpoint, { ... });
```

App.jsx mounts Companion **without** an `apiEndpoint`, so it runs in stub mode. When the proxy backend is ready, just pass it: `<Companion apiEndpoint="/api/companion" ... />`. The proxy server holds the API key and forwards messages to Anthropic — same payload shape as the source, just with the URL changed.

The `STUB_REPLY` is intentionally warm and on-brand:

> "Thank you for asking. The Companion is being prepared — soon I'll be able to walk with you through any question. For now, the Field Guide and the Course readings have most of what you might be looking for. Salus animarum suprema lex."

This way, the Companion can ship to production and answer every question with that until the backend lands.

### Tab-aware system prompt

Same `COMPANION_SYSTEM_BASE` from source verbatim. The runtime adds tab context: `"\n\nThe visitor is currently on the {The Gospel|The Course|The Kingdom} tab."` — small but meaningful, the assistant can shape its first response accordingly. Source code preserved.

### Body scroll lock for Companion + CircleModal

Both Companion (this batch) and CircleModal (batch 17) use the same pattern:

```js
useEffect(() => {
  if (typeof document === 'undefined') return undefined;
  if (open) {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }
  return undefined;
}, [open]);
```

This prevents background scroll on iOS Safari when the modal/panel is open. Cleanup restores the original overflow value (rather than hardcoding 'auto') in case a future global style sets it differently.

### Companion's Enter-to-send keyboard handler

```js
onKeyDown={(e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}}
```

Standard chat-app convention: Enter sends, Shift+Enter inserts newline. Preserved from source.

### App.jsx 5-way preview mode

Replaces the previous 4-way (Harness/Gate/Hub/Course) with 5-way (Harness/Gate/Hub/Course/Live). Live is the production assembly; the other four remain for granular component-level inspection during ongoing development.

The Live mode persists `productionTab` via `useKingdomStorage` so refreshing the page returns the user to the same tab. The other modes don't persist (refresh returns to Harness) — that asymmetry is intentional: Live behaves like the real app, the other modes are dev tools.

### App.jsx Companion variable rename

The first pass had a variable called `companionOpenStub` (dating from when the Companion stub was inline JSX inside App). After the real Companion migrated, the variable was renamed to `companionOpen` since it's no longer a stub at the App level — it's just the panel's open state, and the stub-vs-real distinction lives entirely inside the Companion component (controlled by the `apiEndpoint` prop).

### Test for Companion's controlled textarea (jsdom quirk)

React's controlled inputs use a custom property setter to track value changes. Setting `textarea.value = 'x'` directly bypasses React's tracking, so `onChange` doesn't fire and the component doesn't see the new value. The test uses React's recommended workaround:

```js
const setter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype,
  'value'
).set;
setter.call(textarea, 'What is the kingdom?');
textarea.dispatchEvent(new Event('input', { bubbles: true }));
```

This goes through the DOM-level setter that React's tracking actually observes. The `Event` constructor needed to be added to the harness's `global` object — verified by adding `global.Event = dom.window.Event` (and friends KeyboardEvent, MouseEvent, CustomEvent).

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **61 of 61 files passed** (was 56; +5 new: KingdomTabNav, Footer, Companion, FloatingCompanion, PassItOn).

**Gate 2 — `render-check-deep.mjs`:** **168 of 168 tests passed** (was 151; +17 new across batches 18 + 19, with 1 test rewritten for the new 5-way toggle).

The new tests:

**Batch 18 (11 tests):**
- KingdomTabNav renders three tab labels (The Gospel / The Course / The Kingdom)
- KingdomTabNav active tab gets `aria-selected="true"`; other tabs don't
- KingdomTabNav tab clicks fire `onTab(id)` with correct ids in order (gate/course/kingdom)
- KingdomTabNav share + companion buttons fire correctly
- KingdomTabNav with `currentUser` shows "Sign out" instead of "Sign in"
- Footer renders all three tab links + Field Guide + Academy + motto + current year copyright
- Footer Walk-column links fire `onTab(id)` for all three tabs
- Footer Field Guide button fires `onOpenFieldGuide`
- PassItOn returns null when `open=false`
- PassItOn renders modal content when open (headline + body + Copy link button)
- PassItOn close button fires `onClose`
- App test: 5-way toggle includes "Live" label

**Batch 19 (6 tests):**
- FloatingCompanion renders FAB with `aria-label="Open Companion"` + "Ask" label, fires onClick
- Companion returns null when `open=false`
- Companion renders welcome message when opened (header, subhead, welcome text, input placeholder)
- Companion close button fires `onClose`
- Companion stub mode adds user message + stub reply on send (uses React's native value setter to simulate controlled-input typing; awaits the 450ms stub delay; verifies "Companion is being prepared" reply)
- Companion send button is disabled when input is empty

**Gate 3 — Vite production build:** Clean. Bundle:

```
dist/assets/index-*.js                 234.87 kB │ gzip:  54.45 kB    ← App + components + chrome
dist/assets/CourseTabView-*.js          46.91 kB │ gzip:  10.75 kB    ← lazy
dist/assets/course-*.js                303.86 kB │ gzip: 105.96 kB    ← lazy
dist/assets/GospelTabView-*.js          59.78 kB │ gzip:  18.40 kB    ← lazy
dist/assets/field-guide-*.js           113.12 kB │ gzip:  40.73 kB    ← eager (Kingdom uses it)
dist/assets/liturgical-*.js             62.90 kB │ gzip:  19.21 kB
dist/assets/react-vendor-*.js          133.93 kB │ gzip:  43.12 kB
dist/assets/icons-*.js                  21.63 kB │ gzip:   6.30 kB
dist/assets/index-*.css                 32.75 kB │ gzip:   6.92 kB
```

**First-paint payload: ~170 KB gzipped** (App + react-vendor + icons + liturgical + field-guide + CSS). Under 180 KB target. Index grew +3 KB from batch 17 reflecting KingdomTabNav (~3 KB), Footer (~3 KB), Companion (~5 KB), FloatingCompanion (~1 KB), PassItOn (~2 KB) — partially offset by removed inline stubs.

When the user toggles **Live** mode, KingdomTabNav + Footer render eagerly. Clicking **Gate** loads +18 KB (GospelTabView). Clicking **Course** loads +117 KB (CourseTabView + course content). The Companion panel opens instantly (already in the eager bundle).

## What's now end-to-end

In Live mode, the dev shell IS the production app:

1. Load — see KingdomTabNav at top with The Kingdom brand mark + 3 tabs (active is whichever was last selected, persisted to localStorage). FloatingCompanion FAB bottom-right.
2. Click any tab — content area swaps to that tab's view. Gate, Course, Kingdom all work end-to-end (see batches 17 + 11 + 15 handoffs for details).
3. Click Pass it on — share modal opens with "Copy link" button. Tapping it copies `window.location.href` to clipboard, button shows "Copied" check for 2s.
4. Click Ask (in nav OR floating FAB) — Companion panel slides in from the right with the welcome message. Type a question, hit Enter (or click send button). User message appears immediately; "Listening…" pulse shows; after 450ms the stub reply appears. Body scroll locks while panel is open.
5. Click Footer's "The Field Guide" link — routes to Kingdom tab in practices view.
6. Click Footer's "The Course" link — routes to Course tab.

The Live mode is the closest the migration gets to the production app without auth. A reader can land on the gate, walk the prologue/trail/circles, click into a circle modal, close it, scroll to the bridge and gate invitation, click "Enter the Course" to jump tabs, walk a week, mark days complete (persisted to localStorage), see the Sending page at week 7, return to Hub via the tab nav, open Lectio Divina or any of the 11 modals, navigate to Field Guide, open a practice, navigate back, ask the Companion a question (stub reply), and share the page.

## What's NOT in this session

- **Real Companion API integration** — needs a backend proxy server (or alternative model provider). The component is API-ready, just pass `apiEndpoint`.
- **`SignupModal`** (164 lines, source line 7609) — auth-stubbed in source. Needs auth provider decision before migration.
- **Real auth integration** — same blocker.
- **Sign in flow** — currently the "Sign in" button just routes to Course (placeholder). After auth, this opens SignupModal.
- **Course chunk pre-warming** — could pre-load on hover/intent for instant Course tab entry. Future polish.

## Migration status across the project

The Vite scaffold is now functionally feature-complete except for auth. Status:

| Layer | Status | Notes |
|---|---|---|
| Modal layer (12 modals) | ✅ COMPLETE | 11 daily-life modals + PassItOn share modal |
| Kingdom tab | ✅ COMPLETE | HubHero, 7 essentials, Field Guide, Practice detail |
| Course tab | ✅ COMPLETE | CourseHero, CourseJourney (SVG + list), WeekDetail, DayReading, SendingDay |
| Gospel/Gate tab | ✅ COMPLETE | Hero, Prologue, Trail, Circles (9-ring SVG), Bridge, CircleModal, GateInvitation |
| Chrome | ✅ COMPLETE | KingdomTabNav, Footer, FloatingCompanion |
| Companion | ✅ COMPLETE (stub) | Full UI, two modes, awaits backend |
| Auth + SignupModal | ❌ BLOCKED | Needs provider decision |

Source monolith line count: 13,631. Vite scaffold equivalent: **27 component files + 12 modal files + 11 data modules + harness + tests**.

## What this means for `the_kingdom.jsx`

After auth lands and SignupModal migrates, `the_kingdom.jsx` can be retired. The Vite scaffold becomes the source of truth. From the user's perspective, the app feels identical (same UI, same content, same routing); from the codebase's perspective, the 13,631-line monolith is replaced by a tree of small, individually-testable components with 168 unit tests covering content presence, click routing, state persistence, defensive null handling, accessibility (aria-selected, aria-label), keyboard handlers, modal lifecycle, and progress reflection across all four tabs.

## Recommended next steps

This is a natural visual-inspection checkpoint. Toggle **Live** mode in the dev server, then:

1. Click each of the 3 tabs — verify the content swaps correctly and Footer links route as expected
2. Open Pass it on, click Copy link, paste it somewhere — verify the URL copies
3. Open the Companion (try both the nav button and the FAB), type a question, hit Enter, watch the stub reply
4. From Course tab, click into a week, click into a day, mark it complete, refresh the page, verify the completion persists across reload
5. From Gate tab, click into a circle modal, hit Escape, ArrowLeft, ArrowRight — verify all keyboard handlers work

If everything looks right, the migration is complete pending auth. The next conversation can:
- Wait for the auth provider decision, then migrate SignupModal
- Or do polish (Course chunk pre-warming, SignupModal placeholder, removing dev-only preview modes)
- Or start retiring `the_kingdom.jsx` even now — the scaffold has every feature except auth

## Run it

From `kingdom-vite-batch19/`:

```bash
npm install
npm run dev     # http://localhost:5173 — toggle "Live" top-right for production assembly
npm run build   # produces dist/ — Vercel-ready
```

## Re-verify

```bash
cd kingdom-vite-batch19/verify
npm install
node parse-check.mjs           # 61 expected
node render-check-deep.mjs     # 168 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch19/` workspace (27 components, 12 modals, 11 data modules, full handoff documentation)
- `BATCH_18_19_HANDOFF.md` (this document)

---

*Salus animarum suprema lex. The chrome is up. The Companion walks beside. The migration is in its final mile.*
