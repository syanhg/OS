import { useState } from "react";
import { AppIcon } from "../components/AppIcon";
import { useOS } from "../os-context";
import { setSimpleTextDoc } from "./SimpleText";
import { setViewerImage } from "./Viewer";
import { setQuickTimeTitle } from "./QuickTime";
import type { AppId, IconId, OpenApp } from "../types";

/*
 * The Finder browses a small virtual file system. Every item does
 * something real: folders navigate, apps launch, documents open in
 * SimpleText, pictures open in PictureViewer, songs open in QuickTime.
 */

interface FSNode {
  name: string;
  icon: IconId;
  children?: FSNode[];
  opens?: AppId;
  doc?: string;
  image?: IconId;
  song?: boolean;
}

const README = `Welcome to aquaOS!

This is a recreation of Mac OS X in its Aqua era, built for the web.

A few things to try:
•  Double-click folders in the Finder to open them; use the ◀ and ▶
   buttons to move through your navigation history.
•  Open the Applications folder and double-click an app to launch it.
•  The Browser loads the real June 2002 web through the Wayback
   Machine — type any address and press Return.
•  Right-click the desktop, icons, and the Dock for contextual menus.
•  Drag a desktop icon onto the Trash in the Dock to delete it.

The icons are the World of Aqua collection by the Iconfactory.

Enjoy!`;

const CREDITS = `About these icons

The icons used throughout aquaOS are "World of Aqua, Volume 1" by
the Iconfactory, released in the early 2000s for Mac OS 9 and X.

They were extracted from the original resource-fork Icon files and
converted to PNG for this recreation. World of Aqua is © the
Iconfactory; used here as a personal, non-commercial homage.

You can browse the full set of 49 icons in the Applet Store.`;

const ROOT: FSNode = {
  name: "Macintosh HD",
  icon: "hd",
  children: [
    {
      name: "Applications",
      icon: "folder-apps",
      children: [
        { name: "Mail", icon: "mail", opens: "mail" },
        { name: "Browser", icon: "browser", opens: "browser" },
        { name: "SimpleText", icon: "simpletext", opens: "simpletext" },
        { name: "QuickTime Player", icon: "quicktime", opens: "quicktime" },
        { name: "PictureViewer", icon: "quicktime-pictureviewer", opens: "viewer" },
        { name: "Applet Store", icon: "appletstore", opens: "appletstore" },
        { name: "System Preferences", icon: "folder-utilities", opens: "sysprefs" },
      ],
    },
    {
      name: "Documents",
      icon: "folder",
      children: [
        { name: "Read Me!", icon: "readme", doc: README },
        { name: "About the icons", icon: "readme", doc: CREDITS },
      ],
    },
    {
      name: "Music",
      icon: "folder-music",
      children: [
        { name: "Aqua Groove.mp3", icon: "sound-file", song: true },
        { name: "Pinstripe Funk.mp3", icon: "sound-file", song: true },
        { name: "Bondi Blues.mp3", icon: "sound-file", song: true },
      ],
    },
    {
      name: "Pictures",
      icon: "folder-images",
      children: [
        { name: "G4 Cube.jpg", icon: "g4-cube", image: "g4-cube" },
        { name: "Classic Mac.jpg", icon: "classic-mac", image: "classic-mac" },
        { name: "eMate 300.jpg", icon: "emate-300", image: "emate-300" },
        { name: "Nokia 3310.jpg", icon: "nokia-mobil-3310-artic-blue", image: "nokia-mobil-3310-artic-blue" },
        { name: "MessagePad.jpg", icon: "messagepad-2001", image: "messagepad-2001" },
        { name: "Spy Plane.jpg", icon: "its-like-a-spy-plane", image: "its-like-a-spy-plane" },
      ],
    },
  ],
};

const child = (name: string) => ROOT.children!.find((c) => c.name === name)!;

const SIDEBAR: { name: string; icon: IconId; target: FSNode[] }[] = [
  { name: "Macintosh HD", icon: "hd", target: [ROOT] },
  { name: "Applications", icon: "folder-apps", target: [ROOT, child("Applications")] },
  { name: "Documents", icon: "folder", target: [ROOT, child("Documents")] },
  { name: "Music", icon: "folder-music", target: [ROOT, child("Music")] },
  { name: "Pictures", icon: "folder-images", target: [ROOT, child("Pictures")] },
];

export function Finder(_: { openApp: OpenApp }) {
  const os = useOS();
  const [history, setHistory] = useState<FSNode[][]>([[ROOT]]);
  const [index, setIndex] = useState(0);
  const [sel, setSel] = useState<string | null>(null);

  const path = history[index];
  const cwd = path[path.length - 1];

  const navigate = (newPath: FSNode[]) => {
    const next = [...history.slice(0, index + 1), newPath];
    setHistory(next);
    setIndex(next.length - 1);
    setSel(null);
  };

  const jump = (i: number) => {
    setIndex(i);
    setSel(null);
  };

  /* every double-click does something real */
  const openNode = (n: FSNode) => {
    if (n.children) {
      navigate([...path, n]);
    } else if (n.doc !== undefined) {
      setSimpleTextDoc(n.doc);
      os.quitApp("simpletext");
      os.openApp("simpletext");
    } else if (n.image) {
      setViewerImage(n.image, n.name);
      os.quitApp("viewer");
      os.openApp("viewer");
    } else if (n.song) {
      setQuickTimeTitle(n.name);
      os.quitApp("quicktime");
      os.openApp("quicktime");
    } else if (n.opens) {
      os.openApp(n.opens);
    }
  };

  return (
    <div className="finder">
      <div className="finder-toolbar">
        <div className="finder-nav">
          <button disabled={index === 0} onClick={() => jump(index - 1)}>
            ◀
          </button>
          <button
            disabled={index >= history.length - 1}
            onClick={() => jump(index + 1)}
          >
            ▶
          </button>
        </div>
        <span style={{ fontWeight: "bold", fontSize: 13 }}>{cwd.name}</span>
      </div>
      <div className="finder-main">
        <div className="finder-sidebar">
          {SIDEBAR.map((s) => (
            <div
              key={s.name}
              className={
                "finder-side-item" +
                (cwd === s.target[s.target.length - 1] ? " active" : "")
              }
              onClick={() => navigate(s.target)}
            >
              <AppIcon id={s.icon} className="mini-icon" />
              {s.name}
            </div>
          ))}
        </div>
        <div className="finder-files" onClick={() => setSel(null)}>
          {(cwd.children ?? []).map((f) => (
            <div
              key={f.name}
              className={"finder-file" + (sel === f.name ? " selected" : "")}
              onClick={(e) => {
                e.stopPropagation();
                setSel(f.name);
              }}
              onDoubleClick={() => openNode(f)}
            >
              <AppIcon id={f.icon} className="ff-icon" />
              <span className="ff-label">{f.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="finder-status">
        {cwd.children?.length ?? 0} items, 74.21 GB available
      </div>
    </div>
  );
}
