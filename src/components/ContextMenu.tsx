import { useEffect } from "react";
import type { CtxItem } from "../os-context";

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: CtxItem[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const left = Math.min(x, window.innerWidth - 210);
  const top = Math.min(y, window.innerHeight - items.length * 24 - 20);

  return (
    <>
      <div
        className="ctx-backdrop"
        onMouseDown={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <div className="ctx-menu" style={{ left, top }}>
        {items.map((item, i) =>
          item.sep ? (
            <div className="menu-sep" key={i} />
          ) : (
            <div
              key={i}
              className={"menu-item" + (item.disabled ? " disabled" : "")}
              onClick={() => {
                item.action?.();
                onClose();
              }}
            >
              {item.label}
            </div>
          )
        )}
      </div>
    </>
  );
}
