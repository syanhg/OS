import { AppIcon } from "../components/AppIcon";
import type { OpenApp } from "../types";

export function Trash(_: { openApp: OpenApp }) {
  return (
    <div className="empty-state">
      <AppIcon id="trash" className="es-icon" />
      <div>The Trash is empty.</div>
    </div>
  );
}
