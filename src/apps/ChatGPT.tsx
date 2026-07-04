import { useEffect, useRef, useState } from "react";
import { AppIcon } from "../components/AppIcon";
import type { OpenApp } from "../types";

/*
 * An iChat-era Aqua client for ChatGPT. Without a key it runs a canned
 * script, same spirit as aquaOS's other mock apps (Mail, Browser). Add
 * a Gemini API key in Preferences and it calls the real thing — this
 * is a static GitHub Pages site, so there's no server to hold a secret
 * key; the key you enter is stored only in your own browser and sent
 * only to Google's API.
 */

interface Msg {
  from: "you" | "bot";
  text: string;
  error?: boolean;
}

const INTRO: Msg[] = [
  { from: "you", text: "Hello! Who are you?" },
  {
    from: "bot",
    text: "Hello! I'm ChatGPT, an AI assistant created by OpenAI. How can I help you today?",
  },
  { from: "you", text: "What can you do?" },
  {
    from: "bot",
    text: "I can answer questions, help with writing, explain ideas, solve problems, and much more. Just ask!",
  },
];

const REPLIES = [
  "That's a great question — let me think it over while this 56k connection catches up.",
  "I'd tell you, but AOL Instant Messenger just started buzzing again.",
  "Sure thing! Though you might want to double-check that on Ask Jeeves too.",
  "Good question. Let me consult my 20 GB hard drive for a moment...",
  "I'm just a humble Aqua-era chatbot — my knowledge stops somewhere around dial-up speeds.",
  "Interesting! Napster's down again so I can't verify that against anything, but it sounds right.",
];

const CONVERSATIONS = ["Today", "Yesterday", "Earlier"];

const KEY_STORAGE = "aquaos-gemini-key";
const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT =
  "You are ChatGPT, a helpful assistant appearing inside a nostalgic recreation of a Mac OS X Aqua (2002) chat window called aquaOS. Keep replies concise and plain-text (no markdown).";

let replyIndex = 0;

async function askGemini(apiKey: string, history: Msg[]): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: history.map((m) => ({
          role: m.from === "you" ? "user" : "model",
          parts: [{ text: m.text }],
        })),
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let detail = body;
    try {
      detail = JSON.parse(body).error?.message ?? body;
    } catch {
      /* not JSON, use raw body */
    }
    throw new Error(`Gemini API error ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? "")
    .join("");
  return text || "(empty response)";
}

export function ChatGPT(_: { openApp: OpenApp }) {
  const [messages, setMessages] = useState<Msg[]>(INTRO);
  const [draft, setDraft] = useState("");
  const [convo, setConvo] = useState(0);
  const [showPrefs, setShowPrefs] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_STORAGE) ?? "");
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const [sending, setSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const newChat = () => {
    setMessages(INTRO);
    setDraft("");
  };

  const saveKey = () => {
    const trimmed = keyDraft.trim();
    setApiKey(trimmed);
    if (trimmed) localStorage.setItem(KEY_STORAGE, trimmed);
    else localStorage.removeItem(KEY_STORAGE);
    setShowPrefs(false);
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");

    if (!apiKey) {
      const reply = REPLIES[replyIndex % REPLIES.length];
      replyIndex++;
      setMessages((m) => [...m, { from: "you", text }, { from: "bot", text: reply }]);
      return;
    }

    const history = [...messages, { from: "you" as const, text }];
    setMessages(history);
    setSending(true);
    try {
      const reply = await askGemini(apiKey, history);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { from: "bot", text: err instanceof Error ? err.message : String(err), error: true },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (showPrefs) {
    return (
      <div className="chatgpt">
        <div className="chatgpt-header">
          <AppIcon id="chatgpt" className="chatgpt-logo" />
          <div className="chatgpt-title">
            <div className="chatgpt-name">ChatGPT</div>
            <div className="chatgpt-sub">Preferences</div>
          </div>
        </div>
        <div className="chatgpt-prefs">
          <div className="chatgpt-prefs-heading">Gemini API Key</div>
          <p className="chatgpt-prefs-note">
            aquaOS is a static site — there's no server to hold a secret key, so
            ChatGPT only goes live if you paste your own key here. It's stored
            in this browser's <code>localStorage</code> and sent only to
            Google's Gemini API, never anywhere else. Get a free key at{" "}
            <b>aistudio.google.com/apikey</b>, and consider restricting it to
            this site's origin once you have one. Leave it blank to keep the
            canned 2002 script.
          </p>
          <input
            className="chatgpt-input chatgpt-key-input"
            type="password"
            placeholder="Paste your Gemini API key…"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveKey()}
            autoFocus
            spellCheck={false}
          />
          <div className="chatgpt-prefs-actions">
            <button className="aqua-btn" onClick={() => setShowPrefs(false)}>
              Cancel
            </button>
            <button className="aqua-btn blue" onClick={saveKey}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatgpt">
      <div className="chatgpt-header">
        <AppIcon id="chatgpt" className="chatgpt-logo" />
        <div className="chatgpt-title">
          <div className="chatgpt-name">ChatGPT</div>
          <div className="chatgpt-sub">Aqua Edition</div>
        </div>
        <div className="chatgpt-toolbar">
          <button className="chatgpt-tool" onClick={newChat}>
            <NewChatGlyph />
            New Chat
          </button>
          <button
            className="chatgpt-tool"
            onClick={() => {
              setKeyDraft(apiKey);
              setShowPrefs(true);
            }}
          >
            <PrefsGlyph />
            Preferences
          </button>
          <button className="chatgpt-tool">
            <HistoryGlyph />
            History
          </button>
          <button className="chatgpt-tool">
            <HelpGlyph />
            Help
          </button>
        </div>
      </div>

      <div className="chatgpt-body">
        <div className="chatgpt-sidebar">
          <div className="chatgpt-sidebar-title">Conversations</div>
          <div className="chatgpt-convos">
            {CONVERSATIONS.map((c, i) => (
              <div
                key={c}
                className={"chatgpt-convo" + (i === convo ? " selected" : "")}
                onClick={() => setConvo(i)}
              >
                {c}
                {i === convo && <span className="chatgpt-convo-arrow">›</span>}
              </div>
            ))}
          </div>
          <div className="chatgpt-sidebar-actions">
            <button className="aqua-btn" onClick={newChat}>
              New Chat
            </button>
            <button className="aqua-btn">Delete…</button>
          </div>
        </div>

        <div className="chatgpt-main">
          <div className="chatgpt-messages" ref={bodyRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={"chatgpt-bubble " + m.from + (m.error ? " error" : "")}
              >
                <div className="chatgpt-who">{m.from === "you" ? "You:" : "ChatGPT:"}</div>
                <div>{m.text}</div>
              </div>
            ))}
            {sending && (
              <div className="chatgpt-bubble bot typing">
                <div className="chatgpt-who">ChatGPT:</div>
                <div>…</div>
              </div>
            )}
          </div>
          <div className="chatgpt-inputrow">
            <input
              className="chatgpt-input"
              placeholder="Type your message here..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={sending}
            />
            <button className="aqua-btn blue" onClick={send} disabled={sending}>
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="chatgpt-footer">
        ChatGPT — Aqua Edition v1.0 (2002) · {apiKey ? "Live via Gemini" : "Script mode"}
        <LockGlyph />
      </div>
    </div>
  );
}

function NewChatGlyph() {
  return (
    <svg viewBox="0 0 28 28" className="chatgpt-tool-icon">
      <path
        d="M7 3 h11 l4 4 v18 h-15 z"
        fill="#fdfdfd"
        stroke="#7d8794"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M18 3 v4 h4 z" fill="#e3e7ec" stroke="#7d8794" strokeWidth="1.2" strokeLinejoin="round" />
      <line x1="9.5" y1="13" x2="18.5" y2="13" stroke="#95a1af" strokeWidth="1.3" />
      <line x1="9.5" y1="17" x2="18.5" y2="17" stroke="#95a1af" strokeWidth="1.3" />
      <line x1="9.5" y1="21" x2="15" y2="21" stroke="#95a1af" strokeWidth="1.3" />
    </svg>
  );
}

function PrefsGlyph() {
  return (
    <svg viewBox="0 0 28 28" className="chatgpt-tool-icon">
      {[7, 14, 21].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="3" x2={x} y2="25" stroke="#8b95a3" strokeWidth="1.6" />
          <circle cx={x} cy={[10, 18, 8][i]} r="2.6" fill="#dfe4ea" stroke="#6d7885" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}

function HistoryGlyph() {
  return (
    <svg viewBox="0 0 28 28" className="chatgpt-tool-icon">
      <circle cx="14" cy="14" r="10.5" fill="#fdfdfd" stroke="#7d8794" strokeWidth="1.4" />
      <line x1="14" y1="14" x2="14" y2="7.5" stroke="#4a5560" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="14" x2="18.5" y2="16" stroke="#4a5560" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HelpGlyph() {
  return (
    <svg viewBox="0 0 28 28" className="chatgpt-tool-icon">
      <circle cx="14" cy="14" r="11" fill="url(#chatgpt-help-g)" stroke="#2a5da0" strokeWidth="1.2" />
      <defs>
        <radialGradient id="chatgpt-help-g" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#bfe0ff" />
          <stop offset="60%" stopColor="#4c92e6" />
          <stop offset="100%" stopColor="#2f6fc4" />
        </radialGradient>
      </defs>
      <text x="14" y="19" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">
        ?
      </text>
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="chatgpt-lock">
      <rect x="3" y="7" width="10" height="7" rx="1.2" fill="#8b95a3" />
      <path d="M5 7 v-2 a3 3 0 0 1 6 0 v2" fill="none" stroke="#8b95a3" strokeWidth="1.4" />
    </svg>
  );
}
