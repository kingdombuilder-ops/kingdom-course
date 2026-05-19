/* =============================================================================
   src/components/GateInvitation.jsx — Closing CTA section.

   Dark-background section that wraps the Gate. Three reader-type cards
   ("If you are not yet Catholic", "If the faith has become routine", "If
   you are Catholic and burning") each leading to "Enter the Course".
   Below them, primary Enter the Course CTA + Pass it on share button.
   Below those, three italic "the gate" lines and two closing scriptures.

   Migrated from the_kingdom.jsx line ~7522. Tailwind classes converted to
   inline styles. Custom CSS classes preserved (ink-bg, ornament, sc,
   display-strong, body-lede, body, display, btn-gold, btn-ghost,
   scripture, fade).

   Props:
     onToCourse() — invoked by the 3 path cards' CTAs and the primary CTA
     onShare()    — invoked by the "Pass it on" CTA
   ============================================================================= */

import { ArrowRight, Share2 } from 'lucide-react';

const PATHS = [
  {
    h: 'If you are not yet Catholic',
    b: 'Visit a Catholic church this week. Find the tabernacle with the small lamp burning beside it. That lamp means the King is present. Sit for ten minutes. Then enter the course and begin at Step One — Awakening.',
    cta: 'Enter the Course',
  },
  {
    h: 'If the faith has become routine',
    b: 'You have just seen what you possess — the most formidable body of supernatural evidence in the history of the world. Wake up. The course will rebuild everything from the ground up. Begin at Step One.',
    cta: 'Enter the Course',
  },
  {
    h: 'If you are Catholic and burning',
    b: "You know who needs it — the friend who left, the spouse who doubts, the child who stopped going. The course is the tool. Send it to them. Walk it with them. The fire spreads through whoever you are already given.",
    cta: 'Enter the Course',
  },
];

export default function GateInvitation({ onToCourse, onShare }) {
  return (
    <section
      id="gate"
      className="ink-bg"
      style={{
        position: 'relative',
        paddingTop: 'clamp(6rem, 10vw, 9rem)',
        paddingBottom: 'clamp(6rem, 10vw, 9rem)',
        color: 'var(--paper)',
      }}
    >
      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div
          className="ornament"
          style={{ marginBottom: '2.5rem', color: 'var(--gold-2)' }}
        >
          <span className="sc" style={{ color: 'var(--gold-2)' }}>
            The Gate
          </span>
        </div>
        <h2
          className="display-strong"
          style={{
            fontSize: 'clamp(2.3rem, 6.2vw, 4.4rem)',
            lineHeight: 1.02,
            marginBottom: '2.5rem',
            color: 'var(--paper)',
            fontWeight: 600,
          }}
        >
          You have seen the evidence.{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--gold-2)' }}>
            Now walk the path.
          </span>
        </h2>
        <p
          className="body-lede"
          style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.32rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'rgba(246,239,222,0.85)',
          }}
        >
          The saints did not see more than you have just seen. They responded to it. What follows
          is the path they walked — the path of the kingdom — made simple enough for anyone,
          anywhere, to begin today.
        </p>
        <p
          className="body"
          style={{
            fontSize: 'clamp(1.18rem, 2vw, 1.28rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'rgba(246,239,222,0.82)',
          }}
        >
          Seven steps of kingdom life. Fifty days, one reading each morning, ending in the
          Sending. Free, for every soul on earth. No prerequisites. No gatekeepers. Only the
          gate.
        </p>

        <div
          className="reader-types-grid"
          style={{ margin: '3.5rem 0' }}
        >
          {PATHS.map((c, i) => (
            <div
              key={i}
              style={{
                border: '1px solid rgba(246,239,222,0.18)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                className="sc"
                style={{ fontSize: 10, marginBottom: '0.75rem', color: 'var(--gold-2)' }}
              >
                Path {String(i + 1).padStart(2, '0')}
              </div>
              <h4
                className="display"
                style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.4,
                  marginBottom: '0.75rem',
                  color: 'var(--paper)',
                }}
              >
                {c.h}
              </h4>
              <p
                className="body"
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.55,
                  marginBottom: '1.25rem',
                  flex: 1,
                  color: 'rgba(246,239,222,0.72)',
                }}
              >
                {c.b}
              </p>
              <button
                onClick={onToCourse}
                className="sc"
                style={{
                  fontSize: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  alignSelf: 'flex-start',
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  padding: 0,
                  color: 'var(--gold-2)',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease',
                }}
              >
                {c.cta} <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <button
            onClick={onToCourse}
            className="btn-gold sc"
            style={{
              fontSize: 11,
              padding: '0.875rem 1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
            }}
          >
            Enter the Course <ArrowRight size={14} />
          </button>
          <button
            onClick={onShare}
            className="btn-ghost sc"
            style={{
              fontSize: 11,
              padding: '0.875rem 1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderColor: 'rgba(246,239,222,0.3)',
              color: 'var(--paper)',
              fontFamily: 'inherit',
            }}
          >
            <Share2 size={13} /> Pass it on
          </button>
        </div>

        <div
          className="fade"
          style={{
            marginTop: 'clamp(4rem, 6vw, 5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <p
            className="display"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 2.6vw, 1.6rem)',
              lineHeight: 1.4,
              color: 'var(--gold-2)',
            }}
          >
            The gate has always been open. It will never close.
          </p>
          <p
            className="display"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 2.6vw, 1.6rem)',
              lineHeight: 1.4,
              color: 'var(--gold-2)',
            }}
          >
            The King is waiting for you.
          </p>
          <p
            className="display"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 2.6vw, 1.6rem)',
              lineHeight: 1.4,
              color: 'var(--gold-2)',
            }}
          >
            Go to him.
          </p>
        </div>

        <div
          style={{
            marginTop: '4rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(246,239,222,0.2)',
          }}
        >
          <p
            className="scripture display"
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.3rem)',
              lineHeight: 1.4,
              marginBottom: '1rem',
              borderLeftColor: 'var(--gold-2)',
              color: 'rgba(246,239,222,0.9)',
            }}
          >
            "Fear not, little flock, for it is your Father's good pleasure to give you the
            kingdom."
            <span
              className="sc"
              style={{
                display: 'block',
                fontStyle: 'normal',
                fontSize: 9,
                marginTop: '0.5rem',
                color: 'var(--gold-2)',
              }}
            >
              Luke 12:32
            </span>
          </p>
          <p
            className="scripture display"
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.3rem)',
              lineHeight: 1.4,
              borderLeftColor: 'var(--gold-2)',
              color: 'rgba(246,239,222,0.9)',
            }}
          >
            "Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I
            will come in to him and eat with him, and he with me."
            <span
              className="sc"
              style={{
                display: 'block',
                fontStyle: 'normal',
                fontSize: 9,
                marginTop: '0.5rem',
                color: 'var(--gold-2)',
              }}
            >
              Revelation 3:20
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
