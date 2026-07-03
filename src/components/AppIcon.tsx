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

/* ---------- menu bar glyphs (accurate monochrome vectors) ---------- */

/* the canonical Apple silhouette */
export const APPLE_PATH =
  "M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8S154.4 942.9 104.5 872.9C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z";

export function MenuApple({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 814 1000"
      width={size}
      height={size * 1.23}
      style={{ display: "block" }}
    >
      <path d={APPLE_PATH} fill="#1a1a1a" />
    </svg>
  );
}

/* speaker with volume waves — wave count follows the volume level */
export function MenuSpeaker({ volume }: { volume: number }) {
  return (
    <svg viewBox="0 0 24 18" width="19" height="15" style={{ display: "block" }}>
      <path d="M2 6.2 h3.6 L11 1.6 v14.8 L5.6 11.8 H2 z" fill="#1a1a1a" />
      {volume > 0.05 && (
        <path
          d="M13.6 6.3 a3.6 3.6 0 0 1 0 5.4"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
      {volume > 0.4 && (
        <path
          d="M15.9 4.3 a6.5 6.5 0 0 1 0 9.4"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
      {volume > 0.75 && (
        <path
          d="M18.2 2.3 a9.5 9.5 0 0 1 0 13.4"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/* spotlight magnifier */
export function MenuSearch() {
  return (
    <svg viewBox="0 0 18 18" width="15" height="15" style={{ display: "block" }}>
      <circle cx="7.2" cy="7.2" r="5.2" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <line
        x1="11.2"
        y1="11.2"
        x2="16.2"
        y2="16.2"
        stroke="#1a1a1a"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
