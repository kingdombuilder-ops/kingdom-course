/* =============================================================================
   src/components/CourseHero.jsx — The Course tab's landing hero.

   Two modes based on `currentUser`:

     LOGGED OUT — show the framing copy, headline, and "Begin the Course"
                  CTA. Includes a "See the path" anchor link to the journey
                  section below.

     LOGGED IN  — show personalized "Hello, {name}." headline and a
                  "Today's Mission" card showing the user's current week,
                  step verb, day, human title, bullet, and a CTA that
                  either reads "Read the prologue" (first time) or
                  "Continue today's reading". Plus a progress bar showing
                  days completed / 50.

   Migrated from the_kingdom.jsx line ~6668. Tailwind classes converted
   to inline styles.

   Props:
     onStartJourney() — invoked by "Begin the Course" CTA (logged out)
     onBeginToday()   — invoked by today's-mission CTA (logged in)
     currentUser      — { name?, ... } or null
     currentPosition  — { weekN, dayKey } | null. Defaults to week 1, day 1.
                        dayKey can be "prologue" or 1..7.
     progress         — { "w{week}-d{day}": true } map of completed days
   ============================================================================= */

import { ArrowRight, ChevronDown } from 'lucide-react';
import { SEVEN_WEEKS, STEP_COLORS } from '@data';
import StepRibbon from './StepRibbon.jsx';

export default function CourseHero({
  onStartJourney,
  onBeginToday,
  currentUser,
  currentPosition,
  progress = {},
}) {
  let daysCompleted = 0;
  for (let w = 1; w <= 7; w++) {
    for (let d = 1; d <= 7; d++) {
      if (progress[`w${w}-d${d}`]) daysCompleted++;
    }
  }
  const progressPct = (daysCompleted / 50) * 100;

  const pos = currentPosition || { weekN: 1, dayKey: 1 };
  const currentStep = SEVEN_WEEKS.find((w) => w.n === pos.weekN) || SEVEN_WEEKS[0];

  const globalDay =
    pos.dayKey === 'prologue' ? null : (pos.weekN - 1) * 7 + pos.dayKey;

  return (
    <section
      className="paper-bg"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '85svh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '5rem',
      }}
    >
      {/* Decorative left vertical journey line */}
      <svg
        aria-hidden
        width="240"
        height="700"
        viewBox="0 0 240 700"
        style={{
          position: 'absolute',
          left: '-5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.07,
        }}
      >
        <line
          x1="120"
          y1="40"
          x2="120"
          y2="660"
          stroke="var(--gold)"
          strokeWidth="0.6"
          strokeDasharray="2 6"
        />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle
            key={i}
            cx="120"
            cy={60 + i * 95}
            r={6 + i * 1.2}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="0.7"
          />
        ))}
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '48rem',
          margin: '0 auto',
          padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 3vw, 2.5rem)',
          width: '100%',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
          <div className="ornament rise d-1" style={{ maxWidth: '18rem' }}>
            <span className="sc-bold" style={{ fontSize: 11 }}>
              {currentUser ? 'Welcome Back' : 'The Course'}
            </span>
          </div>
        </div>

        {/* Brand block */}
        <div className="rise d-1" style={{ marginBottom: 'clamp(2.5rem, 4vw, 3rem)' }}>
          <div
            className="display-strong"
            style={{
              fontSize: 'clamp(2.4rem, 5.6vw, 3.8rem)',
              lineHeight: 1.0,
              fontWeight: 600,
            }}
          >
            The Kingdom Course
          </div>
          <div
            className="display"
            style={{
              fontStyle: 'italic',
              lineHeight: 1.2,
              marginTop: '0.5rem',
              fontSize: 'clamp(1.3rem, 3vw, 1.85rem)',
              color: 'var(--gold-3)',
            }}
          >
            Seven Steps to the Kingdom of Heaven
          </div>
          <div style={{ height: 1, marginTop: '1.25rem', maxWidth: '5rem', background: 'var(--gold)' }} />
          <div
            className="sc-bold"
            style={{ fontSize: 10, marginTop: '1.25rem', color: 'var(--gold-3)' }}
          >
            Seven Weeks · Fifty Days · The Walk to Pentecost
          </div>
        </div>

        <StepRibbon progress={progress} currentWeekN={currentStep.n} />

        {currentUser ? (
          <>
            <h1
              className="display-strong rise d-3"
              style={{
                fontSize: 'clamp(2rem, 5.6vw, 3.6rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.01em',
                marginTop: 'clamp(3rem, 5vw, 3.5rem)',
                fontWeight: 600,
              }}
            >
              {currentUser.name ? (
                <>
                  Hello, <span style={{ fontStyle: 'italic', color: 'var(--gold-3)' }}>{currentUser.name}.</span>
                </>
              ) : (
                <>The path is ready.</>
              )}
            </h1>

            {/* Today's Mission card */}
            <div className="rise d-4" style={{ marginTop: '2.5rem' }}>
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid var(--gold)',
                  background: 'rgba(215,177,105,0.06)',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: STEP_COLORS[currentStep.n],
                  }}
                />
                <div
                  className="sc-bold"
                  style={{
                    fontSize: 10,
                    marginBottom: '1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    columnGap: '0.5rem',
                    rowGap: '0.25rem',
                    color: 'var(--gold-3)',
                  }}
                >
                  <span>{daysCompleted === 0 ? 'Begin Here' : "Today's Mission"}</span>
                  <span style={{ color: 'var(--mute)' }}>·</span>
                  <span>
                    Step {currentStep.n} · {currentStep.verb} · Day{' '}
                    {pos.dayKey === 'prologue' ? 'P' : pos.dayKey} of 7
                  </span>
                </div>

                <h3
                  className="display-strong"
                  style={{
                    fontSize: 'clamp(1.85rem, 3vw, 2.1rem)',
                    lineHeight: 1.15,
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  {currentStep.humanTitle}
                </h3>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.02rem, 1.7vw, 1.1rem)',
                    lineHeight: 1.55,
                    marginBottom: '1.5rem',
                    color: 'var(--ink-2)',
                    fontWeight: 500,
                  }}
                >
                  {currentStep.bullet}
                </p>

                <button
                  onClick={onBeginToday}
                  className="btn-gold sc"
                  style={{
                    fontSize: 11,
                    padding: '0.75rem 1.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    minHeight: 44,
                    fontFamily: 'inherit',
                  }}
                >
                  {daysCompleted === 0 ? 'Read the prologue' : "Continue today's reading"}{' '}
                  <ArrowRight size={13} />
                </button>

                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <div style={{ height: 6, overflow: 'hidden', background: 'var(--paper-2)' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${progressPct}%`,
                        background: 'linear-gradient(to right, var(--wine), var(--gold))',
                        transition: 'width 0.7s ease',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span className="sc" style={{ fontSize: 9, color: 'var(--mute)' }}>
                      {globalDay && `Day ${globalDay}`}
                      {globalDay && ' · '}On the road to Pentecost
                    </span>
                    <span className="sc" style={{ fontSize: 9, color: 'var(--mute)' }}>
                      {daysCompleted}/50
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1
              className="display-strong rise d-3"
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                lineHeight: 1.0,
                letterSpacing: '-0.01em',
                marginTop: '3.5rem',
                fontWeight: 600,
              }}
            >
              The path the saints walked.
              <span style={{ display: 'block', fontStyle: 'italic', marginTop: '0.5rem', color: 'var(--gold-3)' }}>
                Made walkable.
              </span>
            </h1>

            <p
              className="body-lede rise d-4"
              style={{
                fontSize: 'clamp(1.18rem, 2vw, 1.28rem)',
                lineHeight: 1.6,
                marginTop: '2rem',
                maxWidth: '42rem',
                color: 'var(--ink-2)',
              }}
            >
              Two thousand years of Catholic formation, distilled to seven steps,
              one each week. One short reading each day. Fifty days from where you
              are to where the Spirit makes you new.
            </p>

            <p
              className="display-strong rise d-4"
              style={{
                fontStyle: 'italic',
                fontSize: 'clamp(1.4rem, 2.4vw, 1.65rem)',
                lineHeight: 1.4,
                marginTop: '2rem',
                maxWidth: '36rem',
                color: 'var(--wine)',
                fontWeight: 500,
              }}
            >
              What the saints had. Made accessible to every soul.
            </p>

            <div
              className="rise d-5"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1rem',
                marginTop: '3rem',
              }}
            >
              <button
                onClick={onStartJourney}
                className="btn-gold sc-bold pulse-gold"
                style={{
                  fontSize: 11,
                  padding: '1rem 1.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'inherit',
                }}
              >
                Begin the Course <ArrowRight size={14} />
              </button>
              <a
                href="#weeks"
                className="sc"
                style={{
                  fontSize: 11,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minHeight: 44,
                  padding: '0.75rem 0.5rem',
                  color: 'var(--ink-2)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                See the path <ChevronDown size={13} />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
