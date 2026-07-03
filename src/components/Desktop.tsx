import { useEffect, useRef, useState } from "react";
import { APPS } from "../apps/registry";
import type { AppId, WinState } from "../types";
import {
  OSContext,
  WALLPAPERS,
  type CtxItem,
  type OS,
  type PowerMode,
  type TrashItem,
} from "../os-context";
import { Window } from "./Window";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { AppIcon, APPLE_PATH } from "./AppIcon";
import { ContextMenu } from "./ContextMenu";

let nextKey = 1;
let nextIconId = 1;

interface DeskIcon {
  id: string;
  label: string;
  icon: string;
  opens: AppId;
  x: number;
  y: number;
  system?: boolean;
}

const defaultPos = (i: number) => ({
  x: window.innerWidth - 124,
  y: 45 + i * 88,
});

function initialIcons(): DeskIcon[] {
  const defs = [
    { id: "hd", label: "Macintosh HD", icon: "hd", opens: "finder" as AppId, system: true },
    { id: "osxcd", label: "Mac OS X CD", icon: "osxcd", opens: "finder" as AppId },
    { id: "store", label: "Applet Store", icon: "appletstore", opens: "appletstore" as AppId },
  ];
  return defs.map((d, i) => ({ ...d, ...defaultPos(i) }));
}

export function Desktop() {
  const [wins, setWins] = useState<WinState[]>([]);
  const [icons, setIcons] = useState<DeskIcon[]>(initialIcons);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renaming, setRenaming] = useState<string | null>(null);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [volume, setVolume] = useState(0.6);
  const [wallpaper, setWallpaper] = useState("aqua");
  const [ctx, setCtx] = useState<{ x: number; y: number; items: CtxItem[] } | null>(null);
  const [powerState, setPowerState] = useState<"sleep" | "off" | "boot" | null>(null);
  const [marquee, setMarquee] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const zCounter = useRef(10);
  const iconRefs = useRef(new Map<string, HTMLDivElement>());
  const dragIcon = useRef<{ id: string; dx: number; dy: number; moved: boolean } | null>(null);

  /* ---------------- windows ---------------- */

  const patch = (key: number, p: Partial<WinState>) =>
    setWins((ws) => ws.map((w) => (w.key === key ? { ...w, ...p } : w)));

  const focus = (key: number) => patch(key, { z: ++zCounter.current, minimized: false });

  const openApp = (app: AppId) => {
    const def = APPS[app];
    setWins((ws) => {
      const existing = ws.find((w) => w.app === app);
      if (existing) {
        return ws.map((w) =>
          w.key === existing.key ? { ...w, z: ++zCounter.current, minimized: false } : w
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
  const quitApp = (app: AppId) => setWins((ws) => ws.filter((w) => w.app !== app));

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
  const running = new Set(wins.map((w) => w.app));
  const minimized = wins.filter((w) => w.minimized);

  /* ---------------- desktop icons ---------------- */

  const newFolder = (at?: { x: number; y: number }) => {
    const id = `folder-${nextIconId++}`;
    const pos = at ?? defaultPos(icons.length);
    setIcons((is) => [
      ...is,
      { id, label: "untitled folder", icon: "folder", opens: "finder", ...pos },
    ]);
    setSelected(new Set([id]));
    setRenaming(id);
  };

  const moveToTrash = (ids: string[]) => {
    const victims = icons.filter((i) => ids.includes(i.id) && !i.system);
    if (victims.length === 0) return;
    setTrash((t) => [...t, ...victims.map((v) => ({ id: v.id, label: v.label, icon: v.icon }))]);
    setIcons((is) => is.filter((i) => !ids.includes(i.id) || i.system));
    setSelected(new Set());
  };

  const cleanUp = () =>
    setIcons((is) => is.map((icon, i) => ({ ...icon, ...defaultPos(i) })));

  /* icon dragging */
  const iconPointerDown = (e: React.PointerEvent, icon: DeskIcon) => {
    if (e.button !== 0) return;
    if (!e.shiftKey && !selected.has(icon.id)) setSelected(new Set([icon.id]));
    if (e.shiftKey)
      setSelected((s) => {
        const n = new Set(s);
        n.has(icon.id) ? n.delete(icon.id) : n.add(icon.id);
        return n;
      });
    dragIcon.current = { id: icon.id, dx: e.clientX - icon.x, dy: e.clientY - icon.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const iconPointerMove = (e: React.PointerEvent) => {
    const d = dragIcon.current;
    if (!d) return;
    const x = e.clientX - d.dx;
    const y = e.clientY - d.dy;
    const orig = icons.find((i) => i.id === d.id);
    /* small threshold so a click doesn't become a drag */
    if (!d.moved && orig && Math.hypot(x - orig.x, y - orig.y) < 4) return;
    d.moved = true;
    setIcons((is) =>
      is.map((i) => (i.id === d.id ? { ...i, x, y: Math.max(28, y) } : i))
    );
  };

  const iconPointerUp = (e: React.PointerEvent) => {
    const d = dragIcon.current;
    dragIcon.current = null;
    if (!d?.moved) return;
    /* dropping an icon on the dock trash moves it to the trash */
    const under = document.elementFromPoint(e.clientX, e.clientY);
    if (under?.closest(".trash-item")) moveToTrash([d.id]);
  };

  /* marquee selection on empty desktop */
  const deskPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    setSelected(new Set());
    setRenaming(null);
    setMarquee({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const deskPointerMove = (e: React.PointerEvent) => {
    if (!marquee) return;
    const m = { ...marquee, x1: e.clientX, y1: e.clientY };
    setMarquee(m);
    const rx = Math.min(m.x0, m.x1),
      ry = Math.min(m.y0, m.y1),
      rw = Math.abs(m.x1 - m.x0),
      rh = Math.abs(m.y1 - m.y0);
    const hit = new Set<string>();
    for (const [id, el] of iconRefs.current) {
      const r = el.getBoundingClientRect();
      if (r.left < rx + rw && r.right > rx && r.top < ry + rh && r.bottom > ry) hit.add(id);
    }
    setSelected(hit);
  };

  const deskPointerUp = () => setMarquee(null);

  /* ---------------- power ---------------- */

  const bootTimer = useRef<number>();
  const power = (mode: PowerMode) => {
    if (mode === "sleep") setPowerState("sleep");
    if (mode === "shutdown") setPowerState("off");
    if (mode === "restart") {
      setPowerState("off");
      bootTimer.current = window.setTimeout(() => boot(), 1200);
    }
  };

  const boot = () => {
    window.clearTimeout(bootTimer.current);
    setWins([]);
    setPowerState("boot");
    bootTimer.current = window.setTimeout(() => setPowerState(null), 3200);
  };

  useEffect(() => {
    if (powerState !== "sleep") return;
    const wake = () => setPowerState(null);
    window.addEventListener("keydown", wake);
    return () => window.removeEventListener("keydown", wake);
  }, [powerState]);

  /* ---------------- keyboard shortcuts ---------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "w" && top) {
        e.preventDefault();
        close(top.key);
      } else if (k === "m" && top) {
        e.preventDefault();
        patch(top.key, { minimized: true });
      } else if (k === "q" && top && top.app !== "finder") {
        e.preventDefault();
        quitApp(top.app);
      } else if (k === "n") {
        e.preventDefault();
        openApp("finder");
      } else if (k === "backspace") {
        e.preventDefault();
        moveToTrash([...selected]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---------------- context menus ---------------- */

  const showContextMenu = (x: number, y: number, items: CtxItem[]) => setCtx({ x, y, items });

  const desktopCtx = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;
    showContextMenu(e.clientX, e.clientY, [
      { label: "New Folder", action: () => newFolder({ x: e.clientX - 28, y: e.clientY - 20 }) },
      { sep: true, label: "" },
      { label: "Change Desktop Background…", action: () => openApp("sysprefs") },
      { label: "Clean Up", action: cleanUp },
      { sep: true, label: "" },
      { label: "Get Info", disabled: true },
    ]);
  };

  const iconCtx = (e: React.MouseEvent, icon: DeskIcon) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selected.has(icon.id)) setSelected(new Set([icon.id]));
    showContextMenu(e.clientX, e.clientY, [
      { label: "Open", action: () => openApp(icon.opens) },
      { label: "Rename", action: () => setRenaming(icon.id) },
      { sep: true, label: "" },
      {
        label: "Move to Trash",
        disabled: !!icon.system,
        action: () => moveToTrash([...new Set([...selected, icon.id])]),
      },
      { sep: true, label: "" },
      { label: "Get Info", disabled: true },
    ]);
  };

  /* ---------------- OS context value ---------------- */

  const os: OS = {
    openApp,
    quitApp,
    closeActiveWindow: () => top && close(top.key),
    minimizeActiveWindow: () => top && patch(top.key, { minimized: true }),
    hasActiveWindow: !!top,
    activeApp: top?.app ?? null,
    newFolder: () => newFolder(),
    volume,
    setVolume,
    wallpaper,
    setWallpaper,
    trash,
    emptyTrash: () => setTrash([]),
    power,
    showContextMenu,
  };

  return (
    <OSContext.Provider value={os}>
      <div
        className="desktop"
        style={{
          backgroundImage: `url(wallpaper.jpg), ${WALLPAPERS[wallpaper].css}`,
        }}
        onPointerDown={deskPointerDown}
        onPointerMove={deskPointerMove}
        onPointerUp={deskPointerUp}
        onContextMenu={desktopCtx}
      >
        <MenuBar />

        {icons.map((d) => (
          <div
            key={d.id}
            ref={(el) => {
              if (el) iconRefs.current.set(d.id, el);
              else iconRefs.current.delete(d.id);
            }}
            className={"desktop-icon" + (selected.has(d.id) ? " selected" : "")}
            style={{ left: d.x, top: d.y }}
            onPointerDown={(e) => iconPointerDown(e, d)}
            onPointerMove={iconPointerMove}
            onPointerUp={iconPointerUp}
            onDoubleClick={() => openApp(d.opens)}
            onContextMenu={(e) => iconCtx(e, d)}
          >
            <div className="di-img">
              <AppIcon id={d.icon} />
            </div>
            {renaming === d.id ? (
              <input
                className="di-rename"
                defaultValue={d.label}
                autoFocus
                onFocus={(e) => e.target.select()}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  if (e.key === "Escape") setRenaming(null);
                }}
                onBlur={(e) => {
                  const label = e.target.value.trim();
                  if (label)
                    setIcons((is) =>
                      is.map((i) => (i.id === d.id ? { ...i, label } : i))
                    );
                  setRenaming(null);
                }}
              />
            ) : (
              <div className="di-label">{d.label}</div>
            )}
          </div>
        ))}

        {marquee && (
          <div
            className="marquee"
            style={{
              left: Math.min(marquee.x0, marquee.x1),
              top: Math.min(marquee.y0, marquee.y1),
              width: Math.abs(marquee.x1 - marquee.x0),
              height: Math.abs(marquee.y1 - marquee.y0),
            }}
          />
        )}

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

        <Dock
          running={running}
          minimized={minimized.map((m) => ({ key: m.key, app: m.app, title: m.title }))}
          onLaunch={openApp}
          onRestore={(key) => focus(key)}
        />

        {ctx && <ContextMenu {...ctx} onClose={() => setCtx(null)} />}

        {powerState === "sleep" && (
          <div className="power-overlay" onClick={() => setPowerState(null)} />
        )}
        {powerState === "off" && (
          <div className="power-overlay" onClick={boot}>
            <span className="power-hint">Click anywhere to start up</span>
          </div>
        )}
        {powerState === "boot" && (
          <div className="boot-screen">
            <svg viewBox="0 0 814 1000" className="boot-apple">
              <path d={APPLE_PATH} fill="#6e6e6e" />
            </svg>
            <div className="boot-spinner" />
          </div>
        )}
      </div>
    </OSContext.Provider>
  );
}
