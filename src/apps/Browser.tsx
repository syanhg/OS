import { AppIcon } from "../components/AppIcon";
import type { OpenApp } from "../types";

export function Browser({ openApp }: { openApp: OpenApp }) {
  return (
    <div className="browser">
      <div className="browser-toolbar">
        <div className="finder-nav">
          <button>◀</button>
          <button>▶</button>
        </div>
        <input
          className="browser-address"
          defaultValue="http://www.apple.com/"
          spellCheck={false}
        />
      </div>
      <div className="browser-page">
        <div style={{ padding: "40px 30px", textAlign: "center" }}>
          <div style={{ width: 72, margin: "0 auto 16px" }}>
            <AppIcon id="internet" />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Welcome to the Internet.</h1>
          <p style={{ color: "#667", fontSize: 13, marginBottom: 20 }}>
            It is the year 2000-something. Pages load one image at a time.
          </p>
          <button className="aqua-btn blue" onClick={() => openApp("appletstore")}>
            Visit the Applet Store
          </button>
        </div>
      </div>
    </div>
  );
}
