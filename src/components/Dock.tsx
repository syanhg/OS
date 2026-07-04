import { useRef, useState } from "react";
import { AppIcon } from "./AppIcon";
import { APPS } from "../apps/registry";
import { useOS } from "../os-context";
import type { AppId } from "../types";

const DOCK_APPS: AppId[] = [
  "finder",
  "mail",
  "chatgpt",
  "browser",
  "simpletext",
  "quicktime",
  "appletstore",
];

const BASE = 46;
const MAX = 78;
const RANGE = 140;

export function Dock({
  running,
  minimized,
  onLaunch,
  onRestore,
}: {
  running: Set<AppId>;
  minimized: { key: number; app: AppId; title: string }[];
  onLaunch: (app: AppId) => void;
  onRestore: (key: number) => void;
}) {
  const os = useOS();
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [settled, setSettled] = useState(true);
  const [hover, setHover] = useState<string | null>(null);
  const [bounce, setBounce] = useState<string | null>(null);

  const allKeys = [
    ...DOCK_APPS,
    ...minimized.map((m) => `min-${m.key}`),
    "trash",
  ];

  const onMouseMove = (e: React.MouseEvent) => {
    setSettled(false);
    const next: Record<string, number> = {};
    for (const key of allKeys) {
      const el = itemRefs.current.get(key);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const f = Math.max(0, Math.cos(Math.min(d / RANGE, 1) * (Math.PI / 2)));
      next[key] = Math.round(BASE + (MAX - BASE) * f * f);
    }
    setSizes(next);
  };

  const onMouseLeave = () => {
    setSettled(true);
    setSizes({});
    setHover(null);
  };

  const launch = (app: AppId) => {
    if (!running.has(app)) {
      setBounce(app);
      setTimeout(() => setBounce(null), 1700);
    }
    onLaunch(app);
  };

  const item = (
    key: string,
    label: string,
    icon: JSX.Element,
    indicator: boolean,
    onClick: () => void,
    onContextMenu?: (e: React.MouseEvent) => void,
    extraClass = ""
  ) => {
    const size = sizes[key] ?? BASE;
    return (
      <div
        key={key}
        ref={(el) => {
          if (el) itemRefs.current.set(key, el);
          else itemRefs.current.delete(key);
        }}
        className={
          "dock-item" +
          (settled ? " settle" : "") +
          (bounce === key ? " bouncing" : "") +
          (extraClass ? ` ${extraClass}` : "")
        }
        onMouseEnter={() => setHover(key)}
        onMouseLeave={() => setHover((h) => (h === key ? null : h))}
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu?.(e);
        }}
      >
        {hover === key && <div className="dock-label">{label}</div>}
        <div className="dock-icon-box" style={{ width: size, height: size }}>
          {icon}
        </div>
        <div className={"dock-indicator" + (indicator ? "" : " hidden")} />
      </div>
    );
  };

  const appCtx = (e: React.MouseEvent, app: AppId) =>
    os.showContextMenu(e.clientX, e.clientY, [
      { label: running.has(app) ? "Show" : "Open", action: () => launch(app) },
      { sep: true, label: "" },
      {
        label: "Quit",
        disabled: !running.has(app),
        action: () => os.quitApp(app),
      },
    ]);

  const trashCtx = (e: React.MouseEvent) =>
    os.showContextMenu(e.clientX, e.clientY, [
      { label: "Open", action: () => launch("trash") },
      { sep: true, label: "" },
      {
        label: "Empty Trash",
        disabled: os.trash.length === 0,
        action: () => os.emptyTrash(),
      },
    ]);

  return (
    <div className="dock-wrap">
      <div className="dock" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        {DOCK_APPS.map((app) =>
          item(
            app,
            APPS[app].name,
            <AppIcon id={APPS[app].icon} className="dock-icon" />,
            running.has(app),
            () => launch(app),
            (e) => appCtx(e, app)
          )
        )}
        <div className="dock-sep" />
        {minimized.map((m) =>
          item(
            `min-${m.key}`,
            m.title,
            <AppIcon id={APPS[m.app].icon} className="dock-icon" />,
            false,
            () => onRestore(m.key)
          )
        )}
        {item(
          "trash",
          "Trash",
          <AppIcon
            id={os.trash.length > 0 ? "trash-full" : "trash"}
            className="dock-icon"
          />,
          running.has("trash"),
          () => launch("trash"),
          trashCtx,
          "trash-item"
        )}
      </div>
    </div>
  );
}
