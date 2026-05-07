/* =============================================================================
   src/components/CircleModal.jsx — Single-circle reading modal.

   Opens when a Circle is tapped from the Circles section. Renders editorial
   content for one circle: title, subtitle, essence (with dropcap), four
   pillars (numbered bullets), supplementary evidence sections, scripture
   blockquote, optional "Sit With This" reflection list, and optional
   prayer card. Footer has prev/next circle navigation.

   Keyboard handlers:
     Escape    → onClose
     ArrowRight → onNext
     ArrowLeft  → onPrev

   Migrated from the_kingdom.jsx line ~7390. Tailwind classes converted to
   inline styles. Custom CSS classes preserved (paper-bg, modal-enter,
   ornament, sc, display-strong, body, body-lede, dropcap, display,
   scripture, btn-ghost, btn-gold).

   Props:
     circle    — a single circle object from CIRCLES, or null (returns null)
     onClose() — invoked by close button + backdrop click + Escape key
     onNext()  — invoked by next button + ArrowRight key
     onPrev()  — invoked by prev button + ArrowLeft key
   ============================================================================= */

import { useEffect, useRef } from 'react';
import { ArrowRight, Quote, X } from 'lucide-react';

export default function CircleModal({ circle, onClose, onNext, onPrev }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
      if (e.key === 'ArrowRight') onNext && onNext();
      if (e.key === 'ArrowLeft') onPrev && onPrev();
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    return undefined;
  }, [circle, onClose, onNext, onPrev]);

  if (!circle) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="paper-bg modal-enter"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '48rem',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--line)',
        }}
      >
        <div
          className="paper-bg"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            display: 'flex',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(6px)',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              margin: '0.5rem',
              padding: '0.5rem',
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
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
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 3.5rem) clamp(4rem, 6vw, 5rem)',
          }}
        >
          <div className="ornament" style={{ marginBottom: '2rem', maxWidth: '16rem' }}>
            <span className="sc" style={{ fontSize: 10 }}>
              Circle {String(circle.n).padStart(2, '0')} of IX
            </span>
          </div>

          <h3
            className="display-strong"
            style={{
              fontSize: 'clamp(2.3rem, 6.2vw, 3.8rem)',
              lineHeight: 1.02,
              marginBottom: '0.75rem',
              fontWeight: 600,
            }}
          >
            {circle.title}
          </h3>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
              marginBottom: '2.5rem',
              color: 'var(--wine)',
              fontWeight: 500,
            }}
          >
            {circle.subtitle}
          </p>

          <p
            className="body-lede dropcap"
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.7,
              marginBottom: '3.5rem',
              color: 'var(--ink-2)',
            }}
          >
            {circle.essence}
          </p>

          <div className="ornament" style={{ marginBottom: '2rem' }}>
            <span className="sc">The Evidence</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3.5rem' }}>
            {circle.pillars.map((p, i) => (
              <div
                key={i}
                style={{ display: 'flex', gap: 'clamp(1.25rem, 2vw, 1.5rem)' }}
              >
                <div style={{ flexShrink: 0, paddingTop: '0.375rem' }}>
                  <div
                    className="sc"
                    style={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--gold)',
                      fontSize: 10,
                      color: 'var(--gold-3)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div>
                  <div
                    className="display"
                    style={{
                      fontSize: 'clamp(1.3rem, 2.4vw, 1.5rem)',
                      lineHeight: 1.15,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {p.k}
                  </div>
                  <p
                    className="body"
                    style={{
                      fontSize: '1.05rem',
                      lineHeight: 1.65,
                      color: 'var(--ink-2)',
                    }}
                  >
                    {p.v}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {circle.evidence && circle.evidence.map((e, i) => (
            <div key={i} style={{ marginBottom: '2.5rem' }}>
              <div
                className="sc"
                style={{ fontSize: 10, marginBottom: '0.75rem', color: 'var(--gold-3)' }}
              >
                {e.name}
              </div>
              <p
                className="body"
                style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink-2)' }}
              >
                {e.body}
              </p>
            </div>
          ))}

          <div
            style={{
              margin: '3rem 0',
              padding: '2rem 0',
              borderTop: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <Quote size={18} style={{ color: 'var(--gold-3)' }} />
            <p
              className="scripture display"
              style={{
                fontSize: 'clamp(1.3rem, 2.4vw, 1.55rem)',
                marginTop: '0.75rem',
                lineHeight: 1.4,
              }}
            >
              {circle.scripture}
            </p>
          </div>

          {/* Reflection */}
          {circle.reflection && circle.reflection.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <div className="ornament" style={{ marginBottom: '1.5rem' }}>
                <span className="sc">Sit With This</span>
              </div>
              <ol
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  paddingLeft: 0,
                  listStyle: 'none',
                  margin: 0,
                }}
              >
                {circle.reflection.map((q, i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem' }}>
                    <span
                      className="sc"
                      style={{
                        fontSize: 10,
                        flexShrink: 0,
                        paddingTop: '0.25rem',
                        color: 'var(--gold-3)',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      className="body"
                      style={{
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.08rem, 1.7vw, 1.15rem)',
                        lineHeight: 1.6,
                        color: 'var(--ink-2)',
                      }}
                    >
                      {q}
                    </p>
                  </li>
                ))}
              </ol>
              <p
                className="body"
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.92rem',
                  marginTop: '1.5rem',
                  color: 'var(--mute)',
                }}
              >
                Do not rush these. One is enough to carry for the day.
              </p>
            </div>
          )}

          {/* Prayer */}
          {circle.prayer && (
            <div
              style={{
                marginBottom: '3rem',
                padding: '2rem clamp(1.5rem, 3vw, 2rem)',
                border: '1px solid rgba(181,136,63,0.4)',
                background:
                  'radial-gradient(ellipse at center, rgba(215,177,105,0.07), transparent 75%)',
              }}
            >
              <div
                className="ornament"
                style={{ marginBottom: '1.25rem', maxWidth: '10rem', color: 'var(--gold-3)' }}
              >
                <span className="sc" style={{ color: 'var(--gold-3)' }}>
                  Pray
                </span>
              </div>
              <p
                className="display"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 2.2vw, 1.3rem)',
                  lineHeight: 1.65,
                  color: 'var(--ink)',
                }}
              >
                {circle.prayer}
              </p>
            </div>
          )}

          {/* Footer nav */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '1.5rem',
            }}
          >
            <button
              onClick={onPrev}
              disabled={circle.n === 1}
              className="btn-ghost sc"
              style={{
                fontSize: 10,
                padding: '0.625rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: circle.n === 1 ? 0.35 : 1,
                cursor: circle.n === 1 ? 'default' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ← Previous circle
            </button>
            <span className="sc" style={{ fontSize: 10, color: 'var(--mute)' }}>
              Circle {circle.n} / 9
            </span>
            <button
              onClick={onNext}
              disabled={circle.n === 9}
              className="btn-gold sc"
              style={{
                fontSize: 10,
                padding: '0.625rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: circle.n === 9 ? 0.35 : 1,
                cursor: circle.n === 9 ? 'default' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Next circle <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
