import { useEffect, useRef, useState } from "react";
import { AppIcon } from "../components/AppIcon";
import type { OpenApp } from "../types";

/*
 * An iChat-era Aqua client for ChatGPT. Without a key it runs a canned
 * script, same spirit as aquaOS's other mock apps (Mail, Browser). Add
 * a Gemini API key in Preferences and it calls the real thing. aquaOS
 * is a static GitHub Pages site, so there's no server to hold a secret
 * key; the key you enter is stored only in your own browser and sent
 * only to Google's API.
 */

interface Msg {
  from: "you" | "bot";
  text: string;
  error?: boolean;
}

interface Conversation {
  label: string;
  time: string;
  messages: Msg[];
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

const INITIAL_CONVOS: Conversation[] = [
  { label: "Today", time: "Just now", messages: INTRO },
  {
    label: "Yesterday",
    time: "Yesterday, 6:42 PM",
    messages: [
      { from: "you", text: "Can you help me set up my AirPort wireless network?" },
      {
        from: "bot",
        text: "Sure! Open System Preferences, choose Network, then AirPort. Enter your network name and WEP key, and you should be online in a minute.",
      },
      { from: "you", text: "What's WEP again?" },
      {
        from: "bot",
        text: "Wired Equivalent Privacy, the encryption standard everyone's using on wireless networks this year. Keep that key secret!",
      },
    ],
  },
  {
    label: "Earlier",
    time: "6/12/02, 11:15 AM",
    messages: [
      { from: "you", text: "Got any advice for using this new iPod?" },
      {
        from: "bot",
        text: "Keep FireWire handy for syncing, and remember the tagline: a thousand songs in your pocket.",
      },
      { from: "you", text: "How much does it hold again?" },
      {
        from: "bot",
        text: "5 gigabytes, which is more MP3s than anyone could reasonably need. For now.",
      },
    ],
  },
];

const REPLIES = [
  "That's a great question. Let me think it over while this 56k connection catches up.",
  "I'd tell you, but AOL Instant Messenger just started buzzing again.",
  "Sure thing! Though you might want to double-check that on Ask Jeeves too.",
  "Good question. Let me consult my 20 GB hard drive for a moment...",
  "I'm just a humble Aqua-era chatbot. My knowledge stops somewhere around dial-up speeds.",
  "Interesting! Napster's down again so I can't verify that against anything, but it sounds right.",
];

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
  const [convos, setConvos] = useState<Conversation[]>(INITIAL_CONVOS);
  const [active, setActive] = useState(0);
  const [draft, setDraft] = useState("");
  const [showPrefs, setShowPrefs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_STORAGE) ?? "");
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const [sending, setSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const messages = convos[active].messages;

  const updateMessages = (updater: (m: Msg[]) => Msg[]) => {
    setConvos((cs) => cs.map((c, i) => (i === active ? { ...c, messages: updater(c.messages) } : c)));
  };

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const newChat = () => {
    setConvos((cs) => cs.map((c, i) => (i === 0 ? { ...c, messages: INTRO, time: "Just now" } : c)));
    setActive(0);
    setDraft("");
  };

  const deleteConvo = () => {
    updateMessages(() => []);
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
      updateMessages((m) => [...m, { from: "you", text }, { from: "bot", text: reply }]);
      return;
    }

    const history = [...messages, { from: "you" as const, text }];
    updateMessages(() => history);
    setSending(true);
    try {
      const reply = await askGemini(apiKey, history);
      updateMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch (err) {
      updateMessages((m) => [
        ...m,
        { from: "bot", text: err instanceof Error ? err.message : String(err), error: true },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (showHistory) {
    return (
      <div className="chatgpt">
        <div className="chatgpt-header">
          <AppIcon id="chatgpt" className="chatgpt-logo" />
          <div className="chatgpt-title">
            <div className="chatgpt-name">ChatGPT</div>
            <div className="chatgpt-sub">History</div>
          </div>
        </div>
        <div className="chatgpt-history">
          {convos.map((c, i) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <div
                key={c.label}
                className="chatgpt-history-row"
                onClick={() => {
                  setActive(i);
                  setShowHistory(false);
                }}
              >
                <div className="chatgpt-history-meta">
                  <div className="chatgpt-history-label">{c.label}</div>
                  <div className="chatgpt-history-preview">
                    {last ? `${last.from === "you" ? "You: " : "ChatGPT: "}${last.text}` : "No messages yet."}
                  </div>
                </div>
                <span className="chatgpt-history-time">{c.time}</span>
              </div>
            );
          })}
        </div>
        <div className="chatgpt-prefs-actions" style={{ padding: "10px 14px" }}>
          <button className="aqua-btn blue" onClick={() => setShowHistory(false)}>
            Done
          </button>
        </div>
      </div>
    );
  }

  if (showHelp) {
    return (
      <div className="chatgpt">
        <div className="chatgpt-header">
          <AppIcon id="chatgpt" className="chatgpt-logo" />
          <div className="chatgpt-title">
            <div className="chatgpt-name">ChatGPT</div>
            <div className="chatgpt-sub">Help</div>
          </div>
        </div>
        <div className="chatgpt-prefs">
          <div className="chatgpt-prefs-heading">About ChatGPT Aqua Edition</div>
          <p className="chatgpt-prefs-note">
            New Chat clears today's conversation and switches to it. The
            Conversations list on the left, and the History browser above,
            both jump between Today, Yesterday, and Earlier. Delete… clears
            whichever conversation is currently open.
          </p>
          <p className="chatgpt-prefs-note">
            By default this runs a canned script from June 2002. Add a Gemini
            API key in Preferences to have it answer for real.
          </p>
          <div className="chatgpt-prefs-actions">
            <button className="aqua-btn blue" onClick={() => setShowHelp(false)}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            aquaOS is a static site, so there's no server to hold a secret
            key. ChatGPT only goes live if you paste your own key here. It's stored
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
          <button className="chatgpt-tool" onClick={() => setShowHistory(true)}>
            <HistoryGlyph />
            History
          </button>
          <button className="chatgpt-tool" onClick={() => setShowHelp(true)}>
            <HelpGlyph />
            Help
          </button>
        </div>
      </div>

      <div className="chatgpt-body">
        <div className="chatgpt-sidebar">
          <div className="chatgpt-sidebar-title">Conversations</div>
          <div className="chatgpt-convos">
            {convos.map((c, i) => (
              <div
                key={c.label}
                className={"chatgpt-convo" + (i === active ? " selected" : "")}
                onClick={() => setActive(i)}
              >
                {c.label}
                {i === active && <span className="chatgpt-convo-arrow">›</span>}
              </div>
            ))}
          </div>
          <div className="chatgpt-sidebar-actions">
            <button className="aqua-btn" onClick={newChat}>
              New Chat
            </button>
            <button className="aqua-btn" onClick={deleteConvo}>
              Delete…
            </button>
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
        ChatGPT · Aqua Edition v1.0 (2002) · {apiKey ? "Live via Gemini" : "Script mode"}
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
