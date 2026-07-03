import { useState } from "react";
import type { IconId } from "../types";

/*
 * Every icon renders through <AppIcon id="..."/> → public/icons/<id>.png.
 * The World of Aqua Vol 1 set (plus aliases like finder.png → aquaos.png)
 * lives there; if a PNG is missing, a built-in SVG placeholder renders.
 */

const failed = new Set<string>();

export function AppIcon({
  id,
  className,
  alt,
}: {
  id: IconId;
  className?: string;
  alt?: string;
}) {
  const [broken, setBroken] = useState(failed.has(id));
  if (broken) return <Placeholder id={id} className={className} />;
  return (
    <img
      src={`icons/${id}.png`}
      alt={alt ?? id}
      className={className}
      draggable={false}
      onError={() => {
        failed.add(id);
        setBroken(true);
      }}
    />
  );
}

export function Placeholder({
  id,
  className,
}: {
  id: IconId;
  className?: string;
}) {
  const Icon = PLACEHOLDERS[id] ?? FolderIcon;
  return <Icon className={className} />;
}

type P = { className?: string };

/* ---------- fallback art for anything without a PNG ---------- */

function FolderIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="fdG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcd8f5" />
          <stop offset="1" stopColor="#6ba1d9" />
        </linearGradient>
      </defs>
      <path d="M6 16 h18 l5 6 h29 v30 a4 4 0 0 1 -4 4 H10 a4 4 0 0 1 -4 -4 z" fill="url(#fdG)" stroke="#3f6ea5" />
      <path d="M6 26 h52 v4 H6 z" fill="#fff" opacity="0.35" />
    </svg>
  );
}

function AppleLogo({ className }: P) {
  return (
    <svg viewBox="0 0 64 76" className={className}>
      <defs>
        <linearGradient id="apG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc7f5" />
          <stop offset="1" stopColor="#2e6fbe" />
        </linearGradient>
      </defs>
      <path
        d="M44 20c-6-1-9 3-12 3s-7-4-12-3C12 21 5 28 5 41c0 14 10 30 17 30 4 0 6-2 10-2s6 2 10 2c7 0 17-16 17-29 0-10-6-15-10-16-3-1-4-2-5-6z"
        fill="url(#apG)"
      />
      <path d="M33 16c4-1 8-5 7-12-5 1-9 5-7 12z" fill="url(#apG)" />
      <ellipse cx="30" cy="32" rx="20" ry="9" fill="#fff" opacity="0.3" />
    </svg>
  );
}

const PLACEHOLDERS: Record<string, (p: P) => JSX.Element> = {
  apple: AppleLogo,
  folder: FolderIcon,
};

/* small monochrome apple for the menu bar */
export function MenuApple() {
  return (
    <svg viewBox="0 0 64 76" width="14" height="17" style={{ display: "block" }}>
      <path
        d="M44 20c-6-1-9 3-12 3s-7-4-12-3C12 21 5 28 5 41c0 14 10 30 17 30 4 0 6-2 10-2s6 2 10 2c7 0 17-16 17-29 0-10-6-15-10-16-3-1-4-2-5-6z"
        fill="#1a1a1a"
      />
      <path d="M33 16c4-1 8-5 7-12-5 1-9 5-7 12z" fill="#1a1a1a" />
    </svg>
  );
}
