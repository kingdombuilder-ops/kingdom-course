/* =============================================================================
   src/components/Companion.jsx — The Kingdom Course Companion chat panel.

   Slide-in right panel with message history and a textarea for user input.
   Companion is "tab-aware" — the system prompt is parameterized by which
   tab the visitor is on, so the assistant can meet them where they are
   (Gospel — apologetic; Course — formation; Kingdom — daily practice).

   Two modes via the `apiEndpoint` prop:

     1. API mode (apiEndpoint provided) — POSTs to the given endpoint with
        the messages array + system prompt + tab context. Expected response
        shape matches Anthropic's /v1/messages: { content: [{ type, text }] }
        from which we extract text blocks.

     2. Stub mode (apiEndpoint omitted) — replies with a friendly placeholder
        explaining the Companion is being prepared. Lets the panel ship now
        with full UI without committing to an API key handling strategy.

   Keyboard:
     Enter (no shift) → send
     Shift+Enter      → newline

   Migrated from the_kingdom.jsx line ~6039. Tailwind classes converted to
   inline styles. Custom CSS classes preserved (paper-bg, modal-enter,
   sc-bold, sc, display, body, btn-gold).

   Note on the original implementation: source called the Anthropic API
   directly from the browser with no API key in the request. This works
   only inside Anthropic's artifact runtime (where a key is injected by
   the host), not in production. A real deployment needs either a proxy
   server with a server-held key, or a different model provider. The
   `apiEndpoint` prop is the integration point for whichever wins.

   Props:
     open          — bool. Returns null when false.
     onClose()     — invoked by the X button + backdrop click
     currentTab    — "gate" | "course" | "kingdom" — feeds tab context
                     into the system prompt
     apiEndpoint   — optional URL string. If provided, Companion POSTs
                     messages to this endpoint expecting an Anthropic-shaped
                     response. If omitted, Companion runs in stub mode.
   ============================================================================= */

import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';

const TAB_LABEL = {
  gate: 'The Gospel',
  course: 'The Course',
  kingdom: 'The Kingdom',
};

const COMPANION_SYSTEM_BASE = `You are the Kingdom Course Companion — a warm, reverent guide walking beside every visitor to kingdomcourse.org. The site has three tabs: The Gospel (a Catholic apologetic — Nine Circles of evidence converging on the Resurrection — the door for seekers), The Course (a 50-day Walk to Pentecost in seven steps: SEE, KNOW, HEAL, ABIDE, GO, BUILD, SEND), and The Kingdom (a daily Mass-anchored hub for the formed Catholic, including the Field Guide of Catholic practices). You speak with warmth, never pressure. You meet people where they are. Salus animarum suprema lex — the salvation of souls is the supreme law.`;

const STUB_REPLY = "Thank you for asking. The Companion is being prepared — soon I'll be able to walk with you through any question. For now, the Field Guide and the Course readings have most of what you might be looking for. Salus animarum suprema lex.";

export default function Companion({ open, onClose, currentTab, apiEndpoint }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Welcome. I'm here to walk with you — at the Gospel, through the Seven Steps, or wherever you are in your journey. There are no wrong questions.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

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

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const next = [...messages, { role: 'user', content: msg }];
    setMessages(next);
    setInput('');
    setLoading(true);

    const tabContext = currentTab && TAB_LABEL[currentTab]
      ? `\n\nThe visitor is currently on the ${TAB_LABEL[currentTab]} tab.`
      : '';

    if (!apiEndpoint) {
      // Stub mode — small synthetic delay so it feels real
      setTimeout(() => {
        setMessages([...next, { role: 'assistant', content: STUB_REPLY }]);
        setLoading(false);
      }, 450);
      return;
    }

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: COMPANION_SYSTEM_BASE + tabContext,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = Array.isArray(data.content)
        ? data.content
            .filter((b) => b.type === 'text')
            .map((b) => b.text)
            .join('\n')
            .trim()
        : "I'm sorry — something disturbed our conversation. Try again in a moment.";
      setMessages([...next, { role: 'assistant', content: reply || '…' }]);
    } catch {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content:
            "I'm sorry — I couldn't reach you just now. Try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
          {messages.map((m, i) => (
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
                  ...(m.role === 'user'
                    ? { color: 'var(--ink)' }
                    : {
                        background: 'var(--paper-2)',
                        color: 'var(--ink)',
                        border: '1px solid var(--line-soft)',
                      }),
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
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

        {/* Input */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--line)',
          }}
        >
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
      </div>
    </div>
  );
}
