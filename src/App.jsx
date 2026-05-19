import { useState, useEffect, lazy, Suspense } from 'react';
import { useUser, useSignUp, useSignIn, useClerk, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import {
  CHURCH_TODAY,
  HOUSES,
  HOUSE_QUOTES,
  TODAY_HOUSE_QUOTE_INDEX,
  DAILY_PRACTICES,
  STEP_COLORS,
  TODAY_GO,
  QUIZ_QUESTIONS,
  SAINTS_HUB,
  PRACTICES,
  getLiturgicalDay,
} from '@data';
import { toRoman } from '@shared/utils';
import { useDailyCompletion, useKingdomStorage } from '@shared/storage';
import {
  AbideLocator,
  AddIntentionModal,
  AwakenToTheDay,
  CloudOfWitnesses,
  Compline,
  DailyExamen,
  HousesQuiz,
  LectioDivina,
  PassItOn,
  ReachOut,
  SignupModal,
  TheRosary,
  VerifyEmailModal,
  WorkOfMercy,
} from '@modals';
import {
  KingdomHubView,
  FieldGuideHub,
  PracticeGuide,
  KingdomTabNav,
  Footer,
  Companion,
  FloatingCompanion,
} from '@components';

// Lazy-load CourseTabView. The course content data is ~106 KB gzipped,
// so loading it on demand (when the user toggles to Course mode) keeps
// first-paint payload under target. The Suspense boundary below shows
// a thin loading message while the chunk fetches.
const CourseTabView = lazy(() => import('@components/CourseTabView.jsx'));

// Lazy-load GospelTabView. The Gate's CIRCLES data is small (~21 KB raw)
// but the editorial copy across Hero/Prologue/Trail/Bridge/CircleModal/
// GateInvitation totals enough that lazy-loading saves first-paint weight.
// In practice the Gate is the visitor's first stop, so consider warming
// this chunk on hover/intent in a future polish pass.
const GospelTabView = lazy(() => import('@components/GospelTabView.jsx'));

// IS_DEV — true in `vite dev`, false in production builds. See src/env.js
// for the import.meta.env.DEV access. Vite replaces that with a literal
// boolean at build time, so the dev preview toggle and harness shell are
// dead-code-eliminated from production bundles. The test harness
// intercepts the env module to control IS_DEV per-test.
import { IS_DEV } from './env.js';

/* ============================================================================
   APP — scaffold demo + modal harness.

   Three things this file is doing:

   1. Exercising every migrated data module so the import graph proves
      out end-to-end (this is what HANDOFF.md calls the "working demo").

   2. Demonstrating the three modals migrated in this batch
      (AddIntentionModal, HousesQuiz, CloudOfWitnesses) by wiring them
      into a small harness so they can be opened, used, and verified by
      hand at /. Each modal is a self-contained leaf — App.jsx provides
      the open/close state and the persistence callbacks.

   3. Persisting state through @shared/storage's localStorage hooks:
      `houseKey` and `intentions` survive page reloads.

   When the next migration batch lands (TheRosary, LectioDivina, etc.),
   each new modal gets one more switch in `activeModal`. The pattern
   established here scales without restructuring.
   ============================================================================ */

export default function App() {
  // Liturgical date browser — the original demo's behavior.
  const [selectedDate, setSelectedDate] = useState(new Date());
  const day = getLiturgicalDay(selectedDate);

  // House discernment — preview of the user's discerned House (persisted).
  const [houseKey, setHouseKey] = useKingdomStorage('houseKey', null);
  const [previewHouse, setPreviewHouse] = useState(null);
  const activeHouseKey = previewHouse || houseKey;

  // Daily progress — the seven essentials' check-state.
  const { completedToday, toggleComplete } = useDailyCompletion();

  // Intentions — list of names the user is carrying in prayer (persisted).
  const [intentions, setIntentions] = useKingdomStorage('intentions', []);
  // Per FINAL_CONTENT_REVISION_PLAN §2.4. ISO string of the user's most
  // recently recorded Confession; null until they've marked one. The
  // Hub surfaces a gentle 35-day prompt off this value.
  const [lastConfessionDate, setLastConfessionDate] = useKingdomStorage('lastConfessionDate', null);
  const markConfessionToday = () => setLastConfessionDate(new Date().toISOString());

  // Modal state — exactly one modal open at a time, or none.
  const [activeModal, setActiveModal] = useState(null);

  // Preview mode — five states for the dev shell:
  //   "harness" — original modal-test buttons (default in DEV)
  //   "gate"    — live Gospel/Gate tab (composed)
  //   "hub"     — live Kingdom tab (HubHero + SevenEssentials + MoreGrid)
  //   "course"  — live Course tab (CourseHero + CourseJourney + week/day views)
  //   "live"    — production assembly (KingdomTabNav + tab content + Footer)
  //
  // In a production build (import.meta.env.DEV === false) we always start
  // in "live" and the dev toggle is hidden. In dev the toggle is visible
  // and we default to harness for component-level inspection.
  //
  // The isDev value comes from the IS_DEV constant declared at module
  // scope below — it's hoisted out of the component so the harness's
  // CommonJS loader can override it without touching this code path.
  const [previewMode, setPreviewMode] = useState(IS_DEV ? 'harness' : 'live');

  // Kingdom tab sub-routing: "hub" | "practices" | "practice"
  // Active when previewMode === "hub". The harness shell uses the modal-test
  // buttons; the hub preview can navigate between the Hub, the FieldGuideHub,
  // and a single PracticeGuide.
  const [kingdomView, setKingdomView] = useState('hub');
  const [activePractice, setActivePractice] = useState(null);

  // Course tab sub-routing: "overview" | "week" | "day" | "sending"
  // Active when previewMode === "course". Tracks the user's current
  // navigation within the 7-week journey.
  const [courseView, setCourseView] = useState('overview');
  const [activeWeekN, setActiveWeekN] = useState(1);
  const [activeDayKey, setActiveDayKey] = useState(1);

  // Course progress tracking — keys "w{N}-d{N}" or "w{N}-prologue".
  // Persisted to localStorage so the progress survives page reload.
  const [courseProgress, setCourseProgress] = useKingdomStorage('courseProgress', {});

  // Production chrome state (when previewMode === "live"):
  //   tab — which top-level tab is active in the production layout
  //   passItOnOpen — share modal toggle
  //   companionOpen — Companion chat panel toggle (stub-API mode for now)
  //   signupOpen — signup modal toggle (stub-mode for now)
  //   currentUser — { email, name?, parish?, signedUpAt } | null. Persisted
  //                 to localStorage by SignupModal's stub handler. When real
  //                 auth lands, the auth provider replaces this state via
  //                 a different mechanism (cookie session, auth context, etc).
  const [productionTab, setProductionTab] = useKingdomStorage('productionTab', 'gate');
  const [passItOnOpen, setPassItOnOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  // Per FINAL_CONTENT_REVISION_PLAN §1.8 — when SignupModal opens via the
  // Day 2..50 gate, this flag tells handleSignupSuccess to land the user
  // on Day 2 (the next reading) rather than the Course overview.
  const [signupAfterGate, setSignupAfterGate] = useState(false);
// Auth — Clerk's useUser() is the source of truth for who is signed in.
  // The `user` object Clerk returns has a different shape than our previous
  // stub user, so we adapt it here into the shape the rest of the app
  // expects: { email, name?, parish?, signedUpAt }.
  const { user: clerkUser, isSignedIn, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const currentUser = (isSignedIn && clerkUser) ? {
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    name: clerkUser.firstName || null,
    parish: clerkUser.unsafeMetadata?.startingFrom || null,
    signedUpAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : null,
  } : null;
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore — signout failures are non-fatal
    }
  };
  // After verification completes, Clerk auto-sets the user as signed-in via
  // setActive(). This callback closes the signup flow. The `user` arg comes
  // from SignupModal's onSuccess; it's the unverified user from step 1 of
  // the two-step flow, but we don't actually use it here — we just close.
  const handleSignupSuccess = () => {
    setSignupOpen(false);
    // After signup completes, route the new user straight to The Course.
    // The signed-in Course view greets them ("Hello, Aaron.") and surfaces
    // their starting point — fulfilling the modal's "Begin the Course" CTA.
    setProductionTab('course');
    // If signup was triggered by the Course Day 2 gate, land the user on
    // Day 2 (the next reading) instead of the overview. Per §1.8.
    if (signupAfterGate) {
      setSignupAfterGate(false);
      setActiveWeekN(1);
      setActiveDayKey(2);
      setCourseView('day');
    }
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };
  const openSignupFromCourseGate = () => {
    setSignupAfterGate(true);
    setSignupOpen(true);
  };
  // The actual Clerk-wired submit handler passed to <SignupModal>.
  // Step 1 of the two-step flow: creates the user record (unverified)
  // and triggers Clerk's email-verification code send. The modal closes
  // on resolve; the second step (collecting the code) happens in the
  // VerifyEmailModal that mounts after this resolves.
  // Initiates Clerk's Google OAuth redirect flow. Clerk handles both
  // sign-up (first time) and sign-in (returning user) automatically —
  // we use signIn's authenticateWithRedirect which Clerk routes to
  // signUp under the hood when no account exists for the Google email.
  //
  // On success, Google redirects back to `/sso-callback` where Clerk's
  // AuthenticateWithRedirectCallback component completes the flow and
  // returns the user to `/`. Both URLs are relative to the current
  // origin (localhost in dev, kingdomcourse.org in production).
  const handleGoogleSignup = async () => {
    if (!signInLoaded) {
      // eslint-disable-next-line no-console
      console.warn('[handleGoogleSignup] Clerk signIn resource not yet loaded');
      return;
    }
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
      // Note: code below this point never runs in the normal case —
      // authenticateWithRedirect navigates the browser away from our app.
      // The user comes back through `/sso-callback` once Google completes.
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[handleGoogleSignup] failed to start OAuth:', err);
    }
  };
  const handleClerkSignup = async ({ email, name, parish }) => {
    if (!signUpLoaded) {
      throw new Error('Auth is still loading. Please try again in a moment.');
    }
    try {
      await signUp.create({
        emailAddress: email,
        firstName: name || undefined,
        unsafeMetadata: parish ? { startingFrom: parish } : {},
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifyEmailOpen(true);
      return {
        email,
        name: name || null,
        parish: parish || null,
        signedUpAt: new Date().toISOString(),
      };
    } catch (err) {
      const message = err?.errors?.[0]?.message || 'Could not start signup. Please try again.';
      throw new Error(message);
    }
  };
  // VerifyEmailModal is opened after handleClerkSignup completes step 1.
  // It collects the 6-digit code and calls Clerk's
  // attemptEmailAddressVerification to complete signup.
  const [verifyEmailOpen, setVerifyEmailOpen] = useState(false);

  const goToHub = () => {
    setKingdomView('hub');
    setActivePractice(null);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };
  const goToFieldGuide = () => {
    setKingdomView('practices');
    setActivePractice(null);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };
  const goToPractice = (slug) => {
    const found = PRACTICES.find((p) => p.slug === slug);
    if (!found) return;
    setActivePractice(found);
    setKingdomView('practice');
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  // ---- Course routing — minimal state only --------------------------------
  // CourseTabView owns the day-navigation logic and labels. App holds
  // only the position state + toggleComplete handler + share handler.
  const courseToggleComplete = (weekN, dayKey) => {
    const key = dayKey === 'prologue' ? `w${weekN}-prologue` : `w${weekN}-d${dayKey}`;
    setCourseProgress((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  const offsetDay = (n) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + n);
    setSelectedDate(d);
  };

  return (
    <>
      {/* OAuth redirect callback — when Google sends the user back to
          /sso-callback, this component completes the auth flow then
          navigates to the redirectUrl we set in authenticateWithRedirect.
          On any other path it renders nothing. */}
      {typeof window !== 'undefined' && window.location.pathname === '/sso-callback' && (
        <AuthenticateWithRedirectCallback
          afterSignInUrl="/"
          afterSignUpUrl="/"
        />
      )}
      {/* Dev preview mode toggle — only visible in development. Production
          builds always run in "live" mode and never see this toggle. */}
      {IS_DEV && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 200,
            display: 'flex',
            gap: '0.375rem',
          }}
        >
          {[
            { id: 'harness', label: 'Harness' },
            { id: 'gate', label: 'Gate' },
            { id: 'hub', label: 'Hub' },
            { id: 'course', label: 'Course' },
            { id: 'live', label: 'Live' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setPreviewMode(m.id)}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: 10,
                fontFamily: "'Cormorant SC', serif",
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                background: previewMode === m.id ? '#0E0A06' : '#F6EFDE',
                color: previewMode === m.id ? '#F6EFDE' : '#0E0A06',
                border: '1px solid ' + (previewMode === m.id ? '#D7B169' : '#0E0A06'),
                cursor: 'pointer',
                minHeight: 36,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {previewMode === 'live' ? (
        <>
          <KingdomTabNav
            tab={productionTab}
            onTab={(id) => {
              setProductionTab(id);
              if (typeof window !== 'undefined') window.scrollTo(0, 0);
            }}
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onShare={() => setPassItOnOpen(true)}
            onOpenCompanion={() => setCompanionOpen(true)}
            onOpenSignup={() => setSignupOpen(true)}
          />
          <main>
            {productionTab === 'gate' && (
              <Suspense
                fallback={
                  <div
                    style={{
                      minHeight: '50svh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#F6EFDE',
                      color: '#0E0A06',
                      fontFamily: "'Cormorant SC', serif",
                      fontSize: 12,
                      letterSpacing: '0.18em',
                    }}
                  >
                    Loading the gate...
                  </div>
                }
              >
                <GospelTabView
                  onToCourse={() => {
                    setProductionTab('course');
                    if (typeof window !== 'undefined') window.scrollTo(0, 0);
                  }}
                  onShare={() => setPassItOnOpen(true)}
                />
              </Suspense>
            )}
            {productionTab === 'course' && (
              <Suspense
                fallback={
                  <div
                    style={{
                      minHeight: '50svh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#F6EFDE',
                      color: '#0E0A06',
                      fontFamily: "'Cormorant SC', serif",
                      fontSize: 12,
                      letterSpacing: '0.18em',
                    }}
                  >
                    Loading the path...
                  </div>
                }
              >
                <CourseTabView
                  view={courseView}
                  activeWeekN={activeWeekN}
                  activeDayKey={activeDayKey}
                  setActiveWeekN={setActiveWeekN}
                  setActiveDayKey={setActiveDayKey}
                  setView={setCourseView}
                  currentUser={currentUser}
                  currentPosition={{ weekN: activeWeekN, dayKey: activeDayKey }}
                  progress={courseProgress}
                  onMarkComplete={courseToggleComplete}
                  onShare={() => setPassItOnOpen(true)}
                  onOpenSignup={openSignupFromCourseGate}
                />
              </Suspense>
            )}
            {productionTab === 'kingdom' && (
              kingdomView === 'practices' ? (
                <FieldGuideHub
                  onOpenPractice={goToPractice}
                  onToCourse={() => {
                    setProductionTab('course');
                    if (typeof window !== 'undefined') window.scrollTo(0, 0);
                  }}
                />
              ) : kingdomView === 'practice' && activePractice ? (
                <PracticeGuide
                  practice={activePractice}
                  onBack={goToFieldGuide}
                  relatedPractices={PRACTICES.filter(
                    (p) => p.category === activePractice.category && p.slug !== activePractice.slug,
                  ).slice(0, 3)}
                  onOpenPractice={goToPractice}
                />
              ) : (
                <KingdomHubView
                  houseKey={activeHouseKey}
                  completedToday={completedToday}
                  onPracticeStart={(n) => {
                    const map = {
                      1: 'awaken',
                      2: 'lectio',
                      3: 'examen',
                      4: 'abide',
                      5: 'reach',
                      6: 'build',
                      7: 'rosary',
                    };
                    setActiveModal(map[n] || null);
                  }}
                  onCompline={() => setActiveModal('compline')}
                  complineDone={false}
                  intentions={intentions}
                  onOpenHouseQuiz={() => setActiveModal('quiz')}
                  onOpenIntention={() => setActiveModal('intention')}
                  onOpenWitnesses={() => setActiveModal('witnesses')}
                  onGoToFieldGuide={goToFieldGuide}
                  lastConfessionDate={lastConfessionDate}
                  onMarkConfession={markConfessionToday}
                />
              )
            )}
          </main>
          <Footer
            onTab={(id) => {
              setProductionTab(id);
              if (typeof window !== 'undefined') window.scrollTo(0, 0);
            }}
            onOpenFieldGuide={() => {
              setProductionTab('kingdom');
              setKingdomView('practices');
              if (typeof window !== 'undefined') window.scrollTo(0, 0);
            }}
          />
          <PassItOn open={passItOnOpen} onClose={() => setPassItOnOpen(false)} />
          <SignupModal
            open={signupOpen}
            onClose={() => setSignupOpen(false)}
            onSuccess={handleSignupSuccess}
            submitHandler={handleClerkSignup}
            googleHandler={handleGoogleSignup}
          />
          <VerifyEmailModal
            open={verifyEmailOpen}
            onClose={() => setVerifyEmailOpen(false)}
            onVerified={async (createdSessionId) => {
              try {
                // If we have a sessionId, activate it. If not, fall back
                // to letting Clerk pick the most recently created session
                // for this signUp resource.
                if (createdSessionId) {
                  await setActive({ session: createdSessionId });
                } else if (signUp?.createdSessionId) {
                  await setActive({ session: signUp.createdSessionId });
                }
              } catch {
                // Non-fatal: the user is verified on Clerk's side even if
                // setActive failed; a page reload would pick up the session.
              }
              setVerifyEmailOpen(false);
              setSignupOpen(false);
            }}
            signUp={signUp}
          />
          <Companion
            open={companionOpen}
            onClose={() => setCompanionOpen(false)}
            currentTab={productionTab}
            // No apiEndpoint — runs in stub mode (returns the placeholder
            // reply). Wire to a backend proxy when ready.
          />
          <FloatingCompanion onClick={() => setCompanionOpen(true)} />
        </>
      ) : previewMode === 'gate' ? (
        <Suspense
          fallback={
            <div
              style={{
                minHeight: '50svh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F6EFDE',
                color: '#0E0A06',
                fontFamily: "'Cormorant SC', serif",
                fontSize: 12,
                letterSpacing: '0.18em',
              }}
            >
              Loading the gate...
            </div>
          }
        >
          <GospelTabView
            onToCourse={() => setPreviewMode('course')}
            onShare={() => {
              // eslint-disable-next-line no-console
              console.log('[batch 17] Gate share triggered — wires to share sheet later');
            }}
          />
        </Suspense>
      ) : previewMode === 'course' ? (
        <Suspense
          fallback={
            <div
              style={{
                minHeight: '50svh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F6EFDE',
                color: '#0E0A06',
                fontFamily: "'Cormorant SC', serif",
                fontSize: 12,
                letterSpacing: '0.18em',
              }}
            >
              Loading the path...
            </div>
          }
        >
          <CourseTabView
            view={courseView}
            activeWeekN={activeWeekN}
            activeDayKey={activeDayKey}
            setActiveWeekN={setActiveWeekN}
            setActiveDayKey={setActiveDayKey}
            setView={setCourseView}
            currentUser={null}
            currentPosition={{ weekN: activeWeekN, dayKey: activeDayKey }}
            progress={courseProgress}
            onMarkComplete={courseToggleComplete}
            onShare={() => {
              // eslint-disable-next-line no-console
              console.log('[batch 16] Share triggered — wires to share sheet later');
            }}
          />
        </Suspense>
      ) : previewMode === 'hub' ? (
        // Kingdom tab — three views: hub | practices | practice
        kingdomView === 'practices' ? (
          <FieldGuideHub onOpenPractice={goToPractice} onToCourse={goToHub} />
        ) : kingdomView === 'practice' && activePractice ? (
          <PracticeGuide
            practice={activePractice}
            onBack={goToFieldGuide}
            relatedPractices={PRACTICES.filter(
              (p) => p.category === activePractice.category && p.slug !== activePractice.slug,
            ).slice(0, 3)}
            onOpenPractice={goToPractice}
          />
        ) : (
          <KingdomHubView
            houseKey={activeHouseKey}
            completedToday={completedToday}
            onPracticeStart={(n) => {
              // Map essential number → modal slug for the dev preview.
              const map = {
                1: 'awaken',
                2: 'lectio',
                3: 'examen',
                4: 'abide',
                5: 'reach',
                6: 'build',
                7: 'rosary',
              };
              setActiveModal(map[n] || null);
            }}
            onCompline={() => setActiveModal('compline')}
            complineDone={false}
            intentions={intentions}
            onOpenHouseQuiz={() => setActiveModal('quiz')}
            onOpenIntention={() => setActiveModal('intention')}
            onOpenWitnesses={() => setActiveModal('witnesses')}
            onGoToFieldGuide={goToFieldGuide}
            lastConfessionDate={lastConfessionDate}
            onMarkConfession={markConfessionToday}
          />
        )
      ) : IS_DEV ? (
        // HarnessShell is the dev-only modal-test grid. The IS_DEV guard
        // lets Vite tree-shake the entire HarnessShell function (~10 KB
        // raw / ~3 KB gz) from production bundles, since IS_DEV is
        // statically replaced with `false` and this branch becomes dead
        // code. In production, the chain above always lands on the Live
        // mode branch since previewMode initializes to "live" when !IS_DEV.
        <HarnessShell
          day={day}
          activeHouseKey={activeHouseKey}
          houseKey={houseKey}
          previewHouse={previewHouse}
          setPreviewHouse={setPreviewHouse}
          completedToday={completedToday}
          toggleComplete={toggleComplete}
          intentions={intentions}
          setIntentions={setIntentions}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          offsetDay={offsetDay}
          setSelectedDate={setSelectedDate}
        />
      ) : (
        // Production fallback — should be unreachable since previewMode
        // initializes to "live" in production builds. Render nothing
        // rather than crash on an unexpected mode.
        null
      )}

      {/* Modal mounts — visible from BOTH the harness and the hub preview.
          The early return above ensures only one of (harness, hub) is on
          screen, but modals can be opened from either. */}
      {activeModal === 'quiz' && (
        <HousesQuiz
          onSave={(slug) => {
            setHouseKey(slug);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'intention' && (
        <AddIntentionModal
          onAdd={(intention) => {
            setIntentions([...intentions, intention]);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'witnesses' && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto',
            background: '#0E0A06',
          }}
        >
          {/* Close strip — CloudOfWitnesses is a section without its own
              close affordance, so the harness wraps it with one. */}
          <div
            style={{
              position: 'sticky', top: 0, zIndex: 30,
              background: '#0E0A06',
              borderBottom: '1px solid rgba(246,239,222,0.10)',
              padding: '1rem 1.5rem',
              display: 'flex', justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="btn-ghost-dark sc"
              style={{ fontSize: 10, padding: '0.5rem 1rem', minHeight: 36 }}
            >
              ✕ Close
            </button>
          </div>
          <CloudOfWitnesses />
        </div>
      )}
      {activeModal === 'awaken' && (
        <AwakenToTheDay
          onComplete={() => {
            toggleComplete(1);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'lectio' && (
        <LectioDivina
          onComplete={() => {
            toggleComplete(2);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'examen' && (
        <DailyExamen
          onComplete={() => {
            toggleComplete(3);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'abide' && (
        <AbideLocator
          onComplete={() => {
            toggleComplete(4);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'reach' && (
        <ReachOut
          onComplete={() => {
            toggleComplete(5);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'build' && (
        <WorkOfMercy
          onComplete={() => {
            toggleComplete(6);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'rosary' && (
        <TheRosary
          onComplete={() => {
            toggleComplete(7);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'compline' && (
        <Compline
          onComplete={() => {
            console.log('Compline completed');
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------------
// HarnessShell — the original modal-harness UI extracted into its own
// component so App.jsx can flip between it and KingdomHubView without
// duplicating the full body. All state still lives in App; HarnessShell
// receives it as props.
// ----------------------------------------------------------------------------
function HarnessShell({
  day,
  activeHouseKey,
  houseKey,
  previewHouse,
  setPreviewHouse,
  completedToday,
  toggleComplete,
  intentions,
  setIntentions,
  activeModal,
  setActiveModal,
  offsetDay,
  setSelectedDate,
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F6EFDE',
        color: '#0E0A06',
        fontFamily: 'EB Garamond, serif',
        padding: '3rem 1.5rem 6rem',
      }}
    >
      <div style={{ maxWidth: '44rem', margin: '0 auto' }}>
        <header style={{ marginBottom: '3rem' }}>
          <p className="sc" style={small}>
            The Kingdom Course · Vite scaffold · Modal harness · 3 of 11
          </p>
          <h1 style={h1}>Today in the Universal Church</h1>
          <p style={subtle}>
            {day.weekday}, {day.date} · {day.season}
          </p>
        </header>

        <section style={card}>
          <p style={eyebrow}>{day.liturgicalDate}</p>
          {day.feast && (
            <>
              <h2 style={h2}>{day.feast.name}</h2>
              <p style={italic}>{day.feast.line}</p>
            </>
          )}
        </section>

        {day.readings?.gospel && (
          <section style={card}>
            <p style={eyebrow}>Gospel · {day.readings.gospel.ref}</p>
            <p style={lede}>{day.readings.gospel.blurb}</p>
          </section>
        )}

        {day.papalIntention && (
          <section style={{ ...card, background: '#EFE6CF' }}>
            <p style={eyebrow}>Holy Father · {day.papalIntention.month} intention</p>
            <p style={italic}>{day.papalIntention.text}</p>
          </section>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
          <button onClick={() => offsetDay(-1)} style={btn}>← Yesterday</button>
          <button onClick={() => setSelectedDate(new Date())} style={btn}>Today</button>
          <button onClick={() => offsetDay(1)} style={btn}>Tomorrow →</button>
        </div>

        {/* ──── Migrated modals harness ─────────────────────────────────── */}
        <h3 style={h3}>Migrated modals (11 of 11) — modal layer complete</h3>
        <p style={italic}>
          Each button opens its modal. Persistence on House and intentions is
          via localStorage; reload to verify.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setActiveModal('quiz')} style={btnPrimary}>
            ▸ Open: HousesQuiz
            {houseKey && <span style={{ ...small, marginLeft: 'auto', color: HOUSES[houseKey]?.color || '#8A6828' }}>
              Saved: House of {HOUSES[houseKey]?.name}
            </span>}
          </button>
          <button onClick={() => setActiveModal('intention')} style={btnPrimary}>
            ▸ Open: AddIntentionModal
            <span style={{ ...small, marginLeft: 'auto', color: '#8A6828' }}>
              Carrying: {intentions.length}
            </span>
          </button>
          <button onClick={() => setActiveModal('witnesses')} style={btnPrimary}>
            ▸ Open: CloudOfWitnesses
            <span style={{ ...small, marginLeft: 'auto', color: '#8A6828' }}>
              {SAINTS_HUB.length} saints
            </span>
          </button>
          <button onClick={() => setActiveModal('awaken')} style={btnPrimary}>
            ▸ Open: AwakenToTheDay
            <span style={{ ...small, marginLeft: 'auto', color: '#9A4423' }}>
              SEE · 1 min
            </span>
          </button>
          <button onClick={() => setActiveModal('lectio')} style={btnPrimary}>
            ▸ Open: LectioDivina (KNOW)
            <span style={{ ...small, marginLeft: 'auto', color: '#D7B169' }}>
              4 rungs · 15 min
            </span>
          </button>
          <button onClick={() => setActiveModal('examen')} style={btnPrimary}>
            ▸ Open: DailyExamen (HEAL)
            <span style={{ ...small, marginLeft: 'auto', color: '#B5883F' }}>
              5 movements · 10 min
            </span>
          </button>
          <button onClick={() => setActiveModal('abide')} style={btnPrimary}>
            ▸ Open: AbideLocator (ABIDE)
            <span style={{ ...small, marginLeft: 'auto', color: '#B5883F' }}>
              Source & summit
            </span>
          </button>
          <button onClick={() => setActiveModal('build')} style={btnPrimary}>
            ▸ Open: WorkOfMercy (BUILD)
            <span style={{ ...small, marginLeft: 'auto', color: '#7A5230' }}>
              31 acts
            </span>
          </button>
          <button onClick={() => setActiveModal('reach')} style={btnPrimary}>
            ▸ Open: ReachOut (SEND)
            <span style={{ ...small, marginLeft: 'auto', color: '#3D3450' }}>
              Apostolic act · today
            </span>
          </button>
          <button onClick={() => setActiveModal('rosary')} style={btnPrimary}>
            ▸ Open: TheRosary (SEND · Marian)
            <span style={{ ...small, marginLeft: 'auto', color: '#D7B169' }}>
              5 mysteries · 20 min
            </span>
          </button>
          <button onClick={() => setActiveModal('compline')} style={btnPrimary}>
            ▸ Open: Compline (Night Office)
            <span style={{ ...small, marginLeft: 'auto', color: '#6B5B95' }}>
              11 sections · 12 min
            </span>
          </button>
        </div>

        {/* Intentions list — show what the modal has added */}
        {intentions.length > 0 && (
          <section style={{ ...card, background: '#EFE6CF', marginBottom: '2rem' }}>
            <p style={eyebrow}>Carried in prayer</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {intentions.map((i) => (
                <li key={i.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ flex: 0 }}>{i.who}</strong>
                  {i.what && <em style={{ ...italic, fontSize: '0.9rem', flex: 1 }}>· {i.what}</em>}
                  <button
                    onClick={() => setIntentions(intentions.filter((x) => x.id !== i.id))}
                    style={{ ...small, background: 'transparent', border: 0, cursor: 'pointer', color: '#8A6828' }}
                    aria-label={`Remove ${i.who}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ──── Seven Steps ──────────────────────────────────────────────── */}
        <h3 style={h3}>The Seven Steps</h3>
        <ul style={list}>
          {DAILY_PRACTICES.map((p) => {
            const complete = completedToday.includes(p.n);
            const color = STEP_COLORS[p.n];
            return (
              <li key={p.n}>
                <button
                  onClick={() => toggleComplete(p.n)}
                  style={{
                    ...rowBtn,
                    borderLeft: `3px solid ${color}`,
                    background: complete ? `${color}10` : 'transparent',
                  }}
                >
                  <span className="sc-bold" style={{ ...small, color, minWidth: '2.5rem' }}>
                    {toRoman(p.n)}
                  </span>
                  <span style={{ flex: 1 }}>
                    <strong style={{ display: 'block' }}>{p.verb} · {p.practice}</strong>
                    <span style={{ ...italic, fontSize: '0.85rem' }}>{p.tradition}</span>
                  </span>
                  <span style={{ ...small, color: complete ? color : '#7A6F58' }}>
                    {complete ? '✓ today' : 'tap to mark'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* ──── House preview chips ─────────────────────────────────────── */}
        <h3 style={h3}>The Five Houses</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {Object.values(HOUSES).map((h) => (
            <button
              key={h.slug}
              onClick={() => setPreviewHouse(h.slug === previewHouse ? null : h.slug)}
              style={{
                ...btn,
                borderColor: h.color,
                color: previewHouse === h.slug ? '#F6EFDE' : '#0E0A06',
                background: previewHouse === h.slug ? h.color : 'transparent',
                flex: '0 1 auto',
                minHeight: 44,
              }}
            >
              {h.name}
            </button>
          ))}
        </div>
        {activeHouseKey && (
          <section style={{ ...card, borderLeft: `3px solid ${HOUSES[activeHouseKey].color}` }}>
            <p style={eyebrow}>
              House of {HOUSES[activeHouseKey].name} · {HOUSES[activeHouseKey].tradition}
            </p>
            <h4 style={{ ...h2, fontSize: '1.5rem' }}>{HOUSES[activeHouseKey].patron}</h4>
            <p style={italic}>{HOUSES[activeHouseKey].line}</p>

            {HOUSE_QUOTES[activeHouseKey]?.[TODAY_HOUSE_QUOTE_INDEX] && (
              <blockquote
                style={{
                  marginTop: '1.25rem',
                  paddingLeft: '1rem',
                  borderLeft: `2px solid ${HOUSES[activeHouseKey].color}`,
                }}
              >
                <p style={italic}>"{HOUSE_QUOTES[activeHouseKey][TODAY_HOUSE_QUOTE_INDEX].text}"</p>
                <p
                  style={{
                    ...small,
                    marginTop: '0.5rem',
                    color: HOUSES[activeHouseKey].color,
                  }}
                >
                  — {HOUSE_QUOTES[activeHouseKey][TODAY_HOUSE_QUOTE_INDEX].saint}
                </p>
              </blockquote>
            )}
          </section>
        )}

        {/* ──── Today's GO act ──────────────────────────────────────────── */}
        <h3 style={h3}>Today's Apostolic Act · GO</h3>
        <section style={card}>
          <p style={eyebrow}>The Ignatian going forth · House of Glory</p>
          <p style={{ ...lede, fontWeight: 500 }}>{TODAY_GO.primary}</p>
          <p style={italic}>{TODAY_GO.detail}</p>
        </section>

        <h3 style={h3}>Discernment Quiz · {QUIZ_QUESTIONS.length} questions</h3>
        <p style={italic}>
          Wired and migrated. Click "Open: HousesQuiz" above to take it.
        </p>

        <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #D8CDA8' }}>
          <p style={{ ...italic, fontSize: '0.85rem' }}>
            Modal layer complete (11 of 11): AbideLocator · AddIntentionModal ·
            AwakenToTheDay · CloudOfWitnesses · Compline · DailyExamen · HousesQuiz ·
            LectioDivina · ReachOut · TheRosary · WorkOfMercy. Data layer: 8 modules
            wired (liturgical, colors, houses, saints, practices, prompts, quiz, plus
            shared utils + storage). Three tab roots remain — see MIGRATION.md.
          </p>
          <p style={{ ...small, marginTop: '1rem', textAlign: 'center', color: '#8A6828' }}>
            Salus animarum suprema lex.
          </p>
        </footer>
      </div>
    </div>
  );
}

const small = {
  fontFamily: 'Cormorant SC, serif',
  fontSize: '0.65rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#8A6828',
};
const eyebrow = { ...small, marginBottom: '0.5rem' };
const h1 = {
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: '2.5rem',
  fontWeight: 500,
  lineHeight: 1.05,
  margin: '1rem 0 0.5rem',
};
const h2 = {
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: '1.7rem',
  fontWeight: 500,
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
};
const h3 = {
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: '1.3rem',
  fontWeight: 500,
  marginTop: '3rem',
  marginBottom: '1rem',
};
const subtle = { fontStyle: 'italic', color: '#7A6F58', margin: 0 };
const italic = { fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.55, color: '#1C160D' };
const lede = { fontSize: '1.05rem', lineHeight: 1.55, color: '#1C160D', margin: '0.5rem 0' };
const card = {
  borderLeft: '2px solid #B5883F',
  paddingLeft: '1rem',
  paddingTop: '0.75rem',
  paddingBottom: '0.75rem',
  marginBottom: '1.5rem',
};
const list = { listStyle: 'none', padding: 0, margin: '0 0 2rem' };
const rowBtn = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.875rem 1rem',
  textAlign: 'left',
  fontFamily: 'inherit',
  cursor: 'pointer',
  minHeight: 56,
  marginBottom: '0.25rem',
};
const btn = {
  fontFamily: 'Cormorant SC, serif',
  fontSize: '0.7rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  padding: '0.625rem 1rem',
  background: 'transparent',
  border: '1px solid #B5883F',
  color: '#0E0A06',
  cursor: 'pointer',
  minHeight: 44,
  flex: 1,
};
const btnPrimary = {
  ...btn,
  background: 'rgba(215,177,105,0.12)',
  borderColor: '#8A6828',
  color: '#0E0A06',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  flex: '0 0 auto',
  width: '100%',
};
