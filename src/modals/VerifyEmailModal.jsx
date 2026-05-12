/* =============================================================================
   src/modals/VerifyEmailModal.jsx — Email verification code overlay.

   Step 2 of the two-step Clerk signup flow. After SignupModal's
   submitHandler successfully calls signUp.create(), Clerk sends a
   6-digit verification code to the user's email. This modal collects
   that code and calls signUp.attemptEmailAddressVerification(), then
   hands the new sessionId to the parent via onVerified.

   Design follows SignupModal's visual language: paper background,
   same fonts, same gold accent, same close affordance.

   Props:
     open             — bool. Returns null when false.
     onClose()        — invoked by the X button + backdrop click
     onVerified(sid)  — invoked after successful verification with the
                        Clerk-issued sessionId. Parent should call
                        setActive({ session: sid }) to complete sign-in.
     signUp           — the Clerk signUp resource from useSignUp().
                        We accept it as a prop rather than calling
                        useSignUp() here so the verification stays
                        bound to the same signup attempt initiated
                        in SignupModal.
   ============================================================================= */
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

export default function VerifyEmailModal({ open, onClose, onVerified, signUp }) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const codeRef = useRef(null);

  // Reset state each time the modal opens, focus the code field
  useEffect(() => {
    if (open) {
      setCode('');
      setError('');
      setSubmitting(false);
      setResent(false);
      const t = setTimeout(() => codeRef.current?.focus(), 100);
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
    const c = code.trim();
    if (!c) {
      setError('Please enter the code we sent to your email.');
      return;
    }
    if (!/^\d{6}$/.test(c)) {
      setError('The code should be six digits.');
      return;
    }
    if (submitting) return;
    if (!signUp) {
      setError('The signup session has expired. Please close and try again.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: c });
      // Clerk returns the session id in either result.createdSessionId or
      // signUp.createdSessionId depending on flow state. Try both.
      const sessionId = result?.createdSessionId || signUp.createdSessionId;
      if (result?.status === 'complete' && sessionId) {
        if (onVerified) onVerified(sessionId);
      } else if (result?.status === 'complete') {
        // Status complete but no session id — let the parent handle it.
        // (Clerk's SDK auto-binds the session on setActive when null is passed
        // and a recent complete signUp exists.)
        if (onVerified) onVerified(null);
      } else {
        setError('Verification could not complete. Please close and try again.');
        setSubmitting(false);
      }
    } catch (err) {
      const message = err?.errors?.[0]?.message
        || 'That code did not match. Please check your email and try again.';
      setError(message);
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!signUp || resent) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setResent(true);
      setError('');
    } catch {
      setError('Could not resend the code. Please try again in a moment.');
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
    fontSize: '1.5rem',
    letterSpacing: '0.5rem',
    textAlign: 'center',
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
        zIndex: 75,
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
          maxWidth: '32rem',
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
              One step to begin
            </div>
          </div>

          <h2
            className="display-strong"
            style={{
              fontSize: 'clamp(1.7rem, 4.5vw, 2.5rem)',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
              fontWeight: 600,
            }}
          >
            Check your email.
          </h2>

          <p
            className="body-lede"
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
              color: 'var(--ink-2)',
            }}
          >
            We sent a six-digit code to the email you just entered. It should arrive within a
            minute. Enter the code below to begin the walk.
          </p>

          <form onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="sc" style={labelStyle}>Verification code</label>
              <input
                ref={codeRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  // Allow only digits
                  const next = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(next);
                  if (error) setError('');
                }}
                placeholder="• • • • • •"
                disabled={submitting}
                autoComplete="one-time-code"
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

            {resent && !error && (
              <p
                className="body"
                style={{ fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--gold-3)' }}
              >
                A new code is on its way.
              </p>
            )}

            <div style={{ paddingTop: '0.75rem' }}>
              <button
                type="submit"
                disabled={submitting || code.length !== 6}
                className="btn-gold sc"
                style={{
                  fontSize: 11,
                  padding: '0.875rem 1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  opacity: (submitting || code.length !== 6) ? 0.6 : 1,
                  cursor: (submitting || code.length !== 6) ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {submitting ? 'Verifying…' : (
                  <>
                    Begin <ArrowRight size={13} />
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
              Didn't get the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resent}
                style={{
                  background: 'transparent',
                  border: 0,
                  padding: 0,
                  color: 'var(--gold-3)',
                  cursor: resent ? 'default' : 'pointer',
                  textDecoration: resent ? 'none' : 'underline',
                  fontStyle: 'italic',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
              >
                {resent ? 'Sent.' : 'Send a new one.'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}