import { AppIcon } from "../components/AppIcon";
import { ICON_COLLECTION } from "../data/icon-manifest";
import type { OpenApp } from "../types";

export function AppletStore(_: { openApp: OpenApp }) {
  return (
    <div className="applet-store">
      <div className="store-hero">
        <div style={{ width: 56, height: 56 }}>
          <AppIcon id="appletstore" />
        </div>
        <h1>Applet Store</h1>
        <p>
          Featuring the World of Aqua collection — {ICON_COLLECTION.length} hand-polished
          icons, delivered over a 56k modem near you.
        </p>
        <button className="aqua-btn olive">Download</button>
      </div>
      <div className="store-grid">
        {ICON_COLLECTION.map((a) => (
          <div className="store-card" key={a.id}>
            <AppIcon id={a.id} className="sc-icon" />
            <div className="sc-name">{a.name}</div>
            <button className="aqua-btn">Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}
