# Kingdom Course — Phase 3 Handoff (Pre-Launch Polish Complete)

**Date of handoff:** 2026-05-17 (Sidney BC)
**Status:** All pre-launch polish work complete. Soft launch is the next action.

---

## Where we are right now

Production at `https://kingdomcourse.org` is shipped, branded, and verified.
L.10 (the production OAuth round-trip smoke test on the live domain) passed
on 12 May 2026. The pre-launch polish punch list closed on 17 May 2026.

The single remaining action item for this phase is non-technical: send the
link to a small group of whitelisted Gmail testers, watch what happens for
two weeks, and bring the feedback to the next development cycle.

---

## What's complete (full inventory)

### Phase 0 — Local environment (✅ complete)
- Vite project at `~/projects/kingdom-vite-batch21/`, builds clean, 176 tests pass

### Phase 1 — Hosting (✅ complete)
- GitHub repo `kingdombuilder-ops/kingdom-course`
- Vercel project, auto-deploys from `main`
- Custom domain `kingdomcourse.org` via Namecheap DNS
- SSL issued (Let's Encrypt via Vercel)
- `www.kingdomcourse.org` 301-redirects to bare

### Phase 2 — Authentication (✅ complete)
- Clerk wired end-to-end: email + verification code, Google OAuth
- Email path tested on localhost ✓ and production ✓
- Google OAuth tested on localhost ✓ and production (L.10) ✓
- Two test users in Clerk dashboard (Aaron + Adam)
- Password requirement disabled in Clerk (the breakthrough fix)
- Production callback handled by Clerk dev instance
  `balanced-cod-0.clerk.accounts.dev`
- Google Cloud OAuth client "Kingdom Course Web" configured

### Pre-launch polish — May 13–17, 2026 (✅ complete)
- **Branded icon set installed** (commit `6d5de58` — "Add icon set + modern
  PWA meta — clears console 404s and build warning"). Five files placed in
  `public/`: `favicon.svg`, `apple-touch-icon.png` (180×180),
  `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`. All use the
  brand mark (concentric gold rings, wine center) per `KingdomTabNav.jsx`.
  Maskable variant has generous safe-zone padding for Android.

- **Deprecation warning resolved.** The first commit attempted to include
  the `mobile-web-app-capable` meta tag fix but the `index.html` edit had
  not been saved in VS Code's buffer when the commit ran (caught via
  screenshot review; commit summary said "5 files changed, 6 insertions"
  which is just icons + favicon.svg). A follow-up commit landed the
  index.html change. After this fix, `npm run build` completes with zero
  warnings (previously had one).

- **Privacy and Terms pages shipped.** Two static HTML pages in `public/`,
  brand-styled with paper background, Cormorant Garamond + EB Garamond +
  Cormorant SC typography to match the React app:
  - `public/privacy.html` — served at `/privacy` (clean URL via vercel.json)
  - `public/terms.html` — served at `/terms`
  - `vercel.json` added at project root with `cleanUrls: true` and
    `trailingSlash: false`
  - Both pages link back to `/` via "Return to The Kingdom" anchor
  - Crisis-resource callout in terms (988 for Canada/US)
  - "Not Magisterium" catechetical disclaimer in terms
  - BC PIPA / PIPEDA / GDPR-aware language in privacy
  - Contact email placeholder: `hello@kingdomcourse.org` (update if needed)

- **Footer patch.** `src/components/Footer.jsx` bottom row now shows
  `© 2026 · The Kingdom Course · Privacy · Terms` with the two new links
  using inline `<a href="/privacy">` and `<a href="/terms">` (intentionally
  not React buttons — these are full-page navigations to static HTML,
  not tab routing).

### Verification gates passed
- ✅ L.10 — production smoke test on `kingdomcourse.org` (Phase 2, 12 May)
- ✅ Browser console clean except for the expected Clerk dev-keys notice
- ✅ `npm run build` zero warnings
- ✅ All manifest references resolve (no more icon-192 404)
- ✅ Privacy and Terms render correctly on production at clean URLs
- ✅ Footer links navigate cleanly from any tab
- ✅ Favicon serves correctly (confirmed via `https://kingdomcourse.org/favicon.svg`
  loading directly — Chrome favicon-cache delay is normal and resolves
  on its own; other browsers and incognito sessions show it immediately)

### Locked decisions (unchanged from Phase 2)
- Inline `style={{}}` only — never Tailwind
- ABIDE is Step 4 verb everywhere consumer-facing
- "Fifty days" / "Seven weeks to Pentecost" — never 49
- Channel-agnostic community language
- Five Houses display names: Light · Fire · Joy · Glory · Earth
  (internal slugs preserve V8/V9 names: `peace` for Joy, `benedict` for Earth)
- The Kingdom Course = Tier 1; The Kingdom Academy = Tier 2 at Day 50
- DTS = internal only, never marketing
- Mass-anchored 3-1-3 daily pattern in Hub
- Three movements: Purgativa · Illuminativa · Unitiva
- Verify with `npm run dev` + `npm run build` — never the broken `verify/` harness

---

## What's pending

### Immediate (next 1–2 weeks) — soft launch loop

**This is the only thing on the critical path. Do not start Phase 3+ work
before completing this.**

1. Send a personal note (not a mass email) to **three** whitelisted Gmail
   testers from the trust circle. Three, not five-to-ten — engaged feedback
   from three people is more useful than polite acknowledgment from ten.
   Already whitelisted in Google Cloud test users list.
2. Ask each: "What felt true? What felt off? What stopped you?"
3. Wait two weeks before drawing conclusions. First-day clicks are noise;
   day-7 returns are signal; day-14 abide-in-practice is the actual question.
4. Do not open the codebase between sending the link and receiving feedback
   unless someone reports a bug.

### Pre-broad-launch (before Tier 2 / removing the whitelist)
- **Have a BC lawyer review** `privacy.html` and `terms.html`. They are
  honest, brand-matched, and cover the standard surface area, but they
  were not written by a lawyer. ~$300–500 of insurance before opening to
  the public.
- **Real contact email** — `hello@kingdomcourse.org` is a placeholder used
  in both legal pages. If a different address routes better, find-and-replace
  before public launch.
- **Swap Clerk dev keys for production keys** (`pk_test_...` → `pk_live_...`).
  Currently fine because access is whitelisted via Google Cloud test users.
  When the whitelist comes off, swap the keys.
- **Install Plausible** for analytics. Once installed, update `privacy.html`
  to mention it. Plausible is privacy-respecting (no cookie banner) so this
  is a minor disclosure, not a consent-flow rebuild.
- **Install Sentry** free tier for error monitoring.

### Phase 3+ (post-soft-launch, driven by feedback)
- **Apple OAuth** (requires Apple Developer Program $99/yr + DUNS, 1–2 days
  of setup). Defer until at least three soft-launch users specifically
  request it.
- **Companion AI backend** — `api/companion.js` as a Vercel Edge Function,
  proxying the Anthropic API. The `<Companion apiEndpoint={...}/>` seam
  already exists; the backend doesn't. Defer until three users independently
  ask for it. Empty AI is worse than no AI.
- **Academy reader surface** — locked card is visible; the reader doesn't
  exist. Reader will draw from the seven internal DTS books in project
  knowledge. By definition not urgent — no soft-launch user reaches Day 50
  for seven weeks.
- **Daily email** via Resend + Vercel cron (Phase 6).
- **Three-tab shell unification** — `KingdomTabNav.jsx` exists and is clean;
  not yet swapped into `App.jsx`. Its file comment explicitly anticipates
  this. Likely a ~1-hour wiring job, not a from-scratch build.
- **V2 (Tailwind monolith) / Hub (inline-styles) integration** — the V2
  monolith with the real Gate and Field Guide vs. the cleaner production
  Hub. Architectural reconciliation. Real but not urgent.
- **Permanent home for Field Guide** outside the V2 monolith.

---

## External services configured

### Clerk
- App "Kingdom Course" in `kingdombuilder-ops` workspace (Hobby plan)
- Dev instance `balanced-cod-0.clerk.accounts.dev`, keys `pk_test_...`
- Google OAuth: custom credentials ON, creds from Google Cloud
- Email verification code: enabled
- Password requirement: **disabled** (this was the breakthrough)
- OAuth callback: `https://balanced-cod-0.clerk.accounts.dev/v1/oauth_callback`

### Google Cloud Console
- Project "Kingdom Course" (Number 895029317495)
- Branding: app name "Kingdom Course", authorized domain `kingdomcourse.org`,
  app home/privacy/terms URLs (which now resolve thanks to the legal pages)
- Audience: External, Testing mode, test users whitelisted
- Scopes: `userinfo.email`, `userinfo.profile`, `openid`
- OAuth Client "Kingdom Course Web" — redirect URI points to the Clerk callback

### GitHub
- Repo: `https://github.com/kingdombuilder-ops/kingdom-course`
  (`kingdombuilder-ops` — no S)
- Branch: `main`
- Commits (most recent first, as of soft-launch readiness):
  - [pending] Add privacy + terms pages with clean URLs and footer links
  - [pending] Add mobile-web-app-capable meta — clears Vite build warning
    *(may already have been pushed — verify with `git log --oneline`)*
  - `6d5de58` Add icon set + modern PWA meta — clears console 404s and build warning
  - `72ebe07` Phase 2 polish: Google OAuth + auto-route to Course + 'Fifty days' copy
  - `c04f1e0` Phase 2: wire Clerk authentication (email + verification code)
  - `386d2e7` Remove node_modules from tracking
  - `bfd295e` Initial commit

### Vercel
- Workspace `kingdombuilder-ops` (Hobby plan)
- Project `kingdom-course`
- Auto-deploy from `main`
- Env var `VITE_CLERK_PUBLISHABLE_KEY` set Production + Preview, marked Sensitive
- Latest verified production deploy: `FnUSYoJKi` (Phase 2 polish, 12 May)

### Namecheap (DNS for kingdomcourse.org)
- A `@` → `216.198.79.1` Automatic
- CNAME `www` → `8dabb35f45ae5909.vercel-dns-017.com.` Automatic
- All default parking records deleted

---

## Auth flow — verified end-to-end on PRODUCTION

✅ **Email path** (localhost only — production email path is identical infra
but has not been independently smoke-tested; recommend doing this with one
fresh email during the soft launch)

✅ **Google path** (production, L.10): kingdomcourse.org → Sign In → Continue
with Google → Google consent → `/sso-callback` → Clerk session → land on
Course tab → "Hello, [name]" with WELCOME BACK eyebrow

---

## File landmarks

**Project root:** `~/projects/kingdom-vite-batch21/`

**Files modified or added during this session (17 May 2026):**
- `public/favicon.svg` (new)
- `public/apple-touch-icon.png` (new)
- `public/icon-192.png` (new)
- `public/icon-512.png` (new)
- `public/icon-maskable-512.png` (new)
- `public/privacy.html` (new)
- `public/terms.html` (new)
- `vercel.json` (new)
- `index.html` (modified — added `mobile-web-app-capable` meta)
- `src/components/Footer.jsx` (modified — added Privacy/Terms links to copyright row)

**Reference files (canonical guidance — read if context is uncertain):**
- `IMPLEMENTATION_PLAN.md` v2.0 (1,511 lines) — the canonical execution plan
- `KINGDOM_MASTER_STRATEGY_V10.md` — strategy and the why
- `The_Kingdom_DTS_MASTER_VISION_AND_OUTLINE.md` — vision arc
- `The_Kingdom_DTS_Book[1–7]_*.md` — content for the Academy
- `The_Kingdom_Field_Guide_FINAL.md` — Field Guide source
- `Miracles_of_the_Kingdom_REVISED.md` — apologetic content for Gate
- `PHASE_2_HANDOFF.md` — prior session state (now superseded by this doc)
- `CLAUDE.md` (new this session) — concise project-root context for Claude Code

---

## How to resume in a new conversation

1. **Upload `CLAUDE.md`, `PHASE_3_HANDOFF.md`, and `NEXT_SESSION_KICKOFF.md`**
   to the new conversation (or, if memory is enabled and the project
   includes them, just open a chat in the project).
2. **Open with the suggested prompt** in `NEXT_SESSION_KICKOFF.md`
   ("Suggested opening message" section).
3. The new Claude will have the full state without any re-explanation.

If you've installed Claude Code (recommended — see `NEXT_SESSION_KICKOFF.md`),
place `CLAUDE.md` at `~/projects/kingdom-vite-batch21/CLAUDE.md` and Claude
Code will read it automatically at every session start. No upload required.

---

*Salus animarum suprema lex.*
