/* =============================================================================
   src/modals/AwakenToTheDay.jsx — SEE · The day's awakening.

   The first essential's modal. One-minute set-up before the day begins:
     - Today's saint (from CHURCH_TODAY.feast)
     - The Holy Father's monthly intention (from CHURCH_TODAY.papalIntention)
     - The expectation question (where do you expect to meet Christ today?)
     - The Morning Offering prayer

   Migrated from the_kingdom.jsx line ~11213 with two corrections:

     1. The papal-intention section had a hardcoded H3 reading "For migrants
        and refugees." That was correct only for one historical month —
        intentions rotate monthly, and the LITURGICAL_PAPAL_INTENTIONS_2026
        data already provides text that begins with the recipient ("For
        workers...", "For families..."). The hardcoded H3 went stale
        immediately when intentions rotated. Replaced with the month name
        (intention.month), which is meaningful, never goes stale, and lets
        the intention text speak for itself.

     2. The attribution line read `{intention.issuer} · {intention.month}`,
        but `issuer` is not a field on the papal-intention data shape (see
        liturgical.js — only `month` and `text` exist). The reference
        rendered as `undefined · April`. Removed the issuer half.

   Props:
     onComplete()  — caller marks essential I complete and closes
     onClose()     — caller closes without marking complete
   ============================================================================= */

import { X, Eye, Check } from 'lucide-react';
import { CHURCH_TODAY } from '@data';

export default function AwakenToTheDay({ onComplete, onClose }) {
  const feast = CHURCH_TODAY.feast;
  const intention = CHURCH_TODAY.papalIntention;

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
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="6"  fill="none" stroke="var(--gold-2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="2"  fill="var(--wine)" />
            </svg>
            <div>
              <div className="sc-bold" style={{ fontSize: 10, color: 'var(--paper)' }}>
                Awaken to the Day
              </div>
              <div className="body" style={{ fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(246,239,222,0.55)' }}>
                SEE · 1 min
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
        <div className="fade-in">
          {/* Hero — eye disc + today's date in liturgical voice. */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div
                className="breathe"
                style={{
                  width: 76, height: 76, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(154,68,35,0.10)',
                  border: '2px solid #9A4423',
                  boxShadow: '0 0 28px rgba(154,68,35,0.35)',
                }}
              >
                <Eye size={28} style={{ color: '#9A4423' }} />
              </div>
            </div>
            <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: '#9A4423' }}>
              Step 1 · SEE
            </div>
            <h1
              className="display-strong"
              style={{ fontSize: 'clamp(1.85rem, 4.2vw, 2.6rem)', lineHeight: 1.06, marginBottom: '0.75rem', fontWeight: 600 }}
            >
              {CHURCH_TODAY.weekday}, {CHURCH_TODAY.date}.
            </h1>
            <p
              className="display"
              style={{ fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--gold-2)' }}
            >
              {CHURCH_TODAY.season} · {CHURCH_TODAY.liturgicalDate}
            </p>
            <div style={{ height: 1, margin: '1.5rem auto 0', maxWidth: '5rem', background: 'var(--gold-2)' }} />
          </div>

          <p
            className="body-lede"
            style={{
              fontSize: 'clamp(1.02rem, 1.7vw, 1.1rem)',
              lineHeight: 1.7,
              maxWidth: '32rem',
              margin: '0 auto 2.5rem',
              textAlign: 'center',
              color: 'rgba(246,239,222,0.82)',
            }}
          >
            Before the day pulls you forward, set its kingdom-quality. This is not your day.
            It belongs to him.
          </p>

          {/* Today's saint */}
          <div className="see-section">
            <div className="see-label">Today the Church remembers</div>
            <h3
              className="display-strong"
              style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.7rem)', lineHeight: 1.15, marginBottom: '0.375rem', fontWeight: 600 }}
            >
              {feast.name}
            </h3>
            <div
              className="body"
              style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'rgba(246,239,222,0.6)', marginBottom: '0.75rem' }}
            >
              {feast.years}
            </div>
            <p
              className="body"
              style={{ fontSize: '1rem', lineHeight: 1.55, color: 'rgba(246,239,222,0.85)', marginBottom: '0.875rem' }}
            >
              {feast.line}
            </p>
            <div style={{ borderLeft: '2px solid var(--gold-2)', paddingLeft: '0.875rem', marginTop: '0.875rem' }}>
              <p
                className="display"
                style={{ fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.5, color: 'rgba(246,239,222,0.88)' }}
              >
                "{feast.verse}"
              </p>
              <p className="sc" style={{ fontSize: 9, marginTop: '0.375rem', color: 'var(--gold-2)' }}>
                {feast.verseRef}
              </p>
            </div>
          </div>

          {/* Today's papal intention. The H3 uses the month name (always
              accurate) instead of the source's hardcoded recipient line
              (only correct for one month). The intention.text already
              opens with the recipient. */}
          <div className="see-section">
            <div className="see-label">Today the Holy Father asks the Church to pray</div>
            <h3
              className="display-strong"
              style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.4rem)', lineHeight: 1.2, marginBottom: '0.625rem', fontWeight: 600 }}
            >
              {intention.month} · The Pope's monthly intention
            </h3>
            <p
              className="body"
              style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'rgba(246,239,222,0.82)' }}
            >
              {intention.text}
            </p>
          </div>

          {/* The expectation question */}
          <div className="see-section">
            <div className="see-label">A question to carry into the day</div>
            <p
              className="display"
              style={{ fontStyle: 'italic', fontSize: 'clamp(1.2rem, 2.4vw, 1.5rem)', lineHeight: 1.4, color: 'rgba(246,239,222,0.92)' }}
            >
              Where do you expect to meet Christ today?
            </p>
            <p
              className="body"
              style={{ fontStyle: 'italic', fontSize: '0.92rem', marginTop: '0.75rem', color: 'rgba(246,239,222,0.55)' }}
            >
              You don't need to answer here. Just hold the question. He will arrive.
            </p>
          </div>

          {/* The Morning Offering. Wine left bar (deeper than gold) so this
              section reads as the offering itself rather than another piece
              of context. */}
          <div className="see-section" style={{ borderLeftColor: 'var(--wine)', marginTop: '2rem' }}>
            <div className="see-label" style={{ color: 'var(--wine)' }}>The Morning Offering</div>
            <p
              className="display"
              style={{ fontStyle: 'italic', fontSize: 'clamp(1.05rem, 1.8vw, 1.18rem)', lineHeight: 1.55, color: 'rgba(246,239,222,0.88)' }}
            >
              O Jesus, through the Immaculate Heart of Mary, I offer you my prayers, works,
              joys, and sufferings of this day for all the intentions of your Sacred Heart,
              in union with the holy sacrifice of the Mass throughout the world. Amen.
            </p>
            <p
              className="body"
              style={{ fontStyle: 'italic', fontSize: '0.85rem', marginTop: '0.625rem', color: 'rgba(246,239,222,0.5)' }}
            >
              The Apostleship of Prayer — given to the Church by the Jesuits in 1844.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
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
              <Check size={14} /> The day is offered. Begin.
            </button>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.92rem',
                maxWidth: '26rem',
                margin: '1rem auto 0',
                color: 'rgba(246,239,222,0.55)',
              }}
            >
              Now go into it. He goes with you.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
