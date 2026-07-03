import { useState } from "react";
import { AppIcon } from "../components/AppIcon";
import type { OpenApp } from "../types";

export function QuickTime(_: { openApp: OpenApp }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="qt">
      <div className="qt-screen">
        <AppIcon id="quicktime" className="qt-logo" />
        <div className="qt-title">Sample Movie.mov</div>
      </div>
      <div className="qt-controls">
        <button className="qt-play" onClick={() => setPlaying(!playing)}>
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="qt-track">
          <div className="qt-progress" style={{ width: playing ? "38%" : "0%" }} />
        </div>
        <span className="qt-time">{playing ? "0:07" : "0:00"} / 0:19</span>
      </div>
    </div>
  );
}
