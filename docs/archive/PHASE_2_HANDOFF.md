# Kingdom Course — Phase 2 Handoff (Resume Here)

**Date of handoff:** 2026-05-12 (late evening, Sidney BC)
**Status:** Phase 2 shipped to production. Final smoke test pending.

---

## Where we are RIGHT NOW

**Production is live.** `https://kingdomcourse.org` is serving the Phase 2 build:

- Vercel deployment: **`FnUSYoJKi`** — Status 🟢 Ready · Latest · Production · Current
- Source commit: **`72ebe07`** — "Phase 2 polish: Google OAuth + auto-route to Course + 'Fifty days' copy"
- Domains bound: `kingdomcourse.org` (canonical, bare) + `www.kingdomcourse.org` (301 → bare) + Vercel defaults
- Build: 12s, clean, 1 low-priority warning (likely `apple-mobile-web-app-capable` deprecated meta tag)
- HTTPS valid

**Phase 2 work that is COMPLETE:**

1. ✅ Phase 0 — Local Vite project at `~/projects/kingdom-vite-batch21/`, builds clean, 176 tests pass
2. ✅ Phase 1 — GitHub repo `kingdombuilder-ops/kingdom-course`, Vercel project, custom domain DNS configured at Namecheap, SSL live
3. ✅ Phase 2 — Clerk authentication wired end-to-end with **email + verification code** AND **Google OAuth**, both flows tested working on **localhost**, then deployed to production via auto-build from `git push`

**The ONLY thing not yet verified:** L.10, the production smoke test on the live `kingdomcourse.org` domain. Aaron took two screenshots at the end of last session purportedly showing the smoke test result, but I never got to evaluate them. They need to be re-uploaded.

---

## What "L.10" means

L.10 was the final item in our ad-hoc Phase 2 launch checklist (L.1 through L.10). It's the production smoke test of the deployed site:

**L.10 — Production smoke test on live domain**

1. Open `https://kingdomcourse.org` in an **Incognito / Private window** (Cmd+Shift+N) — fresh visitor experience
2. Verify Gate Hero renders ("The single greatest announcement in history"), HTTPS padlock solid, three tabs visible (THE GOSPEL · THE COURSE · THE KINGDOM), Sign In / PASS IT ON / ASK in nav
3. DevTools Console (Cmd+Option+I): only expected warning is Clerk dev-keys notice, no other red errors
4. Click **Sign In** → SignupModal renders with Google button + "Fifty days" copy
5. Click **Continue with Google** → Google consent shows "Sign in to Kingdom Course" → pick a whitelisted test account
6. Round-trip to `/sso-callback` → land on **The Course tab** showing "Hello, [first name]." with WELCOME BACK eyebrow
7. (Optional) Test email path on production with a fresh email — should arrive from `notifications@accounts.dev` with subject "Kingdom Course / Verification code: XXXXXX"

**Known risk on L.10:** `redirect_uri_mismatch` error from Google is possible. If it happens, the fix is adding the production Clerk callback URL to Google Cloud Console OAuth client. Currently only the dev callback (`https://balanced-cod-0.clerk.accounts.dev/v1/oauth_callback`) is whitelisted. This **should still work** because the Clerk dev instance handles both localhost and production via that same callback URL.

---

## Exact code changes made in Phase 2

All paths relative to `~/projects/kingdom-vite-batch21/`:

### 1. `.env.local` (NEW, gitignored)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 2. `src/main.jsx`
Wrapped `<App />` in `<ClerkProvider publishableKey={PUBLISHABLE_KEY}>` with env-var guard that throws if key missing.

### 3. `src/App.jsx` (major changes)
- Imports: `{ useUser, useSignUp, useSignIn, useClerk, AuthenticateWithRedirectCallback }` from `@clerk/clerk-react`
- Replaced `localStorage` `currentUser` hydration with `useUser()` hook
- User shape adapted to `{ email, name, parish, signedUpAt }` derived from Clerk user (`primaryEmailAddress.emailAddress`, `firstName`, `unsafeMetadata.startingFrom`, `createdAt`)
- `handleSignOut` calls Clerk's `signOut()`
- `handleSignupSuccess` closes modal AND auto-routes via `setProductionTab('course')` + `scrollTo(0,0)`
- `handleClerkSignup` async: calls `signUp.create({ emailAddress, firstName, unsafeMetadata: { startingFrom } })`, then `signUp.prepareEmailAddressVerification({ strategy: 'email_code' })`, then opens VerifyEmailModal
- `handleGoogleSignup` async: calls `signIn.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: '/sso-callback', redirectUrlComplete: '/' })`
- `<AuthenticateWithRedirectCallback>` mounted conditionally at top of return when `window.location.pathname === '/sso-callback'`
- `<SignupModal>` receives `submitHandler={handleClerkSignup}` and `googleHandler={handleGoogleSignup}`
- `<VerifyEmailModal>` mounted alongside SignupModal with `onVerified` callback that calls `setActive({ session: createdSessionId || signUp?.createdSessionId })`
- Removed `SIGNUP_STORAGE_KEY` import

### 4. `src/modals/VerifyEmailModal.jsx` (NEW FILE)
Mirror of SignupModal's visual design (paper-bg, gold-3, btn-gold sc classes). Collects 6-digit code, calls `signUp.attemptEmailAddressVerification({ code })`, accepts session ID from either `result.createdSessionId` or `signUp.createdSessionId`. Includes "Send a new one" resend link via `prepareEmailAddressVerification` retry.

### 5. `src/modals/index.js`
Added export between TheRosary and WorkOfMercy:
```js
export { default as VerifyEmailModal } from './VerifyEmailModal.jsx';
```

### 6. `src/modals/SignupModal.jsx`
- Added `googleHandler` prop to component signature
- Conditionally rendered `<button onClick={googleHandler}>Continue with Google</button>` above email form when `googleHandler` prop provided
- Inline SVG Google logo (4-color paths)
- "or with email" divider with hairlines + gold-3 SC text
- **Copy fix:** "Forty-nine days." → "Fifty days." (canonical per IMPLEMENTATION_PLAN.md)

### 7. `.gitignore`
Expanded from `node_modules` only to full Vite-standard ignore (logs, .env*, dist, .vscode, .DS_Store, etc.)

---

## External services configured

### Clerk (auth provider)
- App: "Kingdom Course" in `kingdombuilder-ops` workspace (Hobby plan)
- Instance: `balanced-cod-0.clerk.accounts.dev` (Development environment, keys `pk_test_...`)
- Google OAuth enabled, **"Use custom credentials" ON** with creds from Google Cloud
- Email + verification code enabled
- **Password requirement DISABLED** (this was the breakthrough fix — Configure → User & authentication → Password → "Sign-up with password" OFF)
- OAuth callback URI: `https://balanced-cod-0.clerk.accounts.dev/v1/oauth_callback`
- Two test users in Users dashboard (Aaron + Adam)

### Google Cloud Console
- Project: "Kingdom Course" (ID `kingdom-course`, Number `895029317495`)
- Branding: App name "Kingdom Course", support email, app home/privacy/terms URLs, authorized domain `kingdomcourse.org`
- Audience: External, Testing mode, test users whitelisted
- Data Access scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`
- OAuth Client "Kingdom Course Web" (Web app)
- Authorized redirect URI: `https://balanced-cod-0.clerk.accounts.dev/v1/oauth_callback`
- Client ID + Secret pasted into Clerk's custom credentials fields

### GitHub
- Repo: `https://github.com/kingdombuilder-ops/kingdom-course` (note: `kingdombuilder-ops` — no S)
- Branch: `main`
- Commit history (most recent first):
  - `72ebe07` Phase 2 polish: Google OAuth + auto-route to Course + 'Fifty days' copy
  - `c04f1e0` Phase 2: wire Clerk authentication (email + verification code)
  - `386d2e7` Remove node_modules from tracking
  - `bfd295e` Initial commit — Kingdom Course web app
- Working tree clean, fully synced with origin/main
- Authenticated via `gh` CLI (`brew install gh` → `gh auth login`)

### Vercel
- Workspace: `kingdombuilder-ops` (Hobby plan)
- Project: `kingdom-course`
- Auto-deploys from `main` branch on push
- Environment variable set: `VITE_CLERK_PUBLISHABLE_KEY` (Production + Preview, marked Sensitive)
- Latest production deploy: `FnUSYoJKi` 🟢 Ready

### Namecheap (DNS for kingdomcourse.org)
- A Record · `@` · `216.198.79.1` · Automatic
- CNAME Record · `www` · `8dabb35f45ae5909.vercel-dns-017.com.` · Automatic
- All Namecheap default parking records deleted
- DNS propagated, SSL issued

---

## Auth flow verified end-to-end on LOCALHOST

✅ **Email path:** SignupModal → Clerk → email arrives from `notifications@accounts.dev` ("Kingdom Course / Verification code: XXXXXX") → VerifyEmailModal → signed in → auto-routes to Course → "Hello, Aaron."

✅ **Google path:** Click "CONTINUE WITH GOOGLE" → Google consent → `/sso-callback` → Clerk session set → routed to `/` → on Course tab → "Hello, Adam." (Google account first name)

Both users now exist in Clerk Users dashboard.

---

## What's PENDING (in order)

### Immediate
1. **L.10 — production smoke test on `kingdomcourse.org`** (incognito, Google OAuth round-trip). Aaron took two screenshots at end of last session — needs to re-upload them to evaluate.

### This week (soft-launch loop)
- Test signup with ~5–10 friend Gmails (already whitelisted in Google Cloud test users)
- Watch Day 1 → Day 2 retention
- Iterate based on what users say

### Pre-broad-launch polish
- Fix `apple-mobile-web-app-capable` deprecated meta tag (the 1 build warning)
- Add missing `icon-192.png`
- Create real `/privacy` and `/terms` pages (currently linked but stubs)
- Swap Clerk dev keys (`pk_test_...`) for production keys

### Phase 3+ (later)
- Add Apple OAuth (requires Apple Developer Program $99/yr, DUNS, 1-2 days)
- Wire Companion AI backend (currently stub mode in `<Companion apiEndpoint={...}/>` seam)
- Build Academy reader surface (currently locked card only — unlocks at Day 50)
- Resolve V2 Tailwind vs Hub inline-styles integration challenge
- Find permanent home for Field Guide outside V2 monolith
- Unify three tabs under single shell (no `KingdomTabNav` shell beyond stub)

---

## Locked canonical decisions (do not relitigate)

- **Inline `style={{}}` only — never Tailwind** (V2+Tailwind caused blank renders in Aaron's env)
- **ABIDE is Step 4 verb** (not REST) everywhere consumer-facing
- **"Fifty days" / "Seven weeks to Pentecost"** (not "forty-nine days")
- **Channel-agnostic community language** ("walk it with whoever is given") — preserves catechetical teaching about in-person community as organic fruit, doesn't structurally require it
- **Houses internal slugs:** Light, Fire, **peace** (Joy/Franciscan), Glory, **benedict** (Earth/Benedictine)
- **Naming:** "The Kingdom Course" = Tier 1 consumer product; "The Kingdom Academy" = Tier 2 unlocked at Day 50; "DTS" = internal/post-threshold only
- **Mass-anchored 3-1-3 daily pattern** in Hub
- **Three classical movements:** Via Purgativa · Via Illuminativa · Via Unitiva
- **Verify with `npm run dev` + `npm run build`** — NEVER the broken `/home/claude/verify/` harness scripts

---

## File landmarks (on Aaron's Mac)

**Project root:** `~/projects/kingdom-vite-batch21/`

Key files (in repo):
- `src/main.jsx`, `src/App.jsx`
- `src/modals/SignupModal.jsx`, `src/modals/VerifyEmailModal.jsx`, `src/modals/index.js`
- `.env.local` (gitignored)
- `.gitignore`

Reference files (somewhere on Aaron's machine):
- `IMPLEMENTATION_PLAN.md` — canonical next steps (1,511 lines, supersedes prior plans)
- `HANDOFF.md` — session onboarding (always read first)
- `kingdom_hub_CURRENT_v6_stable.jsx` — strongest Hub implementation
- `revealing_the_kingdom__2_.jsx` — V2 monolith with real Gate + Field Guide
- `course_journey_and_hero.jsx` — strongest Course implementation

---

## How to use this handoff

1. **Upload this file** (`PHASE_2_HANDOFF.md`) to the new conversation, along with the IMPLEMENTATION_PLAN and any other strategy docs you want.
2. **Upload the two smoke-test screenshots** from end of last session (the production smoke test result).
3. Open with: *"Resuming Kingdom Course build. Phase 2 shipped — see PHASE_2_HANDOFF.md for full context. The two screenshots show the L.10 production smoke test on `kingdomcourse.org`. Please evaluate them and confirm L.10 pass/fail."*

That's it. Zero re-explaining required.

---

*Salus animarum suprema lex.*
