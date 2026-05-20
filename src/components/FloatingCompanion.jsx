/* =============================================================================
   src/components/FloatingCompanion.jsx — persistent Companion launcher (pill).

   Fixed bottom-right gold "Ask" pill (chat icon + label) that opens the
   Companion. Present on BOTH mobile and desktop, complementary to the
   top-nav "Ask" button:
     - top-nav launcher  → discoverable on first load (where eyes land);
     - this pill         → persistent during scroll, so a reader deep in
                           long Gospel/Course prose can reach the Companion
                           without scrolling back to the top.
   The Companion is the project's central differentiator, so an always-
   available, explicitly-labelled entry point is the right brand posture —
   an icon-only FAB makes users guess. The caller hides it while the panel
   is open. 44px touch target; rises above the iOS home indicator via the
   safe-area inset.

   (Restores the original pre-707b38a pill — retired as "redundant" — with
   the safe-area handling added. Replaces the circular icon-only FAB from
   Commit 7.1.)

   Props:
     onClick() — invoked when tapped (opens the Companion).
   ============================================================================= */

import { MessageCircleMore } from 'lucide-react';

export default function FloatingCompanion({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open the Companion"
      title="Ask the Companion"
      className="btn-gold sc-bold"
      style={{
        position: 'fixed',
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
        right: '1.5rem',
        zIndex: 40, // above page content, below the open panel (z-index 50)
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        minHeight: 44,
        padding: '0 1.15rem',
        fontSize: 11,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
        fontFamily: 'inherit',
      }}
    >
      <MessageCircleMore size={16} />
      <span>Ask</span>
    </button>
  );
}
