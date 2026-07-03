import { useState } from "react";
import { AppIcon, type IconId } from "./icons";
import { ICON_COLLECTION } from "./icon-manifest";

export type AppId =
  | "finder"
  | "mail"
  | "browser"
  | "simpletext"
  | "quicktime"
  | "appletstore"
  | "trash"
  | "about";

export type OpenApp = (app: AppId) => void;

export interface AppDef {
  id: AppId;
  name: string;
  icon: IconId;
  metal?: boolean;
  w: number;
  h: number;
  component: (props: { openApp: OpenApp }) => JSX.Element;
}

/* ---------------- Finder ---------------- */

const SIDEBAR: { name: string; icon: IconId }[] = [
  { name: "Network", icon: "globe" },
  { name: "Macintosh HD", icon: "hd" },
  { name: "Mac OS X CD", icon: "osxcd" },
  { name: "Desktop", icon: "folder" },
  { name: "Applications", icon: "folder-apps" },
  { name: "Documents", icon: "folder" },
  { name: "Internet", icon: "folder-internet" },
  { name: "Music", icon: "folder-music" },
  { name: "Pictures", icon: "folder-images" },
  { name: "Games", icon: "folder-games" },
];

const FILES: { name: string; icon: IconId }[] = [
  { name: "Applications", icon: "folder-apps" },
  { name: "System", icon: "folder-system" },
  { name: "Utilities", icon: "folder-utilities" },
  { name: "Internet", icon: "folder-internet" },
  { name: "Music", icon: "folder-music" },
  { name: "Pictures", icon: "folder-images" },
  { name: "Games", icon: "folder-games" },
  { name: "SimpleText", icon: "simpletext" },
  { name: "Read Me!", icon: "readme" },
  { name: "Secrets", icon: "lock" },
];

function Finder(_: { openApp: OpenApp }) {
  const [side, setSide] = useState("Macintosh HD");
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="finder">
      <div className="finder-toolbar">
        <div className="finder-nav">
          <button>◀</button>
          <button>▶</button>
        </div>
        <span style={{ fontWeight: "bold", fontSize: 13 }}>{side}</span>
      </div>
      <div className="finder-main">
        <div className="finder-sidebar">
          {SIDEBAR.map((s) => (
            <div
              key={s.name}
              className={"finder-side-item" + (s.name === side ? " active" : "")}
              onClick={() => setSide(s.name)}
            >
              <AppIcon id={s.icon} className="mini-icon" />
              {s.name}
            </div>
          ))}
        </div>
        <div className="finder-files" onClick={() => setSel(null)}>
          {FILES.map((f) => (
            <div
              key={f.name}
              className={"finder-file" + (sel === f.name ? " selected" : "")}
              onClick={(e) => {
                e.stopPropagation();
                setSel(f.name);
              }}
            >
              <AppIcon id={f.icon} className="ff-icon" />
              <span className="ff-label">{f.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="finder-status">10 items, 74.21 GB available</div>
    </div>
  );
}

/* ---------------- SimpleText ---------------- */

function SimpleText(_: { openApp: OpenApp }) {
  return (
    <div className="textedit">
      <div className="textedit-ruler" />
      <div
        className="textedit-area"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
      >
        Welcome to aquaOS. This document is editable — click and start typing.
      </div>
    </div>
  );
}

/* ---------------- About This Mac ---------------- */

function AboutMac(_: { openApp: OpenApp }) {
  return (
    <div className="about-mac">
      <AppIcon id="osx" className="about-logo" />
      <h1>Mac OS X</h1>
      <div className="ver">Version 10.4 “aquaOS”</div>
      <div className="spec">
        <b>Processor</b> 1.42 GHz PowerPC G4
      </div>
      <div className="spec">
        <b>Memory</b> 512 MB DDR SDRAM
      </div>
      <button className="aqua-btn">Software Update…</button>
    </div>
  );
}

/* ---------------- Mail ---------------- */

const MESSAGES = [
  { from: "The Iconfactory", subject: "World of Aqua Vol. 1 has shipped!", time: "7:12 PM", unread: true },
  { from: "Steve", subject: "One more thing…", time: "6:48 PM", unread: true },
  { from: "Applet Store", subject: "Your download is ready", time: "4:03 PM", unread: false },
  { from: "Kevin", subject: "Re: LAN party Saturday?", time: "2:17 PM", unread: false },
  { from: "Mailer-Daemon", subject: "Returned mail: user unknown", time: "11:30 AM", unread: false },
];

function Mail(_: { openApp: OpenApp }) {
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

/* ---------------- QuickTime Player ---------------- */

function QuickTime(_: { openApp: OpenApp }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="qt">
      <div className="qt-screen">
        <AppIcon id="quicktime" className="qt-logo" />
        <div className="qt-title">Sample Movie.mov</div>
      </div>
      <div className="qt-controls">
        <button className="qt-play" onClick={() => setPlaying(!playing)}>
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="qt-track">
          <div className="qt-progress" style={{ width: playing ? "38%" : "0%" }} />
        </div>
        <span className="qt-time">{playing ? "0:07" : "0:00"} / 0:19</span>
      </div>
    </div>
  );
}

/* ---------------- Browser ---------------- */

function Browser({ openApp }: { openApp: OpenApp }) {
  return (
    <div className="browser">
      <div className="browser-toolbar">
        <div className="finder-nav">
          <button>◀</button>
          <button>▶</button>
        </div>
        <input
          className="browser-address"
          defaultValue="http://www.apple.com/"
          spellCheck={false}
        />
      </div>
      <div className="browser-page">
        <div style={{ padding: "40px 30px", textAlign: "center" }}>
          <div style={{ width: 72, margin: "0 auto 16px" }}>
            <AppIcon id="internet" />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Welcome to the Internet.</h1>
          <p style={{ color: "#667", fontSize: 13, marginBottom: 20 }}>
            It is the year 2000-something. Pages load one image at a time.
          </p>
          <button className="aqua-btn blue" onClick={() => openApp("appletstore")}>
            Visit the Applet Store
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Applet Store ---------------- */

function AppletStore(_: { openApp: OpenApp }) {
  return (
    <div className="applet-store">
      <div className="store-hero">
        <div style={{ width: 56, height: 56 }}>
          <AppIcon id="appletstore" />
        </div>
        <h1>Applet Store</h1>
        <p>
          Featuring the World of Aqua collection — {ICON_COLLECTION.length} hand-polished
          icons, delivered over a 56k modem near you.
        </p>
        <button className="aqua-btn olive">Download</button>
      </div>
      <div className="store-grid">
        {ICON_COLLECTION.map((a) => (
          <div className="store-card" key={a.id}>
            <AppIcon id={a.id} className="sc-icon" />
            <div className="sc-name">{a.name}</div>
            <button className="aqua-btn">Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Trash ---------------- */

function Trash(_: { openApp: OpenApp }) {
  return (
    <div className="empty-state">
      <AppIcon id="trash" className="es-icon" />
      <div>The Trash is empty.</div>
    </div>
  );
}

/* ---------------- registry ---------------- */

export const APPS: Record<AppId, AppDef> = {
  finder: { id: "finder", name: "Finder", icon: "finder", metal: true, w: 640, h: 420, component: Finder },
  mail: { id: "mail", name: "Mail", icon: "mail", metal: true, w: 440, h: 400, component: Mail },
  browser: { id: "browser", name: "Browser", icon: "browser", w: 560, h: 420, component: Browser },
  simpletext: { id: "simpletext", name: "SimpleText", icon: "simpletext", w: 480, h: 380, component: SimpleText },
  quicktime: { id: "quicktime", name: "QuickTime Player", icon: "quicktime", metal: true, w: 420, h: 340, component: QuickTime },
  appletstore: { id: "appletstore", name: "Applet Store", icon: "appletstore", metal: true, w: 620, h: 480, component: AppletStore },
  trash: { id: "trash", name: "Trash", icon: "trash", metal: true, w: 420, h: 300, component: Trash },
  about: { id: "about", name: "About This Mac", icon: "osx", w: 300, h: 330, component: AboutMac },
};
