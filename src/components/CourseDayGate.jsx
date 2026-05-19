/* =============================================================================
   src/components/CourseDayGate.jsx — Course day signup gate.

   Rendered by CourseTabView when an unauthenticated visitor tries to open
   any Day 2..50 reading (or the Sending Day). Day 1 and the Week 1
   Prologue remain free; everything beyond requires an account.

   Per FINAL_CONTENT_REVISION_PLAN §1.8 — Day 1 is the low-friction try;
   the gate appears at Day 2 with the "You've walked Day 1" framing.

   Props:
     onOpenSignup()     — invoked by the primary CTA; opens SignupModal
     onBackToOverview() — invoked by the secondary link; returns to the
                          Course overview
   ============================================================================= */

import { ArrowRight, ChevronLeft } from 'lucide-react';

export default function CourseDayGate({ onOpenSignup, onBackToOverview }) {
  return (
    <section
      className="paper-bg"
      style={{
        position: 'relative',
        minHeight: '85svh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(5rem, 9vw, 7rem)',
        paddingBottom: 'clamp(4rem, 7vw, 6rem)',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '45rem',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          width: '100%',
        }}
      >
        <div
          className="ornament"
          style={{ maxWidth: '14rem', marginBottom: 'clamp(2rem, 3vw, 2.5rem)' }}
        >
          <span className="sc-bold" style={{ fontSize: 11, color: 'var(--gold-3)' }}>
            The Course
          </span>
        </div>

        <h2
          className="display-strong"
          style={{
            fontSize: 'clamp(2.2rem, 5.6vw, 3.4rem)',
            lineHeight: 1.05,
            fontWeight: 600,
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}
        >
          You've walked Day 1.
        </h2>

        <p
          className="body-lede"
          style={{
            fontSize: 'clamp(1.18rem, 2vw, 1.28rem)',
            lineHeight: 1.65,
            marginBottom: '1.25rem',
            color: 'var(--ink-2)',
          }}
        >
          To continue Day 2 and the rest of the fifty-day walk, sign in. The
          Course is free. It always will be. We ask for an email so we can
          walk with you.
        </p>

        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.05rem, 1.8vw, 1.15rem)',
            lineHeight: 1.5,
            marginBottom: 'clamp(2.5rem, 4vw, 3rem)',
            color: 'var(--wine)',
          }}
        >
          The Gospel meets you. The Course forms you. The Kingdom holds you.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <button
            onClick={onOpenSignup}
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
            Sign in to continue <ArrowRight size={14} />
          </button>
          <button
            onClick={onBackToOverview}
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
            <ChevronLeft size={14} /> Back to the Course
          </button>
        </div>
      </div>
    </section>
  );
}
