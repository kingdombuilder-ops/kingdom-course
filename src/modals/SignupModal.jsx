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
  googleHandler,
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
              Fifty days.
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

          {/* Google OAuth — one-tap path. Clerk handles the redirect to
              Google's consent screen (showing "Sign in to Kingdom Course"
              thanks to the OAuth credentials configured in Google Cloud)
              and the callback. Renders only when a googleHandler is wired. */}
          {googleHandler && (
            <>
              <button
                type="button"
                onClick={googleHandler}
                disabled={submitting}
                className="sc"
                style={{
                  fontSize: 11,
                  padding: '0.875rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid var(--line)',
                  color: 'var(--ink)',
                  cursor: submitting ? 'default' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                  fontFamily: 'inherit',
                  letterSpacing: '0.18em',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  marginBottom: '1.5rem',
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.background = 'var(--paper-2)';
                    e.currentTarget.style.borderColor = 'var(--gold-3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--line)';
                }}
                aria-label="Continue with Google"
              >
                {/* Google logo as inline SVG — keeps the brand mark crisp
                    at any size without an extra asset request. */}
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider — "or with email" centered on a hairline rule.
                  The line is split into two flexed spans so the text sits
                  in the gap rather than overlapping. */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                <span
                  className="sc"
                  style={{
                    fontSize: 10,
                    color: 'var(--gold-3)',
                    letterSpacing: '0.2em',
                  }}
                >
                  or with email
                </span>
                <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              </div>
            </>
          )}

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
