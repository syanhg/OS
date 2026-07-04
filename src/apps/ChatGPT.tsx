import { useEffect, useRef, useState } from "react";
import { AppIcon } from "../components/AppIcon";
import type { OpenApp } from "../types";

/*
 * A period-correct fantasy: ChatGPT as an iChat-era Aqua client.
 * All replies are canned — there's no model behind this, just a
 * script, same as the rest of aquaOS's mock apps (Mail, Browser).
 */

interface Msg {
  from: "you" | "bot";
  text: string;
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

let replyIndex = 0;

export function ChatGPT(_: { openApp: OpenApp }) {
  const [messages, setMessages] = useState<Msg[]>(INTRO);
  const [draft, setDraft] = useState("");
  const [convo, setConvo] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const newChat = () => {
    setMessages(INTRO);
    setDraft("");
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const reply = REPLIES[replyIndex % REPLIES.length];
    replyIndex++;
    setMessages((m) => [...m, { from: "you", text }, { from: "bot", text: reply }]);
    setDraft("");
  };

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
          <button className="chatgpt-tool">
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
              <div key={i} className={"chatgpt-bubble " + m.from}>
                <div className="chatgpt-who">{m.from === "you" ? "You:" : "ChatGPT:"}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="chatgpt-inputrow">
            <input
              className="chatgpt-input"
              placeholder="Type your message here..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="aqua-btn blue" onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="chatgpt-footer">
        ChatGPT — Aqua Edition v1.0 (2002)
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
