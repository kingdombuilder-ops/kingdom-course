/* =============================================================================
   src/shared/CopyButton.jsx — A simple copy-to-clipboard button.

   Used by the Hub's GO essential to surface "Copy invitation" and "Copy
   Gospel verse" affordances inline. Likely to be needed by other surfaces
   later (Course "Sending" view, share sheets), so it lives in @shared.

   Behavior: tapping copies `text` via navigator.clipboard.writeText, then
   flips the button label to "Copied" with a Check icon for 2 seconds.

   Migrated from the_kingdom.jsx line ~8986 with no behavior changes. The
   defensive `typeof navigator !== "undefined"` guard is preserved for SSR
   safety even though Vite renders in the browser — it costs nothing and
   protects against future server-render scenarios.
   ============================================================================= */

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ text, label = 'Copy', color = '#B8915C' }) {
  const [copied, setCopied] = useState(false);

  const onClick = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <button
      onClick={onClick}
      className="sc"
      style={{
        fontSize: 9,
        padding: '0.5rem 0.875rem',
        border: '1px solid ' + color,
        background: 'transparent',
        color,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        minHeight: 44,
        letterSpacing: '0.18em',
        fontFamily: 'inherit',
      }}
    >
      {copied ? (
        <>
          <Check size={11} /> Copied
        </>
      ) : (
        <>
          <Copy size={11} /> {label}
        </>
      )}
    </button>
  );
}
