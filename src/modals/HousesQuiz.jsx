/* =============================================================================
   src/modals/HousesQuiz.jsx — the discernment modal.

   Three phases inside one full-screen overlay:
     intro     — five-house grid + "Begin the discernment"
     questions — six questions, one at a time, with progress dots
     result    — primary House + secondary + bar chart of all five

   Migrated from the_kingdom.jsx line ~9966. Two corrections applied during
   migration:
     1. The intro's litany line previously read "Light · Fire · Peace · Glory."
        That predates two architectural decisions: Earth becoming a co-equal
        fifth House, and the Franciscan re-label from Peace to Joy. The
        canonical litany per HANDOFF.md and FINAL_CONTENT_REVISION_PLAN §1.11
        is "Light · Fire · Joy · Glory · Earth" — Earth is the fifth House.
     2. The result-card's --house-color, --house-tint, --house-glow CSS
        custom properties are merged into a single `style` object rather than
        spread across both className-binding and style — same effect, simpler
        to read.

   The data-driven shape of the quiz makes this component remarkably small
   for what it does: ~250 lines including the result phase, all driven by
   QUIZ_QUESTIONS and HOUSES_HUB from @data.

   Props:
     onSave(houseKey)  — caller persists the discerned house and closes
     onClose()         — caller closes without saving
   ============================================================================= */

import { useState } from 'react';
import {
  X, Compass, ArrowRight, ArrowLeft, Check, Sparkles, RotateCcw,
} from 'lucide-react';
import { QUIZ_QUESTIONS, HOUSES_HUB } from '@data';

export default function HousesQuiz({ onSave, onClose }) {
  const [phase, setPhase] = useState('intro');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(QUIZ_QUESTIONS.map(() => null));

  const handleSelect = (answerIdx) => {
    const next = [...selected];
    next[qIndex] = answerIdx;
    setSelected(next);
  };

  const handleNext = () => {
    if (qIndex < QUIZ_QUESTIONS.length - 1) setQIndex(qIndex + 1);
    else setPhase('result');
  };

  const handlePrev = () => {
    if (qIndex > 0) setQIndex(qIndex - 1);
    else setPhase('intro');
  };

  const handleRetake = () => {
    setSelected(QUIZ_QUESTIONS.map(() => null));
    setQIndex(0);
    setPhase('questions');
  };

  // Tally the weights from each selected answer across the five Houses.
  // Each answer carries a weight object like { light:3, fire:0, ... }; we
  // sum across all six selections to get a total per House.
  const totals = { light: 0, fire: 0, benedict: 0, peace: 0, glory: 0 };
  selected.forEach((answerIdx, qIdx) => {
    if (answerIdx === null) return;
    const answer = QUIZ_QUESTIONS[qIdx].answers[answerIdx];
    Object.entries(answer.weight).forEach(([house, points]) => {
      totals[house] += points;
    });
  });
  const ranked = Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .map(([key, score]) => ({ key, score, ...HOUSES_HUB[key] }));

  return (
    <div className="paper-bg" style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto' }}>
      <header
        className="paper-bg"
        style={{ position: 'sticky', top: 0, zIndex: 30, borderBottom: '1px solid var(--line)' }}
      >
        <div
          style={{
            maxWidth: '48rem', margin: '0 auto', padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="22" height="22" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--gold)" strokeWidth="1" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="var(--gold)" strokeWidth="1" />
              <circle cx="20" cy="20" r="6"  fill="none" stroke="var(--gold)" strokeWidth="1" />
              <circle cx="20" cy="20" r="2"  fill="var(--wine)" />
            </svg>
            <span className="sc-bold" style={{ fontSize: 10, color: 'var(--ink)' }}>
              The Houses · Discernment
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ padding: '0.5rem', background: 'transparent', border: 0, cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative' }}>
        {phase === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div className="ornament" style={{ marginBottom: '2.5rem', maxWidth: '20rem', marginLeft: 'auto', marginRight: 'auto' }}>
              <span className="sc-bold" style={{ fontSize: 12 }}>The Discernment</span>
            </div>
            <h1
              className="display-strong"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.06, marginBottom: '1.25rem', fontWeight: 600 }}
            >
              Discover your House.
            </h1>
            <div style={{ height: 1, margin: '0 auto 1.5rem', maxWidth: '5rem', background: 'var(--gold)' }} />
            <p
              className="body-lede"
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.2rem)',
                lineHeight: 1.7,
                maxWidth: '42rem',
                margin: '0 auto 1.5rem',
                color: 'var(--ink-2)',
              }}
            >
              Six questions, two minutes. Not a personality test — a discernment.
              Each question surfaces an instinct already in you. By the end, a tradition will come into focus.
            </p>
            {/* Litany of the five Houses — corrected from the source's stale
                four-name string. See file header for context. */}
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.98rem',
                lineHeight: 1.6,
                maxWidth: '32rem',
                margin: '0 auto 2.5rem',
                color: 'var(--mute)',
              }}
            >
              Light · Fire · Joy · Glory · Earth.
              Most souls are formed by two of these — one primary, one secondary.
            </p>

            {/* Five House preview cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(8rem, 1fr))',
                gap: '0.75rem',
                marginBottom: '2.5rem',
                maxWidth: '48rem',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {Object.entries(HOUSES_HUB).map(([key, h]) => {
                const Icon = h.icon;
                return (
                  <div
                    key={key}
                    style={{
                      border: '1px solid var(--line)',
                      padding: '0.75rem',
                      textAlign: 'center',
                      background: h.tint,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                      <div
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: h.tint, border: `1px solid ${h.color}`,
                        }}
                      >
                        <Icon size={14} style={{ color: h.color }} />
                      </div>
                    </div>
                    <div className="display" style={{ fontSize: '0.95rem', color: h.color }}>
                      {h.name}
                    </div>
                    <div
                      className="body"
                      style={{ fontStyle: 'italic', fontSize: '0.72rem', marginTop: '0.125rem', color: 'var(--mute)' }}
                    >
                      {h.charism}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setPhase('questions')}
              className="btn-gold sc-bold"
              style={{
                fontSize: 11, padding: '1rem 1.75rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                margin: '0 auto', minHeight: 48,
              }}
            >
              <Compass size={14} /> Begin the discernment <ArrowRight size={13} />
            </button>
            <p
              className="body"
              style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '0.75rem', color: 'var(--mute)' }}
            >
              The Spirit is patient. So are these questions.
            </p>
          </div>
        )}

        {phase === 'questions' && (() => {
          const q = QUIZ_QUESTIONS[qIndex];
          const isFirst = qIndex === 0;
          const isLast = qIndex === QUIZ_QUESTIONS.length - 1;
          const hasSelected = selected[qIndex] !== null;
          return (
            <div className="fade-in">
              <div style={{ marginBottom: '0.5rem' }}>
                <span className="sc-bold" style={{ fontSize: 10, color: 'var(--gold-3)' }}>
                  Question {q.n} of {QUIZ_QUESTIONS.length}
                </span>
              </div>
              <h2
                className="display-strong"
                style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', lineHeight: 1.1, marginBottom: '0.75rem', fontWeight: 600 }}
              >
                {q.prompt}
              </h2>
              <p
                className="body"
                style={{ fontStyle: 'italic', fontSize: 'clamp(1rem, 1.8vw, 1.05rem)', color: 'var(--mute)' }}
              >
                {q.sub}
              </p>
              <div style={{ height: 1, margin: '1.5rem 0 2rem', maxWidth: '4rem', background: 'var(--gold)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.answers.map((a, i) => {
                  const isSelected = selected[qIndex] === i;
                  const house = HOUSES_HUB[a.house];
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={'answer-card ' + (isSelected ? 'selected' : '')}
                      style={{ '--house-color': house.color, '--house-tint': house.tint }}
                    >
                      <div className="answer-check">
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          className="display-strong"
                          style={{
                            fontSize: 'clamp(1.15rem, 2vw, 1.22rem)',
                            lineHeight: 1.3,
                            marginBottom: '0.25rem',
                            fontWeight: 600,
                          }}
                        >
                          {a.text}
                        </div>
                        <p
                          className="body"
                          style={{
                            fontStyle: 'italic',
                            fontSize: 'clamp(0.9rem, 1.5vw, 0.95rem)',
                            lineHeight: 1.5,
                            color: 'var(--mute)',
                          }}
                        >
                          {a.body}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: '2.5rem', paddingTop: '1.5rem',
                  borderTop: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '1rem', flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={handlePrev}
                  disabled={isFirst}
                  className="btn-ghost sc"
                  style={{
                    fontSize: 10, padding: '0.75rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    minHeight: 44,
                    opacity: isFirst ? 0.3 : 1,
                    cursor: isFirst ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ArrowLeft size={12} /> Back
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={
                        'progress-dot ' +
                        (i < qIndex ? 'active' : i === qIndex ? 'current' : '')
                      }
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  disabled={!hasSelected}
                  className="btn-gold sc-bold"
                  style={{
                    fontSize: 10, padding: '0.75rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    minHeight: 44,
                  }}
                >
                  {isLast ? 'See your House' : 'Next'} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })()}

        {phase === 'result' && (() => {
          const primary = ranked[0];
          const secondary = ranked[1];
          const PrimaryIcon = primary.icon;
          const SecondaryIcon = secondary.icon;
          const totalScore = ranked.reduce((sum, h) => sum + h.score, 0);
          return (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={14} style={{ color: 'var(--gold-3)' }} />
                <span className="sc-bold" style={{ fontSize: 10, color: 'var(--gold-3)' }}>
                  Your House appears to be
                </span>
              </div>

              <div
                className="result-card"
                style={{
                  marginBottom: '2rem',
                  '--house-color': primary.color,
                  '--house-tint': primary.tint,
                  '--house-glow': primary.glow,
                }}
              >
                <div
                  style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                    marginBottom: '1.5rem', flexWrap: 'wrap',
                  }}
                >
                  <div
                    className="result-icon-disc"
                    style={{
                      '--house-color': primary.color,
                      '--house-tint': primary.tint,
                      '--house-glow': primary.glow,
                    }}
                  >
                    <PrimaryIcon size={28} style={{ color: primary.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.25rem', color: primary.color }}>
                      House of
                    </div>
                    <h1
                      className="display-strong"
                      style={{
                        fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
                        lineHeight: 0.95,
                        marginBottom: '0.5rem',
                        fontWeight: 600,
                        color: primary.color,
                      }}
                    >
                      {primary.name}
                    </h1>
                    <p
                      className="body"
                      style={{
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.05rem, 2vw, 1.15rem)',
                        color: 'var(--ink-2)',
                      }}
                    >
                      {primary.charism}
                    </p>
                  </div>
                </div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                  <p
                    className="body"
                    style={{
                      fontSize: 'clamp(1.05rem, 1.8vw, 1.12rem)',
                      lineHeight: 1.65,
                      marginBottom: '1.25rem',
                      color: 'var(--ink-2)',
                    }}
                  >
                    {primary.body}
                  </p>
                  <div
                    style={{
                      borderLeft: `2px solid ${primary.color}`,
                      padding: '0.5rem 0 0.5rem 1rem',
                      margin: '1.25rem 0',
                    }}
                  >
                    <p
                      className="body"
                      style={{
                        fontSize: 'clamp(1.02rem, 1.7vw, 1.08rem)',
                        lineHeight: 1.6,
                        color: 'var(--ink-2)',
                      }}
                    >
                      {primary.fitWhy}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                      gap: '0.75rem', paddingTop: '1.25rem', marginTop: '1.25rem',
                      borderTop: '1px solid var(--line-soft)', flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div className="sc" style={{ fontSize: 9, marginBottom: '0.125rem', color: 'var(--mute)' }}>
                        Patron · Tradition
                      </div>
                      <div className="body" style={{ fontSize: '0.98rem', color: 'var(--ink-2)' }}>
                        {primary.patron} ·{' '}
                        <span style={{ fontStyle: 'italic', color: primary.color }}>{primary.tradition}</span>
                      </div>
                    </div>
                    <div className="display" style={{ fontStyle: 'italic', fontSize: '1.05rem', color: primary.color }}>
                      {primary.motto}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary House — the complementary tradition. */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="sc-bold" style={{ fontSize: 10, color: 'var(--mute)' }}>
                    Also shaping you
                  </span>
                  <span style={{ color: 'var(--mute)', opacity: 0.5 }}>·</span>
                  <span className="body" style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--mute)' }}>
                    The complementary tradition
                  </span>
                </div>
                <div
                  style={{
                    border: `1px solid ${secondary.color}`,
                    padding: '1.25rem',
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    background: secondary.tint,
                  }}
                >
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '0.125rem',
                      background: secondary.tint,
                      border: `1px solid ${secondary.color}`,
                    }}
                  >
                    <SecondaryIcon size={18} style={{ color: secondary.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex', alignItems: 'baseline', gap: '0.5rem',
                        marginBottom: '0.25rem', flexWrap: 'wrap',
                      }}
                    >
                      <h3 className="display" style={{ fontSize: '1.3rem', lineHeight: 1.15, color: secondary.color }}>
                        House of {secondary.name}
                      </h3>
                      <span className="sc" style={{ fontSize: 9, color: 'var(--mute)' }}>·</span>
                      <span className="body" style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--mute)' }}>
                        {secondary.patron}
                      </span>
                    </div>
                    <p
                      className="body"
                      style={{ fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--ink-2)' }}
                    >
                      The {secondary.charism.toLowerCase()} that complements your{' '}
                      {primary.charism.toLowerCase()}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bar chart — all five Houses, score as percentage. */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div className="sc-bold" style={{ fontSize: 10, marginBottom: '1rem', color: 'var(--gold-3)' }}>
                  The Full Picture
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ranked.map((h, i) => {
                    const pct = totalScore > 0 ? (h.score / totalScore) * 100 : 0;
                    const Icon = h.icon;
                    return (
                      <div key={h.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            width: '7rem', flexShrink: 0,
                          }}
                        >
                          <Icon size={14} style={{ color: h.color }} />
                          <span
                            className="sc"
                            style={{
                              fontSize: 10,
                              color: i === 0 ? h.color : 'var(--ink-2)',
                              fontWeight: i === 0 ? 600 : 500,
                            }}
                          >
                            {h.name}
                          </span>
                        </div>
                        <div style={{ flex: 1, height: 8, overflow: 'hidden', background: 'var(--paper-3)' }}>
                          <div
                            className="score-bar"
                            style={{
                              height: '100%',
                              background: h.color,
                              '--score-width': `${pct}%`,
                              width: `${pct}%`,
                            }}
                          />
                        </div>
                        <span
                          className="sc"
                          style={{ fontSize: 9, width: '2rem', textAlign: 'right', color: 'var(--mute)' }}
                        >
                          {Math.round(pct)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p
                className="body"
                style={{
                  fontStyle: 'italic', textAlign: 'center',
                  fontSize: '0.95rem', lineHeight: 1.55,
                  marginBottom: '2rem', maxWidth: '28rem',
                  marginLeft: 'auto', marginRight: 'auto',
                  color: 'var(--mute)',
                }}
              >
                This is a starting orientation. Your House becomes truer in the walking — the saints
                meet you, the practices form you, and what fits clarifies over time.
              </p>

              <div
                style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'center',
                  gap: '0.75rem', paddingTop: '1.5rem',
                  borderTop: '1px solid var(--line)', flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => onSave(primary.key)}
                  className="btn-gold sc-bold"
                  style={{
                    fontSize: 11, padding: '0.875rem 1.5rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    minHeight: 44,
                  }}
                >
                  <Check size={13} /> Save House of {primary.name}
                </button>
                <button
                  onClick={handleRetake}
                  className="btn-ghost sc"
                  style={{
                    fontSize: 10, padding: '0.75rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    minHeight: 44,
                  }}
                >
                  <RotateCcw size={12} /> Retake
                </button>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
