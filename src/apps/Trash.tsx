import { AppIcon } from "../components/AppIcon";
import { useOS } from "../os-context";
import type { OpenApp } from "../types";

export function Trash(_: { openApp: OpenApp }) {
  const os = useOS();
  if (os.trash.length === 0) {
    return (
      <div className="empty-state">
        <AppIcon id="trash" className="es-icon" />
        <div>The Trash is empty.</div>
      </div>
    );
  }
  return (
    <div className="finder" style={{ background: "#fff" }}>
      <div className="finder-files" style={{ flex: 1 }}>
        {os.trash.map((t) => (
          <div key={t.id} className="finder-file">
            <AppIcon id={t.icon} className="ff-icon" />
            <span className="ff-label">{t.label}</span>
          </div>
        ))}
      </div>
      <div className="finder-status" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>
          {os.trash.length} item{os.trash.length > 1 ? "s" : ""}
        </span>
        <button
          className="aqua-btn"
          style={{ fontSize: 11, padding: "1px 12px 2px" }}
          onClick={() => os.emptyTrash()}
        >
          Empty Trash
        </button>
      </div>
    </div>
  );
}
