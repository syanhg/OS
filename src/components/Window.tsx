import { useRef } from "react";
import type { WinState } from "../types";

const MENUBAR_H = 25;

export function Window({
  win,
  active,
  metal,
  onFocus,
  onClose,
  onMinimize,
  onZoom,
  onMove,
  onResize,
  children,
}: {
  win: WinState;
  active: boolean;
  metal?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onZoom: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
  children: React.ReactNode;
}) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const startDrag = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".tl")) return;
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const moveDrag = (e: React.PointerEvent) => {
    if (!drag.current) return;
    onMove(e.clientX - drag.current.dx, Math.max(MENUBAR_H, e.clientY - drag.current.dy));
  };

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    resize.current = { x: e.clientX, y: e.clientY, w: win.w, h: win.h };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const moveResize = (e: React.PointerEvent) => {
    if (!resize.current) return;
    onResize(
      Math.max(220, resize.current.w + e.clientX - resize.current.x),
      Math.max(120, resize.current.h + e.clientY - resize.current.y)
    );
  };

  return (
    <div
      className={
        "window" + (metal ? " metal" : "") + (active ? "" : " inactive")
      }
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        display: win.minimized ? "none" : undefined,
      }}
      onPointerDown={onFocus}
    >
      <div
        className="titlebar"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={() => (drag.current = null)}
      >
        <div className="traffic">
          <div className="tl close" onClick={onClose}>
            ×
          </div>
          <div className="tl min" onClick={onMinimize}>
            −
          </div>
          <div className="tl zoom" onClick={onZoom}>
            +
          </div>
        </div>
        <div className="title">{win.title}</div>
      </div>
      <div className="window-body">{children}</div>
      <div
        className="resize-grip"
        onPointerDown={startResize}
        onPointerMove={moveResize}
        onPointerUp={() => (resize.current = null)}
      />
    </div>
  );
}
