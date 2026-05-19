/* =============================================================================
   src/components/FloatingCompanion.jsx — Floating Action Button.

   Fixed bottom-right "Ask" button that opens the Companion panel. Visible
   on all tabs as an alternative entry point to the AI assistant (the
   primary entry is the "Ask" button in KingdomTabNav's right actions).

   Hidden text on narrow viewports — only the icon shows; on wider
   viewports the "Ask" label appears.

   Migrated from the_kingdom.jsx line ~6155. Tailwind classes converted to
   inline styles. Custom CSS classes preserved (btn-gold, sc-bold).

   Props:
     onClick() — invoked when tapped (typically opens the Companion)
   ============================================================================= */

import { MessageCircleMore } from 'lucide-react';

export default function FloatingCompanion({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open Companion"
      title="Ask"
      className="btn-gold sc-bold"
      style={{
        position: 'fixed',
        // Respect iOS safe-area-inset-bottom so the FAB rises above the
        // home-indicator zone on notched iPhones (env() falls back to 0
        // when unset; on non-iOS the effective bottom remains 1.5rem).
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
        right: '1.5rem',
        zIndex: 30,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        fontSize: 10,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
        fontFamily: 'inherit',
      }}
    >
      <MessageCircleMore size={15} />
      <span className="nav-label">Ask</span>
    </button>
  );
}
