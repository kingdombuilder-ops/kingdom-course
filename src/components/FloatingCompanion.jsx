/* =============================================================================
   src/components/FloatingCompanion.jsx — Companion launcher, mobile FAB.

   Fixed bottom-right floating action button that opens the Companion panel.
   This is the MOBILE entry point: on desktop the launcher is the "Ask"
   button in KingdomTabNav's right actions, but at ≤768px that row is too
   crowded (brand + tabs + actions) for "Ask" to be findable. Bottom-right
   is where eyes are trained to look for a chat affordance.

   Visibility is owned by the `.companion-fab` CSS class (index.css): hidden
   on desktop, shown at ≤768px — the same single launcher, switched by media
   query, not a second toggle surface (open/close state lives in App.jsx).
   The caller hides it while the panel is open. 56px touch target (Apple
   HIG); rises above the iOS home indicator via the safe-area inset.

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
      className="btn-gold companion-fab"
      style={{
        position: 'fixed',
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        right: '16px',
        zIndex: 40, // above page content, below the open panel (z-index 50)
        width: 56,
        height: 56,
        borderRadius: '50%',
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
        fontFamily: 'inherit',
      }}
    >
      <MessageCircleMore size={22} />
    </button>
  );
}
