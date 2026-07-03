import { useState } from "react";
import { AppIcon } from "../components/AppIcon";
import type { IconId, OpenApp } from "../types";

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

export function Finder(_: { openApp: OpenApp }) {
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
