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
      className="btn-gold sc-bold"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
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
      <span
        style={{
          // Hide the label on narrow viewports — visually-hidden via media
          // query in CSS would be cleaner, but inline-style media queries
          // aren't supported. Compromise: show always; the FAB is small.
        }}
      >
        Ask
      </span>
    </button>
  );
}
