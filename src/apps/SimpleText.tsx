import { useState } from "react";
import type { OpenApp } from "../types";

const DEFAULT_DOC =
  "Welcome to aquaOS. This document is editable — click and start typing.";

/* the Finder sets this before opening SimpleText on a document */
let pendingDoc: string | null = null;

export function setSimpleTextDoc(text: string) {
  pendingDoc = text;
}

export function SimpleText(_: { openApp: OpenApp }) {
  const [initial] = useState(() => {
    const t = pendingDoc ?? DEFAULT_DOC;
    pendingDoc = null;
    return t;
  });
  return (
    <div className="textedit">
      <div className="textedit-ruler" />
      <div
        className="textedit-area"
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
      >
        {initial}
      </div>
    </div>
  );
}
