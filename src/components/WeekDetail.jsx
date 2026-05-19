/* =============================================================================
   src/components/WeekDetail.jsx — A single week's overview page.

   Sections, top to bottom:
     1. Header — back button, step indicator, title, subtitle, human title, question
     2. Essence — long lead paragraph (with .dropcap on first line)
     3. House + Patron strip — two-column grid
     4. The Days — Prologue button (if present) + 7 day buttons
     5. The Practice — three-row grid: prayer depth, daily rule, deployment
     6. Scripture — block quote
     7. Footer nav — prev/next step button (or "Day 50 — the Sending" if last week)

   Migrated from the_kingdom.jsx line ~7773. Tailwind classes converted to
   inline styles per project convention. Custom CSS classes (paper-bg,
   ornament, dropcap, scripture, day-card, sabbath-card, completed-card,
   btn-gold, btn-ghost) are preserved.

   Props:
     weekData          — a single week object from SEVEN_WEEKS
     onBack()          — invoked by the top "All seven steps" button
     onEnterWeek(n)    — invoked by prev/next step buttons in the footer
     onOpenDay(dayKey) — invoked by Prologue button (with "prologue") or
                         a day button (with the day's n: 1..7)
     onToSending()     — invoked when week 7's "Day 50 — the Sending" CTA fires
     isDayComplete(dayKey) — predicate that takes "prologue" or 1..7
   ============================================================================= */

import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Moon, Quote, Sparkles } from 'lucide-react';
import { SEVEN_WEEKS, STEP_COLORS } from '@data';
import { toRoman } from '@shared/utils';

export default function WeekDetail({
  weekData,
  onBack,
  onEnterWeek,
  onOpenDay,
  onToSending,
  isDayComplete = () => false,
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [weekData]);

  if (!weekData) return null;
  const w = weekData;

  const hasNext = w.n < 7;
  const hasPrev = w.n > 1;
  const isLast = w.n === 7;
  const firstDayIndex = (w.n - 1) * 7;

  return (
    <div className="view-enter">
      {/* Header */}
      <section
        className="paper-bg"
        style={{
          position: 'relative',
          paddingTop: 'clamp(5rem, 10vw, 7rem)',
          paddingBottom: '3rem',
        }}
      >
        <div
          style={{
            maxWidth: '56rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <button
            onClick={onBack}
            className="sc"
            style={{
              fontSize: 10,
              marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
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
            <ArrowLeft size={12} /> All seven steps
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid',
                background: STEP_COLORS[w.n],
                borderColor: STEP_COLORS[w.n],
                boxShadow: `0 0 24px ${STEP_COLORS[w.n]}50`,
                flexShrink: 0,
              }}
            >
              <span
                className="display"
                style={{ fontSize: '1.5rem', fontWeight: 300, color: '#F6EFDE' }}
              >
                {toRoman(w.n)}
              </span>
            </div>
            <div>
              <div className="sc" style={{ fontSize: 11, marginBottom: '0.25rem', color: 'var(--gold-3)' }}>
                Step {w.n} · {w.verb} · Days {firstDayIndex + 1}–{firstDayIndex + 7}
              </div>
              <div
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.95rem',
                  color: 'var(--mute)',
                }}
              >
                {w.stage} Way · {w.stageNote}
              </div>
            </div>
          </div>

          <h1
            className="display-strong"
            style={{
              fontSize: 'clamp(2rem, 5.4vw, 3.8rem)',
              lineHeight: 1.0,
              marginBottom: '0.75rem',
              fontWeight: 600,
            }}
          >
            {w.title}
          </h1>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
              marginBottom: '2rem',
              color: 'var(--wine)',
              fontWeight: 500,
            }}
          >
            {w.subtitle}
          </p>

          <p
            className="display-strong"
            style={{
              fontSize: 'clamp(1.3rem, 2.4vw, 1.55rem)',
              lineHeight: 1.4,
              marginBottom: '0.5rem',
              fontWeight: 500,
            }}
          >
            {w.humanTitle}
          </p>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: 'var(--mute)',
            }}
          >
            {w.question}
          </p>
        </div>
      </section>

      {/* Essence */}
      <section
        className="paper-bg"
        style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
      >
        <div
          style={{
            maxWidth: '36rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <p
            className="body-lede dropcap"
            style={{
              fontSize: 'clamp(1.22rem, 2vw, 1.3rem)',
              lineHeight: 1.7,
              color: 'var(--ink-2)',
            }}
          >
            {w.essence}
          </p>
        </div>
      </section>

      {/* House + Patron strip */}
      <section className="paper-bg" style={{ paddingBottom: '3rem' }}>
        <div
          style={{
            maxWidth: '36rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
              gap: '1.5rem',
              borderTop: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
              padding: '1.5rem 0',
            }}
          >
            <div>
              <div className="sc" style={{ fontSize: 9, marginBottom: '0.5rem', color: 'var(--mute)' }}>
                House
              </div>
              <div className="body" style={{ fontSize: '1.05rem' }}>{w.house}</div>
            </div>
            {w.patron && (
              <div>
                <div className="sc" style={{ fontSize: 9, marginBottom: '0.5rem', color: 'var(--mute)' }}>
                  Patron
                </div>
                <div className="body" style={{ fontSize: '1.05rem', fontStyle: 'italic' }}>
                  {w.patron}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The Days — Prologue + 7 days */}
      <section className="paper-bg" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div
          style={{
            maxWidth: '56rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {/* Prologue (if present) */}
          {w.prologue && (
            <button
              onClick={() => onOpenDay && onOpenDay('prologue')}
              style={{
                marginBottom: '2.5rem',
                paddingBottom: '2.5rem',
                paddingTop: '1rem',
                margin: '-1rem -1rem 2.5rem -1rem',
                padding: '1rem 1rem 2.5rem 1rem',
                borderBottom: '1px solid var(--line)',
                width: 'calc(100% + 2rem)',
                textAlign: 'left',
                display: 'block',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                color: 'var(--ink)',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--paper-2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div className="ornament" style={{ marginBottom: '1.5rem', maxWidth: '10rem' }}>
                <span className="sc" style={{ color: 'var(--wine)' }}>Prologue</span>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, paddingTop: '0.25rem' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid',
                      borderRadius: '50%',
                      borderColor: 'var(--wine)',
                      color: isDayComplete('prologue') ? 'var(--paper)' : 'var(--wine)',
                      background: isDayComplete('prologue') ? 'var(--wine)' : 'rgba(107,30,30,0.04)',
                    }}
                  >
                    {isDayComplete('prologue') ? (
                      <Check size={14} />
                    ) : (
                      <span
                        className="display"
                        style={{ fontStyle: 'italic', fontSize: '0.95rem' }}
                      >
                        P
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      className="display"
                      style={{
                        fontSize: 'clamp(1.35rem, 2.4vw, 1.5rem)',
                        lineHeight: 1.15,
                        marginBottom: '0.5rem',
                        color: 'var(--ink)',
                      }}
                    >
                      {w.prologue.title}
                    </div>
                    <ArrowRight
                      size={14}
                      style={{
                        marginTop: '0.5rem',
                        opacity: 0.4,
                        color: 'var(--gold-3)',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  <p
                    className="body"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.05rem)',
                      lineHeight: 1.6,
                      marginBottom: '0.75rem',
                      color: 'var(--ink-2)',
                    }}
                  >
                    {w.prologue.note}
                  </p>
                  <p
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.88rem',
                      color: 'var(--mute)',
                    }}
                  >
                    Read as orientation. Not a counted day.
                  </p>
                </div>
              </div>
            </button>
          )}

          <div className="ornament" style={{ marginBottom: '2.5rem', maxWidth: '14rem' }}>
            <span className="sc">The Seven Days</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {w.days.map((d) => {
              const globalDay = firstDayIndex + d.n;
              const isSabbath = d.sabbath;
              const completed = isDayComplete(d.n);
              return (
                <button
                  key={d.n}
                  onClick={() => onOpenDay && onOpenDay(d.n)}
                  className={'day-card' + (isSabbath ? ' sabbath-card' : '')}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'clamp(1rem, 1.5vw, 1.25rem)',
                    padding: 'clamp(1rem, 1.5vw, 1.25rem)',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    color: 'var(--ink)',
                    ...(completed
                      ? { borderColor: 'var(--gold-3)', background: 'rgba(215, 177, 105, 0.06)' }
                      : {}),
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 48,
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    <div className="sc" style={{ fontSize: 9, marginBottom: '0.25rem', color: 'var(--mute)' }}>
                      Day
                    </div>
                    <div
                      className="display"
                      style={{
                        fontSize: 'clamp(1.3rem, 2vw, 1.45rem)',
                        fontWeight: 300,
                        lineHeight: 1,
                        color: isSabbath ? 'var(--gold-3)' : 'var(--ink)',
                      }}
                    >
                      {globalDay}
                    </div>
                    {completed && (
                      <div
                        style={{
                          position: 'absolute',
                          right: -4,
                          top: -4,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--gold)',
                          color: 'var(--ink)',
                        }}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {isSabbath && <Moon size={13} style={{ color: 'var(--gold-3)' }} />}
                        <div
                          className="display"
                          style={{
                            fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
                            fontWeight: 300,
                            lineHeight: 1.4,
                          }}
                        >
                          {d.title}
                        </div>
                      </div>
                      <ArrowRight
                        size={14}
                        style={{
                          marginTop: '0.25rem',
                          opacity: 0.4,
                          color: 'var(--gold-3)',
                          flexShrink: 0,
                        }}
                      />
                    </div>
                    <p
                      className="body"
                      style={{
                        fontStyle: 'italic',
                        fontSize: 'clamp(0.9rem, 1.5vw, 0.95rem)',
                        lineHeight: 1.55,
                        color: 'var(--mute)',
                      }}
                    >
                      {d.note}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Practice */}
      {(w.prayerDepth || w.practice || w.deployment) && (
        <section
          style={{ paddingTop: '4rem', paddingBottom: '4rem', background: 'var(--paper-2)' }}
        >
          <div
            style={{
              maxWidth: '36rem',
              margin: '0 auto',
              padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            <div className="ornament" style={{ marginBottom: '2.5rem', maxWidth: '18rem' }}>
              <span className="sc">The Practice</span>
            </div>
            {w.prayerDepth && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 140px) 1fr',
                  gap: '1.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                <div className="sc" style={{ fontSize: 10, paddingTop: '0.25rem', color: 'var(--gold-3)' }}>
                  Prayer depth
                </div>
                <div
                  className="body"
                  style={{ fontSize: '1.08rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
                >
                  {w.prayerDepth}
                </div>
              </div>
            )}
            {w.practice && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 140px) 1fr',
                  gap: '1.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                <div className="sc" style={{ fontSize: 10, paddingTop: '0.25rem', color: 'var(--gold-3)' }}>
                  Daily rule
                </div>
                <div
                  className="body"
                  style={{ fontSize: '1.08rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
                >
                  {w.practice}
                </div>
              </div>
            )}
            {w.deployment && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 140px) 1fr',
                  gap: '1.5rem',
                }}
              >
                <div className="sc" style={{ fontSize: 10, paddingTop: '0.25rem', color: 'var(--gold-3)' }}>
                  Deployment
                </div>
                <div
                  className="body"
                  style={{ fontSize: '1.08rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
                >
                  {w.deployment}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Scripture */}
      {w.scripture && (
        <section className="paper-bg" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div
            style={{
              maxWidth: '36rem',
              margin: '0 auto',
              padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            <div
              style={{
                paddingTop: '2rem',
                paddingBottom: '2rem',
                borderTop: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <Quote size={18} style={{ color: 'var(--gold-3)' }} />
              <p
                className="scripture display"
                style={{
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.5rem)',
                  marginTop: '0.75rem',
                  lineHeight: 1.4,
                }}
              >
                {w.scripture}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer nav */}
      <section
        className="paper-bg"
        style={{ paddingTop: '3rem', paddingBottom: 'clamp(6rem, 10vw, 8rem)' }}
      >
        <div
          style={{
            maxWidth: '36rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {isLast ? (
            <div style={{ textAlign: 'center' }}>
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.5rem, 2.6vw, 1.85rem)',
                  lineHeight: 1.4,
                  marginBottom: '1rem',
                  color: 'var(--wine)',
                }}
              >
                Fifty days walked.
              </p>
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.5rem, 2.6vw, 1.85rem)',
                  lineHeight: 1.4,
                  marginBottom: '2.5rem',
                  color: 'var(--wine)',
                }}
              >
                The fiftieth day waits.
              </p>
              <button
                onClick={onToSending}
                className="btn-gold sc"
                style={{
                  fontSize: 11,
                  padding: '1rem 1.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  margin: '0 auto',
                  fontFamily: 'inherit',
                }}
              >
                <Sparkles size={14} /> Day 50 — the Sending
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1.5rem',
                paddingTop: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: '1rem',
                }}
              >
                <button
                  onClick={() => hasPrev && onEnterWeek && onEnterWeek(w.n - 1)}
                  disabled={!hasPrev}
                  className="btn-ghost sc"
                  style={{
                    fontSize: 10,
                    padding: '0.625rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: hasPrev ? 1 : 0.35,
                    cursor: hasPrev ? 'pointer' : 'default',
                    fontFamily: 'inherit',
                  }}
                >
                  <ArrowLeft size={12} /> Step {w.n - 1}
                </button>
                <span className="sc" style={{ fontSize: 10, color: 'var(--mute)' }}>
                  Step {w.n} of 7
                </span>
                <button
                  onClick={() => hasNext && onEnterWeek && onEnterWeek(w.n + 1)}
                  disabled={!hasNext}
                  className="btn-gold sc"
                  style={{
                    fontSize: 10,
                    padding: '0.625rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'inherit',
                  }}
                >
                  Step {w.n + 1} — {SEVEN_WEEKS[w.n]?.humanTitle} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
