import { useEffect, useRef, useState } from "react";
import { MenuSpeaker, MenuSearch, AppIcon } from "./AppIcon";
import { APPS } from "../apps/registry";
import { useOS } from "../os-context";
import { ICON_COLLECTION } from "../data/icon-manifest";
import type { AppId } from "../types";

interface MenuItem {
  label: string;
  action?: () => void;
  disabled?: boolean;
  sep?: boolean;
  shortcut?: string;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/* classic interface beep, used when the volume slider is released */
let audioCtx: AudioContext | null = null;
function beep(volume: number) {
  try {
    audioCtx ??= new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 780;
    gain.gain.value = 0.12 * volume;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch {
    /* audio unavailable */
  }
}

export function MenuBar() {
  const os = useOS();
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const barRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const now = useClock();

  const appName = os.activeApp ? APPS[os.activeApp].name : "Finder";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open === "spotlight") searchRef.current?.focus();
    else setQuery("");
  }, [open]);

  const day = now.toLocaleDateString("en-US", { weekday: "short" });
  const mon = now.toLocaleDateString("en-US", { month: "short" });
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const clock = `${day} ${mon} ${now.getDate()} ${time}`;
  const fullDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const menus: Record<string, MenuItem[]> = {
    apple: [
      { label: "About This Mac", action: () => os.openApp("about") },
      { sep: true, label: "" },
      { label: "System Preferences…", action: () => os.openApp("sysprefs") },
      { label: "Dock", disabled: true },
      { sep: true, label: "" },
      { label: "Sleep", action: () => os.power("sleep") },
      { label: "Restart…", action: () => os.power("restart") },
      { label: "Shut Down…", action: () => os.power("shutdown") },
    ],
    File: [
      { label: "New Finder Window", shortcut: "⌘N", action: () => os.openApp("finder") },
      { label: "New Folder", action: () => os.newFolder() },
      { sep: true, label: "" },
      { label: "Open", disabled: true },
      {
        label: "Close Window",
        shortcut: "⌘W",
        disabled: !os.hasActiveWindow,
        action: () => os.closeActiveWindow(),
      },
      {
        label: "Minimize Window",
        shortcut: "⌘M",
        disabled: !os.hasActiveWindow,
        action: () => os.minimizeActiveWindow(),
      },
      { sep: true, label: "" },
      {
        label: "Empty Trash",
        disabled: os.trash.length === 0,
        action: () => os.emptyTrash(),
      },
    ],
    Edit: [
      { label: "Undo", shortcut: "⌘Z", disabled: true },
      { sep: true, label: "" },
      { label: "Cut", shortcut: "⌘X", disabled: true },
      { label: "Copy", shortcut: "⌘C", disabled: true },
      { label: "Paste", shortcut: "⌘V", disabled: true },
      { label: "Select All", shortcut: "⌘A", disabled: true },
    ],
    View: [
      { label: "as Icons", disabled: true },
      { label: "as List", disabled: true },
      { label: "as Columns", disabled: true },
      { sep: true, label: "" },
      { label: "Clean Up", disabled: true },
      { label: "Show View Options", disabled: true },
    ],
    Go: [
      { label: "Computer", action: () => os.openApp("finder") },
      { label: "Home", action: () => os.openApp("finder") },
      { label: "Applications", action: () => os.openApp("appletstore") },
      { sep: true, label: "" },
      { label: "Connect to Server…", shortcut: "⌘K", disabled: true },
    ],
    Window: [
      {
        label: "Minimize",
        shortcut: "⌘M",
        disabled: !os.hasActiveWindow,
        action: () => os.minimizeActiveWindow(),
      },
      { label: "Zoom", disabled: !os.hasActiveWindow },
      { sep: true, label: "" },
      { label: "Bring All to Front", disabled: true },
    ],
    Help: [{ label: `${appName} Help`, disabled: true }],
    clock: [
      { label: fullDate, disabled: true },
      { sep: true, label: "" },
      { label: "View as Analog", disabled: true },
      { label: "View as Digital", disabled: true },
      { sep: true, label: "" },
      { label: "Open Date & Time…", disabled: true },
    ],
  };

  const titles = ["File", "Edit", "View", "Go", "Window", "Help"];

  /* spotlight results across apps and the icon collection */
  const q = query.trim().toLowerCase();
  const results: { icon: string; name: string; kind: string; action: () => void }[] =
    q.length === 0
      ? []
      : [
          ...Object.values(APPS)
            .filter((a) => a.name.toLowerCase().includes(q))
            .map((a) => ({
              icon: a.icon,
              name: a.name,
              kind: "Application",
              action: () => os.openApp(a.id as AppId),
            })),
          ...ICON_COLLECTION.filter((i) => i.name.toLowerCase().includes(q)).map(
            (i) => ({
              icon: i.id,
              name: i.name,
              kind: "Icon",
              action: () => os.openApp("appletstore"),
            })
          ),
        ].slice(0, 8);

  const renderDropdown = (key: string, left: number) =>
    open === key && (
      <div className="menu-dropdown" style={{ left }}>
        {menus[key]?.map((item, i) =>
          item.sep ? (
            <div className="menu-sep" key={i} />
          ) : (
            <div
              key={i}
              className={"menu-item" + (item.disabled ? " disabled" : "")}
              onClick={() => {
                item.action?.();
                setOpen(null);
              }}
            >
              {item.label}
              {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
            </div>
          )
        )}
      </div>
    );

  const [positions, setPositions] = useState<Record<string, number>>({});
  const measure = (key: string) => (el: HTMLDivElement | null) => {
    if (el && barRef.current) {
      const left =
        el.getBoundingClientRect().left - barRef.current.getBoundingClientRect().left;
      setPositions((p) => (p[key] === left ? p : { ...p, [key]: left }));
    }
  };

  const toggle = (key: string) => setOpen(open === key ? null : key);
  const trackHover = (key: string) => open && open !== "spotlight" && setOpen(key);

  return (
    <>
      {open && <div className="menubar-backdrop" onClick={() => setOpen(null)} />}
      <div className="menubar" ref={barRef}>
        <div className="menubar-left">
          <div
            ref={measure("apple")}
            className={"menu-title apple" + (open === "apple" ? " open" : "")}
            onClick={() => toggle("apple")}
            onMouseEnter={() => trackHover("apple")}
          >
            <AppIcon id="apple" className="menu-apple-img" />
          </div>
          <div className="menu-title appname">{appName}</div>
          {titles.map((t) => (
            <div
              key={t}
              ref={measure(t)}
              className={"menu-title" + (open === t ? " open" : "")}
              onClick={() => toggle(t)}
              onMouseEnter={() => trackHover(t)}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="menubar-right">
          <div
            ref={measure("volume")}
            className={"menu-title glyph" + (open === "volume" ? " open" : "")}
            onClick={() => toggle("volume")}
            onMouseEnter={() => trackHover("volume")}
            title="Volume"
          >
            <MenuSpeaker volume={os.volume} />
          </div>
          <div
            ref={measure("clock")}
            className={"menu-title menu-clock" + (open === "clock" ? " open" : "")}
            onClick={() => toggle("clock")}
            onMouseEnter={() => trackHover("clock")}
          >
            {clock}
          </div>
          <div
            ref={measure("spotlight")}
            className={"menu-title glyph" + (open === "spotlight" ? " open" : "")}
            onClick={() => toggle("spotlight")}
            title="Spotlight"
          >
            <MenuSearch />
          </div>
        </div>

        {renderDropdown("apple", positions["apple"] ?? 10)}
        {titles.map((t) => (
          <span key={t}>{renderDropdown(t, positions[t] ?? 100)}</span>
        ))}
        {renderDropdown("clock", Math.max(0, (positions["clock"] ?? 0) - 40))}

        {open === "volume" && (
          <div
            className="volume-panel"
            style={{ left: (positions["volume"] ?? 0) - 14 }}
          >
            <input
              className="vol-slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={os.volume}
              onChange={(e) => os.setVolume(Number(e.target.value))}
              onPointerUp={() => beep(os.volume)}
            />
          </div>
        )}

        {open === "spotlight" && (
          <div className="spotlight-panel">
            <input
              ref={searchRef}
              className="spotlight-input"
              placeholder="Spotlight"
              value={query}
              spellCheck={false}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results[0]) {
                  results[0].action();
                  setOpen(null);
                }
              }}
            />
            {results.length > 0 && (
              <div className="spot-results">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="spot-row"
                    onClick={() => {
                      r.action();
                      setOpen(null);
                    }}
                  >
                    <AppIcon id={r.icon} className="spot-icon" />
                    <span className="spot-name">{r.name}</span>
                    <span className="spot-kind">{r.kind}</span>
                  </div>
                ))}
              </div>
            )}
            {q.length > 0 && results.length === 0 && (
              <div className="spot-empty">No results</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
