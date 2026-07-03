import { useEffect, useRef, useState } from "react";
import { MenuApple } from "./icons";
import type { AppId, OpenApp } from "./apps";

interface MenuItem {
  label: string;
  action?: () => void;
  disabled?: boolean;
  sep?: boolean;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  const day = now.toLocaleDateString("en-US", { weekday: "short" });
  const mon = now.toLocaleDateString("en-US", { month: "short" });
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} ${mon} ${now.getDate()} ${time}`;
}

export function MenuBar({
  appName,
  openApp,
}: {
  appName: string;
  openApp: OpenApp;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const clock = useClock();

  const menus: Record<string, MenuItem[]> = {
    apple: [
      { label: "About This Mac", action: () => openApp("about") },
      { sep: true, label: "" },
      { label: "System Preferences…", disabled: true },
      { label: "Dock", disabled: true },
      { sep: true, label: "" },
      { label: "Sleep", disabled: true },
      { label: "Restart…", disabled: true },
      { label: "Shut Down…", disabled: true },
    ],
    File: [
      { label: "New Finder Window", action: () => openApp("finder" as AppId) },
      { label: "New Folder", disabled: true },
      { sep: true, label: "" },
      { label: "Open", disabled: true },
      { label: "Close Window", disabled: true },
      { sep: true, label: "" },
      { label: "Move to Trash", disabled: true },
    ],
    Edit: [
      { label: "Undo", disabled: true },
      { sep: true, label: "" },
      { label: "Cut", disabled: true },
      { label: "Copy", disabled: true },
      { label: "Paste", disabled: true },
      { label: "Select All", disabled: true },
    ],
    View: [
      { label: "as Icons", disabled: true },
      { label: "as List", disabled: true },
      { label: "as Columns", disabled: true },
      { sep: true, label: "" },
      { label: "Show View Options", disabled: true },
    ],
    Go: [
      { label: "Computer", action: () => openApp("finder") },
      { label: "Home", action: () => openApp("finder") },
      { label: "Applications", action: () => openApp("appletstore") },
      { sep: true, label: "" },
      { label: "Connect to Server…", disabled: true },
    ],
    Help: [{ label: `${appName} Help`, disabled: true }],
  };

  const titles = ["File", "Edit", "View", "Go", "Help"];

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
            </div>
          )
        )}
      </div>
    );

  // measured positions for dropdowns
  const [positions, setPositions] = useState<Record<string, number>>({});
  const measure = (key: string) => (el: HTMLDivElement | null) => {
    if (el && barRef.current) {
      const left = el.getBoundingClientRect().left - barRef.current.getBoundingClientRect().left;
      setPositions((p) => (p[key] === left ? p : { ...p, [key]: left }));
    }
  };

  return (
    <>
      {open && <div className="menubar-backdrop" onClick={() => setOpen(null)} />}
      <div className="menubar" ref={barRef}>
        <div className="menubar-left">
          <div
            ref={measure("apple")}
            className={"menu-title apple" + (open === "apple" ? " open" : "")}
            onClick={() => setOpen(open === "apple" ? null : "apple")}
            onMouseEnter={() => open && setOpen("apple")}
          >
            <MenuApple />
          </div>
          <div className="menu-title appname">{appName}</div>
          {titles.map((t) => (
            <div
              key={t}
              ref={measure(t)}
              className={"menu-title" + (open === t ? " open" : "")}
              onClick={() => setOpen(open === t ? null : t)}
              onMouseEnter={() => open && setOpen(t)}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="menubar-right">
          <div className="menu-title" title="Sound">
            🔈
          </div>
          <div className="menu-clock">{clock}</div>
          <div className="menu-title" title="Spotlight">
            🔍
          </div>
        </div>
        {renderDropdown("apple", positions["apple"] ?? 10)}
        {titles.map((t) => (
          <span key={t}>{renderDropdown(t, positions[t] ?? 100)}</span>
        ))}
      </div>
    </>
  );
}
