/* =============================================================================
   src/modals/SignupModal.jsx — Signup overlay for entering the Course.

   Three-field form: email (required), name (optional), parish (optional).
   Frontend-validated (email needs @ and .). Submit is async — shows
   "Beginning…" while the submit handler is in flight. On success, calls
   onSuccess(user) where user is { email, name?, parish?, signedUpAt }.

   Two operating modes via the `submitHandler` prop, mirroring Companion's
   API/stub pattern:

     1. API mode (submitHandler provided) — calls submitHandler({email,
        name, parish}) which is expected to return a Promise<user>. The
        submitHandler is the integration point for whichever auth provider
        ships first. Throws → error shown to user; resolves → onSuccess fires.

     2. Stub mode (submitHandler omitted) — synthesizes a user object
        client-side, persists it to localStorage under "kingdomCurrentUser",
        and resolves after a brief delay. Lets the modal land before any
        auth provider is wired.

   Migrated from the_kingdom.jsx line ~7609. Tailwind classes converted to
   inline styles per project convention. Custom CSS classes preserved
   (paper-bg, modal-enter, sc, sc-bold, display, display-strong, body,
   body-lede, btn-gold).

   The `intent` prop is preserved from source — the original code used
   it to skin the modal differently for "buy"/"give" intents but never
   shipped that distinction. Kept as a passthrough for future use.

   Props:
     open                — bool. Returns null when false.
     onClose()           — invoked by the X button + backdrop click
     onSuccess(user)     — invoked after a successful signup with the
                           user object: { email, name?, parish?, signedUpAt }
     intent              — optional string ("buy" | "give" | undefined),
                           preserved for future use
     submitHandler       — optional async ({email, name, parish}) => user
                           If provided, called on submit instead of the
                           localStorage stub. Throws → error shown. Resolves
                           → user object passed to onSuccess.
   ============================================================================= */

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const STORAGE_KEY = 'kingdomCurrentUser';

async function defaultStubHandler({ email, name, parish }) {
  // Synthesize a user object and persist it. This is dev-mode behavior;
  // a real auth provider replaces this via the submitHandler prop.
  const user = {
    email,
    name: name || null,
    parish: parish || null,
    signedUpAt: new Date().toISOString(),
  };
  // Persist locally so refresh keeps the user signed in
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore storage failures
    }
  }
  // Brief delay so the "Beginning…" state is visible
  await new Promise((resolve) => setTimeout(resolve, 250));
  return user;
}

export default function SignupModal({
  open,
  onClose,
  onSuccess,
  // eslint-disable-next-line no-unused-vars
  intent,
  submitHandler,
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [parish, setParish] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef(null);

  // Reset state each time the modal opens, focus the email field
  useEffect(() => {
    if (open) {
      setError('');
      setSubmitting(false);
      const t = setTimeout(() => emailRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [open]);

  if (!open) return null;

  const trySubmit = async () => {
    const e = email.trim();
    if (!e) {
      setError('An email is required to begin.');
      return;
    }
    if (!e.includes('@') || !e.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const handler = submitHandler || defaultStubHandler;
      const user = await handler({
        email: e,
        name: name.trim(),
        parish: parish.trim(),
      });
      if (onSuccess) onSuccess(user);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    trySubmit();
  };

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: '1px solid var(--line)',
    padding: '0.625rem 0.75rem',
    fontSize: '1rem',
    color: 'var(--ink)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    fontSize: 10,
    marginBottom: '0.375rem',
    display: 'block',
    color: 'var(--gold-3)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="paper-bg modal-enter"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '36rem',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--line)',
        }}
      >
        <div
          className="paper-bg"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            display: 'flex',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(6px)',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              margin: '0.5rem',
              padding: '0.5rem',
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              color: 'var(--ink)',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--paper-2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 3rem) clamp(3rem, 5vw, 3.5rem)',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="sc-bold" style={{ fontSize: 10, marginBottom: '0.5rem', color: 'var(--gold-3)' }}>
              The Kingdom Course
            </div>
            <div
              className="display"
              style={{
                fontStyle: 'italic',
                fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)',
                color: 'var(--gold-3)',
              }}
            >
              7 Essentials of the Kingdom of Heaven
            </div>
          </div>

          <h2
            className="display-strong"
            style={{
              fontSize: 'clamp(1.9rem, 5.2vw, 3rem)',
              lineHeight: 1.02,
              marginBottom: '1.25rem',
              fontWeight: 600,
            }}
          >
            Seven steps.
            <span style={{ display: 'block', fontStyle: 'italic', marginTop: '0.25rem', color: 'var(--gold-3)' }}>
              Forty-nine days.
            </span>
          </h2>

          <p
            className="body-lede"
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
              color: 'var(--ink-2)',
            }}
          >
            Two thousand years of Catholic formation, distilled into the path every saint walked —
            from Francis to Thérèse, from Aquinas to Padre Pio. Walked here, a reading a day, from
            anywhere on earth.
          </p>

          <p
            className="display"
            style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2vw, 1.2rem)',
              lineHeight: 1.5,
              marginBottom: '2.25rem',
              color: 'var(--wine)',
            }}
          >
            The standard is not information. The standard is fire.
          </p>

          <form onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="sc" style={labelStyle}>Email</label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="you@example.com"
                required
                disabled={submitting}
                autoComplete="email"
                className="body"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                }}
              />
            </div>
            <div>
              <label className="sc" style={labelStyle}>
                Your name{' '}
                <span
                  style={{
                    fontStyle: 'italic',
                    marginLeft: '0.25rem',
                    color: 'var(--mute)',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                  }}
                >
                  — so we can greet you
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                disabled={submitting}
                autoComplete="given-name"
                className="body"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                }}
              />
            </div>
            <div>
              <label className="sc" style={labelStyle}>
                Where you are starting from{' '}
                <span
                  style={{
                    fontStyle: 'italic',
                    marginLeft: '0.25rem',
                    color: 'var(--mute)',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                  }}
                >
                  — optional
                </span>
              </label>
              <input
                type="text"
                value={parish}
                onChange={(e) => setParish(e.target.value)}
                placeholder="A parish, a city, a season of life — whatever you want to share"
                disabled={submitting}
                className="body"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                }}
              />
            </div>

            {error && (
              <p
                className="body"
                style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--wine)' }}
                role="alert"
              >
                {error}
              </p>
            )}

            <div style={{ paddingTop: '0.75rem' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold sc"
                style={{
                  fontSize: 11,
                  padding: '0.875rem 1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {submitting ? (
                  'Beginning…'
                ) : (
                  <>
                    Begin the Course <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>

            <p
              className="body"
              style={{
                fontStyle: 'italic',
                fontSize: '0.85rem',
                marginTop: '1.25rem',
                color: 'var(--mute)',
              }}
            >
              Free, for every soul on earth. Your email is safe — unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Re-export the storage key so consumers can read the current user
// without having to know the literal key name.
export { STORAGE_KEY as SIGNUP_STORAGE_KEY };
