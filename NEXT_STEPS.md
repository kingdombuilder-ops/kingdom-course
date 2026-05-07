# The Kingdom Course — Path to Launch

*The full plan from "scaffold is complete" to "kingdomcourse.org serves real visitors." Written at the close of batch 21. As of this writing: 176/176 tests pass, production build is clean at ~167 KB gz first-paint, every visible feature is migrated, and two integration seams remain — `submitHandler` for SignupModal and `apiEndpoint` for Companion.*

This document is opinionated where it can be and flags the decisions you alone can make. It's ordered by dependency: each phase assumes the previous is done. If a phase is skipped or deferred, the document calls out what breaks.

---

## Where you are now

The Vite scaffold at `/home/claude/kingdom-vite/` (and staged at `/mnt/user-data/outputs/kingdom-vite-batch21/`) is structurally and functionally complete. Specifically:

- Three tabs work end-to-end: Gospel, Course, Kingdom
- Chrome layer is in place: KingdomTabNav, Footer, FloatingCompanion
- All 13 modals migrated, including SignupModal and PassItOn share modal
- Companion AI chat panel runs in stub mode (placeholder reply)
- Course progress, intentions, current user, chosen house all persist to localStorage
- 176 unit tests pass via jsdom + React 18 + `act()`
- Production build is clean — `~167 KB gz first-paint`, lazy chunks for Course (117 KB gz on click) and Gospel (18 KB gz on click)
- Tailwind toolchain removed; build uses inline styles + custom CSS classes
- `IS_DEV` gates the dev preview toggle and HarnessShell so they tree-shake from production
- The Gospel page's first declaration is **The Kingdom of Eternal Life** — eyebrow above the headline, on what the visitor sees first
- The Course content is digital-first: deployments and Sabbath instructions describe walking with others in whatever form God gives (text thread, video call, in-home meal, discipling friendship), with in-person community as the organic fruit of transformation rather than a structural prerequisite the product imposes. The Field Guide's Practice #15 ("How to Walk the Kingdom with Others") teaches the principle. Teaching about parish renewal and Catholic small-group tradition is preserved as catechesis.

Two integration seams remain, both designed as drop-in prop swaps:

```jsx
<SignupModal
  submitHandler={async (data) => { ... }}  // ← swap stub for real auth
/>

<Companion
  apiEndpoint="/api/companion"             // ← swap stub for real backend
/>
```

Everything else is plumbed. The original `the_kingdom.jsx` (13,631 lines) is ready to retire.

---

## Decisions you need to make first

Before any of the phases below begin, settle these. They cascade into every later choice.

| Decision | Options | Recommendation | Why |
|---|---|---|---|
| **Static host** | Vercel · Netlify · Cloudflare Pages · self-host | **Vercel** | Best Vite framework integration, zero-config deploy, generous free tier, automatic HTTPS, edge network. Netlify is a close second; pick whichever you have an account on already. |
| **Auth approach** | Full auth (passwords + sessions) · Magic-link only · Email collection only · None for now | **Magic-link only** | The form already collects email + name + parish. Pair this with [Supabase Auth](https://supabase.com/auth) or [Clerk](https://clerk.com) magic links — no passwords, no password recovery flows, no security exposure. The user's "sign in" is just clicking a link in their email. Matches the project's "tools to the Church's life, not add to it" ethos. |
| **Database (for users + course progress sync)** | Supabase (Postgres) · Firebase · None (localStorage only) | **Supabase** if you want cross-device sync; **none** if localStorage is fine | If a reader signs up on their phone and switches to laptop, do they expect their progress to follow them? If yes → Supabase. If no → keep localStorage and the migration is already done on this front. |
| **Companion backend** | Cloudflare Worker · Vercel Edge Function · Self-hosted Node · None (keep stub) | **Cloudflare Worker** | $5/mo for the paid tier (10M requests), holds the Anthropic API key server-side, simple to deploy. The Worker just forwards Anthropic-shaped requests with the key attached. |
| **Email provider** for daily reading delivery | ConvertKit · Mailchimp · Beehiiv · Resend + custom · None at launch | **ConvertKit** | Has the cleanest "automation sequence" feature for the 49-day Course. Mailchimp works too. If you want full programmatic control, Resend + a small backend cron. None at launch is also valid — ship without daily emails, add them later. |
| **Analytics** | Plausible · Umami (self-hosted) · Google Analytics · None | **Plausible** ($9/mo) | Privacy-respecting, no cookie banner needed in EU, lightweight script. Google Analytics requires cookie consent and feels off-brand. |
| **Error monitoring** | Sentry · LogRocket · None | **Sentry** (free tier) | The free tier covers 5K errors/month — plenty for early days. Catches the things you'd otherwise hear about from confused users. |
| **Domain & DNS** | Already own kingdomcourse.org? | Confirm | If not yet purchased, get it before deploying. |

If you want my single best-bet stack: **Vercel** for hosting, **Supabase** for auth + database (one provider, one bill), **Cloudflare Worker** for the Companion proxy, **ConvertKit** for the daily reading sequence, **Plausible** for analytics, **Sentry** for errors. Total monthly cost at low scale: ~$25/mo. Scales linearly to a few thousand active users without restructuring.

---

## Phase 0 — Pre-flight verification (a few hours)

Before deploying anything, run the app locally and click through every flow. The unit tests prove components mount and callbacks fire; they don't catch typography mistakes, broken hover states, or "this scrolls weird on iPhone."

### Steps

1. **Run dev server.**
   ```bash
   cd /mnt/user-data/outputs/kingdom-vite-batch21
   npm install
   npm run dev
   ```
   Open `http://localhost:5173`. The 5-way preview toggle should be visible top-right, defaulting to Harness.

2. **Toggle to Live mode.** This is what visitors will see.

3. **Walk every flow:**
   - Gate: Hero CTA → Prologue scroll → Trail scroll → click any circle → CircleModal opens → Escape closes → ArrowRight/ArrowLeft navigates between circles → click "Enter the Course" CTA → switches to Course tab
   - Course: Click any week → WeekDetail → click any day → DayReading → mark complete → next day → previous day → back to week → back to overview
   - Kingdom: Click each of the 7 essentials → modal opens → close modal → click Field Guide link → practice list → click a practice → PracticeGuide → back
   - Sign in flow: Click "Sign in" → SignupModal → submit empty (validation) → submit invalid email (validation) → submit valid → modal closes, header now shows "Sign out" → refresh page → still signed in → Sign out → back to "Sign in"
   - Pass it on: Click in nav → modal opens → Copy link → "Copied" check appears for 2 seconds
   - Companion: Click Ask in nav OR floating FAB → panel slides in from right → type a message → Enter → user message appears → "Listening…" pulses → stub reply appears

4. **Mobile viewport.** Open Chrome DevTools, set device to iPhone 13 Pro. Walk the same flows. Check:
   - KingdomTabNav doesn't overflow
   - Course's week/day navigation buttons are reachable
   - CircleModal scrolls correctly inside the viewport
   - Companion panel takes full width on narrow screens

5. **Accessibility quick-pass:**
   - Tab through KingdomTabNav with keyboard — all buttons reachable
   - Open CircleModal, press Escape — closes
   - Companion: press Enter in textarea — sends; Shift+Enter — newline
   - Run Lighthouse in Chrome DevTools — should score 95+ on accessibility (no fix needed if so)

6. **Compare to original.** Pull up the original `the_kingdom.jsx` artifact in another tab/window. Visually compare the same screens side by side. If anything looks wrong, log it for the next iteration. Don't fix in this pass — just record.

### Deliverable

A short list of "found issues" — typos, layout glitches, missing copy, anything visual that diverges from the original. These become the punch-list for a small batch 22 before deploy. Most likely there's nothing; the test harness has been thorough. But this is the cheap step that catches what tests miss.

### Common things this pass typically catches

- A dropcap that didn't migrate cleanly (look at Prologue's first paragraph)
- An icon import that exists but isn't imported (a button shows blank where the icon should be)
- A media-query-dependent layout that worked in the original because of a Tailwind utility now missing (look at the Trail's blueprint grid on mobile)
- A scripture quote with curly-quote characters that got transformed during the migration
- A scrollIntoView call that was preserved but is for an element that no longer exists

If you find one, fix it directly in `/home/claude/kingdom-vite/src/components/...`, re-run the harness (`cd verify && node render-check-deep.mjs`), commit, and re-stage to `/mnt/user-data/outputs/`.

---

## Phase 1 — Initial deployment (one afternoon)

Get the static site live at a Vercel preview URL. No auth, no Companion backend, no email — just the static site visible on the public internet. This proves the build pipeline works and gives you something to share for early feedback.

### Steps

1. **Create a git repo.** If the project isn't already in git:
   ```bash
   cd /mnt/user-data/outputs/kingdom-vite-batch21
   git init
   git add .
   git commit -m "Initial commit — batch 21 scaffold complete"
   ```

2. **Push to GitHub.** Create a repo at `github.com/<you>/kingdom-course` (private to start). Push the local branch.

3. **Connect Vercel.** Go to vercel.com, "Import Git Repository," select the kingdom-course repo. Vercel auto-detects Vite. Settings:
   - **Framework Preset:** Vite (auto-selected)
   - **Build Command:** `npm run build` (auto)
   - **Output Directory:** `dist` (auto)
   - **Install Command:** `npm install` (auto)
   - No environment variables yet

4. **Deploy.** First deploy takes ~1 minute. You get a URL like `kingdom-course-abc123.vercel.app`.

5. **SPA routing.** Add a `vercel.json` at project root for client-side routing fallback (so `/course/week-3` doesn't 404):
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   Commit and push — Vercel auto-redeploys.

6. **Visit the deployed URL** on a real phone. The app should boot directly into Live mode (no preview toggle visible — that was gated behind `IS_DEV` in batch 21). Check that:
   - Tabs work
   - Course progress persists across page refresh (localStorage)
   - Sign-up works in stub mode (persists across refresh)
   - Companion opens and shows the stub reply
   - HTTPS is automatic (Vercel handles it)

7. **Custom domain.** In Vercel project settings → Domains, add `kingdomcourse.org`. Vercel walks you through the DNS records (CNAME or A records pointing to Vercel's edge). Once DNS propagates (1 minute to a few hours), the domain is live.

### Deliverable

`https://kingdomcourse.org` serves the scaffold. Anyone can visit, sign up (stub), walk all three tabs, mark Course days complete, share the link. The Companion answers with the placeholder reply.

This is enough to share with a small circle for early feedback — even before auth and the Companion backend are wired.

### What's NOT working yet at this stage

- Sign-in only works on one device (localStorage, not cross-device)
- Companion gives the same canned reply to everything
- No daily reading emails
- No analytics
- No error monitoring

These are all phase 2+ items.

---

## Phase 2 — Auth integration (one to three days)

Replace SignupModal's stub handler with real auth. The component itself doesn't change; only the prop value changes.

### Recommended path: Supabase + magic links

Supabase has both auth and a Postgres database. Magic links mean no passwords. Free tier covers 50K monthly active users, which is more than enough for early days.

#### Steps

1. **Create a Supabase project** at supabase.com. Note the project URL and anon key.

2. **Install the Supabase client:**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Create `src/auth.js`:**
   ```js
   import { createClient } from '@supabase/supabase-js';

   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
   const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

   /**
    * SignupModal-compatible submit handler. Sends a magic link to the email.
    * Resolves with a partial user object (email only — name + parish stored
    * in our own profiles table after they click the magic link).
    */
   export async function signupWithMagicLink({ email, name, parish }) {
     const { error } = await supabase.auth.signInWithOtp({
       email,
       options: {
         emailRedirectTo: `${window.location.origin}/auth/callback`,
         data: { name, parish },
       },
     });
     if (error) throw error;
     return {
       email,
       name: name || null,
       parish: parish || null,
       signedUpAt: new Date().toISOString(),
       pendingMagicLink: true,
     };
   }

   /** Read the current session, if any. */
   export async function getCurrentUser() {
     const { data: { session } } = await supabase.auth.getSession();
     if (!session) return null;
     const u = session.user;
     return {
       email: u.email,
       name: u.user_metadata?.name || null,
       parish: u.user_metadata?.parish || null,
       signedUpAt: u.created_at,
     };
   }

   /** Subscribe to auth state changes (for live updates). */
   export function onAuthChange(cb) {
     return supabase.auth.onAuthStateChange((_event, session) => {
       if (!session) return cb(null);
       const u = session.user;
       cb({
         email: u.email,
         name: u.user_metadata?.name || null,
         parish: u.user_metadata?.parish || null,
         signedUpAt: u.created_at,
       });
     });
   }

   export async function signOut() {
     await supabase.auth.signOut();
   }
   ```

4. **Update App.jsx** to wire auth into SignupModal and replace the localStorage hydration:
   ```jsx
   import { signupWithMagicLink, getCurrentUser, onAuthChange, signOut } from './auth.js';

   // ... inside App() ...
   const [currentUser, setCurrentUser] = useState(null);
   useEffect(() => {
     getCurrentUser().then(setCurrentUser);
     const { data } = onAuthChange(setCurrentUser);
     return () => data.subscription.unsubscribe();
   }, []);

   const handleSignOut = async () => {
     await signOut();
     setCurrentUser(null);
   };

   // ... in the Live mode JSX ...
   <SignupModal
     open={signupOpen}
     onClose={() => setSignupOpen(false)}
     onSuccess={(partialUser) => {
       // partialUser has pendingMagicLink: true. Show a "check your email"
       // confirmation rather than logging them in immediately.
       setSignupOpen(false);
       // optionally show a toast: "Check your email — click the link to begin"
     }}
     submitHandler={signupWithMagicLink}
   />
   ```

5. **Add the magic-link landing page.** Create `src/components/AuthCallback.jsx` that handles the `/auth/callback` route — Supabase exchanges the token, sets the session, and you redirect them to the Course tab. Or use Supabase's recommended flow which auto-redirects.

6. **Set Vercel environment variables** in project settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

7. **Deploy.** Vercel rebuilds with the env vars baked in.

8. **Test.** Sign up with a real email. Check inbox. Click the magic link. Should land back on the site signed in. Course progress should follow you across devices once you sign up on each.

#### Optional: sync course progress to Supabase

The user's Course progress currently lives in `localStorage`. To sync across devices:

```sql
-- In Supabase SQL editor
create table course_progress (
  user_id uuid references auth.users(id) on delete cascade,
  day_key text not null,  -- e.g. "w3-d2" or "w1-prologue"
  completed_at timestamptz default now(),
  primary key (user_id, day_key)
);

-- RLS so users only see their own progress
alter table course_progress enable row level security;
create policy "users see their own progress"
  on course_progress for all
  using (auth.uid() = user_id);
```

Then in the App, when a day is marked complete, write to both `localStorage` (for offline + speed) and Supabase (for sync). On load, read from Supabase if signed in, fall back to localStorage if not.

This is optional. If you don't ship cross-device sync, every sign-in still works — they just lose progress when switching devices. Some users won't care; some will.

### Deliverable

`https://kingdomcourse.org` accepts real sign-ups. Visitors enter email + name + parish, receive a magic link, click it, return signed in. Their session persists across page reloads. If you implemented progress sync, their day-complete state follows them across devices.

### Cost so far: ~$0/mo (Vercel free + Supabase free).

---

## Phase 3 — Companion backend (one day)

Replace Companion's stub mode with a real Anthropic-backed proxy.

### Cloudflare Worker approach

#### Steps

1. **Get an Anthropic API key.** console.anthropic.com → API Keys. Top up the account with $20 to start.

2. **Install Wrangler** (Cloudflare's CLI):
   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **Create the Worker.** In a new directory:
   ```bash
   mkdir kingdom-companion-proxy
   cd kingdom-companion-proxy
   wrangler init
   ```
   Replace `src/index.js`:
   ```js
   export default {
     async fetch(request, env) {
       // CORS preflight
       if (request.method === 'OPTIONS') {
         return new Response(null, {
           headers: {
             'Access-Control-Allow-Origin': 'https://kingdomcourse.org',
             'Access-Control-Allow-Methods': 'POST, OPTIONS',
             'Access-Control-Allow-Headers': 'Content-Type',
             'Access-Control-Max-Age': '86400',
           },
         });
       }
       if (request.method !== 'POST') {
         return new Response('Method not allowed', { status: 405 });
       }

       // Basic rate limiting via IP (10 req/min per IP)
       const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
       const rateLimitKey = `rl:${ip}:${Math.floor(Date.now() / 60000)}`;
       const count = parseInt((await env.RATE_LIMITS.get(rateLimitKey)) || '0', 10);
       if (count >= 10) {
         return new Response('Rate limit exceeded', {
           status: 429,
           headers: { 'Access-Control-Allow-Origin': 'https://kingdomcourse.org' },
         });
       }
       await env.RATE_LIMITS.put(rateLimitKey, String(count + 1), { expirationTtl: 120 });

       const body = await request.json();

       // Forward to Anthropic with the server-held key
       const response = await fetch('https://api.anthropic.com/v1/messages', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'x-api-key': env.ANTHROPIC_API_KEY,
           'anthropic-version': '2023-06-01',
         },
         body: JSON.stringify(body),
       });

       const data = await response.json();
       return new Response(JSON.stringify(data), {
         status: response.status,
         headers: {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': 'https://kingdomcourse.org',
         },
       });
     },
   };
   ```

4. **Add a KV namespace for rate limiting.** In `wrangler.toml`:
   ```toml
   name = "kingdom-companion-proxy"
   main = "src/index.js"
   compatibility_date = "2024-01-01"

   [[kv_namespaces]]
   binding = "RATE_LIMITS"
   id = "..." # wrangler will generate
   ```
   Run `wrangler kv:namespace create RATE_LIMITS` to get the ID.

5. **Set the Anthropic key as a secret:**
   ```bash
   wrangler secret put ANTHROPIC_API_KEY
   # paste the key when prompted
   ```

6. **Deploy:**
   ```bash
   wrangler deploy
   ```
   You get a URL like `kingdom-companion-proxy.your-subdomain.workers.dev`.

7. **Optional: custom domain.** Map `api.kingdomcourse.org` to the Worker via Cloudflare's domain settings.

8. **Wire into App.jsx:**
   ```jsx
   <Companion
     open={companionOpen}
     onClose={() => setCompanionOpen(false)}
     currentTab={productionTab}
     apiEndpoint="https://api.kingdomcourse.org/companion"
     // or "https://kingdom-companion-proxy.your-subdomain.workers.dev"
   />
   ```

9. **Deploy the frontend.** Vercel rebuilds.

10. **Test.** Open Companion, ask a question, get a real Claude response.

### Cost: $5/mo for Cloudflare Workers paid plan + Anthropic API usage (~$0.003 per 1K input tokens, $0.015 per 1K output for Sonnet 4). Budget $20-50/mo for moderate use.

### Hardening before you sweep this from "works" to "ready"

- Add request validation (reject bodies that don't match the expected shape)
- Add a system-prompt allowlist (so a malicious frontend can't override the Companion's persona to do something else)
- Log requests to Cloudflare Analytics for visibility
- Consider per-user rate limiting (use the Supabase JWT to identify, fall back to IP)

---

## Phase 4 — Daily reading delivery: email + audio (one to two weeks)

The 49-day Course is currently a "click through at your own pace" experience. The original artifact's stated intent is "a reading a day, from anywhere on earth." That implies daily delivery — both written (email) and audio (podcast feed).

**Why audio is not optional.** The most successful Catholic daily-content project of the last decade is Bible in a Year — Father Mike Schmitz and Ascension Press. It's a podcast, not a website. It hit #1 on Apple Podcasts across all categories, three years running. It works because Catholics consume daily content during commutes, workouts, dishes — not by sitting down to read. The Catechism in a Year followed the same model and replicated the success.

If the Course ships as email-only and asks people to read 5-10 minutes of text on their phone every morning at 6 AM, retention will be a small fraction of what it could be with audio. The email is the *anchor* (visual, scannable, archivable); the audio is the *delivery* (where actual consumption happens).

The two pieces are built in parallel:

- **Email sequence** — ConvertKit or equivalent. Pasted text, optional audio link.
- **Audio podcast feed** — 50 episodes (Day 0 = welcome, Days 1-49 = each day's reading). Distributed on Apple Podcasts, Spotify, every podcast platform. Listeners subscribe; Apple/Spotify deliver each day automatically. The content is synchronized with the email sequence.

Two production paths for audio:

1. **TTS at first, human voice later.** ElevenLabs or similar can produce listenable audio for ~$0.20 per 1K characters. The full 49-day Course is roughly 100K characters; total cost ~$20 for first generation, then re-runnable as needed. Quality is high enough for daily content; not concert-quality. **This is the right starting point** — ship audio with the launch, upgrade voices later.

2. **Human narrator from start.** A skilled Catholic narrator (think the voice of Bible in a Year) costs $50-150 per finished hour. The Course is ~5-7 finished hours. Budget $300-1000 for full human production, plus studio time. Better long-term, but a real production project requiring scheduling and revisions. **Worth doing in year 2 once the project has audience and budget.**

### ConvertKit + audio podcast hybrid

#### Steps

1. **Create a ConvertKit account.** convertkit.com — free up to 1,000 subscribers, then $9/mo and up.

2. **Create a tag** called `kingdom-course-active`. This is what triggers the sequence.

3. **Create the sequence.** In ConvertKit → Sequences → New Sequence:
   - 50 emails total (Day 0 = welcome, Days 1-49 = each day's reading)
   - Each email pulls content from the corresponding `SEVEN_WEEKS[w].days[d]` entry
   - Send time: 6 AM in subscriber's timezone (or whatever they prefer)
   - Set "Wait Until" between each email to "1 day"

4. **Copy each day's content into the sequence.** This is tedious but one-time. The content is in `src/data/course.js`. You can either:
   - Write a tiny Node script that reads `course.js` and outputs each day as a separate file you paste into ConvertKit
   - Use ConvertKit's API to programmatically create the sequence (more setup, but reusable)

5. **Wire signup to subscribe to ConvertKit.** Two options:
   - **Server-side (recommended):** Add a Cloudflare Worker endpoint `/subscribe` that takes the user's email + name + parish, calls ConvertKit's API to create the subscriber + tag them with `kingdom-course-active`. SignupModal's `submitHandler` POSTs to this endpoint.
   - **Client-side:** Use ConvertKit's "form" embed or their public API directly. Less secure (API key in browser), but faster to implement.

6. **Update SignupModal's submitHandler:**
   ```js
   async function fullSignup({ email, name, parish }) {
     // 1. Supabase auth (sends magic link)
     await signupWithMagicLink({ email, name, parish });
     // 2. ConvertKit subscription (starts the daily sequence)
     await fetch('https://api.kingdomcourse.org/subscribe', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, name, parish }),
     });
     return { email, name, parish, signedUpAt: new Date().toISOString() };
   }
   ```

7. **Test with your own email.** Sign up. You should receive both the magic link (Supabase) and the welcome email (ConvertKit Day 0).

### Audio podcast feed (parallel to email)

The same 50 days, delivered as a self-hosted podcast feed:

1. **Generate audio for each day.** Run each `SEVEN_WEEKS[w].days[d]` reading through ElevenLabs (or similar). The course content is already structured by `dropcap` + `body` blocks, which converts cleanly to spoken audio. Output 50 MP3 files, ~5-10 minutes each, ~5-15 MB each.

2. **Pick a podcast host.** [Transistor.fm](https://transistor.fm) ($19/mo) or [Captivate](https://captivate.fm) — both handle the RSS feed, distribute to Apple/Spotify/Google/Amazon automatically, give download analytics. Self-hosting via S3 + a Worker generating RSS is possible but the saved $19/mo isn't worth the operational burden.

3. **Publish episodes** with release dates spaced one day apart, starting on the user's signup date. The platforms handle the daily delivery — listeners just see "new episode" each morning.

4. **Cross-link email → podcast.** Each ConvertKit email includes a "Listen instead" link to that day's podcast episode. Each podcast episode shows "Read the text version" linking back to the website. The two delivery modes reinforce each other.

5. **Submit to Apple Podcasts, Spotify, Amazon Music, YouTube Music** during the soft-launch window. All free; takes a few days for approval. Once submitted, all future episodes propagate automatically.

The combined cost: ~$30-50 in TTS generation (one-time) + $19/mo for the podcast host + $9/mo for ConvertKit + the time to QA each generated audio file. The reach: every Catholic who already listens to Bible in a Year, the Rosary in a Year, Catechism in a Year, or any other faith podcast can subscribe and consume the Course exactly the way they consume those — during their morning commute or evening walk.

### Alternative: skip ConvertKit, send daily emails from a Cloudflare Worker cron

If you want full control and lower cost, run a cron Worker that fires daily at 6 AM UTC. It reads who's signed up + how far along they are, and sends each their next email via Resend or Postmark. More engineering, but no ConvertKit dependency. Probably overkill for launch — start with ConvertKit, switch later if needed.

### Deliverable

A new visitor signs up. They get a welcome email (Day 0). The next morning at 6 AM they get Day 1. They read it (in the email or click through to the site). The next morning, Day 2. Forty-nine days later, the Sending. The visitor walks the Course on schedule, even if they never return to the site between days.

---

## Phase 5 — Operational concerns (a day or two scattered)

The things you don't notice until they're missing.

### Analytics — Plausible

1. Sign up at plausible.io ($9/mo for one site, more if you want subdomains).
2. Add the script tag to `index.html`:
   ```html
   <script defer data-domain="kingdomcourse.org" src="https://plausible.io/js/script.js"></script>
   ```
3. Define custom events for key flows:
   - `gate_circle_opened` (which circle)
   - `course_day_completed` (which day)
   - `signup_started` / `signup_completed`
   - `companion_message_sent`
   - `share_clicked`

   In components, fire events:
   ```js
   if (window.plausible) window.plausible('course_day_completed', { props: { day: dayKey } });
   ```

4. After a week, the Plausible dashboard tells you: how many people land, how many click into the Course, where they drop off, which circles get opened, how many sign up.

### Error monitoring — Sentry

1. `npm install @sentry/react`
2. Initialize in `src/main.jsx`:
   ```js
   import * as Sentry from '@sentry/react';
   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     enabled: import.meta.env.PROD,
     tracesSampleRate: 0.1,
   });
   ```
3. Wrap App in a Sentry error boundary.
4. Push to Vercel; first error shows up in Sentry dashboard within minutes of occurring.

### Legal — Privacy policy + terms

You're collecting email + name + parish + (optionally) Course progress. That's personal data. You need a privacy policy that:
- Names what's collected (the three fields + page analytics)
- Names who has access (you, ConvertKit, Supabase, Plausible, Sentry, Anthropic)
- Names how to delete (email you, you delete from Supabase + ConvertKit)
- Names the data controller (you / your organization / the parish)
- Discloses cookies (Supabase session cookie, that's it if you use Plausible)

Free template generators: [iubenda.com](https://iubenda.com), [termly.io](https://termly.io). Or have a lawyer write one — they're not expensive for a small project (~$200-500).

Add `/privacy` and `/terms` routes to the app. Link from the Footer. Currently the Footer has a "Reference" column — add a "Legal" column with these links.

### EU cookie consent

If you're using Plausible (cookieless) and Supabase (only sets a session cookie post-sign-in), you may not need a cookie banner under GDPR — those are essential cookies. **But** consult a lawyer or use a tool like Cookiebot/iubenda that handles the determination automatically.

### SEO basics for the Gate

The Gospel/Gate is the public-facing page. It should rank for searches like "evidence for Catholic Church," "is Christianity true," etc.

1. Add meta tags to `index.html`. The copy below leads with the page's own first declaration ("The Kingdom of Eternal Life"), so search results and link-preview cards match what the visitor sees on arrival:
   ```html
   <title>The Kingdom of Eternal Life — The Kingdom Course</title>
   <meta name="description" content="The kingdom of eternal life. The greatest message in history, verified by the greatest body of evidence on earth. Nine circles, then a 50-day path. Free." />
   <meta property="og:title" content="The Kingdom of Eternal Life" />
   <meta property="og:description" content="The greatest message in history, verified by the greatest body of evidence on earth. The gate is open." />
   <meta property="og:image" content="https://kingdomcourse.org/og-image.jpg" />
   <meta property="og:url" content="https://kingdomcourse.org" />
   <meta name="twitter:card" content="summary_large_image" />
   ```

2. Create the OG image — 1200×630 PNG. The image should echo the page's first declaration: brand mark, then "The Kingdom of Eternal Life" set in Cormorant SC, then the secondary line "The greatest announcement in history" in italic Cormorant Garamond. Save as `public/og-image.jpg`.

3. Create `public/robots.txt`:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://kingdomcourse.org/sitemap.xml
   ```

4. Create `public/sitemap.xml` (or generate at build time):
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url><loc>https://kingdomcourse.org/</loc><priority>1.0</priority></url>
     <url><loc>https://kingdomcourse.org/course</loc><priority>0.8</priority></url>
     <url><loc>https://kingdomcourse.org/kingdom</loc><priority>0.8</priority></url>
   </urlset>
   ```

5. Submit to Google Search Console once deployed.

### A custom 404 page

Right now the SPA fallback rewrites all paths to `index.html`. That works, but a deliberate 404 component for genuine bad routes is better. Add a simple component that shows "This page is not part of the kingdom yet" with a link back to home, and handle unknown routes in App.jsx.

---

## Phase 6 — Soft launch (one week)

Don't announce. Don't share publicly. Send the URL to 10-30 people who will give you honest feedback.

### Who to send to

- 5 people who'll never tell you it's bad (loved ones)
- 5 people who'll tell you it's bad if it is (friends with taste)
- 5 people who fit the target audience (Catholics curious about apologetics or formation)
- 5 people who don't fit (skeptics, lapsed Catholics, non-Christians) — you want to know how the Gate reads to them
- 5 people you respect technically (other engineers / designers)

Ask them three questions:
1. What did you actually read or use? (vs. just scroll past)
2. What confused you?
3. What would you change first?

### Track in Plausible

- Total visitors over the week
- Bounce rate on the Gate
- How many opened any circle
- How many made it past the Trail
- How many signed up
- How many opened the Companion
- How many returned for Day 2

If bounce rate is over 80% on the Gate, the headline isn't working. If circle-opens are under 30%, the SVG isn't reading as interactive. If signup rate from "made it to GateInvitation" is under 20%, the form is too high-friction (or the value prop isn't clear).

### Iterate

Based on feedback, do one focused round of changes. Don't add features yet — fix what's confusing or broken. Maybe a half day to a couple days of work.

---

## Phase 7 — Public launch (one day, lots of nervous energy)

You've fixed the soft-launch issues. The site is solid. Now you tell people.

### Pre-launch checklist

- [ ] Privacy policy and terms linked from Footer
- [ ] OG image and meta tags rendering correctly (test with [opengraph.dev](https://opengraph.dev))
- [ ] robots.txt + sitemap.xml live
- [ ] Submitted to Google Search Console
- [ ] Plausible reporting custom events correctly
- [ ] Sentry receiving errors (intentionally break something on a preview deploy to confirm)
- [ ] Mobile experience tested on a real iPhone and a real Android
- [ ] All three tab views and 13 modals walked through one final time
- [ ] Magic link emails arriving in inbox (not spam) for major providers (Gmail, Outlook, iCloud, Yahoo)
- [ ] Daily reading sequence emails tested through Day 3+
- [ ] Companion responding within 5 seconds (set a timeout in Companion if not — show "Try again")
- [ ] Pinned a `dist` snapshot so you can rollback fast
- [ ] Backup of Supabase data taken
- [ ] You know how to disable signup (in case the magic link provider breaks) — comment out submitHandler, falls back to stub
- [ ] You know how to disable Companion (set `apiEndpoint={undefined}`, falls back to stub)

### Where to launch

The Kingdom Course is a digital-formation product. It scales the way Hallow, Bible in a Year, Headspace, and Duolingo scale — through digital distribution channels, not parish-by-parish rollout. Launch goes to where seekers, formed Catholics, and lapsed Catholics already spend their attention online.

**Catholic media + social** (the primary channels):
- Word on Fire's communities (Bishop Barron's audience)
- Catholic Twitter/X — particularly accounts that retweet apologetic content
- The Pints with Aquinas listener community
- Strange Notions (Catholic apologetics audience)
- /r/Catholicism on Reddit (read their rules first; mods are strict on self-promotion)
- Catholic newsletters where you have a connection
- Catholic podcasts willing to mention/feature the launch — cold outreach to ~30 podcast hosts; expect 3-5 yes responses
- Instagram and TikTok Catholic-creator accounts who occasionally amplify aligned projects

**Search and content discovery** (the slow-compounding channel):
- The Gate's apologetic content is SEO-shaped. "Evidence for Catholic Church," "is Christianity true," "why I came back to the Catholic faith" — these are real search queries with real volume. The Gospel page's editorial substance, properly meta-tagged and indexed (Phase 5), will compound for years.
- Long-form Catholic content ranks well because the competitive set is small. The Field Guide's 22 practices are individually search-targets ("how to pray Lectio Divina," "what is the Examen," "how to pray the Rosary"). Each practice page is a doorway.

**Optional, only if natural connections exist:**
- Direct outreach to parishes, diocesan offices of evangelization, Catholic schools, religious orders. This is fine to do *if* you have existing relationships and time. It's not the project's primary channel — the project scales digitally — but a parish that adopts the Course as its RCIA prep brings 50-500 souls per cycle and is worth the effort if the door is already open. Don't build the strategy around it.

**Probably not where to launch:**
- HackerNews (wrong audience; will get torn apart for the apologetic claims)
- Product Hunt (wrong audience; this isn't a SaaS product)
- Generic Christian platforms (the project's Catholic specificity is a strength; don't dilute)

### What to say

Lead with the gift, not the project. The site is free. There's nothing to buy. The audience for Catholic apologetics + 49-day formation course is large but soft-spoken — they'll find the page if it shows up in front of them once or twice. Don't oversell.

Sample announcement: "I've been working on this for [months]. It's free. Three tabs: an apologetic, a 50-day course, and a daily hub. Walk it if it serves you. Pass it on."

Then go quiet and let it spread or not spread on its own merits.

---

## Phase 8 — Operational maintenance (ongoing)

After launch, the work shifts from building to keeping running.

### Weekly

- Check Plausible dashboard — any unusual drop in traffic?
- Check Sentry — any new error patterns? Triage.
- Check Supabase auth logs — anyone struggling to sign in?
- Check ConvertKit deliverability — emails landing in spam?

### Monthly

- Anthropic API usage — under budget?
- Refund / scale down providers if over-provisioned
- Read the past month's sign-up names and parishes — pray for them by name
- Check if the Companion's stub fallback is firing (logged in Sentry) — that means the proxy is down

### Quarterly

- Reread the Gate. Does the copy still feel sharp? Edit if needed. Content > novelty, always.
- Add seasonal liturgical updates (Lent, Advent — current Course doesn't account for these explicitly, but you might want a banner or modal)
- Review feedback that's accumulated over the quarter

### Yearly

- Renew domain
- Audit dependencies (`npm audit`, address criticals)
- Consider whether the Course content needs revisions

---

## Strategic roadmap — what successful Catholic digital evangelization actually does

The earlier draft of this roadmap had a "things to not build" list shaped by personal preferences ("free for every soul," "tools to the Church's life, not add to it"). Those instincts are noble. Some are right. Several conflict with what the most successful Catholic — and broader — digital formation projects actually do at scale.

The Kingdom Course is a digital formation product. It scales the way Hallow ($50M+ raised, 10M+ downloads, top 10 in App Store), Bible in a Year (#1 podcast across all categories three years running), Headspace and Calm (each tens of millions of users, $100M+ revenue), and Duolingo (500M+ registered users) scale — through digital optimization of solo personalized formation, with optional social/sharing/accountability layers, distributed through the platforms where the audience already lives. Conversion and reach happen through digital channels; in-person sacramental life is what the formation points its users toward, not what the project organizes or depends on.

This is a deliberate strategic choice. Alpha-style parish-by-parish small-group rollout is one valid model for Catholic outreach; it's not the model the Kingdom Course is optimizing for. The deepest formation in the Catholic spiritual tradition has always been the saint's solo daily encounter — Lectio Divina, the Liturgy of the Hours, the daily Examen, sustained prayer over years. Duolingo proved the same shape works at hundreds of millions of users for language learning: the deepest acquisition happens through high-quality solo daily practice with light social affordances, not through small group classes. The Kingdom Course is in that tradition.

### Six patterns the successful digital-formation projects share

1. **Distribution beats polish.** Bible in a Year hit #1 because it was on Apple Podcasts where the audience already lived. Hallow reached top 10 via App Store + Super Bowl + celebrity endorsement. Duolingo's growth is App Store + organic SEO + product virality. Word on Fire's engine is YouTube. A website-only strategy caps reach hard, no matter how beautiful the website.

2. **Audio is primary, not optional.** Catholics consume daily content during commutes, exercise, dishes — not at a screen. Bible in a Year is a podcast first, app second, website third. Hallow is audio-first. The Course as email-only-reading optimizes for the smallest possible audience: people who will sit and read text on a phone every morning.

3. **Solo personalized formation, not group formation, drives sustained transformation at scale.** Duolingo's lesson loop is solo. Headspace's meditation is solo. Hallow's prayer sessions are solo. Bible in a Year listeners are mostly listening alone, in cars or kitchens. Personalization, daily cadence, and quality of content compound. Group formation is a different product (Alpha is excellent at *initial* conversion through small groups; that's a different problem from sustained year-after-year formation). The right social affordances for solo formation are *light* — async accountability, share-your-progress, invite-friends, quiet community presence — not synchronous group meetings.

4. **A funding model is required from day one.** Word on Fire's IGNITE program has 5,000+ monthly recurring donors. Hallow has subscriptions ($69.99/year). Duolingo has Super (~$84/year). Headspace and Calm have subscriptions. Every successful digital formation product has a sustainable funding mechanism. "Free for every soul" without funding means the project quietly dies in year two.

5. **Ecclesial recognition matters for content credibility.** Bishop Barron *is* Word on Fire. Hallow features cardinals and bishops. Bible in a Year is Fr. Mike Schmitz. This is about the trustworthiness of the *content* (does the Catholic-skeptical visitor trust this is faithful, not a quirky personal project?), not about parish-by-parish distribution. The imprimatur and named priest collaborator are reach-credibility moves; they don't require an in-person rollout strategy.

6. **Spanish is launch-day, not year 2.** Roughly 70% of the world's Catholics are non-English-speaking; the largest Catholic populations are Brazil, Mexico, the Philippines. Hallow delayed Spanish until 2022 and named that as a missed opportunity. Duolingo's whole model assumes multi-language from day one. Catholic = universal; an English-only Catholic project leaves most of the audience on the floor.

### What this means for the build queue

#### Near-term essentials (year 1, build into the roadmap)

| Feature | Why | When |
|---|---|---|
| **Audio podcast feed** | Replicate Bible in a Year's distribution. Phase 4 above — audio ships with launch, not later. | Phase 4 (launch) |
| **Spanish translation** | 70% of Catholics worldwide. ~100K characters of Course content; machine translation + a native Spanish-speaking Catholic editor produces a launch-quality Spanish version in 1-2 weeks for a few hundred dollars. | Within 90 days of launch |
| **Kingdom Groups — digital social/accountability layer** | The Course content describes walking with others in whatever form God gives — text thread, weekly call, video small group, in-home meal, discipling friendship. The product's job is to make the *digital pathway* frictionless: invite friends to walk the Course on the same schedule, opt-in shared progress, shared prayer intentions, "we're on Day 17 together" gentle accountability. The form follows the friendship; the product surfaces the digital affordances and lets in-person community emerge organically as the fruit of transformation rather than as a structure the product imposes. | Months 3-6 |
| **Streak + daily progress affordances** | Duolingo's whole engine. Bible in a Year listeners cite streaks as motivating. Hallow uses them. Solo digital formation needs these affordances or retention craters. Design carefully: gentle progress, no shame, easy "missed a day" recovery, no public leaderboards. | Months 2-4 |
| **Push notifications (opt-in, content-bearing)** | Hallow uses them. Duolingo's notification engine is famous. The right design: opt-in, single daily notification at the user's chosen time, contains the actual reading snippet — not "you haven't prayed yet" guilt. | Months 2-4 |
| **Personalization** — the user's house (Light/Fire/Earth/Joy/Glory), their parish, their progress, their prompts — all flow through to a personalized daily experience | Duolingo personalizes every lesson to the learner's level. Hallow personalizes meditation suggestions. The Kingdom Course already has the data layer (HOUSES, current position, completion state) — surface it more aggressively in the daily experience. | Year 1 |
| **YouTube channel** | The Gate's apologetic content is video-shaped. Each of the 9 Circles becomes a 5-10 minute explainer video. Word on Fire's engine is YouTube; reach far exceeds web. | Year 1, after launch traction |
| **Liturgical calendar UI** | Surface today's saint, today's reading color, today's feast in the Kingdom tab. Data exists. | Year 1 |

#### Medium-term (year 2)

| Feature | Why |
|---|---|
| **Native iOS/Android app** | Hallow's growth is App-Store-driven. PWA is a stopgap; a real app reaches a much wider audience, supports proper push, offline audio, App Store discovery. Wait until web traffic justifies the build cost (~$30-80K outsourced, or ~$0 if there's an internal developer). |
| **Audio with human narrator** | Upgrade from TTS to a skilled Catholic narrator. Significantly improves listening retention. |
| **Confession finder** integration with Mass Times API | Field Guide has "find Mass"; extend to Confession. Pointer to in-person sacramental life — surfaced as resource, not as required step. |
| **Additional languages** — Portuguese, Italian, Polish, Tagalog | After Spanish proves the localization pipeline. |
| **AI-personalized Companion** | Once the proxy backend is wired (Phase 3), the Companion can start personalizing answers to the user's progress, current circle, current week — without claiming to be spiritual direction. |

#### Things to build carefully (revised from "don't build")

The earlier list was too absolute. Looking at what successful digital-formation peers actually do:

| Item | The honest professional view |
|---|---|
| **Forums / discussion threads** | Still a no. Even at peer-product scale, public forums become moderation burdens and theological battlegrounds. The right social texture for Catholic formation is small invite-only circles walking the Course together — text threads, video calls, in-person where given — not open public forums. |
| **Streaks, badges, progress indicators** | **Build, with care.** Duolingo's whole product. Hallow uses them. Bible in a Year listeners cite them as motivating. Design rules: no public leaderboards (formation isn't competitive); gentle missed-day recovery (no shame); progress visualization that celebrates faithfulness, not performance. The earlier "don't build" was wrong. |
| **Push notifications** | **Build, with care.** Hallow uses them; Duolingo's whole retention engine is push. Design rules: opt-in only; one per day at the user's chosen time; the notification contains substance (today's reading title or a quote), not a guilt prompt. |
| **Premium tier / paid subscription** | The genuinely contested one. The Gate promises "Free, for every soul on earth." Two viable resolutions: (1) **Word on Fire IGNITE model** — user-facing 100% free forever, sustained by donor base. (2) **Hallow freemium** — free tier covers Gate + Course + basic audio, premium ($60-100/yr) unlocks AI Companion at scale, human-narrator audio, advanced personalization, Kingdom Groups facilitator tools; with scholarship path that means no one who can't pay sees a paywall. Both preserve the "free for every soul" promise. **The IGNITE model is simpler and matches Word on Fire / Bible in a Year. The Hallow freemium model raises more sustainably and gives users skin-in-the-game retention benefits Hallow's data shows are real (2.4x prayer habit formation).** Pick one before public launch. |
| **Social login** (Google/Apple) | Soft no for now. Magic links are simpler. Revisit if signup-friction data shows people abandoning the email step. Apple Sign-In is required if you ship a native iOS app — plan for it then. |
| **Companion as "spiritual director"** | Hard no, with theological backing. America Magazine's critique of Hallow specifically warns: "even the best-designed algorithms are unlikely to tend to the human soul adequately." The Companion is a helpful guide that points users toward Confession, real spiritual direction, and the sacramental life. It does not pretend to be those things. |
| **AI-generated sacred images** | Hard no. Catholic visual tradition is real art by real artists. Use existing iconography (public domain works of saints, real Vatican art, real cathedral photography) and original photography commissioned from Catholic photographers when needed. |

### What the project points its users toward

The Kingdom Course is digital. It is also explicitly Catholic — which means at every appropriate moment, the formation should point users toward the sacramental life that lives outside the app:

- The Field Guide has "Find Mass" as a practice. Surface this prominently for users in their first weeks.
- The Course's daily readings reference Confession, the Eucharist, anointing, Marian devotion — naturally, as part of the formation, not as obligations.
- The Companion, when wired to a real backend, suggests in-person resources when appropriate (a question about marriage prep → suggest contacting a priest; a question about grief → suggest pastoral counsel).
- The Sending Day at the end of the Course explicitly commissions the user toward life in their local Church.
- A "Find a parish" tool in the Field Guide — global Mass times API integration — makes the in-person step one tap away.

The project does not organize the user's parish life, schedule meetings, broker spiritual directors, or facilitate retreats. It points; it doesn't run. Users who want to take the next step into in-person community can — and the digital experience makes that next step easy to find. But the in-person life is the user's own work in their own parish, not a feature of this product.

---

## Distribution beyond the website

The current scaffold is a website at kingdomcourse.org. Successful peer projects — Catholic and broader digital formation — are multi-platform:

| Project | Web | Native app | Podcast | YouTube | Notes |
|---|---|---|---|---|---|
| Hallow | yes | iOS + Android (primary) | yes | yes | App-Store-led growth |
| Word on Fire | yes | yes | yes | primary engine | YouTube + donor-funded |
| Bible in a Year | minor | via Ascension app | primary engine | yes | Podcast-led growth |
| Duolingo (non-Catholic ref) | yes | iOS + Android (primary) | minor | yes | App-Store + push notification engine |
| Headspace / Calm (non-Catholic ref) | yes | iOS + Android (primary) | yes | yes | Subscription-funded |

The Kingdom Course should plan to be present on at least four channels within 18 months of launch:

1. **Web** (already shipped)
2. **Podcast feed** (Phase 4 above; launch-day)
3. **YouTube** (year 1, after web traction)
4. **Native app** (year 2, when web/podcast metrics justify the build — this is when the project's growth ceiling really lifts)

A reasonable production cadence for YouTube: one video per circle (9 total, each ~5-10 minutes); release one per week starting at launch; total 9 weeks of content. Format: animated text + voiceover, à la Fr. Mike's "Bible in 10 Minutes" (358K views in 24 hours). Production cost per video: ~$200-500 if outsourced to a freelance motion designer, ~$0 if you have animation skills. Then once the 9 are out, lean into the Course content: one short video per week pulling a key idea from the daily readings.

Distribution insight from the data: Bible in a Year reached #1 in part because Father Mike's existing YouTube channel (Ascension Presents) had warmed an audience for years before the podcast launched. Duolingo's app-store growth in years 1-3 was much slower than years 4-7. The first 6-12 months of YouTube content + podcast for the Kingdom Course will be slow; the value compounds in years 2-3 once the catalog is deep enough that one viral episode introduces an audience to a substantial back library.

---

## Funding the mission

The earlier roadmap had a "minimum viable launch" cost estimate (~$25/mo) but no funding plan. That's the gap that kills small digital projects in year 2.

The Kingdom Course is digital-first and audience-funded. Three viable models. Pick one before public launch.

### Model 1: IGNITE-style donor base

This is what Word on Fire does. User-facing content is 100% free; sustained by recurring monthly donors at $10-100/mo each.

**Pre-requisites:**
- 501(c)(3) status (US) or charity registration in your jurisdiction. Without this, donors don't get tax benefits and giving stays low. Cost: $300-1500 to file 501(c)(3); takes 2-6 months for IRS approval. Worth starting before launch so the donate path is live at launch.
- A "Become a Friend of the Mission" page — accessible from the Footer's existing "Reference" column or a new "Support" link. Stripe + a recurring-donation flow. Tools like [Donorbox](https://donorbox.org) or [Givebutter](https://givebutter.com) handle this for ~3% fees.
- Donor stewardship — quarterly email update to donors with project metrics (souls reached, days completed, key milestones). This is the actual work of a development director; if it's not done, donors churn.

**Realistic targets:**
- Year 1: 50-150 monthly donors at average $20/mo = $12-36K/year. Covers hosting, Anthropic API, ConvertKit, audio production, a part-time content/development helper.
- Year 3: 500-1,500 monthly donors = $120-360K/year.
- Year 5+: Word on Fire-scale ($M+ annual budget) becomes possible *if* the project's reach is large enough.

**Strengths:** Preserves the Gate's "free for every soul on earth" promise exactly. Simpler product (no paywalls or tiers). Tax-deductible giving for US donors.

**Weaknesses:** Donor revenue scales sub-linearly with audience — a 100K-MAU audience produces less revenue than a 100K-paid-user freemium product. Requires active donor stewardship. Caps at "small mission scale" without significant fundraising effort.

### Model 2: Freemium (Hallow-style) — recommended for digital-first scaling

User-facing free tier covers Gate + Course + audio podcast + basic Companion (everything the Gate currently promises). Paid tier ($69-99/year, "Friends of the Mission" or similar branding) unlocks AI Companion at scale (real Anthropic-backed, not stub), audio with human narrator (vs. TTS), advanced personalization, Kingdom Groups facilitator tools, premium content additions over time. **Every paywalled feature has a "request scholarship" path** — clergy, students, anyone who can't afford it never sees a paywall. Hallow does this; it works.

The Gate's "free for every soul on earth" promise is preserved literally: the entire core formation experience is free forever, including the Course's 49 days, all 22 Field Guide practices, the apologetic, the basic Companion. The premium tier is for users who want enhanced features and can afford to support the mission.

**Realistic targets:**
- Year 1: 1-3% of weekly active users convert to paid. 10K WAU → 100-300 paid → $7K-30K/year.
- Year 3: 25K-100K WAU, 2-5% conversion → 500-5000 paid → $35K-500K/year.
- Year 5+: $1M+ ARR is achievable at Hallow-scale audience.

**Strengths:** Revenue scales with audience. Hallow's data: users with skin-in-the-game form a daily prayer habit at 2.4x the rate of free users — paid commitment is *itself* formation. Aligns incentives toward product quality and audience growth. Fits the digital-formation-product shape (Duolingo Super, Headspace Plus, Calm Plus all work this way).

**Weaknesses:** More product complexity (paywall logic, scholarship requests, billing). Requires App Store and web payment infrastructure. Some Catholic critics argue any monetization compromises the apostolate (see UnHerd's Hallow critique); the scholarship path is the answer to this but it requires active stewardship.

### Model 3: Sponsorship / partnership

The Course as a free tool, funded by a partner organization (a diocese, religious order, or existing Catholic publisher like Ascension Press, Sophia Institute, Augustine Institute, OSV). The partner brings funding and audience; you bring the product. Examples: Bible in a Year is funded by Ascension Press; many Catholic media projects operate this way.

**Realistic for the Kingdom Course if** you can land a single partner conversation in the first 6 months. Cold outreach pitch: "Free, faithful, theologically reviewed daily Catholic formation reaching X souls per month — would you white-label or co-brand?"

**Strengths:** No fundraising burden on you. Partner brings a known audience. Fast funding.

**Weaknesses:** Loss of independence and brand identity. Partner's strategic priorities may not match yours. Probably the lowest-control model.

### Recommendation

For maximum digital-formation reach: **Model 2 (Hallow-style freemium with robust free tier and scholarship path).** This is the funding model that supports the kind of scaling the project is actually pursuing — Hallow / Duolingo / Headspace shape, where revenue scales with audience and product quality compounds. The free tier is genuinely complete (the Gate's promise is honored); the paid tier supports premium digital formation experiences (real Companion, human-narrator audio, advanced personalization) for users who can afford to support the mission.

If you want simplicity and the strictest reading of "free for every soul": **Model 1 (IGNITE donor base).** The trade-off is reach ceiling.

Either way: **file for 501(c)(3) before public launch.** Even with Model 2, having nonprofit status enables tax-deductible giving as a complementary revenue stream and protects the apostolate's identity. Highest-leverage operational step — go.

---

## Ecclesial recognition and partnerships

The earlier roadmap listed "pastoral review by a priest" as optional ("Launch without them if you want"). Looking at the peer projects, that's not quite right — for digital reach reasons, not just theological ones.

Catholic apostolates whose content is visibly trustworthy reach exponentially further than ones whose content reads as "anonymous personal Catholic project":

- Word on Fire = Bishop Barron. The bishop's name and authority are visible everywhere on the site.
- Hallow = features cardinals and bishops as content creators in the app itself.
- Bible in a Year = Fr. Mike Schmitz, Jeff Cavins, Ascension Press imprint visible on every episode.
- Even Hallow's secular-app competitor Calm's "Sleep Stories" feature lists who the narrator is — credibility-by-named-person is a near-universal pattern.

Without explicit credibility signals — a named priest collaborator, an imprimatur, an institutional review — the Catholic visitor's first question becomes "can I trust this is faithful?" That question, asked at the Hero, drops conversion massively. The Catholic-curious skeptic visitor's question is "is this another sketchy religious project on the internet?" That question kills the visit.

The fix is digital-side, not parish-side: visible content credibility on the site itself.

### What ecclesial recognition actually looks like (digital-first framing)

Three escalating tiers, any of which significantly improves visitor trust:

1. **Imprimatur for the content.** A bishop's formal declaration that the Gate's apologetic content and the Course's daily readings are free of doctrinal error. Process: submit manuscripts to the diocesan censor (the bishop's appointee), wait 4-12 weeks, receive imprimatur or required revisions. Cost: free; just time. **This is the floor — every serious Catholic teaching apostolate should have it.** It appears as a small line on the About page and the Course's first day: "Nihil Obstat: [name] · Imprimatur: [bishop name and diocese]." For Catholic-skeptical visitors, this single line answers the trust question.

2. **A named Catholic spiritual advisor.** A priest or theologically-trained religious whose name appears on the project's About page as the spiritual advisor, and who reviews content on an ongoing basis. Tier 1 work plus ongoing consultation. Cost: usually pro bono if the advisor is mission-aligned; honoraria for time. The advisor's involvement can also surface in product touch-points (e.g., a quoted introduction on the Hero, a video greeting in the Companion's welcome message).

3. **Endorsements from recognizable Catholic voices.** Quotable endorsements from priests, religious, theologians, or known Catholic figures, displayed on the Hero or About page. Pattern from successful peer products: Hallow's home page features endorsements from Bishop Barron, Mark Wahlberg, Jonathan Roumie, Dr. Scott Hahn. The Kingdom Course's equivalent: get 5-10 endorsements from priests, religious sisters, well-respected Catholic apologists, or laypeople with platform. Quote them in rotation on the Gate.

### The path

Before public launch:
- Identify three faithful Catholic priests for content review — ideally one with apologetics expertise (for the Gate), one with formation expertise (for the Course), one with academic theology training (for the Davidic blueprint correspondences and Nine Circles framing). One of them is likely to say yes if the project is well-made.
- Submit the Course content to one diocesan censor for imprimatur. Start with your home diocese or one whose evangelization office is known for supporting digital ministries.

Year 1:
- Expand the priest-reviewer network. Collect 5-10 quotable endorsements. Display them on the Hero and About pages.
- Approach one or two known Catholic voices (apologists, podcasters, religious sisters with platforms) for early-access testimonials. The reach effect of one named endorsement on the Hero is significant.

Year 2-3:
- If a bishop has been following the project with interest, ask if he'd record a short video greeting or write a foreword for the Course content.
- A formal partnership with a major Catholic ministry (Word on Fire Institute, Ascension Press, Sophia Institute, Augustine Institute) becomes possible once the project has demonstrated traction. The pitch is digital-first: "free, faithful, theologically reviewed daily Catholic formation reaching X souls per month — would you co-brand or feature it?"

This is slow work but it's the digital-credibility version of the parish-rollout work. None of it requires organizing in-person rollout; all of it makes the digital product visibly trustworthy at first glance.

---

---

## Reference: the technical seams in plain language

For anyone reading this without context, here's where the integrations plug in.

### Auth — `src/modals/SignupModal.jsx`

```jsx
<SignupModal
  submitHandler={async ({ email, name, parish }) => {
    // Whatever auth provider does — return a user object on success,
    // throw an Error on failure
    return { email, name, parish, signedUpAt: '...' };
  }}
/>
```

If `submitHandler` is omitted, the default stub persists to localStorage.

### Companion — `src/components/Companion.jsx`

```jsx
<Companion
  apiEndpoint="https://api.kingdomcourse.org/companion"
/>
```

Without `apiEndpoint`, Companion runs in stub mode (returns the canned reply). The endpoint must accept Anthropic-shaped POST bodies and return Anthropic-shaped responses (`{ content: [{ type: "text", text: "..." }] }`).

### Current user — `src/App.jsx`

Currently:
```js
const [currentUser, setCurrentUser] = useState(() => {
  // hydrate from localStorage
});
```

Replace with the auth provider's session check (e.g., `useEffect` that calls `supabase.auth.getSession()`).

### IS_DEV flag — `src/env.js`

```js
export const IS_DEV = import.meta.env.DEV === true;
```

Vite replaces `import.meta.env.DEV` at build time. Don't edit this file unless you know what you're doing.

### Bundle splitting — `vite.config.js`

The `manualChunks` config splits eager from lazy:
- Eager: index, react-vendor, icons, liturgical, field-guide
- Lazy (loaded on tab click): CourseTabView + course content, GospelTabView

If you add new components and bundle sizes balloon, revisit `manualChunks` in `vite.config.js`.

### Verify gates — `verify/`

```bash
cd verify
node parse-check.mjs           # Babel parse-only sanity for all 63 source files
node render-check-deep.mjs     # 176 unit tests
```

Add tests for any new component you build. Pattern is in the existing tests — find a similar component, copy its test, edit.

---

## What "complete" looks like

You're done with this plan when:

1. ✅ kingdomcourse.org loads in <2 seconds on a 4G connection
2. ✅ A visitor can sign up with a real email and receive a magic link
3. ✅ A signed-in user's Course progress survives a phone-to-laptop switch
4. ✅ Day 1 of the Course arrives in the visitor's inbox the morning after signup
5. ✅ The Companion gives substantive responses to questions about the Catholic faith
6. ✅ Plausible shows real visitor traffic, signups, and Course completions
7. ✅ Sentry has no unresolved critical errors from the past 7 days
8. ✅ The privacy policy and terms are written and linked
9. ✅ The original `the_kingdom.jsx` artifact has been retired and the Vite scaffold is the source of truth
10. ✅ You can hand the project to a successor (technical or pastoral) with a single `README.md` link and they can pick it up

The migration is done. Phase 0-2 are essential. Phase 3 (Companion backend) and Phase 4 (email sequence) deepen the experience but the site can launch without them. Phase 5+ are operational and can be done in parallel with launch.

If you want a single "minimum viable launch":

> Phase 0 (verify) + Phase 1 (Vercel deploy) + Phase 2 (Supabase magic-link auth) + minimum legal (privacy policy + terms link in footer)

Three to four days of focused work. Everything else is polish or accumulates after real visitors show you what you missed.

---

## When to ask for help

The earlier draft said "you don't need outside help for any of this." Looking at what successful peer projects actually have on their teams, that's only true for the technical scaffold and initial deployment. The strategic and operational layers genuinely need different skills than software engineering.

### Roles to bring in, in order of impact

**Before public launch (Phase 7):**

- **Pastoral review** — Ask a priest you trust to walk through the Gate and Course and give a yes-or-no on whether it's faithful, prudent, and pastoral. Not optional. Free; just time. *Without this, parish-level adoption is significantly harder.*
- **Editorial review** — A theologically-trained editor on the Gospel/Gate copy and the Course readings. Content is the strongest asset; sharpening it compounds. Ask a priest, religious sister, Catholic editor, or seminarian. ~$500-2,000 for a thorough pass.
- **Imprimatur application** — Submit the Course content to a diocesan censor. Free; takes 4-12 weeks. Begin before public launch.
- **Privacy policy** — A lawyer who handles SaaS privacy. ~$300-500 for a tailored policy. Free templates work; a lawyer's version is safer.
- **Visual design review** — A graphic designer with Catholic sensibility could sharpen the typography hierarchy, the OG image, the iconography, the YouTube channel template. ~$1-2K.

**Year 1 (post-launch):**

- **Catholic media partnerships consultant** — Someone who has worked at Word on Fire, Ascension Press, or a similar Catholic media organization. They know which podcast hosts will respond, which Catholic Twitter accounts amplify content, how diocesan offices actually evaluate new programs. ~$500-2K for a one-time strategy consultation; ~$2-5K/month for ongoing retainer. Probably the highest-leverage hire after Phase 1.
- **Audio production partner** — A Catholic audio engineer or production house (some podcast networks like [That Catholic Podcast](https://thatcatholicpodcast.com) or [Ascension Press](https://ascensionpress.com) production teams have side capacity). For full human-narrator audio, budget $50-150 per finished hour. ~$300-1,000 for the full Course.
- **Fundraising / development director** — Even part-time. The IGNITE-style donor model only works with active stewardship. Without someone whose job includes "talk to donors quarterly, send updates, respond to questions," recurring giving stagnates. Consider a part-time hire (10-20 hours/week, ~$2-4K/month) once monthly recurring revenue exceeds $5K/month.

**Year 2+ (scaling):**

- **A named priest collaborator** — Someone whose voice and face become associated with the project (à la Fr. Mike for Bible in a Year). This is the single biggest reach-multiplier in Catholic digital evangelization. Cannot be transactional; it's a vocational fit conversation that takes time.
- **YouTube production partner** — Once content cadence justifies it. A Catholic motion designer or animation studio. Project-based, $200-500 per video at the indie tier; $2-10K per video at production-house tier.
- **Spanish content lead** — A native-Spanish-speaking Catholic editor for translation localization, eventually scaling to a content lead for Latin American audience growth.

### What this means for solo founders

If you're building this alone, the realistic path: ship Phase 0-2 yourself (the scaffold is already built; you just need to deploy and wire auth). Land pastoral review and editorial review through your existing parish/community network — usually pro bono or modest honoraria. Defer the media consultant, audio producer, and development director to year 1, paid for from the first wave of monthly donors. The 501(c)(3) filing is something you can do yourself if you're patient with paperwork (or pay $300-500 for a service like [SureStart by Harbor Compliance](https://www.harborcompliance.com)).

The professional Catholic apostolate path costs money and people. The "free for every soul" promise is preserved in what the user sees; the professional infrastructure behind it is the scaffolding that keeps the promise sustainable.

---

*Salus animarum suprema lex. The scaffold is ready. The path is mapped. The kingdom is open. Build the rest of it well — and don't try to build it alone.*
