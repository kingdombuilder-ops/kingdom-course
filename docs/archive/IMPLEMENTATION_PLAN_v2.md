# THE KINGDOM COURSE — Implementation Plan

*The complete, opinionated, end-to-end plan from "downloaded the tarball" to "operating a launched mission." This is the single canonical reference. Replaces the earlier `NEXT_STEPS.md` and `KINGDOM_BUILD_FROM_SCRATCH.md`.*

**Version 2.0 · May 2026**
**Companion documents:**
- `KINGDOM_MASTER_STRATEGY_V10.md` — strategy (the why)
- `KINGDOM_LAUNCH_PLAYBOOK.md` — launch tiers and decisions (the when)
- This document — execution (the how)

---

## How To Read This Document

This document has three layers, designed to be read in order:

1. **Part I — Architectural Decisions Already Made.** The strategic and technical recommendations that this document treats as decided. Read this first to understand the "why" behind specific choices below.
2. **Part II — The Sequenced Build (Phases 0-9).** Step-by-step technical execution from local environment setup to public launch. Each phase has commands, code, time estimates.
3. **Part III — The Long Arc.** Strategic operations after launch: distribution, funding, ecclesial recognition, scaling, the long mission. Less prescriptive, more directional.

**If you're a non-technical founder reading this:** you can execute Parts I-II yourself with help from a Claude conversation when you hit specific technical steps. You will need a developer's help (or substantial willingness to learn) for Phase 5 (Companion backend) and Phase 6 (email cron). Everything else is point-and-click or guided code-paste.

---

# PART I — Architectural Decisions Already Made

The first version of this document presented these as menus of options. Looking at what successful Catholic and broader digital-formation projects actually do, several of those "options" have honest professional answers. Treating them as decided lets the rest of the plan be concrete.

## Decision 1 — Custom code, not a website builder

**Decided: stay with the existing Vite/React custom codebase.**

Reasoning: The Kingdom Course's central elements — the AI Companion, the interactive Nine Circles SVG, the seven-step Course flow with daily reading state, the Field Guide's 22 practices each with their own modal, the Houses discernment quiz, the Companion's tab-aware system prompts — are not buildable in any drag-and-drop tool (Webflow, Framer, Squarespace, Wix). You'd end up with a marketing homepage in the builder linking to "the actual product" hosted elsewhere — which means building the actual product anyway.

What you have in `kingdom-vite-batch21.tar.gz` is the actual product, complete, with 176 unit tests passing and a clean production build. Don't rebuild it.

**Future consideration (Year 2+):** A headless CMS like Sanity.io or Contentful for editorial content (testimonies, blog posts, news, prayer intentions) — keeping the core product in code while letting non-developers update editorial content. This is enhancement, not foundation.

## Decision 2 — Vercel for hosting

**Decided: deploy to Vercel.**

Reasoning: Best Vite framework integration of any major host. Zero-config deploy from a GitHub repo. Generous free tier (100 GB bandwidth/month covers ~50K-100K visitors). Automatic HTTPS via Let's Encrypt. Edge network for global performance. Built-in serverless functions for the Companion backend (Phase 5). Built-in cron jobs for daily email (Phase 6).

Alternatives: Netlify (very close second; pick whichever you have an account on). Cloudflare Pages (best for static, less ergonomic for serverless functions). Self-hosting (don't, unless you have specific reasons).

## Decision 3 — Clerk for auth, with Google + Apple OAuth

**Decided: Clerk, with Google and Apple OAuth as primary, email/password as fallback.**

Reasoning: Hallow, Bible in a Year, Word on Fire, every major Catholic digital ministry uses OAuth. Email-only signup is meaningful friction; OAuth is one tap. The pattern of letting users authenticate with the social account they already have logged into doubled or tripled signup conversion at every product I've seen tested.

Clerk specifically:
- React-first SDK with drop-in components
- Free tier covers 10,000 monthly active users — comfortably through Tier 2 launch
- Best developer experience among the auth providers
- Apple Sign-In, Google OAuth, email/password all configured from one dashboard

Alternatives:
- **Supabase Auth** — viable, especially if you eventually want one provider for auth + database. Slightly steeper learning curve.
- **Auth0** — overkill until you need enterprise SSO.
- **Magic links only** — what the original plan recommended. OAuth's lower friction wins.

The existing `<SignupModal submitHandler={...}/>` seam is auth-provider-agnostic; wiring Clerk takes ~50-100 lines.

## Decision 4 — Vercel Edge Functions for the Companion backend

**Decided: implement the Anthropic API proxy as a Vercel Edge Function in the same repo.**

Reasoning: The Companion's Anthropic API key cannot live in the browser (anyone could steal it and run up your bill). It must live on a server. Three real options:

- **Vercel Edge Function** — serverless function deployed alongside your site. Add `api/companion.js` to your project; Vercel auto-deploys it as `https://kingdomcourse.org/api/companion`. **Recommended.** Same repo, same deploy, same monitoring.
- **Cloudflare Worker** — alternative serverless. Requires separate deployment pipeline. Slightly cheaper at high scale.
- **Express server on Render or Fly.io** — full backend. Necessary only if you need a real database or websockets, neither of which you have yet.

Going with Vercel keeps everything in one repo and one dashboard. If you later need a heavier backend (e.g., for a complex saint progress database), migrate then.

## Decision 5 — Resend for email delivery

**Decided: Resend for transactional and daily reading emails.**

Reasoning: Built for developers. Generous free tier (3,000 emails/month covers Tier 1; $20/mo for 50K emails covers thousands of active users). Modern API. Native React Email template library. Excellent deliverability.

Alternatives:
- **Postmark** — similar quality, slightly more expensive.
- **ConvertKit** — what the original plan recommended. Better for "creator newsletters" with sequence automation. Heavier and more expensive than needed.
- **SendGrid** — older, more enterprise-feeling. Avoid unless you have a specific reason.

The daily-reading delivery in Phase 6 is implemented as a Vercel cron job triggering a Resend send for each active user.

## Decision 6 — Plausible for analytics, Sentry for errors

**Decided: Plausible Analytics ($9/mo). Sentry free tier for error monitoring.**

Reasoning:
- **Plausible** — privacy-respecting (no cookie banner needed), one-line install, simple dashboard. Catholic users (especially seminarians, religious, conservative laypeople) increasingly avoid sites with Google Analytics. The brand-cost of Plausible vs. GA is real.
- **Sentry free tier** — 5K errors/month covers early launch comfortably. Catches what you'd otherwise hear about from confused users.

Avoid Google Analytics. The cookie banner alone hurts conversion, and the privacy implications conflict with the project's identity.

## Decision 7 — Course duration framing: "Fifty days" / "Seven weeks to Pentecost"

**Decided: 50 days, expressed as "seven weeks to Pentecost."**

The earlier scaffolding had inconsistent framing (49-day in some places, 50-day in others, 7-week in others). Now harmonized throughout the codebase to:

- **Marketing surface:** "Fifty days" / "50 days"
- **Subtitle / structural:** "Seven weeks to Pentecost"
- **Theological precision (deep in content):** "Seven weeks of formation, ending with the Sending on Day 50 — the same shape Easter to Pentecost takes in the Church's calendar"

This matches Acts 2's Easter-to-Pentecost timing and avoids the slightly arbitrary-feeling "49 days." The Companion system prompt, the Hero, the SignupModal, the Sending Day, the GateInvitation CTA — all consistent now.

## Decision 8 — Five Houses architecture

**Decided: Light, Fire, Joy, Glory, Earth.**

Per V10 Master Strategy. The web app is fully aligned. House attributions in `liturgical.js`, saint roster in `saints.js`, discernment quiz in `quiz.js`, Course Step 1 / Step 5 / Step 6 / Step 7 framing in `course.js` — all updated.

If you read older project documents that reference "Four Houses (Light, Fire, Peace, Glory)," that's V8/V9 framing. Earth (Benedictine, Book 6) was added; Peace was renamed to Joy (Franciscan charism is more accurately joy than peace).

## Decision 9 — Digital-first scaling

**Decided: Duolingo / Hallow / Bible in a Year scaling pattern, not Alpha-style parish rollout.**

The deepest formation in the Catholic spiritual tradition has always been the saint's solo daily encounter — Aquinas alone with Aristotle and Scripture, John of the Cross alone in his cell, Thérèse never leaving Lisieux. When solo formation produces real transformation, sharing happens organically.

Kingdom Groups in this product are an *emergent social pattern* — what naturally happens when saints walk concurrently — not a structural prerequisite the product imposes. The product surfaces digital affordances (invite-a-friend, opt-in shared progress, shared prayer intentions) that lower friction; in-person community emerges as the fruit of transformation.

This is the scaling pattern V10 commits to and that the entire web app's content has been aligned to.

## Decision 10 — Funding: Hallow-style freemium with scholarship path

**Decided: free Tier 1, paid Tier 2 with scholarship path. File 501(c)(3) before public launch.**

Reasoning analyzed in detail in Part III below. Briefly: the IGNITE-style donor base (Word on Fire's pattern) preserves "free for every soul" most strictly but caps revenue ceiling at "small mission scale." The Hallow-style freemium with scholarship path scales with audience, has skin-in-the-game retention benefits Hallow's data confirms (2.4x prayer-habit formation), and preserves "free for every soul" via the scholarship path that means no one who can't afford it sees a paywall.

Either is defensible. The 501(c)(3) filing is required for tax-deductible giving (which both models benefit from) and gives institutional credibility for ecclesial conversations.

---

# PART II — The Sequenced Build

Phases 0-9. Each phase has prerequisites, time estimate, success criteria, and detailed steps. Phases are mostly sequential but some can overlap (the content/manuscript work in Part III runs in parallel with technical work).

---

## Phase 0 — Pre-flight verification (one to two hours)

**Goal:** Confirm the codebase is healthy and runs locally before any deployment work.

### 0.1 — Get the code locally

Download `kingdom-vite-batch21.tar.gz` from your conversation outputs.

Extract:
```bash
# macOS / Linux
tar -xzf kingdom-vite-batch21.tar.gz
cd kingdom-vite-batch21
```

Windows: right-click the `.tar.gz` → "Extract All" (Windows 11 supports natively; otherwise install 7-Zip).

### 0.2 — Install Node.js (if not already installed)

The project requires Node.js. Visit nodejs.org and install the LTS version (currently 20.x or 22.x). Verify with:
```bash
node --version
```

You should see `v20.x.x` or `v22.x.x`.

### 0.3 — Install project dependencies

In the project root:
```bash
npm install
```

Expected: 1-3 minutes, ~300 MB of dependencies into `node_modules/`. Warnings about deprecated transitive dependencies are normal; actual errors (red "npm ERR!") are not — copy any errors into a Claude conversation for diagnosis.

### 0.4 — Run the development server

```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Open that URL in a browser.

**Verify visually:**
- Hero loads with eyebrow "The Kingdom of Eternal Life"
- Three tabs at top — Gospel, Course, Kingdom — all clickable
- Gospel tab renders the Nine Circles (interactive SVG)
- Course tab renders the seven-step trail and Day 1 reading
- Kingdom tab renders the Field Guide hub with 22 practices
- Companion floating button at bottom-right opens a panel
- Sign-up modal opens (will be in stub mode — clicking submit just stores in localStorage)
- No red errors in browser console

### 0.5 — Run the verification gates

In a second terminal window (leave the dev server running):
```bash
cd verify
npm install
node parse-check.mjs
node render-check-deep.mjs
```

Expected output:
```
63 passed, 0 failed, 63 total
176 passed, 0 failed.
```

**If both gates pass, you have a healthy codebase.** If either fails, stop and diagnose.

### 0.6 — Run a production build locally

```bash
npm run build
npm run preview
```

This builds the optimized bundle and serves it. Open the preview URL it prints. Verify production build looks identical to dev. Check the browser console — should be no errors.

**Phase 0 complete when:** local dev server runs, production build runs, all 176 tests pass.

---

## Phase 1 — Initial deployment to Vercel (one afternoon)

**Goal:** Get the site live at a public URL so you can share it with friends and start the soft-launch loop.

**Prerequisites:** Phase 0 complete; GitHub account; Vercel account.

### 1.1 — Push the code to GitHub

If you don't have a GitHub account yet, create one at github.com (free).

Create a new private repository called `kingdom-course`.

In the project root, in terminal:
```bash
git init
git add .
git commit -m "Initial commit — Kingdom Course web app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kingdom-course.git
git push -u origin main
```

Refresh GitHub — you should see all 90 files.

### 1.2 — Create Vercel account and connect

Visit vercel.com. Sign up with GitHub (one-tap connection — easier than email signup).

In the dashboard: **Add New... → Project**. Vercel will prompt to install the GitHub app; allow access to the `kingdom-course` repository.

### 1.3 — Deploy

Select the `kingdom-course` repository. Vercel auto-detects it's a Vite project. Default settings are correct:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Click **Deploy**.

After 30-90 seconds, Vercel gives you a URL like `kingdom-course-abc123.vercel.app`. Open it.

**Your Kingdom Course is now live on the internet** — anyone with that URL can visit it.

### 1.4 — Verify the live deployment

Test the same things you tested locally. If anything is broken, the most common causes are:
- Missing environment variables (none required for the stub-mode deployment, but check Vercel logs if something fails)
- Build cache issues (try **Vercel → Deployments → ⋯ → Redeploy with cache cleared**)

### 1.5 — Set up the real domain

If you've registered `kingdomcourse.org`:

1. **Vercel → Project → Settings → Domains → Add** `kingdomcourse.org` and `www.kingdomcourse.org`
2. Vercel gives you DNS records to add at your domain registrar (Namecheap, Cloudflare, Google Domains, Porkbun)
3. Add the records at your registrar
4. Propagation takes 5 minutes to 48 hours
5. Vercel automatically issues a free SSL certificate via Let's Encrypt

If you haven't registered the domain yet:
- Buy `kingdomcourse.org` from Cloudflare Registrar (~$10/year, no markup), Porkbun, or Namecheap.
- Cloudflare specifically is recommended because of their WHOIS privacy and free CDN/security if you ever need them.

**Phase 1 complete when:** the site is live at `https://kingdomcourse.org` (or the Vercel URL if domain not yet purchased), all stub-mode features work, no console errors, you've shared the URL with at least one friend who confirms it loads.

---

## Phase 2 — Wire real auth via Clerk (two to four days)

**Goal:** Replace the SignupModal stub with real OAuth (Google + Apple + email/password) via Clerk.

**Prerequisites:** Phase 1 complete; Clerk account.

### 2.1 — Create Clerk account and application

Visit clerk.com. Sign up (free).

Create a new application called "Kingdom Course."

In the Clerk dashboard:
- **User & Authentication → Email, Phone, Username**: Enable Email; enable Username (optional).
- **User & Authentication → Social Connections**: Enable **Google** (Clerk provides instant credentials in development mode; for production, you'll set up a Google Cloud project — Clerk's docs walk through this clearly when you're ready).
- **Apple** — defer until you have an Apple Developer account ($99/year, only needed when you ship to the App Store).

### 2.2 — Install Clerk SDK

In the project root:
```bash
npm install @clerk/clerk-react
```

### 2.3 — Configure environment variables

In Clerk dashboard → API Keys, copy the **Publishable Key** (starts with `pk_test_...` for development).

In the project root, create `.env.local`:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Add `.env.local` to `.gitignore` (likely already there).

In Vercel dashboard → Project → Settings → Environment Variables, add the same `VITE_CLERK_PUBLISHABLE_KEY` for Production. Use the production key (`pk_live_...`) when you're ready to ship to production users.

### 2.4 — Wrap the app with ClerkProvider

Open `src/main.jsx`. Replace its contents:

```jsx
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles/index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
```

### 2.5 — Wire SignupModal to Clerk's signUp hook

The existing `SignupModal.jsx` has a `submitHandler` prop and a custom form. The cleanest integration preserves your custom form (which matches your design system) while wiring its submit action to Clerk's API.

In `src/App.jsx`, where `<SignupModal>` is rendered, pass a real submitHandler:

```jsx
import { useSignUp } from '@clerk/clerk-react';

function AppShell() {
  const { signUp, isLoaded } = useSignUp();
  
  const handleSignUp = async ({ email, name, parish }) => {
    if (!isLoaded) throw new Error('Auth not ready');
    
    const result = await signUp.create({
      emailAddress: email,
      firstName: name,
      // Save 'parish' / 'where you are starting from' as user metadata
      unsafeMetadata: { startingFrom: parish },
    });
    
    // Send verification email
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    
    return { email, name, parish, signedUpAt: new Date().toISOString() };
  };
  
  return (
    <SignupModal submitHandler={handleSignUp} />
  );
}
```

For the email verification follow-up (the user enters the code from their email), use Clerk's `<EmailAddressVerification />` component or build a simple modal that calls `signUp.attemptEmailAddressVerification({ code })`.

For Google OAuth specifically, Clerk's `useSignUp().authenticateWithRedirect({ strategy: 'oauth_google' })` handles the entire flow.

### 2.6 — Add sign-in surface

Beyond the signup modal, the user needs a way to sign in if they return. Add a "Sign In" link in the Footer or top nav that opens Clerk's `<SignIn />` component (or a custom modal calling Clerk's `useSignIn()`).

Reference Clerk's React quickstart for working code: https://clerk.com/docs/quickstarts/react

### 2.7 — Test the auth flow

Locally:
```bash
npm run dev
```

1. Click Sign Up
2. Submit with a real email address
3. Verify the email code arrives, enter it
4. Verify the user is created in Clerk dashboard
5. Sign out, sign back in
6. Test Google OAuth — click "Sign up with Google," authenticate, verify user creation

Push to GitHub. Vercel auto-deploys. Test the same flows on the live site.

### 2.8 — Apple Sign-In (defer until App Store launch)

Apple Sign-In requires the $99/year Apple Developer account. Defer until you're submitting a native app. Clerk's docs walk through it cleanly when you're ready.

**Phase 2 complete when:** real users can sign up via email/password and Google OAuth on the live site; sessions persist across page reloads; Clerk dashboard shows real user records.

---

## Phase 3 — Persistent user data (optional, can defer)

**Goal:** Course progress (which Day a user is on) survives a phone-to-laptop switch.

This is genuinely optional for Tier 1 launch. The current `localStorage` approach works on a single device; if a user switches devices, their progress doesn't follow. For a clean public launch, sync is desirable.

**Prerequisites:** Phase 2 complete.

### 3.1 — Choose a data store

**If you want simple:** Use Clerk's `unsafeMetadata` field on the User object. Stores small JSON blobs (under 8KB) on each user. No separate database needed. Sufficient for course progress: `{ currentDay: 17, completedDays: [1,2,...,16], houseAssignment: "fire" }`.

**If you want real database:** Add Supabase. Free tier covers 500 MB database, plenty for early users. Use it for user progress, Companion conversation history, prayer intentions, future patron records.

### 3.2 — Implement (Clerk metadata path, simpler)

When the user completes a Day, update their Clerk metadata:
```jsx
import { useUser } from '@clerk/clerk-react';

const { user } = useUser();

const markDayComplete = async (dayNumber) => {
  await user.update({
    unsafeMetadata: {
      ...user.unsafeMetadata,
      currentDay: dayNumber + 1,
      completedDays: [...(user.unsafeMetadata.completedDays || []), dayNumber],
      lastCompletedAt: new Date().toISOString(),
    },
  });
};
```

On app load, hydrate course progress from `user.unsafeMetadata`. Fall back to `localStorage` for not-yet-signed-in users (which still works fine for visitors who want to walk Day 1 without signing up).

### 3.3 — Implement (Supabase path, more work but more flexible)

Visit supabase.com, create a project. Get the anon key.

Install: `npm install @supabase/supabase-js`.

Create a `progress` table:
```sql
create table progress (
  user_id text primary key,
  current_day integer default 1,
  completed_days integer[] default '{}',
  house_assignment text,
  last_active_at timestamp default now()
);
```

In your code, on user actions, upsert to `progress` keyed by Clerk's user ID.

**Phase 3 complete when:** signing in on a different device hydrates the same Course progress.

---

## Phase 4 — The Companion AI backend (one to two days)

**Goal:** Replace the Companion's stub responses with real Anthropic-API-backed conversations.

**Prerequisites:** Phase 1 complete (Phase 2 not strictly required but makes user-aware Companion possible later).

### 4.1 — Get an Anthropic API key

Visit console.anthropic.com. Sign up; verify email. Add billing — start with $20-100 in credit. The Companion's Sonnet 4.6 calls cost roughly $0.50-3 per 1,000 saint-conversations depending on length.

Generate an API key (starts with `sk-ant-...`). Save it somewhere secure.

### 4.2 — Create the Vercel Edge Function

In the project root, create `api/companion.js`:

```javascript
// api/companion.js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: system,
      messages: messages,
    });

    return res.status(200).json({
      content: response.content[0].text,
    });
  } catch (error) {
    console.error('Companion API error:', error);
    return res.status(500).json({ error: 'Companion error' });
  }
}
```

Install the SDK:
```bash
npm install @anthropic-ai/sdk
```

### 4.3 — Add the API key to Vercel

In **Vercel dashboard → Project → Settings → Environment Variables**:
- Name: `ANTHROPIC_API_KEY`
- Value: your `sk-ant-...` key
- Apply to: Production, Preview, Development

### 4.4 — Wire the Companion component to the endpoint

In `src/components/Companion.jsx`, find the placeholder send-message logic and replace with a real fetch:

```jsx
const sendMessage = async (userMessage) => {
  const response = await fetch('/api/companion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: COMPANION_SYSTEM_BASE + tabContext,
      messages: [...history, { role: 'user', content: userMessage }],
    }),
  });
  
  if (!response.ok) {
    throw new Error('Companion request failed');
  }
  
  const data = await response.json();
  return data.content;
};
```

### 4.5 — Add rate limiting (important — protects you from runaway costs)

Without rate limiting, a malicious user could hammer your endpoint and run up a $1,000 bill overnight.

Sign up for free Upstash Redis at upstash.com. Get the REST URL and token. Add to Vercel environment variables:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Install: `npm install @upstash/ratelimit @upstash/redis`.

Add to `api/companion.js` before the Anthropic call:

```javascript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '1 h'),  // 20 messages per IP per hour
});

// inside handler, before the Anthropic call:
const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
const { success } = await ratelimit.limit(ip);
if (!success) {
  return res.status(429).json({ error: 'Rate limit exceeded. Please try again in an hour.' });
}
```

For signed-in users, rate-limit by Clerk user ID instead of IP for fairness.

### 4.6 — Set spending caps in Anthropic Console

In console.anthropic.com → Settings → Usage Limits, set a hard monthly cap. Recommendation for Tier 1: $50/month cap. You'll get email alerts before you hit it.

### 4.7 — Test end-to-end

Push to GitHub; Vercel deploys. On the live site:
1. Open the Companion floating button on the Gospel tab
2. Ask: "What is the Resurrection?"
3. Verify a real Claude-generated response comes back
4. Switch to the Course tab, ask: "Why does the course start with Awakening?"
5. Verify the response references Course content (the tab-aware system prompt is working)
6. Check Anthropic Console — see API usage being charged
7. Try to spam-send 30 messages in a row — verify rate limit kicks in around message 21

**Phase 4 complete when:** the Companion gives substantive, theologically sound, tab-aware responses on the live site.

---

## Phase 5 — Email delivery (two to five days)

**Goal:** Users who sign up actually receive the daily reading by email.

**Prerequisites:** Phases 1-2 complete; ideally Phase 3 (so the daily reading knows what Day each user is on).

### 5.1 — Set up Resend

Visit resend.com. Sign up. Free tier covers 3,000 emails/month — enough for ~100 active users.

Add your sending domain (`kingdomcourse.org`):
1. In Resend → Domains → Add Domain
2. Resend gives you DNS records (SPF, DKIM, DMARC) to add at your registrar
3. Add the records at your domain registrar
4. Wait for verification (usually 5-30 minutes)
5. The domain becomes "verified" in Resend dashboard

Generate an API key (starts with `re_`). Add to Vercel as `RESEND_API_KEY` environment variable.

### 5.2 — Build the daily reading email template

Install React Email (Resend's component library):
```bash
npm install react-email @react-email/components
```

Create `emails/DailyReading.jsx`:

```jsx
import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components';

export default function DailyReading({ dayNumber, dayTitle, dayBody, userName }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Georgia, serif', backgroundColor: '#f8f5ee' }}>
        <Container style={{ maxWidth: 600, padding: '40px 24px' }}>
          <Text style={{ fontSize: 14, color: '#7a6f5e', letterSpacing: '0.1em' }}>
            DAY {dayNumber} · THE KINGDOM COURSE
          </Text>
          <Heading style={{ fontSize: 28, color: '#2a1f10', marginTop: 8 }}>
            {dayTitle}
          </Heading>
          <Text style={{ fontSize: 17, lineHeight: 1.7, color: '#3a2f20' }}>
            {dayBody}
          </Text>
          <Button
            href={`https://kingdomcourse.org/course/day/${dayNumber}`}
            style={{
              backgroundColor: '#8b6914',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 4,
              textDecoration: 'none',
              fontSize: 16,
              marginTop: 24,
              display: 'inline-block',
            }}
          >
            Open today's reading
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### 5.3 — Build the daily-reading cron endpoint

Create `api/cron/daily-reading.js`:

```javascript
// api/cron/daily-reading.js
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DailyReading from '../../emails/DailyReading';
import { course } from '../../src/data/course';
import { clerkClient } from '@clerk/clerk-sdk-node';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Verify cron secret (only Vercel's cron should hit this)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get all users from Clerk
  const users = await clerkClient.users.getUserList({ limit: 500 });
  
  let sent = 0;
  for (const user of users) {
    const signupDate = new Date(user.createdAt);
    const today = new Date();
    const daysSinceSignup = Math.floor((today - signupDate) / (1000 * 60 * 60 * 24));
    const dayNumber = daysSinceSignup + 1;
    
    if (dayNumber < 1 || dayNumber > 50) continue;
    
    // Find the day content from course.js
    const dayContent = findDayInCourse(course, dayNumber);
    if (!dayContent) continue;
    
    const emailHtml = render(<DailyReading 
      dayNumber={dayNumber}
      dayTitle={dayContent.title}
      dayBody={dayContent.body[0]?.d || ''}
      userName={user.firstName}
    />);
    
    await resend.emails.send({
      from: 'Kingdom Course <daily@kingdomcourse.org>',
      to: user.emailAddresses[0].emailAddress,
      subject: `Day ${dayNumber} — ${dayContent.title}`,
      html: emailHtml,
    });
    
    sent++;
  }
  
  return res.status(200).json({ sent });
}

function findDayInCourse(course, dayNumber) {
  // Course is structured as 7 steps × 7 days
  const stepIndex = Math.floor((dayNumber - 1) / 7);
  const dayInStep = ((dayNumber - 1) % 7) + 1;
  return course[stepIndex]?.days?.find(d => d.n === dayInStep);
}
```

Generate a random `CRON_SECRET` (any long random string) and add it to Vercel environment variables.

Install: `npm install @clerk/clerk-sdk-node`. Add `CLERK_SECRET_KEY` (different from publishable key — get from Clerk → API Keys) to Vercel environment variables.

### 5.4 — Schedule the cron job

Create `vercel.json` in the project root (or update if it exists):

```json
{
  "crons": [{
    "path": "/api/cron/daily-reading",
    "schedule": "0 13 * * *"
  }]
}
```

`0 13 * * *` runs every day at 13:00 UTC (8 AM Eastern, 5 AM Pacific). Adjust to your audience's primary timezone.

For per-user timezone delivery (more thoughtful, more code), batch users by their stored timezone preference and run multiple cron schedules. Defer this until Phase 6's iteration cycle.

### 5.5 — Test the daily email

Manually trigger the cron in Vercel dashboard → Crons → "Run now."

Sign up as yourself; verify the email arrives, looks good, links back to the live Day on the site. Check Resend dashboard for delivery confirmation.

### 5.6 — Welcome email (separate)

Send a welcome email immediately after signup, before the daily cycle starts. Add to your Clerk webhook or to the SignupModal's submit handler:

```jsx
await fetch('/api/email/welcome', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, name }),
});
```

Build `api/email/welcome.js` similar to the cron, but sending a single welcome email with a link to start Day 1.

**Phase 5 complete when:** signing up triggers a welcome email immediately; the next morning, Day 1 arrives at the user's inbox; the email looks good on desktop and mobile.

---

## Phase 6 — Audio narration (one to three weeks)

**Goal:** Users can listen to the daily reading instead of (or alongside) reading it. This is what made Bible in a Year reach #1.

**Prerequisites:** Phases 1-5 complete. (Phase 5 not strictly required — audio can exist without email.)

### 6.1 — Decide narration approach

Three options, each with different cost/quality tradeoffs:

- **Human narrator** ($300-1,200 total): hire a Catholic narrator at $50-200 per finished hour. The 50-day Course is roughly 4-6 hours of audio. Find narrators on Voice123, Bodalgo, or directly through Catholic media networks.
- **AI narration** ($22/month for ElevenLabs): modern AI voices (especially ElevenLabs' voices) are good enough that most users can't distinguish them from human narration with light editing.
- **Hybrid** (recommended): human narrator for the Hero, Prologue, and Day 1 (the user's first impression where quality matters most). AI for the other 49 days. Budget ~$200-500.

### 6.2 — Generate or record audio

For each of the 50 days, produce one MP3 file at 64-128 kbps. Naming convention: `day-01.mp3`, `day-02.mp3`, ..., `day-50.mp3`.

Light edit each file: trim silence, normalize volume, add 1-second fade in/out.

### 6.3 — Host audio on a CDN

Don't host audio on Vercel — eats your bandwidth. Use:

- **Cloudflare R2** (recommended): $0.015/GB/month storage, no egress fees. Set up an R2 bucket, upload the 50 MP3s, configure public access. Custom domain: `audio.kingdomcourse.org` pointed at the bucket via CNAME.
- **Backblaze B2** (alternative): similar pricing, slightly less convenient.
- **AWS S3** (familiar, more expensive at scale).

Estimated total storage: ~250-500 MB for 50 audio files. Estimated monthly cost: under $1.

### 6.4 — Add audio to the DayReading component

In `src/components/DayReading.jsx`, add an audio element:

```jsx
const audioUrl = `https://audio.kingdomcourse.org/day-${String(dayNumber).padStart(2, '0')}.mp3`;

<audio controls preload="metadata" style={{ width: '100%', marginTop: '1rem' }}>
  <source src={audioUrl} type="audio/mpeg" />
  Your browser does not support audio playback.
</audio>
```

For a more designed player, build a custom React component using HTML5 `<audio>` underneath. Keep it simple: play/pause, scrub bar, current time, duration, speed (0.75x / 1x / 1.25x / 1.5x).

### 6.5 — Mobile audio testing

Audio playback on mobile has quirks:
- Safari requires user-initiated play (no autoplay)
- Background playback on iOS requires the Media Session API
- Lock-screen controls require setting `mediaSession.metadata`

Implement Media Session for proper background/lock-screen support:

```jsx
useEffect(() => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `Day ${dayNumber} — ${dayTitle}`,
      artist: 'The Kingdom Course',
      album: 'Walk to Pentecost',
      artwork: [{ src: '/og-image.png', sizes: '512x512' }],
    });
  }
}, [dayNumber, dayTitle]);
```

Test thoroughly on iPhone (Safari, Chrome) and Android (Chrome) before declaring this done.

### 6.6 — Optional: Podcast feed

Hallow's path was app-first. Bible in a Year's path was podcast-first. The right answer depends on audience preference — but a podcast feed costs almost nothing additional and significantly broadens reach.

Build an RSS feed at `/api/podcast.xml` that returns a podcast-spec XML document referencing all 50 audio files. Submit the feed URL to Apple Podcasts, Spotify, Google Podcasts, Amazon Music. Each platform takes 1-7 days to approve.

This deserves its own dedicated work session; defer to post-public-launch unless you specifically want podcast distribution from Day 1.

**Phase 6 complete when:** the daily reading on the site has working audio playback, audio works on iOS and Android, lock-screen controls work, no audio errors in production.

---

## Phase 7 — Pre-launch hardening (one week)

**Goal:** Add the operational layer that real production sites need before public launch.

**Prerequisites:** Phases 1-5 complete (Phase 6 audio is helpful but not blocking).

### 7.1 — Privacy policy and terms of service

Required for production. Two paths:

- **Generator service** (faster): Termly ($10/month) generates a custom privacy policy from a questionnaire. Or use Iubenda ($30/year). Or freebase.legal (free).
- **Lawyer-drafted** (safer): $200-500 for a custom privacy policy and ToS from a SaaS-experienced lawyer.

Add as routes `/privacy` and `/terms`. Link from the Footer. Reference both in the SignupModal.

### 7.2 — Cookie consent

If your audience is in the EU/UK (and Catholic audiences globally do include the EU), GDPR cookie consent is required. **If you're using Plausible (privacy-respecting, no cookies for tracking), you don't need a cookie banner.** This is a major reason to choose Plausible over Google Analytics.

### 7.3 — Plausible analytics

Visit plausible.io. Sign up. Add your domain. Plausible gives you a one-line script tag.

Add it to `index.html`:
```html
<script defer data-domain="kingdomcourse.org" src="https://plausible.io/js/script.js"></script>
```

Push to GitHub; Vercel deploys; verify Plausible dashboard shows real traffic within 30 minutes.

### 7.4 — Sentry error monitoring

Visit sentry.io. Sign up. Free tier covers 5K errors/month.

Create a React project. Install:
```bash
npm install @sentry/react
```

In `src/main.jsx`, before the `createRoot` call:
```jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

Add `VITE_SENTRY_DSN` to Vercel environment variables.

Wrap `<App />` in `<Sentry.ErrorBoundary>` for catching React errors.

### 7.5 — Uptime monitoring

Better Uptime (betteruptime.com) free tier covers 10 monitors at 3-minute intervals.

Add a monitor for `https://kingdomcourse.org/`. Set alert via email or SMS.

### 7.6 — Basic SEO

Add Open Graph and Twitter Card meta tags to `index.html`:

```html
<meta property="og:title" content="The Kingdom Course — fifty days to Pentecost" />
<meta property="og:description" content="A Catholic spiritual formation initiative. Free, for every soul on earth." />
<meta property="og:image" content="https://kingdomcourse.org/og-image.png" />
<meta property="og:url" content="https://kingdomcourse.org" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

Create a 1200x630px `og-image.png` (Hero-style image, your brand) and place it in `public/`. This is what shows when someone shares your link on Twitter/X, Facebook, iMessage, Slack, etc.

Add a simple `robots.txt` and `sitemap.xml` to `public/` (or generate at build time).

### 7.7 — Final cross-browser testing

Test the live site in:
- Chrome (desktop + Android)
- Safari (Mac + iPhone)
- Firefox
- Edge

Check the same five things in each: Hero loads, three tabs work, signup completes, Companion responds, audio plays. iPhone Safari is where you'll find the most bugs — test it carefully.

**Phase 7 complete when:** privacy/terms live, Plausible tracking real visitors, Sentry catching errors with no critical unresolved issues, uptime monitoring active, OG image renders correctly when sharing the link.

---

## Phase 8 — Soft launch (two to four weeks)

**Goal:** Real users walk the Course on the live site. You watch like a hawk and iterate.

**Prerequisites:** Phases 1-7 complete.

### 8.1 — The friendly list

Compile a list of 50-200 friendly Catholics who would beta-test:
- Family members and close friends who are Catholic or Catholic-curious
- Your parish — ask the priest to put a one-paragraph announcement in the bulletin
- Catholic friends from college, graduate school, work
- Catholic Twitter / X / Bluesky followers
- People who've expressed interest in your project before
- Catholic content creators you have a personal connection to

### 8.2 — The soft-launch announcement

Send a personal email (not a newsletter blast) to each person on the list:

> Subject: A small thing I'm building — would you try it?
>
> [Their name],
>
> I've been working on a Catholic digital formation project — a 50-day course modeled on the Easter-to-Pentecost pattern. It's now live in beta. Would you be willing to walk it (~10 minutes per day) and tell me what's broken, confusing, or transformative?
>
> The link: kingdomcourse.org
>
> No pressure — only ask if it sounds interesting. I'll watch for your feedback in the next two weeks.
>
> Thank you,
> [Your name]

### 8.3 — What to watch

Daily, for the first two weeks:
- **Plausible**: signup conversion rate (visits → signups), Day 1 → Day 7 retention
- **Sentry**: any unresolved errors? Fix same-day if possible.
- **Resend**: are emails being delivered? Any bounces?
- **Anthropic Console**: Companion usage and quality (sample some conversations — are responses theologically sound?)
- **User feedback emails**: what's confusing? What's broken?

### 8.4 — Iteration cadence

Daily fixes for: bugs, broken links, typos, mobile issues.

Weekly improvements for: UX confusion points, content that lands wrong, Companion responses that need refinement.

Don't try to be perfect. Ship fixes; ship more fixes.

### 8.5 — Soft-launch metric goals

After two weeks of soft launch with 100+ users, you should see:
- Signup conversion (visits → signups): 5-15% is good for a new product
- Day 1 → Day 7 retention: 30-50% is good (Bible in a Year-class is 70%+ but you'll grow into that)
- Companion conversation rate: ~30-60% of signed-in users will have at least one Companion conversation

If retention is below 20%, something is wrong with the Course's first-week experience. Iterate before public launch.

**Phase 8 complete when:** you've had two weeks of real users, you've fixed all critical issues, retention is acceptable, you have at least 5-10 testimonies/positive feedback messages.

---

## Phase 9 — Public launch (one day, lots of nervous energy)

**Goal:** The world can find the Kingdom Course.

**Prerequisites:** Phases 1-8 complete; ideally Tier 2 prerequisites met (theological reviewer endorsement; first imprimatur; one bishop letter — see Part III for details).

### 9.1 — Pick the launch date

Anchor to a Catholic feast. Strong candidates:
- **Pentecost Sunday** — the original feast of the Holy Spirit's outpouring; matches the Course's Easter-to-Pentecost arc
- **Solemnity of Sts. Peter and Paul** (June 29) — apostolic mission
- **Feast of the Immaculate Conception** (December 8) — Marian patroness of evangelization
- **Easter Sunday** — the Resurrection is what the Gospel page is about
- **Solemnity of Mary, Mother of God** (January 1) — a "new beginning" liturgical anchor

Pick one 30-90 days out from the end of soft launch.

### 9.2 — The launch announcement

Write a Substack post or website blog announcement (the latter requires adding a `/blog` route to the site, optional). Components:
- Why now
- What The Kingdom Course is
- Who it's for (the Catholic, the lapsed, the searching)
- Your story (briefly — why you built this)
- The CTA: "Walk fifty days from where you are now to Pentecost"
- The link
- The endorsements (theological reviewer, bishop letter, named priest collaborator if any)

### 9.3 — Coordinate with friendly Catholic media

Reach out at least 14 days before launch:
- **Word on Fire** — Bishop Barron's team; submit via wordonfire.org/contact
- **Pillar Catholic** — independent journalism, pillarcatholic.com
- **EWTN** — large reach but slow bureaucracy; outreach via their digital editor
- **Catholic Answers** — apologetics-focused, audience match
- **Local Catholic newspapers** — your home diocese's paper
- **Catholic Twitter / X / Bluesky** — direct outreach to formative voices (Jonathan Roumie, Bishop Robert Barron, Trent Horn, Matt Fradd, Sr. Theresa Aletheia Noble, etc.)
- **Catholic podcasters** — especially Pints with Aquinas, The Catholic Talk Show, Catholic Stuff You Should Know, Ascension Presents

### 9.4 — Launch day execution

Morning of feast day:
1. Push the announcement live (Substack post, blog post, social post)
2. Email your soft-launch list with "today's the day"
3. Post to all your social channels (X/Twitter, Bluesky, Instagram, LinkedIn, parish bulletin)
4. Email your warm media contacts
5. Watch Sentry for errors
6. Watch Plausible for traffic spike
7. Watch Vercel logs for any deployment issues
8. Have one collaborator standing by for support

Don't be alone. Catholic founders who launched alone have written about how isolating launch day is when nobody is there to share it.

### 9.5 — First-week monitoring

Daily metrics to watch:
- Signup rate (will likely 5-50× normal on launch day, then settle)
- Day 1 → Day 2 retention
- Companion conversation quality (sample randomly; refine system prompt as needed)
- Email deliverability and bounce rate
- Top user-reported issues

Reply to user emails personally. Fix bugs same-day. Iterate copy on the Hero based on what's working.

**Phase 9 complete when:** the public launch has happened, the site survived launch day, the first 100-1,000 organic signups have happened, you have testimonies you can share publicly, you can confidently say the project is launched.

---

# PART III — The Long Arc

After public launch, the work changes from "build the product" to "operate the mission." This part is less prescriptive than Part II — fewer specific commands, more strategic direction. Read this once before launch; refer back as you grow.

---

## The strategic roadmap — what successful Catholic digital evangelization actually does

The Kingdom Course is a digital formation product. It scales the way Hallow ($50M+ raised, 10M+ downloads, top 10 in App Store), Bible in a Year (#1 podcast across all categories three years running), Headspace and Calm (each tens of millions of users, $100M+ revenue), and Duolingo (500M+ registered users) scale — through digital optimization of solo personalized formation, with optional social/sharing/accountability layers, distributed through the platforms where the audience already lives.

This is a deliberate strategic choice, made in V10 of the Master Strategy. Alpha-style parish-by-parish small-group rollout is one valid model for Catholic outreach; it's not the model the Kingdom Course is optimizing for.

### Six patterns successful digital-formation projects share

1. **Distribution beats polish.** Bible in a Year hit #1 because it was on Apple Podcasts where the audience already lived. Hallow reached top 10 via App Store + Super Bowl + celebrity endorsement. Duolingo's growth is App Store + organic SEO + product virality. Word on Fire's engine is YouTube. A website-only strategy caps reach hard, no matter how beautiful the website.

2. **Audio is primary, not optional.** Catholics consume daily content during commutes, exercise, dishes — not at a screen. Bible in a Year is a podcast first, app second, website third. Hallow is audio-first. The Course as email-only-reading optimizes for the smallest possible audience.

3. **Solo personalized formation, not group formation, drives sustained transformation at scale.** Duolingo's lesson loop is solo. Headspace's meditation is solo. Hallow's prayer sessions are solo. Bible in a Year listeners are mostly listening alone. Personalization, daily cadence, and quality of content compound. The right social affordances for solo formation are *light* — async accountability, share-your-progress, invite-friends, quiet community presence — not synchronous group meetings.

4. **A funding model is required from day one.** Word on Fire's IGNITE program has 5,000+ monthly recurring donors. Hallow has subscriptions ($69.99/year). Duolingo has Super (~$84/year). Headspace and Calm have subscriptions. Every successful digital formation product has a sustainable funding mechanism. "Free for every soul" without funding means the project quietly dies in year two.

5. **Ecclesial recognition matters for content credibility.** Bishop Barron *is* Word on Fire. Hallow features cardinals and bishops. Bible in a Year is Fr. Mike Schmitz. Without explicit credibility signals — a named priest collaborator, an imprimatur, an institutional review — the Catholic visitor's first question becomes "can I trust this is faithful?" That question, asked at the Hero, drops conversion massively.

6. **Spanish is launch-day, not year 2.** Roughly 70% of the world's Catholics are non-English-speaking; the largest Catholic populations are Brazil, Mexico, the Philippines. Hallow delayed Spanish until 2022 and named that as a missed opportunity. Catholic = universal; an English-only Catholic project leaves most of the audience on the floor.

### The build queue beyond Phase 9

#### Year 1 (post-launch)

| Feature | Why | When |
|---|---|---|
| **Audio podcast feed** | Replicate Bible in a Year's distribution. RSS to Apple Podcasts, Spotify, Google Podcasts. | Months 1-3 |
| **Spanish translation** | 70% of Catholics worldwide. ~100K characters of Course content; machine translation + native Spanish-speaking Catholic editor produces launch-quality Spanish in 1-2 weeks for a few hundred dollars. | Months 1-3 |
| **Walking-with affordances** | Invite-a-friend, opt-in shared progress, "we're on Day 17 together" gentle accountability. The product never imposes a structure. | Months 3-6 |
| **Streak + daily progress** | Duolingo's whole engine. Design rules: gentle progress, no shame, easy "missed a day" recovery, no public leaderboards. | Months 2-4 |
| **Push notifications (opt-in, content-bearing)** | Hallow uses them. The right design: opt-in, single daily notification at the user's chosen time, contains the actual reading snippet. | Months 2-4 |
| **House-aware personalization** | The user's House (Light/Fire/Joy/Glory/Earth), parish, progress, prompts — flow through to a personalized daily experience. | Months 4-8 |
| **YouTube channel** | One video per Circle (9 total, ~5-10 min each), then weekly Course-content shorts. | Months 6-12 |
| **Liturgical calendar UI** | Today's saint, today's reading color, today's feast in the Kingdom tab. Data exists in `liturgical.js`. | Year 1 |

#### Year 2

| Feature | Why |
|---|---|
| **Native iOS/Android app** | Hallow's growth is App-Store-driven. Capacitor wrapping the existing web app is the cheapest path (~1-2 weeks of work for App Store submission). React Native rewrite is 2-6 months. |
| **Audio with human narrator** | Upgrade from AI to skilled Catholic narrator. Significantly improves listening retention. |
| **Confession finder** | Field Guide has "find Mass"; extend to Confession via Mass Times API. Pointer to in-person sacramental life — surfaced as resource, not as required step. |
| **Additional languages** — Portuguese, Italian, Polish, Tagalog | After Spanish proves the localization pipeline. |
| **AI-personalized Companion** | The Companion personalizes answers to the user's progress, current Step, current Day — without claiming to be spiritual direction. |

#### Things to build carefully

| Item | The honest professional view |
|---|---|
| **Forums / discussion threads** | No. Even at peer-product scale, public forums become moderation burdens and theological battlegrounds. The right social texture for Catholic formation is small invite-only circles walking the Course together — text threads, video calls, in-person where given — not open public forums. |
| **Streaks, badges, progress indicators** | Build, with care. Duolingo's whole product. Hallow uses them. Design rules: no public leaderboards (formation isn't competitive); gentle missed-day recovery (no shame); progress visualization that celebrates faithfulness, not performance. |
| **Push notifications** | Build, with care. Opt-in only; one per day at the user's chosen time; the notification contains substance (today's reading title or a quote), not a guilt prompt. |
| **Companion as "spiritual director"** | Hard no. America Magazine's critique of Hallow specifically warns: "even the best-designed algorithms are unlikely to tend to the human soul adequately." The Companion is a helpful guide that points users toward Confession, real spiritual direction, and the sacramental life. It does not pretend to be those things. |
| **AI-generated sacred images** | Hard no. Catholic visual tradition is real art by real artists. Use existing iconography (public domain works of saints, real Vatican art, real cathedral photography) and original photography commissioned from Catholic photographers when needed. |

### What the project points its users toward

The Kingdom Course is digital. It is also explicitly Catholic — which means at every appropriate moment, the formation should point users toward the sacramental life that lives outside the app:

- The Field Guide has "Find Mass" as a practice. Surface this prominently for users in their first weeks.
- The Course's daily readings reference Confession, the Eucharist, anointing, Marian devotion — naturally, as part of the formation, not as obligations.
- The Companion suggests in-person resources when appropriate (a question about marriage prep → suggest contacting a priest; a question about grief → suggest pastoral counsel).
- The Sending Day at the end of the Course explicitly commissions the user toward life in their local Church.
- A "Find a parish" tool in the Field Guide — global Mass times API integration — makes the in-person step one tap away.

The project does not organize the user's parish life, schedule meetings, broker spiritual directors, or facilitate retreats. **It points; it doesn't run.** Users who want to take the next step into in-person community can — and the digital experience makes that next step easy to find. But the in-person life is the user's own work in their own parish, not a feature of this product.

---

## Distribution beyond the website

The current scaffold is a website. Successful peer projects are multi-platform:

| Project | Web | Native app | Podcast | YouTube | Notes |
|---|---|---|---|---|---|
| Hallow | yes | iOS + Android (primary) | yes | yes | App-Store-led growth |
| Word on Fire | yes | yes | yes | primary engine | YouTube + donor-funded |
| Bible in a Year | minor | via Ascension app | primary engine | yes | Podcast-led growth |
| Duolingo (non-Catholic) | yes | iOS + Android (primary) | minor | yes | App-Store + push notification engine |

The Kingdom Course should plan to be present on at least four channels within 18 months of launch:

1. **Web** (Phases 1-9, shipped)
2. **Podcast feed** (Year 1, Months 1-3)
3. **YouTube** (Year 1, Months 6-12)
4. **Native app** (Year 2, when web/podcast metrics justify the build cost — this is when the project's growth ceiling really lifts)

Distribution insight from the data: Bible in a Year reached #1 in part because Father Mike's existing YouTube channel (Ascension Presents) had warmed an audience for years before the podcast launched. Duolingo's app-store growth in years 1-3 was much slower than years 4-7. The first 6-12 months of YouTube content + podcast for the Kingdom Course will be slow; the value compounds in years 2-3 once the catalog is deep enough that one viral episode introduces an audience to a substantial back library.

---

## Funding the mission

Three viable funding models. Pick one before public launch.

### Model 1: IGNITE-style donor base

What Word on Fire does. User-facing content is 100% free; sustained by recurring monthly donors at $10-100/mo each.

**Pre-requisites:**
- 501(c)(3) status. Without this, donors don't get tax benefits. Cost: $300-1,500 to file; takes 3-6 months for IRS approval. Worth starting before launch so the donate path is live at launch.
- A "Become a Friend of the Mission" page — accessible from the Footer or a new "Support" link. Stripe + recurring donation flow. Tools like Donorbox or Givebutter handle this for ~3% fees.
- Donor stewardship — quarterly email update with project metrics (souls reached, Days completed, key milestones). This is the actual work of a development director; if it's not done, donors churn.

**Realistic targets:**
- Year 1: 50-150 monthly donors at average $20/mo = $12-36K/year. Covers hosting, Anthropic API, Resend, audio production, a part-time content/development helper.
- Year 3: 500-1,500 monthly donors = $120-360K/year.
- Year 5+: Word on Fire-scale ($1M+ annual budget) becomes possible *if* the project's reach is large enough.

**Strengths:** Preserves the Gate's "free for every soul on earth" promise exactly. Simpler product (no paywalls or tiers). Tax-deductible giving for US donors.

**Weaknesses:** Donor revenue scales sub-linearly with audience. Requires active donor stewardship. Caps at "small mission scale" without significant fundraising effort.

### Model 2: Freemium (Hallow-style) — recommended for digital-first scaling

User-facing free tier covers Gate + Course + audio podcast + basic Companion (everything the Gate currently promises). Paid tier ($69-99/year, "Friends of the Mission" or similar) unlocks: AI Companion at scale (real Anthropic-backed, not stub), audio with human narrator (vs. AI), advanced personalization, walking-with facilitator tools, premium content additions over time. **Every paywalled feature has a "request scholarship" path** — clergy, students, anyone who can't afford it never sees a paywall. Hallow does this; it works.

The Gate's "free for every soul on earth" promise is preserved literally: the entire core formation experience is free forever, including the Course's 50 days, all 22 Field Guide practices, the apologetic, the basic Companion. The premium tier is for users who want enhanced features and can afford to support the mission.

**Realistic targets:**
- Year 1: 1-3% of weekly active users convert to paid. 10K WAU → 100-300 paid → $7K-30K/year.
- Year 3: 25K-100K WAU, 2-5% conversion → 500-5000 paid → $35K-500K/year.
- Year 5+: $1M+ ARR is achievable at Hallow-scale audience.

**Strengths:** Revenue scales with audience. Hallow's data: users with skin-in-the-game form a daily prayer habit at 2.4x the rate of free users — paid commitment is *itself* formation. Aligns incentives toward product quality and audience growth.

**Weaknesses:** More product complexity (paywall logic, scholarship requests, billing). Requires App Store and web payment infrastructure. Some Catholic critics argue any monetization compromises the apostolate; the scholarship path is the answer to this but requires active stewardship.

### Model 3: Sponsorship / partnership

The Course as a free tool, funded by a partner organization (a diocese, religious order, or existing Catholic publisher like Ascension Press, Sophia Institute, Augustine Institute, OSV). The partner brings funding and audience; you bring the product. Bible in a Year is funded by Ascension Press; many Catholic media projects operate this way.

**Realistic if** you can land a single partner conversation in the first 6 months. Cold outreach pitch: "Free, faithful, theologically reviewed daily Catholic formation reaching X souls per month — would you white-label or co-brand?"

**Strengths:** No fundraising burden on you. Partner brings a known audience. Fast funding.

**Weaknesses:** Loss of independence and brand identity. Partner's strategic priorities may not match yours. Probably the lowest-control model.

### Recommendation

**Model 2 (Hallow-style freemium with robust free tier and scholarship path)** for maximum digital-formation reach.

Either way: **file for 501(c)(3) before public launch.** Even with Model 2, having nonprofit status enables tax-deductible giving as a complementary revenue stream and protects the apostolate's identity.

---

## Ecclesial recognition and partnerships

Catholic apostolates whose content is visibly trustworthy reach exponentially further than ones whose content reads as "anonymous personal Catholic project":

- Word on Fire = Bishop Barron. The bishop's name and authority are visible everywhere on the site.
- Hallow = features cardinals and bishops as content creators in the app itself.
- Bible in a Year = Fr. Mike Schmitz, Jeff Cavins, Ascension Press imprint visible on every episode.

Without explicit credibility signals — a named priest collaborator, an imprimatur, an institutional review — the Catholic visitor's first question becomes "can I trust this is faithful?" That question, asked at the Hero, drops conversion massively. The Catholic-curious skeptic visitor's question is "is this another sketchy religious project on the internet?" That question kills the visit.

The fix is digital-side: visible content credibility on the site itself.

### Three escalating tiers of ecclesial recognition

1. **Imprimatur for the content.** A bishop's formal declaration that the Gate's apologetic content and the Course's daily readings are free of doctrinal error. Process: submit manuscripts to the diocesan censor (the bishop's appointee), wait 4-12 weeks, receive imprimatur or required revisions. Cost: free; just time. **This is the floor — every serious Catholic teaching apostolate should have it.** It appears as a small line on the About page and the Course's first day: "Nihil Obstat: [name] · Imprimatur: [bishop name and diocese]."

2. **A named Catholic spiritual advisor.** A priest or theologically-trained religious whose name appears on the project's About page as the spiritual advisor, and who reviews content on an ongoing basis. Cost: usually pro bono if mission-aligned; honoraria for time.

3. **Endorsements from recognizable Catholic voices.** Quotable endorsements from priests, religious, theologians, or known Catholic figures, displayed on the Hero or About page. Pattern from successful peer products: Hallow's home page features endorsements from Bishop Barron, Mark Wahlberg, Jonathan Roumie, Dr. Scott Hahn. The Kingdom Course's equivalent: get 5-10 endorsements from priests, religious sisters, well-respected Catholic apologists, or laypeople with platform.

### The path

Before public launch:
- Identify three faithful Catholic priests for content review — ideally one with apologetics expertise (for the Gate), one with formation expertise (for the Course), one with academic theology training (for the Davidic blueprint correspondences and Nine Circles framing). One of them is likely to say yes if the project is well-made.
- Submit *The Miracles of the Kingdom* manuscript to one diocesan censor for imprimatur. Start with your home diocese or one whose evangelization office is known for supporting digital ministries.

Year 1 post-launch:
- Expand the priest-reviewer network. Collect 5-10 quotable endorsements. Display them on the Hero and About pages.
- Approach one or two known Catholic voices (apologists, podcasters, religious sisters with platforms) for early-access testimonials.

Year 2-3:
- If a bishop has been following the project with interest, ask if he'd record a short video greeting or write a foreword for the Course content.
- A formal partnership with a major Catholic ministry (Word on Fire Institute, Ascension Press, Sophia Institute, Augustine Institute) becomes possible once the project has demonstrated traction.

This is slow work but it's the digital-credibility version of the parish-rollout work. None of it requires organizing in-person rollout; all of it makes the digital product visibly trustworthy at first glance.

---

## Operational maintenance (ongoing)

After launch, the rhythm changes from "build the product" to "run the mission."

### Weekly cadence

- **Monday:** Review last week's metrics. Fix issues. Plan content.
- **Tuesday-Thursday:** Build or content-revise; reply to users; iterate.
- **Friday:** Patron updates if applicable; deploy any week's changes.
- **Sunday:** Mass and rest. Don't work.

### Monthly cadence

- Send a Patron update with metrics, testimonies, prayer requests
- Review which Course days have highest drop-off; revise content
- Review Companion logs; identify where it gives bad answers; refine system prompt
- Identify the best testimony of the month; ask permission to feature it

### Quarterly cadence

- Episcopal relationship update — check in with bishop contacts
- Theological reviewer check-in — any concerns?
- Patron pipeline review — who's mature enough to ask for upgraded support?
- Strategic review — is the multiplication rate above 1.0? If not, why?

### Annual cadence

- Full content audit — what needs updating?
- Strategic plan refresh — V11? V12?
- Financial review — sustainable through next year?
- Personal review — am I sustainably doing this?

---

## When to ask for help

The original plan said "you don't need outside help for any of this." Looking at what successful peer projects actually have on their teams, that's only true for the technical scaffold and initial deployment. The strategic and operational layers genuinely need different skills than software engineering.

### Roles to bring in, in order of impact

**Before public launch:**

- **Pastoral review** — Ask a priest you trust to walk through the Gate and Course and give a yes-or-no on whether it's faithful, prudent, and pastoral. Not optional. Free; just time. *Without this, parish-level adoption is significantly harder.*
- **Editorial review** — A theologically-trained editor on the Gospel/Gate copy and the Course readings. ~$500-2,000 for a thorough pass.
- **Imprimatur application** — Submit the Course content to a diocesan censor. Free; takes 4-12 weeks.
- **Privacy policy** — A lawyer who handles SaaS privacy. ~$300-500 for a tailored policy.
- **Visual design review** — A graphic designer with Catholic sensibility. ~$1-2K.

**Year 1 (post-launch):**

- **Catholic media partnerships consultant** — Someone who has worked at Word on Fire, Ascension Press, or a similar Catholic media organization. ~$500-2K for one-time strategy consultation; ~$2-5K/month for ongoing retainer. Probably the highest-leverage hire after Phase 1.
- **Audio production partner** — A Catholic audio engineer or production house. For full human-narrator audio: $50-150 per finished hour, ~$300-1,000 for the full Course.
- **Fundraising / development director** — Even part-time. Without active stewardship, recurring giving stagnates. Consider a part-time hire (10-20 hours/week, ~$2-4K/month) once monthly recurring revenue exceeds $5K/month.

**Year 2+ (scaling):**

- **A named priest collaborator** — Someone whose voice and face become associated with the project (à la Fr. Mike for Bible in a Year). Single biggest reach-multiplier in Catholic digital evangelization. Cannot be transactional; vocational fit.
- **YouTube production partner** — Catholic motion designer or animation studio. Project-based, $200-500 per video at the indie tier.
- **Spanish content lead** — A native-Spanish-speaking Catholic editor for translation localization, eventually scaling to a content lead for Latin American audience growth.

---

## The honest cost summary

Realistic monthly operating cost at different scales, so you can plan funding:

| Scale | Stack | Monthly cost |
|---|---|---|
| **Phase 1-2 (launch, ~100 users)** | Vercel free + Clerk free + Anthropic $5-30 + Resend free + Plausible $9 + monitoring free | $15-40 |
| **Year 1 (~1,000 users)** | Vercel $0-20 + Clerk free + Anthropic $50-300 + Resend $20 + Audio CDN $5-15 + monitoring $15 | $90-370 |
| **Year 2 (~10,000 users)** | Vercel $20-100 + Clerk $25 + Anthropic $500-3,000 + Resend $90 + Audio CDN $30-100 + monitoring $30 | $700-3,250 |
| **Scaling (100K+ users)** | Multi-region $500-2,000 + Auth $200-500 + Anthropic $5K-30K + Email $500-2K + Audio $300-1K + monitoring $200-500 | $6,700-36,000 |

This scales sub-linearly with users — the $36K/month at 100K users is per-user cheaper than $370 at 1K users. This is why digital-first scaling works financially. Patrons covering $5K-50K/month gets you well into Year 2 territory.

---

## Common failure modes (and cures)

**"Building forever" — The site is never quite ready to launch.** Cure: pick a feast day; commit publicly; ship.

**"Auth provider lock-in regret."** Cure: keep your business logic separate from auth provider details. Don't store user data in Clerk's metadata that you can't migrate elsewhere.

**"Companion API cost runaway."** Cure: rate limit aggressively. Set a hard monthly cap in Anthropic's dashboard. Monitor weekly.

**"Email deliverability collapse."** Cure: warm up the sending domain gradually (start with 50 emails/day, grow to 500, then 5,000); use SPF/DKIM/DMARC properly; never buy email lists.

**"User goes through Day 1, never returns."** Cure: Day 1 has to be transformative, not just informative. Iterate Day 1 ten times if you have to. Track Day 1→Day 2 retention as your single most important early metric.

**"Founder burnout at month 9."** Cure: Sunday rest from Day 1. Spiritual director from Day 1. At least one collaborator (even part-time) from Day 1. The mission is not yours to save; it's the King's to advance through you.

**"Theological criticism public and damaging."** Cure: imprimatur + theological reviewer + bishop letter, all in place before broad public launch. Defense in depth.

**"Spanish-only audience locked out."** Cure: Spanish from launch if possible. Spanish in Year 1 if not. Don't wait until Year 5.

---

## What "complete" looks like

You're done with this implementation plan when:

1. ✅ kingdomcourse.org loads in <2 seconds on a 4G connection
2. ✅ A visitor can sign up via Google OAuth, Apple OAuth (when ready), or email/password
3. ✅ A signed-in user's Course progress survives a phone-to-laptop switch
4. ✅ Day 1 of the Course arrives in the visitor's inbox the morning after signup
5. ✅ The Companion gives substantive responses to questions about the Catholic faith
6. ✅ Audio playback works on iOS, Android, desktop
7. ✅ Plausible shows real visitor traffic, signups, and Course completions
8. ✅ Sentry has no unresolved critical errors from the past 7 days
9. ✅ The privacy policy and terms are written and linked
10. ✅ The 501(c)(3) is filed (approval pending)
11. ✅ At least one priest has reviewed the content and given written endorsement
12. ✅ The imprimatur application for *The Miracles of the Kingdom* is submitted
13. ✅ At least 100 soft-launch users have walked at least Day 1
14. ✅ You have at least 5 testimony emails in your inbox

If all 14 are true: **you are ready for public launch.**

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

If `submitHandler` is omitted, the default stub persists to localStorage. Phase 2 wires this to Clerk.

### Companion — `src/components/Companion.jsx`

```jsx
<Companion
  apiEndpoint="/api/companion"
/>
```

Without `apiEndpoint`, Companion runs in stub mode. The endpoint must accept `{messages, system}` POST bodies and return `{content: "..."}` responses. Phase 4 wires this to a Vercel Edge Function calling Anthropic.

### Current user — `src/App.jsx`

Currently:
```js
const [currentUser, setCurrentUser] = useState(() => {
  // hydrate from localStorage
});
```

Replace with Clerk's `useUser()` hook (Phase 2 work).

### IS_DEV flag — `src/env.js`

```js
export const IS_DEV = import.meta.env.DEV === true;
```

Vite replaces `import.meta.env.DEV` at build time. Don't edit this file.

### Bundle splitting — `vite.config.js`

The `manualChunks` config splits eager from lazy:
- Eager: index, react-vendor, icons, liturgical, field-guide
- Lazy (loaded on tab click): CourseTabView + course content, GospelTabView

If you add new components and bundle sizes balloon, revisit `manualChunks` in `vite.config.js`.

### Verify gates — `verify/`

```bash
cd verify
node parse-check.mjs           # Babel parse-only sanity for all source files
node render-check-deep.mjs     # 176 unit tests
```

Add tests for any new component you build. Pattern is in the existing tests.

---

## Final note on this plan

This document is intentionally opinionated. Other professional approaches would do things differently. The truly non-negotiable advice:

1. **Stay with custom code, not a builder.** You've built something a builder can't.
2. **OAuth from Day 1.** Email-only signup is friction.
3. **Audio matters.** Bible in a Year proved this.
4. **Soft-launch before public-launch.** Always.
5. **Sunday is rest.** From Day 1.
6. **The mission is not yours to save.**

Everything else is engineering.

---

*Salus animarum suprema lex. The scaffold is ready. The path is mapped. The kingdom is open. Build the rest of it well — and don't try to build it alone.*

---

**Document version:** 2.0 (replaces NEXT_STEPS.md v1 and KINGDOM_BUILD_FROM_SCRATCH.md)
**Date:** May 2026
**For the next conversation:**

> *"I'm at Phase [X.Y] of the Kingdom Course implementation plan. I've completed [previous steps]. I need help with [specific next step]. Here's what I have so far: [paste relevant code or describe state]. What's the next concrete step?"*
