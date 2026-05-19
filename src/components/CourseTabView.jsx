/* =============================================================================
   src/components/CourseTabView.jsx — The Course tab's full routing wrapper.

   Composes the four views and switches between them based on `view`:

     "overview" — CourseHero + CourseJourney
     "week"     — WeekDetail for activeWeekN
     "day"      — DayReading for activeWeekN + activeDayKey
     "sending"  — SendingDay (Day 50)

   This is the integration point — it owns enough Course-specific logic
   (day navigation, hasNext/hasPrev/labels, prologue handling) that the
   parent (App.jsx) can stay independent of SEVEN_WEEKS data. That
   independence is what allows the parent to lazy-load this component
   via React.lazy() — pulling the 106 KB course chunk out of first paint.

   Migrated routing logic from the_kingdom.jsx around line ~12981 (the
   tab === "course" branch). Day-navigation logic was originally in App's
   handlers but moved here in batch 16 to enable lazy-loading.

   Props:
     view              — "overview" | "week" | "day" | "sending"
     activeWeekN       — 1..7
     activeDayKey      — "prologue" | 1..7
     setActiveWeekN(n) — setter to update parent's week state
     setActiveDayKey(k)— setter to update parent's day state
     setView(v)        — setter to update parent's view state
     currentUser       — { name?, ... } | null — passed to CourseHero
     currentPosition   — { weekN, dayKey } | null — passed to CourseHero
     progress          — { "w{N}-d{N}": true } map of completed days
     onMarkComplete(weekN, dayKey) — invoked from DayReading mark button
     onShare()         — invoked from SendingDay
     onStartJourney    — optional override for CourseHero's logged-out CTA
     onBeginToday      — optional override for CourseHero's logged-in CTA
   ============================================================================= */

import { SEVEN_WEEKS } from '@data';
import CourseHero from './CourseHero.jsx';
import CourseJourney from './CourseJourney.jsx';
import WeekDetail from './WeekDetail.jsx';
import DayReading from './DayReading.jsx';
import SendingDay from './SendingDay.jsx';
import CourseDayGate from './CourseDayGate.jsx';

// Per FINAL_CONTENT_REVISION_PLAN §1.8 — Week 1 Day 1 and the Week 1
// Prologue are open to anonymous visitors as the low-friction try.
// Every other day (Day 2..50) and the Sending Day require an account.
function isDayFree(weekN, dayKey) {
  return weekN === 1 && (dayKey === 'prologue' || dayKey === 1);
}

// ---- Day navigation helpers ----------------------------------------------
// All logic that needs SEVEN_WEEKS data lives here, inside the lazy-loaded
// chunk, so App.jsx (the eager bundle) stays free of the course content.

function findWeek(weekN) {
  return SEVEN_WEEKS.find((w) => w.n === weekN) || SEVEN_WEEKS[0];
}

/** Compute the next position. Returns null if no next exists. */
function nextPosition(weekN, dayKey) {
  if (dayKey === 'prologue') return { weekN, dayKey: 1 };
  if (dayKey < 7) return { weekN, dayKey: dayKey + 1 };
  if (weekN < 7) {
    const next = findWeek(weekN + 1);
    return { weekN: weekN + 1, dayKey: next?.prologue ? 'prologue' : 1 };
  }
  return null;
}

/** Compute the previous position. Returns null if no prev exists. */
function prevPosition(weekN, dayKey) {
  if (dayKey === 1) {
    const thisWeek = findWeek(weekN);
    if (thisWeek?.prologue) return { weekN, dayKey: 'prologue' };
    if (weekN > 1) return { weekN: weekN - 1, dayKey: 7 };
    return null;
  }
  if (dayKey === 'prologue') {
    if (weekN > 1) return { weekN: weekN - 1, dayKey: 7 };
    return null;
  }
  return { weekN, dayKey: dayKey - 1 };
}

/** Build a short label for the next/prev button. */
function nextLabel(weekN, dayKey) {
  if (dayKey === 'prologue') return `Day ${(weekN - 1) * 7 + 1}`;
  if (dayKey < 7) return `Day ${(weekN - 1) * 7 + dayKey + 1}`;
  if (weekN < 7) return `Step ${weekN + 1}`;
  return 'Done';
}

function prevLabel(weekN, dayKey) {
  if (dayKey === 1) {
    const thisWeek = findWeek(weekN);
    return thisWeek?.prologue ? 'Prologue' : `Step ${weekN - 1}`;
  }
  if (dayKey === 'prologue') {
    return weekN > 1 ? `Step ${weekN - 1}` : 'Course';
  }
  return `Day ${(weekN - 1) * 7 + dayKey - 1}`;
}

export default function CourseTabView({
  view = 'overview',
  activeWeekN = 1,
  activeDayKey = 1,
  setActiveWeekN = () => {},
  setActiveDayKey = () => {},
  setView = () => {},
  currentUser = null,
  currentPosition = null,
  progress = {},
  onMarkComplete = () => {},
  onShare = () => {},
  onStartJourney,
  onBeginToday,
  onOpenSignup = () => {},
}) {
  const scrollTop = () => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const goToOverview = () => {
    setView('overview');
    scrollTop();
  };
  const enterWeek = (n) => {
    if (n < 1 || n > 7) return;
    setActiveWeekN(n);
    setView('week');
    scrollTop();
  };
  const openDay = (dayKey) => {
    setActiveDayKey(dayKey);
    setView('day');
    scrollTop();
  };
  const backToWeek = () => {
    setView('week');
    scrollTop();
  };
  const toSending = () => {
    setView('sending');
    scrollTop();
  };

  const handleNextDay = () => {
    const next = nextPosition(activeWeekN, activeDayKey);
    if (!next) return;
    setActiveWeekN(next.weekN);
    setActiveDayKey(next.dayKey);
    scrollTop();
  };
  const handlePrevDay = () => {
    const prev = prevPosition(activeWeekN, activeDayKey);
    if (!prev) return;
    setActiveWeekN(prev.weekN);
    setActiveDayKey(prev.dayKey);
    scrollTop();
  };

  // Default onStartJourney/onBeginToday: jump to week view / day view
  const defaultStartJourney = () => enterWeek(1);
  const defaultBeginToday = () => {
    const w = findWeek(activeWeekN);
    const noProgress = Object.keys(progress).length === 0;
    if (w?.prologue && noProgress) {
      setActiveDayKey('prologue');
    }
    setView('day');
    scrollTop();
  };

  // ---- Render switch ------------------------------------------------------
  const activeWeek = findWeek(activeWeekN);
  const hasNext = !!nextPosition(activeWeekN, activeDayKey);
  const hasPrev = !!prevPosition(activeWeekN, activeDayKey);

  if (view === 'sending') {
    if (!currentUser) {
      return <CourseDayGate onOpenSignup={onOpenSignup} onBackToOverview={goToOverview} />;
    }
    return <SendingDay onBack={goToOverview} onShare={onShare} />;
  }

  if (view === 'day') {
    if (!currentUser && !isDayFree(activeWeekN, activeDayKey)) {
      return <CourseDayGate onOpenSignup={onOpenSignup} onBackToOverview={goToOverview} />;
    }
    const isCompleted = activeDayKey === 'prologue'
      ? !!progress[`w${activeWeekN}-prologue`]
      : !!progress[`w${activeWeekN}-d${activeDayKey}`];
    return (
      <DayReading
        weekData={activeWeek}
        dayKey={activeDayKey}
        onBack={backToWeek}
        onNextDay={handleNextDay}
        onPrevDay={handlePrevDay}
        onToggleComplete={() => onMarkComplete(activeWeekN, activeDayKey)}
        isCompleted={isCompleted}
        hasNext={hasNext}
        hasPrev={hasPrev}
        nextLabel={nextLabel(activeWeekN, activeDayKey)}
        prevLabel={prevLabel(activeWeekN, activeDayKey)}
      />
    );
  }

  if (view === 'week') {
    return (
      <WeekDetail
        weekData={activeWeek}
        onBack={goToOverview}
        onEnterWeek={enterWeek}
        onOpenDay={openDay}
        onToSending={toSending}
        isDayComplete={(k) => {
          if (k === 'prologue') return !!progress[`w${activeWeekN}-prologue`];
          return !!progress[`w${activeWeekN}-d${k}`];
        }}
      />
    );
  }

  // Default: overview
  return (
    <>
      <CourseHero
        onStartJourney={onStartJourney || defaultStartJourney}
        onBeginToday={onBeginToday || defaultBeginToday}
        currentUser={currentUser}
        currentPosition={currentPosition}
        progress={progress}
      />
      <CourseJourney
        onEnterWeek={enterWeek}
        progress={progress}
        currentWeekN={currentPosition?.weekN || null}
      />
    </>
  );
}
