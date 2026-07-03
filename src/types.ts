/* Shared types for the aquaOS window manager and app registry. */

export type IconId = string;

export type AppId =
  | "finder"
  | "mail"
  | "browser"
  | "simpletext"
  | "quicktime"
  | "appletstore"
  | "trash"
  | "about"
  | "sysprefs";

export type OpenApp = (app: AppId) => void;

export interface AppDef {
  id: AppId;
  name: string;
  icon: IconId;
  metal?: boolean;
  w: number;
  h: number;
  component: (props: { openApp: OpenApp }) => JSX.Element;
}

export interface WinState {
  key: number;
  app: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
}
