import { useState } from "react";
import { AppIcon, Placeholder, type IconId } from "./icons";

export type AppId =
  | "finder"
  | "dashboard"
  | "ichat"
  | "ie"
  | "textedit"
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

const SIDEBAR = [
  "Network",
  "Macintosh HD",
  "iPod",
  "Desktop",
  "Applications",
  "Documents",
  "Movies",
  "Music",
  "Pictures",
];

const FILES: { name: string; icon: IconId }[] = [
  { name: "Applications", icon: "folder" },
  { name: "Library", icon: "folder" },
  { name: "System", icon: "folder" },
  { name: "Users", icon: "folder" },
  { name: "Developer", icon: "folder" },
  { name: "Read Me.rtf", icon: "textedit" },
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
              key={s}
              className={"finder-side-item" + (s === side ? " active" : "")}
              onClick={() => setSide(s)}
            >
              <Placeholder
                id={s === "Macintosh HD" ? "hd" : s === "iPod" ? "ipod" : "folder"}
                className="mini-icon"
              />
              {s}
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
      <div className="finder-status">6 items, 74.21 GB available</div>
    </div>
  );
}

/* ---------------- TextEdit ---------------- */

function TextEdit(_: { openApp: OpenApp }) {
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
      <Placeholder id="apple" className="about-logo" />
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

/* ---------------- iChat ---------------- */

const BUDDIES = [
  { name: "Steve", note: "One more thing…", on: true },
  { name: "Kevin", note: "brb lunch", on: false },
  { name: "Jenny", note: "Listening to iTunes", on: true },
  { name: "Woz", note: "Available", on: true },
];

function IChat(_: { openApp: OpenApp }) {
  return (
    <div className="ichat">
      <div className="ichat-me">
        <div className="avatar">Me</div>
        <div>
          <div style={{ fontWeight: "bold" }}>seungyong</div>
          <div className="status">● Available</div>
        </div>
      </div>
      <div className="ichat-list">
        {BUDDIES.map((b) => (
          <div className="buddy" key={b.name}>
            <div className="avatar">{b.name[0]}</div>
            <div>
              <div style={{ fontWeight: "bold" }}>{b.name}</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{b.note}</div>
            </div>
            <div className={"b-status " + (b.on ? "on" : "away")} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Internet Explorer ---------------- */

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
          <div style={{ width: 60, margin: "0 auto 16px" }}>
            <Placeholder id="apple" />
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

const STORE_APPS: { id: IconId; name: string }[] = [
  { id: "finder", name: "Finder" },
  { id: "ichat", name: "iChat AV" },
  { id: "ie", name: "Internet Explorer" },
  { id: "textedit", name: "TextEdit" },
  { id: "dashboard", name: "Dashboard" },
  { id: "ipod", name: "iPod Updater" },
];

function AppletStore(_: { openApp: OpenApp }) {
  return (
    <div className="applet-store">
      <div className="store-hero">
        <div style={{ width: 56, height: 56 }}>
          <AppIcon id="appletstore" />
        </div>
        <h1>Applet Store</h1>
        <p>Hand-polished software, delivered over a 56k modem near you.</p>
        <button className="aqua-btn olive">Download</button>
      </div>
      <div className="store-grid">
        {STORE_APPS.map((a) => (
          <div className="store-card" key={a.name}>
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
      <Placeholder id="trash" className="es-icon" />
      <div>The Trash is empty.</div>
    </div>
  );
}

/* ---------------- Dashboard (a lone widget) ---------------- */

function Dashboard(_: { openApp: OpenApp }) {
  const now = new Date();
  return (
    <div className="empty-state" style={{ background: "rgba(40,40,40,0.9)", color: "#eee" }}>
      <Placeholder id="dashboard" className="es-icon" />
      <div style={{ fontSize: 26, fontWeight: "bold" }}>
        {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </div>
      <div style={{ opacity: 0.7 }}>Cupertino — 72° and sunny, probably</div>
    </div>
  );
}

/* ---------------- registry ---------------- */

export const APPS: Record<AppId, AppDef> = {
  finder: { id: "finder", name: "Finder", icon: "finder", metal: true, w: 640, h: 420, component: Finder },
  textedit: { id: "textedit", name: "TextEdit", icon: "textedit", w: 480, h: 380, component: TextEdit },
  about: { id: "about", name: "About This Mac", icon: "apple", w: 300, h: 320, component: AboutMac },
  ichat: { id: "ichat", name: "iChat", icon: "ichat", metal: true, w: 260, h: 380, component: IChat },
  ie: { id: "ie", name: "Internet Explorer", icon: "ie", w: 560, h: 420, component: Browser },
  appletstore: { id: "appletstore", name: "Applet Store", icon: "appletstore", metal: true, w: 560, h: 460, component: AppletStore },
  dashboard: { id: "dashboard", name: "Dashboard", icon: "dashboard", w: 340, h: 260, component: Dashboard },
  trash: { id: "trash", name: "Trash", icon: "trash", metal: true, w: 420, h: 300, component: Trash },
};
