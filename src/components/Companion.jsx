/* =============================================================================
   src/components/Companion.jsx — The Kingdom Course Companion chat panel.

   Slide-in right panel with message history and a textarea for input, wired
   to the live Companion backend (api/companion.js) over SSE.

   BACKEND CONTRACT (api/companion.js):
     POST /api/companion
       headers: Authorization: Bearer <Clerk JWT>
       body:    { messages: [{role, content}, ...], tab }
     The server owns the model, the system prompt, max_tokens, the crisis
     pre-filter (§5.3) and rate limiting (§5.4). The frontend sends only the
     real conversation turns + the current tab.

   RESPONSE, three shapes:
     1. SSE 200 — Anthropic events forwarded raw. We consume `content_block_
        delta` text deltas and stream them into the assistant bubble live,
        ending on `message_stop`.
     2. SSE 200, single `event: crisis` frame {category, text} — the §5.3
        short-circuit. Rendered as a distinct wine-accented resource card,
        never a normal bubble. The backend never calls Anthropic in this case.
     3. JSON non-2xx — 401 (unauthenticated), 429 (rate limited, with
        retry_after), 400/502/etc. Rendered as a gentle error note.

   `tab` uses the §5.5 vocabulary ('gospel' | 'course' | 'hub' | 'field-guide'
   | 'academy'); the backend accepts it now and Commit 6 will consume it with
   no frontend change.

   Props:
     open            — bool. Returns null when false (state persists).
     onClose()       — X button + backdrop click.
     apiEndpoint     — backend URL. Omit for the dev stub fallback.
     tab             — §5.5 tab string, sent in the request body.
     onRequestSignIn — opens the sign-in/up modal; the Companion requires a
                       signed-in user (CLAUDE.md auth gating).
   ============================================================================= */

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import { Send, X } from 'lucide-react';

const STUB_REPLY =
  "Thank you for asking. The Companion is being prepared — soon I'll be able to walk with you through any question. Salus animarum suprema lex.";

const GENERIC_ERROR =
  "I'm sorry — something disturbed our conversation. Please try again in a moment.";

const INTRO = {
  role: 'assistant',
  kind: 'intro',
  content:
    "Welcome. I'm here to walk with you — at the Gospel, through the Seven Steps, or wherever you are in your journey. There are no wrong questions.",
};

/* Parse one SSE frame ("event: <type>\ndata: <json>") into { event, data }. */
function parseFrame(frame) {
  let event = null;
  let dataStr = '';
  for (const line of frame.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataStr += line.slice(5).trim();
  }
  let data = null;
  if (dataStr) {
    try { data = JSON.parse(dataStr); } catch { /* ignore malformed frame */ }
  }
  return { event, data };
}

export default function Companion({ open, onClose, apiEndpoint, tab, onRequestSignIn }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [messages, setMessages] = useState([INTRO]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);   // request in flight
  const [streaming, setStreaming] = useState(false); // first token has arrived
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, streaming]);

  // Lock body scroll while open.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [open]);

  // Closing the panel mid-stream aborts the request: it stops the upstream
  // Anthropic call server-side (the backend's cancel() handler) so we don't
  // pay for tokens nobody reads, and releases the client-side reader.
  useEffect(() => {
    if (!open && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setLoading(false);
      setStreaming(false);
    }
  }, [open]);

  // Abort on unmount.
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  if (!open) return null;

  const consumeStream = async (body) => {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let acc = '';
    let started = false;

    const finalize = () => { setLoading(false); setStreaming(false); };

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const { event, data } = parseFrame(frame);
        if (!event) continue;

        if (event === 'crisis') {
          // §5.3 short-circuit. Distinct card; tagged `kind:'crisis'` so it
          // is EXCLUDED from the next request's context — otherwise the model
          // would see its own resource handoff as prior dialogue and could
          // double down on a normal follow-up. Clean off-ramp, not a state.
          setMessages((p) => [
            ...p,
            { role: 'assistant', kind: 'crisis', category: data?.category, content: data?.text || GENERIC_ERROR },
          ]);
          finalize();
          return;
        }

        if (event === 'error') {
          if (!started) {
            setMessages((p) => [...p, { role: 'assistant', kind: 'error', content: GENERIC_ERROR }]);
          }
          finalize();
          return;
        }

        if (
          event === 'content_block_delta' &&
          data?.delta?.type === 'text_delta' &&
          typeof data.delta.text === 'string'
        ) {
          acc += data.delta.text;
          if (!started) {
            started = true;
            setStreaming(true);
            setMessages((p) => [...p, { role: 'assistant', content: acc }]);
          } else {
            setMessages((p) => {
              const c = p.slice();
              c[c.length - 1] = { role: 'assistant', content: acc };
              return c;
            });
          }
        }

        if (event === 'message_stop') {
          finalize();
          return;
        }
      }
    }
    finalize();
  };

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    if (isLoaded && !isSignedIn) return; // gated; composer is hidden anyway

    const userMsg = { role: 'user', content: msg };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    setStreaming(false);

    // API messages = real turns only. Synthetic messages (intro, crisis,
    // error) carry a `kind` and are stripped — see the crisis note above.
    const apiMessages = history
      .filter((m) => !m.kind)
      .map((m) => ({ role: m.role, content: m.content }));

    // Dev stub fallback (production always passes apiEndpoint).
    if (!apiEndpoint) {
      setTimeout(() => {
        setMessages([...history, { role: 'assistant', content: STUB_REPLY }]);
        setLoading(false);
      }, 450);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token = await getToken();
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: apiMessages, tab }),
        signal: controller.signal,
      });

      if (!res.ok) {
        // Errors come back as JSON, not SSE.
        let payload = {};
        try { payload = await res.json(); } catch { /* non-JSON body */ }
        let content = GENERIC_ERROR;
        if (res.status === 429) {
          const mins = Math.max(1, Math.round((payload.retry_after || 3600) / 60));
          content = `You've reached the limit for now. Please try again in about ${mins} minute${mins === 1 ? '' : 's'}.`;
        } else if (res.status === 401) {
          content = 'Please sign in to walk with the Companion.';
        }
        setMessages((p) => [...p, { role: 'assistant', kind: 'error', content }]);
        setLoading(false);
        return;
      }

      await consumeStream(res.body);
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setMessages((p) => [
          ...p,
          { role: 'assistant', kind: 'error', content: "I'm sorry — I couldn't reach you just now. Please try again shortly." },
        ]);
      }
      setLoading(false);
      setStreaming(false);
    } finally {
      abortRef.current = null;
    }
  };

  const gated = isLoaded && !isSignedIn;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="paper-bg modal-enter"
        style={{
          width: '100%',
          maxWidth: '28rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid var(--line)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p className="sc-bold" style={{ fontSize: 10, color: 'var(--gold-3)' }}>
              The Companion
            </p>
            <p
              className="display"
              style={{
                fontStyle: 'italic',
                fontSize: '1.1rem',
                marginTop: '0.125rem',
                color: 'var(--ink)',
              }}
            >
              Walk with me.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              color: 'var(--ink)',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message history */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {messages.map((m, i) => {
            if (m.kind === 'crisis') {
              // Distinct resource card (wine tokens --wine / --wine-2). Action
              // lines (the '•' bullets — 988, someone present, parish priest)
              // are bolded in wine so the phone numbers are findable at a glance.
              return (
                <div key={i} role="alert" style={{ display: 'flex' }}>
                  <div
                    className="body"
                    style={{
                      width: '100%',
                      padding: '1rem 1.1rem',
                      background: 'var(--paper-2)',
                      border: '1px solid var(--wine-2)',
                      borderLeft: '4px solid var(--wine)',
                      color: 'var(--ink)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                    }}
                  >
                    <p className="sc-bold" style={{ fontSize: 10, color: 'var(--wine)', marginBottom: '0.6rem' }}>
                      Please reach out now
                    </p>
                    {m.content.split('\n').map((line, j) => {
                      const action = line.trim().startsWith('•');
                      return (
                        <p
                          key={j}
                          style={{
                            margin: line.trim() === '' ? '0.35rem 0' : '0.2rem 0',
                            fontWeight: action ? 600 : 400,
                            color: action ? 'var(--wine)' : 'var(--ink)',
                          }}
                        >
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (m.kind === 'error') {
              return (
                <div key={i} style={{ display: 'flex' }}>
                  <div
                    className="body"
                    style={{
                      maxWidth: '85%',
                      padding: '0.6rem 0.9rem',
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                      color: 'var(--mute)',
                      borderLeft: '3px solid var(--line)',
                      background: 'transparent',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  className={'body ' + (m.role === 'user' ? 'btn-gold' : '')}
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    fontSize: '0.96rem',
                    lineHeight: 1.6,
                    // User text is plain — preserve their newlines. Assistant
                    // text is markdown (the model emits ##, **, lists, etc.),
                    // rendered via ReactMarkdown so block structure carries
                    // its own spacing (no pre-wrap, which would double it).
                    whiteSpace: m.role === 'user' ? 'pre-wrap' : 'normal',
                    ...(m.role === 'user'
                      ? { color: 'var(--ink)' }
                      : {
                          background: 'var(--paper-2)',
                          color: 'var(--ink)',
                          border: '1px solid var(--line-soft)',
                        }),
                  }}
                >
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <div className="companion-md">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {loading && !streaming && (
            <div
              className="sc"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 10,
                color: 'var(--mute)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--gold-3)',
                  animation: 'pulse 1.6s ease-in-out infinite',
                }}
              />
              Listening…
            </div>
          )}
        </div>

        {/* Composer — or the sign-in gate for signed-out visitors */}
        {gated ? (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
            <p className="body" style={{ fontSize: '0.92rem', color: 'var(--ink)', marginBottom: '0.85rem', lineHeight: 1.6 }}>
              The Companion walks with those who have signed in.
            </p>
            <button
              onClick={() => onRequestSignIn?.()}
              className="btn-gold sc"
              style={{ fontSize: 11, padding: '0.7rem 1.4rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Sign in to begin
            </button>
          </div>
        ) : (
          <div style={{ padding: '1rem', borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask anything…"
                style={{
                  flex: 1,
                  resize: 'none',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.95rem',
                  background: 'var(--paper-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--ink)',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
                className="body"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="btn-gold sc"
                style={{
                  fontSize: 10,
                  padding: '0.75rem 1rem',
                  opacity: !input.trim() || loading ? 0.4 : 1,
                  cursor: !input.trim() || loading ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                }}
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
