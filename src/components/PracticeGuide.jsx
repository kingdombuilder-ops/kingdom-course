/* =============================================================================
   src/components/PracticeGuide.jsx — A single practice rendered editorially.

   Top: breadcrumb (Field Guide · Category · Time), title, italic tagline.
   Middle: the practice's body content rendered through a block renderer
     supporting four block types (paragraph with optional dropcap on first,
     heading with gold underline, scripture-quote with citation, pullquote).
   Bottom: optional related practices (3 max, from same category) and a
     footer "All Practices" back button.

   Migrated from the_kingdom.jsx line ~8424. Source uses Tailwind utility
   classes throughout; per project convention (Tailwind renders blank in
   the user's environment), all utilities have been converted to inline
   style objects. Custom CSS classes (paper-bg, ornament, sc, sc-bold,
   body, display, display-strong, scripture, dropcap, btn-ghost) are
   preserved — those are real CSS rules.

   The body block renderer handles four `t` types:
     "p"         — paragraph (HTML allowed via dangerouslySetInnerHTML;
                   first paragraph gets the .dropcap treatment)
     "h"         — heading with thin gold rule underneath
     "q"         — block scripture quote with optional `c` citation
     "pullquote" — large centered emphasis quote in wine

   Props:
     practice          — the practice object (slug, title, tagline, body,
                         category, time?). When null, the component returns
                         null — defensive, matches source.
     onBack()          — invoked by the top breadcrumb back button and the
                         footer "All Practices" button (returns to FieldGuideHub)
     relatedPractices  — array of practices in the same category (excluding
                         the current); App.jsx feeds 3
     onOpenPractice(slug) — invoked when a related-practice row is tapped
   ============================================================================= */

import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { PRACTICE_CATEGORIES } from '@data';

export default function PracticeGuide({
  practice,
  onBack,
  relatedPractices = [],
  onOpenPractice,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [practice]);

  if (!practice) return null;

  const category = PRACTICE_CATEGORIES.find((c) => c.id === practice.category);

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
            maxWidth: '48rem',
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
              transition: 'color 0.2s ease',
            }}
          >
            <ArrowLeft size={12} /> The Field Guide
          </button>

          {/* Breadcrumb chips */}
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
            <span>Field Guide</span>
            {category && (
              <>
                <span style={{ color: 'var(--mute)' }}>·</span>
                <span>{category.title}</span>
              </>
            )}
            {practice.time && (
              <>
                <span style={{ color: 'var(--mute)' }}>·</span>
                <span
                  style={{
                    color: 'var(--mute)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <Clock size={10} /> {practice.time}
                </span>
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
            {practice.title}
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
            {practice.tagline}
          </p>
        </div>
      </section>

      {/* Body content */}
      <section className="paper-bg" style={{ paddingBottom: 'clamp(4rem, 6vw, 5rem)' }}>
        <div
          style={{
            maxWidth: '36rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <article style={{ paddingTop: '2rem' }}>
            {practice.body.map((block, i) => {
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
        </div>
      </section>

      {/* Related practices */}
      {relatedPractices && relatedPractices.length > 0 && (
        <section
          style={{
            padding: 'clamp(3.5rem, 5vw, 4rem) 0',
            borderTop: '1px solid var(--line)',
            background: 'var(--paper-2)',
          }}
        >
          <div
            style={{
              maxWidth: '36rem',
              margin: '0 auto',
              padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            <div className="ornament" style={{ marginBottom: '1.5rem', maxWidth: '14rem' }}>
              <span className="sc">Related Practices</span>
            </div>
            <div>
              {relatedPractices.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => onOpenPractice(p.slug)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '1rem',
                    padding: '1rem 0.5rem',
                    borderBottom: '1px solid var(--line)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--paper)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <BookOpen
                    size={14}
                    style={{ color: 'var(--gold-3)', flexShrink: 0, marginTop: '0.25rem' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      className="display"
                      style={{
                        fontSize: 'clamp(1.15rem, 1.7vw, 1.3rem)',
                        fontWeight: 300,
                        lineHeight: 1.15,
                        marginBottom: '0.25rem',
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      className="body"
                      style={{
                        fontStyle: 'italic',
                        fontSize: '0.92rem',
                        color: 'var(--mute)',
                      }}
                    >
                      {p.tagline}
                    </div>
                  </div>
                  <ArrowUpRight
                    size={14}
                    style={{ color: 'var(--gold-3)', opacity: 0.4, flexShrink: 0 }}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer nav */}
      <section
        className="paper-bg"
        style={{
          padding: 'clamp(2.5rem, 4vw, 3.5rem) 0',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            maxWidth: '36rem',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={onBack}
            className="btn-ghost sc"
            style={{
              fontSize: 10,
              padding: '0.75rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
            }}
          >
            <ArrowLeft size={12} /> All Practices
          </button>
        </div>
      </section>
    </div>
  );
}
