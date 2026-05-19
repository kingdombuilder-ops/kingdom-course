# Kingdom Course — Phase 3 Handoff (Companion Build, Pre-Soft-Launch)

**Date of handoff:** 2026-05-19 (Sidney BC)
**Status:** FINAL_CONTENT_REVISION_PLAN substantially complete
(Tiers 0–3, §4.2, §4.3, §4.4, §5.1 shipped; only §4.1 sentence-level
audit remains, queued for a fresh-eyes session). Soft-launch
sequencing deliberately revised: the Companion AI backend builds
BEFORE the three-reviewer soft launch begins, because the reviewers
will focus their feedback on Companion behavior.

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

### FINAL_CONTENT_REVISION_PLAN execution — May 18–19, 2026

`docs/execution/FINAL_CONTENT_REVISION_PLAN.md` was executed in tier
order over twenty-plus commits.

**Tier 0** (factual corrections) — Pope Francis → Leo XIV across all
surfaces; Saint Carlo Acutis and Saint Pier Giorgio Frassati canonized;
monthly papal intentions refreshed to Leo XIV's 2026 list.

**Tier 1** (12 structural revisions) — Hero promoted "The Kingdom of
Eternal Life" to lead display headline (ink) + italic gold-3 reframing
pattern; Living Evidence section with verified 2025 conversion
statistics; reader-types 3-column responsive grid; Day 2+ signup gate;
reading-container 720px; step card polish; Earth as 5th House across
all five consumer surfaces; "Seven Steps" standardized as canonical
frame ("Seven Keys" retired).

**Tier 2** (Hub) — BUILD day-of-week rotation; Marian Saturday
surfaces; gentle 35-day Confession prompt.

**Tier 3** (vocabulary lock-list compliance) — "Fifty days" never
"forty-nine days"; broader lock-list audit clean.

**Tier 4** —
  - §4.2 known-issues table closed (Hub SEE "kingdom day" first-time
    gloss landed, `01466b7`)
  - §4.3 AI disclosure footer on every Day reading, linking to
    `/methodology` (`992de46`)
  - §4.4 methodology mark in chrome footer — **two beats only**
    (*"AI-presented · Magisterium-grounded"*, `a36397d`). The
    Appendix E full mark's other two beats are deferred per the
    Credentialing-discipline policy added to CLAUDE.md this commit.
  - §4.1 sentence-level prose audit — **deferred** to a dedicated
    pre-launch read-through session. Different muscle than the
    structural work; not launch-blocking.

**Tier 5 §5.1** — static `/methodology` page at
`public/methodology.html` (`f638ddf`), adapted from
STRATEGIC_ARCHITECTURE Appendix D for credentialing honesty. The
verbatim source asserted "every citation is verified," "reviewed by
a named theological advisory," and "with verified citation" — all
three were dropped because the engineering and institutional
structures that justify them aren't in place. A new "What we're
working toward" section names the gaps explicitly.

**Mobile chrome + date-resolution infrastructure** (parallel work):
  - Mobile nav fits at 320–375px CSS pixels after three rounds of
    label-hiding and padding compaction
  - Mobile horizontal-scroll bug fixed (global `overflow-x: hidden` +
    per-section containment on every Gospel-page surface)
  - Floating Companion (FAB) retired in production — redundant with
    the nav's "Ask" button on every tab; component preserved for
    re-enable when the nav simplifies
  - Hub date resolution: season-aware fallback in `liturgical.js`
    (Easter/Pentecost from Gauss's algorithm); CHURCH_TODAY converted
    to Proxy so every property access re-resolves today's date (no
    module-load staleness on stale tabs)

**Footer.jsx working-tree drift** (May 19) — observed `<a"p` typo in
working tree only; HEAD always clean (`git show HEAD` confirmed);
Vercel builds from HEAD so production was never affected. Edit reverted
working tree to match HEAD. `git stash list` empty, `git reflog` shows
clean linear history; no stranded stash or rebase to explain. Not
opened for deeper investigation.

**Verify state on real iPhone:** every commit in this run except
`01466b7` (Hub SEE gloss, single-line content edit) is
operator-verified. Risk on `01466b7` is low.

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

### Immediate — Companion AI backend (CRITICAL PATH, revised)

**Sequencing revision (deliberate, not an abandonment of the prior
discipline).** The original "do not start Phase 3+ work before soft
launch" rule still holds for SEO library, audio podcast, YouTube,
short-form video, native app wrapper, MCP server, voice surfaces,
and multilingual — none of those begin until soft-launch feedback is
digested. But the **Companion AI backend is moved into critical path
BEFORE the three-reviewer soft launch**: the three reviewers will
specifically evaluate Companion behavior, and shipping a stub would
collapse their feedback to "AI not ready" — losing the harder
feedback we can't predict.

Build order (per MASTER_SPECIFICATION §5 + §3.8):

1. Backend infrastructure — ANTHROPIC_API_KEY and CLERK_SECRET_KEY
   in Vercel env vars (Production + Preview, Sensitive); Vercel KV
   provisioned; `@anthropic-ai/sdk` installed
2. `api/companion.js` Edge Function — Clerk session auth, SSE
   streaming from Anthropic, `GET /api/companion/health`,
   placeholder system prompt; model per CLAUDE.md (Sonnet default,
   `claude-sonnet-4-6` pinned)
3. System prompt v1 at `api/companion/system-prompt.js`, versioned,
   incorporating §5.2 identity / grounding / tone / vocabulary
   lock / limits / parish bridge
4. Crisis detection per §5.3 — pattern pre-filter, crisis-response
   template (988 for US/CA), short-circuit before the Anthropic
   call. QA against §5.3 test inputs before merge. Safety-critical;
   not abbreviated.
5. Rate limiting via Vercel KV per §5.4 (30/hr, 100/day per user;
   5/hr per IP for unauthenticated)
6. Per-tab context awareness per §5.5
7. Wire `src/components/Companion.jsx` to the live backend (SSE
   streaming, loading states, graceful degradation)
8. Sentry free tier on the Edge function

**Hard merge constraint.** Commit 7 (wire `Companion.jsx` to the live
backend) cannot merge until BOTH Commit 4 (crisis detection) AND
Commit 5 (rate limiting) are landed. Before Commit 7 the endpoint
exists but is not user-exposed; either gate held open during that
window is fine. After Commit 7, both gates are user-exposed and
must be operational. This is a hard constraint, not a guideline.

After Companion ships and is operator-verified, the three-reviewer
soft launch begins. Reviewer prompt focuses on Companion:
*"Engage the Companion. Tell me what felt true, what felt off, what
stopped you."* Then the original soft-launch loop resumes:

  - Three reviewers receive personal-note invites
  - Two-week feedback window
  - First-day clicks are noise; day-7 returns are signal; day-14
    abide-in-practice is the actual question
  - Codebase closed during the feedback window unless someone reports
    a bug

**Methodology-mark policy when Companion ships:** the chrome footer
mark stays at two beats (*"AI-presented · Magisterium-grounded"*).
The three-reviewer soft launch is *usability testing*, not the named
ongoing theological-review structure that the "Theologically
reviewed" restoration condition requires. The "Citation-verified"
beat lifts when engineered citation verification (MASTER_SPEC §1.6 /
CLAUDE.md feature 6) is operating — which by spec gates Companion
responses, so the natural sequencing is the verification system
immediately after Companion's text path is live. See the
Credentialing-discipline section in CLAUDE.md for the canonical
statement of this policy.

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
