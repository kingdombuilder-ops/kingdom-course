# THE KINGDOM COURSE — Build From Scratch

*The complete, opinionated, step-by-step implementation guide — answering the three architectural questions first, then walking the entire build sequence from absolute zero to a launched website.*

**Version 1.0 · May 2026**
**Companion to:** `KINGDOM_LAUNCH_PLAYBOOK.md` (the launch tiers and timeline) · `KINGDOM_MASTER_STRATEGY_V10.md` (the strategy)

---

## Part 0 — The Three Architectural Questions Answered

Before any step-by-step, the user asked three real questions. Each deserves a direct answer with honest trade-offs.

### Question 1 — Custom code vs. website builder?

This is the most important question because it shapes everything downstream.

**Three real options:**

**Option A — Custom code (what we built).**
A Vite/React app deployed to Vercel or Netlify. The actual codebase you have in `kingdom-vite-batch21.tar.gz`.

- **Pros:** Total creative control. The Companion AI integration is bespoke. The Nine Circles SVG visualization, the seven-step Course flow, the Field Guide's 22 practices — none of this exists in any builder. Scales to millions of users with no per-user cost beyond hosting/API. The codebase is yours forever; no vendor lock-in. Can integrate any third-party service (auth, payments, analytics, audio narration) without limitation. Performance is excellent (~167 KB gz first-paint).
- **Cons:** Requires technical maintenance — when React releases a new version, when a dependency has a security patch, when the Companion API changes, somebody has to update the code. If you're not a developer, you need a developer (full-time, contractor, or co-founder). Adding new content (new Course days, new Field Guide practices) requires editing JavaScript files and redeploying.
- **Cost:** $0 hosting on Vercel free tier up to ~100K monthly visits; $20-50/mo at moderate scale; $100-500/mo at high scale. Anthropic API costs scale with Companion usage (probably $0.50-3 per 1,000 saint-conversations).
- **When this is right:** When the product is genuinely novel — when no builder has the components you need (interactive Nine Circles, AI Companion, 50-day Course flow). This is The Kingdom Course's situation.

**Option B — Website builder (Webflow / Framer / Squarespace).**
A drag-and-drop visual editor that produces a website without code.

- **Pros:** Non-developer can update content directly. Deploy and iterate without engineers. Templates for marketing sites are excellent. Webflow has decent CMS for blog-style content. Framer has beautiful design primitives.
- **Cons:** Cannot build the things The Kingdom needs. There is no Webflow component for "AI chat companion with tab-aware system prompts." There is no Framer template for "interactive Nine Circles SVG with modal deep-dives." The Course's seven-step state machine, the Field Guide's 22 practices each with their own deep page, the daily reading flow with Sabbath observances — none of this is buildable in a no-code tool. You'd end up with a nice marketing site that links to "the actual product" hosted somewhere else, which means you'd build the actual product anyway.
- **Cost:** $14-39/mo for the builder subscription, plus hosting.
- **When this is right:** Pure marketing sites, content blogs, simple e-commerce. Not for The Kingdom.

**Option C — Hybrid (builder for marketing + custom for the product).**
Marketing site built in Webflow at `kingdomcourse.org`; the actual product (Gate, Course, Field Guide, Companion) lives at `app.kingdomcourse.org` as the custom React app.

- **Pros:** Marketing team (or you, non-technically) can update the homepage, About page, blog, press kit, donor page in Webflow. The technical product lives separately, updated by engineers. This is what most modern SaaS companies do.
- **Cons:** Two codebases to maintain. Two sets of design systems to keep visually aligned. Two domains/subdomains to coordinate. SEO splits across two surfaces. For a small team, the overhead isn't worth it until you have a marketing team that benefits from the builder.
- **Cost:** $14-39/mo (Webflow) + $0-500/mo (custom hosting) + Anthropic API costs.
- **When this is right:** When you have a non-technical marketing person who needs to update copy frequently and a technical team for the product. Probably not Year 1 of The Kingdom; possibly Year 2-3 as the team grows.

**Pro recommendation:**

**Stay with custom code (Option A) for the foreseeable future.** Three reasons:

First, you've already built it. The hard part — making the Vite scaffold, the 31 components, the Companion integration, the Nine Circles, the Course flow — is done. Tearing this up to put a Webflow homepage in front of it would cost weeks of work and gain nothing.

Second, the central elements of The Kingdom Course are not buildable in a visual editor. The AI Companion. The Course's seven-week state machine. The Field Guide's 22 practices with their own modals. The interactive Nine Circles. These exist *only* because you wrote real code.

Third, the long-term flexibility matters. As The Kingdom evolves — adding the Gate App native build, integrating audio narration, adding Spanish translations, adding the Tier 2 / Tier 3 products, integrating the patron portal — having full code control means you can evolve in any direction. Builders constrain you to what they support.

**The one builder-style addition I'd recommend later:** Use a headless CMS like **Sanity.io** or **Contentful** (free tiers exist) for content that updates frequently — the daily liturgical entries, blog posts, testimonies, news. Keep all the core product (Course content, Field Guide, Companion logic) in code. This gives you "non-developer can edit content" benefits without rewriting the product. This is a future enhancement, not a Day 1 priority.

**Bottom line:** Don't rebuild. Ship what you have. Add a CMS for editorial content in Year 2 if you outgrow editing JavaScript files.

### Question 2 — Auth approach (Google/Apple/etc.)

You're correct. Hallow, Bible in a Year, Word on Fire, every major Catholic digital ministry uses OAuth. Email-only signup is friction; OAuth is one tap.

**The three providers that matter:**

- **Google** — covers ~70-80% of users. Required.
- **Apple** — required for App Store distribution (Apple's rules require "Sign in with Apple" if you offer any other social login). And many Catholic users are on iPhone. Required.
- **Email/password** — for the user who refuses OAuth. Optional but recommended for inclusivity.

You typically don't need Facebook anymore — most users have OAuth fatigue with it, and the brand alignment with Facebook is worse than with Google or Apple.

**Three real auth providers that wire all of this for you:**

**Clerk (recommended).**
- React-first. Drop in `<SignIn />` and `<SignUp />` components. OAuth providers configured in dashboard.
- Free tier: 10,000 monthly active users. Plenty for the first 6-12 months.
- Pricing scales: $25/mo for unlimited MAU + advanced features.
- Best developer experience by a wide margin.
- **My recommendation for The Kingdom Course.**

**Supabase.**
- Open-source alternative. Includes auth, database, storage, edge functions all in one.
- Free tier generous (50K MAU, 500MB database).
- Good if you want the database too. The Kingdom Course will eventually need a database (saint progress, Companion conversation history, patron records).
- Slightly steeper learning curve than Clerk.

**Auth0.**
- Enterprise-grade. Most established.
- Free tier: 25K MAU.
- Good if the project will eventually need SSO for parish/diocesan deployments (Tier 2 audience).
- More complex than Clerk for simple OAuth needs.

**Pro recommendation:** **Start with Clerk for Tier 1 launch.** It's the fastest path from your `<SignupModal submitHandler={...}/>` seam to a working auth flow. Migrate to Supabase if you outgrow Clerk's database-less model and want one integrated stack. Skip Auth0 unless you specifically need enterprise SSO.

The implementation in your existing `SignupModal.jsx` is already auth-provider-agnostic. The component has a `submitHandler` prop. Any of the three providers above wires into that prop in 50-100 lines of code.

### Question 3 — 50-day, 49-day, or 7-week framing?

You spotted a real inconsistency. The codebase had it as 49 days in many places, 50 in others, "7 weeks" in others. I just fixed all of them to **50 days** (also expressed as "seven weeks to Pentecost" where rhythmically appropriate).

**The theological reality:** Easter to Pentecost is 50 days inclusive (Acts 2). The Course's formation is 49 days of reading + Pentecost itself as Day 50 (the Sending). Rather than explain this distinction in marketing copy, the cleanest external framing is simply **50 days** — matching what the Companion already says, what KingdomMoreGrid says, and what most users will count.

**Final canonical framing:**

| Marketing / Hero / SignupModal | "Fifty days" / "50 days" |
|---|---|
| Subtitle / structural | "Seven weeks to Pentecost" |
| Theological explanation (deep in content) | "Seven weeks of formation, ending with the Sending on day fifty — the same shape Easter to Pentecost takes in the Church's calendar" |
| Internal docstrings | "7-week, 50-day curriculum" |

This is now consistent throughout the web app. **All gates green: 63/63 parse, 176/176 render, production build clean.** The updated tarball is at `/mnt/user-data/outputs/kingdom-vite-batch21.tar.gz`.

---

## Part 1 — What You Have, Right Now

Before the step-by-step, an inventory of what's already done so you don't redo it.

**Source code (in batch21 archive):**
- Vite/React scaffold, 90 files
- 31 components + 13 modals + 11 data modules
- 176/176 unit tests passing
- Production build clean: ~167 KB gz first-paint
- Tailwind toolchain removed (inline styles + custom CSS)
- Two integration seams ready: `submitHandler` for auth, `apiEndpoint` for Companion

**Content (also in batch21):**
- Complete 50-day Course (Step 1 through Sending Day)
- Five Houses architecture (Light/Fire/Joy/Glory/Earth)
- 22 Field Guide practices including Practice #15 "How to Walk the Kingdom with Others"
- Nine Circles of Evidence (Gospel page)
- Liturgical year data
- 20 saints across five Houses
- Houses discernment quiz

**Strategic foundation:**
- `KINGDOM_MASTER_STRATEGY_V10.md` — the why and architecture
- `COMPREHENSIVE_CHANGE_SUMMARY_SINCE_V9.md` — what changed
- `KINGDOM_LAUNCH_PLAYBOOK.md` — the launch tiers and decisions
- This document — the build steps

**What's still empty:**
- No production hosting yet
- No real auth provider yet
- No real Companion AI backend yet
- No email delivery yet
- No audio narration yet
- No analytics or monitoring yet
- No domain pointing to a real server yet

The next sections fill in each of these, in order.

---

## Part 2 — Pre-Flight (One Hour)

Before any deployment, a sanity check on the local environment.

### Step 2.1 — Get the code locally

If you don't already have the code on your computer:

1. Download `kingdom-vite-batch21.tar.gz` from the Claude conversation outputs
2. Extract it: on macOS/Linux open Terminal and run:
   ```bash
   tar -xzf kingdom-vite-batch21.tar.gz
   cd kingdom-vite-batch21
   ```
   On Windows: right-click → Extract All (Windows 11 supports `.tar.gz` natively; otherwise use 7-Zip).

### Step 2.2 — Install Node.js if you don't have it

The Kingdom Course is built with React + Vite, which requires Node.js.

1. Visit nodejs.org
2. Download the LTS version (currently Node 20.x or 22.x — either works)
3. Install with default settings
4. Verify in Terminal/PowerShell: `node --version` should print something like `v20.11.0`

### Step 2.3 — Install project dependencies

In Terminal, navigate to the extracted folder and run:
```bash
npm install
```

This downloads ~300 MB of dependencies into a `node_modules/` folder. Takes 1-3 minutes depending on internet speed.

If you see warnings about deprecated packages, that's normal and not a problem. If you see actual errors (red text saying "npm ERR!"), copy the error and ask Claude in a future conversation; we'll diagnose.

### Step 2.4 — Run the development server

```bash
npm run dev
```

You should see something like:
```
  VITE v5.4.10  ready in 250 ms
  ➜  Local:   http://localhost:5173/
```

Open that URL in your browser. You should see the Hero — "The Kingdom of Eternal Life" eyebrow, the headline, the seven-step trail. Click around: the Gospel tab (Nine Circles), the Course tab (seven-week journey), the Kingdom tab (Field Guide). Everything should work in stub mode (no real auth, Companion has placeholder responses).

### Step 2.5 — Run the verification gates

In a second Terminal window, while the dev server is still running:
```bash
cd verify
npm install
node parse-check.mjs
node render-check-deep.mjs
```

You should see:
```
63 passed, 0 failed, 63 total
176 passed, 0 failed.
```

**If both gates pass, the code is healthy and you can proceed to deployment.** If either fails, stop and diagnose before going further.

### Step 2.6 — Run a production build locally

```bash
npm run build
npm run preview
```

This builds the optimized bundle and serves it. Open the preview URL it prints. Verify the production build looks identical to the dev server. Check the browser console — there should be no red errors.

If everything looks good: **you have a working, locally-running Kingdom Course.** Now we deploy it.

---

## Part 3 — Deploy to a Real URL (One Afternoon)

Goal: get the site live at a temporary URL so you can share it with friends and start the soft-launch loop.

### Step 3.1 — Create a Vercel account

Vercel is the recommended host for Vite/React apps. They built Next.js but Vite deploys cleanly too.

1. Visit vercel.com
2. Sign up with GitHub or email
3. Free tier ("Hobby"): unlimited deployments, 100 GB bandwidth/month, custom domain support. Plenty for Tier 1 launch.

### Step 3.2 — Push the code to GitHub

You need the code in a GitHub repository for Vercel to deploy it.

1. Create a free GitHub account at github.com if you don't have one
2. Create a new private repository called `kingdom-course`
3. In Terminal, in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Kingdom Course web app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/kingdom-course.git
   git push -u origin main
   ```
4. Refresh GitHub — you should see all 90 files

### Step 3.3 — Connect Vercel to GitHub

1. In Vercel dashboard, click "Add New... → Project"
2. Connect your GitHub account
3. Select the `kingdom-course` repository
4. Vercel auto-detects it's a Vite project. Default settings should be:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Click "Deploy"

After 30-90 seconds, Vercel gives you a URL like `kingdom-course-abc123.vercel.app`. Open it. **Your Kingdom Course is now live on the internet.**

### Step 3.4 — Verify the live deployment

Test the same things you tested locally:
- Hero loads with "The Kingdom of Eternal Life" eyebrow
- Three tabs (Gospel, Course, Kingdom) all render
- Companion floating button works (stub mode)
- Sign-up modal opens (stub mode)
- All 50 days of the Course are accessible
- Field Guide's 22 practices all open
- No red errors in browser console

If anything is broken, the most common cause is missing environment variables — check Vercel's deployment logs and look for warnings.

### Step 3.5 — Set up the real domain (optional, can wait)

You can use the Vercel-provided URL indefinitely if you want. But once you have `kingdomcourse.org` registered:

1. Buy the domain from Namecheap, Google Domains, or Cloudflare Registrar (~$10-15/year)
2. In Vercel project settings → Domains → Add `kingdomcourse.org` and `www.kingdomcourse.org`
3. Vercel gives you DNS records (A records and/or CNAME) to add at your registrar
4. Add the records; propagation takes 5 minutes to 48 hours
5. Vercel automatically issues a free SSL certificate; the site is now live at `https://kingdomcourse.org`

**At this point, you have a public, live, branded website running The Kingdom Course in stub mode.** Real users could already start walking the Course (they just won't have persistent accounts or AI Companion answers).

---

## Part 4 — Wire Real Auth (Two to Four Days)

Now we replace the SignupModal's stub handler with real OAuth via Clerk.

### Step 4.1 — Create a Clerk account

1. Visit clerk.com
2. Sign up (free tier — 10,000 monthly active users)
3. Create a new application called "Kingdom Course"
4. In the Clerk dashboard → User & Authentication → Email, Phone, Username:
   - Enable Email
   - Enable Username (optional)
5. In → User & Authentication → Social Connections:
   - Enable **Google** (Clerk provides instant credentials in dev mode; for production, you'll need to set up a Google Cloud project — instructions in Clerk's docs)
   - Enable **Apple** (production setup requires an Apple Developer account at $99/year; can defer until App Store launch)

### Step 4.2 — Install Clerk in your project

In Terminal, in the project root:
```bash
npm install @clerk/clerk-react
```

### Step 4.3 — Add the Clerk publishable key to environment variables

1. In Clerk dashboard → API Keys, copy the "Publishable Key" (starts with `pk_test_...` or `pk_live_...`)
2. In your project root, create `.env.local`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```
3. Add `.env.local` to `.gitignore` if not already there
4. In Vercel dashboard → Project → Settings → Environment Variables, add the same `VITE_CLERK_PUBLISHABLE_KEY` for production

### Step 4.4 — Wrap the app with ClerkProvider

Open `src/main.jsx`. Currently it looks like:
```jsx
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')).render(<App />);
```

Update it to:
```jsx
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './styles/index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
```

### Step 4.5 — Wire SignupModal to Clerk

In `src/App.jsx`, find where `<SignupModal>` is used. Add a real submitHandler that uses Clerk's API. Or, simpler: replace SignupModal's internal form with Clerk's `<SignUp />` component for production while keeping your custom design for the marketing surface.

The simplest first integration:
```jsx
import { SignUp } from '@clerk/clerk-react';

// Inside SignupModal, instead of the current form:
<SignUp 
  appearance={{
    elements: {
      // Match your design tokens
      formButtonPrimary: 'btn-primary',
      card: 'bg-transparent',
    }
  }}
  redirectUrl="/course"
/>
```

For more bespoke UX (keeping your custom form, just wiring it to Clerk), use Clerk's `useSignUp()` hook — see Clerk's docs for the React quickstart.

### Step 4.6 — Verify the auth flow

1. `npm run dev` locally
2. Open the site, click Sign Up
3. Complete signup with Google OAuth
4. Verify in Clerk dashboard that the user appears
5. Verify the user can sign in/out, that protected routes work
6. Push to GitHub; Vercel auto-deploys; verify on production URL

**At this point, real saints can sign up with real accounts.**

### Step 4.7 — Apple Sign-In (when you're ready for App Store)

This requires an Apple Developer account ($99/year). Defer until you're ready to submit a native app to the App Store. Clerk's docs walk you through it cleanly when you're ready.

---

## Part 5 — Wire the Companion AI Backend (One to Two Days)

Replace the Companion stub with real Anthropic-API-backed responses.

### Step 5.1 — Get an Anthropic API key

1. Visit console.anthropic.com
2. Sign up; verify email
3. Add billing (start with $20-100 credit; the Companion uses ~$0.50-3 per 1,000 conversations depending on length)
4. Generate an API key (starts with `sk-ant-...`)

### Step 5.2 — Choose a backend approach

The Anthropic API key cannot be exposed to the browser (anyone could steal it and run up your bill). It must live on a server. Three options:

- **Vercel Edge Function** (recommended) — serverless function deployed alongside your site. Add `api/companion.js` to your project; Vercel auto-deploys it as `https://kingdomcourse.org/api/companion`.
- **Cloudflare Worker** — alternative serverless. Slightly cheaper at scale but more setup.
- **Express server on Render or Fly.io** — full backend if you eventually need a real database too.

### Step 5.3 — Build the Vercel Edge Function

Create `api/companion.js` in the project root:

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

### Step 5.4 — Add the API key to Vercel

In Vercel dashboard → Project → Settings → Environment Variables:
- Name: `ANTHROPIC_API_KEY`
- Value: your `sk-ant-...` key
- Environments: Production, Preview, Development

### Step 5.5 — Wire the Companion component

In `src/components/Companion.jsx`, find where the placeholder reply lives and replace with:

```jsx
const apiEndpoint = '/api/companion';

const sendMessage = async (userMessage) => {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: COMPANION_SYSTEM_BASE + tabContext,
      messages: [...history, { role: 'user', content: userMessage }],
    }),
  });
  const data = await response.json();
  return data.content;
};
```

### Step 5.6 — Test end-to-end

1. Push to GitHub; Vercel deploys
2. On the live site, open the Companion floating button
3. Ask: "What is the Gospel page about?"
4. Verify a real Claude-generated response comes back
5. Check the Anthropic Console to confirm API usage is being charged

### Step 5.7 — Add rate limiting (important)

Without rate limiting, a malicious user could hammer your Companion endpoint and run up a $1,000 bill overnight. Add rate limiting:

```javascript
// In api/companion.js, before the Anthropic call
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '1 h'),
});

const ip = req.headers['x-forwarded-for'] || 'unknown';
const { success } = await ratelimit.limit(ip);
if (!success) {
  return res.status(429).json({ error: 'Rate limit exceeded' });
}
```

Set up a free Upstash Redis instance at upstash.com (free tier: 10,000 commands/day, plenty for early traffic).

**At this point, the Companion AI is real and rate-limited.**

---

## Part 6 — Email Delivery (Two to Five Days)

So users who sign up actually get the daily reading.

### Step 6.1 — Choose an email provider

- **Resend** (recommended) — built for developers, generous free tier (3,000 emails/month free, $20/mo for 50K). Modern API.
- **Postmark** — similar; slightly more expensive but excellent deliverability.
- **SendGrid** — older, more enterprise. Avoid unless you have a specific reason.

### Step 6.2 — Set up Resend

1. Visit resend.com; sign up
2. Verify your sending domain (`kingdomcourse.org`) — add DNS records they provide
3. Generate an API key
4. Add `RESEND_API_KEY` to Vercel environment variables

### Step 6.3 — Build the daily-reading delivery pipeline

This is the most substantial piece of new code. The architecture:

1. When a user signs up, store their start date in your database (Clerk metadata or Supabase)
2. A daily cron job calculates which Day each active user is on
3. For each user on a given Day, send them that Day's reading

Vercel Cron Jobs (free tier) can trigger this daily:

```javascript
// api/cron/daily-reading.js
import { Resend } from 'resend';
import { course } from '../../src/data/course';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get all active users from Clerk
  const users = await getActiveUsers();

  for (const user of users) {
    const dayNumber = calculateUserDay(user.signupDate);
    if (dayNumber > 50) continue; // course finished
    
    const dayContent = getDayContent(course, dayNumber);
    
    await resend.emails.send({
      from: 'Kingdom Course <daily@kingdomcourse.org>',
      to: user.email,
      subject: `Day ${dayNumber} — ${dayContent.title}`,
      html: renderDayEmailHTML(dayContent),
    });
  }

  return res.status(200).json({ sent: users.length });
}
```

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/daily-reading",
    "schedule": "0 6 * * *"
  }]
}
```

This runs every day at 6 AM UTC. For per-user timezone delivery (more thoughtful), batch users by timezone and run multiple cron jobs.

### Step 6.4 — Email template

Build an HTML email template that matches your brand. Resend has a React Email companion library (`react-email`) that lets you write emails as React components. Recommended.

### Step 6.5 — Test the full loop

1. Sign up as a test user
2. Wait until 6 AM UTC the next day (or manually trigger the cron via Vercel dashboard)
3. Verify the email arrives, looks good, links back to the live Course Day on the site

**At this point, the daily reading delivery is live.** This is the heart of the Duolingo-style daily loop.

---

## Part 7 — Audio Narration (One to Three Weeks)

Audio is what made Bible in a Year work. Don't skip it.

### Step 7.1 — Decide on narration approach

- **Human narrator (highest quality):** $50-200 per finished hour. The 50-day course is roughly 4-6 hours of audio. Total: $300-1,200. Use a service like Voice123 or hire a Catholic narrator directly.
- **AI narration (lowest cost):** ElevenLabs, $22/month for 100 minutes high-quality + lower-quality fallback. Modern AI narration is good enough that most users can't tell, especially with light editing.
- **Hybrid (recommended):** Human for Hero, Prologue, Step 1 (the user's first impression). AI for the daily readings.

### Step 7.2 — Generate or record audio for each Day

For each of the 50 days, produce an audio file (MP3, ~64-128 kbps). Naming: `day-01.mp3`, `day-02.mp3`, etc.

### Step 7.3 — Host audio on a CDN

Audio files are 5-30 MB each. Don't host on Vercel (counts toward bandwidth). Use:
- **Cloudflare R2** (recommended, $0.015/GB/month, no egress fees)
- **Backblaze B2** (alternative, similar pricing)
- **AWS S3** (more expensive but most-supported)

Upload all 50 MP3s; get the public URLs.

### Step 7.4 — Add audio to the DayReading component

In `src/components/DayReading.jsx`, add an `<audio>` element with controls. Tie it to the day number. For day N, source URL is `https://r2.kingdomcourse.org/day-${N}.mp3`.

### Step 7.5 — Mobile testing

Audio playback on mobile has quirks (Safari requires user-initiated play; background playback needs Media Session API). Test thoroughly on iPhone and Android before declaring this done.

---

## Part 8 — Pre-Launch Hardening (One Week)

Before any real public launch, harden the basics.

### Step 8.1 — Privacy policy, terms of service, cookie consent

Required for production. Use a generator like Termly or hire a lawyer for $200-500 for a custom version. Add as `/privacy` and `/terms` routes; link from footer.

### Step 8.2 — Analytics

**Plausible** (recommended, $9/month) — privacy-respecting, no cookie banner needed, simple. Drop in a one-line script tag.

Alternative: **Vercel Analytics** (free with Vercel) — simpler but less detailed.

Avoid Google Analytics — privacy-invasive and the cookie banner alone hurts conversion.

### Step 8.3 — Error monitoring

**Sentry** (free tier covers small projects) — catches JavaScript errors so you know when something breaks for real users.

### Step 8.4 — Uptime monitoring

**Better Uptime** or **UptimeRobot** (free tiers exist) — pings your site every 5 minutes; alerts you if it goes down.

### Step 8.5 — Backup strategy

If you're using Clerk for auth and Anthropic for Companion, neither needs your backup attention. If you've added Supabase or another database for user progress data, set up daily automated backups.

### Step 8.6 — Soft-launch testing

Before public announcement, send the URL to 20-50 friendly Catholics. Ask them to sign up, walk Days 1-3, give feedback. Watch for:
- UX confusion points
- Companion giving bad answers
- Course content that lands wrong
- Mobile bugs you didn't catch
- Email deliverability issues

Iterate for 2-4 weeks based on this feedback.

---

## Part 9 — Public Launch (One Day)

When all of the above is solid:

### Step 9.1 — Pick the launch date

Anchor to a Catholic feast — Easter Vigil, Pentecost, Feast of the Sacred Heart, Feast of the Immaculate Conception, Easter Sunday. The feast becomes part of the launch story.

### Step 9.2 — Write the launch announcement

A simple Substack post or website blog announcement. Components:
- Why now
- What The Kingdom Course is
- Who it's for
- Your story (briefly)
- The CTA: "Walk the Course — fifty days from where you are now to Pentecost"
- The link

### Step 9.3 — Coordinate with friendly Catholic media

Reach out to:
- **Word on Fire** — Bishop Barron's team is approachable
- **Pillar Catholic** — independent journalism, often picks up new Catholic projects
- **EWTN** — large reach, slower bureaucracy
- **Catholic Answers** — apologetics-focused, audience overlap
- **Local Catholic newspapers** — your home diocese's paper
- **Catholic Twitter / X / Bluesky** — direct outreach to formative voices
- **Catholic podcasters** — especially anyone whose audience matches the Gate's target (skeptics, lapsed, formed Catholics)

### Step 9.4 — Launch day execution

Morning of feast day:
- Push the announcement live
- Email your soft-launch list with "today's the day"
- Post to all your social channels
- Email warm media contacts
- Watch for issues (Sentry, Plausible, Vercel logs)

Don't be alone. Have at least one collaborator standing by to help with issues.

### Step 9.5 — First-week monitoring

Watch the metrics:
- Daily signup rate
- Day 1 → Day 7 retention (does anyone get past the first week?)
- Companion conversation rate
- Email deliverability (any bounces?)
- Top user-reported issues

Iterate fast in the first week. Fix bugs same-day. Reply to user emails personally.

---

## Part 10 — Operational Maintenance (Ongoing)

After launch, the work is no longer "build the product" — it's "run the mission."

### Step 10.1 — Weekly operating cadence

- **Monday:** Review last week's metrics. Fix issues. Plan content.
- **Tuesday-Thursday:** Build or content-revise; reply to users; iterate.
- **Friday:** Patron updates if applicable; deploy any week's changes.
- **Sunday:** Mass and rest. Don't work.

### Step 10.2 — Monthly cadence

- Send a Patron update with metrics, testimonies, prayer requests
- Review which Course days have highest drop-off; revise content
- Review Companion logs; identify where it gives bad answers; refine system prompt
- Identify the best testimony of the month; ask permission to feature it

### Step 10.3 — Quarterly cadence

- Episcopal relationship update — check in with bishop contacts
- Theological reviewer check-in — any concerns?
- Patron pipeline review — who's mature enough to ask for upgraded support?
- Strategic review — is the multiplication rate above 1.0? If not, why?

### Step 10.4 — Annual cadence

- Full content audit — what needs updating?
- Strategic plan refresh — V11? V12?
- Financial review — sustainable through next year?
- Personal review — am I sustainably doing this?

---

## Part 11 — The Honest Cost Summary

A realistic monthly operating cost at different scales, so you can plan funding:

**Tier 1 — first 100 users**
- Vercel: $0 (free tier)
- Clerk: $0 (free tier covers up to 10K MAU)
- Anthropic API: $5-30 (low Companion usage)
- Resend: $0 (free tier covers 3K emails)
- Domain: $1 (annualized)
- Sentry/Plausible: $9 (Plausible only; Sentry free tier sufficient)
- **Total: ~$15-40/month**

**Tier 1 — 1,000 users**
- Vercel: $0-20
- Clerk: $0
- Anthropic API: $50-300
- Resend: $20 (50K emails/month)
- Audio CDN (Cloudflare R2): $5-15
- Domain + monitoring: $15
- **Total: ~$90-370/month**

**Tier 2 — 10,000 users**
- Vercel: $20-100
- Clerk: $25
- Anthropic API: $500-3,000
- Resend: $90 (250K emails/month)
- Audio CDN: $30-100
- Monitoring + analytics: $30
- **Total: ~$700-3,250/month**

**Tier 3 — 100,000+ users**
- Multi-region hosting: $500-2,000
- Auth: $200-500
- Anthropic API: $5,000-30,000
- Email: $500-2,000
- Audio CDN: $300-1,000
- Monitoring: $200-500
- **Total: ~$6,700-36,000/month**

This scales sub-linearly with users (the $36K/month at 100K users is per-user cheaper than $370 at 1K users), which is why digital-first scaling works financially. Patrons covering $5K-50K/month gets you well into Tier 2 territory.

---

## Part 12 — Common Failure Modes

Things that have killed similar projects, listed so you avoid them.

**"Building forever" — The site is never quite ready to launch.** Cure: pick a feast day; commit publicly; ship. Tier 2-quality is good enough for launch. Iterate after.

**"Auth provider lock-in regret."** Cure: keep your business logic separate from auth provider details. The `submitHandler` seam pattern in your code is exactly this discipline. Don't store user data in Clerk's metadata that you can't migrate elsewhere.

**"Companion API cost runaway."** Cure: rate limit aggressively. Set a hard monthly cap in Anthropic's dashboard. Monitor weekly.

**"Email deliverability collapse."** Cure: warm up the sending domain gradually (start with 50 emails/day, grow to 500, then 5,000); use SPF/DKIM/DMARC properly; never buy email lists.

**"User goes through Day 1, never returns."** Cure: Day 1 has to be transformative, not just informative. Iterate Day 1 ten times if you have to. Track Day 1→Day 2 retention as your single most important early metric.

**"Founder burnout at month 9."** Cure: Sunday rest from Day 1. Spiritual director from Day 1. At least one collaborator (even part-time) from Day 1. The mission is not yours to save; it's the King's to advance through you.

**"Theological criticism public and damaging."** Cure: imprimatur + theological reviewer + bishop letter, all in place before broad public launch. Defense in depth.

**"Spanish-only audience locked out."** Cure: Spanish from launch if possible. Spanish in year 2 if not. Don't wait until year 5.

---

## Part 13 — A Note on This Plan

This document is intentionally opinionated. Other professional approaches would do things differently. Some examples of where I committed to specific recommendations rather than presenting menus:

- **Vercel over Netlify or Cloudflare Pages.** All three work. Vercel's React/Vite developer experience is best.
- **Clerk over Supabase or Auth0.** All three work. Clerk's React-first DX is best for the Day 1 launch.
- **Resend over Postmark or SendGrid.** All three work. Resend is built for the modern developer.
- **Plausible over Google Analytics.** A real philosophical choice — Catholic users, especially seminarians and clergy, increasingly value privacy. Google Analytics is a brand cost.

If a different professional disagrees with any of these, listen. None are religious commitments. They're pragmatic recommendations to get a launchable site live fastest.

The truly non-negotiable advice in this document:

1. **Stay with custom code, not a builder.** You've built something a builder can't.
2. **OAuth from Day 1.** Email-only signup is friction.
3. **Audio matters.** Bible in a Year proved this.
4. **Soft-launch before public-launch.** Always.
5. **Sunday is rest.** From Day 1.
6. **The mission is not yours to save.**

Everything else is engineering.

---

**Document version:** 1.0
**Date:** May 2026
**Companion documents:**
- `KINGDOM_MASTER_STRATEGY_V10.md` — strategy
- `COMPREHENSIVE_CHANGE_SUMMARY_SINCE_V9.md` — what changed
- `KINGDOM_LAUNCH_PLAYBOOK.md` — launch tiers and decisions
- `kingdom-vite-batch21/NEXT_STEPS.md` — alternative technical reference

**For the next conversation:**

> *"I'm at Step [X.Y] of the Kingdom Course build-from-scratch guide. I've completed [previous steps]. I need help with [specific next step — e.g., 'wiring Clerk to my SignupModal', 'building the Vercel Edge Function for Companion', 'setting up the daily-reading cron job']. Here's what I have so far: [paste relevant code or describe state]. What's the next concrete step?"*

The plan is ready. The site is ready. You're ready.

*Salus animarum suprema lex.*
