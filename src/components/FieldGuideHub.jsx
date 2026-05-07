/* =============================================================================
   src/components/FieldGuideHub.jsx — The Field Guide's index page.

   Lists all 22 practices grouped by their 5 categories. Each row is a
   tappable button that opens the corresponding PracticeGuide detail view.

   The page header has a "Back to the Course" button. Per source naming this
   is `onToCourse`, but in practice (within the Kingdom tab's flow) it's
   used to return to the Hub. App.jsx wires it accordingly via `goToHub`.

   Migrated from the_kingdom.jsx line ~8324. The source uses Tailwind utility
   classes throughout; per project convention (Tailwind renders blank in the
   user's environment), all utilities have been converted to inline `style`
   objects. Custom CSS classes (paper-bg, ornament, sc-bold, body-lede,
   display, display-strong, body, sc, btn-ghost) are preserved — those
   are real CSS rules in src/styles/index.css.

   Props:
     onOpenPractice(slug) — invoked when a practice row is tapped
     onToCourse()         — invoked by the "Back" button (wired to goToHub
                            in App.jsx; the Course context comes later)
   ============================================================================= */

import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { PRACTICES, PRACTICE_CATEGORIES } from '@data';

export default function FieldGuideHub({ onOpenPractice, onToCourse }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="view-enter">
      {/* Hero */}
      <section
        className="paper-bg"
        style={{
          position: 'relative',
          paddingTop: 'clamp(6rem, 12vw, 9rem)',
          paddingBottom: 'clamp(3.5rem, 6vw, 5rem)',
          overflow: 'hidden',
        }}
      >
        {/* Decorative concentric rings — fade in via .fade class */}
        <svg
          className="fade"
          aria-hidden
          width="520"
          height="520"
          viewBox="0 0 520 520"
          style={{
            position: 'absolute',
            right: '-8rem',
            top: '-8rem',
            opacity: 0.07,
            pointerEvents: 'none',
          }}
        >
          {[...Array(7)].map((_, i) => (
            <circle
              key={i}
              cx="260"
              cy="260"
              r={40 + i * 30}
              fill="none"
              stroke="var(--gold-3)"
              strokeWidth="0.8"
            />
          ))}
        </svg>

        <div
          style={{
            maxWidth: '56rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div className="ornament" style={{ marginBottom: '2.5rem', maxWidth: '20rem' }}>
            <span className="sc-bold">The Field Guide</span>
          </div>
          <h1
            className="display-strong"
            style={{
              fontSize: 'clamp(2.7rem, 7.2vw, 5.2rem)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              marginBottom: '2rem',
              fontWeight: 600,
            }}
          >
            Essential practices
            <span
              style={{
                display: 'block',
                fontStyle: 'italic',
                marginTop: '0.25rem',
                color: 'var(--gold-3)',
                fontWeight: 500,
              }}
            >
              for citizens of the Kingdom.
            </span>
          </h1>
          <p
            className="body-lede"
            style={{
              fontSize: 'clamp(1.2rem, 2vw, 1.32rem)',
              lineHeight: 1.6,
              maxWidth: '42rem',
              color: 'var(--ink-2)',
            }}
          >
            The pocket reference. How the saints actually prayed, fasted, confessed, and walked the
            interior life. Not theory. The practical tools the Kingdom Course keeps pointing toward
            — collected here, immediately useful, the thing you open when a day's reading says{' '}
            <em>"begin this week."</em>
          </p>

          <div
            style={{
              marginTop: '2.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <button
              onClick={onToCourse}
              className="btn-ghost sc"
              style={{
                fontSize: 10,
                padding: '0.625rem 1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit',
              }}
            >
              <ArrowLeft size={12} /> Back to the Course
            </button>
            <span className="sc" style={{ fontSize: 10, color: 'var(--mute)' }}>
              {PRACTICES.length} practices · {PRACTICE_CATEGORIES.length} categories
            </span>
          </div>
        </div>
      </section>

      {/* Categorized practice cards */}
      <section className="paper-bg" style={{ paddingBottom: 'clamp(6rem, 10vw, 8rem)' }}>
        <div
          style={{
            maxWidth: '56rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          {PRACTICE_CATEGORIES.map((cat) => {
            const catPractices = PRACTICES.filter((p) => p.category === cat.id);
            if (catPractices.length === 0) return null;
            return (
              <div key={cat.id} style={{ marginBottom: 'clamp(4rem, 6vw, 5rem)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <h2
                    className="display-strong"
                    style={{
                      fontSize: 'clamp(1.95rem, 3.5vw, 2.4rem)',
                      lineHeight: 1.15,
                      fontWeight: 600,
                    }}
                  >
                    {cat.title}
                  </h2>
                  <p
                    className="body"
                    style={{
                      fontStyle: 'italic',
                      fontSize: '1rem',
                      color: 'var(--mute)',
                      fontWeight: 500,
                    }}
                  >
                    {cat.note}
                  </p>
                </div>
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  {catPractices.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => onOpenPractice(p.slug)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 'clamp(1rem, 2vw, 1.5rem)',
                        padding: 'clamp(1.25rem, 2vw, 1.5rem) clamp(0.5rem, 1.5vw, 1rem)',
                        borderBottom: '1px solid var(--line)',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--paper-2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <BookOpen
                        size={16}
                        style={{ color: 'var(--gold-3)', flexShrink: 0, marginTop: '0.25rem' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          className="display"
                          style={{
                            fontSize: 'clamp(1.3rem, 2vw, 1.55rem)',
                            fontWeight: 300,
                            lineHeight: 1.15,
                            marginBottom: '0.375rem',
                          }}
                        >
                          {p.title}
                        </div>
                        <div
                          className="body"
                          style={{
                            fontStyle: 'italic',
                            fontSize: 'clamp(0.95rem, 1.4vw, 1rem)',
                            lineHeight: 1.4,
                            marginBottom: '0.5rem',
                            color: 'var(--ink-2)',
                          }}
                        >
                          {p.tagline}
                        </div>
                        {p.time && (
                          <div
                            className="sc"
                            style={{
                              fontSize: 9,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              color: 'var(--mute)',
                            }}
                          >
                            <Clock size={10} /> {p.time}
                          </div>
                        )}
                      </div>
                      <ArrowUpRight
                        size={16}
                        style={{
                          color: 'var(--gold-3)',
                          opacity: 0.4,
                          flexShrink: 0,
                          transition: 'opacity 0.2s ease',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div
            style={{
              marginTop: '5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid var(--line)',
              textAlign: 'center',
            }}
          >
            <p
              className="display"
              style={{
                fontStyle: 'italic',
                fontSize: 'clamp(1.2rem, 2vw, 1.4rem)',
                lineHeight: 1.4,
                color: 'var(--wine)',
              }}
            >
              These are the tools. The course teaches you why they matter. The Field Guide teaches
              you how.
            </p>
            <p
              className="sc"
              style={{ fontSize: 10, marginTop: '1rem', color: 'var(--mute)' }}
            >
              Salus animarum suprema lex
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
