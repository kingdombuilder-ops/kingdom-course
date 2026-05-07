/* =============================================================================
   src/components/Hero.jsx — The Gate's landing hero.

   The visitor's first impression of the site. Conversion-first, no brand
   chrome. Two large CTAs:
     - "Enter the course" — wired to onEnter (full sign-up / course route)
     - "Begin with the message" — wired to onToPrologue (smooth-scrolls
       to the Prologue section below)

   Sets two background SVGs (concentric circles, top-right and bottom-left)
   that fade in with the .fade animation class.

   Migrated from the_kingdom.jsx line ~6804. Tailwind classes converted to
   inline styles per project convention. Custom CSS classes preserved
   (paper-bg, ornament, sc-bold, display-strong, body-lede, body, display,
   btn-gold, pulse-gold, sc, rise + d-N animation delays).

   Props:
     onEnter()      — invoked by the primary "Enter the course" CTA
     onToPrologue() — invoked by the secondary "Begin with the message" link
   ============================================================================= */

import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero({ onEnter, onToPrologue }) {
  return (
    <section
      id="top"
      className="paper-bg"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Top-right concentric circles */}
      <svg
        className="fade"
        aria-hidden
        width="720"
        height="720"
        viewBox="0 0 720 720"
        style={{
          position: 'absolute',
          right: '-10rem',
          top: '-10rem',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        {[...Array(9)].map((_, i) => (
          <circle
            key={i}
            cx="360"
            cy="360"
            r={40 + i * 34}
            fill="none"
            stroke="var(--gold-3)"
            strokeWidth="0.8"
          />
        ))}
      </svg>
      {/* Bottom-left concentric circles */}
      <svg
        className="fade"
        aria-hidden
        width="620"
        height="620"
        viewBox="0 0 620 620"
        style={{
          position: 'absolute',
          left: '-8rem',
          bottom: '-10rem',
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      >
        {[...Array(7)].map((_, i) => (
          <circle
            key={i}
            cx="310"
            cy="310"
            r={50 + i * 34}
            fill="none"
            stroke="var(--wine)"
            strokeWidth="0.8"
          />
        ))}
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '48rem',
          margin: '0 auto',
          padding: 'clamp(6rem, 10vw, 8rem) clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div
          className="ornament rise d-1"
          style={{ maxWidth: '18rem', marginBottom: 'clamp(2.5rem, 4vw, 3rem)' }}
        >
          <span className="sc-bold" style={{ fontSize: 10 }}>The Kingdom of Eternal Life</span>
        </div>

        <h1 className="rise d-2">
          <span
            className="display-strong"
            style={{
              display: 'block',
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 5.2vw, 4.2rem)',
              lineHeight: 0.88,
              color: 'var(--gold-3)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            The single greatest announcement in history
          </span>
          <span
            className="display-strong"
            style={{
              display: 'block',
              fontSize: 'clamp(1.25rem, 2.9vw, 1.95rem)',
              lineHeight: 1.05,
              color: 'var(--ink)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              marginTop: '0.625rem',
            }}
          >
            has also been the most rigorously verified.
          </span>
        </h1>

        <p
          className="body-lede rise d-3"
          style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.32rem)',
            lineHeight: 1.6,
            marginTop: 'clamp(1.5rem, 2.5vw, 2rem)',
            color: 'var(--ink-2)',
          }}
        >
          Two thousand years ago, the Son of God walked among us as Jesus of Nazareth. He came with
          one message above all others: <em>the kingdom of heaven had arrived</em> — a kingdom of
          eternal life, given now and forever. A life that begins on earth, in the sacraments and
          in communion with a living God, and does not end at death but consummates in heaven, face
          to face with the King.
        </p>

        <p
          className="body rise d-3"
          style={{
            fontSize: 'clamp(1.16rem, 1.9vw, 1.26rem)',
            lineHeight: 1.6,
            marginTop: '1.25rem',
            color: 'var(--ink-2)',
          }}
        >
          That announcement has since become the most rigorously investigated supernatural assertion
          in human history — confirmed by Eucharistic hosts that become living cardiac tissue, by
          apparitions with measurable physical evidence, by bodies of saints that do not decay, by
          healings verified by panels of secular physicians, and — most staggering of all — by
          thousands of canonized saints who continue to heal, appear, and intercede from beyond
          their own deaths. Not only the kingdom. Eternal life itself, verified.
        </p>

        <p
          className="display-strong rise d-4"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.32rem, 2.4vw, 1.55rem)',
            marginTop: '2rem',
            lineHeight: 1.4,
            color: 'var(--wine)',
            fontWeight: 500,
          }}
        >
          The greatest message in history. From the central figure of history — the hinge on which
          all of it turns.
          <span style={{ display: 'block', marginTop: '0.375rem' }}>
            Verified by the greatest body of evidence on earth.
          </span>
        </p>

        <p
          className="display rise d-4"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.1rem, 1.9vw, 1.22rem)',
            marginTop: '1.25rem',
            color: 'var(--ink-2)',
          }}
        >
          The kingdom is not invisible. Follow it inward. The gate is open.
        </p>

        <div
          className="rise d-5"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            marginTop: '2.5rem',
          }}
        >
          <button
            onClick={onEnter}
            className="btn-gold sc pulse-gold"
            style={{
              fontSize: 11,
              padding: '1rem 1.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'inherit',
            }}
          >
            Enter the course <ArrowRight size={14} />
          </button>
          <button
            onClick={onToPrologue}
            className="sc"
            style={{
              fontSize: 11,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: 44,
              padding: '0.75rem 0.5rem',
              marginLeft: '-0.5rem',
              color: 'var(--ink-2)',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'color 0.2s ease',
            }}
          >
            Begin with the message <ChevronDown size={14} />
          </button>
        </div>

        <div
          className="rise d-6"
          style={{
            marginTop: 'clamp(4rem, 6vw, 5rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            color: 'var(--mute)',
          }}
        >
          <div
            style={{ height: 1, width: 48, flexShrink: 0, background: 'var(--gold)' }}
          />
          <p className="body" style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
            "The kingdom of heaven is like a merchant in search of fine pearls, who, on finding
            one pearl of great value, went and sold all that he had and bought it."
            <span
              className="sc"
              style={{
                display: 'block',
                fontStyle: 'normal',
                fontSize: 10,
                marginTop: '0.5rem',
              }}
            >
              Matthew 13:45–46
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
