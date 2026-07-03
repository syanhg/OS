import { useRef, useState } from "react";
import { APPS } from "../apps/registry";
import type { AppId, WinState } from "../types";
import { Window } from "./Window";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { AppIcon } from "./AppIcon";

let nextKey = 1;

const DESKTOP_ICONS: { label: string; icon: string; opens: AppId }[] = [
  { label: "Macintosh HD", icon: "hd", opens: "finder" },
  { label: "Mac OS X CD", icon: "osxcd", opens: "finder" },
  { label: "Applet Store", icon: "appletstore", opens: "appletstore" },
];

export function Desktop() {
  const [wins, setWins] = useState<WinState[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [notif, setNotif] = useState(true);
  const zCounter = useRef(10);

  const patch = (key: number, p: Partial<WinState>) =>
    setWins((ws) => ws.map((w) => (w.key === key ? { ...w, ...p } : w)));

  const focus = (key: number) => patch(key, { z: ++zCounter.current, minimized: false });

  const openApp = (app: AppId) => {
    const def = APPS[app];
    setWins((ws) => {
      const existing = ws.find((w) => w.app === app);
      if (existing) {
        return ws.map((w) =>
          w.key === existing.key
            ? { ...w, z: ++zCounter.current, minimized: false }
            : w
        );
      }
      const n = ws.length;
      return [
        ...ws,
        {
          key: nextKey++,
          app,
          title: def.name,
          x: 90 + (n % 6) * 28,
          y: 70 + (n % 6) * 24,
          w: def.w,
          h: def.h,
          z: ++zCounter.current,
          minimized: false,
        },
      ];
    });
  };

  const close = (key: number) => setWins((ws) => ws.filter((w) => w.key !== key));

  const zoom = (key: number) =>
    setWins((ws) =>
      ws.map((w) => {
        if (w.key !== key) return w;
        const def = APPS[w.app];
        const big = w.w >= window.innerWidth - 120;
        return big
          ? { ...w, w: def.w, h: def.h, x: 120, y: 80 }
          : { ...w, x: 30, y: 45, w: window.innerWidth - 90, h: window.innerHeight - 160 };
      })
    );

  const top = wins.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
  const activeApp = top ? APPS[top.app].name : "Finder";
  const running = new Set(wins.map((w) => w.app));
  const minimized = wins.filter((w) => w.minimized);

  return (
    <div
      className="desktop"
      style={{
        backgroundImage:
          "url(wallpaper.jpg), radial-gradient(ellipse 120% 90% at 30% 10%, #a8c8e8 0%, #6f9fce 40%, #33629c 100%)",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setSelectedIcon(null);
      }}
    >
      <MenuBar appName={activeApp} openApp={openApp} />

      <div className="desktop-icons">
        {DESKTOP_ICONS.map((d) => (
          <div
            key={d.label}
            className={"desktop-icon" + (selectedIcon === d.label ? " selected" : "")}
            onClick={() => setSelectedIcon(d.label)}
            onDoubleClick={() => openApp(d.opens)}
          >
            <div className="di-img">
              <AppIcon id={d.icon} />
            </div>
            <div className="di-label">{d.label}</div>
          </div>
        ))}
      </div>

      {wins.map((w) => {
        const def = APPS[w.app];
        const Body = def.component;
        return (
          <Window
            key={w.key}
            win={w}
            metal={def.metal}
            active={top?.key === w.key}
            onFocus={() => focus(w.key)}
            onClose={() => close(w.key)}
            onMinimize={() => patch(w.key, { minimized: true })}
            onZoom={() => zoom(w.key)}
            onMove={(x, y) => patch(w.key, { x, y })}
            onResize={(wd, h) => patch(w.key, { w: wd, h })}
          >
            <Body openApp={openApp} />
          </Window>
        );
      })}

      {notif && (
        <div className="notification">
          <span>⬇︎</span>
          <span>aquaOS is available as a Mac app</span>
          <button
            className="aqua-btn olive"
            onClick={() => {
              setNotif(false);
              openApp("appletstore");
            }}
          >
            Download
          </button>
          <button className="notif-close" onClick={() => setNotif(false)}>
            ✕
          </button>
        </div>
      )}

      <Dock
        running={running}
        minimized={minimized.map((m) => ({ key: m.key, app: m.app, title: m.title }))}
        onLaunch={openApp}
        onRestore={(key) => focus(key)}
      />
    </div>
  );
}
