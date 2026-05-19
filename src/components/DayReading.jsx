/* =============================================================================
   src/components/DayReading.jsx — A single day's reading, rendered editorial.

   Sections, top to bottom:
     1. Header — back button, progress label, title, italic note
     2. Body content — block renderer (p / h / q / pullquote, same shape
        as PracticeGuide), with .dropcap on first paragraph
     3. Sabbath fallback — "Today is Sabbath" copy if it's day 7 of the week
     4. Reading-in-preparation fallback — if body is missing or empty
     5. Reflection / Prayer — optional grey card with day.reflection / day.prayer
     6. Mark-complete + nav footer

   Handles both numbered days and the week's Prologue. Progress marking is
   optimistic — the caller should update isCompleted state synchronously.

   Migrated from the_kingdom.jsx line ~8029. Tailwind classes converted to
   inline styles. dangerouslySetInnerHTML is intentional for body content
   (same pattern as PracticeGuide).

   Props:
     weekData          — a single week object from SEVEN_WEEKS
     dayKey            — "prologue" or 1..7
     onBack()          — invoked by header back button + footer "All days" link
     onNextDay()       — invoked by next button
     onPrevDay()       — invoked by prev button
     onToggleComplete()— invoked by mark-complete button
     isCompleted       — bool — whether this day has been marked complete
     hasNext           — bool
     hasPrev           — bool
     nextLabel         — optional string for next button
     prevLabel         — optional string for prev button
   ============================================================================= */

import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function DayReading({
  weekData,
  dayKey,
  onBack,
  onNextDay,
  onPrevDay,
  onToggleComplete,
  isCompleted,
  hasNext,
  hasPrev,
  nextLabel,
  prevLabel,
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [weekData, dayKey]);

  if (!weekData) return null;
  const w = weekData;
  const isPrologue = dayKey === 'prologue';
  const day = isPrologue ? w.prologue : w.days.find((d) => d.n === dayKey);
  if (!day) return null;

  const globalDay = isPrologue ? null : (w.n - 1) * 7 + day.n;
  const body = day.body || null;
  const isSabbath = !isPrologue && day.sabbath;

  return (
    <div className="view-enter">
      {/* Header */}
      <section
        className="paper-bg"
        style={{
          position: 'relative',
          paddingTop: 'clamp(6rem, 12vw, 9rem)',
          paddingBottom: '2rem',
        }}
      >
        <div
          style={{
            maxWidth: '45rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <button
            onClick={onBack}
            className="sc"
            style={{
              fontSize: 10,
              marginBottom: 'clamp(2rem, 4vw, 2.5rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: 44,
              marginLeft: '-0.5rem',
              padding: '0.75rem 0.5rem',
              color: 'var(--mute)',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <ArrowLeft size={12} /> Step {w.n} — {w.humanTitle}
          </button>

          {/* Progress label */}
          <div
            className="sc"
            style={{
              fontSize: 10,
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              columnGap: '0.5rem',
              rowGap: '0.25rem',
              color: 'var(--gold-3)',
            }}
          >
            <span>Step {w.n}</span>
            <span style={{ color: 'var(--mute)' }}>·</span>
            <span>{w.verb}</span>
            <span style={{ color: 'var(--mute)' }}>·</span>
            {isPrologue ? (
              <span style={{ color: 'var(--wine)' }}>Prologue</span>
            ) : (
              <>
                <span>Day {day.n} of 7</span>
                <span style={{ color: 'var(--mute)' }}>·</span>
                <span>Day {globalDay} of 49</span>
              </>
            )}
          </div>

          <h1
            className="display-strong"
            style={{
              fontSize: 'clamp(2.3rem, 6.2vw, 4.2rem)',
              lineHeight: 1.02,
              marginBottom: '1rem',
              fontWeight: 600,
            }}
          >
            {day.title}
          </h1>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.15rem, 2vw, 1.28rem)',
              lineHeight: 1.5,
              marginBottom: '1rem',
              color: 'var(--wine)',
              fontWeight: 500,
            }}
          >
            {day.note}
          </p>
        </div>
      </section>

      {/* Body content */}
      <section className="paper-bg" style={{ paddingBottom: 'clamp(4rem, 6vw, 5rem)' }}>
        <div
          style={{
            maxWidth: '45rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {body ? (
            <article style={{ paddingTop: '2rem' }}>
              {body.map((block, i) => {
                if (block.t === 'p') {
                  return (
                    <p
                      key={i}
                      className={'body ' + (i === 0 ? 'dropcap' : '')}
                      style={{
                        fontSize: 'clamp(1.18rem, 1.8vw, 1.22rem)',
                        lineHeight: 1.72,
                        marginBottom: '1.25rem',
                        color: 'var(--ink-2)',
                      }}
                      dangerouslySetInnerHTML={{ __html: block.d }}
                    />
                  );
                }
                if (block.t === 'h') {
                  return (
                    <div key={i} style={{ margin: '3rem 0' }}>
                      <h3
                        className="display-strong"
                        style={{
                          fontSize: 'clamp(1.6rem, 2.6vw, 1.95rem)',
                          lineHeight: 1.15,
                          color: 'var(--ink)',
                        }}
                      >
                        {block.d}
                      </h3>
                      <div
                        style={{
                          height: 1,
                          marginTop: '0.75rem',
                          maxWidth: '6rem',
                          background: 'var(--gold)',
                        }}
                      />
                    </div>
                  );
                }
                if (block.t === 'q') {
                  return (
                    <blockquote
                      key={i}
                      className="scripture display"
                      style={{
                        fontSize: 'clamp(1.4rem, 2.2vw, 1.65rem)',
                        lineHeight: 1.3,
                        margin: '2.5rem 0',
                        padding: '0.5rem 0',
                        fontWeight: 500,
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: block.d }} />
                      {block.c && (
                        <span
                          className="sc"
                          style={{
                            display: 'block',
                            fontStyle: 'normal',
                            fontSize: 10,
                            marginTop: '0.75rem',
                            color: 'var(--gold-3)',
                            fontWeight: 600,
                          }}
                        >
                          {block.c}
                        </span>
                      )}
                    </blockquote>
                  );
                }
                if (block.t === 'pullquote') {
                  return (
                    <p
                      key={i}
                      className="display-strong"
                      style={{
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.7rem, 2.8vw, 2rem)',
                        lineHeight: 1.3,
                        margin: '3rem 0',
                        textAlign: 'center',
                        color: 'var(--wine)',
                        fontWeight: 500,
                      }}
                    >
                      {block.d}
                    </p>
                  );
                }
                return null;
              })}
            </article>
          ) : (
            <div style={{ paddingTop: '4rem', paddingBottom: '2rem', textAlign: 'center' }}>
              <div
                className="ornament"
                style={{ marginBottom: '2rem', maxWidth: '14rem', margin: '0 auto 2rem' }}
              >
                <span className="sc">Reading in preparation</span>
              </div>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '1.15rem',
                  lineHeight: 1.7,
                  marginBottom: '1rem',
                  color: 'var(--ink-2)',
                }}
              >
                The full text for this day is being finalized.
              </p>
              <p
                className="body"
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  maxWidth: '28rem',
                  margin: '0 auto',
                  color: 'var(--mute)',
                }}
              >
                For now, sit with the day's note above. Pray a decade of the rosary over its theme.
                The reading will be here when you next visit.
              </p>
            </div>
          )}

          {/* Sabbath handling — show only if explicitly sabbath AND no body */}
          {isSabbath && !body && (
            <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <p
                className="body"
                style={{
                  fontSize: '1.18rem',
                  lineHeight: 1.72,
                  textAlign: 'center',
                  color: 'var(--ink-2)',
                }}
              >
                Today is Sabbath. Rest. Review what you have read. If you are walking with a Kingdom
                Group, meet today.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Reflection & Prayer */}
      {(day.reflection || day.prayer) && (
        <section
          style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', background: 'var(--paper-2)' }}
        >
          <div
            style={{
              maxWidth: '45rem',
              margin: '0 auto',
              padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5rem',
            }}
          >
            {day.reflection && (
              <div>
                <h3
                  className="display-strong"
                  style={{
                    fontSize: 'clamp(1.4rem, 2vw, 1.65rem)',
                    marginBottom: '1.25rem',
                    color: 'var(--ink)',
                  }}
                >
                  Reflect
                </h3>
                <p
                  className="body"
                  style={{
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.2rem)',
                    lineHeight: 1.72,
                    color: 'var(--ink-2)',
                  }}
                >
                  {day.reflection}
                </p>
              </div>
            )}
            {day.prayer && (
              <div>
                <h3
                  className="display-strong"
                  style={{
                    fontSize: 'clamp(1.4rem, 2vw, 1.65rem)',
                    marginBottom: '1.25rem',
                    color: 'var(--ink)',
                  }}
                >
                  Pray
                </h3>
                <p
                  className="body"
                  style={{
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.2rem)',
                    lineHeight: 1.72,
                    color: 'var(--ink-2)',
                    fontWeight: 500,
                  }}
                >
                  {day.prayer}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* AI disclosure footer — per FINAL_CONTENT_REVISION_PLAN §4.3 and
          STRATEGIC_ARCHITECTURE Appendix E. Sits below the day's content
          (after Reflection/Prayer) so the disclosure travels WITH the
          reading rather than with the navigation chrome below. */}
      <section className="paper-bg">
        <div
          style={{
            maxWidth: '45rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--mute)',
              borderTop: '1px solid var(--line)',
              paddingTop: '1.5rem',
              marginTop: '3rem',
              marginBottom: 0,
            }}
          >
            This content was prepared with AI assistance, grounded in the
            Catechism and Sacred Tradition. AI can make mistakes. Verify what
            matters; consult your priest; read the cited sources.{' '}
            <a
              href="/methodology"
              style={{
                color: 'var(--gold-3)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--gold-3)',
              }}
            >
              How this is made
            </a>
          </p>
        </div>
      </section>

      {/* Mark complete + navigation */}
      <section
        className="paper-bg"
        style={{
          paddingTop: '3rem',
          paddingBottom: '4rem',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            maxWidth: '45rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <button
              onClick={onToggleComplete}
              className="sc"
              style={{
                fontSize: 11,
                padding: '0.75rem 1.25rem',
                minHeight: 44,
                border: '1px solid',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: isCompleted ? 'var(--gold)' : 'transparent',
                color: isCompleted ? 'var(--ink)' : 'var(--gold-3)',
                borderColor: 'var(--gold-3)',
                transition: 'all 0.3s ease',
              }}
              aria-pressed={isCompleted}
            >
              {isCompleted ? (
                <>
                  <Check size={14} /> Marked complete
                </>
              ) : (
                <>Mark as read</>
              )}
            </button>
            <button
              onClick={onBack}
              className="sc"
              style={{
                fontSize: 11,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--mute)',
                background: 'transparent',
                border: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              All days in this step
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--line)',
            }}
          >
            <button
              onClick={onPrevDay}
              disabled={!hasPrev}
              className="btn-ghost sc"
              style={{
                fontSize: 10,
                padding: '0.75rem 1.25rem',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: hasPrev ? 1 : 0.35,
                cursor: hasPrev ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              <ArrowLeft size={12} /> {prevLabel || 'Previous'}
            </button>
            <button
              onClick={onNextDay}
              disabled={!hasNext}
              className="btn-gold sc"
              style={{
                fontSize: 10,
                padding: '0.75rem 1.25rem',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: hasNext ? 1 : 0.35,
                cursor: hasNext ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              {nextLabel || 'Next'} <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
