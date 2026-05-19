/* =============================================================================
   src/components/SendingDay.jsx — Day 50, the Pentecost commissioning.

   The course's culminating page. Dark ink background with a radial Pentecost
   glow and seven flames arranged around the circle. Long meditative copy
   ending with two Pentecost scripture passages and a "pass it on" CTA.

   Migrated from the_kingdom.jsx line ~8212. Tailwind classes converted to
   inline styles per project convention.

   Props:
     onBack()  — invoked by the header back button + bottom "walk again" link
     onShare() — invoked by the "Pass it on to someone" CTA
   ============================================================================= */

import { ArrowLeft, Share2 } from 'lucide-react';

export default function SendingDay({ onBack, onShare }) {
  return (
    <div className="view-enter">
      <section
        className="ink-bg"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--paper)',
        }}
      >
        {/* Pentecost glow + 7 flames */}
        <svg
          aria-hidden
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1200 800"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <radialGradient id="pentecostGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4D98C" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#D7B169" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D7B169" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="600" cy="400" r="500" fill="url(#pentecostGlow)" />
          {[...Array(7)].map((_, i) => {
            const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
            const x = 600 + Math.cos(angle) * 260;
            const y = 400 + Math.sin(angle) * 260;
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <path
                  d="M0 -30 C -10 -15, -8 0, 0 8 C 8 0, 10 -15, 0 -30 Z"
                  fill="#F4D98C"
                  opacity="0.9"
                />
              </g>
            );
          })}
        </svg>

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '56rem',
            margin: '0 auto',
            padding: 'clamp(7rem, 12vw, 9rem) clamp(1.5rem, 3vw, 2.5rem) clamp(6rem, 10vw, 8rem)',
            width: '100%',
          }}
        >
          <button
            onClick={onBack}
            className="sc"
            style={{
              fontSize: 10,
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--gold-2)',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              minHeight: 44,
              padding: '0.75rem 0.5rem',
              marginLeft: '-0.5rem',
              fontFamily: 'inherit',
            }}
          >
            <ArrowLeft size={12} /> Back to the course
          </button>

          <div
            className="ornament rise d-1"
            style={{ marginBottom: '2.5rem', maxWidth: '24rem', color: 'var(--gold-2)' }}
          >
            <span className="sc" style={{ color: 'var(--gold-2)' }}>
              Day 50 · The Sending
            </span>
          </div>

          <h1
            className="display rise d-2"
            style={{
              fontWeight: 300,
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
            }}
          >
            Now you are sent.
          </h1>

          <p
            className="body rise d-3"
            style={{
              fontSize: 'clamp(1.2rem, 2vw, 1.35rem)',
              lineHeight: 1.65,
              marginTop: '2.5rem',
              maxWidth: '42rem',
              color: 'rgba(246,239,222,0.88)',
            }}
          >
            Seven steps walked. Fifty days of walking — inward, abiding, outward. The same
            shape the Church's calendar itself traces from Easter to Pentecost, when the first
            disciples were sent from a locked room into the streets, and nothing has been the same
            since.
          </p>

          <p
            className="display rise d-4"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 2.4vw, 1.4rem)',
              lineHeight: 1.4,
              marginTop: '2rem',
              maxWidth: '42rem',
              color: 'var(--gold-2)',
            }}
          >
            Seven steps walked become seven pillars. What you climbed to reach, you now stand on.
          </p>

          <p
            className="display rise d-4"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.35rem, 2.7vw, 1.6rem)',
              lineHeight: 1.4,
              marginTop: '2rem',
              maxWidth: '42rem',
              color: 'var(--gold-2)',
            }}
          >
            The Spirit was given. The doors were thrown open. The world was changed by a handful of
            people who had walked this same path.
          </p>

          <div
            className="rise d-5"
            style={{ marginTop: '4rem', maxWidth: '42rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <p
              className="body"
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.7,
                color: 'rgba(246,239,222,0.82)',
              }}
            >
              You are one of them now. Not because you finished a course. Because you walked the
              path the saints walked, and you came out where they came out — at the door, facing
              a world that needs what you now carry.
            </p>
            <p
              className="body"
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.7,
                color: 'rgba(246,239,222,0.82)',
              }}
            >
              Three things today. First, go to Mass — if possible, to an Easter-season or
              Pentecost Mass. Receive the King one more time before you are sent. Second, write
              down the name of one person you will bring to the Gate this year. Name them, commit,
              and pray over them. Third, begin again — either by walking the seven steps a second
              time more deeply, or by inviting the people God has placed in your life to walk
              this with you. Some will say yes. Some will say not yet. Some will say it later.
              Walk it with whoever is given.
            </p>
            <p
              className="body"
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.7,
                color: 'rgba(246,239,222,0.82)',
              }}
            >
              The course does not end here. The course ends in a life poured out for the King and
              his kingdom. The fiftieth day is simply the moment the door opens.
            </p>
          </div>

          {/* Pentecost scriptures */}
          <div
            style={{
              marginTop: '4rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid rgba(246,239,222,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <p
              className="scripture display"
              style={{
                fontSize: 'clamp(1.2rem, 2.2vw, 1.4rem)',
                lineHeight: 1.4,
                borderLeftColor: 'var(--gold-2)',
                color: 'rgba(246,239,222,0.92)',
              }}
            >
              "When the day of Pentecost came, they were all together in one place. Suddenly a
              sound like the blowing of a violent wind came from heaven and filled the whole house
              where they were sitting. They saw what seemed to be tongues of fire that separated
              and came to rest on each of them."
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
                Acts 2:1–3
              </span>
            </p>
            <p
              className="scripture display"
              style={{
                fontSize: 'clamp(1.2rem, 2.2vw, 1.4rem)',
                lineHeight: 1.4,
                borderLeftColor: 'var(--gold-2)',
                color: 'rgba(246,239,222,0.92)',
              }}
            >
              "You will receive power when the Holy Spirit comes on you; and you will be my
              witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth."
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
                Acts 1:8
              </span>
            </p>
          </div>

          <div
            style={{
              marginTop: '4rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <button
              onClick={onShare}
              className="btn-gold sc"
              style={{
                fontSize: 11,
                padding: '1rem 1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: 'inherit',
              }}
            >
              <Share2 size={14} /> Pass it on to someone
            </button>
            <button
              onClick={onBack}
              className="sc"
              style={{
                fontSize: 11,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--gold-2)',
                background: 'transparent',
                border: 0,
                cursor: 'pointer',
                minHeight: 44,
                padding: '0.75rem 0',
                fontFamily: 'inherit',
              }}
            >
              Walk the seven steps again
            </button>
          </div>

          <p
            className="display fade"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 2.8vw, 1.9rem)',
              lineHeight: 1.4,
              marginTop: '5rem',
              color: 'var(--gold-2)',
            }}
          >
            Go. The kingdom is at hand.
          </p>
        </div>
      </section>
    </div>
  );
}
