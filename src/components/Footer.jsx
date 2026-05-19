/* =============================================================================
   src/components/Footer.jsx — Bottom navigation chrome.

   Four-column footer (collapses to single column on narrow):
     1. Brand mark + tagline (spans 2 columns on wide)
     2. "Walk" — three tab links (Gospel · Course · Kingdom)
     3. "Reference" — Field Guide link + Academy (locked, future)

   Bottom row: copyright + Latin motto.

   Migrated from the_kingdom.jsx line ~5983. Tailwind classes converted to
   inline styles per project convention.

   Props:
     onTab(id)         — invoked by Walk-column links ("gate" | "course" | "kingdom")
     onOpenFieldGuide()— invoked by Field Guide link in Reference column
   ============================================================================= */

import { Lock } from 'lucide-react';

export default function Footer({ onTab, onOpenFieldGuide }) {
  const year = new Date().getFullYear();

  const linkStyle = {
    background: 'transparent',
    border: 0,
    cursor: 'pointer',
    padding: 0,
    color: 'var(--ink-2)',
    fontFamily: 'inherit',
    textAlign: 'left',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease',
  };

  const onLinkHover = (e) => {
    e.currentTarget.style.color = 'var(--gold-3)';
  };
  const onLinkLeave = (e) => {
    e.currentTarget.style.color = 'var(--ink-2)';
  };

  return (
    <footer
      className="paper-bg-2"
      style={{
        borderTop: '1px solid var(--line)',
        marginTop: '4rem',
      }}
    >
      <div
        style={{
          maxWidth: '64rem',
          margin: '0 auto',
          padding: '3rem clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Brand block — spans 2 columns on wide */}
          <div style={{ gridColumn: 'span 2' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="var(--gold)" strokeWidth="1" />
                <circle cx="20" cy="20" r="12" fill="none" stroke="var(--gold)" strokeWidth="1" />
                <circle cx="20" cy="20" r="6" fill="none" stroke="var(--gold)" strokeWidth="1" />
                <circle cx="20" cy="20" r="2" fill="var(--wine)" />
              </svg>
              <span className="sc-bold" style={{ fontSize: 11, color: 'var(--ink)' }}>
                The Kingdom
              </span>
            </div>
            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                maxWidth: '28rem',
                color: 'var(--ink-2)',
              }}
            >
              A doorway to the kingdom of heaven. The Gospel meets you. The Course forms you. The
              Kingdom holds you. The path of the saints, made walkable.
            </p>
          </div>

          {/* Walk column */}
          <div>
            <p
              className="sc-bold"
              style={{ fontSize: 10, marginBottom: '0.75rem', color: 'var(--gold-3)' }}
            >
              Walk
            </p>
            <ul
              className="body"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: 'var(--ink-2)',
              }}
            >
              <li>
                <button
                  onClick={() => onTab && onTab('gate')}
                  style={linkStyle}
                  onMouseEnter={onLinkHover}
                  onMouseLeave={onLinkLeave}
                >
                  The Gospel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTab && onTab('course')}
                  style={linkStyle}
                  onMouseEnter={onLinkHover}
                  onMouseLeave={onLinkLeave}
                >
                  The Course
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTab && onTab('kingdom')}
                  style={linkStyle}
                  onMouseEnter={onLinkHover}
                  onMouseLeave={onLinkLeave}
                >
                  The Kingdom
                </button>
              </li>
            </ul>
          </div>

          {/* Reference column */}
          <div>
            <p
              className="sc-bold"
              style={{ fontSize: 10, marginBottom: '0.75rem', color: 'var(--gold-3)' }}
            >
              Reference
            </p>
            <ul
              className="body"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: 'var(--ink-2)',
              }}
            >
              <li>
                <button
                  onClick={onOpenFieldGuide}
                  style={linkStyle}
                  onMouseEnter={onLinkHover}
                  onMouseLeave={onLinkLeave}
                >
                  The Field Guide
                </button>
              </li>
              <li>
                <span
                  style={{
                    color: 'var(--mute)',
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  The Academy <Lock size={11} style={{ marginTop: -2 }} />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--line-soft)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <p className="sc" style={{ fontSize: 10, color: 'var(--mute)' }}>
  © {year} · The Kingdom Course
  {' · '}
  <a
    href="/privacy"
    style={{ color: 'var(--mute)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}
    onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = 'var(--gold-3)')}
    onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
  >
    Privacy
  </a>
  {' · '}
  <a
    href="/terms"
    style={{ color: 'var(--mute)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}
    onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = 'var(--gold-3)')}
    onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
  >
    Terms
  </a>
</p>
          <p
            className="display"
            style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--gold-3)' }}
          >
            Salus animarum suprema lex.
          </p>
        </div>

        {/* Methodology mark — per FINAL_CONTENT_REVISION_PLAN §4.4 and
            STRATEGIC_ARCHITECTURE Appendix E. Links to the /methodology
            page where the AI methodology hard lines are published in full.

            TODO — restore the omitted credentialing beats when each is
            actually true, not before:
              · "Citation-verified"      add when engineered citation
                                          verification + spot-check log
                                          land (CLAUDE.md §6 feature 6;
                                          "build before Companion ships")
              · "Theologically reviewed" add when the named theological
                                          advisory (CLAUDE.md §3) has
                                          reviewed and signed off on the
                                          content corpus
            False credentialing claims, if discovered, retroactively
            undermine the surviving beats. Beats are only added back
            with the receipts. */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--line)',
            textAlign: 'center',
          }}
        >
          <a
            href="/methodology"
            className="sc-bold"
            style={{
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'var(--gold-3)',
              textDecoration: 'none',
            }}
          >
            AI-presented · Magisterium-grounded
          </a>
        </div>
      </div>
    </footer>
  );
}
