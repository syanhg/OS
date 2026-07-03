import type { AppDef, AppId } from "../types";
import { Finder } from "./Finder";
import { Mail } from "./Mail";
import { Browser } from "./Browser";
import { SimpleText } from "./SimpleText";
import { QuickTime } from "./QuickTime";
import { AppletStore } from "./AppletStore";
import { Trash } from "./Trash";
import { AboutMac } from "./AboutMac";

export const APPS: Record<AppId, AppDef> = {
  finder: { id: "finder", name: "Finder", icon: "finder", metal: true, w: 640, h: 420, component: Finder },
  mail: { id: "mail", name: "Mail", icon: "mail", metal: true, w: 440, h: 400, component: Mail },
  browser: { id: "browser", name: "Browser", icon: "browser", w: 560, h: 420, component: Browser },
  simpletext: { id: "simpletext", name: "SimpleText", icon: "simpletext", w: 480, h: 380, component: SimpleText },
  quicktime: { id: "quicktime", name: "QuickTime Player", icon: "quicktime", metal: true, w: 420, h: 340, component: QuickTime },
  appletstore: { id: "appletstore", name: "Applet Store", icon: "appletstore", metal: true, w: 620, h: 480, component: AppletStore },
  trash: { id: "trash", name: "Trash", icon: "trash", metal: true, w: 420, h: 300, component: Trash },
  about: { id: "about", name: "About This Mac", icon: "osx", w: 300, h: 330, component: AboutMac },
};
