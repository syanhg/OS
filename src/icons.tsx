import { useState } from "react";

/*
 * Every icon in aquaOS renders through <AppIcon id="..."/>.
 * It first tries public/icons/<id>.png — drop your own artwork there
 * and it replaces the built-in placeholder automatically.
 */

export type IconId =
  | "finder"
  | "dashboard"
  | "ichat"
  | "ie"
  | "textedit"
  | "appletstore"
  | "trash"
  | "hd"
  | "ipod"
  | "apple"
  | "folder";

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
  const Icon = PLACEHOLDERS[id];
  return <Icon className={className} />;
}

type P = { className?: string };

/* ---------- built-in skeuomorphic placeholder art ---------- */

function FinderIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="fnL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6fb" />
          <stop offset="1" stopColor="#5f9fd8" />
        </linearGradient>
        <linearGradient id="fnR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fa8dd" />
          <stop offset="1" stopColor="#2a5f9e" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="10" fill="url(#fnL)" stroke="#2a5f9e" />
      <path d="M32 4 h18 a10 10 0 0 1 10 10 v36 a10 10 0 0 1 -10 10 h-18 z" fill="url(#fnR)" />
      <path d="M32 12 c-6 8 -6 26 0 40" fill="none" stroke="#123c6b" strokeWidth="2.4" />
      <circle cx="20" cy="26" r="2.6" fill="#123c6b" />
      <circle cx="44" cy="26" r="2.6" fill="#0d2c50" />
      <path d="M16 42 q16 10 32 0" fill="none" stroke="#123c6b" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="5" y="5" width="54" height="20" rx="9" fill="#fff" opacity="0.25" />
    </svg>
  );
}

function DashboardIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id="dbG" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#4a4a4a" />
          <stop offset="1" stopColor="#111" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#dbG)" stroke="#000" />
      <path d="M10 32 a22 22 0 0 1 11-19" fill="none" stroke="#e33" strokeWidth="5" />
      <path d="M21 13 a22 22 0 0 1 22 0" fill="none" stroke="#fc3" strokeWidth="5" />
      <path d="M43 13 a22 22 0 0 1 11 19" fill="none" stroke="#3c3" strokeWidth="5" />
      <line x1="32" y1="32" x2="18" y2="20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="32" r="4" fill="#ddd" />
      <ellipse cx="32" cy="18" rx="20" ry="9" fill="#fff" opacity="0.18" />
    </svg>
  );
}

function IChatIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="icB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe0fd" />
          <stop offset="1" stopColor="#3273c8" />
        </linearGradient>
      </defs>
      <path
        d="M32 6 C17 6 6 15 6 27 c0 8 5 14 12 18 l-3 12 13-8 c1.3.1 2.6.2 4 .2 15 0 26-9 26-21.4S47 6 32 6z"
        fill="url(#icB)"
        stroke="#1d4e94"
      />
      <rect x="18" y="20" width="17" height="13" rx="3" fill="#fff" opacity="0.9" />
      <path d="M35 24 l9-5 v15 l-9-5 z" fill="#fff" opacity="0.9" />
      <ellipse cx="32" cy="14" rx="22" ry="7" fill="#fff" opacity="0.3" />
    </svg>
  );
}

function IEIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id="ieG" cx="0.4" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#9fd2ff" />
          <stop offset="1" stopColor="#1a5bbf" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="34" r="24" fill="url(#ieG)" stroke="#134a9e" />
      <text
        x="32"
        y="45"
        textAnchor="middle"
        fontFamily="Times New Roman, serif"
        fontSize="36"
        fontStyle="italic"
        fill="#fff"
      >
        e
      </text>
      <path
        d="M6 30 C14 14 50 8 58 20 c3 5-2 9-8 11 M6 30 c-3 6 1 11 9 12"
        fill="none"
        stroke="#f6c62d"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="30" cy="22" rx="16" ry="7" fill="#fff" opacity="0.3" />
    </svg>
  );
}

function TextEditIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <rect x="10" y="4" width="44" height="56" rx="3" fill="#fdfdfd" stroke="#999" />
      <g stroke="#b9c6d8" strokeWidth="2">
        <line x1="16" y1="16" x2="48" y2="16" />
        <line x1="16" y1="23" x2="48" y2="23" />
        <line x1="16" y1="30" x2="48" y2="30" />
        <line x1="16" y1="37" x2="40" y2="37" />
      </g>
      <g transform="rotate(45 40 40)">
        <rect x="36" y="22" width="9" height="30" fill="#f3b73c" stroke="#a97d1c" />
        <path d="M36 52 h9 l-4.5 8 z" fill="#e8c9a0" stroke="#a97d1c" />
        <path d="M38.5 55.5 l4 -1.5 -2 5 z" fill="#333" />
        <rect x="36" y="22" width="9" height="5" fill="#c0392b" />
      </g>
    </svg>
  );
}

function AppletStoreIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="asW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9a86a" />
          <stop offset="1" stopColor="#a5763c" />
        </linearGradient>
      </defs>
      <rect x="6" y="14" width="52" height="38" rx="5" fill="url(#asW)" stroke="#7a5527" />
      <g stroke="#7a5527" strokeWidth="1" opacity="0.5">
        <line x1="6" y1="24" x2="58" y2="24" />
        <line x1="6" y1="33" x2="58" y2="33" />
        <line x1="6" y1="42" x2="58" y2="42" />
      </g>
      <g transform="rotate(-45 32 33)">
        <rect x="28.5" y="12" width="7" height="34" fill="#e8b93c" stroke="#8c6a12" />
        <path d="M28.5 46 h7 l-3.5 7 z" fill="#eed4ac" stroke="#8c6a12" />
        <rect x="28.5" y="12" width="7" height="5" fill="#d95a4e" />
      </g>
      <g transform="rotate(45 32 33)">
        <rect x="29" y="14" width="6" height="26" fill="#b6bcc4" stroke="#6d747d" />
        <path d="M29 40 q3 9 6 0 z" fill="#3b3b3b" />
      </g>
      <ellipse cx="32" cy="19" rx="24" ry="6" fill="#fff" opacity="0.22" />
    </svg>
  );
}

function TrashIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="trG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9aa0a8" />
          <stop offset="0.5" stopColor="#e8ecf0" />
          <stop offset="1" stopColor="#8a9098" />
        </linearGradient>
      </defs>
      <path d="M16 14 L20 58 h24 L48 14 z" fill="url(#trG)" stroke="#5c636b" />
      <g stroke="#5c636b" strokeWidth="1" opacity="0.65">
        <line x1="21" y1="16" x2="24" y2="56" />
        <line x1="27" y1="16" x2="28.5" y2="56" />
        <line x1="33" y1="16" x2="33" y2="56" />
        <line x1="39" y1="16" x2="37.5" y2="56" />
        <line x1="45" y1="16" x2="42" y2="56" />
      </g>
      <g stroke="#5c636b" strokeWidth="1" opacity="0.65">
        <line x1="17.5" y1="22" x2="46.5" y2="22" />
        <line x1="18.2" y1="30" x2="45.8" y2="30" />
        <line x1="19" y1="38" x2="45" y2="38" />
        <line x1="19.7" y1="46" x2="44.3" y2="46" />
      </g>
      <ellipse cx="32" cy="14" rx="16" ry="4" fill="#c9ced4" stroke="#5c636b" />
    </svg>
  );
}

function HDIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="hdG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f4f6" />
          <stop offset="0.5" stopColor="#c3c9cf" />
          <stop offset="1" stopColor="#9aa2aa" />
        </linearGradient>
      </defs>
      <rect x="6" y="18" width="52" height="28" rx="6" fill="url(#hdG)" stroke="#6a727a" />
      <rect x="6" y="30" width="52" height="16" rx="6" fill="#89929b" opacity="0.35" />
      <circle cx="14" cy="38" r="2" fill="#4bd24b" stroke="#2a7a2a" />
      <ellipse cx="32" cy="23" rx="24" ry="4" fill="#fff" opacity="0.5" />
    </svg>
  );
}

function IPodIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="ipG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fdfdfd" />
          <stop offset="0.5" stopColor="#e9eaec" />
          <stop offset="1" stopColor="#c9ccd0" />
        </linearGradient>
      </defs>
      <rect x="16" y="4" width="32" height="56" rx="7" fill="url(#ipG)" stroke="#8f959b" />
      <rect x="21" y="10" width="22" height="16" rx="2" fill="#c8d6de" stroke="#8f959b" />
      <circle cx="32" cy="44" r="11" fill="#f4f5f6" stroke="#b0b5ba" />
      <circle cx="32" cy="44" r="4" fill="#dfe2e5" stroke="#b0b5ba" />
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

const PLACEHOLDERS: Record<IconId, (p: P) => JSX.Element> = {
  finder: FinderIcon,
  dashboard: DashboardIcon,
  ichat: IChatIcon,
  ie: IEIcon,
  textedit: TextEditIcon,
  appletstore: AppletStoreIcon,
  trash: TrashIcon,
  hd: HDIcon,
  ipod: IPodIcon,
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
