/* =============================================================================
   src/modals/PassItOn.jsx — The "Pass it on" share modal.

   Small centered modal with a single "Copy link" button. On copy, the
   button changes to "Copied" with a check icon for 2 seconds.

   Migrated from the_kingdom.jsx line ~6168. Tailwind classes converted to
   inline styles. Custom CSS classes preserved (paper-bg, modal-enter,
   display, body, btn-gold, sc).

   Reads the current URL via window.location.href (with SSR guard).
   Copies via navigator.clipboard.writeText. If clipboard API isn't
   available, falls back to no-op (the button still shows but doesn't
   change state — graceful degradation).

   Props:
     open      — bool — whether the modal is open. Returns null when false.
     onClose() — invoked by the X button + backdrop click
   ============================================================================= */

import { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';

export default function PassItOn({ open, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const url = typeof window !== 'undefined' ? window.location.href : 'https://kingdomcourse.org';

  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="paper-bg modal-enter"
        style={{
          width: '100%',
          maxWidth: '28rem',
          border: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p
            className="display"
            style={{ fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--ink)' }}
          >
            Pass it on.
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: '0.25rem',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              color: 'var(--ink)',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <p
            className="body"
            style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--ink-2)' }}
          >
            One soul, walking. Send it to whoever the Spirit brings to mind.
          </p>
          <button
            onClick={copy}
            className="btn-gold sc"
            style={{
              width: '100%',
              fontSize: 11,
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
            }}
          >
            {copied ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Copy size={14} /> Copy link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
