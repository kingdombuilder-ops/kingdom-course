# Migration Batches 20-21 — SignupModal Stub + Production Polish

*Read alongside `BATCH_3_HANDOFF.md` through `BATCH_18_19_HANDOFF.md`. Two batches shipped together: SignupModal in stub mode (the auth-blocked modal lands as a fully functional UI awaiting only a `submitHandler` swap) and production polish (Live mode is the default, dev toggle gated behind IS_DEV, HarnessShell tree-shaken, Tailwind toolchain removed, top-level README written).*

---

## What shipped

**Batch 20 — SignupModal in stub mode.** Migrated `SignupModal` (164 lines at source line 7609) using the same API/stub seam pattern as Companion: an optional `submitHandler` prop that defaults to a localStorage-backed stub. The component lands now with full UI and validation; the auth provider integration is one prop away. Wired into App.jsx Live mode — KingdomTabNav's "Sign in" button now opens the modal, and `currentUser` hydrates from localStorage on mount so signed-in state survives reload.

**Batch 21 — Production polish.** Six items:

1. `IS_DEV` flag in its own module (`src/env.js`) so Vite can statically replace it
2. App.jsx defaults to `'live'` mode when `!IS_DEV`, `'harness'` in dev
3. The 5-button preview toggle UI gated behind `{IS_DEV && (...)}` so it doesn't ship to production
4. `HarnessShell` (the dev-only modal-test grid) gated so Vite tree-shakes it from production
5. Tailwind toolchain fully removed (`tailwind.config.js` deleted, `postcss.config.js` slimmed to autoprefixer only, `tailwindcss` dep removed, `@tailwind base/components/utilities` directives stripped from CSS)
6. Top-level `README.md` written consolidating architecture, conventions, batch history

| Batch | What | Status |
|---|---|---|
| 20 | SignupModal (stub mode) wired into Live mode | ✅ |
| 21 | Production polish (5 items) + README | ✅ |

## Components added (1 new) + edits

| Item | File | Role |
|---|---|---|
| `SignupModal` | new modal | Three-field signup (email/name/parish) with API/stub modes. Default stub persists user to `localStorage["kingdomCurrentUser"]` |
| `env.js` | new helper | Single source of truth for `IS_DEV`. Vite replaces `import.meta.env.DEV` at build time |
| `KingdomTabNav` | edit | Added `onOpenSignup` prop with fallback to existing `onTab('course')` behavior |
| `App.jsx` | edit | Added: SignupModal import, `currentUser`/`signupOpen` state, hydration from localStorage, `handleSignOut`/`handleSignupSuccess` callbacks, `currentUser` passed to CourseTabView in Live mode, SignupModal mounted in Live mode, IS_DEV import, default mode flipped, dev toggle gated, HarnessShell gated |
| `src/styles/index.css` | edit | Removed `@tailwind` directives. CSS dropped 7 KB (32.75 → 25.65 KB raw) |
| `postcss.config.js` | edit | Removed tailwindcss plugin; autoprefixer only |
| `tailwind.config.js` | deleted | No longer needed |
| `package.json` | edit | Removed `tailwindcss` from devDependencies |
| `README.md` | new | Architecture, conventions, batch history, deployment notes |

## Implementation notes

### SignupModal stub mode

Default behavior when no `submitHandler` is provided:

```js
async function defaultStubHandler({ email, name, parish }) {
  const user = {
    email,
    name: name || null,
    parish: parish || null,
    signedUpAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  await new Promise((resolve) => setTimeout(resolve, 250));
  return user;
}
```

When real auth lands, the consumer passes an alternate handler:

```jsx
<SignupModal
  submitHandler={async ({ email, name, parish }) => {
    const res = await authProvider.signup({ email, name, parish });
    if (!res.ok) throw new Error(res.error);
    return res.user;
  }}
  ...
/>
```

The component throws `"Something went wrong. Please try again."` and resets `submitting` if the handler rejects. No other component code changes — the seam is the prop.

`STORAGE_KEY` is exported as `SIGNUP_STORAGE_KEY` so App.jsx can read the persisted user without knowing the literal key name.

### currentUser hydration in App.jsx

```js
const [currentUser, setCurrentUser] = useState(() => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SIGNUP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
});
```

The lazy initializer runs once on mount. Defensive against localStorage failure (incognito/quota/SSR). When real auth lands, this hydration step is replaced by the auth provider's session check (cookie, token, etc.) — same `currentUser` shape, different source.

`handleSignupSuccess(user)` updates state + closes modal. `handleSignOut()` removes the localStorage key + clears state.

### KingdomTabNav prop addition

Added `onOpenSignup` with a fallback so existing tests (which don't pass this prop) still work:

```js
onClick={() => {
  if (onOpenSignup) onOpenSignup();
  else if (onTab) onTab('course');
}}
```

This keeps backward compat with the original "Sign in routes to Course" behavior when no signup modal is wired.

### Form-submit jsdom workaround in tests

React's `<form onSubmit={...}>` handler runs when the form receives a submit event. Clicking a `type="submit"` button inside a form with `<input required>` triggers the browser's native HTML5 validation tooltip first, which prevents the React handler from firing. In jsdom this validation gate behaves the same way.

The workaround in tests: dispatch the submit event directly on the form element, bypassing the native validation step:

```js
const form = root.querySelector('form');
await act(async () => {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
});
```

This goes straight to the React handler. The `Event` constructor was already added to the harness's globals in batch 19 for the Companion textarea test.

### IS_DEV flag and the env.js indirection

The cleanest pattern is to put `import.meta.env.DEV` access in its own tiny module:

```js
// src/env.js
export const IS_DEV = import.meta.env.DEV === true;
```

Vite statically replaces this at build time — production builds get `export const IS_DEV = false === true;` which the minifier collapses to `export const IS_DEV = false;`, and any `{IS_DEV && (...)}` JSX in App.jsx becomes dead code that Rollup tree-shakes.

The test harness can't transform `import.meta` through its Babel CommonJS pipeline. Solution: a special case in the harness's `loadModule` that returns a stub:

```js
if (file.endsWith('/env.js') && file.includes('/src/')) {
  cache[file] = { IS_DEV: false };
  return cache[file];
}
```

The harness sees `IS_DEV: false` (production-shaped App), which is the more important test case. If a future test wants to verify dev-mode behavior, it can monkey-patch the cache before App.jsx loads.

### HarnessShell tree-shaking

Originally, the conditional chain in App.jsx ended with HarnessShell as the unconditional fallback:

```jsx
previewMode === 'live' ? <Live/> :
previewMode === 'gate' ? <Gate/> :
previewMode === 'course' ? <Course/> :
previewMode === 'hub' ? <Hub/> :
<HarnessShell.../>  // fallback
```

In production, `previewMode` initializes to `'live'`, so HarnessShell never renders. But Rollup can't prove that — `previewMode` could be set to `'harness'` by `setPreviewMode`. So HarnessShell stays in the bundle.

Adding an `IS_DEV` gate makes the dead-code path explicit:

```jsx
} : IS_DEV ? (
  <HarnessShell.../>
) : (
  null  // unreachable in production; defensive
)
```

Now Rollup sees `false ? <HarnessShell.../> : null`, dead-codes the JSX, and the entire `function HarnessShell({...}) { ... }` declaration becomes unreferenced and is removed.

**Bundle savings: ~9 KB raw / ~2.4 KB gz** (index 240.64 → 231.41 KB raw, 56.06 → 53.71 KB gz).

### Tailwind toolchain removal

Components in this codebase use inline `style={{}}` for layout/spacing/color and a small set of custom CSS utility classes (`paper-bg`, `display`, `body`, `sc`, `btn-gold`, `ornament`, `dropcap`, etc.) defined in `src/styles/index.css`. None of them use Tailwind utility classes like `bg-blue-500` or `flex items-center`. The `@tailwind base/components/utilities` directives in `index.css` were generating ~7 KB of unused base styles.

Removed:
- `tailwind.config.js` (entire file deleted)
- `tailwindcss` from `package.json` devDependencies
- `tailwindcss` plugin from `postcss.config.js`
- `@tailwind base; @tailwind components; @tailwind utilities;` from `src/styles/index.css`

Kept:
- `autoprefixer` in `postcss.config.js` — vendor prefixes for animations are still useful

**Bundle savings: 7.10 KB raw / 1.75 KB gz** on the CSS file (32.75 → 25.65 KB raw, 6.92 → 5.17 KB gz).

### Top-level README

Consolidates: project overview, status, run commands, verify commands, full architecture diagram with file tree, path alias table, bundle splitting table with sizes, key conventions (inline styles, three gates, API/stub seam pattern, "tools to the Church's life"), batch history, deployment notes. This is the entry point doc — anyone picking up the project cold should be able to get oriented from this one file.

The batch handoff docs remain as the chain-of-custody (per-batch detail). The README points at them.

## How it was verified

All three gates green.

**Gate 1 — `parse-check.mjs`:** **63 of 63 files passed** (was 61; +2 new: SignupModal + env.js).

**Gate 2 — `render-check-deep.mjs`:** **176 of 176 tests passed** (was 168; +8 new from batch 20).

The batch 20 tests:
- SignupModal returns null when `open=false`
- SignupModal renders form fields when open (eyebrow, headline, both subhead lines, pullquote, all 3 placeholders, submit CTA)
- SignupModal close button fires onClose
- SignupModal validates email — empty → shows "An email is required to begin."
- SignupModal validates email — invalid format → shows "Please enter a valid email address."
- SignupModal stub mode persists user + fires onSuccess (types email + name, dispatches submit, awaits 250ms stub delay, verifies onSuccess receives correct user object, verifies localStorage has the user)
- SignupModal API mode calls submitHandler instead of stub (passes a custom handler that returns an `apiSignedUp: true` user, verifies handler called with right data + onSuccess receives the API user)
- SignupModal SIGNUP_STORAGE_KEY export is "kingdomCurrentUser"

The App tests in Test 10 were rewritten for production-shaped behavior:
- App renders without throwing
- App boots into Live (production) mode by default in non-DEV builds — verifies KingdomTabNav, Footer, FloatingCompanion all render
- App preview-mode toggle is hidden in non-DEV builds — verifies the "Harness" button label doesn't appear

**Gate 3 — Vite production build:** Clean. Final bundle:

```
dist/assets/index-*.js                 231.41 kB │ gzip:  53.71 kB    ← App + chrome (HarnessShell tree-shaken)
dist/assets/CourseTabView-*.js          46.91 kB │ gzip:  10.75 kB    ← lazy
dist/assets/course-*.js                303.86 kB │ gzip: 105.96 kB    ← lazy
dist/assets/GospelTabView-*.js          59.78 kB │ gzip:  18.41 kB    ← lazy
dist/assets/field-guide-*.js           113.12 kB │ gzip:  40.73 kB    ← eager
dist/assets/liturgical-*.js             62.90 kB │ gzip:  19.21 kB    ← eager
dist/assets/react-vendor-*.js          133.93 kB │ gzip:  43.12 kB    ← eager
dist/assets/icons-*.js                  22.31 kB │ gzip:   6.30 kB    ← eager
dist/assets/index-*.css                 25.65 kB │ gzip:   5.17 kB    ← eager (Tailwind removed)
```

**First-paint payload: ~167 KB gzipped** (App + react-vendor + icons + liturgical + field-guide + CSS). Healthily under the 180 KB target. Down from ~170 KB at end of batch 19.

When the user clicks **Gate**: +18 KB. When they click **Course**: +117 KB.

## Bundle savings across batches 20-21

| Source | Raw KB | gz KB |
|---|---|---|
| HarnessShell tree-shaken | -9.23 | -2.35 |
| Tailwind base layer removed | -7.10 | -1.75 |
| **Net reduction** | **-16.33** | **-4.10** |

Offset by additions (SignupModal at ~14 KB raw / ~4 KB gz, currentUser state plumbing, env.js, etc.), giving a net ~3 KB gz reduction in eager bundle size while adding a fully-functional signup flow and a production-shippable build configuration.

## What's now end-to-end

In production builds (and Live mode in dev), the dev shell IS the production app:

1. Load — see KingdomTabNav at top, FloatingCompanion FAB bottom-right. `currentUser` hydrated from localStorage if present.
2. **Click "Sign in"** (when not logged in) — SignupModal opens. Type email + name + (optional parish), click "Begin the Course". Stub mode persists to localStorage and fires onSuccess(user). Modal closes. Header now shows "Sign out" instead.
3. **Click "Sign out"** — clears localStorage, currentUser becomes null, header shows "Sign in" again.
4. Click any tab — content swaps. Course tab passes `currentUser` to CourseTabView, so CourseHero's logged-in greeting shows.
5. **Refresh the page** — `productionTab` and `currentUser` both restore from localStorage. The user lands back where they were.
6. Pass it on / Companion / Footer all work as in batches 18-19.

In dev mode (`vite dev`), the 5-way preview toggle reappears top-right and defaults to Harness mode for component-level inspection.

## What's NOT in this session

- **Real auth integration** — `submitHandler` prop is the seam. When a provider lands (Supabase / Clerk / Auth.js / custom), pass it.
- **Real Companion API integration** — `apiEndpoint` prop is the seam.
- **Server-side session validation** — currently `currentUser` lives only in localStorage. Production auth provider will replace this with a cookie-based session.
- **Course chunk pre-warming** — could pre-load on hover/intent for instant Course tab entry. Future polish.
- **Vite dev mode hand-verification** — I didn't run `npm run dev` to manually confirm `import.meta.env.DEV` resolves to `true` and the toggle reappears. The test harness covers the production case (which is the more important one); the dev case is plumbed correctly per Vite's docs but unverified empirically. First-time `npm run dev` will be the proof.

## Migration status across the project

The Vite scaffold is now **structurally and functionally complete** except for two integration seams pending external decisions:

| Layer | Status | Notes |
|---|---|---|
| Modal layer (13 modals) | ✅ COMPLETE | 11 daily-life modals + PassItOn + SignupModal |
| Kingdom tab | ✅ COMPLETE | HubHero, 7 essentials, Field Guide (22 practices), Practice detail |
| Course tab | ✅ COMPLETE | CourseHero, CourseJourney (SVG + list), WeekDetail, DayReading, SendingDay |
| Gospel/Gate tab | ✅ COMPLETE | Hero, Prologue, Trail, Circles (9-ring SVG), Bridge, CircleModal, GateInvitation |
| Chrome | ✅ COMPLETE | KingdomTabNav, Footer, FloatingCompanion |
| Companion | ✅ COMPLETE (stub) | Full UI, two modes, awaits backend |
| SignupModal | ✅ COMPLETE (stub) | Full UI, two modes, awaits auth provider |
| Production build configuration | ✅ COMPLETE | Live default, dev toggle gated, dead code tree-shaken, Tailwind removed |
| Auth provider integration | ❌ EXTERNAL | Pass `submitHandler` prop |
| Companion backend integration | ❌ EXTERNAL | Pass `apiEndpoint` prop |

Source monolith line count: 13,631. Vite scaffold equivalent: **31 component files + 13 modal files + 11 data modules + harness + 176 unit tests**.

## What this means for `the_kingdom.jsx`

The migration is done. The original 13,631-line monolith can be retired now — every visible feature lives in the Vite scaffold. The two pending external decisions (auth provider, Companion backend) don't require keeping the monolith around; they're prop swaps on already-shipped components.

The handoff docs (`BATCH_3_HANDOFF.md` through `BATCH_20_21_HANDOFF.md`, plus this one) are the chain-of-custody record. Anyone returning to this project months from now can reconstruct what shipped, why, and what's left from these documents alone.

## Run it

From `kingdom-vite-batch21/`:

```bash
npm install
npm run dev      # http://localhost:5173 — dev mode with 5-way preview toggle
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle locally to verify
```

In dev mode, the toggle defaults to Harness; switch to Live to see the production assembly. In production builds, the toggle is gone and Live is the only path.

## Re-verify

```bash
cd kingdom-vite-batch21/verify
npm install
node parse-check.mjs           # 63 expected
node render-check-deep.mjs     # 176 expected
```

## Files in this batch (in `/mnt/user-data/outputs/`)

- The full `kingdom-vite-batch21/` workspace (31 components, 13 modals, 11 data modules, 88 files, 1.7 MB)
- `BATCH_20_21_HANDOFF.md` (this document)
- `README.md` (top-level entry-point doc — read first if cold)

---

*Salus animarum suprema lex. The doors are unlocked. The visitor walks in. The kingdom is open.*
