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

import { ArrowRight } from 'lucide-react';

export default function Hero({ onEnter }) {
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
          aria-hidden
          style={{ maxWidth: '18rem', marginBottom: 'clamp(2.5rem, 4vw, 3rem)' }}
        />

        {/* Line 2 — the naming. Display-size ink, regular (not italic).
            text-wrap: balance distributes the break across the title cleanly
            on narrow viewports (avoids the "Life." orphan on mobile). */}
        <h1
          className="display-strong rise d-2"
          style={{
            // Bumped from clamp(2rem, 5.2vw, 4.2rem) — 32px floor felt
            // modest in the hero vs the under-title (24px). 38.4px floor
            // sharpens the hierarchy to ~1.6× while keeping the balanced
            // two-line break on iPhone widths.
            fontSize: 'clamp(2.4rem, 5.4vw, 4.4rem)',
            lineHeight: 0.95,
            color: 'var(--ink)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            margin: 0,
            textWrap: 'balance',
          }}
        >
          The Kingdom of Eternal Life.
        </h1>

        {/* Line 3 — the reframing. Italic gold-3, medium-large. Mirrors the
            "He came to inaugurate a kingdom." pattern in Prologue.jsx. */}
        <p
          className="display rise d-3"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            lineHeight: 1.2,
            color: 'var(--gold-3)',
            marginTop: '0.75rem',
            textWrap: 'balance',
          }}
        >
          The great design for humanity.
        </p>

        {/* Line 4 — the grounding. Medium ink, weight 300 — the visually
            quietest line. Two axes of differentiation from line 3
            (non-italic + lighter) keep the hierarchy clear. */}
        <p
          className="display rise d-3"
          style={{
            fontSize: 'clamp(1.3rem, 2.5vw, 1.65rem)',
            lineHeight: 1.3,
            color: 'var(--ink)',
            fontWeight: 300,
            marginTop: '0.5rem',
            textWrap: 'balance',
          }}
        >
          Made known in Christ.
          <br />
          Borne witness by two thousand years of miracles, saints, and signs.
        </p>

        {/* Line 5 — thin gold band: small-caps subhead carrying the
            previous "most important / most rigorously verified" beat.
            Mirrors the Course hero's "Seven Weeks · Fifty Days ·…" band. */}
        <div className="rise d-3" style={{ marginTop: '1.5rem' }}>
          <div style={{ height: 1, maxWidth: '5rem', background: 'var(--gold)' }} />
          <div
            className="sc-bold"
            style={{
              fontSize: 10,
              marginTop: '1rem',
              color: 'var(--gold-3)',
              letterSpacing: '0.14em',
            }}
          >
            The most important announcement in history · The most rigorously verified
          </div>
        </div>

        {/* BEGIN — left-aligned with the text block (no flex centering);
            generous top margin (48-64px) creates breathing room between
            the headline block and the CTA. */}
        <div className="rise d-4" style={{ marginTop: 'clamp(3rem, 6vw, 4rem)' }}>
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
            BEGIN <ArrowRight size={14} />
          </button>
        </div>

        <p
          className="body-lede rise d-4"
          style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.32rem)',
            lineHeight: 1.6,
            marginTop: 'clamp(4rem, 7vw, 6rem)',
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
          className="body rise d-4"
          style={{
            fontSize: 'clamp(1.16rem, 1.9vw, 1.26rem)',
            lineHeight: 1.6,
            marginTop: '1.25rem',
            color: 'var(--ink-2)',
          }}
        >
          That announcement has been the most rigorously investigated supernatural claim
          in human history — confirmed by Eucharistic hosts that become living cardiac tissue, by
          apparitions with measurable physical evidence, by bodies of saints that do not decay, by
          healings verified by panels of secular physicians, and — most staggering of all — by
          thousands of canonized saints who continue to heal, appear, and intercede from beyond
          their own deaths.
        </p>

        <p
          className="display-strong rise d-5"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.2rem, 2.1vw, 1.4rem)',
            marginTop: '2rem',
            lineHeight: 1.45,
            color: 'var(--ink)',
            fontWeight: 600,
          }}
        >
          Not only the kingdom. Eternal life itself, verified.
        </p>

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
