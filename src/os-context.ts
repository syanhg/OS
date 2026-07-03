import { createContext, useContext } from "react";
import type { AppId } from "./types";

/* Shared OS services: any component (menu bar, dock, apps) can reach
   system state without prop drilling. Desktop provides the value. */

export interface TrashItem {
  id: string;
  label: string;
  icon: string;
}

export interface CtxItem {
  label: string;
  action?: () => void;
  disabled?: boolean;
  sep?: boolean;
}

export type PowerMode = "sleep" | "restart" | "shutdown";

export interface WindowInfo {
  key: number;
  title: string;
  minimized: boolean;
  active: boolean;
}

export interface OS {
  openApp: (app: AppId) => void;
  quitApp: (app: AppId) => void;
  closeActiveWindow: () => void;
  minimizeActiveWindow: () => void;
  zoomActiveWindow: () => void;
  hasActiveWindow: boolean;
  activeApp: AppId | null;
  windows: WindowInfo[];
  selectWindow: (key: number) => void;
  newFolder: () => void;
  volume: number;
  setVolume: (v: number) => void;
  wallpaper: string;
  setWallpaper: (w: string) => void;
  trash: TrashItem[];
  emptyTrash: () => void;
  power: (mode: PowerMode) => void;
  showContextMenu: (x: number, y: number, items: CtxItem[]) => void;
}

export const OSContext = createContext<OS>(null as unknown as OS);
export const useOS = () => useContext(OSContext);

export const WALLPAPERS: Record<string, { name: string; css: string }> = {
  aqua: {
    name: "Aqua Blue",
    css: "radial-gradient(ellipse 120% 90% at 30% 10%, #a8c8e8 0%, #6f9fce 40%, #33629c 100%)",
  },
  graphite: {
    name: "Graphite",
    css: "radial-gradient(ellipse 120% 90% at 30% 10%, #c8ccd2 0%, #8d939c 45%, #4e545e 100%)",
  },
  jaguar: {
    name: "Jaguar",
    css: "radial-gradient(ellipse 130% 100% at 25% 0%, #cdb8e8 0%, #8a6fc0 45%, #43307a 100%)",
  },
  sage: {
    name: "Sage",
    css: "radial-gradient(ellipse 120% 90% at 30% 10%, #d6e3c0 0%, #94b378 45%, #4c6b3c 100%)",
  },
};
