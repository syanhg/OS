import { AppIcon } from "../components/AppIcon";
import type { OpenApp } from "../types";

export function AboutMac(_: { openApp: OpenApp }) {
  return (
    <div className="about-mac">
      <AppIcon id="osx" className="about-logo" />
      <h1>Mac OS X</h1>
      <div className="ver">Version 10.4 “aquaOS”</div>
      <div className="spec">
        <b>Processor</b> 1.42 GHz PowerPC G4
      </div>
      <div className="spec">
        <b>Memory</b> 512 MB DDR SDRAM
      </div>
      <button className="aqua-btn">Software Update…</button>
    </div>
  );
}
