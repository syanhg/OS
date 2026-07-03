import { useOS, WALLPAPERS } from "../os-context";
import type { OpenApp } from "../types";

export function SystemPrefs(_: { openApp: OpenApp }) {
  const os = useOS();
  return (
    <div className="sysprefs">
      <div className="sp-section">
        <div className="sp-heading">Desktop Background</div>
        <div className="sp-swatches">
          {Object.entries(WALLPAPERS).map(([key, w]) => (
            <div
              key={key}
              className={"sp-swatch" + (os.wallpaper === key ? " active" : "")}
              onClick={() => os.setWallpaper(key)}
            >
              <div className="sp-swatch-fill" style={{ background: w.css }} />
              <span>{w.name}</span>
            </div>
          ))}
        </div>
        <p className="sp-note">
          Drop a <code>wallpaper.jpg</code> into <code>public/</code> to use a photo instead.
        </p>
      </div>
      <div className="sp-section">
        <div className="sp-heading">Sound</div>
        <div className="sp-volume">
          <span>Output volume:</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={os.volume}
            onChange={(e) => os.setVolume(Number(e.target.value))}
          />
          <span className="sp-vol-pct">{Math.round(os.volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
