/* =============================================================================
   src/components/Prologue.jsx — The Gate's "Prologue — The Message" section.

   Static section, no props — long-form editorial copy framing the kingdom
   as Christ's central announcement. Anchor id="message" so the Hero's
   "Begin with the message" button can scroll-target it via href="#message".

   Migrated from the_kingdom.jsx line ~6902. Tailwind classes converted to
   inline styles per project convention. Custom CSS classes preserved
   (paper-bg, ornament, sc, display-strong, body-lede, dropcap, body,
   btn-ghost).

   No props.
   ============================================================================= */

import { ArrowRight } from 'lucide-react';

export default function Prologue() {
  return (
    <section
      id="message"
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
          <span className="sc">Prologue — The Message</span>
        </div>

        <h2
          className="display-strong"
          style={{
            fontSize: 'clamp(2.3rem, 5.6vw, 4.2rem)',
            lineHeight: 1.02,
            marginBottom: '3rem',
            fontWeight: 600,
          }}
        >
          Christ did not come to teach a philosophy.
          <span
            style={{
              display: 'block',
              fontStyle: 'italic',
              marginTop: '0.5rem',
              color: 'var(--gold-3)',
            }}
          >
            He came to inaugurate a kingdom.
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
          The very first words of Jesus's public ministry were these:{' '}
          <em style={{ fontSize: '1.05em' }}>
            "The time is fulfilled, and the kingdom of God is at hand."
          </em>{' '}
          It was the heart of every parable he told. It was the last subject he discussed with his
          apostles before ascending into glory. From Gabriel's announcement at Nazareth to the
          descent of fire at Pentecost, one reality was being established — and one reality only.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.15rem, 1.9vw, 1.22rem)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
            color: 'var(--ink-2)',
          }}
        >
          Most of what passes for Christianity today has forgotten this. We have been taught that
          the gospel is a private arrangement: believe certain things, behave a certain way, and
          one day go to heaven. That is not what Christ preached. He preached that heaven had come
          down. That the reign of God had broken into history. That a kingdom — visible, structured,
          sacramental, expanding — had been inaugurated in his own person and would not stop until
          it filled the earth.
        </p>

        <p
          className="display-strong"
          style={{
            fontStyle: 'italic',
            fontSize: 'clamp(1.6rem, 2.8vw, 2rem)',
            lineHeight: 1.4,
            margin: '3rem 0',
            color: 'var(--wine)',
            fontWeight: 500,
          }}
        >
          This is the single most consequential announcement in the history of the world.
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
          It is not one Christian doctrine among many. It is the doctrine that contains all the
          others. The Incarnation is the King taking flesh. The Cross is the King taking his
          throne. The Resurrection is the King vindicated. The Church is the Kingdom on earth. The
          Eucharist is the King's table. The saints are the King's court. The sacraments are the
          King's instruments.{' '}
          <em style={{ fontSize: '1.05em' }}>
            Salvation itself is naturalization into the kingdom of God.
          </em>{' '}
          To miss this is to miss what Christ actually did.
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
          And this kingdom is a life — a life of God's own being, shared. Not merely a moral
          improvement project. Not merely the promise of heaven after death. Both at once: heaven
          begun on earth, and earth completed in heaven. It begins in baptism, deepens in the
          Eucharist, matures in the communion of saints, and consummates when the veil is fully
          drawn back and the King is seen face to face.{' '}
          <em style={{ fontSize: '1.05em' }}>
            "I came that they may have life, and have it abundantly,"
          </em>{' '}
          Christ said. And later, in his great prayer to the Father:{' '}
          <em style={{ fontSize: '1.05em' }}>
            "This is eternal life — that they may know you, the only true God, and Jesus Christ
            whom you have sent."
          </em>{' '}
          The Son and the Father, known together — one God, one life. This is that life. The gate
          into it is open to every soul.
        </p>

        <p
          className="body"
          style={{
            fontSize: 'clamp(1.1rem, 1.85vw, 1.18rem)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            color: 'var(--ink-2)',
          }}
        >
          And because this life does not end at death, the evidence for it does not end at death
          either. The kingdom leaves its trail across history — and the trail continues beyond the
          grave. Saints who died centuries ago still heal. Still appear. Still intercede. Their
          bodies, in hundreds of verified cases, refuse to decay. The kingdom is verified, yes —
          but more astonishing still, the life within it is verified. Eternal life — unbroken,
          active, alive — is the most thoroughly investigated claim humanity has ever possessed.
        </p>

        <div className="ornament" style={{ margin: '3.5rem 0' }}>
          <span className="sc">What follows</span>
        </div>

        <p
          className="display"
          style={{
            fontSize: 'clamp(1.35rem, 2.4vw, 1.6rem)',
            lineHeight: 1.4,
            color: 'var(--ink)',
          }}
        >
          That trail is what this course follows.
          <span
            style={{
              display: 'block',
              fontStyle: 'italic',
              marginTop: '0.75rem',
              color: 'var(--wine)',
            }}
          >
            Begin where the kingdom begins.
          </span>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem' }}>
          <a
            href="#trail"
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
            Follow the trail <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
