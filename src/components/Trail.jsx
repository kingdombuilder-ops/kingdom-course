/* =============================================================================
   src/components/Trail.jsx — The Gate's "The Trail" + Davidic blueprint section.

   Static section, no props. Anchor id="trail" so the Prologue's "Follow the
   trail" CTA can scroll-target it via href="#trail".

   Three movements within the section:
     1. The trail of supernatural evidence concentrating in one tradition
     2. "The Blueprint" — 11-row grid showing Davidic kingdom → Catholic
        Church type-fulfillment correspondences
     3. CTA to enter the nine circles (anchored to #circles)

   Migrated from the_kingdom.jsx line ~6985. Tailwind classes converted to
   inline styles per project convention.

   No props.
   ============================================================================= */

import { ArrowRight } from 'lucide-react';

const BLUEPRINT_ROWS = [
  ['The King',         'Christ'],
  ['The Queen Mother', 'Mary'],
  ['The Prime Minister', 'The Pope'],
  ['The Officials',    'The Bishops'],
  ['The Priests',      'The Catholic Priesthood'],
  ['The Covenant',     'The Eucharist'],
  ['The Temple',       'The Church'],
  ['The Ark',          'The Tabernacle'],
  ['The Sacrifice',    'The Mass'],
  ['The Holy City',    'The Universal Church'],
  ['The Twelve Tribes', 'The Twelve Apostles'],
];

export default function Trail() {
  return (
    <section
      id="trail"
      className="paper-bg"
      style={{
        position: 'relative',
        paddingTop: 'clamp(6rem, 10vw, 9rem)',
        paddingBottom: 'clamp(6rem, 10vw, 9rem)',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div className="ornament" style={{ marginBottom: '2.5rem' }}>
          <span className="sc">The Trail</span>
        </div>
        <h2
          className="display-strong"
          style={{
            fontSize: 'clamp(2.1rem, 5.2vw, 3.8rem)',
            lineHeight: 1.04,
            marginBottom: '2.5rem',
            fontWeight: 600,
          }}
        >
          Every civilization has touched it.{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--gold-3)' }}>
            One received the full truth.
          </span>
        </h2>

        <p
          className="body-lede dropcap"
          style={{
            fontSize: 'clamp(1.18rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          Every civilization that has ever existed has left behind a record of the supernatural.
          The Egyptians embalmed their dead. The Greeks heard the Oracle. The Romans recorded
          prodigies. The Hindus, the Buddhists, the Aboriginal peoples of every continent — all
          built their cultures on the conviction that the visible world is pressed upon by an
          invisible one.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          The modern West is the first civilization in human history to deny this. Every other
          civilization that has ever existed would consider us insane.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          But this course is not an argument for the supernatural in general. Every culture has
          reported that. This course is about something more specific, and more explosive.
        </p>

        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.4rem, 2.6vw, 1.75rem)',
            lineHeight: 1.4,
            margin: '2.5rem 0',
            color: 'var(--wine)',
          }}
        >
          Only one tradition has produced a body of supernatural evidence that is scientifically
          investigable.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          Eucharistic hosts that transform into identifiable human cardiac tissue. A garment five
          hundred years old bearing an image no technology can reproduce. A burial cloth encoded
          with three-dimensional information and photographic negativity four centuries before the
          camera. Seventy-two medically verified healings at a single shrine, investigated by
          panels of physicians including unbelievers. Hundreds of bodies that have not decayed.
          Men and women who lived for decades consuming only a wafer of bread.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          And here is what should stop you cold: the evidence is not scattered across the religious
          landscape of the world. It clusters. It concentrates. It converges on a single tradition,
          a single institution, a single set of claims.
        </p>

        <p
          className="display"
          style={{
            fontSize: 'clamp(1.35rem, 2.4vw, 1.6rem)',
            lineHeight: 1.4,
            margin: '2.5rem 0',
            color: 'var(--ink)',
          }}
        >
          It converges on the Catholic Church.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
            lineHeight: 1.7,
            color: 'var(--ink-2)',
          }}
        >
          Not because nothing miraculous has ever occurred elsewhere — other traditions have their
          testimonies. But the density, the variety, the investigability, and above all the{' '}
          <em>structural coherence</em> of the Catholic evidence is without parallel in human
          history. The miracles are not random. They map onto the structure of the kingdom. They
          illuminate its offices. They reveal its architecture.
        </p>

        <div className="ornament" style={{ margin: '3.5rem 0' }}>
          <span className="sc">The Blueprint</span>
        </div>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          Two thousand years before Jesus was born, God established a prototype of his kingdom in
          the monarchy of David. It was not a random arrangement. It was a constitutional order — a
          set of offices and liturgies carefully designed to prefigure what would come.
        </p>

        <div
          className="body"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
            columnGap: '2rem',
            rowGap: '0.5rem',
            margin: '2.5rem 0',
            maxWidth: '40rem',
            fontSize: 'clamp(1rem, 1.6vw, 1.05rem)',
            color: 'var(--ink-2)',
          }}
        >
          {BLUEPRINT_ROWS.map(([a, b]) => (
            <div
              key={a}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--line)',
                padding: '0.5rem 0',
              }}
            >
              <span style={{ fontStyle: 'italic' }}>{a}</span>
              <ArrowRight size={12} style={{ color: 'var(--gold)' }} />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            color: 'var(--ink-2)',
          }}
        >
          This is not a list of metaphors. It is a constitutional correspondence. And here is what
          makes the miracles so remarkable: the supernatural evidence clusters around the very
          elements the blueprint predicted. Eucharistic miracles confirm the new ark. Marian
          apparitions confirm the Queen Mother's role. The papacy's survival confirms the steward's
          office. The saints' miracles confirm the kingdom's transforming power.
        </p>

        <p
          className="display"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 2.8vw, 1.9rem)',
            lineHeight: 1.4,
            margin: '2rem 0',
            color: 'var(--wine)',
          }}
        >
          Now. Follow the trail.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem' }}>
          <a
            href="#circles"
            className="btn-ghost sc"
            style={{
              fontSize: 10,
              padding: '0.75rem 1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              fontFamily: 'inherit',
            }}
          >
            Enter the nine circles <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
