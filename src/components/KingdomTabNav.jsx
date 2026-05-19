/* =============================================================================
   src/components/KingdomTabNav.jsx — Production tab navigation header.

   Sticky header with three elements:
     - Brand mark (concentric rings + wine center, links to "gate")
     - Three tabs: The Gospel · The Course · The Kingdom
     - Right actions: Pass it on (share) · Ask (companion) · Sign in/out

   The brand mark's hover-rotate is a quiet flourish. The active tab gets
   a thin gold underline; inactive tabs are muted.

   This is the production replacement for the dev shell's 4-way preview
   toggle. App.jsx will swap in this header once the chrome layer ships.

   Migrated from the_kingdom.jsx line ~5898. Tailwind classes converted to
   inline styles per project convention. Custom CSS classes preserved
   (paper-bg, sc-bold, sc, btn-gold, btn-ghost).

   Tab IDs: "gate" | "course" | "kingdom" — note that internally the
   Gospel tab is keyed as "gate" since it IS the gate. The label is
   "The Gospel" but the routing key is "gate".

   Props:
     tab            — current tab id ("gate" | "course" | "kingdom")
     onTab(id)      — invoked when a tab button is tapped
     currentUser    — { name?, email? } | null — drives Sign in/out toggle
     onSignOut()    — invoked by Sign out button (when currentUser is set)
     onShare()      — invoked by "Pass it on" button (omitted if not provided)
     onOpenCompanion() — invoked by "Ask" button
     onOpenSignup()    — invoked by "Sign in" button (when no currentUser);
                         omitted to fall back to onTab("course") — preserves
                         the legacy behavior for callers that don't yet have
                         a signup modal wired
   ============================================================================= */

import { MessageCircleMore, Share2, LogIn, LogOut } from 'lucide-react';

// Tab base labels (the "The " prefix is rendered separately so it can
// hide on mobile via .tab-prefix — see src/styles/index.css).
const TAB_LABEL = {
  gate: 'Gospel',
  course: 'Course',
  kingdom: 'Kingdom',
};

const TABS = ['gate', 'course', 'kingdom'];

export default function KingdomTabNav({
  tab,
  onTab,
  currentUser,
  onSignOut,
  onShare,
  onOpenCompanion,
  onOpenSignup,
}) {
  return (
    <header
      className="paper-bg"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        className="nav-bar"
        style={{
          maxWidth: '64rem',
          margin: '0 auto',
          padding: '1rem clamp(1.5rem, 3vw, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand mark */}
        <button
          onClick={() => onTab && onTab('gate')}
          aria-label="The Kingdom — home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexShrink: 0,
            background: 'transparent',
            border: 0,
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.transform = 'rotate(0deg)';
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 40 40"
            style={{ transition: 'transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1)' }}
          >
            <circle cx="20" cy="20" r="18" fill="none" stroke="var(--gold)" strokeWidth="1" />
            <circle cx="20" cy="20" r="12" fill="none" stroke="var(--gold)" strokeWidth="1" />
            <circle cx="20" cy="20" r="6" fill="none" stroke="var(--gold)" strokeWidth="1" />
            <circle cx="20" cy="20" r="2" fill="var(--wine)" />
          </svg>
          <span
            className="sc-bold nav-label"
            style={{ fontSize: 10, color: 'var(--ink)' }}
          >
            The Kingdom
          </span>
        </button>

        {/* Three tabs */}
        <nav
          role="tablist"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.25rem, 1vw, 0.5rem)',
          }}
        >
          {TABS.map((id) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTab && onTab(id)}
                className="sc-bold"
                style={{
                  position: 'relative',
                  padding: '0.5rem clamp(0.75rem, 1.5vw, 1rem)',
                  fontSize: 'clamp(10px, 1.4vw, 11px)',
                  color: isActive ? 'var(--ink)' : 'var(--mute)',
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease',
                }}
              >
                <span className="tab-prefix">The </span>{TAB_LABEL[id]}
                {isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: '0.5rem',
                      right: '0.5rem',
                      height: 2,
                      background: 'var(--gold)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {onShare && (
            <button
              onClick={onShare}
              className="btn-ghost sc"
              aria-label="Pass it on"
              title="Pass it on"
              style={{
                fontSize: 10,
                padding: '0.5rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit',
              }}
            >
              <Share2 size={13} /> <span className="nav-label">Pass it on</span>
            </button>
          )}
          <button
            onClick={onOpenCompanion}
            className="btn-gold sc"
            aria-label="Ask the Companion"
            title="Ask"
            style={{
              fontSize: 10,
              padding: '0.5rem 0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
            }}
          >
            <MessageCircleMore size={13} /> <span className="nav-label">Ask</span>
          </button>
          {currentUser ? (
            <button
              onClick={onSignOut}
              className="btn-ghost sc"
              aria-label="Sign out"
              title={`Signed in as ${currentUser.name || currentUser.email}`}
              style={{
                fontSize: 10,
                padding: '0.5rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit',
              }}
            >
              <LogOut size={13} /> <span className="nav-label">Sign out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onOpenSignup) onOpenSignup();
                else if (onTab) onTab('course');
              }}
              className="btn-ghost sc"
              aria-label="Sign in"
              title="Sign in"
              style={{
                fontSize: 10,
                padding: '0.5rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit',
              }}
            >
              <LogIn size={13} /> <span className="nav-label">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
