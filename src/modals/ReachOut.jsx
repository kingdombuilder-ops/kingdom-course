/* =============================================================================
   src/modals/ReachOut.jsx — SEND · Today's apostolic turn.

   Surfaces TODAY_SEND (which is aliased to TODAY_GO under the new GO/SEND
   semantics in prompts.js — see prompts.js header). The component branches
   on whether today's prompt is "apostolic" (Pray for / Speak…) or
   "relational" (Reach out / Notice the silent…), and shows a different
   Gospel verse + closing line accordingly.

   Migrated from the_kingdom.jsx line ~11664 with no behavioral changes.
   The dark-mode treatment (ink background, paper text) is retained — this
   modal is one of the most visually distinct in the app and that treatment
   is part of how SEND signals the day's outward turn.

   Props:
     onComplete()  — caller marks essential VII complete and closes
     onClose()     — caller closes without marking complete
   ============================================================================= */

import { X, Crown, Check } from 'lucide-react';
import { TODAY_SEND } from '@data';

export default function ReachOut({ onComplete, onClose }) {
  const prompt = TODAY_SEND;
  // Branch heuristic: if the prompt's primary line opens with "Pray for"
  // or "Speak", it's an apostolic turn (kerygma / intercession). Otherwise
  // it's a relational reach (call someone, notice the silent, etc.).
  const isApostolic =
    prompt.primary.startsWith('Pray for') || prompt.primary.startsWith('Speak');

  return (
    <div
      className="ink-bg"
      style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', color: 'var(--paper)' }}
    >
      <header
        className="ink-bg"
        style={{ position: 'sticky', top: 0, zIndex: 30, borderBottom: '1px solid var(--line-dark)' }}
      >
        <div
          style={{
            maxWidth: '44rem', margin: '0 auto', padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="22" height="22" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#3D3450" strokeWidth="1" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="#3D3450" strokeWidth="1" />
              <circle cx="20" cy="20" r="6"  fill="none" stroke="#3D3450" strokeWidth="1" />
              <circle cx="20" cy="20" r="2"  fill="var(--gold-2)" />
            </svg>
            <div>
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--paper)' }}>
                Today's Apostolic Act
              </div>
              <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                GO · 5–10 min
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ padding: '0.5rem', background: 'transparent', border: 0, cursor: 'pointer', borderRadius: '50%' }}
          >
            <X size={16} style={{ color: 'rgba(246,239,222,0.7)' }} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '44rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div className="send-icon-disc">
              <Crown size={36} style={{ color: '#9080AC' }} />
            </div>
          </div>

          <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.625rem', color: '#9080AC' }}>
            Step 7 · SEND · {isApostolic ? "Today's apostolic turn" : "Today's reach"}
          </div>

          <h1
            className="display-strong"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
              lineHeight: 1.08,
              marginBottom: '1rem',
              fontWeight: 600,
            }}
          >
            {prompt.primary}
          </h1>

          <div style={{ height: 1, margin: '0 auto 2rem', maxWidth: '5rem', background: '#9080AC' }} />

          <p
            className="body-lede"
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.18rem)',
              lineHeight: 1.7,
              maxWidth: '32rem',
              margin: '0 auto 2.5rem',
              color: 'rgba(246,239,222,0.85)',
            }}
          >
            {prompt.detail}
          </p>

          {/* The Gospel anchor — branches on apostolic vs. relational. */}
          <div
            style={{
              borderLeft: '2px solid #9080AC',
              padding: '0.5rem 0 0.5rem 1rem',
              margin: '0 auto 2.5rem',
              maxWidth: '30rem',
              textAlign: 'left',
            }}
          >
            {isApostolic ? (
              <>
                <p
                  className="display"
                  style={{ fontStyle: 'italic', fontSize: '1.08rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.88)' }}
                >
                  "Go therefore and make disciples of all nations… and lo, I am with you always, to the close of the age."
                </p>
                <p className="sc" style={{ fontSize: 9, marginTop: '0.5rem', color: '#9080AC' }}>
                  Matthew 28:19–20
                </p>
              </>
            ) : (
              <>
                <p
                  className="display"
                  style={{ fontStyle: 'italic', fontSize: '1.08rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.88)' }}
                >
                  "Truly, I say to you, as you did it to one of the least of these my brethren, you did it to me."
                </p>
                <p className="sc" style={{ fontSize: 9, marginTop: '0.5rem', color: '#9080AC' }}>
                  Matthew 25:40
                </p>
              </>
            )}
          </div>

          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              maxWidth: '30rem',
              margin: '0 auto 2.5rem',
              color: 'rgba(246,239,222,0.6)',
            }}
          >
            {isApostolic
              ? 'Witness precedes proclamation. The truth you have been given is meant to be given again — not as argument, but as gift.'
              : 'Modern man listens more willingly to witnesses than to teachers, said Pope Paul VI. Today — be the witness.'}
          </p>

          <button
            onClick={() => onComplete && onComplete()}
            className="btn-gold sc-bold"
            style={{
              fontSize: 11,
              padding: '1rem 2rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              minHeight: 48,
            }}
          >
            <Check size={14} /> {isApostolic ? 'I will do this. Amen.' : 'I will reach out. Amen.'}
          </button>
          <p
            className="body"
            style={{
              fontStyle: 'italic',
              fontSize: '0.92rem',
              maxWidth: '28rem',
              margin: '1rem auto 0',
              color: 'rgba(246,239,222,0.55)',
            }}
          >
            The kingdom does not extend through programs. It extends through people. Through you. Today.
          </p>
        </div>
      </main>
    </div>
  );
}
