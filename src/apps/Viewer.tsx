import { useState } from "react";
import { AppIcon } from "../components/AppIcon";
import type { IconId, OpenApp } from "../types";

/* the Finder sets this before opening PictureViewer on an image */
let pending: { image: IconId; name: string } = {
  image: "g4-cube",
  name: "G4 Cube.jpg",
};

export function setViewerImage(image: IconId, name: string) {
  pending = { image, name };
}

export function Viewer(_: { openApp: OpenApp }) {
  const [{ image, name }] = useState(pending);
  return (
    <div className="viewer">
      <div className="viewer-stage">
        <AppIcon id={image} className="viewer-img" />
      </div>
      <div className="viewer-caption">{name}</div>
    </div>
  );
}
