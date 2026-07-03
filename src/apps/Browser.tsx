import { useState } from "react";
import type { OpenApp } from "../types";

/*
 * A working browser: pages load in an iframe through the Wayback
 * Machine pinned to mid-2002, so the web looks the way it did when
 * Aqua did. (Modern sites block iframe embedding; archive.org's
 * "if_" replay mode doesn't, and serves pages without its toolbar.)
 */

const HOME = "http://www.apple.com/";

const wayback = (url: string) => `https://web.archive.org/web/20020615if_/${url}`;

function normalize(input: string): string {
  let u = input.trim();
  if (!u) return HOME;
  if (!/^https?:\/\//i.test(u)) u = "http://" + u;
  return u;
}

export function Browser(_: { openApp: OpenApp }) {
  const [history, setHistory] = useState<string[]>([HOME]);
  const [index, setIndex] = useState(0);
  const [address, setAddress] = useState(HOME);
  const [loading, setLoading] = useState(true);
  const current = history[index];

  const go = (url: string) => {
    const u = normalize(url);
    const next = [...history.slice(0, index + 1), u];
    setHistory(next);
    setIndex(next.length - 1);
    setAddress(u);
    setLoading(true);
  };

  const jump = (i: number) => {
    setIndex(i);
    setAddress(history[i]);
    setLoading(true);
  };

  return (
    <div className="browser">
      <div className="browser-toolbar">
        <div className="finder-nav">
          <button disabled={index === 0} onClick={() => jump(index - 1)}>
            ◀
          </button>
          <button
            disabled={index >= history.length - 1}
            onClick={() => jump(index + 1)}
          >
            ▶
          </button>
        </div>
        <input
          className="browser-address"
          value={address}
          spellCheck={false}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go(address)}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="browser-page">
        <iframe
          key={`${index}-${current}`}
          className="browser-frame"
          src={wayback(current)}
          title="Browser"
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => setLoading(false)}
        />
        {loading && (
          <div className="browser-loading">
            Contacting “{current.replace(/^https?:\/\//, "")}” — loading the
            June 2002 web via the Wayback Machine…
          </div>
        )}
      </div>
    </div>
  );
}
