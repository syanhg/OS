import type { OpenApp } from "../types";

export function SimpleText(_: { openApp: OpenApp }) {
  return (
    <div className="textedit">
      <div className="textedit-ruler" />
      <div
        className="textedit-area"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
      >
        Welcome to aquaOS. This document is editable — click and start typing.
      </div>
    </div>
  );
}
