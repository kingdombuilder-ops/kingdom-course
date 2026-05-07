/* =============================================================================
   src/modals/AddIntentionModal.jsx — "Whose name will you carry?"

   The smallest modal. A two-field form (Who, optional intention text) that
   appends to the user's intentions list. Carried into v7 from the_kingdom.jsx
   line ~9856 with no behavioral changes.

   Pattern this modal establishes for the rest of the migration:
     - Backdrop click closes (onClick on outer div)
     - Inner content stops propagation (onClick={e => e.stopPropagation()})
     - Aria-labelled close X in the corner
     - Submit disabled until a `who` name is present
     - Generates a stable id on submit (Date.now() — fine until Supabase wires
       in real UUIDs)

   Props:
     onAdd({ id, who, what })  — caller persists the new intention
     onClose()                 — caller hides the modal
   ============================================================================= */

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function AddIntentionModal({ onAdd, onClose }) {
  const [who, setWho] = useState('');
  const [what, setWhat] = useState('');

  const handleAdd = () => {
    if (!who.trim()) return;
    onAdd({ id: Date.now(), who: who.trim(), what: what.trim() });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="paper-bg"
        style={{
          maxWidth: '28rem', width: '100%', padding: '2rem',
          border: '1px solid var(--line)', position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            padding: '0.5rem', background: 'transparent', border: 0, cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        <div className="ornament" style={{ maxWidth: '12rem', marginBottom: '1.25rem' }}>
          <span className="sc-bold" style={{ fontSize: 11 }}>Add a name</span>
        </div>

        <h3 className="display-strong" style={{ fontSize: '1.6rem', lineHeight: 1.15, marginBottom: '1rem', fontWeight: 600 }}>
          Whose name will you carry?
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          <label className="sc" style={{ fontSize: 10, color: 'var(--gold-3)', display: 'block', marginBottom: '0.5rem' }}>
            Who
          </label>
          <input
            type="text"
            autoFocus
            value={who}
            onChange={(e) => setWho(e.target.value)}
            placeholder="A name, a soul..."
            style={{
              width: '100%', padding: '0.75rem 1rem',
              border: '1px solid var(--line)',
              background: 'rgba(255,255,255,0.5)',
              fontFamily: 'EB Garamond, serif', fontSize: '1rem', outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="sc" style={{ fontSize: 10, color: 'var(--gold-3)', display: 'block', marginBottom: '0.5rem' }}>
            The intention <span style={{ color: 'var(--mute)', opacity: 0.6 }}>(optional)</span>
          </label>
          <input
            type="text"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            placeholder="For her healing. For his return. For peace."
            style={{
              width: '100%', padding: '0.75rem 1rem',
              border: '1px solid var(--line)',
              background: 'rgba(255,255,255,0.5)',
              fontFamily: 'EB Garamond, serif', fontSize: '1rem', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onClose} className="btn-ghost sc" style={{ fontSize: 10, padding: '0.625rem 1rem', flex: 1 }}>
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!who.trim()}
            className="btn-gold sc-bold"
            style={{
              fontSize: 10, padding: '0.625rem 1.25rem', flex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            <Plus size={12} /> Add to my intentions
          </button>
        </div>
      </div>
    </div>
  );
}
