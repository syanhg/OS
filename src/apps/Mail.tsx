import { useState } from "react";
import { AppIcon } from "../components/AppIcon";
import type { OpenApp } from "../types";

const MESSAGES = [
  { from: "The Iconfactory", subject: "World of Aqua Vol. 1 has shipped!", time: "7:12 PM", unread: true },
  { from: "Steve", subject: "One more thing…", time: "6:48 PM", unread: true },
  { from: "Applet Store", subject: "Your download is ready", time: "4:03 PM", unread: false },
  { from: "Kevin", subject: "Re: LAN party Saturday?", time: "2:17 PM", unread: false },
  { from: "Mailer-Daemon", subject: "Returned mail: user unknown", time: "11:30 AM", unread: false },
];

export function Mail(_: { openApp: OpenApp }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="mail">
      <div className="mail-toolbar">
        <AppIcon id="mail" className="mail-toolbar-icon" />
        <span style={{ fontWeight: "bold" }}>Inbox</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#444" }}>
          {MESSAGES.filter((m) => m.unread).length} unread
        </span>
      </div>
      <div className="mail-list">
        {MESSAGES.map((m, i) => (
          <div
            key={i}
            className={"mail-row" + (i === sel ? " selected" : "")}
            onClick={() => setSel(i)}
          >
            <span className={"mail-dot" + (m.unread ? " unread" : "")} />
            <div className="mail-meta">
              <div className="mail-from">{m.from}</div>
              <div className="mail-subject">{m.subject}</div>
            </div>
            <span className="mail-time">{m.time}</span>
          </div>
        ))}
      </div>
      <div className="mail-preview">
        <b>{MESSAGES[sel].from}</b> — {MESSAGES[sel].subject}
        <p style={{ marginTop: 8, color: "#555" }}>
          This message was delivered over dial-up and is best viewed at
          800×600. Do not reply after 56 kilobits.
        </p>
      </div>
    </div>
  );
}
